import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import '../../components/pages/Pages.scss';

const PREFERENCES = [
    { id: 'pushNotifications', title: 'Push Notifications', description: 'Receive crowd updates on this device.' },
    { id: 'emergencyAlerts', title: 'Emergency Alerts', description: 'Get critical safety alerts immediately.' },
    { id: 'eventReminders', title: 'Event Reminders', description: 'Be notified before nearby events begin.' },
    { id: 'darkMode', title: 'Dark Mode', description: 'Use the dark appearance across the portal.' }
];

export default function ProfilePage() {
    const { user, signOut } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', city: 'Mumbai' });
    const [preferences, setPreferences] = useState({
        pushNotifications: true, emergencyAlerts: true, eventReminders: true, darkMode: true
    });

    useEffect(() => {
        setProfile({
            fullName: user?.user_metadata?.full_name || '',
            email: user?.email || '',
            phone: user?.user_metadata?.phone || '',
            city: user?.user_metadata?.city || 'Mumbai'
        });
    }, [user]);

    const updateProfile = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login', { replace: true });
        } catch {
            showToast('Unable to log out. Please try again.', 'error');
        }
    };

    return (
        <>
            <Navbar breadcrumb="Citizen Portal" breadcrumbSub="My Profile" role="citizen" />
            <section className="dashboard citizen-page profile-page">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-user"></i> My Profile</h2>
                </div>

                <div className="profile-grid">
                    <section className="profile-card" aria-labelledby="user-details-heading">
                        <header className="profile-card__header">
                            <span className="profile-card__icon"><i className="fas fa-user"></i></span>
                            <h3 id="user-details-heading">User Details</h3>
                        </header>
                        <div className="profile-card__body">
                            <div className="form-group">
                                <label className="form-group__label" htmlFor="profile-name">Full name</label>
                                <input className="form-group__input profile-card__input" id="profile-name" name="fullName" value={profile.fullName} onChange={updateProfile} placeholder="Enter your full name" />
                            </div>
                            <div className="form-group">
                                <label className="form-group__label" htmlFor="profile-email">Email</label>
                                <input className="form-group__input profile-card__input" id="profile-email" name="email" type="email" value={profile.email} onChange={updateProfile} placeholder="Enter your email" />
                            </div>
                            <div className="form-group">
                                <label className="form-group__label" htmlFor="profile-phone">Phone</label>
                                <input className="form-group__input profile-card__input" id="profile-phone" name="phone" type="tel" value={profile.phone} onChange={updateProfile} placeholder="Enter your phone number" />
                            </div>
                            <div className="form-group profile-card__form-group--last">
                                <label className="form-group__label" htmlFor="profile-city">City</label>
                                <input className="form-group__input profile-card__input" id="profile-city" name="city" value={profile.city} onChange={updateProfile} placeholder="Enter your city" />
                            </div>
                        </div>
                    </section>

                    <section className="profile-card" aria-labelledby="preferences-heading">
                        <header className="profile-card__header">
                            <span className="profile-card__icon"><i className="fas fa-sliders"></i></span>
                            <h3 id="preferences-heading">Preferences</h3>
                        </header>
                        <div className="profile-card__body">
                            <div className="preferences-list">
                                {PREFERENCES.map((preference) => (
                                    <label className="preference-row" htmlFor={preference.id} key={preference.id}>
                                        <span className="preference-row__copy">
                                            <strong>{preference.title}</strong>
                                            <small>{preference.description}</small>
                                        </span>
                                        <span className="toggle">
                                            <input
                                                id={preference.id}
                                                type="checkbox"
                                                checked={preferences[preference.id]}
                                                onChange={() => setPreferences((current) => ({ ...current, [preference.id]: !current[preference.id] }))}
                                            />
                                            <span className="toggle__slider"></span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <button className="btn btn--danger profile-card__logout" type="button" onClick={handleLogout}>
                                <i className="fas fa-right-from-bracket"></i> Logout
                            </button>
                        </div>
                    </section>
                </div>
            </section>
            <Footer text="Citizen Portal · Version 1.0 © 2026" />
        </>
    );
}
