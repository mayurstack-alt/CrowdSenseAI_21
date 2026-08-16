import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../components/pages/Pages.scss';

const EMERGENCY_NUMBERS = [
    ['Police', '100'], ['Ambulance', '108'], ['Fire', '101'], ['Disaster Management', '1916'], ['Women Helpline', '1091']
];

const DOS = [
    'Keep your phone charged and emergency contacts accessible.',
    'Stay aware of your surroundings and follow official instructions.',
    'Keep children and elderly companions close at all times.',
    'Move calmly with the crowd and keep a clear personal space.',
    'Identify exits and safe meeting points when you arrive.',
    'Carry water and take breaks if you feel unwell.'
];

const DONTS = [
    'Do not push, run, or make sudden movements in dense crowds.',
    'Do not block entrances, exits, stairs, or emergency access routes.',
    'Do not stop abruptly in narrow passages or at bottlenecks.',
    'Do not climb barriers, railings, or temporary structures.',
    'Do not spread unverified information or cause panic.',
    'Do not separate from your group without a meeting plan.'
];

const SAFETY_TIPS = [
    'Choose the edge of a crowd where you have more room to move.',
    'Keep both feet planted and your arms in front of your chest in a crush.',
    'Follow signs, marshals, and public-address announcements promptly.',
    'Plan more than one exit route before the venue gets busy.',
    'If you become separated, head to a marked help desk or meeting point.'
];

const MEDICAL_HELP = [
    'Look for medical aid stations at events.',
    'Carry basic first-aid supplies.',
    'Know the nearest hospital location.',
    'If someone faints, create space and call 108.'
];

const EXIT_GUIDELINES = [
    'Always locate emergency exits upon arrival.',
    'Keep pathways and exits clear.',
    'In panic, stay calm and move steadily.',
    'Protect your chest with your arms if crushed.',
    'If fallen, curl up and protect your head.'
];

function SafetyCard({ title, icon, tone, children }) {
    return (
        <article className="safety-card">
            <header className="safety-card__header">
                <span className={`safety-card__header-icon safety-card__header-icon--${tone}`}><i className={`fas ${icon}`}></i></span>
                <h3>{title}</h3>
            </header>
            <div className="safety-card__body">{children}</div>
        </article>
    );
}

export default function SafetyPage() {
    return (
        <>
            <Navbar breadcrumb="Citizen Portal" breadcrumbSub="Safety Guidelines" role="citizen" />
            <section className="dashboard citizen-page safety-page">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-shield-halved"></i> Safety Guidelines</h2>
                </div>

                <div className="safety-grid">
                    <SafetyCard title="Emergency Numbers" icon="fa-phone" tone="red">
                        <dl className="emergency-numbers">
                            {EMERGENCY_NUMBERS.map(([service, number]) => (
                                <div className="emergency-numbers__row" key={service}>
                                    <dt>{service}</dt><dd><a href={`tel:${number}`}>{number}</a></dd>
                                </div>
                            ))}
                        </dl>
                    </SafetyCard>

                    <SafetyCard title="Do's in Crowded Areas" icon="fa-check" tone="green">
                        <ul className="safety-list safety-list--do">
                            {DOS.map((item) => <li key={item}><i className="fas fa-circle-check"></i>{item}</li>)}
                        </ul>
                    </SafetyCard>

                    <SafetyCard title="Don'ts in Crowded Areas" icon="fa-xmark" tone="red">
                        <ul className="safety-list safety-list--dont">
                            {DONTS.map((item) => <li key={item}><i className="fas fa-circle-xmark"></i>{item}</li>)}
                        </ul>
                    </SafetyCard>

                    <SafetyCard title="Crowd Safety Tips" icon="fa-shield-halved" tone="blue">
                        <ul className="safety-list safety-list--tips">
                            {SAFETY_TIPS.map((item) => <li key={item}><i className="fas fa-circle-info"></i>{item}</li>)}
                        </ul>
                    </SafetyCard>

                    <SafetyCard title="Medical Help" icon="fa-kit-medical" tone="amber">
                        <ul className="safety-list safety-list--medical">
                            {MEDICAL_HELP.map((item) => <li key={item}><i className="fas fa-circle-plus"></i>{item}</li>)}
                        </ul>
                    </SafetyCard>

                    <SafetyCard title="Emergency Exit Guidelines" icon="fa-door-open" tone="purple">
                        <ul className="safety-list safety-list--exit">
                            {EXIT_GUIDELINES.map((item) => <li key={item}><i className="fas fa-arrow-right"></i>{item}</li>)}
                        </ul>
                    </SafetyCard>
                </div>
            </section>
            <Footer text="Citizen Portal · Version 1.0 © 2026" />
        </>
    );
}
