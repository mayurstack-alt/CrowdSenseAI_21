/**
 * CrowdSense AI - Static Data Module (ES Module)
 * Ported 1:1 from data.js IIFE into named exports.
 */

export const kpiCards = [
    { id: 'current-crowd', icon: 'fa-users', title: 'Current Crowd', value: 2450, suffix: 'People', change: '+12%', changeDir: 'up', color: 'var(--success)', bgGradient: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)' },
    { id: 'predicted-crowd', icon: 'fa-chart-line', title: 'Predicted Crowd', value: 3120, suffix: 'People', change: 'Next 30 mins', changeDir: 'neutral', color: 'var(--primary)', bgGradient: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0.05) 100%)' },
    { id: 'risk-level', icon: 'fa-exclamation-triangle', title: 'Risk Level', value: 'HIGH', suffix: '', change: 'Elevated', changeDir: 'danger', color: 'var(--danger)', bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)' },
    { id: 'weather', icon: 'fa-cloud-sun', title: 'Weather', value: 31, suffix: '°C', change: 'Humidity 72% · Cloudy', changeDir: 'neutral', color: 'var(--warning)', bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)' },
    { id: 'active-events', icon: 'fa-calendar-check', title: 'Active Events', value: 3, suffix: 'Events', change: 'Ganpati Festival', changeDir: 'neutral', color: 'var(--warning)', bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)' }
];

export const alerts = [
    { time: '2:30 PM', location: 'Dadar', risk: 'High', riskColor: 'var(--danger)', description: 'Crowd increasing rapidly near station exit' },
    { time: '2:45 PM', location: 'Marine Drive', risk: 'Critical', riskColor: '#DC2626', description: 'Deploy police immediately — surge detected' },
    { time: '3:10 PM', location: 'Andheri', risk: 'Medium', riskColor: 'var(--warning)', description: 'Traffic congestion detected on Western Express Highway' },
    { time: '3:22 PM', location: 'Bandra', risk: 'Low', riskColor: 'var(--success)', description: 'Normal pedestrian flow near Linking Road' },
    { time: '3:35 PM', location: 'CST', risk: 'High', riskColor: 'var(--danger)', description: 'Platform overcrowding — restrict entry' },
    { time: '3:50 PM', location: 'Juhu Beach', risk: 'Medium', riskColor: 'var(--warning)', description: 'Crowd gathering for evening festival activities' },
    { time: '4:05 PM', location: 'Churchgate', risk: 'High', riskColor: 'var(--danger)', description: 'Rush hour crowd exceeding safe limits' },
    { time: '4:15 PM', location: 'Worli', risk: 'Low', riskColor: 'var(--success)', description: 'Crowd dispersing after event conclusion' }
];

export const mapMarkers = [
    { lat: 19.0178, lng: 72.8478, name: 'Dadar Station', crowd: 2450, level: 'high', color: '#F97316' },
    { lat: 19.0760, lng: 72.8777, name: 'Andheri West', crowd: 1200, level: 'medium', color: '#F59E0B' },
    { lat: 18.9440, lng: 72.8237, name: 'Marine Drive', crowd: 3800, level: 'critical', color: '#EF4444' },
    { lat: 19.0596, lng: 72.8295, name: 'Bandra Kurla Complex', crowd: 850, level: 'low', color: '#22C55E' },
    { lat: 19.0544, lng: 72.8406, name: 'Bandra Station', crowd: 1900, level: 'high', color: '#F97316' },
    { lat: 18.9398, lng: 72.8354, name: 'Churchgate', crowd: 3200, level: 'critical', color: '#EF4444' },
    { lat: 19.1197, lng: 72.8464, name: 'Borivali', crowd: 600, level: 'low', color: '#22C55E' },
    { lat: 18.9696, lng: 72.8194, name: 'Worli Sea Face', crowd: 1500, level: 'medium', color: '#F59E0B' },
    { lat: 19.0990, lng: 72.8265, name: 'Juhu Beach', crowd: 2800, level: 'high', color: '#F97316' },
    { lat: 18.9322, lng: 72.8347, name: 'CST Station', crowd: 4100, level: 'critical', color: '#EF4444' },
    { lat: 19.0330, lng: 72.8497, name: 'Mahim', crowd: 700, level: 'low', color: '#22C55E' },
    { lat: 19.0420, lng: 72.8200, name: 'Pali Hill', crowd: 400, level: 'low', color: '#22C55E' }
];

export const historicalCrowdTrend = {
    labels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'],
    datasets: [
        { label: 'Today', data: [400, 1200, 1800, 2200, 2450, 2900, 3400, 2800, 1600], borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.08)', tension: 0.4, fill: false, pointRadius: 4, pointHoverRadius: 7 },
        { label: 'Yesterday', data: [350, 1100, 1650, 2000, 2300, 2700, 3100, 2500, 1400], borderColor: '#6B7280', backgroundColor: 'rgba(107,114,128,0.08)', tension: 0.4, fill: false, borderDash: [5, 5], pointRadius: 3, pointHoverRadius: 6 }
    ]
};

