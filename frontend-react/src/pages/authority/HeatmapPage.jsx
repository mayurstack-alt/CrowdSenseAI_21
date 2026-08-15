import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import '../../components/pages/Pages.scss';

export default function HeatmapPage() {
    return (
        <>
            <Navbar breadcrumb="Command Center" breadcrumbSub="Crowd Heatmap" role="authority" />
            <section className="dashboard">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-map-marked-alt"></i> Crowd Heatmap</h2>
                </div>
                <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <i className="fas fa-map-marked-alt" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', color: 'var(--primary-light)' }}></i>
                    <p>Crowd Heatmap page — ready for full implementation</p>
                </div>
            </section>
            <Footer />
        </>
    );
}
