import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { RefreshCw, Square, CheckSquare, Trash2, Search, X, Check, Plus } from 'lucide-react';
import TopBar from '../../components/Header/Header';
import DataSelector from '../../components/DataSelector/DataSelector';
import Pill from '../../components/ui/Pill';
import StepIndicator from '../../components/ui/StepIndicator';
import SearchDropdown from '../../components/ui/SearchDropdown';
import devrevLogo from '../../assets/devrev-logo.webp';
import jiraLogo from '../../assets/jira_logo.webp';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
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
};

const JIRA_FILTER_DEFS = [
    { key: 'type', label: 'Issue Type', extract: i => i.issueType },
    { key: 'status', label: 'Status', extract: i => i.status },
    { key: 'priority', label: 'Priority', extract: i => i.priority },
    { key: 'assignee', label: 'Assignee', extract: i => i.assignee },
    { key: 'labels', label: 'Labels', extract: i => i.labels || [], multi: true },
];

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true
});

const Dashboard = () => {
    const navigate = useNavigate();

    // -- Global Dashboard State --
    const [view, setView] = useState('overview'); // 'overview' | 'generate'
    const [source, setSource] = useState('github'); // 'github' | 'devrev' | 'jira'
    const [user, setUser] = useState(null);
    const [connectedIntegrations, setConnectedIntegrations] = useState([]);

    // -- Notes State --
    const [generatedNotes, setGeneratedNotes] = useState([]);
    const [totalNotesGenerated, setTotalNotesGenerated] = useState(0);

    // -- GitHub State --
    const [repos, setRepos] = useState([]);
    const [branches, setBranches] = useState([]);
    const [commits, setCommits] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState(() => sessionStorage.getItem('github_selectedRepo') || '');
    const [selectedBranch, setSelectedBranch] = useState(() => sessionStorage.getItem('github_selectedBranch') || '');
    const [selectedCommits, setSelectedCommits] = useState(() => {
        const saved = sessionStorage.getItem('github_selectedCommits');
        return saved ? JSON.parse(saved) : [];
    });
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

    // -- DevRev State --
    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(() => {
        const saved = sessionStorage.getItem('devrev_selectedBoard');
        return saved ? JSON.parse(saved) : null;
    });
    const [sprints, setSprints] = useState([]);
    const [selectedSprints, setSelectedSprints] = useState(() => {
        const saved = sessionStorage.getItem('devrev_selectedSprints');
        return saved ? JSON.parse(saved) : [];
    });
    const [boardSearch, setBoardSearch] = useState('');
    const [sprintSearch, setSprintSearch] = useState('');
    const [sprintFilter, setSprintFilter] = useState('all');

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

    // -- Shared Gen State --
    const [audience, setAudience] = useState(() => sessionStorage.getItem('shared_audience') || 'qa');
    const [releaseTitle, setReleaseTitle] = useState('');
    const [tone, setTone] = useState('professional');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    // -- Generate Wizard State --
    const [step, setStep] = useState(1);

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

    // --- Initialization ---
    useEffect(() => {
        const init = async () => {
            try {
                const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true });
                if (userRes.data && userRes.data.id) setUser(userRes.data);

                const [ghRes, drRes, jiraRes] = await Promise.all([
                    api.get('/tokens/github').catch(() => ({ data: { hasToken: false } })),
                    api.get('/tokens/devrev').catch(() => ({ data: { hasToken: false } })),
                    api.get('/tokens/jira').catch(() => ({ data: { hasToken: false } }))
                ]);

                try {
                    const tokensRes = await api.get('/tokens');
                    const services = tokensRes.data.services || [];
                    const formatted = services.map(s => {
                        if (s === 'github') return 'GitHub';
                        if (s === 'devrev') return 'DevRev';
                        if (s === 'jira') return 'Jira';
                        return s.charAt(0).toUpperCase() + s.slice(1);
                    });
                    setConnectedIntegrations(formatted);
                } catch (e) {
                    console.error("Failed to fetch all tokens", e);
                }

                try {
                    const notesRes = await api.get('/notes');
                    setGeneratedNotes(notesRes.data.notes || []);
                    const countRes = await api.get('/notes/count');
                    setTotalNotesGenerated(countRes.data.count || 0);
                } catch (e) {
                    console.error("Failed to fetch notes", e);
                }

                if (!ghRes.data.hasToken) setSource('devrev');
                if (!ghRes.data.hasToken && !drRes.data.hasToken && jiraRes.data.hasToken) setSource('jira');
                if (ghRes.data.hasToken) fetchRepos(selectedRepo, selectedBranch);
                if (drRes.data.hasToken) fetchBoards(selectedBoard);
                if (jiraRes.data.hasToken) fetchJiraProjects();

            } catch (err) {
                console.error("Dashboard Init Error", err);
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
        } catch (err) { console.error("GH fetchRepos", err); }
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
        } catch (err) { console.error(err); }
    };

    const handleSelectBranch = async (branch, repoOverride = null) => {
        const currentRepo = repoOverride || selectedRepo;
        setSelectedBranch(branch);
        fetchCommits(currentRepo, branch, dateRange, true);
    };

    useEffect(() => {
        if (selectedRepo && selectedBranch && view === 'generate' && source === 'github') {
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
        } catch (err) { console.error("GH fetchCommits", err); }
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
        } catch (err) { console.error("DR fetchBoards", err); }
    };

    const handleSelectBoard = async (board) => {
        setSelectedBoard(board);
        setSprints([]);
        fetchSprintsForBoard(board.id);
    };

    const fetchSprintsForBoard = async (boardId) => {
        setLoadingData(true);
        try {
            const res = await api.post('/devrev/groups', { parent_id: boardId });
            setSprints(res.data.data || []);
        } catch (err) { console.error("DR fetchSprints", err); }
        finally { setLoadingData(false); }
    };

    const handleToggleSprint = (sprint) => {
        setSelectedSprints(prev => {
            const exists = prev.find(s => s.id === sprint.id);
            if (exists) return prev.filter(s => s.id !== sprint.id);
            return [...prev, sprint];
        });
    };

    const handleToggleAllSprints = () => {
        const filtered = filteredSprints;
        const allSelected = filtered.every(s => selectedSprints.find(selected => selected.id === s.id));
        if (allSelected) {
            setSelectedSprints(prev => prev.filter(selected => !filtered.find(s => s.id === selected.id)));
        } else {
            const newSprints = filtered.filter(s => !selectedSprints.find(selected => selected.id === s.id));
            setSelectedSprints(prev => [...prev, ...newSprints]);
        }
    };

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
        } catch (err) { console.error("Jira fetchProjects", err); }
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
        } catch (err) { console.error("Jira fetchBoards/versions", err); }
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
        } catch (err) { console.error("Jira fetchSprints", err); }
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
        } catch (err) { console.error("Jira fetchIssues", err); }
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
        } catch (err) { console.error("Jira fetchVersionIssues", err); }
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
                    .catch(err => console.error("Jira fetchVersions", err))
                    .finally(() => setLoadingData(false));
            } else {
                api.get('/jira/boards', { params: { projectKeyOrId: jiraSelectedProject.key } })
                    .then(res => { setJiraBoards(res.data.boards || []); })
                    .catch(err => console.error("Jira fetchBoards", err))
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

    // --- Generation Logic ---
    const handleGenerate = async () => {
        setLoading(true);
        try {
            if (source === 'github') {
                const selectedObjects = commits.filter(c => selectedCommits.includes(c.id));
                const commitList = selectedObjects.map(pr => ({
                    commit: { message: `PR #${pr.number}: ${pr.title}`, author: { name: pr.user.login } }
                }));
                const title = releaseTitle || `GitHub Release Notes - ${new Date().toLocaleDateString()}`;
                const genRes = await api.post('/generate', { commits: commitList, audience, title, tone });
                sessionStorage.setItem('last_integration', 'github');
                navigate('/generate', { state: { notes: genRes.data.notes, noteId: genRes.data.noteId, noteTitle: genRes.data.title } });
            } else if (source === 'devrev') {
                const title = releaseTitle || `DevRev Release Notes - ${new Date().toLocaleDateString()}`;
                const genRes = await api.post('/devrev/generate', { sprints: selectedSprints, audience, title, tone });
                sessionStorage.setItem('last_integration', 'devrev');
                navigate('/generate', { state: { notes: genRes.data.notes, noteId: genRes.data.noteId, noteTitle: genRes.data.title } });
            } else if (source === 'jira') {
                const title = releaseTitle || `Jira Release Notes - ${new Date().toLocaleDateString()}`;
                const genRes = await api.post('/jira/generate', { issues: jiraSelectedIssues, audience, title, tone });
                sessionStorage.setItem('last_integration', 'jira');
                navigate('/generate', { state: { notes: genRes.data.notes, noteId: genRes.data.noteId, noteTitle: genRes.data.title } });
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate notes.');
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
            navigate('/generate', { state: { notes: res.data.note.content, noteId: noteId, noteTitle: res.data.note.title } });
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
        { n: 'Integrations', v: connectedIntegrations.length, icon: ic.plug, bg: 'var(--el)', c: 'var(--emerald)', change: connectedIntegrations.join(', ') || 'None' },
    ];

    const wizardSteps = [
        { n: 1, label: 'Select Source' },
        { n: 2, label: 'Pick Changes' },
        { n: 3, label: 'Configure' },
    ];

    return (
        <>
            {view === 'overview' ? (
                <>
                    <TopBar title={null} />
                    <div style={{ padding: '28px 32px' }}>
                        {/* Greeting + CTA */}
                        <div className="fu dash-greeting-v2">
                            <div>
                                <p className="dash-date-v2">{formattedDate}</p>
                                <h1 className="dash-hello-v2">
                                    Good {timeGreeting}, <span className="dash-name-v2">{firstName}</span>
                                </h1>
                            </div>
                            <button className="dash-cta-v2" onClick={() => { setView('generate'); setStep(1); }}>
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
                                    {/* All notes are shown inline */}
                                </div>
                                {generatedNotes.length > 0 ? (
                                    generatedNotes.map((note, i) => (
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
                                                    <span>{note.audience || 'Product'}</span>
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
                                    ))
                                ) : (
                                    <div className="dash-empty-v2">
                                        <div className="dash-empty-icon-v2">{ic.doc}</div>
                                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>No release notes yet</p>
                                        <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 16px', maxWidth: 300, lineHeight: 1.5 }}>
                                            Generate your first release note from GitHub, DevRev, or Jira data.
                                        </p>
                                        <button className="dash-cta-v2 small" onClick={() => { setView('generate'); setStep(1); }}>
                                            {ic.spark} Get Started
                                        </button>
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
                </>
            ) : (
                /* ─── Generate View ─── */
                <>
                    <TopBar sub="Generate" title="Create Release Notes">
                        <button className="topbar-action-btn" onClick={() => { setView('overview'); setStep(1); }}>
                            {ic.back} Back
                        </button>
                    </TopBar>
                    <div style={{ padding: '28px 32px' }}>
                        <StepIndicator steps={wizardSteps} currentStep={step} onStepClick={setStep} />

                        {/* Step 1: Select Source */}
                        {step === 1 && (
                            <div className="fu d1">
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Choose your data source</h3>
                                <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Select which integration to pull changes from.</p>
                                {connectedIntegrations.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                        <div style={{ fontSize: 36, marginBottom: 12 }}>{ic.plug}</div>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: '0 0 6px' }}>No integrations connected</p>
                                        <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 18px', lineHeight: 1.5 }}>
                                            Connect at least one integration to start generating release notes.
                                        </p>
                                        <Link to="/integration" className="gen-continue-btn" style={{ display: 'inline-flex', textDecoration: 'none' }}>
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
                                            ].filter(s => connectedIntegrations.includes(s.l)).map(s => (
                                                <button key={s.id} onClick={() => setSource(s.id)} className={`gen-source-btn-v2 ${source === s.id ? 'active' : ''}`}>
                                                    <div className="gen-source-icon-v2" style={{ background: `var(${s.c})0c`, color: `var(${s.c})` }}>
                                                        {s.logo ? <img src={s.logo} alt={s.l} style={{ width: 20, height: 20, objectFit: 'contain' }} /> : s.icon}
                                                    </div>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{s.l}</div>
                                                        <div style={{ fontSize: 11, color: source === s.id ? 'var(--it)' : 'var(--muted)' }}>
                                                            {source === s.id ? 'Selected' : 'Click to select'}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <button className="gen-continue-btn" onClick={() => setStep(2)}>
                                            Continue {ic.arr}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Step 2: Pick Changes */}
                        {step === 2 && (
                            <div className="fu d1">
                                {source === 'github' ? (
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
                                        onGenerate={() => setStep(3)}
                                        loading={loadingData || loading}
                                        dateRange={dateRange}
                                        setDateRange={setDateRange}
                                        onBack={() => setStep(1)}
                                        showBackButton
                                    />
                                ) : source === 'jira' ? (
                                    <div className="selector-card-v2" style={{ display: 'flex', flexDirection: 'column', height: 540 }}>
                                        {/* Top: Mode toggle + Dropdowns */}
                                        <div style={{ padding: '16px 18px 0', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
                                            {/* Mode toggle + Filter/Search icons */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', gap: 4, background: 'var(--s1)', borderRadius: 8, padding: 3, width: 'fit-content' }}>
                                                    <button
                                                        onClick={() => handleJiraModeSwitch('sprint')}
                                                        style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: 'none', cursor: 'pointer', background: jiraMode === 'sprint' ? 'var(--bg)' : 'transparent', color: jiraMode === 'sprint' ? 'var(--text)' : 'var(--muted)', boxShadow: jiraMode === 'sprint' ? '0 1px 3px rgba(0,0,0,.1)' : 'none', fontFamily: 'var(--font)' }}
                                                    >Board / Sprint</button>
                                                    <button
                                                        onClick={() => handleJiraModeSwitch('version')}
                                                        style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: 'none', cursor: 'pointer', background: jiraMode === 'version' ? 'var(--bg)' : 'transparent', color: jiraMode === 'version' ? 'var(--text)' : 'var(--muted)', boxShadow: jiraMode === 'version' ? '0 1px 3px rgba(0,0,0,.1)' : 'none', fontFamily: 'var(--font)' }}
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
                                                                style={{ margin: 0, width: 180, paddingLeft: 28, height: 32, fontSize: 12, borderRadius: 8 }}
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
                                                                                style={{ width: '100%', padding: '7px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 12, fontWeight: 500, background: jiraFilterSubMenu === def.key ? 'var(--s1)' : 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)', fontFamily: 'var(--font)' }}
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
                                                                                            style={{ width: '100%', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, background: jiraFilters[def.key] === val ? 'var(--il)' : 'transparent', color: jiraFilters[def.key] === val ? 'var(--indigo)' : 'var(--text)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
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
                                                            <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px 4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: 'var(--il)', color: 'var(--it)', whiteSpace: 'nowrap', fontFamily: 'var(--font)' }}>
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
                                                        style={{ fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', padding: '4px 8px' }}
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
                                                                            <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--sky)', fontWeight: 600 }}>{issue.key}</span>
                                                                            <span style={{ fontSize: 13, fontWeight: 500 }}>{issue.summary}</span>
                                                                        </div>
                                                                        <div style={{ fontSize: 10, color: 'var(--m2)', marginTop: 2, display: 'flex', gap: 8 }}>
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
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--muted)', fontSize: 13 }}>
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
                                            <button className="topbar-action-btn" onClick={() => setStep(1)}>{ic.back} Back</button>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{jiraSelectedIssues.length} selected</span>
                                                <button className="gen-continue-btn" onClick={() => setStep(3)} disabled={jiraSelectedIssues.length === 0}>
                                                    Continue {ic.arr}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="selector-card-v2">
                                        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', height: 480 }}>
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
                                            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                                <div className="selector-filter-row-v2">
                                                    <input type="text" placeholder="Search sprints..." className="selector-search-v2" style={{ maxWidth: 200, margin: 0 }} value={sprintSearch} onChange={e => setSprintSearch(e.target.value)} />
                                                    <select className="selector-filter-select-v2" value={sprintFilter} onChange={e => setSprintFilter(e.target.value)}>
                                                        <option value="all">All Status</option>
                                                        <option value="active">Active</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
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
                                                                    <div style={{ fontSize: 13, fontWeight: 500 }}>{sprint.name}</div>
                                                                    <div style={{ fontSize: 10, color: 'var(--m2)', marginTop: 2 }}>{sprint.state}</div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="selector-footer-v2">
                                            <button className="topbar-action-btn" onClick={() => setStep(1)}>{ic.back} Back</button>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{selectedSprints.length} selected</span>
                                                <button className="gen-continue-btn" onClick={() => setStep(3)} disabled={selectedSprints.length === 0}>
                                                    Continue {ic.arr}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Configure */}
                        {step === 3 && (
                            <div className="fu d1" style={{ maxWidth: 520 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Configure output</h3>
                                <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Fine-tune how your release notes are generated.</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                                    <div>
                                        <label className="gen-config-label">Release Title</label>
                                        <input
                                            value={releaseTitle}
                                            onChange={e => setReleaseTitle(e.target.value)}
                                            placeholder={`${source === 'github' ? 'GitHub' : source === 'jira' ? 'Jira' : 'DevRev'} Release Notes - ${new Date().toLocaleDateString()}`}
                                            className="gen-config-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="gen-config-label">Audience</label>
                                        <select
                                            className="gen-config-input"
                                            value={audience}
                                            onChange={e => setAudience(e.target.value)}
                                        >
                                            <option value="product">Product Team</option>
                                            <option value="qa">QA / Testing</option>
                                            <option value="stakeholder">Stakeholders</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="gen-config-label">Tone</label>
                                        <select
                                            className="gen-config-input"
                                            value={tone}
                                            onChange={e => setTone(e.target.value)}
                                        >
                                            <option value="professional">Professional</option>
                                            <option value="casual">Casual</option>
                                            <option value="technical">Technical</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="topbar-action-btn" onClick={() => setStep(2)}>{ic.back} Back</button>
                                    <button className="gen-generate-btn" onClick={handleGenerate} disabled={loading}>
                                        {loading ? (
                                            <><RefreshCw size={14} className="spin" /> Generating...</>
                                        ) : (
                                            <>{ic.spark} <span>Generate Release Notes</span></>
                                        )}
                                    </button>
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
