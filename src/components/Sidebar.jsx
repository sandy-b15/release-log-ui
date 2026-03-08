import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlaySquare, Workflow, Settings, HelpCircle, Package } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <aside className="app-sidebar">
            <nav className="sidebar-nav" style={{ marginTop: '24px' }}>
                <p className="nav-section-title"></p>
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/integration" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Workflow size={18} />
                    <span>Integrations</span>
                </NavLink>
            </nav>

            <div className="sidebar-bottom">
                <nav className="sidebar-nav">
                    <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Settings size={18} />
                        <span>Settings</span>
                    </NavLink>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
