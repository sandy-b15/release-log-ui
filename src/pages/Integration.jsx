
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Github, CheckCircle2, Loader2, AlertCircle, Edit,
    Search, Sparkles, Code2, Kanban, MessageSquare, BarChart3
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import devrevLogo from '../assets/devrev-logo.webp';
import gitlabLogo from '../assets/gitlab-logo.png';
import bitbucketLogo from '../assets/bitbucket_icon.webp';
import jiraLogo from '../assets/jira_logo.webp';
import './Integration.css';

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

/* ── Single integration card ── */
const IntegrationCard = ({ config, connected, onConnect, loading, error }) => {
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const isPlaceholder = !config.apiConnect;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onConnect(token);
        if (!error) {
            setShowForm(false);
            setIsEditing(false);
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

                {(connected && !isEditing && !showForm) && (
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
            {(connected && !isEditing && !showForm) && (
                <div className="card-actions">
                    <button className="btn-edit" onClick={() => { setIsEditing(true); setShowForm(true); }}>
                        <Edit size={14} /> Edit Key
                    </button>
                    {config.dashboardUrl && (
                        <button className="btn-dashboard" onClick={() => navigate(config.dashboardUrl)}>
                            Dashboard →
                        </button>
                    )}
                </div>
            )}

            {/* Token form */}
            {(showForm && !isPlaceholder) && (
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
                            ) : (connected ? 'Update Key' : 'Connect')}
                        </button>
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => { setShowForm(false); setIsEditing(false); setToken(''); }}
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
                            <div className="integration-grid">
                                {filteredIntegrations.map(config => (
                                    <IntegrationCard
                                        key={config.id}
                                        config={config}
                                        connected={!!connections[config.id]}
                                        onConnect={(token) => handleConnect(config.id, token)}
                                        loading={!!loadingState[config.id]}
                                        error={errorState[config.id] || ''}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Integration;
