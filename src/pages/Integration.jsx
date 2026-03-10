
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {
    Github, CheckCircle2, Loader2, AlertCircle, Edit, X, Trash2,
    Search, Sparkles, Code2, Kanban, MessageSquare, BarChart3
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import devrevLogo from '../assets/devrev-logo.webp';
import gitlabLogo from '../assets/gitlab-logo.png';
import bitbucketLogo from '../assets/bitbucket_icon.webp';
import jiraLogo from '../assets/jira_logo.webp';
import './Integration.css';
import ConfirmDialog from '../components/ConfirmDialog';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

/* ── Integration card definitions ── */
const INTEGRATIONS = [
    {
        id: 'github',
        title: 'GitHub',
        description: 'Connect repositories, branches, and commits for release notes',
        category: 'development',
        icon: <Github size={22} />,
        iconClass: 'icon-dark',
        accentClass: 'accent-dark',
        badge: 'Popular',
        badgeClass: 'badge-orange',
        tokenLabel: 'Personal Access Token',
        placeholder: 'ghp_...',
        hint: <>Scopes required: <code>repo</code>, <code>read:user</code></>,
        dashboardUrl: '/dashboard',
        apiConnect: '/api/tokens/github',
        apiCheck: '/api/tokens/github',
    },
    {
        id: 'devrev',
        title: 'DevRev',
        description: 'Sync sprint boards and agile workflows',
        category: 'project-management',
        icon: <img src={devrevLogo} alt="DevRev" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6, backgroundColor: 'white' }} />,
        iconClass: 'icon-blue',
        accentClass: 'accent-blue',
        badge: 'Popular',
        badgeClass: 'badge-green',
        tokenLabel: 'Access Token',
        placeholder: 'eyJ...',
        hint: 'Generate a token from DevRev Settings → Account → Access Tokens',
        dashboardUrl: '/devrev-dashboard',
        apiConnect: '/api/devrev/connect',
        apiCheck: '/api/tokens/devrev',
    },
    {
        id: 'gitlab',
        title: 'GitLab',
        description: 'Import merge requests and pipeline data',
        category: 'development',
        icon: <img src={gitlabLogo} alt="GitLab" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6, backgroundColor: 'white' }} />,
        iconClass: 'icon-orange',
        accentClass: 'accent-orange',
        badge: null,
        badgeClass: '',
        tokenLabel: 'Personal Access Token',
        placeholder: 'glpat-...',
        hint: 'Requires api scope',
        dashboardUrl: null,
        apiConnect: null,
        apiCheck: null,
    },
    {
        id: 'bitbucket',
        title: 'Bitbucket',
        description: 'Connect Bitbucket repositories and pull requests for release tracking',
        category: 'development',
        icon: <img src={bitbucketLogo} alt="Bitbucket" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6, backgroundColor: 'white' }} />,
        iconClass: 'icon-bitbucket',
        accentClass: 'accent-bitbucket',
        badge: null,
        badgeClass: '',
        tokenLabel: 'App Password',
        placeholder: 'Enter app password...',
        hint: 'Create an app password from Bitbucket Settings → App passwords',
        dashboardUrl: null,
        apiConnect: null,
        apiCheck: null,
    },
    {
        id: 'jira',
        title: 'JIRA',
        description: 'Sync issues, sprints, and project boards for release management',
        category: 'project-management',
        icon: <img src={jiraLogo} alt="JIRA" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6, backgroundColor: 'white' }} />,
        iconClass: 'icon-jira',
        accentClass: 'accent-jira',
        badge: null,
        badgeClass: '',
        tokenLabel: 'API Token',
        placeholder: 'Enter API token...',
        hint: 'Generate from Atlassian Account → Security → API tokens',
        dashboardUrl: null,
        apiConnect: null,
        apiCheck: null,
    },
];

const CATEGORIES = [
    { id: 'all', label: 'All', icon: <Sparkles size={15} /> },
    { id: 'development', label: 'Development', icon: <Code2 size={15} /> },
    { id: 'project-management', label: 'Project Management', icon: <Kanban size={15} /> },
    { id: 'communication', label: 'Communication', icon: <MessageSquare size={15} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={15} /> },
];

