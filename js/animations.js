/**
 * CrowdSense AI - Animations Module
 * Handles fade-in, counter, ripple and intersection-based animations
 */

const Animations = (() => {

    /**
     * Animate a number counter from 0 to a target value
     * @param {HTMLElement} el - The element to animate
     * @param {number} target - Target value
     * @param {number} duration - Animation duration in ms
     * @param {string} suffix - Optional suffix text
     */
    function animateCounter(el, target, duration = 1500, suffix = '') {
        const isNumber = typeof target === 'number';
        if (!isNumber) {
            el.textContent = target;
            return;
        }

        let start = 0;
        const startTime = performance.now();

        function step(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            el.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(step);
    }

    /**
     * Create ripple effect on button click
     * @param {Event} e - Click event
     */
    function createRipple(e) {
        const button = e.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        const rect = button.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.style.position = 'absolute';
        circle.style.borderRadius = '50%';
        circle.style.background = 'rgba(255,255,255,0.15)';
        circle.style.transform = 'scale(0)';
        circle.style.animation = 'ripple 0.6s linear';
        circle.style.pointerEvents = 'none';

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(circle);

        circle.addEventListener('animationend', () => circle.remove());
    }

    /**
     * Initialize Intersection Observer for fade-in-up on scroll
     */
    function initScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in-up');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    /**
     * Add stagger delay classes to a set of elements
     * @param {string} selector - CSS selector for elements
     */
    function staggerElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, i) => {
            el.style.animationDelay = `${i * 0.1}s`;
            el.style.opacity = '0';
        });
    }

    /**
     * Attach ripple effect to all buttons with [data-ripple]
     */
    function initRippleButtons() {
        document.querySelectorAll('[data-ripple]').forEach((btn) => {
            btn.addEventListener('click', createRipple);
        });
    }

    return {
        animateCounter,
        createRipple,
        initScrollAnimations,
        staggerElements,
        initRippleButtons
    };

})();