export const crowdPrediction = {
    labels: ['Now', '+5m', '+10m', '+15m', '+20m', '+25m', '+30m'],
    datasets: [{ label: 'Predicted Crowd', data: [2450, 2600, 2780, 2900, 3000, 3080, 3120], borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.1)', tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: '#2563EB', pointHoverRadius: 7 }]
};

export const weatherImpact = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        { label: 'Crowd Density', data: [2100, 2400, 1800, 2600, 3200, 3800, 3500], backgroundColor: 'rgba(37,99,235,0.7)', borderRadius: 8, barPercentage: 0.6 },
        { label: 'Temperature (°C)', data: [28, 30, 32, 29, 31, 33, 31], backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 8, barPercentage: 0.6 }
    ]
};

export const riskDistribution = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical'],
    datasets: [{ data: [35, 28, 22, 15], backgroundColor: ['#22C55E', '#F59E0B', '#F97316', '#EF4444'], borderColor: '#1F2937', borderWidth: 3, hoverOffset: 8 }]
};

export const aiRecommendations = {
    currentRisk: 'HIGH',
    confidence: 87,
    items: [
        { icon: 'fa-shield-alt', text: 'Deploy additional police units at Dadar and CST stations', priority: 'critical' },
        { icon: 'fa-road', text: 'Open alternate routes via Eastern Express Highway', priority: 'high' },
        { icon: 'fa-car', text: 'Restrict vehicle entry in Marine Drive zone', priority: 'high' },
        { icon: 'fa-bell', text: 'Notify emergency services and keep ambulances on standby', priority: 'critical' },
        { icon: 'fa-broadcast-tower', text: 'Activate public address system for crowd guidance', priority: 'medium' },
        { icon: 'fa-first-aid', text: 'Set up medical aid stations at high-density zones', priority: 'high' }
    ]
};

export const events = [
    { name: 'Ganpati Festival', expectedVisitors: 25000, date: 'Tomorrow', status: 'Active', statusColor: 'var(--success)', icon: 'fa-pray', description: 'Annual Ganesh Chaturthi immersion procession through major city routes' },
    { name: 'Mumbai Marathon', expectedVisitors: 12000, date: 'Aug 10, 2026', status: 'Upcoming', statusColor: 'var(--primary)', icon: 'fa-running', description: 'City-wide marathon spanning from CST to Worli Sea Link' },
    { name: 'College Cultural Festival', expectedVisitors: 7000, date: 'Aug 12, 2026', status: 'Upcoming', statusColor: 'var(--primary)', icon: 'fa-graduation-cap', description: 'Inter-college fest at Bandra Kurla Complex with live performances' }
];

/* ─── Citizen-specific data ─── */
export const citizenKpis = [
    { icon: 'fa-users', title: 'Nearby Crowd', value: 1850, suffix: 'People', change: '+8% from avg', changeDir: 'up', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
    { icon: 'fa-exclamation-triangle', title: 'Risk Level', value: 'MEDIUM', suffix: '', change: 'Moderate', changeDir: 'neutral', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    { icon: 'fa-cloud-sun', title: "Today's Weather", value: 31, suffix: '°C', change: 'Cloudy · 72% Humidity', changeDir: 'neutral', color: '#3B82F6', bg: 'rgba(37,99,235,0.12)' },
    { icon: 'fa-calendar-check', title: 'Nearby Events', value: 2, suffix: 'Events', change: 'Ganpati Festival', changeDir: 'neutral', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' }
];

export const citizenAlerts = [
    { location: 'Marine Drive', desc: 'High crowd density — avoid if possible', risk: 'High', riskColor: '#F97316', time: '10 min ago' },
    { location: 'Dadar Station', desc: 'Moderate crowd at evening rush hour', risk: 'Medium', riskColor: '#F59E0B', time: '25 min ago' },
    { location: 'Bandra', desc: 'Normal pedestrian flow', risk: 'Low', riskColor: '#22C55E', time: '1 hour ago' }
];

export const citizenEvents = [
    { name: 'Ganpati Festival', desc: 'Annual procession through major city routes', visitors: '25,000', date: 'Tomorrow', icon: 'fa-pray', status: 'Active', statusBadge: 'badge--success' },
    { name: 'Mumbai Marathon', desc: 'City-wide marathon from CST to Worli', visitors: '12,000', date: 'Aug 10', icon: 'fa-running', status: 'Upcoming', statusBadge: 'badge--primary' }
];

export const citizenMapMarkers = [
    { lat: 19.0178, lng: 72.8478, name: 'Dadar', crowd: 2450, color: '#F97316' },
    { lat: 18.9440, lng: 72.8237, name: 'Marine Drive', crowd: 3800, color: '#EF4444' },
    { lat: 19.0596, lng: 72.8295, name: 'BKC', crowd: 850, color: '#22C55E' },
    { lat: 19.0544, lng: 72.8406, name: 'Bandra', crowd: 1900, color: '#F97316' },
    { lat: 18.9322, lng: 72.8347, name: 'CST', crowd: 4100, color: '#EF4444' }
];
