/**
 * CrowdSense AI — Landing Page Controller
 * Handles: Navbar scroll, animated counters, capacity bar, mobile nav
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── Navbar Scroll Effect ─── */
    const nav = document.getElementById('landing-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    /* ─── Mobile Nav Toggle ─── */
    const toggle = document.getElementById('mobile-nav-toggle');
    const links = document.getElementById('nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    /* ─── Smooth Scroll ─── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ─── Animated Counters on Scroll ─── */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.counter);
                if (!isNaN(target)) {
                    Common.animateCounter(el, target, 2000);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('[data-counter]').forEach(el => {
        counterObserver.observe(el);
    });

    /* ─── Hero Capacity Bar Animation ─── */
    const capacityBar = document.getElementById('hero-capacity-bar');
    if (capacityBar) {
        setTimeout(() => {
            capacityBar.style.width = '72%';
        }, 800);
    }

    /* ─── Scroll Animations ─── */
    Common.initScrollAnimations();
    Common.initRipple();
});
