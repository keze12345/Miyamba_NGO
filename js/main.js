// ===== LOADER =====
const loader = document.getElementById('loader');
function hideLoader() {
  if (loader) loader.classList.add('hidden');
}
window.addEventListener('load', () => setTimeout(hideLoader, 600));
document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 1800));
setTimeout(hideLoader, 3500);

// ===== ANNOUNCE BAR =====
document.getElementById('closeAnnounce').addEventListener('click', () => {
  document.querySelector('.announce-bar').classList.add('closed');
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  navbar.classList.toggle('elevated', s > 60);
  document.getElementById('btt').classList.toggle('show', s > 400);
  lastScroll = s;
});

// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open');
  navMenu.classList.remove('open');
}));

// ===== HERO SLIDESHOW =====
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let current = 0, slideTimer;

function goToSlide(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}
function startSlider() { slideTimer = setInterval(() => goToSlide(current + 1), 5000); }
function resetSlider() { clearInterval(slideTimer); startSlider(); }

document.getElementById('nextSlide').addEventListener('click', () => { goToSlide(current + 1); resetSlider(); });
document.getElementById('prevSlide').addEventListener('click', () => { goToSlide(current - 1); resetSlider(); });
dots.forEach((d, i) => d.addEventListener('click', () => { goToSlide(i); resetSlider(); }));
startSlider();

// ===== IMPACT COUNTERS =====
let countersRun = false;
function runCounters() {
  document.querySelectorAll('.count').forEach(el => {
    const target = +el.dataset.target;
    const duration = 2200;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
  document.querySelectorAll('.ic-fill').forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => { bar.style.width = w; }, 200);
  });
}

const impactObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersRun) { countersRun = true; runCounters(); }
}, { threshold: 0.3 });
const impactSec = document.getElementById('impact');
if (impactSec) impactObs.observe(impactSec);

// ===== GALLERY LIGHTBOX =====
const items = Array.from(document.querySelectorAll('.gm-item'));
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCaption');
let lbIndex = 0;

function openLb(i) {
  lbIndex = i;
  lbImg.src = items[i].querySelector('img').src;
  lbCap.textContent = items[i].dataset.caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function navLb(dir) { openLb((lbIndex + dir + items.length) % items.length); }

items.forEach((item, i) => item.addEventListener('click', () => openLb(i)));
document.getElementById('lbClose').addEventListener('click', closeLb);
document.getElementById('lbPrev').addEventListener('click', () => navLb(-1));
document.getElementById('lbNext').addEventListener('click', () => navLb(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') navLb(-1);
  if (e.key === 'ArrowRight') navLb(1);
});

// ===== CONTACT FORM =====
document.getElementById('cform').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.btn-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const body = new URLSearchParams(new FormData(form)).toString();
    if (location.protocol !== 'file:') {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
    }
    document.getElementById('cformSuccess').innerHTML =
      '<i class="fas fa-circle-check"></i> Thank you! We will respond from wmbu@miyamba.org.';
    document.getElementById('cformSuccess').classList.add('show');
    form.reset();
  } catch (err) {
    document.getElementById('cformSuccess').innerHTML =
      '<i class="fas fa-envelope"></i> Please email us directly at wmbu@miyamba.org.';
    document.getElementById('cformSuccess').classList.add('show');
  } finally {
    btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    btn.disabled = false;
    setTimeout(() => document.getElementById('cformSuccess').classList.remove('show'), 6000);
  }
});

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.prog-card, .inv-card, .impact-card, .pillar, .tier, .about-pillars .pillar').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  revealObs.observe(el);
});
