import ScrollAnimation from '../common/ScrollAnimation';

const benefits = [
    { icon: 'fa-clock', title: 'Real-Time Monitoring', desc: 'Live crowd density tracking with sub-second update latency across all monitored zones.' },
    { icon: 'fa-bullseye', title: '87% Prediction Accuracy', desc: 'Industry-leading LSTM models deliver reliable 30-minute crowd forecasts for proactive response.' },
    { icon: 'fa-bell', title: 'Instant Alerts', desc: 'Multi-channel notifications ensure authorities and citizens are informed the moment risk levels change.' },
    { icon: 'fa-users', title: 'Dual Dashboard', desc: 'Separate portals for authorities (command center) and citizens (safety companion) with role-based features.' },
    { icon: 'fa-mobile-alt', title: 'Fully Responsive', desc: 'Access dashboards seamlessly from desktop command centers, tablets on the field, or mobile phones.' },
    { icon: 'fa-file-alt', title: 'Automated Reports', desc: 'Generate PDF & CSV reports on crowd trends, risk analysis, and prediction accuracy on demand.' }
];

export default function Benefits() {
    return (
        <section className="landing-section">
            <div className="landing-section__header">
                <div className="landing-section__tag"><i className="fas fa-shield-alt"></i> Benefits</div>
                <h2 className="landing-section__title">Why Choose CrowdSense AI</h2>
                <p className="landing-section__desc">Enterprise-grade crowd intelligence built for modern smart city operations.</p>
            </div>
            <div className="benefits-grid">
                {benefits.map(b => (
                    <ScrollAnimation key={b.title}>
                        <div className="benefit-item">
                            <div className="benefit-item__icon"><i className={`fas ${b.icon}`}></i></div>
                            <div>
                                <h4 className="benefit-item__title">{b.title}</h4>
                                <p className="benefit-item__desc">{b.desc}</p>
                            </div>
                        </div>
                    </ScrollAnimation>
                ))}
            </div>
        </section>
    );
}
