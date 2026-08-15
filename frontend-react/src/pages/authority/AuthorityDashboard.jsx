import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import ScrollAnimation from '../../components/common/ScrollAnimation';
import { kpiCards, alerts, mapMarkers, historicalCrowdTrend, crowdPrediction, weatherImpact, riskDistribution, aiRecommendations, events } from '../../data/mockData';
import '../../components/dashboard/Cards.scss';
import '../../components/dashboard/ChartCard.scss';
import '../../components/pages/Pages.scss';
import 'leaflet/dist/leaflet.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const gridColor = 'rgba(55,65,81,0.4)';
const tickColor = '#9CA3AF';
const tooltipCfg = { backgroundColor: 'rgba(31,41,55,0.95)', titleColor: '#F9FAFB', bodyColor: '#9CA3AF', borderColor: 'rgba(55,65,81,0.8)', borderWidth: 1, cornerRadius: 8, padding: 12 };
const chartScales = {
    x: { grid: { color: gridColor, drawBorder: false }, ticks: { color: tickColor } },
    y: { grid: { color: gridColor, drawBorder: false }, ticks: { color: tickColor, callback: v => v >= 1000 ? (v / 1000) + 'k' : v }, beginAtZero: true }
};

function getRadius(crowd) {
    if (crowd >= 3000) return 14;
    if (crowd >= 2000) return 12;
    if (crowd >= 1000) return 10;
    return 8;
}

