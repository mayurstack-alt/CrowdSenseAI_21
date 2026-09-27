import { useMemo, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useToast } from '../../components/common/Toast';
import { submitCrowdReport } from '../../services/api';
import '../../components/pages/Pages.scss';

const defaultForm = {
    location: '',
    estimated_crowd_range: '',
    description: '',
    timestamp: new Date().toISOString(),
};

export default function ReportCrowdPage() {
    const { showToast } = useToast();
    const [fileName, setFileName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(defaultForm);

    const fileInfo = useMemo(() => ({
        filename: fileName || 'No image selected',
        size_bytes: 0,
        content_type: 'application/octet-stream',
    }), [fileName]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await submitCrowdReport({
                ...formData,
                user_metadata: { source: 'web-form' },
                image_metadata: fileName ? fileInfo : null,
            });

            showToast('Your crowd report has been submitted.', 'success');
            setFormData(defaultForm);
            setFileName('');
            event.currentTarget.reset();
        } catch (error) {
            showToast(error.message || 'Unable to submit crowd report.', 'error');
        } finally {
            setIsSubmitting(false);
        }
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
                            <input
                                className="form-group__input"
                                id="report-location"
                                name="location"
                                required
                                placeholder="Enter location or area name"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-group__label" htmlFor="crowd-size">Estimated crowd range</label>
                        <select
                            className="form-group__select report-form-card__select"
                            id="crowd-size"
                            name="estimated_crowd_range"
                            required
                            value={formData.estimated_crowd_range}
                            onChange={handleChange}
                        >
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
                            value={formData.description}
                            onChange={handleChange}
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

                    <button className="btn btn--primary btn--full" type="submit" disabled={isSubmitting}>
                        <i className="fas fa-paper-plane"></i> {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </section>
            <Footer text="Citizen Portal · Version 1.0 © 2026" />
        </>
    );
}
