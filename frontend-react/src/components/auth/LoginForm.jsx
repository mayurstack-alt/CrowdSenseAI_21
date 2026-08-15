import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('citizen');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { showToast('Please fill in all fields', 'warning'); return; }
        setLoading(true);
        try {
            await signIn(email, password, selectedRole);
            showToast('Login successful! Redirecting...', 'success');
            setTimeout(() => navigate(selectedRole === 'authority' ? '/authority-dashboard' : '/citizen-dashboard'), 800);
        } catch (err) {
            showToast(err.message || 'Invalid credentials.', 'error');
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <div className="auth-card__header">
                <h1 className="auth-card__title">Welcome Back</h1>
                <p className="auth-card__subtitle">Sign in to your CrowdSense AI account</p>
            </div>
            <div className="auth-role-tabs">
                <div className={`auth-role-tab ${selectedRole === 'citizen' ? 'active' : ''}`} onClick={() => setSelectedRole('citizen')}>
                    <span className="auth-role-tab__icon"><i className="fas fa-user"></i></span>
                    <span className="auth-role-tab__label">Citizen Portal</span>
                </div>
                <div className={`auth-role-tab ${selectedRole === 'authority' ? 'active' : ''}`} onClick={() => setSelectedRole('authority')}>
                    <span className="auth-role-tab__icon"><i className="fas fa-shield-alt"></i></span>
                    <span className="auth-role-tab__label">Authority Portal</span>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-group__label">Email Address</label>
                    <div className="form-group__input-wrap">
                        <i className="fas fa-envelope"></i>
                        <input type="email" className="form-group__input" placeholder="Enter your email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-group__label">Password</label>
                    <div className="form-group__input-wrap">
                        <i className="fas fa-lock"></i>
                        <input type={showPw ? 'text' : 'password'} className="form-group__input" placeholder="Enter your password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button type="button" className="form-group__toggle-pw" onClick={() => setShowPw(!showPw)}>
                            <i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                </div>
                <div className="form-row">
                    <label className="form-check"><input type="checkbox" defaultChecked /> Remember me</label>
                    <a className="form-link">Forgot Password?</a>
                </div>
                <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Signing in...</> : <><i className="fas fa-sign-in-alt"></i> Sign In</>}
                </button>
            </form>
            <div className="auth-card__footer">
                Don't have an account? <Link to="/register">Create Account</Link>
            </div>
        </div>
    );
}
