/* ========== STAR FIELD CANVAS ========== */
function initStarField() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        const count = Math.floor((W * H) / 7000);
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.2,
                a: Math.random(),
                speed: 0.001 + Math.random() * 0.003,
                twinkleOffset: Math.random() * Math.PI * 2,
            });
        }
    }

    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        frame++;
        stars.forEach(s => {
            const twinkle = (Math.sin(frame * s.speed * 60 + s.twinkleOffset) + 1) / 2;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${s.a * (0.3 + 0.7 * twinkle)})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    resize();
    createStars();
    draw();
    window.addEventListener('resize', () => { resize(); createStars(); });
}

/* ========== NAV SCROLL ========== */
function initNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
}

/* ========== SCROLL ANIMATIONS ========== */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-up, .fade-in');
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
}

/* ========== CURSOR GLOW ========== */
function initCursorGlow() {
    const glow = document.createElement('div');
    glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(147,51,234,0.06) 0%, transparent 70%);
    transform: translate(-50%,-50%);
    transition: opacity 0.3s;
  `;
    document.body.appendChild(glow);

    window.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    }, { passive: true });
}

/* ========== SMOOTH NUMBER COUNTER ========== */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                const duration = 1500;
                const step = target / (duration / 16);
                let current = 0;
                const timer = setInterval(() => {
                    current = Math.min(current + step, target);
                    el.textContent = Math.floor(current) + suffix;
                    if (current >= target) clearInterval(timer);
                }, 16);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

/* ========== MOBILE NAV TOGGLE ========== */
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!hamburger || !mobileMenu) return;
    hamburger.addEventListener('click', () => {
        const open = mobileMenu.style.display === 'flex';
        mobileMenu.style.display = open ? 'none' : 'flex';
        hamburger.setAttribute('aria-expanded', !open);
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => { mobileMenu.style.display = 'none'; });
    });
}

/* ========== INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
    initStarField();
    initNav();
    initScrollAnimations();
    initCursorGlow();
    initCounters();
    initMobileNav();
});
