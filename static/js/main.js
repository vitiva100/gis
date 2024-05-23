"use strict";

const userAgent = navigator.userAgent.toLowerCase();
const isMobile = /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
const pref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let tar = 0;
var json = {
    title: ['Базовый', 'Продвинутый', 'Базовый'],
    imgSrc: ['tar1', 'tar2', 'tar1'],
    description: ['Готовая платформа на основе ранее созданных без добавления дополнительных функций на программном уровне по желанию заказчика.', 
    'Платформа на основе ранее созданных с добавлением или изменением базовых функций на программном уровне по желанию заказчика.',
    'Готовая платформа на основе ранее созданных без добавления дополнительных функций на программном уровне по желанию заказчика.']
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

function changeSpanContent(){
    let spanElement = document.querySelector("#ap");
    spanElement.textContent = window.innerWidth < 340 ? 
        `ООО "АПЕЙРО"` :
        `Общество с ограниченной ответственностью "АПЕЙРО"`;
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
window.addEventListener('resize', changeSpanContent);

let lastResFind;
updateSearch();
changeSpanContent();
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
        tar = tar < 2 ? tar + 1 : 1;
        animateItem("slideOut");
    });
    document.querySelector('.prev').addEventListener('click', () => {
        tar = tar > 0 ? tar - 1 : 1; 
        animateItem("slideIn", true);
    });
}

function download(){
    var link = document.createElement("a");
    link.setAttribute('download', "Apeiro_pricelist.pdf");
    link.href = "./static/pricelist.pdf";
    link.style.opacity = "0";
    link.style.position = "absolute";
    document.body.appendChild(link);
    link.click();
    link.remove();
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

function preloadImages(images){
    return new Promise((resolve, reject) => {
        let loadedImages = 0;
        for (let i = 0; i < images.length; i++) {
            let img = new Image();
            img.onload = () => {
                loadedImages++;
                if (loadedImages === images.length) {
                    resolve();
                    console.log("[preloadImages] Ready")
                }
            };
            img.onerror = (errorMessage) => {
                console.warn(`[preloadImages] Failed to load image: ${images[i]}`);
                reject(errorMessage);
            };
            img.src = images[i];
        }
    });
}

async function testWebP(){
    const elem = document.body;
    const webP = new Image();
    let flag = false;
    await new Promise((resolve, reject) => {
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        webP.onload = function() {
            flag = true;
            resolve();
        };
        webP.onerror = reject;
    });
    const imagesToPreload = [
        `/static/images/tar1.${flag ? "webp" : "png"}`,
        `/static/images/tar2.${flag ? "webp" : "png"}`
    ];
    console.log(`[webpStatus]: ${flag}`);
    await preloadImages(imagesToPreload);
}

isMobile && window.removeEventListener('resize', setupStars);

document.addEventListener("DOMContentLoaded", testWebP);