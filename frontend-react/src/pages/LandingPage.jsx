import LandingNav from '../components/landing/LandingNav';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Benefits from '../components/landing/Benefits';
import Stats from '../components/landing/Stats';
import LandingFooter from '../components/landing/LandingFooter';

export default function LandingPage() {
    return (
        <>
            <LandingNav />
            <Hero />
            <Features />
            <HowItWorks />
            <Benefits />
            <Stats />
            <LandingFooter />
        </>
    );
}
