import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logos/releaslyy-logo-main.png';
import './Sidebar.css';

/* ── Micro Icons ── */
const icons = {
    grid: (
        <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
            <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="10.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="1.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="10.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
    ),
    plug: (
        <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
            <path d="M6 1.5v3M12 1.5v3M4.5 4.5h9a1.5 1.5 0 011.5 1.5v.75a4.5 4.5 0 01-4.5 4.5h0a4.5 4.5 0 01-4.5-4.5V6a1.5 1.5 0 011.5-1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M9 11.25v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    ),
    gear: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),
};

const navItems = [
    { to: '/dashboard', icon: icons.grid, label: 'Dashboard' },
    { to: '/integration', icon: icons.plug, label: 'Integrations' },
];

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="sidebar-v2">
                {/* Logo row */}
                <div className="sidebar-logo-row">
                    <div className="sidebar-logo" onClick={() => navigate('/dashboard')} title="Releaslyy">
                        <img src={logo} alt="Releaslyy" className="sidebar-logo-img" />
                    </div>
                </div>

                {/* Main Nav */}
                <nav className="sidebar-nav-v2">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
                        >
                            <span className="sidebar-btn-icon">{item.icon}</span>
                            <span className="sidebar-btn-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Settings at bottom */}
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
                >
                    <span className="sidebar-btn-icon">{icons.gear}</span>
                    <span className="sidebar-btn-label">Settings</span>
                </NavLink>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="bottom-nav">
                {[...navItems, { to: '/settings', icon: icons.gear, label: 'Settings' }].map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `bottom-nav-btn ${isActive ? 'active' : ''}`}
                    >
                        <span className="bottom-nav-icon">{item.icon}</span>
                        <span className="bottom-nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </>
    );
};

export default Sidebar;
