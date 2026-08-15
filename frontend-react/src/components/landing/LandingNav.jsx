import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingNav.scss';

export default function LandingNav() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAnchorClick = (e, href) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileOpen(false);
    };

    return (
        <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
            <Link to="/" className="landing-nav__logo">
                <div className="landing-nav__logo-icon"><i className="fas fa-brain"></i></div>
                <span className="landing-nav__logo-text">CrowdSense AI</span>
            </Link>
            <div className="landing-nav__links" style={mobileOpen ? { display: 'flex' } : {}}>
                <a href="#home" className="landing-nav__link" onClick={e => handleAnchorClick(e, '#home')}>Home</a>
                <a href="#about" className="landing-nav__link" onClick={e => handleAnchorClick(e, '#about')}>About</a>
                <a href="#features" className="landing-nav__link" onClick={e => handleAnchorClick(e, '#features')}>Features</a>
                <a href="#contact" className="landing-nav__link" onClick={e => handleAnchorClick(e, '#contact')}>Contact</a>
            </div>
            <div className="landing-nav__cta">
                <Link to="/login" className="btn btn--primary"><i className="fas fa-sign-in-alt"></i> Login</Link>
            </div>
            <button className="mobile-nav-toggle" onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none' }}>
                <i className="fas fa-bars"></i>
            </button>
        </nav>
    );
}
