import { Navigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import { getDashboardPath, useAuth } from '../context/AuthContext';

export default function LoginPage({ initialMode = 'signin' }) {
    const { user, role, loading } = useAuth();

    if (loading) {
        return (
            <div className="auth-session-loading">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Securing your session...</span>
            </div>
        );
    }

    if (user) return <Navigate to={getDashboardPath(role)} replace />;

    return (
        <AuthLayout>
            <LoginForm initialMode={initialMode} />
        </AuthLayout>
    );
}
