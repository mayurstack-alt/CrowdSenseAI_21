import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../components/pages/Pages.scss';

export default function ReportsPage() {
    return (
        <>
            <Navbar breadcrumb="Command Center" breadcrumbSub="Reports" role="authority" />
            <section className="dashboard">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-file-alt"></i> Reports</h2>
                </div>
                <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <i className="fas fa-file-alt" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', color: 'var(--primary-light)' }}></i>
                    <p>Reports page — ready for full implementation</p>
                </div>
            </section>
            <Footer />
        </>
    );
}
