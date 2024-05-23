"use strict";

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const animatedPath = document.querySelector("#animated-svg path animate");
			animatedPath.beginElement();
		}
	});
});

const animatedSvg = document.querySelector("#animated-svg");
observer.observe(animatedSvg);

let screen, stars, params = {
	speed: .2,
	number: 900,
	extinction: .8
};
let scrollTimer = null;
let lastScrollTime = 0;
let lastScrollPosition = 0;
let isScrolling = false;
let canvas = null;
let ctx = null;
let timer = null;
window.onload = function() {
	setTimeout(() => {
		document.querySelector(".hyper").style.zIndex = 1;
		decreaseOpacity(1, 1);
		incrementOpacity(0, 1);
		setTimeout(() => {
			document.querySelector(".preloader").style.display = "none";
			document.querySelector(".hyper").classList.remove("stop");
		}, 200);
	}, 150);
}
document.addEventListener("DOMContentLoaded", () => {
	canvas = document.querySelector(".hyper");
	ctx = canvas.getContext("2d");
	setupStars();
	updateStars();
});
window.addEventListener('scroll', function() {
	clearTimeout(scrollTimer);
	clearTimeout(timer);
	const currentTime = new Date().getTime();
	const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
	const timeDiff = currentTime - lastScrollTime;
	const scrollDiff = Math.abs(currentScrollPosition - lastScrollPosition);
	const scrollSpeed = scrollDiff / timeDiff;
	if (scrollDiff > 50) {
		params.speed = Math.abs(Math.max(Math.min(16, scrollSpeed), .2) - params.speed) >= 0.2 ? Math.max(Math.min(16, scrollSpeed), .2) : params.speed;
		params.extinction = Math.abs(Math.min(Math.max(.8, scrollSpeed), 3) - params.extinction) >= 0.2 ? Math.min(Math.max(.8, scrollSpeed), 3) : params.extinction;
	}
	isScrolling = !isScrolling;
	lastScrollTime = currentTime;
	lastScrollPosition = currentScrollPosition;
	scrollTimer = setTimeout(function() {
		isScrolling = false;
		params.speed = .2;
		decreaseValue(params.extinction, 5);
	}, 100);
});
window.addEventListener('resize', setupStars);

function Star() {
	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;
	this.z = Math.random() * canvas.width;
	this.move = function() {
		this.z -= params.speed;
		if (this.z <= 0)
			this.z = canvas.width;
	};
	this.show = function() {
		let x, y, rad, opacity;
		x = (this.x - screen.c[0]) * (canvas.width / this.z);
		x = x + screen.c[0];
		y = (this.y - screen.c[1]) * (canvas.width / this.z);
		y = y + screen.c[1];
		rad = canvas.width / this.z;
		opacity = (rad > params.extinction) ? 1.5 * (2 - rad / params.extinction) : 1;
		ctx.beginPath();
		ctx.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
		ctx.arc(x, y, rad, 0, Math.PI * 2);
		ctx.fill();
	}
}

function setupStars() {
	screen = {
		w: window.innerWidth,
		h: window.innerHeight,
		c: [window.innerWidth * 0.5, window.innerHeight * 0.5]
	};
	window.cancelAnimationFrame(updateStars);
	canvas.width = screen.w;
	canvas.height = screen.h;
	stars = [];
	for (let i = 0; i < params.number; i++)
		stars[i] = new Star();
}

const ref = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateStars() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	stars.forEach(function(s) {
		s.show();
		s.move();
	});
	if(ref) return;
	window.requestAnimationFrame(updateStars);
}
async function decreaseValue(value, delay) {
	for (let i = value; i >= .8; i = i - .01) {
		params.extinction = i;
		await new Promise(resolve => timer = setTimeout(resolve, delay));
	}
}
async function decreaseOpacity(value, delay) {
	for (let i = value; i >= 0; i = i - .025) {
		document.querySelector(".preloader").style.opacity = i;
		await new Promise(resolve => timer = setTimeout(resolve, delay));
	}
}

function incrementOpacity(value, delay) {
	return new Promise(resolve => {
		let i = value;

		function animate() {
			document.querySelector(".body").style.opacity = i;
			i += .025;
			if (i <= 1) setTimeout(animate, delay);
			else resolve();
		}
		animate();
	});
}