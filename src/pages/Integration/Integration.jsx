
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Loader2, AlertCircle, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import TopBar from '../../components/Header/Header';
import Pill from '../../components/ui/Pill';
import devrevLogo from '../../assets/devrev-logo.webp';
import gitlabLogo from '../../assets/gitlab-logo.png';
import bitbucketLogo from '../../assets/bitbucket_icon.webp';
import jiraLogo from '../../assets/jira_logo.webp';
import slackLogo from '../../assets/slack-logo.png';
import './Integration.css';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import api from '../../lib/api';

/* ── Micro Icons ── */
const ghIcon = <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M9 1.5A7.5 7.5 0 006.63 16.11c.375.068.513-.163.513-.36v-1.357c-2.09.454-2.531-.99-2.531-.99a1.987 1.987 0 00-.836-1.099c-.682-.465.052-.457.052-.457a1.575 1.575 0 011.147.772 1.597 1.597 0 002.183.623 1.597 1.597 0 01.476-1.002c-1.669-.187-3.424-.833-3.424-3.708a2.903 2.903 0 01.773-2.014 2.7 2.7 0 01.075-1.987s.63-.203 2.063.769a7.125 7.125 0 013.75 0c1.432-.972 2.062-.769 2.062-.769a2.7 2.7 0 01.076 1.987 2.895 2.895 0 01.772 2.014c0 2.884-1.76 3.517-3.434 3.704a1.8 1.8 0 01.51 1.391v2.063c0 .199.135.437.518.357A7.5 7.5 0 009 1.5z" fill="currentColor"/></svg>;

/* ── Integration card definitions ── */
const INTEGRATIONS = [
    {
        id: 'github',
        title: 'GitHub',
        description: 'Repos, branches, commits & PRs',
        category: 'development',
        icon: ghIcon,
        accentVar: '--text',
        tokenLabel: 'Personal Access Token',
        placeholder: 'ghp_...',
        hint: 'Connect via GitHub App with read-only access to your repositories',
        dashboardUrl: '/dashboard',
        apiConnect: 'oauth',
        apiCheck: '/tokens/github',
        patConnect: '/tokens/github', // fallback PAT endpoint
    },
    {
        id: 'devrev',
        title: 'DevRev',
        description: 'Sprint boards & agile workflows',
        category: 'project-management',
        logo: devrevLogo,
        accentVar: '--emerald',
        tokenLabel: 'Access Token',
        placeholder: 'eyJ...',
        hint: 'Generate a token from DevRev Settings → Account → Access Tokens',
        dashboardUrl: '/dashboard',
        apiConnect: '/devrev/connect',
        apiCheck: '/tokens/devrev',
    },
    {
        id: 'jira',
        title: 'Jira',
        description: 'Sprints, epics & issue tracking',
        category: 'project-management',
        logo: jiraLogo,
        accentVar: '--sky',
        tokenLabel: 'OAuth',
        placeholder: '',
        hint: 'Connect via Atlassian OAuth',
        dashboardUrl: '/dashboard',
        apiConnect: 'oauth', // special: uses OAuth redirect flow
        apiCheck: '/tokens/jira',
    },
    {
        id: 'gitlab',
        title: 'GitLab',
        description: 'Merge requests & pipeline data',
        category: 'development',
        logo: gitlabLogo,
        accentVar: '--orange',
        tokenLabel: 'Personal Access Token',
        placeholder: 'glpat-...',
        hint: 'Requires api scope',
        dashboardUrl: null,
        apiConnect: null,
        apiCheck: null,
    },
    {
        id: 'slack',
        title: 'Slack',
        description: 'Publish release notes to Slack channels',
        category: 'communication',
        logo: slackLogo,
        accentVar: '--amber',
        soon: false,
        dashboardUrl: null,
        apiConnect: 'oauth',
        apiCheck: null,
    },
];

const TABS = [
    ['all', 'All'],
    ['development', 'Development'],
    ['project-management', 'Project Mgmt'],
    ['communication', 'Communication'],
];

