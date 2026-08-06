/**
 * CrowdSense AI - Dashboard Controller
 * Main entry point — renders all dashboard components and wires up interactions.
 * Depends on: data.js, animations.js, charts.js, map.js
 */

const Dashboard = (() => {

    /**
     * Bootstrap the dashboard
     */
    function init() {
        renderKPICards();
        renderAlerts();
        renderAIRecommendations();
        renderEvents();
        initSidebar();
        initNavbar();
        initClock();

        // Initialize sub-modules
        CrowdMap.init();
        Charts.init();

        // Animations
        Animations.initScrollAnimations();
        Animations.initRippleButtons();

        // Animate KPI counters after short delay
        setTimeout(animateKPICounters, 400);
    }

    /* ───────────────────────── KPI Cards ───────────────────────── */
    function renderKPICards() {
        const grid = document.getElementById('kpi-grid');
        if (!grid) return;

        grid.innerHTML = CrowdSenseData.kpiCards.map((card, i) => {
            const isNumeric = typeof card.value === 'number';
            const displayValue = isNumeric ? '0' : card.value;
            const changeDirClass = `kpi-card__change--${card.changeDir}`;
            const changeIcon = card.changeDir === 'up' ? 'fa-arrow-up' :
                               card.changeDir === 'down' ? 'fa-arrow-down' : '';

            return `
                <div class="kpi-card animate-fade-in-up" style="animation-delay: ${i * 0.1}s; --card-color: ${card.color};">
                    <div class="kpi-card__header">
                        <div class="kpi-card__icon" style="background: ${card.bgGradient}; color: ${card.color};">
                            <i class="fas ${card.icon}"></i>
                        </div>
                        <button class="kpi-card__menu" data-ripple>
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                    </div>
                    <div class="kpi-card__title">${card.title}</div>
                    <div class="kpi-card__value">
                        <span class="number" data-target="${card.value}" data-card-id="${card.id}" style="color: ${card.color};">${displayValue}</span>
                        ${card.suffix ? `<span class="unit">${card.suffix}</span>` : ''}
                    </div>
                    <div class="kpi-card__change ${changeDirClass}">
                        ${changeIcon ? `<i class="fas ${changeIcon}"></i>` : ''}
                        ${card.change}
                    </div>
                    <style>.kpi-card:nth-child(${i + 1})::before { background: ${card.color}; }</style>
                </div>
            `;
        }).join('');
    }

    /**
     * Trigger counter animations on KPI number elements
     */
    function animateKPICounters() {
        document.querySelectorAll('.kpi-card__value .number').forEach((el) => {
            const target = el.dataset.target;
            const num = parseFloat(target);
            if (!isNaN(num)) {
                Animations.animateCounter(el, num, 1800);
            }
        });
    }

    /* ───────────────────────── Alerts Table ───────────────────────── */
    function renderAlerts() {
        const tbody = document.getElementById('alerts-tbody');
        if (!tbody) return;

        tbody.innerHTML = CrowdSenseData.alerts.map((alert) => {
            const badgeClass = alert.risk === 'Critical' ? 'badge--critical' :
                               alert.risk === 'High' ? 'badge--danger' :
                               alert.risk === 'Medium' ? 'badge--warning' : 'badge--success';
            return `
                <tr>
                    <td class="td-time">${alert.time}</td>
                    <td class="td-location">${alert.location}</td>
                    <td><span class="badge ${badgeClass}">${alert.risk}</span></td>
                    <td class="td-desc" title="${alert.description}">${alert.description}</td>
                </tr>
            `;
        }).join('');
    }

    /* ───────────────────────── AI Recommendations ───────────────────────── */
    function renderAIRecommendations() {
        const container = document.getElementById('ai-recommendations');
        if (!container) return;

        const data = CrowdSenseData.aiRecommendations;

        // Set confidence bar width
        const bar = document.getElementById('ai-confidence-fill');
        if (bar) {
            setTimeout(() => { bar.style.width = data.confidence + '%'; }, 600);
        }

        container.innerHTML = data.items.map((item) => {
            const iconClass = item.priority === 'critical' ? 'ai-panel__rec-icon--critical' :
                              item.priority === 'high' ? 'ai-panel__rec-icon--high' : 'ai-panel__rec-icon--medium';
            return `
                <div class="ai-panel__rec-item animate-on-scroll">
                    <div class="ai-panel__rec-icon ${iconClass}">
                        <i class="fas ${item.icon}"></i>
                    </div>
                    <span>${item.text}</span>
                </div>
            `;
        }).join('');
    }

    /* ───────────────────────── Events ───────────────────────── */
    function renderEvents() {
        const list = document.getElementById('events-list');
        if (!list) return;

        list.innerHTML = CrowdSenseData.events.map((event) => `
            <div class="event-card animate-on-scroll">
                <div class="event-card__icon">
                    <i class="fas ${event.icon}"></i>
                </div>
                <div class="event-card__info">
                    <h4>
                        ${event.name}
                        <span class="badge ${event.status === 'Active' ? 'badge--success' : 'badge--primary'}">${event.status}</span>
                    </h4>
                    <p class="event-card__desc">${event.description}</p>
                    <div class="event-card__meta">
                        <span><i class="fas fa-users"></i> ${event.expectedVisitors.toLocaleString()} expected</span>
                        <span><i class="fas fa-calendar-alt"></i> ${event.date}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /* ───────────────────────── Sidebar ───────────────────────── */
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

        // Nav item active state
        document.querySelectorAll('.sidebar__nav-item').forEach((item) => {
            item.addEventListener('click', function () {
                document.querySelectorAll('.sidebar__nav-item').forEach(i => i.classList.remove('sidebar__nav-item--active'));
                this.classList.add('sidebar__nav-item--active');
                // Close sidebar on mobile
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('sidebar--open');
                    overlay.classList.remove('active');
                }
            });
        });
    }

    /* ───────────────────────── Navbar ───────────────────────── */
    function initNavbar() {
        // Alert filter buttons
        document.querySelectorAll('.alerts-panel__filter-btn').forEach((btn) => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.alerts-panel__filter-btn').forEach(b => b.classList.remove('alerts-panel__filter-btn--active'));
                this.classList.add('alerts-panel__filter-btn--active');
            });
        });
    }

    /* ───────────────────────── Live Clock ───────────────────────── */
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

    return { init };

})();

/* ─── Bootstrap on DOM ready ─── */
document.addEventListener('DOMContentLoaded', Dashboard.init);
