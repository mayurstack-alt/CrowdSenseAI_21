import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import '../../components/pages/Pages.scss';

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <>
            <Navbar breadcrumb="Citizen Portal" breadcrumbSub="My Profile" role="citizen" />
            <section className="dashboard">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-user"></i> My Profile</h2>
                </div>
                <div style={{ padding: '40px', background: 'var(--bg-secondary)', borderRadius: '12px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '50%', 
                            background: 'var(--primary-main)', 
                            color: 'white', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '2rem', 
                            fontWeight: 'bold',
                            marginRight: '20px'
                        }}>
                            {user?.user_metadata?.full_name 
                                ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
                                : 'U'}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '4px', color: 'var(--text-primary)', margin: 0 }}>
                                {user?.user_metadata?.full_name || 'User'}
                            </h3>
                            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                                {user?.user_metadata?.role || 'citizen'}
                            </span>
                        </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px', marginTop: 0 }}>Email Address</p>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 500, margin: 0 }}>{user?.email || 'Not provided'}</p>
                        </div>
                        <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px', marginTop: 0 }}>Phone Number</p>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 500, margin: 0 }}>{user?.user_metadata?.phone || 'Not provided'}</p>
                        </div>
                        <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px', marginTop: 0 }}>Account Created</p>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 500, margin: 0 }}>
                                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}
                            </p>
                        </div>
                        <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px', marginTop: 0 }}>Status</p>
                            <p style={{ color: 'var(--success-main, #4caf50)', fontSize: '1rem', fontWeight: 500, margin: 0 }}><i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>Active</p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer text="Citizen Portal · Version 1.0 © 2026" />
        </>
    );
}