/* ── Edit Key Modal ── */
const EditKeyModal = ({ config, loading, error, onSubmit, onClose }) => {
    const [token, setToken] = useState('');

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(token);
    };

    return ReactDOM.createPortal(
        <div className="edit-key-overlay" onClick={onClose}>
            <div className="edit-key-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-row">
                        <div className={`card-icon ${config.iconClass}`}>
                            {config.icon}
                        </div>
                        <div>
                            <h3>Update {config.title} Key</h3>
                            <p className="modal-subtitle">Enter a new access token below</p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="input-group">
                            <label>{config.tokenLabel}</label>
                            <input
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder={config.placeholder}
                                required
                                autoFocus
                            />
                            {config.hint && <small>{config.hint}</small>}
                        </div>

                        {error && (
                            <div className="error-msg">
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button type="submit" disabled={loading} className="btn-submit">
                            {loading ? (
                                <><Loader2 size={16} className="spin" /> Updating...</>
                            ) : 'Update Key'}
                        </button>
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

/* ── Single integration card ── */
const IntegrationCard = ({ config, connected, onConnect, onEditKey, onDelete, loading, error }) => {
    const [showForm, setShowForm] = useState(false);
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const isPlaceholder = !config.apiConnect;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onConnect(token);
        if (!error) {
            setShowForm(false);
            setToken('');
        }
    };

    const handleConnectClick = () => {
        if (isPlaceholder) return;
        setShowForm(true);
    };

    return (
        <div className="int-card">
            <div className={`card-accent ${config.accentClass}`} />
            <div className="card-body">
                <div className="card-header-row">
                    <div className={`card-icon `}>
                        {config.icon}
                    </div>
                    <div className="card-title-group">
                        <h3>{config.title}</h3>
                        {config.badge && (
                            <span className={`badge ${config.badgeClass}`}>
                                <span className="badge-dot" />
                                {config.badge}
                            </span>
                        )}
                    </div>
                </div>

                <p className="card-desc">{config.description}</p>
                <span className="category-tag">{config.category}</span>

                {(!showForm && !connected) && (
                    <>
                        <hr className="card-divider" />
                        <button
                            className={`connect-btn ${isPlaceholder ? '' : ''}`}
                            onClick={handleConnectClick}
                            disabled={isPlaceholder}
                            style={isPlaceholder ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                            {isPlaceholder ? 'Coming Soon' : `Connect ${config.title}`}
                        </button>
                    </>
                )}

                {(connected && !showForm) && (
                    <>
                        <hr className="card-divider" />
                        <button className="connect-btn connected-btn">
                            <CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                            Connected
                        </button>
                    </>
                )}
            </div>

            {/* Connected actions */}
            {(connected && !showForm) && (
                <div className="card-actions">
                    <button className="btn-delete" onClick={onDelete}>
                        <Trash2 size={14} />
                    </button>
                    <button className="btn-edit" onClick={onEditKey}>
                        <Edit size={14} /> Edit Key
                    </button>
                    {config.dashboardUrl && (
                        <button className="btn-dashboard" onClick={() => navigate(config.dashboardUrl)}>
                            Dashboard
                        </button>
                    )}
                </div>
            )}

            {/* Token form – only for initial connect, not for editing */}
            {(showForm && !connected && !isPlaceholder) && (
                <form className="token-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>{config.tokenLabel}</label>
                        <input
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder={config.placeholder}
                            required
                        />
                        {config.hint && <small>{config.hint}</small>}
                    </div>

                    {error && (
                        <div className="error-msg">
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="btn-submit">
                            {loading ? (
                                <><Loader2 size={16} className="spin" /> Connecting...</>
                            ) : 'Connect'}
                        </button>
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => { setShowForm(false); setToken(''); }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

/* ── Main Integration page ── */
const Integration = () => {
    const [connections, setConnections] = useState({});
    const [loadingState, setLoadingState] = useState({});
    const [errorState, setErrorState] = useState({});
    const [initialLoading, setInitialLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingIntegration, setEditingIntegration] = useState(null);
    const [deletingIntegration, setDeletingIntegration] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        const checkTokens = async () => {
            try {
                const [ghRes, drRes] = await Promise.all([
                    api.get('/api/tokens/github'),
                    api.get('/api/tokens/devrev'),
                ]);
                setConnections({
                    github: ghRes.data.hasToken,
                    devrev: drRes.data.hasToken,
                });
            } catch (err) {
                console.error('Token check failed', err);
            } finally {
                setInitialLoading(false);
            }
        };
        checkTokens();
    }, []);

    const handleConnect = async (integrationId, token) => {
        const config = INTEGRATIONS.find(i => i.id === integrationId);
        if (!config || !config.apiConnect) return;

        setLoadingState(prev => ({ ...prev, [integrationId]: true }));
        setErrorState(prev => ({ ...prev, [integrationId]: '' }));

        try {
            await api.post(config.apiConnect, { token });
            setConnections(prev => ({ ...prev, [integrationId]: true }));
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to connect. Please try again.';
            setErrorState(prev => ({ ...prev, [integrationId]: msg }));
        } finally {
            setLoadingState(prev => ({ ...prev, [integrationId]: false }));
        }
    };

    const handleEditKey = (integrationId) => {
        setErrorState(prev => ({ ...prev, [integrationId]: '' }));
        setEditingIntegration(integrationId);
    };

    const handleEditSubmit = async (token) => {
        if (!editingIntegration) return;
        const config = INTEGRATIONS.find(i => i.id === editingIntegration);
        if (!config || !config.apiConnect) return;

        setLoadingState(prev => ({ ...prev, [editingIntegration]: true }));
        setErrorState(prev => ({ ...prev, [editingIntegration]: '' }));

        try {
            await api.post(config.apiConnect, { token });
            setConnections(prev => ({ ...prev, [editingIntegration]: true }));
            setEditingIntegration(null);
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to update. Please try again.';
            setErrorState(prev => ({ ...prev, [editingIntegration]: msg }));
        } finally {
            setLoadingState(prev => ({ ...prev, [editingIntegration]: false }));
        }
    };

    const handleDelete = async (integrationId) => {
        try {
            await api.delete(`/api/tokens/${integrationId}`);
            setConnections(prev => ({ ...prev, [integrationId]: false }));
            setDeletingIntegration(null);
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to disconnect. Please try again.';
            setErrorState(prev => ({ ...prev, [integrationId]: msg }));
            setDeletingIntegration(null);
        }
    };

    /* Derived data */
    const connectedCount = Object.values(connections).filter(Boolean).length;
    const availableCount = INTEGRATIONS.length;

    const filteredIntegrations = INTEGRATIONS.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="app-layout integration-page">
            <Sidebar />
            <div className="main-content-wrapper">
                <div className="integration-container">
                    <div className="integration-inner">
                        {/* Hero */}
                        <div className="integration-hero">
                            <p className="hero-label">Integrations</p>
                            <h1>
                                Connect Your<br />
                                <span className="accent">Favorite Tools</span>
                            </h1>
                            <p className="hero-subtitle">
                                Seamlessly integrate with your existing workflow. Connect repositories, project management tools, and more.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="integration-stats">
                            <div className="stat-item">
                                <span className="stat-number">{connectedCount}</span>
                                <span className="stat-label">Connected</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{availableCount}</span>
                                <span className="stat-label">Available</span>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="integration-search">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search integrations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Tabs */}
                        <div className="integration-tabs">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                >
                                    {cat.icon}
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Cards */}
                        {initialLoading ? (
                            <div className="hub-loading">
                                <Loader2 size={28} className="spin" />
                                <span>Checking connections...</span>
                            </div>
                        ) : (
                            <>
                                <div className="integration-grid">
                                    {filteredIntegrations.map(config => (
                                        <IntegrationCard
                                            key={config.id}
                                            config={config}
                                            connected={!!connections[config.id]}
                                            onConnect={(token) => handleConnect(config.id, token)}
                                            onEditKey={() => handleEditKey(config.id)}
                                            onDelete={() => setDeletingIntegration(config.id)}
                                            loading={!!loadingState[config.id]}
                                            error={errorState[config.id] || ''}
                                        />
                                    ))}
                                </div>

                                {/* Edit Key Modal */}
                                {editingIntegration && (
                                    <EditKeyModal
                                        config={INTEGRATIONS.find(i => i.id === editingIntegration)}
                                        loading={!!loadingState[editingIntegration]}
                                        error={errorState[editingIntegration] || ''}
                                        onSubmit={handleEditSubmit}
                                        onClose={() => setEditingIntegration(null)}
                                    />
                                )}

                                {/* Delete Confirm Dialog */}
                                <ConfirmDialog
                                    open={!!deletingIntegration}
                                    title="Disconnect Service"
                                    message={`Are you sure you want to disconnect ${INTEGRATIONS.find(i => i.id === deletingIntegration)?.title || 'this service'}? You will need to re-enter your token to reconnect.`}
                                    confirmLabel="Disconnect"
                                    variant="danger"
                                    onConfirm={() => handleDelete(deletingIntegration)}
                                    onCancel={() => setDeletingIntegration(null)}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Integration;