/* ── Edit Key Modal ── */
const EditKeyModal = ({ config, loading, error, onSubmit, onClose, mode = 'edit' }) => {
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
                        <div className="int-card-icon-v2" style={{ background: `var(${config.accentVar})0c`, color: `var(${config.accentVar})` }}>
                            {config.logo ? <img src={config.logo} alt={config.title} style={{ width: 20, height: 20, objectFit: 'contain' }} /> : config.icon || config.abbr}
                        </div>
                        <div>
                            <h3>{mode === 'connect' ? `Connect ${config.title}` : `Update ${config.title} Key`}</h3>
                            <p className="modal-subtitle">{mode === 'connect' ? 'Enter your access token to connect' : 'Enter a new access token below'}</p>
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
                                <><Loader2 size={16} className="spin" /> {mode === 'connect' ? 'Connecting...' : 'Updating...'}</>
                            ) : mode === 'connect' ? 'Connect' : 'Update Key'}
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
const IntegrationCard = ({ config, connected, onOpenModal, onConnect, onDelete, index }) => {
    const navigate = useNavigate();
    const isPlaceholder = !config.apiConnect;
    const isOAuth = config.apiConnect === 'oauth';

    return (
        <div className={`pp d${Math.min(index + 1, 5)} int-card-v2`} style={{ position: 'relative' }}>
            {connected && (
                <button className="int-card-delete-btn" onClick={onDelete} title="Disconnect">
                    <Trash2 size={14} />
                </button>
            )}
            <div className="int-card-accent-v2" style={{ background: connected ? `var(${config.accentVar})` : 'var(--s2)' }} />
            <div className="int-card-body-v2">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div className="int-card-icon-v2" style={{ background: `var(${config.accentVar})0c`, color: `var(${config.accentVar})` }}>
                        {config.logo ? <img src={config.logo} alt={config.title} style={{ width: 20, height: 20, objectFit: 'contain' }} /> : config.icon || config.abbr}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{config.title}</span>
                        {connected && <Pill color="emerald">Connected</Pill>}
                    </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, margin: '0 0 10px' }}>{config.description}</p>
            </div>

            {/* Footer actions */}
            <div className="int-card-footer-v2">
                {connected ? (
                    <div style={{ display: 'flex', gap: 6, width: '100%' }}>
                        {isOAuth ? (
                            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={onConnect}>Reconnect</button>
                        ) : (
                            <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={onOpenModal}>Edit Key</button>
                        )}
                        {config.dashboardUrl && (
                            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => navigate(config.dashboardUrl)}>Dashboard</button>
                        )}
                    </div>
                ) : config.soon ? (
                    <div className="int-coming-soon-v2">Coming Soon</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', alignItems: 'center' }}>
                        <button
                            className="btn btn-secondary int-btn-connect-v2"
                            onClick={() => isOAuth ? onConnect() : (isPlaceholder ? null : onOpenModal())}
                            disabled={isPlaceholder}
                        >
                            {isPlaceholder ? 'Coming Soon' : isOAuth ? `Connect with ${config.title}` : 'Connect'}
                        </button>
                        {config.patConnect && (
                            <button
                                className="int-pat-fallback"
                                onClick={onOpenModal}
                                style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Use token instead
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── Jira Site Selection Modal ── */
const SiteSelectModal = ({ sites, loading, onSelect, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return ReactDOM.createPortal(
        <div className="edit-key-overlay" onClick={onClose}>
            <div className="edit-key-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-row">
                        <div className="int-card-icon-v2" style={{ background: 'var(--sky)0c', color: 'var(--sky)' }}>
                            <img src={jiraLogo} alt="Jira" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                        </div>
                        <div>
                            <h3>Select Jira Site</h3>
                            <p className="modal-subtitle">You have access to multiple Jira sites. Choose one to connect.</p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {sites.map(site => (
                        <button
                            key={site.id}
                            className="btn btn-secondary btn-sm"
                            style={{ width: '100%', padding: '12px 16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2 }}
                            onClick={() => onSelect(site.id)}
                            disabled={loading}
                        >
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{site.name}</span>
                            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{site.url}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
};

/* ── Main Integration page ── */
const Integration = () => {
    const [connections, setConnections] = useState({});
    const [loadingState, setLoadingState] = useState({});
    const [errorState, setErrorState] = useState({});
    const [initialLoading, setInitialLoading] = useState(true);
    const [editingIntegration, setEditingIntegration] = useState(null);
    const [modalMode, setModalMode] = useState('edit'); // 'connect' | 'edit'
    const [deletingIntegration, setDeletingIntegration] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [searchParams, setSearchParams] = useSearchParams();
    const [jiraSites, setJiraSites] = useState(null); // for multi-site selection
    const [siteSelectLoading, setSiteSelectLoading] = useState(false);

    useEffect(() => {
        const checkTokens = async () => {
            try {
                const [ghRes, drRes, jiraRes, slackRes] = await Promise.all([
                    api.get('/tokens/github'),
                    api.get('/tokens/devrev'),
                    api.get('/tokens/jira'),
                    api.get('/tokens/slack'),
                ]);
                setConnections({
                    github: ghRes.data.hasToken,
                    devrev: drRes.data.hasToken,
                    jira: jiraRes.data.hasToken,
                    slack: slackRes.data.hasToken,
                });
            } catch (err) {
                console.error('Token check failed', err);
                toast.error('Failed to check integration status');
            } finally {
                setInitialLoading(false);
            }
        };
        checkTokens();
    }, []);

    // Handle Jira OAuth callback redirect
    useEffect(() => {
        const jiraStatus = searchParams.get('jira');
        if (jiraStatus === 'success') {
            setConnections(prev => ({ ...prev, jira: true }));
            setSearchParams({}, { replace: true });
        } else if (jiraStatus === 'select_site') {
            try {
                const sites = JSON.parse(searchParams.get('sites') || '[]');
                if (sites.length) setJiraSites(sites);
            } catch { /* ignore parse errors */ }
            setSearchParams({}, { replace: true });
        } else if (jiraStatus === 'error') {
            setErrorState(prev => ({ ...prev, jira: searchParams.get('message') || 'Jira connection failed' }));
            setSearchParams({}, { replace: true });
        }

        // Handle GitHub OAuth callback redirect
        const githubStatus = searchParams.get('github');
        if (githubStatus === 'success') {
            setConnections(prev => ({ ...prev, github: true }));
            toast.success('GitHub connected successfully!');
            setSearchParams({}, { replace: true });
        } else if (githubStatus === 'error') {
            const message = searchParams.get('message') || 'GitHub connection failed';
            setErrorState(prev => ({ ...prev, github: message }));
            setSearchParams({}, { replace: true });
        }

        // Handle Slack OAuth callback redirect
        const slackStatus = searchParams.get('slack');
        if (slackStatus === 'success') {
            setConnections(prev => ({ ...prev, slack: true }));
            toast.success('Slack connected successfully!');
            setSearchParams({}, { replace: true });
        } else if (slackStatus === 'error') {
            const message = searchParams.get('message') || 'Slack connection failed';
            setErrorState(prev => ({ ...prev, slack: message }));
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const handleJiraOAuth = async () => {
        try {
            setLoadingState(prev => ({ ...prev, jira: true }));
            const res = await api.get('/jira/auth');
            window.location.href = res.data.authUrl;
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to start Jira OAuth';
            toast.error(msg);
            setErrorState(prev => ({ ...prev, jira: msg }));
            setLoadingState(prev => ({ ...prev, jira: false }));
        }
    };

    const handleGitHubOAuth = async () => {
        try {
            setLoadingState(prev => ({ ...prev, github: true }));
            const res = await api.get('/github/auth');
            window.location.href = res.data.authUrl;
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to start GitHub OAuth';
            toast.error(msg);
            setErrorState(prev => ({ ...prev, github: msg }));
            setLoadingState(prev => ({ ...prev, github: false }));
        }
    };

    const handleSlackOAuth = async () => {
        try {
            setLoadingState(prev => ({ ...prev, slack: true }));
            const res = await api.get('/slack/auth');
            window.location.href = res.data.authUrl;
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to start Slack OAuth';
            toast.error(msg);
            setErrorState(prev => ({ ...prev, slack: msg }));
            setLoadingState(prev => ({ ...prev, slack: false }));
        }
    };

    const handleSelectJiraSite = async (siteId) => {
        setSiteSelectLoading(true);
        try {
            await api.post('/jira/select-site', { siteId });
            setConnections(prev => ({ ...prev, jira: true }));
            setJiraSites(null);
        } catch (err) {
            setErrorState(prev => ({ ...prev, jira: err.response?.data?.error || 'Failed to select site' }));
            setJiraSites(null);
        } finally {
            setSiteSelectLoading(false);
        }
    };

    const handleOpenModal = (integrationId, mode) => {
        setErrorState(prev => ({ ...prev, [integrationId]: '' }));
        setModalMode(mode);
        setEditingIntegration(integrationId);
    };

    const handleEditSubmit = async (token) => {
        if (!editingIntegration) return;
        const config = INTEGRATIONS.find(i => i.id === editingIntegration);
        if (!config) return;
        const endpoint = config.patConnect || config.apiConnect;
        if (!endpoint || endpoint === 'oauth') return;

        setLoadingState(prev => ({ ...prev, [editingIntegration]: true }));
        setErrorState(prev => ({ ...prev, [editingIntegration]: '' }));

        try {
            await api.post(endpoint, { token });
            setConnections(prev => ({ ...prev, [editingIntegration]: true }));
            setEditingIntegration(null);
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to update. Please try again.';
            toast.error(msg);
            setErrorState(prev => ({ ...prev, [editingIntegration]: msg }));
        } finally {
            setLoadingState(prev => ({ ...prev, [editingIntegration]: false }));
        }
    };

    const handleDelete = async (integrationId) => {
        try {
            await api.delete(`/tokens/${integrationId}`);
            setConnections(prev => ({ ...prev, [integrationId]: false }));
            setDeletingIntegration(null);
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to disconnect. Please try again.';
            setErrorState(prev => ({ ...prev, [integrationId]: msg }));
            setDeletingIntegration(null);
        }
    };

    const connectedCount = Object.values(connections).filter(Boolean).length;
    const availableCount = INTEGRATIONS.length;

    const filteredIntegrations = INTEGRATIONS.filter(item => {
        return activeTab === 'all' || item.category === activeTab;
    });

    return (
        <>
            <TopBar sub="Integrations" title="Connect Your Tools" />
            <div className="page-content">
                <p className="fu" style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 460, lineHeight: 1.6, marginBottom: 24 }}>
                    Seamlessly connect your development and project management tools. Releaslyy pulls data from all sources to generate unified release notes.
                </p>

                {/* Stats */}
                <div className="fu d1 int-stats-v2">
                    <div className="int-stat-item-v2">
                        <span className="int-stat-num-v2" style={{ color: 'var(--emerald)' }}>{connectedCount}</span>
                        <span className="int-stat-label-v2">Connected</span>
                    </div>
                    <div className="int-stat-item-v2">
                        <span className="int-stat-num-v2" style={{ color: 'var(--m2)' }}>{availableCount}</span>
                        <span className="int-stat-label-v2">Available</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="fu d2 int-tabs-v2">
                    {TABS.map(([id, l]) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`int-tab-btn-v2 ${activeTab === id ? 'active' : ''}`}
                        >
                            {l}
                        </button>
                    ))}
                </div>

                {/* Cards */}
                {initialLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '80px 0', color: 'var(--muted)' }}>
                        <Loader2 size={28} className="spin" />
                        <span>Checking connections...</span>
                    </div>
                ) : (
                    <>
                        <div className="int-grid-v2">
                            {filteredIntegrations.map((config, i) => (
                                <IntegrationCard
                                    key={config.id}
                                    config={config}
                                    connected={!!connections[config.id]}
                                    onOpenModal={() => handleOpenModal(config.id, connections[config.id] ? 'edit' : 'connect')}
                                    onConnect={config.apiConnect === 'oauth' ? (config.id === 'slack' ? handleSlackOAuth : config.id === 'github' ? handleGitHubOAuth : handleJiraOAuth) : undefined}
                                    onDelete={() => setDeletingIntegration(config.id)}
                                    index={i}
                                />
                            ))}
                        </div>

                        {editingIntegration && (
                            <EditKeyModal
                                config={INTEGRATIONS.find(i => i.id === editingIntegration)}
                                loading={!!loadingState[editingIntegration]}
                                error={errorState[editingIntegration] || ''}
                                onSubmit={handleEditSubmit}
                                onClose={() => setEditingIntegration(null)}
                                mode={modalMode}
                            />
                        )}

                        {jiraSites && (
                            <SiteSelectModal
                                sites={jiraSites}
                                loading={siteSelectLoading}
                                onSelect={handleSelectJiraSite}
                                onClose={() => setJiraSites(null)}
                            />
                        )}

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
        </>
    );
};

export default Integration;
