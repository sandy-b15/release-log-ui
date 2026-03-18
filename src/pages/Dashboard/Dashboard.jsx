import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RefreshCw, Square, CheckSquare, Trash2, Search, X, Check, Plus, Loader2 } from 'lucide-react';
import api, { authApi } from '../../lib/api';
import TopBar from '../../components/Header/Header';
import DataSelector from '../../components/DataSelector/DataSelector';
import Pill from '../../components/ui/Pill';
import StepIndicator from '../../components/ui/StepIndicator';
import SearchDropdown from '../../components/ui/SearchDropdown';
import devrevLogo from '../../assets/devrev-logo.webp';
import jiraLogo from '../../assets/jira_logo.webp';
import linearLogo from '../../assets/linear-logo.svg';
import asanaLogo from '../../assets/asana-logo.svg';
import clickupLogo from '../../assets/clickup-logo.svg';
import mondayLogo from '../../assets/monday-logo.svg';
import grokLogo from '../../assets/grok-logo.webp';
import openaiLogo from '../../assets/openai-logo.svg';
import anthropicLogo from '../../assets/anthropic-logo.svg';
import geminiLogo from '../../assets/gemini-logo.svg';
import releaslyLogo from '../../assets/logos/releaslyy-logo-main.png';

const llmProviderLogos = { releasly: releaslyLogo, groq: grokLogo, openai: openaiLogo, anthropic: anthropicLogo, gemini: geminiLogo };
const llmProviderLabels = { releasly: 'Releaslyy AI', groq: 'Grok', openai: 'OpenAI', anthropic: 'Anthropic', gemini: 'Gemini' };
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import LLMSelector from '../../components/generate/LLMSelector';
import { useLLMKeys } from '../../hooks/useLLMKeys';
import { useEntitlements } from '../../hooks/useEntitlements';
import toast from 'react-hot-toast';
import './Dashboard.css';

