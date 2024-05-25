"use strict";

const userAgent = navigator.userAgent.toLowerCase();
const isMobile = /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let tar = 0;
var json = {
    title: ['Запуск', 'Перемещение', 'Многоугольник', 'Измерение', 'Расстояние', 'Перемещение', 'Высота', 'Центрирование', 'Ссылка', 'Запуск'],
    imgSrc: ['tar1', 'tar2', 'tar3', 'tar4', 'tar5', 'tar5', 'tar5', 'tar5', 'tar9', 'tar1'],
    description: ['При помощи селектора в левом нижнем углу переключитесь в режим просмотра снимков.', 
    '“Посетите” Зону 76, для этого введите в строке поиска координаты 37.401437, -116.86773.',
    'При помощи инструмента “Многоугольник” рассчитайте примерную площадь территории  внутри внешнего кольца дорог.',
    'Научитесь пользоваться инструментом “Измерение линий и углов” для того чтобы узнавать  направление дороги.',
    'Используйте этот инструмент для измерения расстояния до Елабуги.',
    'Отдалив карту, попробуйте перемещать ее вправо и влево. Какую особенность карты можно  отметить?',
    'При помощи слоя просмотра рельефа определите, какая из двух точек находится выше и насколько?',
    'Отцентрируйте карту, нажав ПКМ по любой точке и выбрав пункт “Центрировать” в появившемся меню.',
    'Сохраните текущее состояние карты при помощи соответствующего инструмента.',
    'При помощи селектора в левом нижнем углу переключитесь в режим просмотра снимков.']
};

async function search(textToFind, lastResFind){
    event.preventDefault();
    const elements = document.querySelectorAll("span#search");
    elements.forEach((element) => {
        const match = element.textContent;
        const newTextNode = document.createTextNode(match);
        element.replaceWith(newTextNode);  
    });
    if(textToFind != ""){
        document.body.innerHTML = document.body.innerHTML.replace(new RegExp(textToFind, 'gi'), 
            (match) => {
                return `<span id='search'>${match}</span>`;
        });
        lastResFind = textToFind;
        canvas = document.querySelector(".hyper");
        ctx = canvas.getContext("2d");
        setupStars();
        updateStars();
        window.location = `#search`;
        updateSearch();
    }
}
function updateSearch(){
    document.querySelector('form').addEventListener('keydown', async function(e) {
        if(e.keyCode === 13) 
            await search(document.querySelector('.search__input').value.trim().toLowerCase(), lastResFind);
    });
}

function createCursor(){
    if(!isMobile && !pref){
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);
        let textElements = document.querySelectorAll(".textCur");
        textElements.forEach((element) => {
            element.addEventListener('mouseenter', () => {
                let elementUnderCursor = document.elementFromPoint(event.clientX, event.clientY);
                cursor.classList.add('text-cursor');
                elementUnderCursor.classList.contains("white-text") && cursor.classList.add("white-text-cursor");
            });
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('text-cursor');
                cursor.classList.remove('white-text-cursor');
            });
        });
    }
}
const handleLeave = () => {
    document.querySelector(".custom-cursor").remove();
};
const handleEnter = () => {
    document.querySelectorAll(".custom-cursor").length === 0 && createCursor();
};

if(!isMobile){
    document.body.addEventListener('mouseleave', handleLeave);
    document.body.addEventListener('mouseenter', handleEnter);
}

let lastResFind;
updateSearch();
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelectorAll(".custom-cursor");
    cursor.length === 0 && !pref && !isMobile && createCursor();
    try{
        if(!isMobile){
            cursor[0].style.left = (e.clientX - 15) + 'px';
            cursor[0].style.top = (e.clientY - 5) + 'px';
        }
    }catch(e){
        console.warn("[cursor] Not found");
    }
});

function listener(){
    document.querySelector('.next').addEventListener('click', () => {
        tar = tar < 9 ? tar + 1 : 1;
        animateItem("slideOut");
    });
    document.querySelector('.prev').addEventListener('click', () => {
        tar = tar > 0 ? tar - 1 : 1; 
        animateItem("slideIn", true);
    });
}

function download(){
    window.location.href = "https://maps.kosmosnimki.ru";
}

function animateItem(animation, reverse = false){
    const item = document.querySelector('#item');
    item.style.animation = `${animation} 0.5s ${reverse ? "reverse" : "forwards"}`;
    setTimeout(() => {
        item.style.opacity = "0";
    }, 450);
    setTimeout(() => {
        tarUpdate();
        item.style.animation = `${reverse ? "slideOut" : "slideIn"} 0.5s ${reverse ? "reverse" : "forwards"}`;
        item.style.opacity = "1";
    }, 500);
    setTimeout(() => {
        item.style.animation = "none";
    }, 1000);
}

function tarUpdate(){
    document.querySelector("#item").innerHTML = `
    <h1 class="textCur white-text">${json.title[tar]}</h1>
    <div></div>
    <picture>
        <source srcset="/static/images/${json.imgSrc[tar]}.webp" alt="Тариф" class="itemImg" height="200" width="200" type="image/webp">
        <source srcset="/static/images/${json.imgSrc[tar]}.png" alt="Тариф" class="itemImg" height="200" width="200" type="image/png"> 
        <img src="/static/images/${json.imgSrc[tar]}.png" alt="Тариф" class="itemImg">
    </picture>
    <div></div>
    <p class="textCur white-text">${json.description[tar]}</p>`;
}

!pref && !isMobile && createCursor();
listener();

isMobile && window.removeEventListener('resize', setupStars);
