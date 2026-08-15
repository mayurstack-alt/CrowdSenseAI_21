import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DashboardLayout.scss';

export default function DashboardLayout({ role }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebar = (action) => {
        if (action === 'toggle') setSidebarOpen(prev => !prev);
        else setSidebarOpen(action);
    };

    return (
        <div className="app">
            <Sidebar role={role} isOpen={sidebarOpen} onClose={handleSidebar} />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
