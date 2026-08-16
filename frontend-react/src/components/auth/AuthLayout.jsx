import './AuthLayout.scss';

const FEATURES = [
    {
        icon: 'fa-location-dot',
        title: 'Real-Time Heatmaps',
        description: 'Predictive density maps across major transit hubs and venues.'
    },
    {
        icon: 'fa-bolt',
        title: 'Automated Action Alerts',
        description: 'Prescriptive routing and emergency dispatch advisories.'
    },
    {
        icon: 'fa-shield-halved',
        title: 'Role-Governed Access',
        description: 'Secure portal management for every city stakeholder.'
    }
];

export default function AuthLayout({ children }) {
    return (
        <main className="auth-page">
            <div className="auth-page__ambient auth-page__ambient--blue"></div>
            <div className="auth-page__ambient auth-page__ambient--violet"></div>
            <div className="auth-shell">
                <section className="auth-page__left" aria-label="CrowdSense AI overview">
                    <div className="auth-live-badge"><span></span> Live AI Crowd Grid Active</div>

                    <div className="auth-left__brand">
                        <span className="auth-left__logo-icon"><i className="fas fa-brain"></i></span>
                        <span>CrowdSense AI</span>
                    </div>

                    <h1 className="auth-left__title">Predictive Crowd Dynamics <em>&amp; Risk Mitigation</em></h1>
                    <p className="auth-left__tagline">For smarter, safer cities—before a crowd becomes a crisis.</p>

                    <div className="auth-feature-list">
                        {FEATURES.map((feature) => (
                            <article className="auth-feature-card" key={feature.title}>
                                <span className="auth-feature-card__icon"><i className={`fas ${feature.icon}`}></i></span>
                                <span>
                                    <strong>{feature.title}</strong>
                                    <small>{feature.description}</small>
                                </span>
                            </article>
                        ))}
                    </div>

                    <p className="auth-left__system"><i className="fas fa-circle"></i> System Version 1.0 <b>•</b> Mumbai Metro Grid <b>•</b> 2026</p>
                </section>

                <section className="auth-page__right">
                    {children}
                </section>
            </div>
        </main>
    );
}
