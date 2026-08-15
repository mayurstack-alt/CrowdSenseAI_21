import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../components/pages/Pages.scss';

export default function RecommendationsPage() {
    return (
        <>
            <Navbar breadcrumb="Command Center" breadcrumbSub="AI Recommendations" role="authority" />
            <section className="dashboard">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-robot"></i> AI Recommendations</h2>
                </div>
                <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <i className="fas fa-robot" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', color: 'var(--primary-light)' }}></i>
                    <p>AI Recommendations page — ready for full implementation</p>
                </div>
            </section>
            <Footer />
        </>
    );
}
