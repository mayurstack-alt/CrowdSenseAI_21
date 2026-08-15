import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../components/pages/Pages.scss';

export default function AlertsPage() {
    return (
        <>
            <Navbar breadcrumb="Command Center" breadcrumbSub="Alerts Center" role="authority" />
            <section className="dashboard">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-exclamation-circle"></i> Alerts Center</h2>
                </div>
                <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', color: 'var(--primary-light)' }}></i>
                    <p>Alerts Center page — ready for full implementation</p>
                </div>
            </section>
            <Footer />
        </>
    );
}
