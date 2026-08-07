/**
 * CrowdSense AI — Citizen Pages Controller
 * Handles: Home dashboard, Nearby Risk, Events, Report Crowd, Safety Tips
 */

const CitizenPages = (() => {

    /* ═══════ CITIZEN HOME ═══════ */
    function initHome() {
        // KPI Cards
        const kpis = [
            { icon: 'fa-users', title: 'Nearby Crowd', value: 1850, suffix: 'People', change: '+8% from avg', changeDir: 'up', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
            { icon: 'fa-exclamation-triangle', title: 'Risk Level', value: 'MEDIUM', suffix: '', change: 'Moderate', changeDir: 'neutral', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
            { icon: 'fa-cloud-sun', title: "Today's Weather", value: 31, suffix: '°C', change: 'Cloudy · 72% Humidity', changeDir: 'neutral', color: '#3B82F6', bg: 'rgba(37,99,235,0.12)' },
            { icon: 'fa-calendar-check', title: 'Nearby Events', value: 2, suffix: 'Events', change: 'Ganpati Festival', changeDir: 'neutral', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' }
        ];

        const grid = document.getElementById('citizen-kpi-grid');
        if (grid) {
            grid.innerHTML = kpis.map((k, i) => `
                <div class="kpi-card animate-fade-in-up" style="animation-delay:${i * 0.1}s;">
                    <div class="kpi-card__header">
                        <div class="kpi-card__icon" style="background:${k.bg};color:${k.color};"><i class="fas ${k.icon}"></i></div>
                    </div>
                    <div class="kpi-card__title">${k.title}</div>
                    <div class="kpi-card__value">
                        <span class="number" data-target="${k.value}" style="color:${k.color};">${typeof k.value === 'number' ? '0' : k.value}</span>
                        ${k.suffix ? `<span class="unit">${k.suffix}</span>` : ''}
                    </div>
                    <div class="kpi-card__change kpi-card__change--${k.changeDir}">
                        ${k.changeDir === 'up' ? '<i class="fas fa-arrow-up"></i>' : ''}
                        ${k.change}
                    </div>
                </div>
            `).join('');

            // Animate counters
            setTimeout(() => {
                grid.querySelectorAll('.number').forEach(el => {
                    const target = parseFloat(el.dataset.target);
                    if (!isNaN(target)) Common.animateCounter(el, target, 1800);
                });
            }, 400);
        }

        // Recent Alerts
        const alertsContainer = document.getElementById('citizen-alerts');
        if (alertsContainer) {
            const alerts = [
                { location: 'Marine Drive', desc: 'High crowd density — avoid if possible', risk: 'High', riskColor: '#F97316', time: '10 min ago' },
                { location: 'Dadar Station', desc: 'Moderate crowd at evening rush hour', risk: 'Medium', riskColor: '#F59E0B', time: '25 min ago' },
                { location: 'Bandra', desc: 'Normal pedestrian flow', risk: 'Low', riskColor: '#22C55E', time: '1 hour ago' }
            ];

            alertsContainer.innerHTML = alerts.map(a => `
                <div class="alert-card" style="margin-bottom:8px;">
                    <div class="alert-card__indicator" style="background:${a.riskColor};"></div>
                    <div class="alert-card__content">
                        <div class="alert-card__header">
                            <span class="alert-card__title">${a.location}</span>
                            <span class="alert-card__time">${a.time}</span>
                        </div>
                        <p class="alert-card__desc">${a.desc}</p>
                        <span class="badge" style="background:${a.riskColor}20;color:${a.riskColor};">${a.risk}</span>
                    </div>
                </div>
            `).join('');
        }

        // Events
        const eventsContainer = document.getElementById('citizen-events');
        if (eventsContainer) {
            const events = [
                { name: 'Ganpati Festival', desc: 'Annual procession through major city routes', visitors: '25,000', date: 'Tomorrow', icon: 'fa-pray', status: 'Active', statusBadge: 'badge--success' },
                { name: 'Mumbai Marathon', desc: 'City-wide marathon from CST to Worli', visitors: '12,000', date: 'Aug 10', icon: 'fa-running', status: 'Upcoming', statusBadge: 'badge--primary' }
            ];

            eventsContainer.innerHTML = events.map(e => `
                <div class="event-card">
                    <div class="event-card__icon"><i class="fas ${e.icon}"></i></div>
                    <div class="event-card__info">
                        <h4>${e.name} <span class="badge ${e.statusBadge}">${e.status}</span></h4>
                        <p class="event-card__desc">${e.desc}</p>
                        <div class="event-card__meta">
                            <span><i class="fas fa-users"></i> ${e.visitors} expected</span>
                            <span><i class="fas fa-calendar-alt"></i> ${e.date}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Citizen Map
        initCitizenMap();

        // Trend Chart
        initCitizenTrendChart();

        Common.initScrollAnimations();
    }

    function initCitizenMap() {
        const mapEl = document.getElementById('citizen-map');
        if (!mapEl) return;

        const map = L.map('citizen-map', { center: [19.0760, 72.8777], zoom: 12, zoomControl: false });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OSM &copy; CARTO', subdomains: 'abcd', maxZoom: 19
        }).addTo(map);
        L.control.zoom({ position: 'topright' }).addTo(map);

        const markers = [
            { lat: 19.0178, lng: 72.8478, name: 'Dadar', crowd: 2450, color: '#F97316' },
            { lat: 18.9440, lng: 72.8237, name: 'Marine Drive', crowd: 3800, color: '#EF4444' },
            { lat: 19.0596, lng: 72.8295, name: 'BKC', crowd: 850, color: '#22C55E' },
            { lat: 19.0544, lng: 72.8406, name: 'Bandra', crowd: 1900, color: '#F97316' },
            { lat: 18.9322, lng: 72.8347, name: 'CST', crowd: 4100, color: '#EF4444' }
        ];

        markers.forEach(m => {
            L.circleMarker([m.lat, m.lng], { radius: 10, fillColor: m.color, fillOpacity: 0.7, color: m.color, weight: 2 }).addTo(map)
            .bindPopup(`<div style="font-family:'Inter',sans-serif;padding:4px;"><b style="color:#F9FAFB;">${m.name}</b><br><span style="font-size:18px;font-weight:800;color:${m.color};">${m.crowd.toLocaleString()}</span><br><span style="font-size:11px;color:#9CA3AF;">people currently</span></div>`, { className: 'crowd-popup', closeButton: false });
        });

        setTimeout(() => map.invalidateSize(), 300);
    }

    function initCitizenTrendChart() {
        const ctx = document.getElementById('citizen-trend-chart');
        if (!ctx || typeof Chart === 'undefined') return;

        Chart.defaults.color = '#9CA3AF';
        Chart.defaults.font.family = "'Inter', sans-serif";

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['6AM','8AM','10AM','12PM','2PM','4PM','6PM','8PM'],
                datasets: [{
                    label: 'Nearby Crowd',
                    data: [300,900,1400,1700,1850,2200,2600,2100],
                    borderColor: '#2563EB',
                    backgroundColor: 'rgba(37,99,235,0.1)',
                    tension: 0.4, fill: true, pointRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(55,65,81,0.4)' }, ticks: { color: '#9CA3AF' } },
                    y: { grid: { color: 'rgba(55,65,81,0.4)' }, ticks: { color: '#9CA3AF', callback: v => v >= 1000 ? (v/1000)+'k' : v }, beginAtZero: true }
                }
            }
        });
    }

    /* ═══════ NEARBY RISK ═══════ */
    function initNearbyRisk() {
        const locations = [
            { name: 'Marine Drive', risk: 92, distance: '2.1 km', crowd: 3800, level: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
            { name: 'CST Station', risk: 88, distance: '3.4 km', crowd: 4100, level: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
            { name: 'Dadar Station', risk: 72, distance: '1.2 km', crowd: 2450, level: 'High', color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
            { name: 'Juhu Beach', risk: 65, distance: '5.8 km', crowd: 2800, level: 'High', color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
            { name: 'Bandra Station', risk: 55, distance: '2.8 km', crowd: 1900, level: 'Medium', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
            { name: 'Worli Sea Face', risk: 42, distance: '4.5 km', crowd: 1500, level: 'Medium', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
            { name: 'Andheri West', risk: 35, distance: '6.2 km', crowd: 1200, level: 'Low', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
            { name: 'BKC', risk: 22, distance: '3.1 km', crowd: 850, level: 'Low', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
            { name: 'Borivali', risk: 15, distance: '12.4 km', crowd: 600, level: 'Low', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
            { name: 'Pali Hill', risk: 10, distance: '3.8 km', crowd: 400, level: 'Low', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' }
        ];

        const list = document.getElementById('risk-list');
        if (!list) return;

        function render(data) {
            list.innerHTML = data.map(loc => `
                <div class="risk-item animate-on-scroll">
                    <div class="risk-item__indicator" style="background:${loc.bg};color:${loc.color};">
                        ${loc.risk}%
                    </div>
                    <div class="risk-item__info">
                        <div class="risk-item__name">${loc.name}</div>
                        <div class="risk-item__detail">
                            <span><i class="fas fa-location-arrow"></i> ${loc.distance}</span>
                            <span><i class="fas fa-users"></i> ${loc.crowd.toLocaleString()} people</span>
                        </div>
                    </div>
                    <div class="risk-item__badge">
                        <span class="badge" style="background:${loc.bg};color:${loc.color};">${loc.level}</span>
                    </div>
                </div>
            `).join('');
            Common.initScrollAnimations();
        }

        render(locations);

        // Search
        const search = document.getElementById('risk-search');
        if (search) {
            search.addEventListener('input', function() {
                const q = this.value.toLowerCase();
                render(locations.filter(l => l.name.toLowerCase().includes(q)));
            });
        }
    }

    /* ═══════ CITIZEN EVENTS ═══════ */
    function initEvents() {
        const events = [
            { name: 'Ganpati Festival', venue: 'Dadar — Girgaon Chowpatty', icon: 'fa-pray', expected: 25000, weather: '31°C Cloudy', risk: 'High', riskColor: '#F97316', status: 'Today', statusBadge: 'badge--warning', tab: 'today' },
            { name: 'Mumbai Marathon', venue: 'CST — Worli Sea Link', icon: 'fa-running', expected: 12000, weather: '29°C Clear', risk: 'Medium', riskColor: '#F59E0B', status: 'Upcoming', statusBadge: 'badge--primary', tab: 'upcoming' },
            { name: 'College Cultural Fest', venue: 'Bandra Kurla Complex', icon: 'fa-graduation-cap', expected: 7000, weather: '30°C Sunny', risk: 'Low', riskColor: '#22C55E', status: 'Upcoming', statusBadge: 'badge--primary', tab: 'upcoming' },
            { name: 'Independence Day Rally', venue: 'Marine Drive', icon: 'fa-flag', expected: 15000, weather: '28°C Rain', risk: 'High', riskColor: '#F97316', status: 'Upcoming', statusBadge: 'badge--primary', tab: 'upcoming' },
            { name: 'Navratri Festival', venue: 'Multiple Venues', icon: 'fa-music', expected: 35000, weather: '32°C Humid', risk: 'Critical', riskColor: '#EF4444', status: 'Today', statusBadge: 'badge--danger', tab: 'today' }
        ];

        const grid = document.getElementById('citizen-events-grid');
        if (!grid) return;

        function render(tab) {
            const filtered = tab === 'all' ? events : events.filter(e => e.tab === tab);
            grid.innerHTML = filtered.map(e => `
                <div class="event-detail-card animate-on-scroll">
                    <div class="event-detail-card__top">
                        <div class="event-detail-card__icon"><i class="fas ${e.icon}"></i></div>
                        <div>
                            <div class="event-detail-card__title">${e.name} <span class="badge ${e.statusBadge}">${e.status}</span></div>
                            <div class="event-detail-card__venue"><i class="fas fa-map-marker-alt"></i> ${e.venue}</div>
                        </div>
                    </div>
                    <div class="event-detail-card__stats">
                        <div class="event-detail-card__stat"><div class="event-detail-card__stat-label">Expected</div><div class="event-detail-card__stat-value" style="color:#3B82F6;">${e.expected.toLocaleString()}</div></div>
                        <div class="event-detail-card__stat"><div class="event-detail-card__stat-label">Weather</div><div class="event-detail-card__stat-value" style="color:#F59E0B;font-size:0.85rem;">${e.weather}</div></div>
                        <div class="event-detail-card__stat"><div class="event-detail-card__stat-label">Risk</div><div class="event-detail-card__stat-value" style="color:${e.riskColor};">${e.risk}</div></div>
                    </div>
                </div>
            `).join('');
            Common.initScrollAnimations();
        }

        render('upcoming');

        document.querySelectorAll('.tab-nav__item').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.tab-nav__item').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                render(this.dataset.tab);
            });
        });
    }

    /* ═══════ REPORT CROWD ═══════ */
    function initReportCrowd() {
        // File upload label
        const fileInput = document.getElementById('report-image');
        const fileLabel = document.getElementById('file-upload');
        if (fileInput && fileLabel) {
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    fileLabel.querySelector('span').textContent = this.files[0].name;
                    fileLabel.style.borderColor = 'rgba(37,99,235,0.3)';
                    fileLabel.style.background = 'rgba(37,99,235,0.03)';
                }
            });
        }

        // Submit form
        const form = document.getElementById('report-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const location = document.getElementById('report-location').value.trim();
                const crowd = document.getElementById('report-crowd').value;

                if (!location || !crowd) {
                    Common.showToast('Please fill in required fields', 'warning');
                    return;
                }

                const btn = document.getElementById('submit-report-btn');
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                btn.disabled = true;

                setTimeout(() => {
                    Common.showModal(
                        'fa-check-circle',
                        'rgba(34,197,94,0.15)',
                        '#22C55E',
                        'Report Submitted!',
                        'Thank you for your contribution. Your crowd report has been submitted to the authorities for review.'
                    );

                    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Report';
                    btn.disabled = false;
                    form.reset();
                    if (fileLabel) {
                        fileLabel.querySelector('span').textContent = 'Click to upload or drag & drop';
                        fileLabel.style.borderColor = '';
                        fileLabel.style.background = '';
                    }
                }, 1200);
            });
        }
    }

    /* ═══════ SAFETY TIPS ═══════ */
    function initSafety() {
        const safetyData = [
            {
                title: 'Emergency Numbers',
                icon: 'fa-phone-alt',
                iconBg: 'rgba(239,68,68,0.12)',
                iconColor: '#EF4444',
                items: [
                    { icon: 'fa-phone', text: 'Police: 100', color: '#EF4444' },
                    { icon: 'fa-ambulance', text: 'Ambulance: 108', color: '#EF4444' },
                    { icon: 'fa-fire', text: 'Fire: 101', color: '#F97316' },
                    { icon: 'fa-hospital', text: 'Disaster Management: 1916', color: '#F59E0B' },
                    { icon: 'fa-phone-alt', text: 'Women Helpline: 1091', color: '#A78BFA' }
                ]
            },
            {
                title: "Do's in Crowded Areas",
                icon: 'fa-check-circle',
                iconBg: 'rgba(34,197,94,0.12)',
                iconColor: '#22C55E',
                items: [
                    { icon: 'fa-check', text: 'Stay aware of your surroundings at all times', color: '#22C55E' },
                    { icon: 'fa-check', text: 'Keep emergency numbers saved in your phone', color: '#22C55E' },
                    { icon: 'fa-check', text: 'Follow police and authority instructions', color: '#22C55E' },
                    { icon: 'fa-check', text: 'Move with the crowd flow, never against it', color: '#22C55E' },
                    { icon: 'fa-check', text: 'Keep children close and hold their hands', color: '#22C55E' },
                    { icon: 'fa-check', text: 'Identify exits and escape routes in advance', color: '#22C55E' }
                ]
            },
            {
                title: "Don'ts in Crowded Areas",
                icon: 'fa-times-circle',
                iconBg: 'rgba(239,68,68,0.12)',
                iconColor: '#EF4444',
                items: [
                    { icon: 'fa-times', text: 'Do not push or shove in a dense crowd', color: '#EF4444' },
                    { icon: 'fa-times', text: 'Avoid carrying large bags or luggage', color: '#EF4444' },
                    { icon: 'fa-times', text: 'Do not stop in the middle of a moving crowd', color: '#EF4444' },
                    { icon: 'fa-times', text: 'Avoid using phones while walking in crowds', color: '#EF4444' },
                    { icon: 'fa-times', text: 'Do not ignore official warnings or alerts', color: '#EF4444' }
                ]
            },
            {
                title: 'Crowd Safety Tips',
                icon: 'fa-shield-alt',
                iconBg: 'rgba(37,99,235,0.12)',
                iconColor: '#3B82F6',
                items: [
                    { icon: 'fa-info-circle', text: 'Plan your route before entering crowded areas', color: '#3B82F6' },
                    { icon: 'fa-info-circle', text: 'Wear comfortable shoes for easy movement', color: '#3B82F6' },
                    { icon: 'fa-info-circle', text: 'Stay hydrated and carry water', color: '#3B82F6' },
                    { icon: 'fa-info-circle', text: 'Set a meeting point with companions', color: '#3B82F6' },
                    { icon: 'fa-info-circle', text: 'Use CrowdSense AI app to check risk levels', color: '#3B82F6' }
                ]
            },
            {
                title: 'Medical Help',
                icon: 'fa-first-aid',
                iconBg: 'rgba(245,158,11,0.12)',
                iconColor: '#F59E0B',
                items: [
                    { icon: 'fa-plus-circle', text: 'Look for medical aid stations at events', color: '#F59E0B' },
                    { icon: 'fa-plus-circle', text: 'Carry basic first-aid supplies', color: '#F59E0B' },
                    { icon: 'fa-plus-circle', text: 'Know the nearest hospital location', color: '#F59E0B' },
                    { icon: 'fa-plus-circle', text: 'If someone faints, create space and call 108', color: '#F59E0B' }
                ]
            },
            {
                title: 'Emergency Exit Guidelines',
                icon: 'fa-door-open',
                iconBg: 'rgba(167,139,250,0.12)',
                iconColor: '#A78BFA',
                items: [
                    { icon: 'fa-arrow-right', text: 'Always locate emergency exits upon arrival', color: '#A78BFA' },
                    { icon: 'fa-arrow-right', text: 'Keep pathways and exits clear', color: '#A78BFA' },
                    { icon: 'fa-arrow-right', text: 'In panic, stay calm and move steadily', color: '#A78BFA' },
                    { icon: 'fa-arrow-right', text: 'Protect your chest with arms if crushed', color: '#A78BFA' },
                    { icon: 'fa-arrow-right', text: 'If fallen, curl up and protect your head', color: '#A78BFA' }
                ]
            }
        ];

        const grid = document.getElementById('safety-grid');
        if (!grid) return;

        grid.innerHTML = safetyData.map(card => `
            <div class="safety-card animate-on-scroll">
                <div class="safety-card__header">
                    <div class="safety-card__header-icon" style="background:${card.iconBg};color:${card.iconColor};"><i class="fas ${card.icon}"></i></div>
                    <h3>${card.title}</h3>
                </div>
                <div class="safety-card__body">
                    ${card.items.map(item => `
                        <div class="safety-card__item">
                            <i class="fas ${item.icon}" style="color:${item.color};"></i>
                            <span>${item.text}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        Common.initScrollAnimations();
    }

    return { initHome, initNearbyRisk, initEvents, initReportCrowd, initSafety };

})();