/* ── Micro Icons ── */
const ic = {
    doc: <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="3" y="1.5" width="12" height="15" rx="2" stroke="currentColor" strokeWidth="1.4" /><path d="M6 5.5h6M6 8.5h6M6 11.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
    plug: <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M6 1.5v3M12 1.5v3M4.5 4.5h9a1.5 1.5 0 011.5 1.5v.75a4.5 4.5 0 01-4.5 4.5h0a4.5 4.5 0 01-4.5-4.5V6a1.5 1.5 0 011.5-1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M9 11.25v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
    send: <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M11.5 1.5L6 7m5.5-5.5l-3.5 11L6 7m5.5-5.5L1 4.5 6 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    plus: <svg width="15" height="15" fill="none" viewBox="0 0 15 15"><path d="M7.5 2v11M2 7.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    arr: <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M2 6.5h9m0 0L7.5 3m3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    back: <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M11 6.5H2m0 0L5.5 3M2 6.5L5.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    spark: <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M9 1.5l1.35 4.95L15.3 5.1 11.25 9l4.05 3.9-4.95-1.35L9 16.5l-1.35-4.95L2.7 12.9 6.75 9 2.7 5.1l4.95 1.35L9 1.5z" fill="currentColor" /></svg>,
    gh: <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M9 1.5A7.5 7.5 0 006.63 16.11c.375.068.513-.163.513-.36v-1.357c-2.09.454-2.531-.99-2.531-.99a1.987 1.987 0 00-.836-1.099c-.682-.465.052-.457.052-.457a1.575 1.575 0 011.147.772 1.597 1.597 0 002.183.623 1.597 1.597 0 01.476-1.002c-1.669-.187-3.424-.833-3.424-3.708a2.903 2.903 0 01.773-2.014 2.7 2.7 0 01.075-1.987s.63-.203 2.063.769a7.125 7.125 0 013.75 0c1.432-.972 2.062-.769 2.062-.769a2.7 2.7 0 01.076 1.987 2.895 2.895 0 01.772 2.014c0 2.884-1.76 3.517-3.434 3.704a1.8 1.8 0 01.51 1.391v2.063c0 .199.135.437.518.357A7.5 7.5 0 009 1.5z" fill="currentColor" /></svg>,
    layers: <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M9 1.5L1.5 6 9 10.5 16.5 6 9 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M1.5 12l7.5 4.5 7.5-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M1.5 9l7.5 4.5L16.5 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    key: <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M10.5 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" stroke="currentColor" strokeWidth="1.4" /><path d="M9.75 10.5l5.25 5.25M12.75 13.5l2.25-2.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

const JIRA_FILTER_DEFS = [
    { key: 'type', label: 'Issue Type', extract: i => i.issueType },
    { key: 'status', label: 'Status', extract: i => i.status },
    { key: 'priority', label: 'Priority', extract: i => i.priority },
    { key: 'assignee', label: 'Assignee', extract: i => i.assignee },
    { key: 'labels', label: 'Labels', extract: i => i.labels || [], multi: true },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const { savedKeys, catalogue } = useLLMKeys();
    const { canUse, usage, entitlements, refetch: refetchEntitlements } = useEntitlements();

    // -- Global Dashboard State --
    const [view, setView] = useState('overview'); // 'overview' | 'generate'
    const [sources, setSources] = useState(['github']); // array of 'github' | 'devrev' | 'jira'
    const [user, setUser] = useState(null);
    const [connectedIntegrations, setConnectedIntegrations] = useState([]);

    // -- Notes State --
    const [generatedNotes, setGeneratedNotes] = useState([]);
    const [totalNotesGenerated, setTotalNotesGenerated] = useState(0);

    // -- Publish Activity State --
    const [publishEvents, setPublishEvents] = useState([]);
    const [publishedCount, setPublishedCount] = useState(0);

    // -- GitHub State --
    const [repos, setRepos] = useState([]);
    const [branches, setBranches] = useState([]);
    const [commits, setCommits] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(() => sessionStorage.getItem('github_selectedRepo') || '');
    const [selectedBranch, setSelectedBranch] = useState(() => sessionStorage.getItem('github_selectedBranch') || '');
    const [selectedCommits, setSelectedCommits] = useState(() => {
        const saved = sessionStorage.getItem('github_selectedCommits');
        try { return saved ? JSON.parse(saved) : []; } catch { return []; }
    });
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

    // -- DevRev State --
    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(() => {
        const saved = sessionStorage.getItem('devrev_selectedBoard');
        try { return saved ? JSON.parse(saved) : null; } catch { return null; }
    });
    const [sprints, setSprints] = useState([]);
    const [selectedSprints, setSelectedSprints] = useState(() => {
        const saved = sessionStorage.getItem('devrev_selectedSprints');
        try { return saved ? JSON.parse(saved) : []; } catch { return []; }
    });
    const [boardSearch, setBoardSearch] = useState('');
    const [sprintSearch, setSprintSearch] = useState('');
    const [sprintFilter, setSprintFilter] = useState('completed');
    const [devrevItems, setDevrevItems] = useState([]);
    const [devrevSelectedItems, setDevrevSelectedItems] = useState([]);
    const [devrevItemSearch, setDevrevItemSearch] = useState('');

    // -- Jira State --
    const [jiraProjects, setJiraProjects] = useState([]);
    const [jiraSelectedProject, setJiraSelectedProject] = useState(null);
    const [jiraBoards, setJiraBoards] = useState([]);
    const [jiraSelectedBoard, setJiraSelectedBoard] = useState(null);
    const [jiraSprints, setJiraSprints] = useState([]);
    const [jiraSelectedSprints, setJiraSelectedSprints] = useState([]);
    const [jiraIssues, setJiraIssues] = useState([]);
    const [jiraSelectedIssues, setJiraSelectedIssues] = useState([]);
    const [jiraIssueSearch, setJiraIssueSearch] = useState('');
    const [jiraMode, setJiraMode] = useState('sprint'); // 'sprint' | 'version'
    const [jiraVersions, setJiraVersions] = useState([]);
    const [jiraSelectedVersions, setJiraSelectedVersions] = useState([]);
    const [jiraSearchOpen, setJiraSearchOpen] = useState(false);
    const [jiraFilters, setJiraFilters] = useState({}); // { type: 'Bug', status: 'Done', ... }
    const [jiraFilterPickerOpen, setJiraFilterPickerOpen] = useState(false);
    const [jiraFilterSubMenu, setJiraFilterSubMenu] = useState(null);
    const jiraFilterRef = useRef(null);

    // -- Linear State --
    const [linearTeams, setLinearTeams] = useState([]);
    const [linearSelectedTeam, setLinearSelectedTeam] = useState(null);
    const [linearProjects, setLinearProjects] = useState([]);
    const [linearCycles, setLinearCycles] = useState([]);
    const [linearSelectedProject, setLinearSelectedProject] = useState(null);
    const [linearSelectedCycle, setLinearSelectedCycle] = useState(null);
    const [linearIssues, setLinearIssues] = useState([]);
    const [linearSelectedIssues, setLinearSelectedIssues] = useState([]);
    const [linearIssueSearch, setLinearIssueSearch] = useState('');

    // -- Asana State --
    const [asanaWorkspaces, setAsanaWorkspaces] = useState([]);
    const [asanaSelectedWorkspace, setAsanaSelectedWorkspace] = useState(null);
    const [asanaProjects, setAsanaProjects] = useState([]);
    const [asanaSelectedProject, setAsanaSelectedProject] = useState(null);
    const [asanaSections, setAsanaSections] = useState([]);
    const [asanaSelectedSection, setAsanaSelectedSection] = useState(null);
    const [asanaTasks, setAsanaTasks] = useState([]);
    const [asanaSelectedTasks, setAsanaSelectedTasks] = useState([]);
    const [asanaTaskSearch, setAsanaTaskSearch] = useState('');

    // -- ClickUp State --
    const [clickupWorkspaces, setClickupWorkspaces] = useState([]);
    const [clickupSelectedWorkspace, setClickupSelectedWorkspace] = useState(null);
    const [clickupSpaces, setClickupSpaces] = useState([]);
    const [clickupSelectedSpace, setClickupSelectedSpace] = useState(null);
    const [clickupLists, setClickupLists] = useState([]);
    const [clickupSelectedList, setClickupSelectedList] = useState(null);
    const [clickupTasks, setClickupTasks] = useState([]);
    const [clickupSelectedTasks, setClickupSelectedTasks] = useState([]);
    const [clickupTaskSearch, setClickupTaskSearch] = useState('');

    // -- Monday State --
    const [mondayBoards, setMondayBoards] = useState([]);
    const [mondaySelectedBoard, setMondaySelectedBoard] = useState(null);
    const [mondayGroups, setMondayGroups] = useState([]);
    const [mondaySelectedGroup, setMondaySelectedGroup] = useState(null);
    const [mondayItems, setMondayItems] = useState([]);
    const [mondaySelectedItems, setMondaySelectedItems] = useState([]);
    const [mondayItemSearch, setMondayItemSearch] = useState('');

    // -- Shared Gen State --
    const [audience, setAudience] = useState(() => sessionStorage.getItem('shared_audience') || 'qa');
    const [releaseTitle, setReleaseTitle] = useState('');
    const [tone, setTone] = useState('professional');
    const [llmConfig, setLlmConfig] = useState({ provider: 'releasly', model: null, apiKeyOverride: null });
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [customPrompt, setCustomPrompt] = useState('');
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [audienceOptions, setAudienceOptions] = useState([]);
    const [audiencesLoading, setAudiencesLoading] = useState(true);

    // -- Generate Wizard State --
    const [step, setStep] = useState(1);
    const [sourceTab, setSourceTab] = useState('github'); // active tab in Step 2

    // Keep sourceTab in sync with sources
    useEffect(() => {
        if (sources.length > 0 && !sources.includes(sourceTab)) {
            setSourceTab(sources[0]);
        }
    }, [sources, sourceTab]);

    // --- Persist State ---
    useEffect(() => { sessionStorage.setItem('github_selectedRepo', selectedRepo); }, [selectedRepo]);
    useEffect(() => { sessionStorage.setItem('github_selectedBranch', selectedBranch); }, [selectedBranch]);
    useEffect(() => { sessionStorage.setItem('github_selectedCommits', JSON.stringify(selectedCommits)); }, [selectedCommits]);
    useEffect(() => {
        if (selectedBoard) sessionStorage.setItem('devrev_selectedBoard', JSON.stringify(selectedBoard));
        else sessionStorage.removeItem('devrev_selectedBoard');
    }, [selectedBoard]);
    useEffect(() => { sessionStorage.setItem('devrev_selectedSprints', JSON.stringify(selectedSprints)); }, [selectedSprints]);
    useEffect(() => { sessionStorage.setItem('shared_audience', audience); }, [audience]);

    // --- Fetch Audience Options ---
    const fetchAudiences = () => {
        setAudiencesLoading(true);
        api.get('/audiences')
            .then(res => { setAudienceOptions(res.data); setAudiencesLoading(false); })
            .catch(() => { setAudiencesLoading(false); toast.error('Failed to load audience types'); });
    };
    useEffect(() => { fetchAudiences(); }, []);

    // --- Initialization ---
    useEffect(() => {
        const init = async () => {
            try {
                const userRes = await authApi.get('/auth/me');
                if (userRes.data && userRes.data.id) setUser(userRes.data);

                const [ghRes, drRes, jiraRes, linearRes, asanaRes, clickupRes, mondayRes] = await Promise.all([
                    api.get('/tokens/github').catch(() => ({ data: { hasToken: false } })),
                    api.get('/tokens/devrev').catch(() => ({ data: { hasToken: false } })),
                    api.get('/tokens/jira').catch(() => ({ data: { hasToken: false } })),
                    api.get('/tokens/linear').catch(() => ({ data: { hasToken: false } })),
                    api.get('/tokens/asana').catch(() => ({ data: { hasToken: false } })),
                    api.get('/tokens/clickup').catch(() => ({ data: { hasToken: false } })),
                    api.get('/tokens/monday').catch(() => ({ data: { hasToken: false } })),
                ]);

                try {
                    const tokensRes = await api.get('/tokens');
                    const services = tokensRes.data.services || [];
                    const SERVICE_LABELS = { github: 'GitHub', devrev: 'DevRev', jira: 'Jira', linear: 'Linear', asana: 'Asana', clickup: 'ClickUp', monday: 'Monday.com' };
                    const formatted = services.map(s => SERVICE_LABELS[s] || s.charAt(0).toUpperCase() + s.slice(1));
                    setConnectedIntegrations(formatted);
                } catch (e) {
                    console.error("Failed to fetch all tokens", e);
                    toast.error('Failed to load connected integrations');
                }

                try {
                    const activeProjectId = userRes.data.active_project_id;
                    const notesParams = activeProjectId ? { params: { projectId: activeProjectId } } : {};
                    const notesRes = await api.get('/notes', notesParams);
                    setGeneratedNotes(notesRes.data.notes || []);
                    const countRes = await api.get('/notes/count');
                    setTotalNotesGenerated(countRes.data.count || 0);
                } catch (e) {
                    console.error("Failed to fetch notes", e);
                    toast.error('Failed to load release notes');
                }

                try {
                    const activityRes = await api.get('/publish/activity');
                    setPublishEvents(activityRes.data.events || []);
                    setPublishedCount(activityRes.data.publishedCount || 0);
                } catch (e) {
                    console.error("Failed to fetch publish activity", e);
                    toast.error('Failed to load publish activity');
                }

                // Set default sources based on connected integrations
                const defaultSources = [];
                if (ghRes.data.hasToken) defaultSources.push('github');
                if (drRes.data.hasToken) defaultSources.push('devrev');
                if (jiraRes.data.hasToken) defaultSources.push('jira');
                if (linearRes.data.hasToken) defaultSources.push('linear');
                if (asanaRes.data.hasToken) defaultSources.push('asana');
                if (clickupRes.data.hasToken) defaultSources.push('clickup');
                if (mondayRes.data.hasToken) defaultSources.push('monday');
                if (defaultSources.length > 0) setSources([defaultSources[0]]);
                if (ghRes.data.hasToken) fetchRepos(selectedRepo, selectedBranch);
                if (drRes.data.hasToken) fetchBoards(selectedBoard);
                if (jiraRes.data.hasToken) fetchJiraProjects();
                if (linearRes.data.hasToken) fetchLinearTeams();
                if (asanaRes.data.hasToken) fetchAsanaWorkspaces();
                if (clickupRes.data.hasToken) fetchClickUpWorkspaces();
                if (mondayRes.data.hasToken) fetchMondayBoards();

                setDashboardLoading(false);
            } catch (err) {
                console.error("Dashboard Init Error", err);
                toast.error('Failed to initialize dashboard');
                setDashboardLoading(false);
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- GitHub Logic ---
    const fetchRepos = async (initialRepo, initialBranch) => {
        try {
            const res = await api.get('/github/repos');
            setRepos(res.data);
            if (initialRepo) {
                const [owner, repo] = initialRepo.split('/');
                const branchRes = await api.get('/github/branches', { params: { owner, repo } });
                setBranches(branchRes.data);
                if (initialBranch) fetchCommits(initialRepo, initialBranch, dateRange, false);
            }
        } catch (err) { console.error("GH fetchRepos", err); toast.error('Failed to load repositories'); }
    };

    const handleSelectRepo = async (repoFullName) => {
        setSelectedRepo(repoFullName);
        setSelectedBranch('');
        setCommits([]);
        setSelectedCommits([]);
        try {
            const [owner, repo] = repoFullName.split('/');
            const res = await api.get('/github/branches', { params: { owner, repo } });
            setBranches(res.data);
            const defaultBranch = res.data.find(b => b.name === 'main' || b.name === 'master');
            if (defaultBranch) handleSelectBranch(defaultBranch.name, repoFullName);
        } catch (err) { console.error(err); toast.error('Failed to load branches'); }
    };

    const handleSelectBranch = async (branch, repoOverride = null) => {
        const currentRepo = repoOverride || selectedRepo;
        setSelectedBranch(branch);
        fetchCommits(currentRepo, branch, dateRange, true);
    };

    useEffect(() => {
        if (selectedRepo && selectedBranch && view === 'generate' && sources.includes('github')) {
            fetchCommits(selectedRepo, selectedBranch, dateRange, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange.startDate, dateRange.endDate]);

    const fetchCommits = async (repoFull, branch, dateRangeObj, autoSelectAll = false) => {
        if (!repoFull || !branch) return;
        setLoadingData(true);
        const [owner, repoName] = repoFull.split('/');
        try {
            const params = { owner, repo: repoName, base: branch, state: 'closed' };
            const res = await api.get('/github/pulls', { params });
            let fetched = res.data;
            if (dateRangeObj?.startDate && dateRangeObj?.endDate) {
                const start = new Date(dateRangeObj.startDate);
                const end = new Date(dateRangeObj.endDate);
                fetched = fetched.filter(pr => {
                    const mergedDate = new Date(pr.merged_at);
                    return mergedDate >= start && mergedDate <= end;
                });
            }
            setCommits(fetched);
            if (autoSelectAll) setSelectedCommits(fetched.map(c => c.id));
        } catch (err) { console.error("GH fetchCommits", err); toast.error('Failed to load pull requests'); }
        finally { setLoadingData(false); }
    };

    const handleToggleCommit = (id) => {
        setSelectedCommits(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };
    const handleToggleAllCommits = () => {
        setSelectedCommits(selectedCommits.length === commits.length ? [] : commits.map(c => c.id));
    };

    // --- DevRev Logic ---
    const fetchBoards = async (initialBoard) => {
        try {
            const res = await api.get('/devrev/sprint-boards');
            setBoards(res.data.data || []);
            if (initialBoard) fetchSprintsForBoard(initialBoard.id);
        } catch (err) { console.error("DR fetchBoards", err); toast.error('Failed to load DevRev boards'); }
    };

    const handleSelectBoard = async (board) => {
        setSelectedBoard(board);
        setSprints([]);
        setSelectedSprints([]);
        setDevrevItems([]);
        setDevrevSelectedItems([]);
        fetchSprintsForBoard(board.id);
    };

    const fetchSprintsForBoard = async (boardId) => {
        setLoadingData(true);
        try {
            const res = await api.post('/devrev/groups', { parent_id: boardId });
            setSprints(res.data.data || []);
        } catch (err) { console.error("DR fetchSprints", err); toast.error('Failed to load sprints'); }
        finally { setLoadingData(false); }
    };

    const handleToggleSprint = (sprint) => {
        setSelectedSprints(prev => {
            const exists = prev.find(s => s.id === sprint.id);
            const next = exists ? prev.filter(s => s.id !== sprint.id) : [...prev, sprint];
            fetchDevrevItems(next.map(s => s.id));
            return next;
        });
    };

    const handleToggleAllSprints = () => {
        const filtered = filteredSprints;
        const allSelected = filtered.every(s => selectedSprints.find(selected => selected.id === s.id));
        let next;
        if (allSelected) {
            next = selectedSprints.filter(selected => !filtered.find(s => s.id === selected.id));
        } else {
            const newSprints = filtered.filter(s => !selectedSprints.find(selected => selected.id === s.id));
            next = [...selectedSprints, ...newSprints];
        }
        setSelectedSprints(next);
        fetchDevrevItems(next.map(s => s.id));
    };

    const fetchDevrevItems = async (sprintIds) => {
        if (!sprintIds.length) { setDevrevItems([]); setDevrevSelectedItems([]); return; }
        setDevrevItems([]); setDevrevSelectedItems([]);
        setLoadingData(true);
        try {
            const res = await api.post('/devrev/sprint-items', { sprintIds });
            setDevrevItems(res.data.items || []);
        } catch (err) { console.error("DR fetchItems", err); toast.error('Failed to load DevRev work items'); }
        finally { setLoadingData(false); }
    };

    const handleToggleDevrevItem = (item) => {
        setDevrevSelectedItems(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) return prev.filter(i => i.id !== item.id);
            return [...prev, item];
        });
    };

    const handleToggleAllDevrevItems = () => {
        const filtered = filteredDevrevItems;
        const allSelected = filtered.every(i => devrevSelectedItems.find(s => s.id === i.id));
        if (allSelected) {
            setDevrevSelectedItems(prev => prev.filter(s => !filtered.find(i => i.id === s.id)));
        } else {
            const newItems = filtered.filter(i => !devrevSelectedItems.find(s => s.id === i.id));
            setDevrevSelectedItems(prev => [...prev, ...newItems]);
        }
    };

    const filteredDevrevItems = devrevItems.filter(item =>
        (item.title || '').toLowerCase().includes(devrevItemSearch.toLowerCase()) ||
        (item.display_id || '').toLowerCase().includes(devrevItemSearch.toLowerCase())
    );

    const filteredBoards = boards.filter(b => (b.name || '').toLowerCase().includes(boardSearch.toLowerCase()));
    const filteredSprints = sprints.filter(s => {
        const nameMatch = (s.name || '').toLowerCase().includes(sprintSearch.toLowerCase());
        const stateMatch = sprintFilter === 'all' || (s.state || '').toLowerCase() === sprintFilter;
        return nameMatch && stateMatch;
    });

    // --- Jira Logic ---
    const jiraFilterOptions = useMemo(() => {
        const opts = {};
        JIRA_FILTER_DEFS.forEach(def => {
            const values = new Set();
            jiraIssues.forEach(issue => {
                if (def.multi) {
                    (def.extract(issue) || []).forEach(v => { if (v) values.add(v); });
                } else {
                    const v = def.extract(issue);
                    if (v) values.add(v);
                }
            });
            opts[def.key] = [...values].sort();
        });
        return opts;
    }, [jiraIssues]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (jiraFilterRef.current && !jiraFilterRef.current.contains(e.target)) {
                setJiraFilterPickerOpen(false);
                setJiraFilterSubMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const resetJiraBelow = (level) => {
        if (level <= 0) { setJiraSelectedProject(null); setJiraBoards([]); setJiraVersions([]); }
        if (level <= 1) { setJiraSelectedBoard(null); setJiraSelectedVersions([]); setJiraSprints([]); }
        setJiraIssues([]); setJiraSelectedIssues([]);
        setJiraFilters({}); setJiraFilterPickerOpen(false); setJiraFilterSubMenu(null);
    };

    const fetchJiraProjects = async () => {
        try {
            const res = await api.get('/jira/projects');
            const projects = res.data.projects || [];
            setJiraProjects(projects);
            if (projects.length === 1) handleSelectJiraProject(projects[0]);
        } catch (err) { console.error("Jira fetchProjects", err); toast.error('Failed to load Jira projects'); }
    };

    const handleSelectJiraProject = async (project) => {
        setJiraSelectedProject(project);
        resetJiraBelow(1);
        setLoadingData(true);
        try {
            if (jiraMode === 'version') {
                const res = await api.get('/jira/versions', { params: { projectKeyOrId: project.key } });
                const versions = res.data.versions || [];
                setJiraVersions(versions);
                if (versions.length === 1) handleSelectJiraVersions([versions[0].id]);
            } else {
                const res = await api.get('/jira/boards', { params: { projectKeyOrId: project.key } });
                const boards = res.data.boards || [];
                setJiraBoards(boards);
                if (boards.length === 1) handleSelectJiraBoard(boards[0]);
            }
        } catch (err) { console.error("Jira fetchBoards/versions", err); toast.error('Failed to load Jira boards'); }
        finally { setLoadingData(false); }
    };

    const handleSelectJiraBoard = async (board) => {
        setJiraSelectedBoard(board);
        setJiraSprints([]); setJiraSelectedSprints([]);
        setJiraIssues([]); setJiraSelectedIssues([]);
        setLoadingData(true);
        try {
            const res = await api.get('/jira/sprints', { params: { boardId: board.id } });
            if (res.data.kanban || (res.data.sprints || []).length === 0) {
                const issueRes = await api.get('/jira/board-issues', { params: { boardId: board.id } });
                setJiraIssues(issueRes.data.issues || []);
            } else {
                const sprints = res.data.sprints || [];
                setJiraSprints(sprints);
                if (sprints.length === 1) handleSelectJiraSprints([sprints[0].id]);
            }
        } catch (err) { console.error("Jira fetchSprints", err); toast.error('Failed to load Jira sprints'); }
        finally { setLoadingData(false); }
    };

    const handleSelectJiraSprints = async (sprintIds) => {
        setJiraSelectedSprints(sprintIds);
        if (sprintIds.length === 0) { setJiraIssues([]); setJiraSelectedIssues([]); return; }
        setJiraIssues([]); setJiraSelectedIssues([]);
        setLoadingData(true);
        try {
            const results = await Promise.all(
                sprintIds.map(id => api.get('/jira/sprint-issues', { params: { sprintId: id } }))
            );
            const allIssues = results.flatMap(r => r.data.issues || []);
            // Deduplicate by issue id
            const seen = new Set();
            const unique = allIssues.filter(i => { if (seen.has(i.id)) return false; seen.add(i.id); return true; });
            setJiraIssues(unique);
        } catch (err) { console.error("Jira fetchIssues", err); toast.error('Failed to load Jira issues'); }
        finally { setLoadingData(false); }
    };

    const handleSelectJiraVersions = async (versionIds) => {
        setJiraSelectedVersions(versionIds);
        if (versionIds.length === 0) { setJiraIssues([]); setJiraSelectedIssues([]); return; }
        setJiraIssues([]); setJiraSelectedIssues([]);
        setLoadingData(true);
        try {
            const results = await Promise.all(
                versionIds.map(id => api.get('/jira/version-issues', { params: { versionId: id } }))
            );
            const allIssues = results.flatMap(r => r.data.issues || []);
            const seen = new Set();
            const unique = allIssues.filter(i => { if (seen.has(i.id)) return false; seen.add(i.id); return true; });
            setJiraIssues(unique);
        } catch (err) { console.error("Jira fetchVersionIssues", err); toast.error('Failed to load version issues'); }
        finally { setLoadingData(false); }
    };

    const handleJiraModeSwitch = (mode) => {
        setJiraMode(mode);
        resetJiraBelow(1);
        if (jiraSelectedProject) {
            // Re-fetch for the new mode
            setLoadingData(true);
            if (mode === 'version') {
                api.get('/jira/versions', { params: { projectKeyOrId: jiraSelectedProject.key } })
                    .then(res => { setJiraVersions(res.data.versions || []); })
                    .catch(err => { console.error("Jira fetchVersions", err); toast.error('Failed to load versions'); })
                    .finally(() => setLoadingData(false));
            } else {
                api.get('/jira/boards', { params: { projectKeyOrId: jiraSelectedProject.key } })
                    .then(res => { setJiraBoards(res.data.boards || []); })
                    .catch(err => { console.error("Jira fetchBoards", err); toast.error('Failed to load Jira boards'); })
                    .finally(() => setLoadingData(false));
            }
        }
    };

    const handleToggleJiraIssue = (issue) => {
        setJiraSelectedIssues(prev => {
            const exists = prev.find(i => i.id === issue.id);
            if (exists) return prev.filter(i => i.id !== issue.id);
            return [...prev, issue];
        });
    };

    const handleToggleAllJiraIssues = () => {
        const filtered = filteredJiraIssues;
        const allSelected = filtered.every(i => jiraSelectedIssues.find(s => s.id === i.id));
        if (allSelected) {
            setJiraSelectedIssues(prev => prev.filter(s => !filtered.find(i => i.id === s.id)));
        } else {
            const newIssues = filtered.filter(i => !jiraSelectedIssues.find(s => s.id === i.id));
            setJiraSelectedIssues(prev => [...prev, ...newIssues]);
        }
    };

    const filteredJiraIssues = jiraIssues.filter(issue => {
        const searchMatch = (issue.summary || '').toLowerCase().includes(jiraIssueSearch.toLowerCase()) ||
            (issue.key || '').toLowerCase().includes(jiraIssueSearch.toLowerCase());
        const filterMatch = Object.entries(jiraFilters).every(([key, value]) => {
            const def = JIRA_FILTER_DEFS.find(d => d.key === key);
            if (!def) return true;
            if (def.multi) return (def.extract(issue) || []).some(v => v && v.toLowerCase() === value.toLowerCase());
            const issueValue = def.extract(issue);
            return issueValue && issueValue.toLowerCase() === value.toLowerCase();
        });
        return searchMatch && filterMatch;
    });

    // --- Linear Logic ---
    const fetchLinearTeams = async () => {
        try {
            const res = await api.get('/linear/teams');
            const teams = res.data.teams || [];
            setLinearTeams(teams);
            if (teams.length > 0 && !linearSelectedTeam) {
                handleSelectLinearTeam(teams[0]);
            }
        } catch (err) { console.error("Linear fetchTeams", err); toast.error('Failed to load Linear teams'); }
    };

    const handleSelectLinearTeam = async (team) => {
        setLinearSelectedTeam(team);
        setLinearProjects([]); setLinearCycles([]);
        setLinearSelectedProject(null); setLinearSelectedCycle(null);
        setLinearIssues([]); setLinearSelectedIssues([]);
        setLoadingData(true);
        try {
            const [projRes, cycleRes] = await Promise.all([
                api.get('/linear/projects', { params: { teamId: team.id } }),
                api.get('/linear/cycles', { params: { teamId: team.id } }),
            ]);
            const projects = projRes.data.projects || [];
            const cycles = cycleRes.data.cycles || [];
            setLinearProjects(projects);
            setLinearCycles(cycles);
            // Auto-fetch issues: prefer first cycle, fallback to first project, fallback to all team issues
            const cycleId = cycles.length > 0 ? cycles[0].id : null;
            const projectId = !cycleId && projects.length > 0 ? projects[0].id : null;
            if (cycleId) setLinearSelectedCycle(cycleId);
            if (projectId) setLinearSelectedProject(projectId);
            fetchLinearIssues(team.id, projectId, cycleId);
        } catch (err) { console.error("Linear fetch projects/cycles", err); toast.error('Failed to load Linear projects'); }
        finally { setLoadingData(false); }
    };

    const fetchLinearIssues = async (teamId, projectId, cycleId) => {
        setLinearIssues([]); setLinearSelectedIssues([]);
        setLoadingData(true);
        try {
            const params = { teamId };
            if (cycleId) params.cycleId = cycleId;
            if (projectId) params.projectId = projectId;
            const res = await api.get('/linear/issues', { params });
            setLinearIssues(res.data.issues || []);
        } catch (err) { console.error("Linear fetchIssues", err); toast.error('Failed to load Linear issues'); }
        finally { setLoadingData(false); }
    };

    const handleSelectLinearProjectOrCycle = (projectId, cycleId) => {
        setLinearSelectedProject(projectId);
        setLinearSelectedCycle(cycleId);
        if (linearSelectedTeam) fetchLinearIssues(linearSelectedTeam.id, projectId, cycleId);
    };

    const handleToggleLinearIssue = (issue) => {
        setLinearSelectedIssues(prev => prev.find(i => i.id === issue.id) ? prev.filter(i => i.id !== issue.id) : [...prev, issue]);
    };

    const handleToggleAllLinearIssues = () => {
        const filtered = filteredLinearIssues;
        const allSelected = filtered.every(i => linearSelectedIssues.find(s => s.id === i.id));
        if (allSelected) setLinearSelectedIssues(prev => prev.filter(s => !filtered.find(i => i.id === s.id)));
        else setLinearSelectedIssues(prev => [...prev, ...filtered.filter(i => !prev.find(s => s.id === i.id))]);
    };

    const filteredLinearIssues = linearIssues.filter(i =>
        (i.title || '').toLowerCase().includes(linearIssueSearch.toLowerCase()) ||
        (i.identifier || '').toLowerCase().includes(linearIssueSearch.toLowerCase())
    );

    // --- Asana Logic ---
    const fetchAsanaWorkspaces = async () => {
        try {
            const res = await api.get('/asana/workspaces');
            const workspaces = res.data.workspaces || [];
            setAsanaWorkspaces(workspaces);
            if (workspaces.length > 0 && !asanaSelectedWorkspace) {
                handleSelectAsanaWorkspace(workspaces[0]);
            }
        } catch (err) { console.error("Asana fetchWorkspaces", err); toast.error('Failed to load Asana workspaces'); }
    };

    const handleSelectAsanaWorkspace = async (ws) => {
        setAsanaSelectedWorkspace(ws);
        setAsanaProjects([]); setAsanaSelectedProject(null);
        setAsanaSections([]); setAsanaSelectedSection(null);
        setAsanaTasks([]); setAsanaSelectedTasks([]);
        setLoadingData(true);
        try {
            const res = await api.get('/asana/projects', { params: { workspaceId: ws.gid } });
            const projects = res.data.projects || [];
            setAsanaProjects(projects);
            if (projects.length > 0) {
                handleSelectAsanaProject(projects[0]);
            }
        } catch (err) { console.error("Asana fetchProjects", err); toast.error('Failed to load Asana projects'); }
        finally { setLoadingData(false); }
    };

    const handleSelectAsanaProject = async (project) => {
        setAsanaSelectedProject(project);
        setAsanaSections([]); setAsanaSelectedSection(null);
        setAsanaTasks([]); setAsanaSelectedTasks([]);
        setLoadingData(true);
        try {
            const [secRes, taskRes] = await Promise.all([
                api.get('/asana/sections', { params: { projectId: project.gid } }),
                api.get('/asana/tasks', { params: { projectId: project.gid } }),
            ]);
            setAsanaSections(secRes.data.sections || []);
            setAsanaTasks(taskRes.data.tasks || []);
        } catch (err) { console.error("Asana fetchSections/tasks", err); toast.error('Failed to load Asana tasks'); }
        finally { setLoadingData(false); }
    };

    const handleSelectAsanaSection = async (section) => {
        setAsanaSelectedSection(section);
        setAsanaTasks([]); setAsanaSelectedTasks([]);
        setLoadingData(true);
        try {
            const res = await api.get('/asana/tasks', { params: { projectId: asanaSelectedProject.gid, sectionId: section.gid } });
            setAsanaTasks(res.data.tasks || []);
        } catch (err) { console.error("Asana fetchTasks", err); toast.error('Failed to load Asana tasks'); }
        finally { setLoadingData(false); }
    };

    const handleToggleAsanaTask = (task) => {
        setAsanaSelectedTasks(prev => prev.find(t => t.id === task.id) ? prev.filter(t => t.id !== task.id) : [...prev, task]);
    };

    const handleToggleAllAsanaTasks = () => {
        const filtered = filteredAsanaTasks;
        const allSelected = filtered.every(t => asanaSelectedTasks.find(s => s.id === t.id));
        if (allSelected) setAsanaSelectedTasks(prev => prev.filter(s => !filtered.find(t => t.id === s.id)));
        else setAsanaSelectedTasks(prev => [...prev, ...filtered.filter(t => !prev.find(s => s.id === t.id))]);
    };

    const filteredAsanaTasks = asanaTasks.filter(t =>
        (t.title || '').toLowerCase().includes(asanaTaskSearch.toLowerCase())
    );

    // --- ClickUp Logic ---
    const fetchClickUpWorkspaces = async () => {
        try {
            const res = await api.get('/clickup/workspaces');
            const workspaces = res.data.workspaces || [];
            setClickupWorkspaces(workspaces);
            if (workspaces.length > 0 && !clickupSelectedWorkspace) {
                handleSelectClickUpWorkspace(workspaces[0]);
            }
        } catch (err) { console.error("ClickUp fetchWorkspaces", err); toast.error('Failed to load ClickUp workspaces'); }
    };

    const handleSelectClickUpWorkspace = async (ws) => {
        setClickupSelectedWorkspace(ws);
        setClickupSpaces([]); setClickupSelectedSpace(null);
        setClickupLists([]); setClickupSelectedList(null);
        setClickupTasks([]); setClickupSelectedTasks([]);
        setLoadingData(true);
        try {
            const res = await api.get('/clickup/spaces', { params: { teamId: ws.id } });
            const spaces = res.data.spaces || [];
            setClickupSpaces(spaces);
            if (spaces.length > 0) {
                handleSelectClickUpSpace(spaces[0]);
            }
        } catch (err) { console.error("ClickUp fetchSpaces", err); toast.error('Failed to load ClickUp spaces'); }
        finally { setLoadingData(false); }
    };

    const handleSelectClickUpSpace = async (space) => {
        setClickupSelectedSpace(space);
        setClickupLists([]); setClickupSelectedList(null);
        setClickupTasks([]); setClickupSelectedTasks([]);
        setLoadingData(true);
        try {
            const res = await api.get('/clickup/lists', { params: { spaceId: space.id } });
            const lists = res.data.lists || [];
            setClickupLists(lists);
            if (lists.length > 0) {
                handleSelectClickUpList(lists[0]);
            }
        } catch (err) { console.error("ClickUp fetchLists", err); toast.error('Failed to load ClickUp lists'); }
        finally { setLoadingData(false); }
    };

    const handleSelectClickUpList = async (list) => {
        setClickupSelectedList(list);
        setClickupTasks([]); setClickupSelectedTasks([]);
        setLoadingData(true);
        try {
            const res = await api.get('/clickup/tasks', { params: { listId: list.id } });
            setClickupTasks(res.data.tasks || []);
        } catch (err) { console.error("ClickUp fetchTasks", err); toast.error('Failed to load ClickUp tasks'); }
        finally { setLoadingData(false); }
    };

    const handleToggleClickUpTask = (task) => {
        setClickupSelectedTasks(prev => prev.find(t => t.id === task.id) ? prev.filter(t => t.id !== task.id) : [...prev, task]);
    };

    const handleToggleAllClickUpTasks = () => {
        const filtered = filteredClickUpTasks;
        const allSelected = filtered.every(t => clickupSelectedTasks.find(s => s.id === t.id));
        if (allSelected) setClickupSelectedTasks(prev => prev.filter(s => !filtered.find(t => t.id === s.id)));
        else setClickupSelectedTasks(prev => [...prev, ...filtered.filter(t => !prev.find(s => s.id === t.id))]);
    };

    const filteredClickUpTasks = clickupTasks.filter(t =>
        (t.title || '').toLowerCase().includes(clickupTaskSearch.toLowerCase())
    );

    // --- Monday Logic ---
    const fetchMondayBoards = async () => {
        try {
            const res = await api.get('/monday/boards');
            const boards = res.data.boards || [];
            setMondayBoards(boards);
            if (boards.length > 0 && !mondaySelectedBoard) {
                handleSelectMondayBoard(boards[0]);
            }
        } catch (err) { console.error("Monday fetchBoards", err); toast.error('Failed to load Monday.com boards'); }
    };

    const handleSelectMondayBoard = async (board) => {
        setMondaySelectedBoard(board);
        setMondayGroups([]); setMondaySelectedGroup(null);
        setMondayItems([]); setMondaySelectedItems([]);
        setLoadingData(true);
        try {
            const [grpRes, itemRes] = await Promise.all([
                api.get('/monday/groups', { params: { boardId: board.id } }),
                api.get('/monday/items', { params: { boardId: board.id } }),
            ]);
            setMondayGroups(grpRes.data.groups || []);
            setMondayItems(itemRes.data.items || []);
        } catch (err) { console.error("Monday fetchGroups/items", err); toast.error('Failed to load Monday.com data'); }
        finally { setLoadingData(false); }
    };

    const handleSelectMondayGroup = async (group) => {
        setMondaySelectedGroup(group);
        setMondayItems([]); setMondaySelectedItems([]);
        setLoadingData(true);
        try {
            const res = await api.get('/monday/items', { params: { boardId: mondaySelectedBoard.id, groupId: group.id } });
            setMondayItems(res.data.items || []);
        } catch (err) { console.error("Monday fetchItems", err); toast.error('Failed to load Monday.com items'); }
        finally { setLoadingData(false); }
    };

    const handleToggleMondayItem = (item) => {
        setMondaySelectedItems(prev => prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]);
    };

    const handleToggleAllMondayItems = () => {
        const filtered = filteredMondayItems;
        const allSelected = filtered.every(i => mondaySelectedItems.find(s => s.id === i.id));
        if (allSelected) setMondaySelectedItems(prev => prev.filter(s => !filtered.find(i => i.id === s.id)));
        else setMondaySelectedItems(prev => [...prev, ...filtered.filter(i => !prev.find(s => s.id === i.id))]);
    };

    const filteredMondayItems = mondayItems.filter(i =>
        (i.title || '').toLowerCase().includes(mondayItemSearch.toLowerCase())
    );

    const clearSessionSelections = () => {
        sessionStorage.removeItem('github_selectedRepo');
        sessionStorage.removeItem('github_selectedBranch');
        sessionStorage.removeItem('github_selectedCommits');
        sessionStorage.removeItem('devrev_selectedBoard');
        sessionStorage.removeItem('devrev_selectedSprints');
        sessionStorage.removeItem('shared_audience');
    };

    // --- Generation Logic ---
    const handleGenerate = async () => {
        const genCheck = canUse('max_generations_per_month');
        if (!genCheck.allowed) {
            toast.error(`You've reached your plan limit (${genCheck.used}/${genCheck.limit} generations). Upgrade your subscription to continue.`);
            return;
        }
        setLoading(true);
        const llm = {
            provider: llmConfig.provider || 'releasly',
            model: llmConfig.model || undefined,
            apiKeyOverride: llmConfig.apiKeyOverride || undefined,
        };
        try {
            // Generate from the first source with data selected
            // (multi-source unified endpoint can be added later)
            const SOURCE_LABELS = { github: 'GitHub', jira: 'Jira', devrev: 'DevRev', linear: 'Linear', asana: 'Asana', clickup: 'ClickUp', monday: 'Monday.com' };
            const defaultTitle = releaseTitle || `${sources.map(s => SOURCE_LABELS[s] || s).join(' + ')} Release Notes - ${new Date().toLocaleDateString()}`;

            if (sources.includes('github') && selectedCommits.length > 0) {
                const selectedObjects = commits.filter(c => selectedCommits.includes(c.id));
                const commitList = selectedObjects.map(pr => ({
                    commit: { message: `PR #${pr.number}: ${pr.title}`, author: { name: pr.user.login } }
                }));
                const genRes = await api.post('/generate', { commits: commitList, audience, title: defaultTitle, tone, llm, customPrompt: customPrompt || undefined, sourcesCount: sources.length });
                sessionStorage.setItem('last_integration', 'github');
                refetchEntitlements();
                clearSessionSelections();
                navigate('/generate', { state: { notes: genRes.data.notes, noteId: genRes.data.noteId, noteTitle: genRes.data.title } });
            } else if (sources.includes('devrev') && devrevSelectedItems.length > 0) {
                const genRes = await api.post('/devrev/generate', { items: devrevSelectedItems, audience, title: defaultTitle, tone, llm, customPrompt: customPrompt || undefined, sourcesCount: sources.length });
                sessionStorage.setItem('last_integration', 'devrev');
                refetchEntitlements();
                clearSessionSelections();
                navigate('/generate', { state: { notes: genRes.data.notes, noteId: genRes.data.noteId, noteTitle: genRes.data.title } });
            } else if (sources.includes('jira') && jiraSelectedIssues.length > 0) {
                const genRes = await api.post('/jira/generate', { issues: jiraSelectedIssues, audience, title: defaultTitle, tone, llm, customPrompt: customPrompt || undefined, sourcesCount: sources.length });
                sessionStorage.setItem('last_integration', 'jira');
                refetchEntitlements();
                clearSessionSelections();
                navigate('/generate', { state: { notes: genRes.data.notes, noteId: genRes.data.noteId, noteTitle: genRes.data.title } });
            } else if (sources.includes('linear') && linearSelectedIssues.length > 0) {
                const genRes = await api.post('/linear/generate', { issues: linearSelectedIssues, audience, title: defaultTitle, tone, llm, customPrompt: customPrompt || undefined, sourcesCount: sources.length });
                sessionStorage.setItem('last_integration', 'linear');
                refetchEntitlements();
                clearSessionSelections();
                navigate('/generate', { state: { notes: genRes.data.notes, noteId: genRes.data.noteId, noteTitle: genRes.data.title } });
            } else if (sources.includes('asana') && asanaSelectedTasks.length > 0) {
                const genRes = await api.post('/asana/generate', { tasks: asanaSelectedTasks, audience, title: defaultTitle, tone, llm, customPrompt: customPrompt || undefined, sourcesCount: sources.length });
                sessionStorage.setItem('last_integration', 'asana');
                refetchEntitlements();
                clearSessionSelections();
                navigate('/generate', { state: { notes: genRes.data.notes, noteId: genRes.data.noteId, noteTitle: genRes.data.title } });
            } else if (sources.includes('clickup') && clickupSelectedTasks.length > 0) {
                const genRes = await api.post('/clickup/generate', { tasks: clickupSelectedTasks, audience, title: defaultTitle, tone, llm, customPrompt: customPrompt || undefined, sourcesCount: sources.length });
                sessionStorage.setItem('last_integration', 'clickup');
                refetchEntitlements();
                clearSessionSelections();
                navigate('/generate', { state: { notes: genRes.data.notes, noteId: genRes.data.noteId, noteTitle: genRes.data.title } });
            } else if (sources.includes('monday') && mondaySelectedItems.length > 0) {
                const genRes = await api.post('/monday/generate', { items: mondaySelectedItems, audience, title: defaultTitle, tone, llm, customPrompt: customPrompt || undefined, sourcesCount: sources.length });
                sessionStorage.setItem('last_integration', 'monday');
                refetchEntitlements();
                clearSessionSelections();
                navigate('/generate', { state: { notes: genRes.data.notes, noteId: genRes.data.noteId, noteTitle: genRes.data.title } });
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Failed to generate notes.');
        } finally {
            setLoading(false);
        }
    };

    // --- Formatting Helpers ---
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const h = today.getHours();
    const timeGreeting = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
    const firstName = user?.name ? user.name.split(' ')[0] : 'User';

    const handleViewNote = async (noteId) => {
        try {
            const res = await api.get(`/notes/${noteId}`);
            navigate('/generate', { state: { notes: res.data.note.content, noteId: noteId, noteTitle: res.data.note.title, published: res.data.note.published, is_public: res.data.note.is_public, public_slug: res.data.note.public_slug } });
        } catch (err) {
            console.error('Failed to fetch note content:', err);
            toast.error('Failed to load the release note.');
        }
    };

    const [deletingNoteId, setDeletingNoteId] = useState(null);

    const handleDeleteNote = async () => {
        if (!deletingNoteId) return;
        try {
            await api.delete(`/notes/${deletingNoteId}`);
            setGeneratedNotes(prev => prev.filter(n => n.id !== deletingNoteId));
            setTotalNotesGenerated(prev => prev - 1);
        } catch (err) {
            console.error('Failed to delete note:', err);
            toast.error('Failed to delete the release note.');
        } finally {
            setDeletingNoteId(null);
        }
    };

    const stats = [
        { n: 'Notes Generated', v: totalNotesGenerated, icon: ic.doc, bg: 'var(--il)', c: 'var(--indigo)', change: `${connectedIntegrations.length} source${connectedIntegrations.length !== 1 ? 's' : ''}` },
        { n: 'Published', v: publishedCount, icon: ic.send, bg: 'var(--el)', c: 'var(--emerald)', change: publishedCount > 0 ? `${publishEvents.length} total deploys` : 'No publishes yet' },
        { n: 'Integrations', v: connectedIntegrations.length, icon: ic.plug, bg: 'var(--sl)', c: 'var(--sky)', change: connectedIntegrations.join(', ') || 'None' },
        { n: 'API Keys', v: savedKeys.length, icon: ic.key, bg: 'var(--vl)', c: 'var(--violet)', change: savedKeys.length > 0 ? savedKeys.map(k => k.provider).join(', ') : 'None added' },
    ];

    const CHANNEL_LABELS = { github: 'GitHub', jira: 'Jira', devrev: 'DevRev', linear: 'Linear', asana: 'Asana', clickup: 'ClickUp', monday: 'Monday.com', slack: 'Slack' };

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const hasDataSelected = (sources.includes('github') && selectedCommits.length > 0)
        || (sources.includes('jira') && jiraSelectedIssues.length > 0)
        || (sources.includes('devrev') && devrevSelectedItems.length > 0)
        || (sources.includes('linear') && linearSelectedIssues.length > 0)
        || (sources.includes('asana') && asanaSelectedTasks.length > 0)
        || (sources.includes('clickup') && clickupSelectedTasks.length > 0)
        || (sources.includes('monday') && mondaySelectedItems.length > 0);

    const wizardSteps = [
        { n: 1, label: 'Audience' },
        { n: 2, label: 'Select Source' },
        { n: 3, label: 'Pick Changes' },
        { n: 4, label: 'Configure', disabled: !hasDataSelected },
    ];

    const handleStepClick = (n) => {
        if (n === 4 && !hasDataSelected) return;
        setStep(n);
    };

    return (
        <>
            {view === 'overview' ? (
                <>
                    <TopBar title={null} />
                    {dashboardLoading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '120px 0', color: 'var(--muted)' }}>
                            <Loader2 size={28} className="spin" />
                            <span>Loading dashboard...</span>
                        </div>
                    ) : (
                    <div className="page-content">
                        {/* Greeting + CTA */}
                        <div className="fu dash-greeting-v2">
                            <div>
                                <p className="dash-date-v2">{formattedDate}</p>
                                <h1 className="dash-hello-v2">
                                    Good {timeGreeting}, <span className="dash-name-v2">{firstName}</span>
                                </h1>
                            </div>
                            <button className="btn btn-primary dash-cta-v2" onClick={() => { setView('generate'); setStep(1); }}>
                                {ic.plus} <span>New Release Note</span>
                            </button>
                        </div>

                        {/* Stats row */}
                        <div className="dash-stats-v2">
                            {stats.map((s, i) => (
                                <div key={s.n} className={`fu d${i + 1} dash-stat-v2`}>
                                    <div className="dash-stat-icon-v2" style={{ background: s.bg, color: s.c }}>{s.icon}</div>
                                    <div>
                                        <div className="dash-stat-number-v2">{s.v}</div>
                                        <div className="dash-stat-label-v2">{s.n}</div>
                                        <div className="dash-stat-change-v2">{s.change}</div>
                                        {s.n === 'Notes Generated' && entitlements && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>
                                                {entitlements.max_generations_per_month === -1
                                                    ? 'Unlimited generations'
                                                    : `${usage?.generations_this_month || 0} / ${entitlements.max_generations_per_month} used this month`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="dash-two-col">
                            {/* Notes Table */}
                            <div className="fu d3 dash-card-v2">
                                <div className="dash-card-header">
                                    <h2 className="dash-card-title">
                                        <span style={{ color: 'var(--indigo)', display: 'flex' }}>{ic.doc}</span>
                                        Recent Notes
                                    </h2>
                                </div>
                                {generatedNotes.length > 0 ? (
                                    <div className="dash-notes-content">
                                        {generatedNotes.map((note, i) => (
                                            <div
                                                key={note.id}
                                                className="dash-note-row-v2"
                                                style={{ borderBottom: i < generatedNotes.length - 1 ? '1px solid var(--border-l)' : 'none' }}
                                                onClick={() => handleViewNote(note.id)}
                                            >
                                                <div className="dash-note-icon-v2">{ic.doc}</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div className="dash-note-title-v2">{note.title}</div>
                                                    <div className="dash-note-meta-v2">
                                                        <Pill color={note.source === 'GitHub' ? 'sky' : note.source === 'Jira' ? 'indigo' : 'emerald'}>{note.source}</Pill>
                                                        {note.llm_provider && (
                                                            <span className="dash-llm-badge">
                                                                <img src={llmProviderLogos[note.llm_provider]} alt="" style={{ width: 14, height: 14, borderRadius: 3, objectFit: 'contain' }} />
                                                                {llmProviderLabels[note.llm_provider] || note.llm_provider}
                                                            </span>
                                                        )}
                                                        {note.published && <span className="dash-published-badge"><Check size={10} /> Published</span>}
                                                        <span>{audienceOptions.find(a => a.id === note.audience)?.label || note.audience || 'Product'}</span>
                                                    </div>
                                                </div>
                                                <div className="dash-note-date-v2">
                                                    {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <button
                                                    className="dash-note-delete-btn"
                                                    title="Delete"
                                                    onClick={(e) => { e.stopPropagation(); setDeletingNoteId(note.id); }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <div style={{ color: 'var(--m2)', display: 'flex', flexShrink: 0 }}>{ic.arr}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="dash-empty-v2">
                                        <div className="dash-empty-icon-v2">{ic.doc}</div>
                                        <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>No release notes yet</p>
                                        <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', margin: '0 0 16px', maxWidth: 300, lineHeight: 1.5 }}>
                                            Generate your first release note from GitHub, Jira, Linear, Asana, ClickUp, Monday.com, or DevRev data.
                                        </p>
                                        <button className="btn btn-primary btn-sm" onClick={() => { setView('generate'); setStep(1); }}>
                                            {ic.spark} Get Started
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Activity Feed */}
                            <div className="fu d4 dash-card-v2">
                                <div className="dash-card-header">
                                    <h2 className="dash-card-title">Activity</h2>
                                </div>
                                {publishEvents.length > 0 ? (
                                    <div className="activity-feed">
                                        {publishEvents.map((event, idx) => {
                                            const channels = event.channels || [];
                                            const allSuccess = channels.every(c => c.status === 'success');
                                            const anyFailed = channels.some(c => c.status === 'failed');
                                            const channelNames = channels.map(c => CHANNEL_LABELS[c.type] || c.type);
                                            const successChannels = channels.filter(c => c.status === 'success').map(c => CHANNEL_LABELS[c.type] || c.type);
                                            const dotColor = allSuccess ? 'var(--emerald)' : anyFailed ? 'var(--rose)' : 'var(--amber)';
                                            const title = allSuccess
                                                ? `Published to ${successChannels.join(', ')}`
                                                : anyFailed && successChannels.length > 0
                                                    ? `Partial publish to ${channelNames.join(', ')}`
                                                    : `Failed to publish to ${channelNames.join(', ')}`;

                                            // Build config detail string
                                            const configDetails = channels.map(c => {
                                                const cfg = c.config || {};
                                                if (c.type === 'github' && cfg.repo) return `${cfg.repo}${cfg.tag ? ` · ${cfg.tag}` : ''}`;
                                                if (c.type === 'jira' && cfg.project) return `${cfg.project}${cfg.version ? ` · ${cfg.version}` : ''}`;
                                                if (c.type === 'devrev' && cfg.part) return cfg.part;
                                                return null;
                                            }).filter(Boolean).join(' / ');

                                            // Collect success/error messages per channel
                                            const messages = channels.map(c => {
                                                const label = CHANNEL_LABELS[c.type] || c.type;
                                                if (c.status === 'success' && c.result?.message) return { type: 'success', text: c.result.message };
                                                if (c.status === 'failed' && c.error) return { type: 'error', text: `${label}: ${c.error}` };
                                                return null;
                                            }).filter(Boolean);

                                            return (
                                                <div
                                                    key={event.id}
                                                    className="activity-item"
                                                    onClick={() => event.release_note_id && handleViewNote(event.release_note_id)}
                                                >
                                                    <div className="activity-timeline">
                                                        <div className="activity-dot" style={{ background: dotColor }} />
                                                        {idx < publishEvents.length - 1 && <div className="activity-line" />}
                                                    </div>
                                                    <div className="activity-content">
                                                        <div className="activity-title">{title}</div>
                                                        <div className="activity-desc">{event.note_title || 'Untitled Note'}</div>
                                                        {configDetails && <div className="activity-config">{configDetails}</div>}
                                                        {messages.map((msg, mi) => (
                                                            <div key={mi} className={`activity-msg ${msg.type}`}>{msg.text}</div>
                                                        ))}
                                                        <div className="activity-time">{timeAgo(event.published_at)}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="dash-empty-v2" style={{ padding: '40px 24px' }}>
                                        <div className="dash-empty-icon-v2">{ic.send}</div>
                                        <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>No activity yet</p>
                                        <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', margin: 0, maxWidth: 260, lineHeight: 1.5 }}>
                                            Publish a release note to see activity here.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <ConfirmDialog
                            open={!!deletingNoteId}
                            title="Delete Release Note"
                            message="Are you sure you want to delete this release note? This action cannot be undone."
                            confirmLabel="Delete"
                            variant="danger"
                            onConfirm={handleDeleteNote}
                            onCancel={() => setDeletingNoteId(null)}
                        />
                    </div>
                    )}
                </>
            ) : (
                /* ─── Generate View ─── */
                <>
                    <TopBar sub="Generate" title="Create Release Notes">
                        <button className="btn btn-secondary" onClick={() => { setView('overview'); setStep(1); }}>
                            {ic.back} Back
                        </button>
                    </TopBar>
                    <div className="page-content">
                        <StepIndicator steps={wizardSteps} currentStep={step} onStepClick={handleStepClick} />

                        {/* Step 1: Audience */}
                        {step === 1 && (
                            <div className="fu d1">
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>Who are these release notes for?</h3>
                                <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', marginBottom: 20 }}>Select your target audience to tailor the output format and detail level.</p>
                                {audiencesLoading ? (
                                    <div className="audience-grid">
                                        {[...Array(6)].map((_, i) => <div key={i} className="audience-skeleton" />)}
                                    </div>
                                ) : audienceOptions.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                        <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 6px' }}>Failed to load audience types</p>
                                        <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', margin: '0 0 18px', lineHeight: 1.5 }}>
                                            Please check your connection and try again.
                                        </p>
                                        <button className="btn btn-primary btn-sm" onClick={fetchAudiences}>
                                            <RefreshCw size={14} /> Retry
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="audience-grid">
                                            {audienceOptions.map(opt => (
                                                <div
                                                    key={opt.id}
                                                    className={`audience-card${audience === opt.id ? ' selected' : ''}`}
                                                    onClick={() => setAudience(opt.id)}
                                                >
                                                    <h4>{opt.label}</h4>
                                                    <p>{opt.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="btn btn-primary" onClick={() => setStep(2)}>
                                            Continue {ic.arr}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Step 2: Select Source */}
                        {step === 2 && (
                            <div className="fu d1">
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>Choose your data source</h3>
                                <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', marginBottom: 20 }}>Select one or more integrations to pull changes from.</p>
                                {connectedIntegrations.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                        <div style={{ fontSize: 36, marginBottom: 12 }}>{ic.plug}</div>
                                        <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 6px' }}>No integrations connected</p>
                                        <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', margin: '0 0 18px', lineHeight: 1.5 }}>
                                            Connect at least one integration to start generating release notes.
                                        </p>
                                        <Link to="/integration" className="btn btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                                            Go to Integrations {ic.arr}
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <div className="gen-source-grid-v2">
                                            {[
                                                { id: 'github', l: 'GitHub', icon: ic.gh, c: '--text' },
                                                { id: 'devrev', l: 'DevRev', logo: devrevLogo, c: '--emerald' },
                                                { id: 'jira', l: 'Jira', logo: jiraLogo, c: '--sky' },
                                                { id: 'linear', l: 'Linear', logo: linearLogo, c: '--indigo' },
                                                { id: 'asana', l: 'Asana', logo: asanaLogo, c: '--rose' },
                                                { id: 'clickup', l: 'ClickUp', logo: clickupLogo, c: '--violet' },
                                                { id: 'monday', l: 'Monday.com', logo: mondayLogo, c: '--amber' },
                                            ].filter(s => connectedIntegrations.includes(s.l)).map(s => {
                                                const isSelected = sources.includes(s.id);
                                                return (
                                                    <button key={s.id} onClick={() => {
                                                        setSources(prev => {
                                                            if (prev.includes(s.id)) return prev.filter(x => x !== s.id);
                                                            const limit = canUse('max_sources_per_release');
                                                            if (limit.allowed === false || (limit.limit > 0 && prev.length >= limit.limit)) {
                                                                toast.error('Upgrade your subscription to use multiple sources in one release.');
                                                                return prev;
                                                            }
                                                            return [...prev, s.id];
                                                        });
                                                    }} className={`gen-source-btn-v2 ${isSelected ? 'active' : ''}`}>
                                                        <div style={{
                                                            width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                                                            border: isSelected ? 'none' : '1.5px solid var(--s2)',
                                                            background: isSelected ? 'var(--indigo)' : 'var(--white)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            transition: 'background .15s',
                                                        }}>
                                                            {isSelected && <Check size={12} color="#fff" />}
                                                        </div>
                                                        <div className="gen-source-icon-v2" style={{ background: `var(${s.c})0c`, color: `var(${s.c})` }}>
                                                            {s.logo ? <img src={s.logo} alt={s.l} style={{ width: 35, height: 35, objectFit: 'contain', borderRadius: 6, }} /> : s.icon}
                                                        </div>
                                                        <div style={{ textAlign: 'left' }}>
                                                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>{s.l}</div>
                                                            <div style={{ fontSize: '0.8rem', color: isSelected ? 'var(--it)' : 'var(--muted)' }}>
                                                                {isSelected ? 'Selected' : 'Click to select'}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button className="btn btn-primary" onClick={() => setStep(3)} disabled={sources.length === 0} style={{ opacity: sources.length === 0 ? 0.5 : 1 }}>
                                            Continue with {sources.length} source{sources.length !== 1 ? 's' : ''} {ic.arr}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Step 3: Pick Changes */}
                        {step === 3 && (
                            <div className="fu d1">
                                {/* Source tabs when multiple sources selected */}
                                {sources.length > 1 && (
                                    <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border-l)', paddingBottom: 0 }}>
                                        {sources.map(s => {
                                            const labels = { github: 'GitHub', devrev: 'DevRev', jira: 'Jira', linear: 'Linear', asana: 'Asana', clickup: 'ClickUp', monday: 'Monday.com' };
                                            const counts = { github: selectedCommits.length, devrev: devrevSelectedItems.length, jira: jiraSelectedIssues.length, linear: linearSelectedIssues.length, asana: asanaSelectedTasks.length, clickup: clickupSelectedTasks.length, monday: mondaySelectedItems.length };
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => setSourceTab(s)}
                                                    style={{
                                                        all: 'unset', cursor: 'pointer', padding: '8px 16px 10px',
                                                        fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 500,
                                                        color: sourceTab === s ? 'var(--text)' : 'var(--m2)',
                                                        borderBottom: sourceTab === s ? '2px solid var(--primary)' : '2px solid transparent',
                                                        transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 6,
                                                    }}
                                                >
                                                    {labels[s]}
                                                    {counts[s] > 0 && (
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, background: 'var(--il)', color: 'var(--it)', padding: '1px 7px', borderRadius: 100 }}>
                                                            {counts[s]}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                                {(sources.length === 1 ? sources[0] : sourceTab) === 'github' && sources.includes('github') ? (
                                    <DataSelector
                                        repos={repos}
                                        selectedRepo={selectedRepo}
                                        onSelectRepo={handleSelectRepo}
                                        branches={branches}
                                        selectedBranch={selectedBranch}
                                        onSelectBranch={handleSelectBranch}
                                        commits={commits}
                                        selectedCommits={selectedCommits}
                                        onToggleCommit={handleToggleCommit}
                                        onToggleAll={handleToggleAllCommits}
                                        onGenerate={() => setStep(4)}
                                        loading={loadingData || loading}
                                        dateRange={dateRange}
                                        setDateRange={setDateRange}
                                        onBack={() => setStep(2)}
                                        showBackButton
                                    />
                                ) : (sources.length === 1 ? sources[0] : sourceTab) === 'jira' && sources.includes('jira') ? (
                                    <div className="selector-card-v2 selector-jira-wrap">
                                        {/* Top: Mode toggle + Dropdowns */}
                                        <div style={{ padding: '16px 18px 0', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
                                            {/* Mode toggle + Filter/Search icons */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', gap: 4, background: 'var(--s1)', borderRadius: 8, padding: 3, width: 'fit-content' }}>
                                                    <button
                                                        onClick={() => handleJiraModeSwitch('sprint')}
                                                        style={{ padding: '6px 14px', fontSize: '0.875rem', fontWeight: 600, borderRadius: 6, border: 'none', cursor: 'pointer', background: jiraMode === 'sprint' ? 'var(--bg)' : 'transparent', color: jiraMode === 'sprint' ? 'var(--text)' : 'var(--muted)', boxShadow: jiraMode === 'sprint' ? '0 1px 3px rgba(0,0,0,.1)' : 'none', fontFamily: 'var(--font)' }}
                                                    >Board / Sprint</button>
                                                    <button
                                                        onClick={() => handleJiraModeSwitch('version')}
                                                        style={{ padding: '6px 14px', fontSize: '0.875rem', fontWeight: 600, borderRadius: 6, border: 'none', cursor: 'pointer', background: jiraMode === 'version' ? 'var(--bg)' : 'transparent', color: jiraMode === 'version' ? 'var(--text)' : 'var(--muted)', boxShadow: jiraMode === 'version' ? '0 1px 3px rgba(0,0,0,.1)' : 'none', fontFamily: 'var(--font)' }}
                                                    >Release Version</button>
                                                </div>
                                                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                                    {jiraSearchOpen ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
                                                            <Search size={14} style={{ position: 'absolute', left: 8, color: 'var(--muted)', pointerEvents: 'none' }} />
                                                            <input
                                                                type="text"
                                                                placeholder="Search issues..."
                                                                className="selector-search-v2"
                                                                style={{ margin: 0, width: 180, paddingLeft: 28, height: 36, fontSize: '0.875rem', borderRadius: 8 }}
                                                                value={jiraIssueSearch}
                                                                onChange={e => setJiraIssueSearch(e.target.value)}
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => { setJiraSearchOpen(false); setJiraIssueSearch(''); }}
                                                                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-l)', background: 'var(--bg)', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setJiraSearchOpen(true)}
                                                            title="Search issues"
                                                            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-l)', background: 'var(--bg)', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'var(--font)' }}
                                                        >
                                                            <Search size={15} />
                                                        </button>
                                                    )}
                                                    <div ref={jiraFilterRef} style={{ position: 'relative' }}>
                                                        <button
                                                            onClick={() => { setJiraFilterPickerOpen(p => !p); setJiraFilterSubMenu(null); }}
                                                            title="Add filter"
                                                            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-l)', background: jiraFilterPickerOpen ? 'var(--il)' : 'var(--bg)', color: jiraFilterPickerOpen ? 'var(--indigo)' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'var(--font)', position: 'relative' }}
                                                        >
                                                            <Plus size={15} />
                                                            {Object.keys(jiraFilters).length > 0 && (
                                                                <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: 'var(--indigo)' }} />
                                                            )}
                                                        </button>
                                                        {jiraFilterPickerOpen && (
                                                            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, minWidth: 180, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: 'var(--shm)', zIndex: 50, padding: '4px 0', fontFamily: 'var(--font)' }}>
                                                                {JIRA_FILTER_DEFS.map(def => {
                                                                    const isActive = def.key in jiraFilters;
                                                                    const options = jiraFilterOptions[def.key] || [];
                                                                    if (options.length === 0) return null;
                                                                    return (
                                                                        <div key={def.key} style={{ position: 'relative' }}>
                                                                            <button
                                                                                onClick={() => setJiraFilterSubMenu(jiraFilterSubMenu === def.key ? null : def.key)}
                                                                                style={{ width: '100%', padding: '7px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: '0.875rem', fontWeight: 500, background: jiraFilterSubMenu === def.key ? 'var(--s1)' : 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)', fontFamily: 'var(--font)' }}
                                                                            >
                                                                                <span>{def.label}</span>
                                                                                {isActive && <Check size={13} style={{ color: 'var(--indigo)' }} />}
                                                                            </button>
                                                                            {jiraFilterSubMenu === def.key && (
                                                                                <div style={{ position: 'absolute', right: '100%', top: 0, marginRight: 4, minWidth: 160, maxHeight: 200, overflowY: 'auto', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: 'var(--shm)', padding: '4px 0', zIndex: 51 }}>
                                                                                    {options.map(val => (
                                                                                        <button
                                                                                            key={val}
                                                                                            onClick={() => { setJiraFilters(prev => ({ ...prev, [def.key]: val })); setJiraFilterSubMenu(null); setJiraFilterPickerOpen(false); }}
                                                                                            style={{ width: '100%', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', background: jiraFilters[def.key] === val ? 'var(--il)' : 'transparent', color: jiraFilters[def.key] === val ? 'var(--indigo)' : 'var(--text)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
                                                                                        >
                                                                                            {val}
                                                                                            {jiraFilters[def.key] === val && <Check size={12} />}
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Dropdowns row */}
                                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                {/* Project dropdown */}
                                                <SearchDropdown
                                                    options={jiraProjects.map(p => ({ id: p.id, label: `${p.name} (${p.key})` }))}
                                                    value={jiraSelectedProject?.id || null}
                                                    onChange={id => { const p = jiraProjects.find(p => p.id === id); if (p) handleSelectJiraProject(p); }}
                                                    placeholder="Select Project..."
                                                    style={{ minWidth: 160 }}
                                                />

                                                {jiraMode === 'sprint' ? (
                                                    <>
                                                        {/* Board dropdown */}
                                                        {jiraSelectedProject && jiraBoards.length > 0 && (
                                                            <SearchDropdown
                                                                options={jiraBoards.map(b => ({ id: b.id, label: b.name }))}
                                                                value={jiraSelectedBoard?.id || null}
                                                                onChange={id => { const b = jiraBoards.find(b => b.id === id); if (b) handleSelectJiraBoard(b); }}
                                                                placeholder="Select Board..."
                                                                style={{ minWidth: 150 }}
                                                            />
                                                        )}
                                                        {/* Sprint dropdown (multi) */}
                                                        {jiraSelectedBoard && jiraSprints.length > 0 && (
                                                            <SearchDropdown
                                                                multi
                                                                options={jiraSprints.map(s => ({ id: s.id, label: s.name, sub: s.state }))}
                                                                value={jiraSelectedSprints}
                                                                onChange={handleSelectJiraSprints}
                                                                placeholder="Select Sprints..."
                                                                style={{ minWidth: 150 }}
                                                            />
                                                        )}
                                                    </>
                                                ) : (
                                                    /* Version dropdown (multi) */
                                                    jiraSelectedProject && jiraVersions.length > 0 && (
                                                        <SearchDropdown
                                                            multi
                                                            options={jiraVersions.map(v => ({ id: v.id, label: v.name, sub: v.released ? 'Released' : 'Unreleased' }))}
                                                            value={jiraSelectedVersions}
                                                            onChange={handleSelectJiraVersions}
                                                            placeholder="Select Versions..."
                                                            style={{ minWidth: 160 }}
                                                        />
                                                    )
                                                )}
                                                {loadingData && <RefreshCw size={16} className="spin" style={{ color: 'var(--indigo)', alignSelf: 'center' }} />}
                                            </div>
                                        </div>

                                        {/* Issues area */}
                                        <div style={{ padding: '12px 18px 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0 }}>
                                            {/* Active filter chips */}
                                            {Object.keys(jiraFilters).length > 0 && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                                                    {Object.entries(jiraFilters).map(([key, value]) => {
                                                        const def = JIRA_FILTER_DEFS.find(d => d.key === key);
                                                        return (
                                                            <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px 4px 10px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, background: 'var(--il)', color: 'var(--it)', whiteSpace: 'nowrap', fontFamily: 'var(--font)' }}>
                                                                {def?.label}: {value}
                                                                <button
                                                                    onClick={() => setJiraFilters(prev => { const next = { ...prev }; delete next[key]; return next; })}
                                                                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: 4, border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', padding: 0 }}
                                                                >
                                                                    <X size={10} />
                                                                </button>
                                                            </span>
                                                        );
                                                    })}
                                                    <button
                                                        onClick={() => setJiraFilters({})}
                                                        style={{ fontSize: '0.8rem', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', padding: '4px 8px' }}
                                                    >Clear</button>
                                                </div>
                                            )}
                                            {jiraIssues.length > 0 ? (
                                                <>
                                                    <div className="selector-list-header-v2" onClick={handleToggleAllJiraIssues}>
                                                        {filteredJiraIssues.length > 0 && filteredJiraIssues.every(i => jiraSelectedIssues.find(s => s.id === i.id))
                                                            ? <CheckSquare size={18} style={{ color: 'var(--emerald)' }} />
                                                            : <Square size={18} style={{ color: 'var(--m2)' }} />
                                                        }
                                                        <span>Select All ({filteredJiraIssues.length})</span>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
                                                        {filteredJiraIssues.map(issue => {
                                                            const isSelected = !!jiraSelectedIssues.find(s => s.id === issue.id);
                                                            return (
                                                                <div key={issue.id} className={`selector-item-v2 ${isSelected ? 'selected' : ''}`} onClick={() => handleToggleJiraIssue(issue)}>
                                                                    <div className={`selector-checkbox-v2 ${isSelected ? 'checked' : ''}`}>
                                                                        {isSelected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                    </div>
                                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--ph)', fontWeight: 600 }}>{issue.key}</span>
                                                                            <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{issue.summary}</span>
                                                                        </div>
                                                                        <div style={{ fontSize: '0.8rem', color: 'var(--m2)', marginTop: 2, display: 'flex', gap: 8 }}>
                                                                            <span>{issue.issueType}</span>
                                                                            <span>{issue.status}</span>
                                                                            {issue.assignee && <span>{issue.assignee}</span>}
                                                                            {issue.priority && <span>{issue.priority}</span>}
                                                                            {issue.fixVersions?.length > 0 && <span style={{ color: 'var(--sky)' }}>{issue.fixVersions.join(', ')}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--muted)', fontSize: '0.9375rem' }}>
                                                    {loadingData ? <RefreshCw className="spin" style={{ color: 'var(--indigo)' }} /> :
                                                        !jiraSelectedProject ? 'Select a project to get started' :
                                                            jiraMode === 'version' ? (jiraVersions.length === 0 ? 'No release versions found' : jiraSelectedVersions.length === 0 ? 'Select release versions' : 'No issues in selected versions') :
                                                                !jiraSelectedBoard ? (jiraBoards.length === 0 ? 'No boards found for this project' : 'Select a board') :
                                                                    jiraSprints.length > 0 && jiraSelectedSprints.length === 0 ? 'Select sprints to view issues' :
                                                                        'No issues found'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="selector-footer-v2">
                                            <button className="btn btn-secondary" onClick={() => setStep(2)}>{ic.back} Back</button>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{jiraSelectedIssues.length} selected</span>
                                                <button className="btn btn-primary" onClick={() => setStep(4)} disabled={jiraSelectedIssues.length === 0}>
                                                    Continue {ic.arr}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (sources.length === 1 ? sources[0] : sourceTab) === 'devrev' && sources.includes('devrev') ? (
                                    <div className="selector-card-v2">
                                        <div className="selector-grid-3col">
                                            {/* Boards */}
                                            <div className="selector-sidebar-v2" style={{ overflowY: 'auto' }}>
                                                <div className="selector-sidebar-header-v2">Sprint Boards</div>
                                                <input type="text" placeholder="Search boards..." className="selector-search-v2" value={boardSearch} onChange={e => setBoardSearch(e.target.value)} />
                                                <div style={{ padding: '4px 10px' }}>
                                                    {filteredBoards.map(board => (
                                                        <button
                                                            key={board.id}
                                                            className={`selector-repo-btn-v2 ${selectedBoard?.id === board.id ? 'active' : ''}`}
                                                            onClick={() => handleSelectBoard(board)}
                                                        >
                                                            {ic.layers} {board.name || board.id}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Sprints */}
                                            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--border-l)' }}>
                                                <div className="selector-filter-row-v2">
                                                    <input type="text" placeholder="Search sprints..." className="selector-search-v2" style={{ maxWidth: 200, margin: 0 }} value={sprintSearch} onChange={e => setSprintSearch(e.target.value)} />
                                                    <SearchDropdown
                                                        options={[
                                                            { id: 'all', label: 'All Status' },
                                                            { id: 'active', label: 'Active' },
                                                            { id: 'completed', label: 'Completed' },
                                                        ]}
                                                        value={sprintFilter}
                                                        onChange={(id) => setSprintFilter(id)}
                                                        placeholder="Filter..."
                                                        style={{ maxWidth: 150 }}
                                                    />
                                                </div>
                                                <div className="selector-list-header-v2" onClick={handleToggleAllSprints}>
                                                    {filteredSprints.length > 0 && filteredSprints.every(s => selectedSprints.find(sel => sel.id === s.id))
                                                        ? <CheckSquare size={18} style={{ color: 'var(--emerald)' }} />
                                                        : <Square size={18} style={{ color: 'var(--m2)' }} />
                                                    }
                                                    <span>Select All ({filteredSprints.length})</span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
                                                    {loadingData && sprints.length === 0 ? (
                                                        <div style={{ display: 'flex', justifyContent: 'center', padding: 40, color: 'var(--indigo)' }}>
                                                            <RefreshCw className="spin" />
                                                        </div>
                                                    ) : filteredSprints.map(sprint => {
                                                        const isSelected = !!selectedSprints.find(s => s.id === sprint.id);
                                                        return (
                                                            <div key={sprint.id} className={`selector-item-v2 ${isSelected ? 'selected' : ''}`} onClick={() => handleToggleSprint(sprint)}>
                                                                <div className={`selector-checkbox-v2 ${isSelected ? 'checked' : ''}`}>
                                                                    {isSelected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                </div>
                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{sprint.name}</div>
                                                                    <div style={{ fontSize: '0.8rem', color: 'var(--m2)', marginTop: 2 }}>{sprint.state}</div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            {/* Work Items */}
                                            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                                {devrevItems.length > 0 ? (
                                                    <>
                                                        <div className="selector-filter-row-v2">
                                                            <input type="text" placeholder="Search work items..." className="selector-search-v2" style={{ maxWidth: 200, margin: 0 }} value={devrevItemSearch} onChange={e => setDevrevItemSearch(e.target.value)} />
                                                        </div>
                                                        <div className="selector-list-header-v2" onClick={handleToggleAllDevrevItems}>
                                                            {filteredDevrevItems.length > 0 && filteredDevrevItems.every(i => devrevSelectedItems.find(s => s.id === i.id))
                                                                ? <CheckSquare size={18} style={{ color: 'var(--emerald)' }} />
                                                                : <Square size={18} style={{ color: 'var(--m2)' }} />
                                                            }
                                                            <span>Select All ({filteredDevrevItems.length})</span>
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
                                                            {filteredDevrevItems.map(item => {
                                                                const isSelected = !!devrevSelectedItems.find(s => s.id === item.id);
                                                                return (
                                                                    <div key={item.id} className={`selector-item-v2 ${isSelected ? 'selected' : ''}`} onClick={() => handleToggleDevrevItem(item)}>
                                                                        <div className={`selector-checkbox-v2 ${isSelected ? 'checked' : ''}`}>
                                                                            {isSelected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                        </div>
                                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                                <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--emerald)', fontWeight: 600 }}>{item.display_id}</span>
                                                                                <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{item.title}</span>
                                                                            </div>
                                                                            <div style={{ fontSize: '0.8rem', color: 'var(--m2)', marginTop: 2, display: 'flex', gap: 8 }}>
                                                                                <span>{item.state}</span>
                                                                                {item.priority && item.priority !== 'N/A' && <span>{item.priority}</span>}
                                                                                {item.assignee && <span>{item.assignee}</span>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--muted)', fontSize: '0.9375rem' }}>
                                                        {loadingData ? <RefreshCw className="spin" style={{ color: 'var(--indigo)' }} /> :
                                                            selectedSprints.length === 0 ? 'Select sprints to view work items' :
                                                                'No work items found'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="selector-footer-v2">
                                            <button className="btn btn-secondary" onClick={() => setStep(2)}>{ic.back} Back</button>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{devrevSelectedItems.length} selected</span>
                                                <button className="btn btn-primary" onClick={() => setStep(4)} disabled={devrevSelectedItems.length === 0}>
                                                    Continue {ic.arr}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (sources.length === 1 ? sources[0] : sourceTab) === 'linear' && sources.includes('linear') ? (
                                    /* ── Linear Panel ── */
                                    <div className="selector-card-v2 selector-jira-wrap">
                                        <div style={{ padding: '16px 18px 0', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
                                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                <SearchDropdown
                                                    options={linearTeams.map(t => ({ id: t.id, label: t.name }))}
                                                    value={linearSelectedTeam?.id || null}
                                                    onChange={id => { const t = linearTeams.find(t => t.id === id); if (t) handleSelectLinearTeam(t); }}
                                                    placeholder="Select Team..."
                                                    style={{ minWidth: 160 }}
                                                />
                                                {linearSelectedTeam && linearCycles.length > 0 && (
                                                    <SearchDropdown
                                                        options={[{ id: '__none__', label: 'All Cycles' }, ...linearCycles.map(c => ({ id: c.id, label: c.name || `Cycle ${c.number}` }))]}
                                                        value={linearSelectedCycle || '__none__'}
                                                        onChange={id => handleSelectLinearProjectOrCycle(linearSelectedProject, id === '__none__' ? null : id)}
                                                        placeholder="Select Cycle..."
                                                        style={{ minWidth: 150 }}
                                                    />
                                                )}
                                                {linearSelectedTeam && linearProjects.length > 0 && (
                                                    <SearchDropdown
                                                        options={[{ id: '__none__', label: 'All Projects' }, ...linearProjects.map(p => ({ id: p.id, label: p.name }))]}
                                                        value={linearSelectedProject || '__none__'}
                                                        onChange={id => handleSelectLinearProjectOrCycle(id === '__none__' ? null : id, linearSelectedCycle)}
                                                        placeholder="Select Project..."
                                                        style={{ minWidth: 150 }}
                                                    />
                                                )}
                                                {loadingData && <RefreshCw size={16} className="spin" style={{ color: 'var(--indigo)', alignSelf: 'center' }} />}
                                            </div>
                                        </div>
                                        <div style={{ padding: '12px 18px 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0 }}>
                                            {linearIssues.length > 0 ? (
                                                <>
                                                    <div style={{ marginBottom: 8 }}>
                                                        <input type="text" placeholder="Search issues..." className="selector-search-v2" style={{ margin: 0, maxWidth: 220, height: 36, fontSize: '0.875rem', borderRadius: 8 }} value={linearIssueSearch} onChange={e => setLinearIssueSearch(e.target.value)} />
                                                    </div>
                                                    <div className="selector-list-header-v2" onClick={handleToggleAllLinearIssues}>
                                                        {filteredLinearIssues.length > 0 && filteredLinearIssues.every(i => linearSelectedIssues.find(s => s.id === i.id))
                                                            ? <CheckSquare size={18} style={{ color: 'var(--emerald)' }} />
                                                            : <Square size={18} style={{ color: 'var(--m2)' }} />}
                                                        <span>Select All ({filteredLinearIssues.length})</span>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
                                                        {filteredLinearIssues.map(issue => {
                                                            const isSelected = !!linearSelectedIssues.find(s => s.id === issue.id);
                                                            return (
                                                                <div key={issue.id} className={`selector-item-v2 ${isSelected ? 'selected' : ''}`} onClick={() => handleToggleLinearIssue(issue)}>
                                                                    <div className={`selector-checkbox-v2 ${isSelected ? 'checked' : ''}`}>
                                                                        {isSelected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                    </div>
                                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--indigo)', fontWeight: 600 }}>{issue.identifier}</span>
                                                                            <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{issue.title}</span>
                                                                        </div>
                                                                        <div style={{ fontSize: '0.8rem', color: 'var(--m2)', marginTop: 2, display: 'flex', gap: 8 }}>
                                                                            {issue.state && <span>{issue.state}</span>}
                                                                            {issue.priority && <span>{issue.priority}</span>}
                                                                            {issue.assignee && <span>{issue.assignee}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--muted)', fontSize: '0.9375rem' }}>
                                                    {loadingData ? <RefreshCw className="spin" style={{ color: 'var(--indigo)' }} /> :
                                                        !linearSelectedTeam ? 'Select a team to get started' : 'No issues found. Select a project or cycle.'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="selector-footer-v2">
                                            <button className="btn btn-secondary" onClick={() => setStep(2)}>{ic.back} Back</button>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{linearSelectedIssues.length} selected</span>
                                                <button className="btn btn-primary" onClick={() => setStep(4)} disabled={linearSelectedIssues.length === 0}>Continue {ic.arr}</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (sources.length === 1 ? sources[0] : sourceTab) === 'asana' && sources.includes('asana') ? (
                                    /* ── Asana Panel ── */
                                    <div className="selector-card-v2 selector-jira-wrap">
                                        <div style={{ padding: '16px 18px 0', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
                                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                <SearchDropdown
                                                    options={asanaWorkspaces.map(w => ({ id: w.gid, label: w.name }))}
                                                    value={asanaSelectedWorkspace?.gid || null}
                                                    onChange={id => { const w = asanaWorkspaces.find(w => w.gid === id); if (w) handleSelectAsanaWorkspace(w); }}
                                                    placeholder="Select Workspace..."
                                                    style={{ minWidth: 160 }}
                                                />
                                                {asanaSelectedWorkspace && asanaProjects.length > 0 && (
                                                    <SearchDropdown
                                                        options={asanaProjects.map(p => ({ id: p.gid, label: p.name }))}
                                                        value={asanaSelectedProject?.gid || null}
                                                        onChange={id => { const p = asanaProjects.find(p => p.gid === id); if (p) handleSelectAsanaProject(p); }}
                                                        placeholder="Select Project..."
                                                        style={{ minWidth: 160 }}
                                                    />
                                                )}
                                                {asanaSelectedProject && asanaSections.length > 0 && (
                                                    <SearchDropdown
                                                        options={[{ id: '__all__', label: 'All Sections' }, ...asanaSections.map(s => ({ id: s.gid, label: s.name }))]}
                                                        value={asanaSelectedSection?.gid || '__all__'}
                                                        onChange={id => { if (id === '__all__') { setAsanaSelectedSection(null); handleSelectAsanaProject(asanaSelectedProject); } else { const s = asanaSections.find(s => s.gid === id); if (s) handleSelectAsanaSection(s); } }}
                                                        placeholder="Select Section..."
                                                        style={{ minWidth: 150 }}
                                                    />
                                                )}
                                                {loadingData && <RefreshCw size={16} className="spin" style={{ color: 'var(--rose)', alignSelf: 'center' }} />}
                                            </div>
                                        </div>
                                        <div style={{ padding: '12px 18px 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0 }}>
                                            {asanaTasks.length > 0 ? (
                                                <>
                                                    <div style={{ marginBottom: 8 }}>
                                                        <input type="text" placeholder="Search tasks..." className="selector-search-v2" style={{ margin: 0, maxWidth: 220, height: 36, fontSize: '0.875rem', borderRadius: 8 }} value={asanaTaskSearch} onChange={e => setAsanaTaskSearch(e.target.value)} />
                                                    </div>
                                                    <div className="selector-list-header-v2" onClick={handleToggleAllAsanaTasks}>
                                                        {filteredAsanaTasks.length > 0 && filteredAsanaTasks.every(t => asanaSelectedTasks.find(s => s.id === t.id))
                                                            ? <CheckSquare size={18} style={{ color: 'var(--emerald)' }} />
                                                            : <Square size={18} style={{ color: 'var(--m2)' }} />}
                                                        <span>Select All ({filteredAsanaTasks.length})</span>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
                                                        {filteredAsanaTasks.map(task => {
                                                            const isSelected = !!asanaSelectedTasks.find(s => s.id === task.id);
                                                            return (
                                                                <div key={task.id} className={`selector-item-v2 ${isSelected ? 'selected' : ''}`} onClick={() => handleToggleAsanaTask(task)}>
                                                                    <div className={`selector-checkbox-v2 ${isSelected ? 'checked' : ''}`}>
                                                                        {isSelected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                    </div>
                                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                                        <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{task.title}</div>
                                                                        <div style={{ fontSize: '0.8rem', color: 'var(--m2)', marginTop: 2, display: 'flex', gap: 8 }}>
                                                                            {task.assignee && <span>{task.assignee}</span>}
                                                                            <span>{task.status}</span>
                                                                            {task.priority !== 'N/A' && <span>{task.priority}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--muted)', fontSize: '0.9375rem' }}>
                                                    {loadingData ? <RefreshCw className="spin" style={{ color: 'var(--rose)' }} /> :
                                                        !asanaSelectedWorkspace ? 'Select a workspace to get started' :
                                                            !asanaSelectedProject ? 'Select a project' : 'No tasks found'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="selector-footer-v2">
                                            <button className="btn btn-secondary" onClick={() => setStep(2)}>{ic.back} Back</button>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{asanaSelectedTasks.length} selected</span>
                                                <button className="btn btn-primary" onClick={() => setStep(4)} disabled={asanaSelectedTasks.length === 0}>Continue {ic.arr}</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (sources.length === 1 ? sources[0] : sourceTab) === 'clickup' && sources.includes('clickup') ? (
                                    /* ── ClickUp Panel ── */
                                    <div className="selector-card-v2 selector-jira-wrap">
                                        <div style={{ padding: '16px 18px 0', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
                                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                <SearchDropdown
                                                    options={clickupWorkspaces.map(w => ({ id: w.id, label: w.name }))}
                                                    value={clickupSelectedWorkspace?.id || null}
                                                    onChange={id => { const w = clickupWorkspaces.find(w => w.id === id); if (w) handleSelectClickUpWorkspace(w); }}
                                                    placeholder="Select Workspace..."
                                                    style={{ minWidth: 160 }}
                                                />
                                                {clickupSelectedWorkspace && clickupSpaces.length > 0 && (
                                                    <SearchDropdown
                                                        options={clickupSpaces.map(s => ({ id: s.id, label: s.name }))}
                                                        value={clickupSelectedSpace?.id || null}
                                                        onChange={id => { const s = clickupSpaces.find(s => s.id === id); if (s) handleSelectClickUpSpace(s); }}
                                                        placeholder="Select Space..."
                                                        style={{ minWidth: 150 }}
                                                    />
                                                )}
                                                {clickupSelectedSpace && clickupLists.length > 0 && (
                                                    <SearchDropdown
                                                        options={clickupLists.map(l => ({ id: l.id, label: l.name }))}
                                                        value={clickupSelectedList?.id || null}
                                                        onChange={id => { const l = clickupLists.find(l => l.id === id); if (l) handleSelectClickUpList(l); }}
                                                        placeholder="Select List..."
                                                        style={{ minWidth: 150 }}
                                                    />
                                                )}
                                                {loadingData && <RefreshCw size={16} className="spin" style={{ color: 'var(--violet)', alignSelf: 'center' }} />}
                                            </div>
                                        </div>
                                        <div style={{ padding: '12px 18px 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0 }}>
                                            {clickupTasks.length > 0 ? (
                                                <>
                                                    <div style={{ marginBottom: 8 }}>
                                                        <input type="text" placeholder="Search tasks..." className="selector-search-v2" style={{ margin: 0, maxWidth: 220, height: 36, fontSize: '0.875rem', borderRadius: 8 }} value={clickupTaskSearch} onChange={e => setClickupTaskSearch(e.target.value)} />
                                                    </div>
                                                    <div className="selector-list-header-v2" onClick={handleToggleAllClickUpTasks}>
                                                        {filteredClickUpTasks.length > 0 && filteredClickUpTasks.every(t => clickupSelectedTasks.find(s => s.id === t.id))
                                                            ? <CheckSquare size={18} style={{ color: 'var(--emerald)' }} />
                                                            : <Square size={18} style={{ color: 'var(--m2)' }} />}
                                                        <span>Select All ({filteredClickUpTasks.length})</span>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
                                                        {filteredClickUpTasks.map(task => {
                                                            const isSelected = !!clickupSelectedTasks.find(s => s.id === task.id);
                                                            return (
                                                                <div key={task.id} className={`selector-item-v2 ${isSelected ? 'selected' : ''}`} onClick={() => handleToggleClickUpTask(task)}>
                                                                    <div className={`selector-checkbox-v2 ${isSelected ? 'checked' : ''}`}>
                                                                        {isSelected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                    </div>
                                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                                        <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{task.title}</div>
                                                                        <div style={{ fontSize: '0.8rem', color: 'var(--m2)', marginTop: 2, display: 'flex', gap: 8 }}>
                                                                            {task.key && <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem' }}>{task.key}</span>}
                                                                            {task.status && task.status !== 'N/A' && <span>{task.status}</span>}
                                                                            {task.priority && task.priority !== 'N/A' && <span>{task.priority}</span>}
                                                                            {task.assignee && <span>{task.assignee}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--muted)', fontSize: '0.9375rem' }}>
                                                    {loadingData ? <RefreshCw className="spin" style={{ color: 'var(--violet)' }} /> :
                                                        !clickupSelectedWorkspace ? 'Select a workspace to get started' :
                                                            !clickupSelectedSpace ? 'Select a space' :
                                                                !clickupSelectedList ? 'Select a list' : 'No tasks found'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="selector-footer-v2">
                                            <button className="btn btn-secondary" onClick={() => setStep(2)}>{ic.back} Back</button>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{clickupSelectedTasks.length} selected</span>
                                                <button className="btn btn-primary" onClick={() => setStep(4)} disabled={clickupSelectedTasks.length === 0}>Continue {ic.arr}</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (sources.length === 1 ? sources[0] : sourceTab) === 'monday' && sources.includes('monday') ? (
                                    /* ── Monday Panel ── */
                                    <div className="selector-card-v2 selector-jira-wrap">
                                        <div style={{ padding: '16px 18px 0', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
                                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                <SearchDropdown
                                                    options={mondayBoards.map(b => ({ id: b.id, label: b.name }))}
                                                    value={mondaySelectedBoard?.id || null}
                                                    onChange={id => { const b = mondayBoards.find(b => b.id === id); if (b) handleSelectMondayBoard(b); }}
                                                    placeholder="Select Board..."
                                                    style={{ minWidth: 180 }}
                                                />
                                                {mondaySelectedBoard && mondayGroups.length > 0 && (
                                                    <SearchDropdown
                                                        options={[{ id: '__all__', label: 'All Groups' }, ...mondayGroups.map(g => ({ id: g.id, label: g.title }))]}
                                                        value={mondaySelectedGroup?.id || '__all__'}
                                                        onChange={id => { if (id === '__all__') { setMondaySelectedGroup(null); handleSelectMondayBoard(mondaySelectedBoard); } else { const g = mondayGroups.find(g => g.id === id); if (g) handleSelectMondayGroup(g); } }}
                                                        placeholder="Select Group..."
                                                        style={{ minWidth: 150 }}
                                                    />
                                                )}
                                                {loadingData && <RefreshCw size={16} className="spin" style={{ color: 'var(--amber)', alignSelf: 'center' }} />}
                                            </div>
                                        </div>
                                        <div style={{ padding: '12px 18px 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minHeight: 0 }}>
                                            {mondayItems.length > 0 ? (
                                                <>
                                                    <div style={{ marginBottom: 8 }}>
                                                        <input type="text" placeholder="Search items..." className="selector-search-v2" style={{ margin: 0, maxWidth: 220, height: 36, fontSize: '0.875rem', borderRadius: 8 }} value={mondayItemSearch} onChange={e => setMondayItemSearch(e.target.value)} />
                                                    </div>
                                                    <div className="selector-list-header-v2" onClick={handleToggleAllMondayItems}>
                                                        {filteredMondayItems.length > 0 && filteredMondayItems.every(i => mondaySelectedItems.find(s => s.id === i.id))
                                                            ? <CheckSquare size={18} style={{ color: 'var(--emerald)' }} />
                                                            : <Square size={18} style={{ color: 'var(--m2)' }} />}
                                                        <span>Select All ({filteredMondayItems.length})</span>
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
                                                        {filteredMondayItems.map(item => {
                                                            const isSelected = !!mondaySelectedItems.find(s => s.id === item.id);
                                                            return (
                                                                <div key={item.id} className={`selector-item-v2 ${isSelected ? 'selected' : ''}`} onClick={() => handleToggleMondayItem(item)}>
                                                                    <div className={`selector-checkbox-v2 ${isSelected ? 'checked' : ''}`}>
                                                                        {isSelected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                    </div>
                                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                                        <div style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{item.title}</div>
                                                                        <div style={{ fontSize: '0.8rem', color: 'var(--m2)', marginTop: 2, display: 'flex', gap: 8 }}>
                                                                            {item.key && <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem' }}>{item.key}</span>}
                                                                            {item.status && item.status !== 'N/A' && <span>{item.status}</span>}
                                                                            {item.priority && item.priority !== 'N/A' && <span>{item.priority}</span>}
                                                                            {item.assignee && <span>{item.assignee}</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--muted)', fontSize: '0.9375rem' }}>
                                                    {loadingData ? <RefreshCw className="spin" style={{ color: 'var(--amber)' }} /> :
                                                        !mondaySelectedBoard ? 'Select a board to get started' : 'No items found'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="selector-footer-v2">
                                            <button className="btn btn-secondary" onClick={() => setStep(2)}>{ic.back} Back</button>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{mondaySelectedItems.length} selected</span>
                                                <button className="btn btn-primary" onClick={() => setStep(4)} disabled={mondaySelectedItems.length === 0}>Continue {ic.arr}</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* Step 4: Configure */}
                        {step === 4 && (
                            <div className="fu d1">
                                <div className="config-layout">
                                    {/* Left: Config Form (60%) */}
                                    <div className="config-form-col">
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>Configure output</h3>
                                        <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', marginBottom: 20 }}>Fine-tune how your release notes are generated.</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                                            <div>
                                                <label className="gen-config-label">Release Title</label>
                                                <input
                                                    value={releaseTitle}
                                                    onChange={e => setReleaseTitle(e.target.value)}
                                                    placeholder={`${sources.map(s => ({ github: 'GitHub', jira: 'Jira', devrev: 'DevRev', linear: 'Linear', asana: 'Asana', clickup: 'ClickUp', monday: 'Monday.com' }[s] || s)).join(' + ')} Release Notes - ${new Date().toLocaleDateString()}`}
                                                    className="gen-config-input"
                                                />
                                            </div>
                                            <div>
                                                <label className="gen-config-label">Tone</label>
                                                <SearchDropdown
                                                    options={[
                                                        { id: 'professional', label: 'Professional' },
                                                        { id: 'casual', label: 'Casual' },
                                                        { id: 'technical', label: 'Technical' },
                                                    ]}
                                                    value={tone}
                                                    onChange={(id) => setTone(id)}
                                                    placeholder="Select tone..."
                                                />
                                            </div>
                                            {catalogue && (
                                                <LLMSelector
                                                    catalogue={catalogue}
                                                    savedKeys={savedKeys}
                                                    llmConfig={llmConfig}
                                                    onChange={setLlmConfig}
                                                    byokEnabled={canUse('byok_enabled').allowed}
                                                />
                                            )}
                                        </div>

                                        {/* Advanced Options */}
                                        <div className="config-advanced">
                                            <button className="config-advanced-toggle" onClick={() => setAdvancedOpen(o => !o)}>
                                                <svg width="12" height="12" fill="none" viewBox="0 0 12 12" style={{ transition: 'transform .2s', transform: advancedOpen ? 'rotate(90deg)' : 'none' }}>
                                                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Advanced Options
                                            </button>
                                            {advancedOpen && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
                                                    <div>
                                                        <label className="gen-config-label">Custom Prompt (optional)</label>
                                                        <textarea
                                                            value={customPrompt}
                                                            onChange={e => setCustomPrompt(e.target.value)}
                                                            placeholder="Add additional instructions for the AI, e.g. 'Focus on user-facing changes' or 'Group by feature area'"
                                                            className="gen-config-input"
                                                            style={{ minHeight: 80, resize: 'vertical' }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                                            <button className="btn btn-secondary" onClick={() => setStep(3)}>{ic.back} Back</button>
                                            <button className="btn btn-primary gen-generate-btn" onClick={handleGenerate} disabled={loading}>
                                                {loading ? (
                                                    <><RefreshCw size={14} className="spin" /> Generating...</>
                                                ) : (
                                                    <>{ic.spark} <span>Generate Release Notes</span></>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right: Generation Summary (40%) */}
                                    <div className="config-summary-col">
                                        <div className="config-summary-card">
                                            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: 16 }}>Generation Summary</h4>
                                            <div className="config-summary-rows">
                                                <div className="config-summary-row">
                                                    <span className="config-summary-label">Sources</span>
                                                    <span className="config-summary-value">
                                                        {sources.map(s => ({ github: 'GitHub', jira: 'Jira', devrev: 'DevRev', linear: 'Linear', asana: 'Asana', clickup: 'ClickUp', monday: 'Monday.com' }[s] || s)).join(', ')}
                                                    </span>
                                                </div>
                                                {sources.includes('github') && selectedCommits.length > 0 && (
                                                    <div className="config-summary-row">
                                                        <span className="config-summary-label">Commits / PRs</span>
                                                        <span className="config-summary-value">{selectedCommits.length} selected</span>
                                                    </div>
                                                )}
                                                {sources.includes('devrev') && devrevSelectedItems.length > 0 && (
                                                    <div className="config-summary-row">
                                                        <span className="config-summary-label">DevRev Items</span>
                                                        <span className="config-summary-value">{devrevSelectedItems.length} selected</span>
                                                    </div>
                                                )}
                                                {sources.includes('jira') && jiraSelectedIssues.length > 0 && (
                                                    <div className="config-summary-row">
                                                        <span className="config-summary-label">Jira Issues</span>
                                                        <span className="config-summary-value">{jiraSelectedIssues.length} selected</span>
                                                    </div>
                                                )}
                                                {sources.includes('linear') && linearSelectedIssues.length > 0 && (
                                                    <div className="config-summary-row">
                                                        <span className="config-summary-label">Linear Issues</span>
                                                        <span className="config-summary-value">{linearSelectedIssues.length} selected</span>
                                                    </div>
                                                )}
                                                {sources.includes('asana') && asanaSelectedTasks.length > 0 && (
                                                    <div className="config-summary-row">
                                                        <span className="config-summary-label">Asana Tasks</span>
                                                        <span className="config-summary-value">{asanaSelectedTasks.length} selected</span>
                                                    </div>
                                                )}
                                                {sources.includes('clickup') && clickupSelectedTasks.length > 0 && (
                                                    <div className="config-summary-row">
                                                        <span className="config-summary-label">ClickUp Tasks</span>
                                                        <span className="config-summary-value">{clickupSelectedTasks.length} selected</span>
                                                    </div>
                                                )}
                                                {sources.includes('monday') && mondaySelectedItems.length > 0 && (
                                                    <div className="config-summary-row">
                                                        <span className="config-summary-label">Monday Items</span>
                                                        <span className="config-summary-value">{mondaySelectedItems.length} selected</span>
                                                    </div>
                                                )}
                                                <div className="config-summary-row">
                                                    <span className="config-summary-label">Audience</span>
                                                    <span className="config-summary-value">{audienceOptions.find(a => a.id === audience)?.label || audience}</span>
                                                </div>
                                                <div className="config-summary-row">
                                                    <span className="config-summary-label">Tone</span>
                                                    <span className="config-summary-value" style={{ textTransform: 'capitalize' }}>{tone}</span>
                                                </div>
                                                <div className="config-summary-row">
                                                    <span className="config-summary-label">LLM</span>
                                                    <span className="config-summary-value">
                                                        {llmConfig.provider === 'releasly' ? 'Releaslyy AI' : (llmConfig.model || llmConfig.provider)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default Dashboard;
