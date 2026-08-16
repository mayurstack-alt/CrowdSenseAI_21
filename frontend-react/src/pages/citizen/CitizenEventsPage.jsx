import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../components/pages/Pages.scss';

const EVENTS = [
    {
        title: 'Mumbai Marathon', icon: 'fa-person-running', venue: 'CST — Worli Sea Link',
        expected: '12,000', weather: '29°C Clear', weatherTone: 'yellow', risk: 'Medium', riskTone: 'yellow'
    },
    {
        title: 'College Cultural Fest', icon: 'fa-graduation-cap', venue: 'Bandra Kurla Complex',
        expected: '7,000', weather: '30°C Sunny', weatherTone: 'yellow', risk: 'Low', riskTone: 'green'
    },
    {
        title: 'Independence Day Rally', icon: 'fa-flag', venue: 'Marine Drive',
        expected: '15,000', weather: '28°C Rain', weatherTone: 'orange', risk: 'High', riskTone: 'orange'
    }
];

export default function CitizenEventsPage() {
    const [activeTab, setActiveTab] = useState('Upcoming');

    return (
        <>
            <Navbar breadcrumb="Citizen Portal" breadcrumbSub="Events Near You" role="citizen" />
            <section className="dashboard citizen-page events-page">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-calendar-alt"></i> Events Near You</h2>
                </div>

                <div className="tab-nav" role="tablist" aria-label="Event timeframe">
                    {['Upcoming', 'Today'].map((tab) => (
                        <button
                            className={`tab-nav__item ${activeTab === tab ? 'active' : ''}`}
                            key={tab}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'Upcoming' ? (
                    <div className="events-grid">
                        {EVENTS.map((event) => (
                            <article className="event-detail-card" key={event.title}>
                                <div className="event-detail-card__top">
                                    <div className="event-detail-card__icon"><i className={`fas ${event.icon}`}></i></div>
                                    <div className="event-detail-card__main">
                                        <div className="event-detail-card__heading">
                                            <h3 className="event-detail-card__title">{event.title}</h3>
                                            <span className="event-status">Upcoming</span>
                                        </div>
                                        <p className="event-detail-card__venue"><i className="fas fa-location-dot"></i> {event.venue}</p>
                                    </div>
                                </div>
                                <div className="event-detail-card__stats">
                                    <div className="event-detail-card__stat">
                                        <p className="event-detail-card__stat-label">Expected</p>
                                        <p className="event-detail-card__stat-value event-detail-card__stat-value--blue">{event.expected}</p>
                                    </div>
                                    <div className="event-detail-card__stat">
                                        <p className="event-detail-card__stat-label">Weather</p>
                                        <p className={`event-detail-card__stat-value event-detail-card__stat-value--${event.weatherTone}`}>{event.weather}</p>
                                    </div>
                                    <div className="event-detail-card__stat">
                                        <p className="event-detail-card__stat-label">Risk</p>
                                        <p className={`event-detail-card__stat-value event-detail-card__stat-value--${event.riskTone}`}>{event.risk}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="page-empty-state">
                        <i className="fas fa-calendar-day"></i>
                        <p>No major events are scheduled for today.</p>
                    </div>
                )}
            </section>
            <Footer text="Citizen Portal · Version 1.0 © 2026" />
        </>
    );
}
