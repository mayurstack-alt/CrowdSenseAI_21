import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import ScrollAnimation from '../../components/common/ScrollAnimation';
import { NavLink } from 'react-router-dom';
import { kpiCards, alerts, mapMarkers, aiRecommendations, events } from '../../data/mockData';
import '../../components/dashboard/Cards.scss';
import '../../components/pages/Pages.scss';

const previewAlerts = alerts.slice(0, 5);
const previewRecommendations = aiRecommendations.items.slice(0, 2);
const previewEvents = events.slice(0, 3);

function riskBadgeClass(risk) {
    return risk === 'Critical' ? 'badge--critical' : risk === 'High' ? 'badge--danger' : risk === 'Medium' ? 'badge--warning' : 'badge--success';
}

function markerPosition(marker) {
    const left = ((marker.lng - 72.80) / 0.12) * 100;
    const top = (1 - (marker.lat - 18.91) / 0.22) * 100;
    return { left: `${Math.max(5, Math.min(95, left))}%`, top: `${Math.max(8, Math.min(92, top))}%` };
}

export default function AuthorityDashboard() {
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
                                {mapMarkers.map(marker => <span key={marker.name} className="dashboard-map-preview__marker" title={`${marker.name}: ${marker.crowd.toLocaleString()} people`} style={{ ...markerPosition(marker), backgroundColor: marker.color }}></span>)}
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
                                {previewAlerts.map(alert => (
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
                                {previewEvents.map(event => (
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