export default function AuthorityDashboard() {
    const confidenceRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (confidenceRef.current) confidenceRef.current.style.width = aiRecommendations.confidence + '%';
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <Navbar breadcrumb="Command Center" breadcrumbSub="City Overview" role="authority" />
            <section className="dashboard">
                {/* KPI Grid */}
                <div className="kpi-grid">
                    {kpiCards.map((card, i) => (
                        <div key={card.id} className="kpi-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="kpi-card__header">
                                <div className="kpi-card__icon" style={{ background: card.bgGradient, color: card.color }}><i className={`fas ${card.icon}`}></i></div>
                                <button className="kpi-card__menu"><i className="fas fa-ellipsis-h"></i></button>
                            </div>
                            <div className="kpi-card__title">{card.title}</div>
                            <div className="kpi-card__value">
                                <span className="number" style={{ color: card.color }}><AnimatedCounter target={card.value} /></span>
                                {card.suffix && <span className="unit">{card.suffix}</span>}
                            </div>
                            <div className={`kpi-card__change kpi-card__change--${card.changeDir}`}>
                                {card.changeDir === 'up' && <i className="fas fa-arrow-up"></i>}
                                {card.change}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map + Alerts */}
                <div className="middle-section">
                    <ScrollAnimation>
                        <div className="map-container">
                            <div className="map-container__header"><h3><i className="fas fa-map-marked-alt"></i> Live Crowd Density Map</h3></div>
                            <div style={{ position: 'relative' }}>
                                <MapContainer center={[19.076, 72.8777]} zoom={12} zoomControl={false} style={{ height: '400px', width: '100%' }}>
                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; OSM &copy; CARTO" subdomains="abcd" maxZoom={19} />
                                    {mapMarkers.map(m => (
                                        <CircleMarker key={m.name} center={[m.lat, m.lng]} radius={getRadius(m.crowd)} fillColor={m.color} fillOpacity={0.7} color={m.color} weight={2} opacity={0.9}>
                                            <Popup className="crowd-popup" closeButton={false}>
                                                <div style={{ fontFamily: "'Inter', sans-serif", padding: '4px' }}>
                                                    <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px', color: '#F9FAFB' }}>{m.name}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: m.color }}></span>
                                                        <span style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'capitalize' }}>{m.level} Density</span>
                                                    </div>
                                                    <div style={{ fontSize: '18px', fontWeight: 800, color: m.color }}>{m.crowd.toLocaleString()}</div>
                                                    <div style={{ fontSize: '10px', color: '#6B7280' }}>people currently</div>
                                                </div>
                                            </Popup>
                                        </CircleMarker>
                                    ))}
                                </MapContainer>
                                <div className="map-legend">
                                    <div className="map-legend__title">Crowd Density</div>
                                    {[{ color: '#22C55E', label: 'Low (< 1,000)' }, { color: '#F59E0B', label: 'Medium (1,000–2,000)' }, { color: '#F97316', label: 'High (2,000–3,000)' }, { color: '#EF4444', label: 'Critical (> 3,000)' }].map(l => (
                                        <div className="map-legend__item" key={l.label}><div className="map-legend__dot" style={{ background: l.color }}></div><span>{l.label}</span></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation>
                        <div className="alerts-panel">
                            <div className="alerts-panel__header"><h3><i className="fas fa-bell"></i> Real Time Alerts</h3></div>
                            <div className="alerts-table">
                                <table>
                                    <thead><tr><th>Time</th><th>Location</th><th>Risk</th><th>Description</th></tr></thead>
                                    <tbody>
                                        {alerts.map((a, i) => {
                                            const bc = a.risk === 'Critical' ? 'badge--critical' : a.risk === 'High' ? 'badge--danger' : a.risk === 'Medium' ? 'badge--warning' : 'badge--success';
                                            return (
                                                <tr key={i}>
                                                    <td className="td-time">{a.time}</td>
                                                    <td className="td-location">{a.location}</td>
                                                    <td><span className={`badge ${bc}`}>{a.risk}</span></td>
                                                    <td className="td-desc" title={a.description}>{a.description}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>

                {/* Charts */}
                <div className="section-header"><h3><i className="fas fa-chart-area"></i> Analytics & Predictions</h3></div>
                <div className="charts-grid">
                    <ScrollAnimation><div className="chart-card"><div className="chart-card__header"><h4><i className="fas fa-chart-line"></i> Historical Crowd Trend</h4><span className="chart-card__meta">Today vs Yesterday</span></div><div className="chart-card__body"><Line data={historicalCrowdTrend} options={{ responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { position: 'top', align: 'end' }, tooltip: tooltipCfg }, scales: chartScales }} /></div></div></ScrollAnimation>
                    <ScrollAnimation><div className="chart-card"><div className="chart-card__header"><h4><i className="fas fa-brain"></i> Crowd Prediction</h4><span className="chart-card__meta">Next 30 minutes</span></div><div className="chart-card__body"><Line data={crowdPrediction} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tooltipCfg }, scales: chartScales }} /></div></div></ScrollAnimation>
                    <ScrollAnimation><div className="chart-card"><div className="chart-card__header"><h4><i className="fas fa-cloud-sun"></i> Weather Impact</h4><span className="chart-card__meta">This Week</span></div><div className="chart-card__body"><Bar data={weatherImpact} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'end' }, tooltip: tooltipCfg }, scales: chartScales }} /></div></div></ScrollAnimation>
                    <ScrollAnimation><div className="chart-card"><div className="chart-card__header"><h4><i className="fas fa-shield-alt"></i> Risk Distribution</h4><span className="chart-card__meta">All Zones</span></div><div className="chart-card__body"><Doughnut data={riskDistribution} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom' }, tooltip: tooltipCfg } }} /></div></div></ScrollAnimation>
                </div>

                {/* AI + Events */}
                <div className="bottom-section">
                    <ScrollAnimation>
                        <div className="ai-panel">
                            <div className="ai-panel__header"><h3><i className="fas fa-robot"></i> AI Recommendations</h3><span className="badge badge--danger">LIVE</span></div>
                            <div className="ai-panel__risk">
                                <div className="ai-panel__risk-badge"><span className="level">HIGH</span><span className="sublabel">Risk Level</span></div>
                                <div className="ai-panel__risk-info">
                                    <h4>Elevated Risk — Immediate Action Required</h4>
                                    <p>AI models predict crowd density will exceed safe thresholds in 3 zones within the next 30 minutes.</p>
                                    <div className="ai-panel__confidence">
                                        <span>AI Confidence</span>
                                        <div className="ai-panel__confidence-bar"><div ref={confidenceRef} className="ai-panel__confidence-bar-fill" style={{ width: '0%' }}></div></div>
                                        <span>87%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="ai-panel__recommendations">
                                {aiRecommendations.items.map((item, i) => {
                                    const ic = item.priority === 'critical' ? 'ai-panel__rec-icon--critical' : item.priority === 'high' ? 'ai-panel__rec-icon--high' : 'ai-panel__rec-icon--medium';
                                    return (<div className="ai-panel__rec-item" key={i}><div className={`ai-panel__rec-icon ${ic}`}><i className={`fas ${item.icon}`}></i></div><span>{item.text}</span></div>);
                                })}
                            </div>
                        </div>
                    </ScrollAnimation>
                    <ScrollAnimation>
                        <div className="events-panel">
                            <div className="events-panel__header"><h3><i className="fas fa-calendar-check"></i> Upcoming Events</h3><span className="badge badge--warning">3 Active</span></div>
                            <div className="events-panel__list">
                                {events.map((ev, i) => (
                                    <div className="event-card" key={i}>
                                        <div className="event-card__icon"><i className={`fas ${ev.icon}`}></i></div>
                                        <div className="event-card__info">
                                            <h4>{ev.name} <span className={`badge ${ev.status === 'Active' ? 'badge--success' : 'badge--primary'}`}>{ev.status}</span></h4>
                                            <p className="event-card__desc">{ev.description}</p>
                                            <div className="event-card__meta">
                                                <span><i className="fas fa-users"></i> {ev.expectedVisitors.toLocaleString()} expected</span>
                                                <span><i className="fas fa-calendar-alt"></i> {ev.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </section>
            <Footer text="Smart City Crowd Intelligence Platform" />
        </>
    );
}
