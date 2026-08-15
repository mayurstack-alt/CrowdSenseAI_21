import { Link } from 'react-router-dom';
import './LandingFooter.scss';

export default function LandingFooter() {
    return (
        <footer className="landing-footer" id="contact">
            <div className="landing-footer__content">
                <div className="landing-footer__brand">
                    <h3><i className="fas fa-brain"></i> CrowdSense AI</h3>
                    <p>AI-powered crowd intelligence platform for smart city operations. Predict. Prevent. Protect.</p>
                </div>
                <div className="landing-footer__col">
                    <h4>Platform</h4>
                    <a href="#features">Features</a>
                    <a href="#about">How It Works</a>
                    <Link to="/login">Authority Portal</Link>
                    <Link to="/login">Citizen Portal</Link>
                </div>
                <div className="landing-footer__col">
                    <h4>Resources</h4>
                    <a href="#">Documentation</a>
                    <a href="#">API Reference</a>
                    <a href="#">Support</a>
                    <a href="#">Status</a>
                </div>
                <div className="landing-footer__col">
                    <h4>Contact</h4>
                    <a href="#">support@crowdsense.ai</a>
                    <a href="#">+91 22 1234 5678</a>
                    <a href="#">Mumbai, India</a>
                </div>
            </div>
            <div className="landing-footer__bottom">
                <span>© 2026 CrowdSense AI. All rights reserved.</span>
                <span>Smart City Crowd Intelligence Platform · v1.0</span>
            </div>
        </footer>
    );
}
