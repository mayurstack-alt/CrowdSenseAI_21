export default function Footer({ text }) {
    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__logo"><i className="fas fa-brain"></i> CrowdSense AI</div>
                <div className="footer__divider"></div>
                <span className="footer__text">{text || 'Smart City Crowd Intelligence Platform'}</span>
                <div className="footer__divider"></div>
                <span className="footer__text">Version 1.0 © 2026</span>
            </div>
        </footer>
    );
}
