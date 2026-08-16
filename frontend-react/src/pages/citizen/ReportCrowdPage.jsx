import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useToast } from '../../components/common/Toast';
import '../../components/pages/Pages.scss';

export default function ReportCrowdPage() {
    const { showToast } = useToast();
    const [fileName, setFileName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        showToast('Your crowd report has been submitted.', 'success');
        event.currentTarget.reset();
        setFileName('');
    };

    return (
        <>
            <Navbar breadcrumb="Citizen Portal" breadcrumbSub="Report Crowd" role="citizen" />
            <section className="dashboard citizen-page report-crowd-page">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-bullhorn"></i> Report Crowd Situation</h2>
                </div>

                <form className="report-form-card" onSubmit={handleSubmit}>
                    <h3 className="report-form-card__title"><i className="fas fa-file-circle-plus"></i> Submit Crowd Report</h3>

                    <div className="form-group">
                        <label className="form-group__label" htmlFor="report-location">Location</label>
                        <div className="form-group__input-wrap">
                            <i className="fas fa-location-dot"></i>
                            <input className="form-group__input" id="report-location" name="location" required placeholder="Enter location or area name" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-group__label" htmlFor="crowd-size">Estimated crowd size</label>
                        <select className="form-group__select report-form-card__select" id="crowd-size" name="crowdSize" required defaultValue="">
                            <option value="" disabled>Select estimated crowd</option>
                            <option value="under-500">&lt; 500</option>
                            <option value="500-2000">500 - 2,000</option>
                            <option value="2000-5000">2,000 - 5,000</option>
                            <option value="over-5000">5,000+</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-group__label" htmlFor="crowd-description">Description</label>
                        <textarea
                            className="form-group__textarea"
                            id="crowd-description"
                            name="description"
                            required
                            placeholder="Describe the crowd situation, any concerns, or unusual activity..."
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <span className="form-group__label">Upload image <small>(optional)</small></span>
                        <label className="form-group__file" htmlFor="crowd-image">
                            <i className="fas fa-cloud-arrow-up"></i>
                            <span className="form-group__file-title">{fileName || 'Drag and drop an image here'}</span>
                            <span className="form-group__file-help">or click to browse · PNG, JPG up to 10 MB</span>
                        </label>
                        <input
                            className="visually-hidden"
                            id="crowd-image"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(event) => setFileName(event.target.files?.[0]?.name || '')}
                        />
                    </div>

                    <button className="btn btn--primary btn--full" type="submit"><i className="fas fa-paper-plane"></i> Submit Report</button>
                </form>
            </section>
            <Footer text="Citizen Portal · Version 1.0 © 2026" />
        </>
    );
}
