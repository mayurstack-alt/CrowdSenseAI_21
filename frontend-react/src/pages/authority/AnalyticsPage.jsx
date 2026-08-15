import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../components/pages/Pages.scss';
import '../../components/dashboard/Cards.scss';
import '../../components/dashboard/ChartCard.scss';

export default function AnalyticsPage() {
    return (
        <>
            <Navbar breadcrumb="Command Center" breadcrumbSub="Analytics" role="authority" />
            <section className="dashboard">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-chart-bar"></i> Analytics</h2>
                </div>
                <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <i className="fas fa-chart-bar" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', color: 'var(--primary-light)' }}></i>
                    <p>Analytics page — ready for full implementation</p>
                </div>
            </section>
            <Footer />
        </>
    );
}
