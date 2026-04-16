import hero from './img/hero.png';

const heroImage = document.querySelector('.js-hero-image');
const aboutImage = document.querySelector('.js-about-image');

if (heroImage) {
	heroImage.src = hero;
}

if (aboutImage) {
	aboutImage.src = hero;
}