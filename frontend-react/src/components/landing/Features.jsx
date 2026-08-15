import ScrollAnimation from '../common/ScrollAnimation';
import './LandingSections.scss';

const features = [
    { icon: 'fa-brain', title: 'AI Crowd Prediction', desc: 'LSTM neural networks predict crowd density 30 minutes ahead with 87% accuracy using historical patterns and real-time data.', color: '#3B82F6' },
    { icon: 'fa-map-marked-alt', title: 'Live Heatmap', desc: 'Interactive crowd density heatmap with color-coded zones, real-time updates, and zone-level drill-down analytics.', color: '#22C55E' },
    { icon: 'fa-exclamation-triangle', title: 'Risk Alert System', desc: 'Automated multi-level alerts (Critical, High, Medium, Low) with instant notifications to authorities and citizens.', color: '#EF4444' },
    { icon: 'fa-cloud-sun', title: 'Weather Integration', desc: 'Correlates weather data with crowd patterns to provide context-aware predictions and safety recommendations.', color: '#F59E0B' },
    { icon: 'fa-robot', title: 'AI Recommendations', desc: 'Smart deployment suggestions for police, barricades, alternate routes, and emergency services based on real-time analysis.', color: '#A78BFA' },
    { icon: 'fa-chart-area', title: 'Advanced Analytics', desc: 'Comprehensive dashboards with crowd trends, risk distribution, prediction accuracy, and historical analysis charts.', color: '#06B6D4' }
];

export default function Features() {
    return (
        <section className="landing-section" id="features">
            <div className="landing-section__header">
                <div className="landing-section__tag"><i className="fas fa-sparkles"></i> Platform Features</div>
                <h2 className="landing-section__title">Intelligent Crowd Management</h2>
                <p className="landing-section__desc">Powered by advanced AI models, real-time data processing, and predictive analytics to keep cities safe.</p>
            </div>
            <div className="features-grid">
                {features.map(f => (
                    <ScrollAnimation key={f.title}>
                        <div className="feature-card" style={{ '--card-color': f.color }}>
                            <div className="feature-card__icon" style={{ background: `${f.color}1F`, color: f.color }}><i className={`fas ${f.icon}`}></i></div>
                            <h3 className="feature-card__title">{f.title}</h3>
                            <p className="feature-card__desc">{f.desc}</p>
                        </div>
                    </ScrollAnimation>
                ))}
            </div>
        </section>
    );
}
