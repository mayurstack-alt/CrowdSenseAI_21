import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getReports } from '../../services/api';
import '../../components/pages/Pages.scss';

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadReports() {
            try {
                const data = await getReports();
                setReports(data);
            } catch (error) {
                setReports([]);
            } finally {
                setLoading(false);
            }
        }

        loadReports();
    }, []);

    return (
        <>
            <Navbar breadcrumb="Command Center" breadcrumbSub="Reports" role="authority" />
            <section className="dashboard">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-file-alt"></i> Crowd Reports</h2>
                </div>

                {loading ? (
                    <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Loading reports...
                    </div>
                ) : reports.length === 0 ? (
                    <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <i className="fas fa-file-alt" style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', color: 'var(--primary-light)' }}></i>
                        <p>No crowd reports submitted yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {reports.map((report) => (
                            <article key={report.id} style={{ background: 'rgba(15, 23, 42, 0.72)', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '18px', padding: '1rem 1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                    <strong>{report.location}</strong>
                                    <span style={{ color: 'var(--text-secondary)' }}>{report.estimated_crowd_range}</span>
                                </div>
                                <p style={{ color: 'var(--text-primary)', margin: '0.75rem 0' }}>{report.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <span>{new Date(report.timestamp || report.created_at).toLocaleString()}</span>
                                    {report.image_metadata?.filename ? <span>Image: {report.image_metadata.filename}</span> : <span>No image attached</span>}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
            <Footer />
        </>
    );
}
