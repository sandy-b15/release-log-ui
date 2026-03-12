import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { X, Check, AlertCircle, Loader2, ExternalLink, RefreshCw } from 'lucide-react';
import githubLogo from '../../assets/github.png';
import jiraLogo from '../../assets/jira_logo.webp';
import devrevLogo from '../../assets/devrev-logo.webp';
import './PublishModal.css';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true,
});

const CHANNEL_META = {
    github: { name: 'GitHub Releases', logo: githubLogo },
    jira: { name: 'Jira Release', logo: jiraLogo },
    devrev: { name: 'DevRev Article', logo: devrevLogo },
};

const PublishModal = ({ open, onClose, noteId, noteTitle, getHtmlContent, getJsonContent, isPublished }) => {
    const navigate = useNavigate();
    // Channel enabled states
    const [githubEnabled, setGithubEnabled] = useState(false);
    const [jiraEnabled, setJiraEnabled] = useState(false);
    const [devrevEnabled, setDevrevEnabled] = useState(false);

    // GitHub config
    const [ghRepos, setGhRepos] = useState([]);
    const [ghTags, setGhTags] = useState([]);
    const [ghRepo, setGhRepo] = useState('');
    const [ghTag, setGhTag] = useState('');
    const [ghTitle, setGhTitle] = useState('');
    const [ghPrerelease, setGhPrerelease] = useState(false);
    const [ghDraft, setGhDraft] = useState(false);

    // Jira config
    const [jiraProjects, setJiraProjects] = useState([]);
    const [jiraProject, setJiraProject] = useState('');
    const [jiraVersionName, setJiraVersionName] = useState('');
    const [jiraMarkReleased, setJiraMarkReleased] = useState(false);
    const [jiraAddComments, setJiraAddComments] = useState(false);

    // DevRev config
    const [devrevParts, setDevrevParts] = useState([]);
    const [devrevTitle, setDevrevTitle] = useState('');
    const [devrevStatus, setDevrevStatus] = useState('published');
    const [devrevAccess, setDevrevAccess] = useState('internal');
    const [devrevPart, setDevrevPart] = useState('');

    // Connected status
    const [connectedServices, setConnectedServices] = useState([]);

    // Publishing state
    const [publishing, setPublishing] = useState(false);
    const [statuses, setStatuses] = useState(null); // null = not yet published
    const [publishedChannels, setPublishedChannels] = useState([]); // channels previously published to

    // Load connected services + publish history on open
    useEffect(() => {
        if (!open) return;
        // Reset state
        setStatuses(null);
        setPublishing(false);
        setPublishedChannels([]);
        setGhTitle(noteTitle || '');
        setDevrevTitle(noteTitle || '');

        api.get('/tokens').then((res) => {
            setConnectedServices(res.data.services || []);
        }).catch((err) => { toast.error(err.response?.data?.error || 'Failed to load connected services'); });

        if (noteId) {
            api.get(`/publish/history/${noteId}`).then((res) => {
                setPublishedChannels(res.data.publishedChannels || []);
            }).catch((err) => { toast.error(err.response?.data?.error || 'Failed to load publish history'); });
        }
    }, [open, noteTitle, noteId]);

    // Load GitHub repos when enabled
    useEffect(() => {
        if (githubEnabled && ghRepos.length === 0 && connectedServices.includes('github')) {
            api.get('/publish/github/repos').then((res) => {
                setGhRepos(res.data.repos || []);
            }).catch((err) => { toast.error(err.response?.data?.error || 'Failed to load GitHub repos'); });
        }
    }, [githubEnabled, connectedServices]);

    // Load GitHub tags when repo selected
    useEffect(() => {
        if (ghRepo) {
            api.get(`/publish/github/tags?repo=${encodeURIComponent(ghRepo)}`).then((res) => {
                setGhTags(res.data.tags || []);
            }).catch((err) => { toast.error(err.response?.data?.error || 'Failed to load GitHub tags'); });
        }
    }, [ghRepo]);

    // Load Jira projects when enabled
    useEffect(() => {
        if (jiraEnabled && jiraProjects.length === 0 && connectedServices.includes('jira')) {
            api.get('/publish/jira/projects').then((res) => {
                setJiraProjects(res.data.projects || []);
            }).catch((err) => { toast.error(err.response?.data?.error || 'Failed to load Jira projects'); });
        }
    }, [jiraEnabled, connectedServices]);

    // Load DevRev parts when enabled
    useEffect(() => {
        if (devrevEnabled && devrevParts.length === 0 && connectedServices.includes('devrev')) {
            api.get('/publish/devrev/parts').then((res) => {
                setDevrevParts(res.data.parts || []);
            }).catch((err) => { toast.error(err.response?.data?.error || 'Failed to load DevRev parts'); });
        }
    }, [devrevEnabled, connectedServices]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    const enabledCount = [githubEnabled, jiraEnabled, devrevEnabled].filter(Boolean).length;

    // Validation: check required fields per enabled channel
    const hasValidConfig = (() => {
        if (githubEnabled && (!ghRepo || !ghTag)) return false;
        if (jiraEnabled && (!jiraProject || !jiraVersionName)) return false;
        if (devrevEnabled && !devrevTitle) return false;
        return true;
    })();

    const handlePublish = useCallback(async () => {
        if (enabledCount === 0) return;
        setPublishing(true);

        const htmlContent = getHtmlContent();
        const jsonContent = getJsonContent ? getJsonContent() : null;
        const channels = [];

        if (githubEnabled) {
            channels.push({
                type: 'github',
                enabled: true,
                config: { repo: ghRepo, tag: ghTag, title: ghTitle, prerelease: ghPrerelease, draft: ghDraft },
            });
        }
        if (jiraEnabled) {
            channels.push({
                type: 'jira',
                enabled: true,
                config: {
                    projectKey: jiraProject,
                    versionName: jiraVersionName,
                    markReleased: jiraMarkReleased,
                    addComments: jiraAddComments,
                    issueKeys: [],
                },
            });
        }
        if (devrevEnabled) {
            channels.push({
                type: 'devrev',
                enabled: true,
                config: {
                    title: devrevTitle,
                    status: devrevStatus,
                    accessLevel: devrevAccess,
                    partId: devrevPart || undefined,
                    partName: devrevPart ? devrevParts.find(p => p.id === devrevPart)?.name : undefined,
                },
            });
        }

        try {
            const res = await api.post('/publish', {
                releaseNoteId: noteId,
                htmlContent,
                jsonContent,
                channels,
            });
            setStatuses(res.data.statuses);
            // Update published channels with newly successful ones
            const newlyPublished = res.data.statuses.filter((s) => s.status === 'success').map((s) => s.type);
            if (newlyPublished.length > 0) {
                setPublishedChannels((prev) => [...new Set([...prev, ...newlyPublished])]);
            }
            const successes = newlyPublished.length;
            if (successes === res.data.statuses.length) {
                toast.success('Published to all channels!');
            } else if (successes > 0) {
                toast.success(`Published to ${successes} of ${res.data.statuses.length} channels`);
            } else {
                toast.error('All channels failed to publish');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Publish failed');
        } finally {
            setPublishing(false);
        }
    }, [enabledCount, getHtmlContent, noteId, githubEnabled, jiraEnabled, devrevEnabled,
        ghRepo, ghTag, ghTitle, ghPrerelease, ghDraft,
        jiraProject, jiraVersionName, jiraMarkReleased, jiraAddComments,
        devrevTitle, devrevStatus, devrevAccess, devrevPart]);

    const handleRetry = useCallback(async (channelType) => {
        setPublishing(true);
        const htmlContent = getHtmlContent();
        const jsonContent = getJsonContent ? getJsonContent() : null;
        let config;

        if (channelType === 'github') {
            config = { repo: ghRepo, tag: ghTag, title: ghTitle, prerelease: ghPrerelease, draft: ghDraft };
        } else if (channelType === 'jira') {
            config = { projectKey: jiraProject, versionName: jiraVersionName, markReleased: jiraMarkReleased, addComments: jiraAddComments, issueKeys: [] };
        } else {
            config = { title: devrevTitle, status: devrevStatus, accessLevel: devrevAccess, partId: devrevPart || undefined, partName: devrevPart ? devrevParts.find(p => p.id === devrevPart)?.name : undefined };
        }

        try {
            const res = await api.post('/publish', {
                releaseNoteId: noteId,
                htmlContent,
                jsonContent,
                channels: [{ type: channelType, enabled: true, config }],
            });
            // Merge retry result into existing statuses
            setStatuses((prev) =>
                prev.map((s) => (s.type === channelType ? res.data.statuses[0] : s))
            );
            if (res.data.statuses[0].status === 'success') {
                toast.success(`${CHANNEL_META[channelType].name} published!`);
            } else {
                toast.error(`${CHANNEL_META[channelType].name} failed again`);
            }
        } catch (err) {
            toast.error('Retry failed');
        } finally {
            setPublishing(false);
        }
    }, [getHtmlContent, noteId, ghRepo, ghTag, ghTitle, ghPrerelease, ghDraft,
        jiraProject, jiraVersionName, jiraMarkReleased, jiraAddComments,
        devrevTitle, devrevStatus, devrevAccess, devrevPart]);

    if (!open) return null;

    const isConnected = (service) => connectedServices.includes(service);

    return ReactDOM.createPortal(
        <div className="publish-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="publish-panel">
                {/* Header */}
                <div className="publish-header">
                    <h2>Publish Release Notes</h2>
                    <button className="publish-close-btn" onClick={onClose}><X size={18} /></button>
                </div>

                {/* Body */}
                <div className="publish-body">
                    {isPublished && !statuses && (
                        <div className="publish-already-published">
                            <Check size={14} />
                            This note has been published before. You can republish to additional channels.
                        </div>
                    )}
                    {statuses ? (
                        /* ── Status View ── */
                        <div className="publish-status-list">
                            {statuses.map((s) => (
                                <div key={s.type} className={`publish-status-item ${s.status}`}>
                                    <div className={`status-icon ${s.status}`}>
                                        {s.status === 'success' && <Check size={14} />}
                                        {s.status === 'failed' && <AlertCircle size={14} />}
                                        {s.status === 'pending' && <div className="publish-spinner" />}
                                    </div>
                                    <div className="status-details">
                                        <div className="status-channel-name">{CHANNEL_META[s.type]?.name || s.type}</div>
                                        {s.status === 'success' && (
                                            <>
                                                <div className="status-message">{s.result?.message}</div>
                                                {s.result?.url && (
                                                    <a className="status-link" href={s.result.url} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink size={11} /> {s.result.url}
                                                    </a>
                                                )}
                                            </>
                                        )}
                                        {s.status === 'failed' && (
                                            <>
                                                <div className="status-error">{s.error}</div>
                                                <button className="status-retry-btn" onClick={() => handleRetry(s.type)} disabled={publishing}>
                                                    <RefreshCw size={11} /> Retry
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* ── Channel Cards ── */
                        <>
                            {/* GitHub */}
                            <ChannelCard
                                type="github"
                                enabled={githubEnabled}
                                onToggle={setGithubEnabled}
                                connected={isConnected('github')}
                                published={publishedChannels.includes('github')}
                                onNavigate={(path) => { onClose(); navigate(path); }}
                            >
                                <div className="config-field">
                                    <label>Repository</label>
                                    <select value={ghRepo} onChange={(e) => setGhRepo(e.target.value)}>
                                        <option value="">Select repository...</option>
                                        {ghRepos.map((r) => (
                                            <option key={r.full_name} value={r.full_name}>{r.full_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="config-field">
                                    <label>Tag Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. v2.4.0"
                                        value={ghTag}
                                        onChange={(e) => setGhTag(e.target.value)}
                                        list="gh-tags-list"
                                    />
                                    <datalist id="gh-tags-list">
                                        {ghTags.map((t) => <option key={t} value={t} />)}
                                    </datalist>
                                </div>
                                <div className="config-field">
                                    <label>Release Title</label>
                                    <input
                                        type="text"
                                        placeholder="Release title"
                                        value={ghTitle}
                                        onChange={(e) => setGhTitle(e.target.value)}
                                    />
                                </div>
                                <div className="config-row">
                                    <span className="config-row-label">Pre-release</span>
                                    <MiniToggle checked={ghPrerelease} onChange={setGhPrerelease} />
                                </div>
                                <div className="config-row">
                                    <span className="config-row-label">Draft</span>
                                    <MiniToggle checked={ghDraft} onChange={setGhDraft} />
                                </div>
                            </ChannelCard>

                            {/* Jira */}
                            <ChannelCard
                                type="jira"
                                enabled={jiraEnabled}
                                onToggle={setJiraEnabled}
                                connected={isConnected('jira')}
                                published={publishedChannels.includes('jira')}
                                onNavigate={(path) => { onClose(); navigate(path); }}
                            >
                                <div className="config-field">
                                    <label>Project</label>
                                    <select value={jiraProject} onChange={(e) => setJiraProject(e.target.value)}>
                                        <option value="">Select project...</option>
                                        {jiraProjects.map((p) => (
                                            <option key={p.key} value={p.key}>{p.name} ({p.key})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="config-field">
                                    <label>Version Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. v2.4.0"
                                        value={jiraVersionName}
                                        onChange={(e) => setJiraVersionName(e.target.value)}
                                    />
                                </div>
                                <div className="config-row">
                                    <span className="config-row-label">Mark as Released</span>
                                    <MiniToggle checked={jiraMarkReleased} onChange={setJiraMarkReleased} />
                                </div>
                                <div className="config-row">
                                    <span className="config-row-label">Add comments to issues</span>
                                    <MiniToggle checked={jiraAddComments} onChange={setJiraAddComments} />
                                </div>
                            </ChannelCard>

                            {/* DevRev */}
                            <ChannelCard
                                type="devrev"
                                enabled={devrevEnabled}
                                onToggle={setDevrevEnabled}
                                connected={isConnected('devrev')}
                                published={publishedChannels.includes('devrev')}
                                onNavigate={(path) => { onClose(); navigate(path); }}
                            >
                                <div className="config-field">
                                    <label>Article Title</label>
                                    <input
                                        type="text"
                                        placeholder="Article title"
                                        value={devrevTitle}
                                        onChange={(e) => setDevrevTitle(e.target.value)}
                                    />
                                </div>
                                <div className="config-field">
                                    <label>Status</label>
                                    <select value={devrevStatus} onChange={(e) => setDevrevStatus(e.target.value)}>
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="review_needed">Review Needed</option>
                                    </select>
                                </div>
                                <div className="config-field">
                                    <label>Access Level</label>
                                    <select value={devrevAccess} onChange={(e) => setDevrevAccess(e.target.value)}>
                                        <option value="public">Public</option>
                                        <option value="internal">Internal</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                                {devrevParts.length > 0 && (
                                    <div className="config-field">
                                        <label>Part (Product/Feature)</label>
                                        <select value={devrevPart} onChange={(e) => setDevrevPart(e.target.value)}>
                                            <option value="">None</option>
                                            {devrevParts.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </ChannelCard>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="publish-footer">
                    {statuses ? (
                        <button className="btn btn-primary" onClick={() => {
                            const hasSuccess = statuses.some((s) => s.status === 'success');
                            onClose(hasSuccess);
                        }}>
                            Done
                        </button>
                    ) : (
                        <>
                            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                disabled={enabledCount === 0 || !hasValidConfig || publishing}
                                onClick={handlePublish}
                            >
                                {publishing ? (
                                    <>
                                        Publishing
                                        <div className="publish-loading-dots">
                                            <span /><span /><span />
                                        </div>
                                    </>
                                ) : (
                                    `Publish to ${enabledCount} channel${enabledCount !== 1 ? 's' : ''}`
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

/* ── Channel Card wrapper ── */
const ChannelCard = ({ type, enabled, onToggle, connected, published, onNavigate, children }) => {
    const meta = CHANNEL_META[type];
    return (
        <div className={`channel-card ${enabled ? 'active' : ''} ${published ? 'published' : ''}`} data-channel={type}>
            <div className="channel-card-header" onClick={() => connected && onToggle(!enabled)}>
                <div className="channel-card-info">
                    <div className="channel-card-icon">
                        <img src={meta.logo} alt={meta.name} />
                    </div>
                    <div>
                        <div className="channel-card-title">
                            {meta.name}
                            {published && <span className="channel-published-badge"><Check size={10} /> Published</span>}
                        </div>
                        <div className="channel-card-subtitle">
                            {connected ? (enabled ? 'Enabled' : 'Click to enable') : 'Not connected'}
                        </div>
                    </div>
                </div>
                {connected && (
                    <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)} />
                        <span className="toggle-slider" />
                    </label>
                )}
            </div>
            {!connected && (
                <div className="channel-not-connected">
                    <AlertCircle size={14} />
                    Not connected — <a className="channel-connect-link" onClick={(e) => { e.stopPropagation(); onNavigate('/integration'); }}>go to Integrations</a> to set up {meta.name}
                </div>
            )}
            {enabled && connected && (
                <div className="channel-config">
                    {children}
                </div>
            )}
        </div>
    );
};

/* ── Mini Toggle for config rows ── */
const MiniToggle = ({ checked, onChange }) => (
    <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="toggle-slider" />
    </label>
);

export default PublishModal;
