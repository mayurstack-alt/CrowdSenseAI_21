/**
 * CrowdSense AI - Charts Module
 * Creates all Chart.js charts for the dashboard.
 * Depends on: Chart.js CDN, CrowdSenseData (data.js)
 */

const Charts = (() => {

    /* Shared chart defaults */
    const defaultFont = {
        family: "'Inter', sans-serif",
        size: 11,
        weight: '500'
    };

    const gridColor = 'rgba(55,65,81,0.4)';
    const tickColor = '#9CA3AF';

    /**
     * Initialize all 4 dashboard charts
     */
    function init() {
        // Global Chart.js defaults
        Chart.defaults.color = tickColor;
        Chart.defaults.font.family = defaultFont.family;
        Chart.defaults.font.size = defaultFont.size;
        Chart.defaults.animation.duration = 1200;
        Chart.defaults.animation.easing = 'easeOutQuart';
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
        Chart.defaults.plugins.legend.labels.padding = 16;

        createHistoricalTrendChart();
        createPredictionChart();
        createWeatherImpactChart();
        createRiskDistributionChart();
    }

    /**
     * 1. Historical Crowd Trend — Line Chart
     */
    function createHistoricalTrendChart() {
        const ctx = document.getElementById('historicalChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: CrowdSenseData.historicalCrowdTrend,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'top', align: 'end' },
                    tooltip: {
                        backgroundColor: 'rgba(31,41,55,0.95)',
                        titleColor: '#F9FAFB',
                        bodyColor: '#9CA3AF',
                        borderColor: 'rgba(55,65,81,0.8)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: (context) => ` ${context.dataset.label}: ${context.parsed.y.toLocaleString()} people`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor, drawBorder: false },
                        ticks: { color: tickColor }
                    },
                    y: {
                        grid: { color: gridColor, drawBorder: false },
                        ticks: {
                            color: tickColor,
                            callback: (val) => val >= 1000 ? (val / 1000) + 'k' : val
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    /**
     * 2. Crowd Prediction — Area (filled line) Chart
     */
    function createPredictionChart() {
        const ctx = document.getElementById('predictionChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: CrowdSenseData.crowdPrediction,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(31,41,55,0.95)',
                        titleColor: '#F9FAFB',
                        bodyColor: '#9CA3AF',
                        borderColor: 'rgba(55,65,81,0.8)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        callbacks: {
                            label: (context) => ` Predicted: ${context.parsed.y.toLocaleString()} people`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor, drawBorder: false },
                        ticks: { color: tickColor }
                    },
                    y: {
                        grid: { color: gridColor, drawBorder: false },
                        ticks: {
                            color: tickColor,
                            callback: (val) => val >= 1000 ? (val / 1000) + 'k' : val
                        }
                    }
                }
            }
        });
    }

    /**
     * 3. Weather Impact — Bar Chart
     */
    function createWeatherImpactChart() {
        const ctx = document.getElementById('weatherChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: CrowdSenseData.weatherImpact,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', align: 'end' },
                    tooltip: {
                        backgroundColor: 'rgba(31,41,55,0.95)',
                        titleColor: '#F9FAFB',
                        bodyColor: '#9CA3AF',
                        borderColor: 'rgba(55,65,81,0.8)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: tickColor }
                    },
                    y: {
                        grid: { color: gridColor, drawBorder: false },
                        ticks: {
                            color: tickColor,
                            callback: (val) => val >= 1000 ? (val / 1000) + 'k' : val
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    /**
     * 4. Risk Distribution — Doughnut Chart
     */
    function createRiskDistributionChart() {
        const ctx = document.getElementById('riskChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: CrowdSenseData.riskDistribution,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 16,
                            usePointStyle: true,
                            pointStyleWidth: 8
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(31,41,55,0.95)',
                        titleColor: '#F9FAFB',
                        bodyColor: '#9CA3AF',
                        borderColor: 'rgba(55,65,81,0.8)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        callbacks: {
                            label: (context) => ` ${context.label}: ${context.parsed}%`
                        }
                    }
                }
            }
        });
    }

    return { init };

})();
