import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

export default function LoginForm({ initialMode = 'signin' }) {
    const [mode, setMode] = useState(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('citizen');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    const switchMode = (nextMode) => {
        setMode(nextMode);
        setPassword('');
    };

    const handleSignIn = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            showToast('Please enter your email address and password.', 'warning');
            return;
        }

        setLoading(true);
        try {
            const { redirectTo } = await signIn(email, password);
            showToast('Login successful. Redirecting to your portal...', 'success');
            navigate(redirectTo, { replace: true });
        } catch (error) {
            showToast(error.message || 'Invalid email or password.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (!name || !email || !phone || !password) {
            showToast('Please fill in all fields.', 'warning');
            return;
        }
        if (password.length < 6) {
            showToast('Password must be at least 6 characters.', 'error');
            return;
        }

        setLoading(true);
        try {
            const { session, redirectTo } = await signUp(name, email, phone, password, role);
            if (session) {
                showToast('Account created. Redirecting to your portal...', 'success');
                navigate(redirectTo, { replace: true });
            } else {
                showToast('Account created. Check your email to confirm it, then sign in.', 'success');
                switchMode('signin');
            }
        } catch (error) {
            showToast(error.message || 'Unable to create your account.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const isSignIn = mode === 'signin';

    return (
        <div className="auth-card">
            <div className="auth-mode-tabs" role="tablist" aria-label="Authentication mode">
                <button className={isSignIn ? 'active' : ''} type="button" role="tab" aria-selected={isSignIn} onClick={() => switchMode('signin')}>
                    Sign In
                </button>
                <button className={!isSignIn ? 'active' : ''} type="button" role="tab" aria-selected={!isSignIn} onClick={() => switchMode('signup')}>
                    Create Account
                </button>
            </div>

            <div className="auth-card__header">
                <p className="auth-card__eyebrow">{isSignIn ? 'Secure portal access' : 'Start protecting your city'}</p>
                <h2 className="auth-card__title">{isSignIn ? 'Welcome back' : 'Create your account'}</h2>
                <p className="auth-card__subtitle">
                    {isSignIn ? 'Your dashboard is selected automatically after authentication.' : 'Set up your CrowdSense AI access in a few moments.'}
                </p>
            </div>

            {isSignIn ? (
                <form onSubmit={handleSignIn}>
                    <div className="form-group">
                        <label className="form-group__label" htmlFor="signin-email">Email Address</label>
                        <div className="form-group__input-wrap">
                            <i className="fas fa-envelope"></i>
                            <input id="signin-email" type="email" className="form-group__input" placeholder="Enter your email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-group__label" htmlFor="signin-password">Password</label>
                        <div className="form-group__input-wrap">
                            <i className="fas fa-lock"></i>
                            <input id="signin-password" type={showPassword ? 'text' : 'password'} className="form-group__input" placeholder="Enter your password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
                            <button type="button" className="form-group__toggle-pw" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}>
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn--primary btn--full btn--lg auth-submit" disabled={loading}>
                        {loading ? <><i className="fas fa-spinner fa-spin"></i> Signing in...</> : <>Sign In to Portal <i className="fas fa-arrow-right"></i></>}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSignUp}>
                    <div className="form-group">
                        <label className="form-group__label" htmlFor="signup-name">Full Name</label>
                        <div className="form-group__input-wrap">
                            <i className="fas fa-user"></i>
                            <input id="signup-name" type="text" className="form-group__input" placeholder="Enter your full name" required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-group__label" htmlFor="signup-email">Email Address</label>
                        <div className="form-group__input-wrap">
                            <i className="fas fa-envelope"></i>
                            <input id="signup-email" type="email" className="form-group__input" placeholder="Enter your email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-group__label" htmlFor="signup-phone">Phone Number</label>
                        <div className="form-group__input-wrap">
                            <i className="fas fa-phone"></i>
                            <input id="signup-phone" type="tel" className="form-group__input" placeholder="+91 XXXXX XXXXX" required autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-group__label" htmlFor="signup-password">Password</label>
                        <div className="form-group__input-wrap">
                            <i className="fas fa-lock"></i>
                            <input id="signup-password" type={showPassword ? 'text' : 'password'} className="form-group__input" placeholder="Create a password" required autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
                            <button type="button" className="form-group__toggle-pw" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}>
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    <fieldset className="auth-role-selector">
                        <legend>Account role</legend>
                        <div>
                            <label className={role === 'citizen' ? 'active' : ''}>
                                <input type="radio" name="signup-role" value="citizen" checked={role === 'citizen'} onChange={() => setRole('citizen')} />
                                <i className="fas fa-user"></i> Citizen
                            </label>
                            <label className={role === 'authority' ? 'active' : ''}>
                                <input type="radio" name="signup-role" value="authority" checked={role === 'authority'} onChange={() => setRole('authority')} />
                                <i className="fas fa-shield-halved"></i> Authority
                            </label>
                        </div>
                    </fieldset>
                    <button type="submit" className="btn btn--primary btn--full btn--lg auth-submit" disabled={loading}>
                        {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating account...</> : <>Create Account <i className="fas fa-arrow-right"></i></>}
                    </button>
                </form>
            )}
        </div>
    );
}
