
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, ChevronDown, Bell } from 'lucide-react';
import logo from '../assets/release-log-logo-2.png';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true });
                if (res.data && res.data.id) {
                    setUser(res.data);
                }
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

    return (
        <header className="app-header-new">
            <div className="header-content">
                <div className="header-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                    <img src={logo} alt="ReleaseNoteGen.ai Logo" style={{ height: '52px', width: 'auto' }} />
                </div>

                <div className="header-user" style={{ gap: '12px' }}>
                    {user && (
                        <button className="icon-btn" style={{ position: 'relative', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '8px', display: 'flex' }}>
                            <Bell size={18} />
                            <span className="bell-dot" style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }}></span>
                        </button>
                    )}
                    {user ? (
                        <div className="user-profile-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
                            <div
                                className="user-profile"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <span className="user-name">{user.name}</span>
                                {user.avatar ? (
                                    <img src={user.avatar} alt="avatar" className="user-avatar" />
                                ) : (
                                    <div className="user-avatar-placeholder"><UserIcon size={18} /></div>
                                )}
                                <ChevronDown size={14} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
                            </div>

                            {dropdownOpen && (
                                <div className="user-dropdown">
                                    <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="dropdown-item">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Fallback if auth check is slow or fails, though routes usually protect this
                        <button className="btn-secondary" onClick={() => navigate('/login')}>Log in</button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
