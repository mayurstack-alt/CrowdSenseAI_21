import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AuthorityDashboard from './pages/authority/AuthorityDashboard';
import AnalyticsPage from './pages/authority/AnalyticsPage';
import HeatmapPage from './pages/authority/HeatmapPage';
import EventsPage from './pages/authority/EventsPage';
import RecommendationsPage from './pages/authority/RecommendationsPage';
import AlertsPage from './pages/authority/AlertsPage';
import ReportsPage from './pages/authority/ReportsPage';
import SettingsPage from './pages/authority/SettingsPage';

import CitizenHome from './pages/citizen/CitizenHome';
import NearbyRiskPage from './pages/citizen/NearbyRiskPage';
import CitizenEventsPage from './pages/citizen/CitizenEventsPage';
import ReportCrowdPage from './pages/citizen/ReportCrowdPage';
import SafetyPage from './pages/citizen/SafetyPage';
import ProfilePage from './pages/citizen/ProfilePage';

import './styles/main.scss';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ToastProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Authority Dashboard */}
                        <Route element={<ProtectedRoute allowedRole="authority" />}>
                            <Route element={<DashboardLayout role="authority" />}>
                                <Route path="/authority-dashboard" element={<AuthorityDashboard />} />
                                <Route path="/authority-dashboard/analytics" element={<AnalyticsPage />} />
                                <Route path="/authority-dashboard/heatmap" element={<HeatmapPage />} />
                                <Route path="/authority-dashboard/events" element={<EventsPage />} />
                                <Route path="/authority-dashboard/recommendations" element={<RecommendationsPage />} />
                                <Route path="/authority-dashboard/alerts" element={<AlertsPage />} />
                                <Route path="/authority-dashboard/reports" element={<ReportsPage />} />
                                <Route path="/authority-dashboard/settings" element={<SettingsPage />} />
                            </Route>
                        </Route>

                        {/* Citizen Dashboard */}
                        <Route element={<ProtectedRoute allowedRole="citizen" />}>
                            <Route element={<DashboardLayout role="citizen" />}>
                                <Route path="/citizen-dashboard" element={<CitizenHome />} />
                                <Route path="/citizen-dashboard/nearby-risk" element={<NearbyRiskPage />} />
                                <Route path="/citizen-dashboard/events" element={<CitizenEventsPage />} />
                                <Route path="/citizen-dashboard/report-crowd" element={<ReportCrowdPage />} />
                                <Route path="/citizen-dashboard/safety" element={<SafetyPage />} />
                                <Route path="/citizen-dashboard/profile" element={<ProfilePage />} />
                            </Route>
                        </Route>
                    </Routes>
                </ToastProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
