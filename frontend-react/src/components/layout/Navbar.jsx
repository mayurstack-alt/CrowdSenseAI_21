import { useState, useEffect } from 'react';

export default function Navbar({ breadcrumb, breadcrumbSub, role }) {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        function update() {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
            setDate(now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
        }
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    const isAuthority = role === 'authority';

    return (
        <header className="navbar">
            <div className="navbar__left">
                <div className="navbar__breadcrumb">
                    <i className="fas fa-brain" style={{ color: 'var(--primary-light)' }}></i>
                    <span>{breadcrumb}</span>
                    <i className="fas fa-chevron-right"></i>
                    {breadcrumbSub}
                </div>
            </div>
            <div className="navbar__search">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search locations, events, alerts..." />
            </div>
            <div className="navbar__right">
                <button className="navbar__icon-btn" title="Notifications">
                    <i className="fas fa-bell"></i><span className="notification-dot"></span>
                </button>
                {isAuthority && (
                    <button className="navbar__emergency">
                        <i className="fas fa-exclamation-triangle"></i><span>Emergency Mode</span>
                    </button>
                )}
                <div className="navbar__datetime">
                    <span className="time">{time}</span>
                    <span className="date">{date}</span>
                </div>
                <div className="navbar__profile">
                    <div className="navbar__profile-avatar">{isAuthority ? 'AK' : 'RK'}</div>
                    <div className="navbar__profile-info">
                        <span className="name">{isAuthority ? 'Amit Kumar' : 'Rahul Kumar'}</span>
                        <span className="role">{isAuthority ? 'City Admin' : 'Citizen'}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
