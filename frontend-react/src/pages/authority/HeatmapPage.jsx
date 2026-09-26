import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { getNearbyRisk } from '../../services/api';
import '../../components/pages/Pages.scss';
import 'leaflet/dist/leaflet.css';

export default function HeatmapPage() {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getNearbyRisk()
            .then((data) => setZones(data || []))
            .catch((err) => setError(err.message || 'Unable to load hotspot data'))
            .finally(() => setLoading(false));
    }, []);

    const getColor = (level) => {
        if (level === 'Critical') return '#EF4444';
        if (level === 'High') return '#F97316';
        if (level === 'Moderate') return '#F59E0B';
        return '#22C55E';
    };

    return (
        <>
            <Navbar breadcrumb="Command Center" breadcrumbSub="Crowd Heatmap" role="authority" />
            <section className="dashboard">
                <div className="page-header">
                    <h2 className="page-header__title"><i className="fas fa-map-marked-alt"></i> Crowd Heatmap</h2>
                </div>

                {loading && <p>Loading nearby hotspot data...</p>}
                {error && <p className="error-text">Failed to load: {error}</p>}
                {!loading && !error && zones.length === 0 && <p>No nearby hotspot data available.</p>}

                {!loading && !error && zones.length > 0 && (
                    <MapContainer center={[19.076, 72.8777]} zoom={11} style={{ height: '680px', width: '100%' }}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; OSM &copy; CARTO" subdomains="abcd" maxZoom={19} />
                        {zones.map((zone) => (
                            <CircleMarker key={zone.location_id} center={[zone.lat, zone.lng]} radius={16} weight={2} color={getColor(zone.level)} fillColor={getColor(zone.level)} fillOpacity={0.7}>
                                <Popup>
                                    <div>
                                        <strong>{zone.name}</strong><br />
                                        <span>Risk: {zone.level}</span><br />
                                        <span>Distance: {zone.distance_km ?? zone.distance}</span><br />
                                        <span>Crowd: {zone.crowd}</span><br />
                                        <span>Utilization: {zone.capacity_utilization_pct}%</span>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                )}
            </section>
            <Footer />
        </>
    );
}
