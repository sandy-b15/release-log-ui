import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { authApi } from '../../lib/api';
import './Header.css';

const BellIcon = () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
        <path d="M13.5 6.75a4.5 4.5 0 10-9 0c0 5.25-2.25 6.75-2.25 6.75h13.5s-2.25-1.5-2.25-6.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.3 15.75a1.5 1.5 0 01-2.6 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

/* ── Project Switcher ── */
const ProjectSwitcher = () => {
    const [projects, setProjects] = useState([]);
    const [activeProject, setActiveProject] = useState(null);
    const [open, setOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const ref = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setCreating(false);
                setNewName('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (creating && inputRef.current) inputRef.current.focus();
    }, [creating]);

    const loadProjects = async () => {
        try {
            const [projRes, activeRes] = await Promise.all([
                api.get('/projects'),
                api.get('/projects/active'),
            ]);
            setProjects(projRes.data.projects || []);
            setActiveProject(activeRes.data.project || null);
        } catch (err) {
            console.error('Failed to load projects', err);
        }
    };

    const switchProject = async (project) => {
        try {
            await api.post('/projects/active', { projectId: project.id });
            setActiveProject(project);
            setOpen(false);
            toast.success(`Switched to ${project.name}`);
            // Reload the page to refresh data with new project context
            window.location.reload();
        } catch (err) {
            toast.error('Failed to switch project');
        }
    };

    const createProject = async () => {
        if (!newName.trim()) return;
        try {
            const res = await api.post('/projects', { name: newName.trim() });
            const created = res.data.project;
            setProjects(prev => [...prev, created]);
            setNewName('');
            setCreating(false);
            await switchProject(created);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create project');
        }
    };

    return (
        <div className="project-switcher" ref={ref}>
            <button className="project-switcher-btn" onClick={() => setOpen(o => !o)}>
                <span className="project-switcher-dot" />
                <span className="project-switcher-name">{activeProject?.name || 'No Project'}</span>
                <ChevronDown size={14} style={{ color: 'var(--muted)', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }} />
            </button>
            {open && (
                <div className="project-switcher-dropdown">
                    <div className="project-switcher-list">
                        {projects.map(p => (
                            <button
                                key={p.id}
                                className={`project-switcher-option${activeProject?.id === p.id ? ' active' : ''}`}
                                onClick={() => switchProject(p)}
                            >
                                <span className="project-switcher-opt-name">{p.name}</span>
                                {activeProject?.id === p.id && <Check size={14} style={{ color: 'var(--indigo)', flexShrink: 0 }} />}
                            </button>
                        ))}
                    </div>
                    {creating ? (
                        <div className="project-switcher-create-form">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Project name"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && createProject()}
                                className="project-switcher-input"
                            />
                            <button className="btn btn-primary btn-sm" onClick={createProject}>Add</button>
                        </div>
                    ) : (
                        <button className="project-switcher-new" onClick={() => setCreating(true)}>
                            <Plus size={14} /> New Project
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const TopBar = ({ title, sub, children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await authApi.get('/auth/me');
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
            await authApi.post('/auth/logout');
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
                <ProjectSwitcher />
                {(sub || title) && <div className="topbar-divider topbar-divider-left" />}

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
