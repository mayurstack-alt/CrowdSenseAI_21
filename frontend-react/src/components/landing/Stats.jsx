import ScrollAnimation from '../common/ScrollAnimation';
import AnimatedCounter from '../common/AnimatedCounter';

const stats = [
    { value: 12, label: 'City Zones Monitored', color: '#3B82F6' },
    { value: 2450, label: 'Active Crowd Tracked', color: '#22C55E' },
    { value: 87, label: 'Prediction Accuracy %', color: '#F59E0B' },
    { value: 156, label: 'Alerts Generated Today', color: '#EF4444' }
];

export default function Stats() {
    return (
        <section className="landing-section">
            <div className="landing-section__header">
                <div className="landing-section__tag"><i className="fas fa-chart-bar"></i> Platform Statistics</div>
                <h2 className="landing-section__title">Trusted by Smart Cities</h2>
            </div>
            <div className="stats-grid">
                {stats.map(s => (
                    <ScrollAnimation key={s.label}>
                        <div className="stat-card">
                            <div className="stat-card__value" style={{ color: s.color }}><AnimatedCounter target={s.value} duration={2000} /></div>
                            <div className="stat-card__label">{s.label}</div>
                        </div>
                    </ScrollAnimation>
                ))}
            </div>
        </section>
    );
}
