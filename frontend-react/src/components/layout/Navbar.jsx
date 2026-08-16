import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ breadcrumb, breadcrumbSub, role }) {
    const { user } = useAuth();
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
                    <div className="navbar__profile-avatar" title={user?.user_metadata?.full_name || user?.email || 'User'}>
                        {user?.user_metadata?.full_name 
                            ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
                            : (isAuthority ? 'A' : 'C')}
                    </div>
                    <div className="navbar__profile-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {user?.user_metadata?.full_name || user?.email || 'User'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                            {user?.user_metadata?.role || role || 'Citizen'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
