import './core/main.scss';

const PARTICLE_COLORS = [
	'rgba(107, 33, 168, 0.75)',
	'rgba(245, 158, 11, 0.65)',
	'rgba(156, 163, 175, 0.45)',
];

const FEED_ITEMS = [
	{ name: 'tramamestra', initials: 'TM', action: 'Mapa de Nexus atualizado com nova regiao costeira.', time: '2m' },
	{ name: 'campanela', initials: 'CP', action: 'PNJ Lord Vaerin adicionado com segredos politicos.', time: '12m' },
	{ name: 'ragnorpg', initials: 'RP', action: 'Combate na Toca dos Trolls finalizado sem TPK.', time: '37m' },
	{ name: 'tramamestra', initials: 'TM', action: 'Novo arco iniciado: Conspiracao do Trono de Ferro.', time: '1h' },
	{ name: 'campanela', initials: 'CP', action: 'Sessao #14 registrada com resumo automatico.', time: '1d' },
];

function createParticles(baseCount = 16) {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return;
	}

	const count = window.matchMedia('(max-width: 768px)').matches ? Math.max(8, Math.floor(baseCount / 2)) : baseCount;
	const fragment = document.createDocumentFragment();

	for (let i = 0; i < count; i += 1) {
		const particle = document.createElement('span');
		const size = Math.random() * 3 + 1;
		const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

		particle.className = 'site-particle';
		particle.style.width = `${size}px`;
		particle.style.height = `${size}px`;
		particle.style.left = `${Math.random() * 100}vw`;
		particle.style.backgroundColor = color;
		particle.style.animationDuration = `${Math.random() * 14 + 10}s`;
		particle.style.animationDelay = `${Math.random() * 8}s`;

		fragment.appendChild(particle);
	}

	document.body.appendChild(fragment);
}

function createFeedItemElement(item) {
	const article = document.createElement('article');
	article.className = 'campaign-feed__item';

	const avatar = document.createElement('span');
	avatar.className = 'campaign-feed__avatar';
	avatar.textContent = item.initials;

	const content = document.createElement('div');

	const name = document.createElement('p');
	name.className = 'campaign-feed__name';
	name.textContent = item.name;

	const action = document.createElement('p');
	action.className = 'campaign-feed__action';
	action.textContent = item.action;

	content.append(name, action);

	const time = document.createElement('span');
	time.className = 'campaign-feed__time';
	time.textContent = item.time;

	article.append(avatar, content, time);

	return article;
}

function renderCampaignFeed() {
	const feedList = document.querySelector('.js-feed-list');

	if (!feedList) {
		return;
	}

	feedList.innerHTML = '';
	FEED_ITEMS.forEach((item) => {
		feedList.appendChild(createFeedItemElement(item));
	});
}

function setupCampaignFeedComposer() {
	const form = document.querySelector('.js-feed-form');
	const input = document.querySelector('.js-feed-input');

	if (!form || !input) {
		return;
	}

	form.addEventListener('submit', (event) => {
		event.preventDefault();

		const eventDescription = input.value.trim();

		if (!eventDescription) {
			input.focus();
			return;
		}

		FEED_ITEMS.unshift({
			name: 'sua-mesa',
			initials: 'SM',
			action: eventDescription,
			time: 'agora',
		});

		if (FEED_ITEMS.length > 12) {
			FEED_ITEMS.pop();
		}

		renderCampaignFeed();
		form.reset();
		input.focus();
	});
}

function setupDiceInteraction() {
	const diceButtons = document.querySelectorAll('.js-dice');
	const resultElement = document.querySelector('.js-dice-result');

	if (!diceButtons.length || !resultElement) {
		return;
	}

	diceButtons.forEach((diceButton) => {
		diceButton.addEventListener('click', () => {
			if (diceButton.classList.contains('is-rolling')) {
				return;
			}

			const sides = Number(diceButton.dataset.sides);
			const shape = diceButton.querySelector('.hero__dice-shape');

			if (!shape || Number.isNaN(sides) || sides < 2) {
				return;
			}

			diceButton.classList.remove('is-critical', 'is-fumble');
			diceButton.classList.add('is-rolling');

			let frameCount = 0;
			const rollingInterval = window.setInterval(() => {
				shape.textContent = String(Math.floor(Math.random() * sides) + 1);
				frameCount += 1;

				if (frameCount < 9) {
					return;
				}

				window.clearInterval(rollingInterval);

				const finalRoll = Math.floor(Math.random() * sides) + 1;
				shape.textContent = String(finalRoll);
				diceButton.classList.remove('is-rolling');

				if (finalRoll === sides) {
					diceButton.classList.add('is-critical');
				}

				if (finalRoll === 1) {
					diceButton.classList.add('is-fumble');
				}

				let rollMessage = `D${sides} rolou ${finalRoll}.`;

				if (finalRoll === sides) {
					rollMessage += ' Acerto critico!';
				} else if (finalRoll === 1) {
					rollMessage += ' Falha critica...';
				}

				resultElement.textContent = rollMessage;
			}, 62);
		});
	});
}

function setupReveal() {
	const revealElements = document.querySelectorAll('.reveal');

	if (!revealElements.length) {
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.12 },
	);

	revealElements.forEach((element) => observer.observe(element));
}

createParticles();
renderCampaignFeed();
setupCampaignFeedComposer();
setupDiceInteraction();
setupReveal();