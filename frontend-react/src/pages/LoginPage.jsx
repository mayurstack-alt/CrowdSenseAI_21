import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
    return (
        <AuthLayout illustrationIcon="fa-city" leftTitle="Smart City Command Center" leftDesc="AI-powered crowd intelligence platform for real-time monitoring, predictive analytics, and automated risk management across your entire city.">
            <LoginForm />
        </AuthLayout>
    );
}
