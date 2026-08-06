/**
 * CrowdSense AI - Map Module
 * Interactive crowd heatmap with Leaflet.js and OpenStreetMap.
 * Depends on: Leaflet.js CDN, CrowdSenseData (data.js)
 */

const CrowdMap = (() => {

    let map = null;

    /**
     * Initialize the Leaflet map
     */
    function init() {
        const mapEl = document.getElementById('crowd-map');
        if (!mapEl) return;

        // Center on Mumbai
        map = L.map('crowd-map', {
            center: [19.0760, 72.8777],
            zoom: 12,
            zoomControl: false,
            attributionControl: true
        });

        // Dark-themed tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Add zoom control to top-right
        L.control.zoom({ position: 'topright' }).addTo(map);

        // Place crowd markers
        addMarkers();

        // Fix map rendering after DOM loads
        setTimeout(() => map.invalidateSize(), 300);
    }

    /**
     * Add colored circle markers for crowd density zones
     */
    function addMarkers() {
        CrowdSenseData.mapMarkers.forEach((marker) => {
            // Outer glow circle
            L.circleMarker([marker.lat, marker.lng], {
                radius: getRadius(marker.crowd) + 8,
                fillColor: marker.color,
                fillOpacity: 0.12,
                stroke: false
            }).addTo(map);

            // Main circle marker
            const circle = L.circleMarker([marker.lat, marker.lng], {
                radius: getRadius(marker.crowd),
                fillColor: marker.color,
                fillOpacity: 0.7,
                color: marker.color,
                weight: 2,
                opacity: 0.9
            }).addTo(map);

            // Tooltip popup
            circle.bindPopup(createPopupContent(marker), {
                className: 'crowd-popup',
                closeButton: false,
                offset: [0, -10]
            });

            circle.on('mouseover', function () { this.openPopup(); });
            circle.on('mouseout', function () { this.closePopup(); });
        });
    }

    /**
     * Calculate marker radius based on crowd count
     */
    function getRadius(crowd) {
        if (crowd >= 3000) return 14;
        if (crowd >= 2000) return 12;
        if (crowd >= 1000) return 10;
        return 8;
    }

    /**
     * Build HTML content for map popup
     */
    function createPopupContent(marker) {
        return `
            <div style="font-family: 'Inter', sans-serif; padding: 4px;">
                <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px; color: #F9FAFB;">
                    ${marker.name}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${marker.color};"></span>
                    <span style="font-size: 11px; color: #9CA3AF; text-transform: capitalize;">
                        ${marker.level} Density
                    </span>
                </div>
                <div style="font-size: 18px; font-weight: 800; color: ${marker.color};">
                    ${marker.crowd.toLocaleString()}
                </div>
                <div style="font-size: 10px; color: #6B7280;">people currently</div>
            </div>
        `;
    }

    return { init };

})();
