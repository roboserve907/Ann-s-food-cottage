const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.site-nav a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const filters = document.querySelectorAll('.filter');
const dishes = document.querySelectorAll('.dish-card');
const menuGroups = document.querySelectorAll('.menu-group');
const menuItems = document.querySelectorAll('.menu-group li');
const menuSearch = document.querySelector('.menu-search');
const menuSearchInput = document.querySelector('#menu-search-input');
const menuEmpty = document.querySelector('.menu-empty');
let activeCategory = 'all';

function updateMenu() {
  const query = menuSearchInput.value.trim().toLowerCase();
  let visibleItems = 0;

  dishes.forEach((dish) => {
    const dishText = dish.textContent.toLowerCase();
    const matchesCategory = activeCategory === 'all' || dish.dataset.category === activeCategory;
    dish.classList.toggle('hidden', !matchesCategory || (query && !dishText.includes(query)));
  });

  menuItems.forEach((item) => {
    const group = item.closest('.menu-group');
    const matchesCategory = activeCategory === 'all' || group.dataset.menuCategory === activeCategory;
    const matchesQuery = !query || item.textContent.toLowerCase().includes(query) || item.dataset.search.includes(query);
    const isVisible = matchesCategory && matchesQuery;
    item.hidden = !isVisible;
    if (isVisible) visibleItems += 1;
  });

  menuGroups.forEach((group) => {
    group.hidden = !group.querySelector('li:not([hidden])');
  });
  menuEmpty.hidden = visibleItems > 0;
}

filters.forEach((filter) => filter.addEventListener('click', () => {
  activeCategory = filter.dataset.filter;
  filters.forEach((button) => {
    button.classList.toggle('active', button === filter);
    button.setAttribute('aria-selected', button === filter);
  });
  updateMenu();
}));

menuSearch.addEventListener('submit', (event) => {
  event.preventDefault();
  updateMenu();
});

menuSearchInput.addEventListener('input', updateMenu);

const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
const heroVisual = document.querySelector('.hero-visual');
let activeHeroSlide = 0;
let heroRotation;

function showHeroSlide(index) {
  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === activeHeroSlide));
  heroDots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === activeHeroSlide));
}

function startHeroRotation() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  clearInterval(heroRotation);
  heroRotation = setInterval(() => showHeroSlide(activeHeroSlide + 1), 3000);
}

heroDots.forEach((dot, index) => dot.addEventListener('click', () => {
  showHeroSlide(index);
  startHeroRotation();
}));

heroVisual.addEventListener('mouseenter', () => clearInterval(heroRotation));
heroVisual.addEventListener('mouseleave', startHeroRotation);
startHeroRotation();

document.querySelector('#year').textContent = new Date().getFullYear();

const enquiryForm = document.querySelector('#enquiry-form');
const formStatus = document.querySelector('.form-status');

enquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const details = new FormData(enquiryForm);
  const submitButton = enquiryForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';
  formStatus.textContent = '';

  fetch('https://formsubmit.co/ajax/annsfoodcottage@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: details.get('name'),
      phone: details.get('phone'),
      email: details.get('email') || 'Not provided',
      enquiry: details.get('topic'),
      message: details.get('message'),
      _subject: "New enquiry from Ann's Food Cottage website",
      _template: 'table',
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error('Unable to send enquiry');
      enquiryForm.reset();
      formStatus.textContent = 'Thank you — your enquiry has been sent to Ann’s Food Cottage.';
    })
    .catch(() => {
      formStatus.textContent = 'We could not send your enquiry. Please email annsfoodcottage@gmail.com directly.';
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send enquiry <span>↗</span>';
    });
});
