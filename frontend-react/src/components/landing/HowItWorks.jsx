import ScrollAnimation from '../common/ScrollAnimation';

const steps = [
    { num: 1, title: 'Data Collection', desc: 'CCTV feeds, IoT sensors, and citizen reports provide real-time crowd density data from across the city.' },
    { num: 2, title: 'AI Analysis', desc: 'LSTM models and computer vision algorithms process data to predict crowd patterns and identify risk zones.' },
    { num: 3, title: 'Smart Action', desc: 'Automated alerts, AI recommendations, and deployment suggestions keep authorities one step ahead.' }
];

export default function HowItWorks() {
    return (
        <section className="landing-section" id="about">
            <div className="landing-section__header">
                <div className="landing-section__tag"><i className="fas fa-cogs"></i> How It Works</div>
                <h2 className="landing-section__title">Three Steps to Safer Cities</h2>
                <p className="landing-section__desc">Our platform processes real-time data streams through AI models to deliver actionable intelligence.</p>
            </div>
            <div className="hiw-grid">
                {steps.map(s => (
                    <ScrollAnimation key={s.num}>
                        <div className="hiw-step">
                            <div className="hiw-step__number">{s.num}</div>
                            <h3 className="hiw-step__title">{s.title}</h3>
                            <p className="hiw-step__desc">{s.desc}</p>
                        </div>
                    </ScrollAnimation>
                ))}
            </div>
        </section>
    );
}
