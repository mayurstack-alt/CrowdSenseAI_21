import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { getNearbyRisk, getLiveWeather } from '../../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import '../../components/dashboard/Cards.scss';
import '../../components/dashboard/ChartCard.scss';
import '../../components/pages/Pages.scss';
import 'leaflet/dist/leaflet.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const defaultWeather = {
    weather: 'Partly Cloudy',
    temperature: 31,
    humidity: 72,
    wind_speed: 12,
};

export default function CitizenHome() {
    const [mapMarkers, setMapMarkers] = useState([]);
    const [weather, setWeather] = useState(defaultWeather);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getNearbyRisk(),
            getLiveWeather(19.076, 72.8777)
        ])
            .then(([riskData, weatherData]) => {
                const markers = riskData.map((d) => ({
                    name: d.name,
                    lat: d.lat,
                    lng: d.lng,
                    crowd: d.crowd,
                    color: d.color,
                }));
                setMapMarkers(markers);
                if (weatherData) setWeather(weatherData);
            })
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    const riskSummary = mapMarkers.length
        ? mapMarkers.reduce((acc, item) => {
            acc.total += item.crowd;
            acc.highest = Math.max(acc.highest, item.crowd);
            return acc;
        }, { total: 0, highest: 0 })
        : { total: 0, highest: 0 };

    const citizenKpis = [
        { icon: 'fa-users', title: 'Nearby Crowd', value: Math.round(riskSummary.total / Math.max(mapMarkers.length, 1)), suffix: 'People', change: mapMarkers.length ? '+live' : 'No live data', changeDir: 'up', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
        { icon: 'fa-exclamation-triangle', title: 'Risk Level', value: mapMarkers.length ? 'LIVE' : 'N/A', suffix: '', change: mapMarkers.length ? 'Updated from backend' : 'No data', changeDir: 'neutral', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
        { icon: 'fa-cloud-sun', title: "Today's Weather", value: Math.round(weather.temperature || defaultWeather.temperature), suffix: '°C', change: `${weather.weather || 'Clear'} · ${weather.humidity || 72}% humidity`, changeDir: 'neutral', color: '#3B82F6', bg: 'rgba(37,99,235,0.12)' },
        { icon: 'fa-calendar-check', title: 'Nearby Events', value: mapMarkers.length ? 2 : 0, suffix: 'Events', change: mapMarkers.length ? 'Real-time zones' : 'No data', changeDir: 'neutral', color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
    ];

    const citizenAlerts = mapMarkers.slice(0, 3).map((m, index) => ({
        location: m.name,
        desc: `${m.crowd.toLocaleString()} people currently in this area`,
        risk: index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low',
        riskColor: index === 0 ? '#F97316' : index === 1 ? '#F59E0B' : '#22C55E',
        time: 'Live',
    }));

    const trendData = {
        labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'],
        datasets: [{
            label: 'Nearby Crowd',
            data: mapMarkers.length ? mapMarkers.map((m, idx) => Math.max(300, (m.crowd * (idx + 1)) / 2)) : [300, 900, 1400, 1700, 1850, 2200, 2600, 2100],
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37,99,235,0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
        }],
    };

    return (
        <>
            <Navbar breadcrumb="Citizen Portal" breadcrumbSub="Home" role="citizen" />
            <section className="dashboard">
                <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {citizenKpis.map((k, i) => (
                        <div key={k.title} className="kpi-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="kpi-card__header">
                                <div className="kpi-card__icon" style={{ background: k.bg, color: k.color }}><i className={`fas ${k.icon}`}></i></div>
                            </div>
                            <div className="kpi-card__title">{k.title}</div>
                            <div className="kpi-card__value">
                                <span className="number" style={{ color: k.color }}><AnimatedCounter target={k.value} /></span>
                                {k.suffix && <span className="unit">{k.suffix}</span>}
                            </div>
                            <div className={`kpi-card__change kpi-card__change--${k.changeDir}`}>
                                {k.changeDir === 'up' && <i className="fas fa-arrow-up"></i>}
                                {k.change}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="alert-card" style={{ marginBottom: '24px', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
                    <div className="alert-card__indicator" style={{ background: mapMarkers.length ? '#EF4444' : '#94a3b8' }}></div>
                    <div className="alert-card__content">
                        <div className="alert-card__header">
                            <span className="alert-card__title" style={{ color: '#EF4444' }}><i className="fas fa-exclamation-triangle"></i> {mapMarkers.length ? 'Live Risk Alert' : 'No live alert'}</span>
                            <span className="alert-card__time">{mapMarkers.length ? 'Now' : 'Offline'}</span>
                        </div>
                        <p className="alert-card__desc">
                            {mapMarkers.length
                                ? `Highest observed crowd is ${riskSummary.highest.toLocaleString()} people near ${mapMarkers[0].name}.`
                                : 'No live backend data is currently available for this location.'}
                        </p>
                    </div>
                </div>

                <div className="quick-actions">
                    {[
                        { to: '/citizen-dashboard/nearby-risk', icon: 'fa-search-location', title: 'Check Risk', bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
                        { to: '/citizen-dashboard/nearby-risk', icon: 'fa-map', title: 'View Map', bg: 'rgba(37,99,235,0.12)', color: '#3B82F6' },
                        { to: '/citizen-dashboard/report-crowd', icon: 'fa-bullhorn', title: 'Report Crowd', bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
                        { to: '/citizen-dashboard/safety', icon: 'fa-shield-alt', title: 'Safety Tips', bg: 'rgba(34,197,94,0.12)', color: '#22C55E' }
                    ].map((a) => (
                        <Link key={a.title} to={a.to} className="quick-action-card">
                            <div className="quick-action-card__icon" style={{ background: a.bg, color: a.color }}><i className={`fas ${a.icon}`}></i></div>
                            <div className="quick-action-card__title">{a.title}</div>
                        </Link>
                    ))}
                </div>

                <div className="citizen-grid">
                    <div className="citizen-map-card">
                        <div className="citizen-map-card__header"><h3><i className="fas fa-map-marked-alt"></i> Nearby Crowd Map</h3></div>
                        <MapContainer center={[19.076, 72.8777]} zoom={12} zoomControl={false} style={{ height: '650px', width: '100%' }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; OSM &copy; CARTO" subdomains="abcd" maxZoom={19} />
                            {mapMarkers.map((m) => (
                                <CircleMarker key={m.name} center={[m.lat, m.lng]} radius={10} fillColor={m.color} fillOpacity={0.7} color={m.color} weight={2}>
                                    <Popup className="crowd-popup" closeButton={false}>
                                        <div style={{ fontFamily: "'Inter', sans-serif", padding: '4px' }}>
                                            <b style={{ color: '#F9FAFB' }}>{m.name}</b><br />
                                            <span style={{ fontSize: '18px', fontWeight: 800, color: m.color }}>{m.crowd.toLocaleString()}</span><br />
                                            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>people currently</span>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    </div>
                    <div>
                        <div className="alerts-panel" style={{ marginBottom: '20px' }}>
                            <div className="alerts-panel__header"><h3><i className="fas fa-bell"></i> Recent Alerts</h3></div>
                            <div style={{ padding: '12px' }}>
                                {citizenAlerts.map((a, i) => (
                                    <div key={i} className="alert-card" style={{ marginBottom: '8px' }}>
                                        <div className="alert-card__indicator" style={{ background: a.riskColor }}></div>
                                        <div className="alert-card__content">
                                            <div className="alert-card__header">
                                                <span className="alert-card__title">{a.location}</span>
                                                <span className="alert-card__time">{a.time}</span>
                                            </div>
                                            <p className="alert-card__desc">{a.desc}</p>
                                            <span className="badge" style={{ background: a.riskColor + '20', color: a.riskColor }}>{a.risk}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="events-panel">
                            <div className="events-panel__header"><h3><i className="fas fa-calendar-check"></i> Upcoming Events</h3></div>
                            <div className="events-panel__list">
                                {[
                                    { name: 'Festival activity', desc: 'High footfall expected in public zones', visitors: '25,000', date: 'Tomorrow', icon: 'fa-pray', status: 'Live', statusBadge: 'badge--success' },
                                    { name: 'Transit rush', desc: 'Peak commuter flow across station corridors', visitors: '12,000', date: 'This evening', icon: 'fa-subway', status: 'Active', statusBadge: 'badge--primary' }
                                ].map((e, i) => (
                                    <div className="event-card" key={i}>
                                        <div className="event-card__icon"><i className={`fas ${e.icon}`}></i></div>
                                        <div className="event-card__info">
                                            <h4>{e.name} <span className={`badge ${e.statusBadge}`}>{e.status}</span></h4>
                                            <p className="event-card__desc">{e.desc}</p>
                                            <div className="event-card__meta">
                                                <span><i className="fas fa-users"></i> {e.visitors} expected</span>
                                                <span><i className="fas fa-calendar-alt"></i> {e.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="citizen-grid" style={{ marginTop: 0 }}>
                    <div className="chart-card">
                        <div className="chart-card__header"><h4><i className="fas fa-cloud-sun"></i> Today's Weather</h4><span className="chart-card__meta">Mumbai</span></div>
                        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ fontSize: '3rem', color: '#F59E0B' }}><i className="fas fa-cloud-sun"></i></div>
                            <div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>{Math.round(weather.temperature || defaultWeather.temperature)}°C</div>
                                <div style={{ fontSize: '0.82rem', color: '#6B7280' }}>{weather.weather || defaultWeather.weather} · Humidity {weather.humidity || defaultWeather.humidity}%</div>
                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>Wind: {weather.wind_speed || defaultWeather.wind_speed} km/h · Live backend data</div>
                            </div>
                        </div>
                    </div>
                    <div className="chart-card">
                        <div className="chart-card__header"><h4><i className="fas fa-chart-area"></i> Today's Crowd Trend</h4><span className="chart-card__meta">Nearby Areas</span></div>
                        <div className="chart-card__body">
                            <Line data={trendData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(55,65,81,0.4)' }, ticks: { color: '#9CA3AF' } }, y: { grid: { color: 'rgba(55,65,81,0.4)' }, ticks: { color: '#9CA3AF', callback: v => v >= 1000 ? (v / 1000) + 'k' : v }, beginAtZero: true } } }} />
                        </div>
                    </div>
                </div>
            </section>
            <Footer text="Citizen Portal · Version 1.0 © 2026" />
        </>
    );
}
