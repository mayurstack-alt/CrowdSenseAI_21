import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../components/pages/Pages.scss';

const RISK_ZONES = [
    { name: 'Marine Drive', risk: '92%', level: 'Critical', distance: '2.1 km', crowd: '3,800 people' },
    { name: 'CST Station', risk: '88%', level: 'High', distance: '1.4 km', crowd: '3,200 people' },
    { name: 'Dadar Station', risk: '72%', level: 'High', distance: '3.6 km', crowd: '2,700 people' },
    { name: 'Juhu Beach', risk: '65%', level: 'Medium', distance: '5.2 km', crowd: '1,950 people' },
    { name: 'Bandra Station', risk: '55%', level: 'Medium', distance: '4.1 km', crowd: '1,400 people' }
];

export default function NearbyRiskPage() {
    return (
        <>
            <Navbar breadcrumb="Citizen Portal" breadcrumbSub="Nearby Risk Zones" role="citizen" />
            <section className="dashboard citizen-page nearby-risk-page">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-map-marker-alt"></i> Nearby Risk Zones</h2>
                </div>
                <div className="risk-list" aria-label="Nearby crowd risk zones">
                    {RISK_ZONES.map((zone) => (
                        <article className="risk-item" key={zone.name}>
                            <div className={`risk-item__indicator risk-item__indicator--${zone.level.toLowerCase()}`}>
                                {zone.risk}
                            </div>
                            <div className="risk-item__info">
                                <h3 className="risk-item__name">{zone.name}</h3>
                                <div className="risk-item__detail">
                                    <span><i className="fas fa-arrow-up-right-from-square"></i> {zone.distance}</span>
                                    <span><i className="fas fa-users"></i> {zone.crowd}</span>
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
