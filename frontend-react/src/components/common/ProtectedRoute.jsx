import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allowedRole }) {
    const { user, role, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary-light)' }}></i>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (allowedRole && role !== allowedRole) {
        const redirect = role === 'authority' ? '/authority-dashboard' : '/citizen-dashboard';
        return <Navigate to={redirect} replace />;
    }

    return <Outlet />;
}
