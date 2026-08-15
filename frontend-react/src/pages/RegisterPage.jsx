import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <AuthLayout illustrationIcon="fa-users" leftTitle="Join the Platform" leftDesc="Create your account to access real-time crowd intelligence, safety alerts, and community-powered crowd monitoring for your city.">
            <RegisterForm />
        </AuthLayout>
    );
}
