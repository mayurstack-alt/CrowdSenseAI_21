import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.scss';

const authorityNavItems = [
    { group: 'Main', items: [
        { to: '/authority-dashboard', icon: 'fa-th-large', label: 'Dashboard', end: true },
        { to: '/authority-dashboard/heatmap', icon: 'fa-map-marked-alt', label: 'Crowd Heatmap' },
        { to: '/authority-dashboard/events', icon: 'fa-calendar-alt', label: 'Events' },
        { to: '/authority-dashboard/analytics', icon: 'fa-chart-bar', label: 'Analytics' },
    ]},
    { group: 'Intelligence', items: [
        { to: '/authority-dashboard/recommendations', icon: 'fa-robot', label: 'AI Recommendations' },
        { to: '/authority-dashboard/alerts', icon: 'fa-exclamation-circle', label: 'Alerts' },
        { to: '/authority-dashboard/reports', icon: 'fa-file-alt', label: 'Reports' },
    ]},
    { group: 'System', items: [
        { to: '/authority-dashboard/settings', icon: 'fa-cog', label: 'Settings' },
    ]}
];

const citizenNavItems = [
    { group: 'Navigation', items: [
        { to: '/citizen-dashboard', icon: 'fa-home', label: 'Home', end: true },
        { to: '/citizen-dashboard/nearby-risk', icon: 'fa-map-marker-alt', label: 'Nearby Risk' },
        { to: '/citizen-dashboard/events', icon: 'fa-calendar-alt', label: 'Events' },
        { to: '/citizen-dashboard/report-crowd', icon: 'fa-bullhorn', label: 'Report Crowd' },
        { to: '/citizen-dashboard/safety', icon: 'fa-shield-alt', label: 'Safety Tips' },
    ]},
    { group: 'Account', items: [
        { to: '/citizen-dashboard/profile', icon: 'fa-user', label: 'Profile' },
    ]}
];

export default function Sidebar({ role, isOpen, onClose }) {
    const { signOut } = useAuth();
    const navGroups = role === 'authority' ? authorityNavItems : citizenNavItems;
    const portalLabel = role === 'authority' ? 'Smart City Platform' : 'Citizen Portal';

    return (
        <>
            <button className="sidebar__hamburger" onClick={() => onClose?.('toggle')}>
                <i className="fas fa-bars"></i>
            </button>
            <div className={`sidebar__overlay ${isOpen ? 'active' : ''}`} onClick={() => onClose?.(false)}></div>
            <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
                <div className="sidebar__logo">
                    <div className="sidebar__logo-icon"><i className="fas fa-brain"></i></div>
                    <div className="sidebar__logo-text">
                        <h2>CrowdSense AI</h2>
                        <span>{portalLabel}</span>
                    </div>
                </div>
                <nav className="sidebar__nav">
                    {navGroups.map(group => (
                        <div className="sidebar__nav-group" key={group.group}>
                            <div className="sidebar__nav-group-title">{group.group}</div>
                            {group.items.map(item => (
                                <NavLink key={item.to} to={item.to} end={item.end}
                                    className={({ isActive }) => `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}>
                                    <i className={`fas ${item.icon}`}></i><span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                    <div className="sidebar__status">
                        <div className="sidebar__status-dot"></div>
                        <span>All Systems Operational</span>
                    </div>
                </nav>
                <div className="sidebar__footer">
                    <button className="sidebar__nav-item" onClick={signOut}>
                        <i className="fas fa-sign-out-alt"></i><span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
