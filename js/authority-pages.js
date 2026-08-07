/**
 * CrowdSense AI — Authority Pages Controller
 * Handles: Analytics charts, Heatmap, Events, Recommendations, Alerts, Reports
 */

const AuthorityPages = (() => {

    /* Chart.js defaults */
    const gridColor = 'rgba(55,65,81,0.4)';
    const tickColor = '#9CA3AF';
    const tooltipCfg = {
        backgroundColor: 'rgba(31,41,55,0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#9CA3AF',
        borderColor: 'rgba(55,65,81,0.8)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
    };

    function chartDefaults() {
        if (typeof Chart === 'undefined') return;
        Chart.defaults.color = tickColor;
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.font.size = 11;
        Chart.defaults.animation.duration = 1200;
        Chart.defaults.animation.easing = 'easeOutQuart';
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
        Chart.defaults.plugins.legend.labels.padding = 16;
    }

    /* ═══════ ANALYTICS PAGE ═══════ */
    function initAnalytics() {
        chartDefaults();
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const scalesXY = {
            x: { grid: { color: gridColor, drawBorder: false }, ticks: { color: tickColor } },
            y: { grid: { color: gridColor, drawBorder: false }, ticks: { color: tickColor, callback: v => v >= 1000 ? (v/1000)+'k' : v }, beginAtZero: true }
        };

        // 1. Crowd Trend 12 Months
        new Chart(document.getElementById('chart-trend12'), {
            type: 'line',
            data: { labels: months, datasets: [{ label: '2026 Crowd', data: [18000,22000,19500,24000,28000,31000,35000,33000,29000,26000,23000,21000], borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.08)', tension: 0.4, fill: true, pointRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'end' }, tooltip: tooltipCfg }, scales: scalesXY }
        });

        // 2. Monthly Comparison
        new Chart(document.getElementById('chart-monthly'), {
            type: 'bar',
            data: { labels: months.slice(0,8), datasets: [
                { label: '2026', data: [18000,22000,19500,24000,28000,31000,35000,33000], backgroundColor: 'rgba(37,99,235,0.7)', borderRadius: 6, barPercentage: 0.5 },
                { label: '2025', data: [16000,19000,17500,21000,24000,27000,30000,28000], backgroundColor: 'rgba(107,114,128,0.5)', borderRadius: 6, barPercentage: 0.5 }
            ]},
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'end' }, tooltip: tooltipCfg }, scales: scalesXY }
        });

        // 3. Risk Distribution
        new Chart(document.getElementById('chart-risk'), {
            type: 'doughnut',
            data: { labels: ['Low','Medium','High','Critical'], datasets: [{ data: [35,28,22,15], backgroundColor: ['#22C55E','#F59E0B','#F97316','#EF4444'], borderColor: '#1F2937', borderWidth: 3, hoverOffset: 8 }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom' }, tooltip: tooltipCfg } }
        });

        // 4. Prediction Accuracy
        new Chart(document.getElementById('chart-accuracy'), {
            type: 'line',
            data: { labels: months.slice(0,8), datasets: [
                { label: 'Accuracy %', data: [82,84,85,86,87,88,87,89], borderColor: '#22C55E', backgroundColor: 'rgba(34,197,94,0.08)', tension: 0.4, fill: true, pointRadius: 4, yAxisID: 'y' },
                { label: 'Error Rate %', data: [18,16,15,14,13,12,13,11], borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.08)', tension: 0.4, fill: true, pointRadius: 4, borderDash: [5,5], yAxisID: 'y' }
            ]},
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'end' }, tooltip: tooltipCfg }, scales: scalesXY }
        });

        // 5. Weather Impact
        new Chart(document.getElementById('chart-weather'), {
            type: 'bar',
            data: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [
                { label: 'Crowd', data: [2100,2400,1800,2600,3200,3800,3500], backgroundColor: 'rgba(37,99,235,0.7)', borderRadius: 6, barPercentage: 0.6 },
                { label: 'Temp °C', data: [28,30,32,29,31,33,31], backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 6, barPercentage: 0.6 }
            ]},
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'end' }, tooltip: tooltipCfg }, scales: scalesXY }
        });

        // 6. Peak Crowd Hours
        new Chart(document.getElementById('chart-peak'), {
            type: 'bar',
            data: { labels: ['6AM','8AM','10AM','12PM','2PM','4PM','6PM','8PM','10PM'], datasets: [{
                label: 'Avg Crowd', data: [400,1200,1800,2200,2450,2900,3400,2800,1600],
                backgroundColor: (ctx) => {
                    const v = ctx.parsed.y;
                    if (v > 3000) return 'rgba(239,68,68,0.7)';
                    if (v > 2000) return 'rgba(249,115,22,0.7)';
                    if (v > 1000) return 'rgba(245,158,11,0.7)';
                    return 'rgba(34,197,94,0.7)';
                },
                borderRadius: 6, barPercentage: 0.6
            }]},
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipCfg }, scales: { x: { grid: { color: gridColor }, ticks: { color: tickColor } }, y: { grid: { display: false }, ticks: { color: tickColor } } } }
        });

        // 7. Weekly Analysis
        new Chart(document.getElementById('chart-weekly'), {
            type: 'bar',
            data: { labels: ['Week 1','Week 2','Week 3','Week 4'], datasets: [
                { label: 'Low Risk', data: [12000,14000,11000,13000], backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 4 },
                { label: 'Medium', data: [8000,7000,9000,8500], backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 4 },
                { label: 'High', data: [5000,6000,7000,5500], backgroundColor: 'rgba(249,115,22,0.7)', borderRadius: 4 },
                { label: 'Critical', data: [2000,3000,4000,2500], backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 4 }
            ]},
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, tooltip: tooltipCfg }, scales: { x: { stacked: true, grid: { display: false }, ticks: { color: tickColor } }, y: { stacked: true, grid: { color: gridColor }, ticks: { color: tickColor, callback: v => v >= 1000 ? (v/1000)+'k' : v } } } }
        });

        // 8. Daily Analysis
        new Chart(document.getElementById('chart-daily'), {
            type: 'line',
            data: { labels: ['6AM','8AM','10AM','12PM','2PM','4PM','6PM','8PM','10PM'], datasets: [{
                label: 'Today\'s Crowd', data: [400,1200,1800,2200,2450,2900,3400,2800,1600],
                borderColor: '#A78BFA', backgroundColor: 'rgba(167,139,250,0.1)', tension: 0.4, fill: true, pointRadius: 5, pointBackgroundColor: '#A78BFA', pointBorderColor: '#1F2937', pointBorderWidth: 2
            }]},
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipCfg }, scales: scalesXY }
        });
    }

    /* ═══════ HEATMAP PAGE ═══════ */
    function initHeatmap() {
        const mapEl = document.getElementById('fullscreen-map');
        if (!mapEl) return;

        // Light tile layer (user requested white/light like Google Maps)
        const map = L.map('fullscreen-map', { center: [19.0760, 72.8777], zoom: 12, zoomControl: false });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd', maxZoom: 19
        }).addTo(map);
        L.control.zoom({ position: 'topright' }).addTo(map);

        // Markers from data
        const markers = [
            { lat: 19.0178, lng: 72.8478, name: 'Dadar Station', crowd: 2450, level: 'high', color: '#F97316' },
            { lat: 19.0760, lng: 72.8777, name: 'Andheri West', crowd: 1200, level: 'medium', color: '#F59E0B' },
            { lat: 18.9440, lng: 72.8237, name: 'Marine Drive', crowd: 3800, level: 'critical', color: '#EF4444' },
            { lat: 19.0596, lng: 72.8295, name: 'BKC', crowd: 850, level: 'low', color: '#22C55E' },
            { lat: 19.0544, lng: 72.8406, name: 'Bandra Station', crowd: 1900, level: 'high', color: '#F97316' },
            { lat: 18.9398, lng: 72.8354, name: 'Churchgate', crowd: 3200, level: 'critical', color: '#EF4444' },
            { lat: 19.1197, lng: 72.8464, name: 'Borivali', crowd: 600, level: 'low', color: '#22C55E' },
            { lat: 18.9696, lng: 72.8194, name: 'Worli', crowd: 1500, level: 'medium', color: '#F59E0B' },
            { lat: 19.0990, lng: 72.8265, name: 'Juhu Beach', crowd: 2800, level: 'high', color: '#F97316' },
            { lat: 18.9322, lng: 72.8347, name: 'CST Station', crowd: 4100, level: 'critical', color: '#EF4444' },
            { lat: 19.0330, lng: 72.8497, name: 'Mahim', crowd: 700, level: 'low', color: '#22C55E' },
            { lat: 19.0420, lng: 72.8200, name: 'Pali Hill', crowd: 400, level: 'low', color: '#22C55E' }
        ];

        markers.forEach(m => {
            L.circleMarker([m.lat, m.lng], { radius: getRadius(m.crowd) + 10, fillColor: m.color, fillOpacity: 0.15, stroke: false }).addTo(map);
            const circle = L.circleMarker([m.lat, m.lng], { radius: getRadius(m.crowd), fillColor: m.color, fillOpacity: 0.7, color: m.color, weight: 2, opacity: 0.9 }).addTo(map);
            circle.bindPopup(`<div style="font-family:'Inter',sans-serif;padding:6px;"><div style="font-weight:700;font-size:14px;margin-bottom:6px;color:#1F2937;">${m.name}</div><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;"><span style="width:8px;height:8px;border-radius:50%;background:${m.color};display:inline-block;"></span><span style="font-size:12px;color:#6B7280;text-transform:capitalize;">${m.level} Density</span></div><div style="font-size:20px;font-weight:800;color:${m.color};">${m.crowd.toLocaleString()}</div><div style="font-size:11px;color:#9CA3AF;">people currently</div></div>`, { className: 'crowd-popup', closeButton: false, offset: [0, -10] });
            circle.on('mouseover', function() { this.openPopup(); });
            circle.on('mouseout', function() { this.closePopup(); });
        });

        setTimeout(() => map.invalidateSize(), 300);
    }

    function getRadius(crowd) {
        if (crowd >= 3000) return 16;
        if (crowd >= 2000) return 13;
        if (crowd >= 1000) return 11;
        return 9;
    }

    /* ═══════ EVENTS PAGE ═══════ */
    function initEvents() {
        const eventsData = [
            { name: 'Ganpati Festival', venue: 'Dadar — Girgaon Chowpatty', icon: 'fa-pray', expected: 25000, predicted: 28000, current: 12500, risk: 'High', riskColor: '#F97316', weather: '31°C Cloudy', status: 'Ongoing', statusBadge: 'badge--warning' },
            { name: 'Mumbai Marathon', venue: 'CST — Worli Sea Link', icon: 'fa-running', expected: 12000, predicted: 11500, current: 0, risk: 'Medium', riskColor: '#F59E0B', weather: '29°C Clear', status: 'Upcoming', statusBadge: 'badge--primary' },
            { name: 'College Cultural Fest', venue: 'Bandra Kurla Complex', icon: 'fa-graduation-cap', expected: 7000, predicted: 7200, current: 0, risk: 'Low', riskColor: '#22C55E', weather: '30°C Sunny', status: 'Upcoming', statusBadge: 'badge--primary' },
            { name: 'Independence Day Rally', venue: 'Marine Drive', icon: 'fa-flag', expected: 15000, predicted: 16000, current: 0, risk: 'High', riskColor: '#F97316', weather: '28°C Rain', status: 'Upcoming', statusBadge: 'badge--primary' },
            { name: 'Navratri Festival', venue: 'Multiple Venues', icon: 'fa-music', expected: 35000, predicted: 38000, current: 18000, risk: 'Critical', riskColor: '#EF4444', weather: '32°C Humid', status: 'Ongoing', statusBadge: 'badge--danger' },
            { name: 'Republic Day Parade 2026', venue: 'Marine Drive', icon: 'fa-flag', expected: 20000, predicted: 19000, current: 20000, risk: 'Medium', riskColor: '#F59E0B', weather: '26°C Clear', status: 'Past', statusBadge: 'badge--success' }
        ];

        const grid = document.getElementById('events-grid');
        if (!grid) return;

        function render(filter) {
            const filtered = filter === 'all' ? eventsData : eventsData.filter(e => e.status.toLowerCase() === filter);
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
                        <div class="event-detail-card__stat"><div class="event-detail-card__stat-label">Predicted</div><div class="event-detail-card__stat-value" style="color:#A78BFA;">${e.predicted.toLocaleString()}</div></div>
                        <div class="event-detail-card__stat"><div class="event-detail-card__stat-label">Current</div><div class="event-detail-card__stat-value" style="color:#22C55E;">${e.current.toLocaleString()}</div></div>
                    </div>
                    <div class="event-detail-card__bottom">
                        <div class="event-detail-card__meta-row">
                            <span><i class="fas fa-shield-alt" style="color:${e.riskColor};"></i> ${e.risk} Risk</span>
                            <span><i class="fas fa-cloud-sun"></i> ${e.weather}</span>
                        </div>
                        <div class="event-detail-card__actions">
                            <button class="btn btn--outline btn--sm"><i class="fas fa-eye"></i> View</button>
                            <button class="btn btn--ghost btn--sm"><i class="fas fa-edit"></i> Edit</button>
                            <button class="btn btn--ghost btn--sm"><i class="fas fa-chart-line"></i> Analytics</button>
                        </div>
                    </div>
                </div>
            `).join('');
            Common.initScrollAnimations();
        }

        render('all');

        // Tab switching
        document.querySelectorAll('.tab-nav__item').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.tab-nav__item').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const map = { 'upcoming': 'upcoming', 'ongoing': 'ongoing', 'past': 'past' };
                render(map[this.dataset.tab] || 'all');
            });
        });
    }

    /* ═══════ RECOMMENDATIONS PAGE ═══════ */
    function initRecommendations() {
        const recos = [
            { icon: 'fa-shield-alt', title: 'Deploy Police', desc: 'Deploy additional police units at Dadar and CST stations for crowd control.', priority: 'Critical', pColor: '#EF4444', pBg: 'rgba(239,68,68,0.12)' },
            { icon: 'fa-road-barrier', title: 'Increase Barricades', desc: 'Set up additional barricades at Marine Drive and Churchgate to channelize crowd flow.', priority: 'Critical', pColor: '#EF4444', pBg: 'rgba(239,68,68,0.12)' },
            { icon: 'fa-road', title: 'Open Alternate Routes', desc: 'Divert traffic via Eastern Express Highway and open alternate pedestrian corridors.', priority: 'High', pColor: '#F97316', pBg: 'rgba(249,115,22,0.12)' },
            { icon: 'fa-ambulance', title: 'Notify Ambulance', desc: 'Alert emergency medical services and position ambulances at high-density zones.', priority: 'High', pColor: '#F97316', pBg: 'rgba(249,115,22,0.12)' },
            { icon: 'fa-ban', title: 'Restrict Entry', desc: 'Temporarily restrict entry to Marine Drive zone until crowd density reduces below threshold.', priority: 'Critical', pColor: '#EF4444', pBg: 'rgba(239,68,68,0.12)' },
            { icon: 'fa-broadcast-tower', title: 'PA System Alert', desc: 'Activate public address system for crowd guidance and safety announcements.', priority: 'Medium', pColor: '#3B82F6', pBg: 'rgba(37,99,235,0.12)' }
        ];

        const grid = document.getElementById('reco-grid');
        if (grid) {
            grid.innerHTML = recos.map(r => `
                <div class="reco-card animate-on-scroll">
                    <div class="reco-card__icon" style="background:${r.pBg};color:${r.pColor};"><i class="fas ${r.icon}"></i></div>
                    <div>
                        <h4 class="reco-card__title">${r.title}</h4>
                        <p class="reco-card__desc">${r.desc}</p>
                        <div class="reco-card__priority"><span class="badge" style="background:${r.pBg};color:${r.pColor};">${r.priority}</span></div>
                    </div>
                </div>
            `).join('');
        }

        const contacts = [
            { icon: 'fa-phone-alt', name: 'Police Control Room', number: '100' },
            { icon: 'fa-ambulance', name: 'Ambulance', number: '108' },
            { icon: 'fa-fire-extinguisher', name: 'Fire Brigade', number: '101' },
            { icon: 'fa-hospital', name: 'Disaster Management', number: '1916' },
            { icon: 'fa-shield-alt', name: 'Municipal Corp', number: '1800-200-1010' }
        ];

        const eGrid = document.getElementById('emergency-grid');
        if (eGrid) {
            eGrid.innerHTML = contacts.map(c => `
                <div class="emergency-card animate-on-scroll">
                    <div class="emergency-card__icon"><i class="fas ${c.icon}"></i></div>
                    <div class="emergency-card__info"><h4>${c.name}</h4><span>${c.number}</span></div>
                </div>
            `).join('');
        }

        Common.initScrollAnimations();
    }

    /* ═══════ ALERTS PAGE ═══════ */
    function initAlerts() {
        const alerts = [
            { time: '4:15 PM', date: 'Aug 7', location: 'Marine Drive', risk: 'Critical', riskColor: '#EF4444', desc: 'Crowd density exceeding 3,800 — deploy police immediately', status: 'Active' },
            { time: '4:05 PM', date: 'Aug 7', location: 'Churchgate', risk: 'High', riskColor: '#F97316', desc: 'Rush hour crowd exceeding safe limits at platform 3', status: 'Active' },
            { time: '3:50 PM', date: 'Aug 7', location: 'Juhu Beach', risk: 'Medium', riskColor: '#F59E0B', desc: 'Crowd gathering for evening festival activities', status: 'Active' },
            { time: '3:35 PM', date: 'Aug 7', location: 'CST Station', risk: 'High', riskColor: '#F97316', desc: 'Platform overcrowding detected — restrict entry', status: 'Active' },
            { time: '3:22 PM', date: 'Aug 7', location: 'Bandra', risk: 'Low', riskColor: '#22C55E', desc: 'Normal pedestrian flow near Linking Road', status: 'Resolved' },
            { time: '3:10 PM', date: 'Aug 7', location: 'Andheri', risk: 'Medium', riskColor: '#F59E0B', desc: 'Traffic congestion on Western Express Highway', status: 'Resolved' },
            { time: '2:45 PM', date: 'Aug 7', location: 'Dadar', risk: 'High', riskColor: '#F97316', desc: 'Crowd increasing rapidly near station exit', status: 'Resolved' },
            { time: '2:30 PM', date: 'Aug 7', location: 'Worli', risk: 'Low', riskColor: '#22C55E', desc: 'Crowd dispersing after event conclusion', status: 'Resolved' }
        ];

        // Recent Alerts
        const list = document.getElementById('alerts-list');
        if (list) {
            list.innerHTML = alerts.slice(0, 4).map(a => `
                <div class="alert-card animate-on-scroll">
                    <div class="alert-card__indicator" style="background:${a.riskColor};"></div>
                    <div class="alert-card__content">
                        <div class="alert-card__header">
                            <span class="alert-card__title">${a.location}</span>
                            <span class="alert-card__time">${a.time}</span>
                        </div>
                        <p class="alert-card__desc">${a.desc}</p>
                        <div class="alert-card__location">
                            <span class="badge" style="background:${a.riskColor}20;color:${a.riskColor};">${a.risk}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Alert History
        const tbody = document.getElementById('alert-history-tbody');
        if (tbody) {
            tbody.innerHTML = alerts.map(a => {
                const statusBadge = a.status === 'Active' ? 'badge--danger' : 'badge--success';
                return `<tr>
                    <td style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#6B7280;">${a.date}</td>
                    <td style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#6B7280;">${a.time}</td>
                    <td style="font-weight:500;">${a.location}</td>
                    <td><span class="badge" style="background:${a.riskColor}20;color:${a.riskColor};">${a.risk}</span></td>
                    <td style="color:#9CA3AF;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${a.desc}">${a.desc}</td>
                    <td><span class="badge ${statusBadge}">${a.status}</span></td>
                </tr>`;
            }).join('');
        }

        // Filter buttons
        Common.initFilterButtons('.alerts-panel__filter-btn');
        Common.initScrollAnimations();
    }

    /* ═══════ REPORTS PAGE ═══════ */
    function initReports() {
        const reports = [
            { name: 'Monthly Crowd Analysis — July 2026', type: 'Monthly', date: 'Aug 1, 2026', size: '2.4 MB' },
            { name: 'AI Prediction Accuracy Report — Q2', type: 'Prediction', date: 'Jul 15, 2026', size: '1.8 MB' },
            { name: 'Risk Assessment — Ganpati Festival', type: 'Event', date: 'Jul 10, 2026', size: '3.1 MB' },
            { name: 'Monthly Crowd Analysis — June 2026', type: 'Monthly', date: 'Jul 1, 2026', size: '2.2 MB' },
            { name: 'Incident Report — Marine Drive Surge', type: 'Incident', date: 'Jun 28, 2026', size: '1.5 MB' }
        ];

        const tbody = document.getElementById('report-history-tbody');
        if (tbody) {
            tbody.innerHTML = reports.map(r => `
                <tr>
                    <td style="font-weight:500;">${r.name}</td>
                    <td><span class="badge badge--primary">${r.type}</span></td>
                    <td style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#6B7280;">${r.date}</td>
                    <td style="font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#6B7280;">${r.size}</td>
                    <td>
                        <div style="display:flex;gap:6px;">
                            <button class="btn btn--outline btn--sm" onclick="Common.showToast('PDF downloading...','info')"><i class="fas fa-file-pdf"></i> PDF</button>
                            <button class="btn btn--ghost btn--sm" onclick="Common.showToast('CSV downloading...','info')"><i class="fas fa-file-csv"></i> CSV</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        Common.initScrollAnimations();
    }

    return { initAnalytics, initHeatmap, initEvents, initRecommendations, initAlerts, initReports };

})();
