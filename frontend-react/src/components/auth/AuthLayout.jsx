import './AuthLayout.scss';

export default function AuthLayout({ illustrationIcon, leftTitle, leftDesc, children }) {
    return (
        <div className="auth-page">
            <div className="auth-page__left">
                <div className="auth-left__content">
                    <div className="auth-left__logo">
                        <div className="auth-left__logo-icon"><i className="fas fa-brain"></i></div>
                        <span className="auth-left__logo-text">CrowdSense AI</span>
                    </div>
                    <div className="auth-left__illustration">
                        <i className={`fas ${illustrationIcon || 'fa-city'}`}></i>
                    </div>
                    <h2 className="auth-left__title">{leftTitle || 'Smart City Command Center'}</h2>
                    <p className="auth-left__desc">{leftDesc || 'AI-powered crowd intelligence platform for real-time monitoring, predictive analytics, and automated risk management across your entire city.'}</p>
                </div>
            </div>
            <div className="auth-page__right">
                {children}
            </div>
        </div>
    );
}
