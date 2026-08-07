/**
 * CrowdSense AI — Common Utilities
 * Shared across all pages: toasts, clock, sidebar, page transitions, skeletons
 */

const Common = (() => {

    /* ─── Toast Notifications ─── */
    function showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            success: { icon: 'fa-check', bg: 'rgba(34,197,94,0.15)', color: '#22C55E' },
            error:   { icon: 'fa-times', bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
            warning: { icon: 'fa-exclamation', bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
            info:    { icon: 'fa-info', bg: 'rgba(37,99,235,0.15)', color: '#3B82F6' }
        };
        const cfg = icons[type] || icons.info;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast__icon" style="background:${cfg.bg};color:${cfg.color};">
                <i class="fas ${cfg.icon}"></i>
            </div>
            <span class="toast__message">${message}</span>
            <button class="toast__close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    /* ─── Sidebar Management ─── */
    function initSidebar() {
        const hamburger = document.getElementById('sidebar-hamburger');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (!hamburger || !sidebar || !overlay) return;

        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar--open');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('sidebar--open');
            overlay.classList.remove('active');
        });
    }

    /* ─── Live Clock ─── */
    function initClock() {
        function update() {
            const now = new Date();
            const timeEl = document.getElementById('navbar-time');
            const dateEl = document.getElementById('navbar-date');

            if (timeEl) {
                timeEl.textContent = now.toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                });
            }
            if (dateEl) {
                dateEl.textContent = now.toLocaleDateString('en-IN', {
                    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                });
            }
        }
        update();
        setInterval(update, 1000);
    }

    /* ─── Ripple Effect ─── */
    function initRipple() {
        document.querySelectorAll('[data-ripple]').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const circle = document.createElement('span');
                const d = Math.max(this.clientWidth, this.clientHeight);
                const r = d / 2;
                const rect = this.getBoundingClientRect();
                circle.style.cssText = `
                    width:${d}px;height:${d}px;
                    left:${e.clientX - rect.left - r}px;
                    top:${e.clientY - rect.top - r}px;
                    position:absolute;border-radius:50%;
                    background:rgba(255,255,255,0.15);
                    transform:scale(0);animation:ripple 0.6s linear;
                    pointer-events:none;
                `;
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(circle);
                circle.addEventListener('animationend', () => circle.remove());
            });
        });
    }

    /* ─── Scroll Animations ─── */
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    /* ─── Animated Counter ─── */
    function animateCounter(el, target, duration = 1500) {
        if (typeof target !== 'number') { el.textContent = target; return; }
        const startTime = performance.now();
        function step(timestamp) {
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(step);
    }

    /* ─── Tab Switching ─── */
    function initTabs(containerSelector, contentSelector) {
        const tabs = document.querySelectorAll(`${containerSelector} .tab-nav__item`);
        const contents = document.querySelectorAll(contentSelector);

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const target = this.dataset.tab;
                contents.forEach(c => {
                    c.style.display = c.dataset.content === target ? 'block' : 'none';
                });
            });
        });
    }

    /* ─── Filter Buttons ─── */
    function initFilterButtons(selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll(selector).forEach(b => b.classList.remove('alerts-panel__filter-btn--active'));
                this.classList.add('alerts-panel__filter-btn--active');
            });
        });
    }

    /* ─── Modal ─── */
    function showModal(icon, iconBg, iconColor, title, desc) {
        let overlay = document.querySelector('.modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal">
                    <div class="modal__icon"></div>
                    <h3 class="modal__title"></h3>
                    <p class="modal__desc"></p>
                    <button class="btn btn--primary" onclick="document.querySelector('.modal-overlay').classList.remove('active')">
                        Got it
                    </button>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        overlay.querySelector('.modal__icon').innerHTML = `<i class="fas ${icon}"></i>`;
        overlay.querySelector('.modal__icon').style.background = iconBg;
        overlay.querySelector('.modal__icon').style.color = iconColor;
        overlay.querySelector('.modal__title').textContent = title;
        overlay.querySelector('.modal__desc').textContent = desc;

        setTimeout(() => overlay.classList.add('active'), 10);
    }

    /* ─── Page Init Helper ─── */
    function initPage() {
        initSidebar();
        initClock();
        initRipple();
        initScrollAnimations();
    }

    return {
        showToast,
        initSidebar,
        initClock,
        initRipple,
        initScrollAnimations,
        animateCounter,
        initTabs,
        initFilterButtons,
        showModal,
        initPage
    };

})();
