import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [role, setRole] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !phone || !password || !confirm || !role) { showToast('Please fill in all fields', 'warning'); return; }
        if (password !== confirm) { showToast('Passwords do not match', 'error'); return; }
        if (password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
        setLoading(true);
        try {
            await signUp(name, email, phone, password, role);
            showToast('Account created successfully!', 'success');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            showToast(err.message || 'Registration failed.', 'error');
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <div className="auth-card__header">
                <h1 className="auth-card__title">Create Account</h1>
                <p className="auth-card__subtitle">Register for CrowdSense AI platform</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-group__label">Full Name</label>
                    <div className="form-group__input-wrap">
                        <i className="fas fa-user"></i>
                        <input type="text" className="form-group__input" placeholder="Enter your full name" required value={name} onChange={e => setName(e.target.value)} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-group__label">Email Address</label>
                    <div className="form-group__input-wrap">
                        <i className="fas fa-envelope"></i>
                        <input type="email" className="form-group__input" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-group__label">Phone Number</label>
                    <div className="form-group__input-wrap">
                        <i className="fas fa-phone"></i>
                        <input type="tel" className="form-group__input" placeholder="+91 XXXXX XXXXX" required value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-group__label">Password</label>
                    <div className="form-group__input-wrap">
                        <i className="fas fa-lock"></i>
                        <input type={showPw ? 'text' : 'password'} className="form-group__input" placeholder="Create a password" required value={password} onChange={e => setPassword(e.target.value)} />
                        <button type="button" className="form-group__toggle-pw" onClick={() => setShowPw(!showPw)}><i className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-group__label">Confirm Password</label>
                    <div className="form-group__input-wrap">
                        <i className="fas fa-lock"></i>
                        <input type={showConfirm ? 'text' : 'password'} className="form-group__input" placeholder="Confirm your password" required value={confirm} onChange={e => setConfirm(e.target.value)} />
                        <button type="button" className="form-group__toggle-pw" onClick={() => setShowConfirm(!showConfirm)}><i className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-group__label">Role</label>
                    <div className="form-group__input-wrap">
                        <i className="fas fa-user-tag"></i>
                        <select className="form-group__select" required value={role} onChange={e => setRole(e.target.value)}>
                            <option value="" disabled>Select your role</option>
                            <option value="citizen">Citizen</option>
                            <option value="authority">Authority</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn--primary btn--full btn--lg" style={{ marginTop: '8px' }} disabled={loading}>
                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating account...</> : <><i className="fas fa-user-plus"></i> Create Account</>}
                </button>
            </form>
            <div className="auth-card__footer">
                Already have an account? <Link to="/login">Sign In</Link>
            </div>
        </div>
    );
}
