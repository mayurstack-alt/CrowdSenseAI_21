import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import { citizenKpis, citizenAlerts, citizenEvents, citizenMapMarkers } from '../../data/mockData';
import '../../components/dashboard/Cards.scss';
import '../../components/dashboard/ChartCard.scss';
import '../../components/pages/Pages.scss';
import 'leaflet/dist/leaflet.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const trendData = {
    labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'],
    datasets: [{
        label: 'Nearby Crowd',
        data: [300, 900, 1400, 1700, 1850, 2200, 2600, 2100],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.4, fill: true, pointRadius: 4
    }]
};

export default function CitizenHome() {
    return (
        <>
            <Navbar breadcrumb="Citizen Portal" breadcrumbSub="Home" role="citizen" />
            <section className="dashboard">
                {/* KPI Cards */}
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

                {/* Emergency Alert */}
                <div className="alert-card" style={{ marginBottom: '24px', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
                    <div className="alert-card__indicator" style={{ background: '#EF4444' }}></div>
                    <div className="alert-card__content">
                        <div className="alert-card__header">
                            <span className="alert-card__title" style={{ color: '#EF4444' }}><i className="fas fa-exclamation-triangle"></i> Emergency Alert</span>
                            <span className="alert-card__time">Just Now</span>
                        </div>
                        <p className="alert-card__desc">High crowd density detected at Marine Drive. Avoid the area if possible. Use alternate routes.</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    {[
                        { to: '/citizen-dashboard/nearby-risk', icon: 'fa-search-location', title: 'Check Risk', bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
                        { to: '/citizen-dashboard/nearby-risk', icon: 'fa-map', title: 'View Map', bg: 'rgba(37,99,235,0.12)', color: '#3B82F6' },
                        { to: '/citizen-dashboard/report-crowd', icon: 'fa-bullhorn', title: 'Report Crowd', bg: 'rgba(245,158,11,0.12)', color: '#F59E0B' },
                        { to: '/citizen-dashboard/safety', icon: 'fa-shield-alt', title: 'Safety Tips', bg: 'rgba(34,197,94,0.12)', color: '#22C55E' }
                    ].map(a => (
                        <Link key={a.title} to={a.to} className="quick-action-card">
                            <div className="quick-action-card__icon" style={{ background: a.bg, color: a.color }}><i className={`fas ${a.icon}`}></i></div>
                            <div className="quick-action-card__title">{a.title}</div>
                        </Link>
                    ))}
                </div>

                {/* Map + Alerts + Events */}
                <div className="citizen-grid">
                    <div className="citizen-map-card">
                        <div className="citizen-map-card__header"><h3><i className="fas fa-map-marked-alt"></i> Nearby Crowd Map</h3></div>
                        <MapContainer center={[19.076, 72.8777]} zoom={12} zoomControl={false} style={{ height: '650px', width: '100%' }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; OSM &copy; CARTO" subdomains="abcd" maxZoom={19} />
                            {citizenMapMarkers.map(m => (
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
                                {citizenEvents.map((e, i) => (
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

                {/* Weather + Trend */}
                <div className="citizen-grid" style={{ marginTop: 0 }}>
                    <div className="chart-card">
                        <div className="chart-card__header"><h4><i className="fas fa-cloud-sun"></i> Today's Weather</h4><span className="chart-card__meta">Mumbai</span></div>
                        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ fontSize: '3rem', color: '#F59E0B' }}><i className="fas fa-cloud-sun"></i></div>
                            <div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em' }}>31°C</div>
                                <div style={{ fontSize: '0.82rem', color: '#6B7280' }}>Partly Cloudy · Humidity 72%</div>
                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>Wind: 12 km/h NW · UV Index: 6</div>
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
