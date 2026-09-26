import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import ScrollAnimation from '../../components/common/ScrollAnimation';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getNearbyRisk } from '../../services/api';
import '../../components/dashboard/Cards.scss';
import '../../components/pages/Pages.scss';

function riskBadgeClass(risk) {
    return risk === 'Critical' ? 'badge--critical' : risk === 'High' ? 'badge--danger' : risk === 'Medium' ? 'badge--warning' : 'badge--success';
}

function markerPosition(marker) {
    const left = ((marker.lng - 72.80) / 0.12) * 100;
    const top = (1 - (marker.lat - 18.91) / 0.22) * 100;
    return { left: `${Math.max(5, Math.min(95, left))}%`, top: `${Math.max(8, Math.min(92, top))}%` };
}

export default function AuthorityDashboard() {
    const [riskData, setRiskData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNearbyRisk()
            .then((data) => setRiskData(data || []))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    const kpiCards = [
        { id: 'current-crowd', icon: 'fa-users', title: 'Current Crowd', value: riskData.reduce((sum, item) => sum + (item.crowd || 0), 0), suffix: 'People', change: riskData.length ? 'Live backend' : 'No data', changeDir: 'up', color: 'var(--success)', bgGradient: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 100%)' },
        { id: 'predicted-crowd', icon: 'fa-chart-line', title: 'Predicted Crowd', value: riskData[0]?.crowd || 0, suffix: 'People', change: 'Next 30 mins', changeDir: 'neutral', color: 'var(--primary)', bgGradient: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0.05) 100%)' },
        { id: 'risk-level', icon: 'fa-exclamation-triangle', title: 'Risk Level', value: riskData[0]?.level || 'N/A', suffix: '', change: riskData[0] ? 'Elevated' : 'Waiting', changeDir: 'danger', color: 'var(--danger)', bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)' },
        { id: 'weather', icon: 'fa-cloud-sun', title: 'Scanned Zones', value: riskData.length, suffix: 'Zones', change: riskData.length ? 'Updated live' : 'Offline', changeDir: 'neutral', color: 'var(--warning)', bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)' },
    ];

    const previewAlerts = (riskData.length ? riskData : []).slice(0, 5).map((zone) => ({
        time: `${zone.distance_km ?? 0} km`,
        location: zone.name,
        description: `${zone.capacity_utilization_pct ?? 0}% utilization`,
        risk: zone.level,
    }));

    const previewRecommendations = [
        { text: riskData[0]?.recommended_action || 'Monitor nearby areas and verify live conditions.', priority: 'high' },
        { text: 'Review capacity thresholds and rapidly rising hotspots.', priority: 'medium' },
    ];

    const previewEvents = [
        { name: 'Live risk scan', expectedVisitors: riskData.reduce((sum, item) => sum + (item.crowd || 0), 0), date: 'Current', status: 'Active' },
        { name: 'Transit pattern check', expectedVisitors: Math.max(1200, riskData.length * 500), date: 'Next 30 mins', status: 'Upcoming' },
    ];

    return (
        <>
            <Navbar breadcrumb="Command Center" breadcrumbSub="City Overview" role="authority" />
            <section className="dashboard">
                <div className="page-header dashboard-home-header">
                    <div>
                        <h2 className="page-header__title"><i className="fas fa-th-large"></i> City Overview</h2>
                        <p className="dashboard-home-header__subtext">A quick read of current conditions across monitored zones.</p>
                    </div>
                </div>

                {loading ? <p>Loading live dashboard data...</p> : null}

                <div className="kpi-grid">
                    {kpiCards.map((card, index) => (
                        <div key={card.id} className="kpi-card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="kpi-card__header">
                                <div className="kpi-card__icon" style={{ background: card.bgGradient, color: card.color }}><i className={`fas ${card.icon}`}></i></div>
                            </div>
                            <div className="kpi-card__title">{card.title}</div>
                            <div className="kpi-card__value">
                                <span className="number" style={{ color: card.color }}><AnimatedCounter target={card.value} /></span>
                                {card.suffix && <span className="unit">{card.suffix}</span>}
                            </div>
                            <div className={`kpi-card__change kpi-card__change--${card.changeDir}`}>{card.change}</div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-preview-grid">
                    <ScrollAnimation>
                        <section className="dashboard-preview-panel dashboard-map-preview">
                            <div className="dashboard-preview-panel__header">
                                <div><h3><i className="fas fa-map-marked-alt"></i> Live Crowd Density Map</h3><span>Embedded live overview</span></div>
                                <NavLink className="dashboard-view-all" to="/authority-dashboard/heatmap">View All <i className="fas fa-arrow-right"></i></NavLink>
                            </div>
                            <div className="dashboard-map-preview__canvas" aria-label="Static preview of current crowd density zones">
                                <div className="dashboard-map-preview__roads dashboard-map-preview__roads--one"></div>
                                <div className="dashboard-map-preview__roads dashboard-map-preview__roads--two"></div>
                                {(riskData.length ? riskData : []).map((marker) => (
                                    <span key={marker.location_id} className="dashboard-map-preview__marker" title={`${marker.name}: ${marker.crowd.toLocaleString()} people`} style={{ ...markerPosition({ lat: marker.lat, lng: marker.lng }), backgroundColor: marker.color }}></span>
                                ))}
                                <span className="dashboard-map-preview__label dashboard-map-preview__label--north">North Mumbai</span>
                                <span className="dashboard-map-preview__label dashboard-map-preview__label--south">South Mumbai</span>
                            </div>
                        </section>
                    </ScrollAnimation>

                    <ScrollAnimation>
                        <section className="dashboard-preview-panel">
                            <div className="dashboard-preview-panel__header">
                                <div><h3><i className="fas fa-bell"></i> Real-Time Alerts</h3><span>Latest {previewAlerts.length} alerts</span></div>
                                <NavLink className="dashboard-view-all" to="/authority-dashboard/alerts">View All <i className="fas fa-arrow-right"></i></NavLink>
                            </div>
                            <div className="dashboard-preview-list">
                                {previewAlerts.map((alert) => (
                                    <div className="dashboard-preview-row dashboard-preview-row--alert" key={`${alert.time}-${alert.location}`}>
                                        <div><strong>{alert.location}</strong><span>{alert.time} · {alert.description}</span></div>
                                        <span className={`badge ${riskBadgeClass(alert.risk)}`}>{alert.risk}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </ScrollAnimation>

                    <ScrollAnimation>
                        <section className="dashboard-preview-panel">
                            <div className="dashboard-preview-panel__header">
                                <div><h3><i className="fas fa-robot"></i> AI Recommendations</h3><span>Top actions for current risk</span></div>
                                <NavLink className="dashboard-view-all" to="/authority-dashboard/recommendations">View All <i className="fas fa-arrow-right"></i></NavLink>
                            </div>
                            <div className="dashboard-preview-list">
                                {previewRecommendations.map((recommendation, index) => (
                                    <div className="dashboard-preview-row dashboard-preview-row--recommendation" key={recommendation.text}>
                                        <div><strong><span className="dashboard-preview-row__index">0{index + 1}</span>{recommendation.text}</strong><span>{recommendation.priority} priority</span></div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </ScrollAnimation>

                    <ScrollAnimation>
                        <section className="dashboard-preview-panel">
                            <div className="dashboard-preview-panel__header">
                                <div><h3><i className="fas fa-calendar-check"></i> Upcoming Events</h3><span>Next {previewEvents.length} scheduled events</span></div>
                                <NavLink className="dashboard-view-all" to="/authority-dashboard/events">View All <i className="fas fa-arrow-right"></i></NavLink>
                            </div>
                            <div className="dashboard-preview-list">
                                {previewEvents.map((event) => (
                                    <div className="dashboard-preview-row" key={event.name}>
                                        <div><strong>{event.name}</strong><span>{event.date} · {event.expectedVisitors.toLocaleString()} expected</span></div>
                                        <span className={`badge ${event.status === 'Active' ? 'badge--success' : 'badge--primary'}`}>{event.status}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </ScrollAnimation>
                </div>
            </section>
            <Footer text="Smart City Crowd Intelligence Platform" />
        </>
    );
}
