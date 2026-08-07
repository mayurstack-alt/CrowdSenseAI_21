/**
 * CrowdSense AI — Auth Controller
 * Handles login/register forms, role selection, demo credentials, redirects
 */

/* ─── Demo Credentials ─── */
const DEMO_CREDENTIALS = {
    authority: { email: 'admin@crowdsense.ai', password: 'admin123', redirect: 'authority/dashboard.html' },
    citizen:   { email: 'citizen@crowdsense.ai', password: 'citizen123', redirect: 'citizen/home.html' }
};

let selectedRole = 'citizen';

document.addEventListener('DOMContentLoaded', () => {

    /* ─── Role Tab Switching (Login Page) ─── */
    const roleTabs = document.querySelectorAll('.auth-role-tab');
    roleTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            roleTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            selectedRole = this.dataset.role;
        });
    });

    /* ─── Password Toggle (Login Page) ─── */
    const togglePw = document.getElementById('toggle-pw');
    if (togglePw) {
        togglePw.addEventListener('click', function() {
            const input = document.getElementById('login-password');
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }

    /* ─── Login Form ─── */
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();

            if (!email || !password) {
                Common.showToast('Please fill in all fields', 'warning');
                return;
            }

            const creds = DEMO_CREDENTIALS[selectedRole];

            if (email === creds.email && password === creds.password) {
                const btn = document.getElementById('login-btn');
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
                btn.disabled = true;

                Common.showToast('Login successful! Redirecting...', 'success');

                setTimeout(() => {
                    window.location.href = creds.redirect;
                }, 1200);
            } else {
                Common.showToast('Invalid credentials. Please try demo credentials.', 'error');

                // Shake animation on form
                loginForm.style.animation = 'none';
                loginForm.offsetHeight; // trigger reflow
                loginForm.style.animation = 'shake 0.5s ease';
            }
        });
    }

    /* ─── Register Form ─── */
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirm = document.getElementById('reg-confirm').value;
            const role = document.getElementById('reg-role').value;

            if (!name || !email || !phone || !password || !confirm || !role) {
                Common.showToast('Please fill in all fields', 'warning');
                return;
            }

            if (password !== confirm) {
                Common.showToast('Passwords do not match', 'error');
                return;
            }

            if (password.length < 6) {
                Common.showToast('Password must be at least 6 characters', 'error');
                return;
            }

            const btn = document.getElementById('register-btn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            btn.disabled = true;

            Common.showToast('Account created successfully!', 'success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }
});

/* ─── Global Password Toggle (Register page) ─── */
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

/* ─── Shake Keyframe (added dynamically) ─── */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-6px); }
        80% { transform: translateX(6px); }
    }
`;
document.head.appendChild(shakeStyle);
