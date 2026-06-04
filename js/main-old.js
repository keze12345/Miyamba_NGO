// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 300);
});

// ===== HAMBURGER MENU =====
document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
    });
});

// ===== STATS COUNTER ANIMATION =====
function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = +counter.dataset.target;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            counter.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

// Only animate counters when stats section is visible
const statsSection = document.getElementById('stats');
let countersAnimated = false;
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
    }
}, { threshold: 0.3 });
if (statsSection) observer.observe(statsSection);

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const success = document.getElementById('formSuccess');
    success.style.display = 'block';
    e.target.reset();
    setTimeout(() => { success.style.display = 'none'; }, 5000);
});

// ===== FADE IN ON SCROLL =====
const fadeItems = document.querySelectorAll('.card, .involved-card, .gallery-item, .stat-item');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

fadeItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fadeObserver.observe(item);
});