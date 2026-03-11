import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const BellIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
        <path d="M13.5 6.75a4.5 4.5 0 10-9 0c0 5.25-2.25 6.75-2.25 6.75h13.5s-2.25-1.5-2.25-6.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.3 15.75a1.5 1.5 0 01-2.6 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

const TopBar = ({ title, sub, children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true });
                if (res.data && res.data.id) setUser(res.data);
            } catch (error) {
                console.error("Failed to fetch user", error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, { withCredentials: true });
            navigate('/login');
        } catch (e) {
            console.error('Logout failed', e);
            navigate('/login');
        }
    };

    const firstName = user?.name ? user.name.split(' ')[0] : 'User';
    const initial = firstName.charAt(0).toUpperCase();

    return (
        <header className="topbar">
            <div className="topbar-left">
                {sub && <p className="topbar-sub">{sub}</p>}
                {title && <h1 className="topbar-title">{title}</h1>}
            </div>
            <div className="topbar-right">
                {children}

                {/* Bell */}
                <div className="topbar-bell">
                    <BellIcon />
                    <div className="topbar-bell-dot" />
                </div>

                {/* Divider */}
                <div className="topbar-divider" />

                {/* User */}
                <div className="topbar-user-wrapper" ref={dropdownRef}>
                    <div className="topbar-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        {user?.avatar ? (
                            <img src={user.avatar} alt="avatar" className="topbar-avatar-img" />
                        ) : (
                            <div className="topbar-avatar">{initial}</div>
                        )}
                        <span className="topbar-username">{firstName}</span>
                        <svg width="12" height="12" fill="none" viewBox="0 0 12 12" style={{ color: 'var(--m2)', transition: 'transform .2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>
                            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {dropdownOpen && (
                        <div className="topbar-dropdown">
                            <button onClick={handleLogout} className="topbar-dropdown-item">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopBar;
