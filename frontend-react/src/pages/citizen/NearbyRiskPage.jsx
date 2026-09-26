import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getNearbyRisk } from '../../services/api';
import '../../components/pages/Pages.scss';

export default function NearbyRiskPage() {
    const [riskZones, setRiskZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRisk = async () => {
            try {
                const data = await getNearbyRisk();
                setRiskZones(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRisk();
    }, []);

    return (
        <>
            <Navbar breadcrumb="Citizen Portal" breadcrumbSub="Nearby Risk Zones" role="citizen" />
            <section className="dashboard citizen-page nearby-risk-page">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-map-marker-alt"></i> Nearby Risk Zones</h2>
                </div>
                {loading && <p>Loading nearby risk zones...</p>}
                {error && <p className="error-text">Failed to load: {error}</p>}
                {!loading && !error && riskZones.length === 0 && <p>No risk zones found.</p>}
                
                <div className="risk-list" aria-label="Nearby crowd risk zones">
                    {riskZones.map((zone) => (
                        <article className="risk-item" key={zone.location_id}>
                            <div className={`risk-item__indicator risk-item__indicator--${zone.level.toLowerCase()}`} style={{ backgroundColor: zone.color }}>
                                {zone.risk}%
                            </div>
                            <div className="risk-item__info">
                                <h3 className="risk-item__name">{zone.name}</h3>
                                <div className="risk-item__detail">
                                    <span><i className="fas fa-arrow-up-right-from-square"></i> {zone.distance}</span>
                                    <span><i className="fas fa-users"></i> {zone.crowd.toLocaleString()} people</span>
                                </div>
                            </div>
                            <span className={`risk-item__badge risk-item__badge--${zone.level.toLowerCase()}`}>{zone.level}</span>
                        </article>
                    ))}
                </div>
            </section>
            <Footer text="Citizen Portal · Version 1.0 © 2026" />
        </>
    );
}
