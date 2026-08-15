import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ScrollAnimation from '../common/ScrollAnimation';
import AnimatedCounter from '../common/AnimatedCounter';
import './Hero.scss';

export default function Hero() {
    const barRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (barRef.current) barRef.current.style.width = '72%';
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="hero" id="home">
            <div className="hero__content">
                <div className="hero__left">
                    <div className="hero__tag"><i className="fas fa-bolt"></i> AI-Powered Smart City Platform</div>
                    <h1 className="hero__title">CrowdSense AI</h1>
                    <p className="hero__subtitle">Predict. Prevent. Protect.</p>
                    <p className="hero__desc">AI-powered crowd intelligence platform helping authorities and citizens monitor crowd density and receive early warnings before overcrowding occurs.</p>
                    <div className="hero__buttons">
                        <a href="#features" className="btn btn--primary btn--lg"><i className="fas fa-rocket"></i> Explore Platform</a>
                        <Link to="/login" className="btn btn--outline btn--lg"><i className="fas fa-sign-in-alt"></i> Login</Link>
                    </div>
                </div>
                <ScrollAnimation>
                    <div className="hero__card">
                        <div className="hero__card-header">
                            <h3><i className="fas fa-broadcast-tower"></i> Live Crowd Intelligence</h3>
                            <span className="badge badge--danger" style={{ animation: 'pulse 1.5s ease infinite' }}>● LIVE</span>
                        </div>
                        <div className="hero__card-stats">
                            <div className="hero__card-stat">
                                <div className="hero__card-stat-label">Current Crowd</div>
                                <div className="hero__card-stat-value" style={{ color: '#22C55E' }}><AnimatedCounter target={2450} duration={2000} /></div>
                                <div className="hero__card-stat-change" style={{ color: '#22C55E' }}><i className="fas fa-arrow-up"></i> +12% from avg</div>
                            </div>
                            <div className="hero__card-stat">
                                <div className="hero__card-stat-label">Predicted (30m)</div>
                                <div className="hero__card-stat-value" style={{ color: '#3B82F6' }}><AnimatedCounter target={3120} duration={2000} /></div>
                                <div className="hero__card-stat-change" style={{ color: '#F59E0B' }}><i className="fas fa-chart-line"></i> AI Forecast</div>
                            </div>
                            <div className="hero__card-stat">
                                <div className="hero__card-stat-label">Risk Level</div>
                                <div className="hero__card-stat-value" style={{ color: '#EF4444' }}>HIGH</div>
                                <div className="hero__card-stat-change" style={{ color: '#EF4444' }}><i className="fas fa-exclamation-triangle"></i> Elevated</div>
                            </div>
                            <div className="hero__card-stat">
                                <div className="hero__card-stat-label">AI Confidence</div>
                                <div className="hero__card-stat-value" style={{ color: '#A78BFA' }}>87%</div>
                                <div className="hero__card-stat-change" style={{ color: '#9CA3AF' }}><i className="fas fa-brain"></i> LSTM Model</div>
                            </div>
                        </div>
                        <div className="hero__card-bar">
                            <div className="hero__card-bar-label">
                                <span>Crowd Capacity</span>
                                <span style={{ color: '#F59E0B', fontWeight: 600 }}>72%</span>
                            </div>
                            <div className="hero__card-bar-track">
                                <div ref={barRef} className="hero__card-bar-fill" style={{ width: '0%', background: 'linear-gradient(90deg, #22C55E 0%, #F59E0B 60%, #EF4444 100%)' }}></div>
                            </div>
                        </div>
                        <div className="hero__card-zones">
                            {[{ name: 'Marine Drive', color: '#EF4444' }, { name: 'CST Station', color: '#EF4444' }, { name: 'Dadar', color: '#F97316' }, { name: 'BKC', color: '#22C55E' }].map(z => (
                                <div className="hero__card-zone" key={z.name}>
                                    <div className="hero__card-zone-dot" style={{ background: z.color }}></div>
                                    {z.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
