import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Search, Plus, Bell, Clock, CheckCircle2, ListTodo, MoreHorizontal,
    GitBranch, Users, Calendar, Square, CheckSquare, RefreshCw, Layers
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DataSelector from '../components/DataSelector';
import './Dashboard.css';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true
});

const Dashboard = () => {
    const navigate = useNavigate();

    // -- Global Dashboard State --
    const [view, setView] = useState('overview'); // 'overview' | 'generate'
    const [source, setSource] = useState('github'); // 'github' | 'devrev'
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

    // -- Shared Gen State --
    const [audience, setAudience] = useState(() => sessionStorage.getItem('shared_audience') || 'qa');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

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
                // Fetch User
                const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true });
                if (userRes.data && userRes.data.id) setUser(userRes.data);

                // Fetch Tokens
                const [ghRes, drRes] = await Promise.all([
                    api.get('/tokens/github').catch(() => ({ data: { hasToken: false } })),
                    api.get('/tokens/devrev').catch(() => ({ data: { hasToken: false } }))
                ]);

                if (!ghRes.data.hasToken && !drRes.data.hasToken) {
                    navigate('/integration');
                    return;
                }

                // Fetch Connected Integrations list
                try {
                    const tokensRes = await api.get('/tokens');
                    const services = tokensRes.data.services || [];
                    const formatted = services.map(s => {
                        if (s === 'github') return 'GitHub';
                        if (s === 'devrev') return 'DevRev';
                        return s.charAt(0).toUpperCase() + s.slice(1);
                    });
                    setConnectedIntegrations(formatted);
                } catch (e) {
                    console.error("Failed to fetch all tokens", e);
                }

                // Fetch Notes
                try {
                    const notesRes = await api.get('/notes');
                    setGeneratedNotes(notesRes.data.notes || []);
                    const countRes = await api.get('/notes/count');
                    setTotalNotesGenerated(countRes.data.count || 0);
                } catch (e) {
                    console.error("Failed to fetch notes", e);
                }

                // Default to first available source
                if (!ghRes.data.hasToken) setSource('devrev');

                // Load Data
                if (ghRes.data.hasToken) fetchRepos(selectedRepo, selectedBranch);
                if (drRes.data.hasToken) fetchBoards(selectedBoard);

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

    // --- Generation Logic ---
    const handleGenerate = async () => {
        setLoading(true);
        try {
            if (source === 'github') {
                const selectedObjects = commits.filter(c => selectedCommits.includes(c.id));
                const commitList = selectedObjects.map(pr => ({
                    commit: { message: `PR #${pr.number}: ${pr.title}`, author: { name: pr.user.login } }
                }));
                const genRes = await api.post('/generate', { commits: commitList, audience });
                sessionStorage.setItem('last_integration', 'github');
                navigate('/generate', { state: { notes: genRes.data.notes } });
            } else {
                const genRes = await api.post('/devrev/generate', { sprints: selectedSprints, audience });
                sessionStorage.setItem('last_integration', 'devrev');
                navigate('/generate', { state: { notes: genRes.data.notes } });
            }
        } catch (err) {
            console.error(err);
            alert('Failed to generate notes.');
        } finally {
            setLoading(false);
        }
    };

    // --- Formatting Helpers ---
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    const timeGreeting = today.getHours() < 12 ? 'Morning' : today.getHours() < 18 ? 'Afternoon' : 'Evening';
    const firstName = user?.name ? user.name.split(' ')[0] : 'User';

    // --- Mock Data for Overview ---
    const mockSchedule = [
        { id: 1, title: 'Release Planning Meeting', time: '01:00 PM to 02:30 PM', color: 'green' },
        { id: 2, title: 'Review DevRev Sprints', time: '04:00 PM to 04:30 PM', color: 'blue' },
        { id: 3, title: 'Align Stakeholders on v2.4', time: '05:00 PM to 06:00 PM', color: 'orange' },
    ];

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content-wrapper">
                {/* --- Top Bar --- */}
                <main className="dash-main">
                    {view === 'overview' ? (
                        <div className="overview-view">
                            <p className="date-subtitle">{formattedDate}</p>
                            <h1 className="greeting-title">Good {timeGreeting}! {firstName},</h1>

                            {/* Stats */}
                            <div className="stats-row">
                                <div className="stat-pill">
                                    <CheckCircle2 size={16} />
                                    <strong>{totalNotesGenerated}</strong> Notes Generated
                                </div>
                                <div className="stat-pill">
                                    <ListTodo size={16} />
                                    <strong>{connectedIntegrations.length}</strong> Connections added
                                    {connectedIntegrations.length > 0 && (
                                        <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '4px' }}>
                                            ({connectedIntegrations.join(', ')})
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Generated Notes Table */}
                            <div className="projects-section" style={{ marginTop: '24px' }}>
                                <div className="section-header">
                                    <div className="section-title">
                                        <ListTodo size={18} />
                                        <h3>Generated Notes</h3>
                                    </div>
                                    <button className="btn-primary-new" onClick={() => setView('generate')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                        <Plus size={16} /> Generate new note
                                    </button>
                                </div>

                                <table className="projects-table">
                                    <thead>
                                        <tr>
                                            <th>Note Title</th>
                                            <th>Source</th>
                                            <th>Audience</th>
                                            <th>Date Generated</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generatedNotes.length > 0 ? (
                                            generatedNotes.map(note => (
                                                <tr key={note.id}>
                                                    <td>
                                                        <div className="task-name-cell">
                                                            <Layers size={16} className="text-gray" />
                                                            {note.title}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${note.source === 'GitHub' ? 'blue' : 'purple'}`}>
                                                            {note.source}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', textTransform: 'capitalize' }}>
                                                            {note.audience || 'Product'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {new Date(note.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn-secondary-sm"
                                                            onClick={async () => {
                                                                try {
                                                                    const res = await api.get(`/notes/${note.id}`);
                                                                    navigate('/generate', { state: { notes: res.data.note.content } });
                                                                } catch (err) {
                                                                    console.error('Failed to fetch note content:', err);
                                                                    alert('Failed to load the release note.');
                                                                }
                                                            }}>
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                                                    No release notes found. Click "Generate new note" to get started!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="generate-view">
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                                <button className="btn-secondary-sm" onClick={() => setView('overview')} style={{ marginRight: '16px' }}>← Back to Overview</button>
                            </div>

                            <div className="generate-process-section">
                                <div className="generate-process-header">
                                    <h2>1. Select Source</h2>
                                    <p>Choose which source would you like to use for generation.</p>
                                </div>

                                <div className="radio-cards-container">
                                    <div
                                        className={`radio-card ${source === 'github' ? 'active' : ''}`}
                                        onClick={() => setSource('github')}
                                    >
                                        <div className="radio-card-radio"></div>
                                        <GitBranch size={24} />
                                        <span className="radio-card-label">GitHub</span>
                                    </div>
                                    <div
                                        className={`radio-card ${source === 'devrev' ? 'active' : ''}`}
                                        onClick={() => setSource('devrev')}
                                    >
                                        <div className="radio-card-radio"></div>
                                        <Layers size={24} />
                                        <span className="radio-card-label">DevRev</span>
                                    </div>
                                </div>
                            </div>

                            <div className="generate-process-section">
                                <div className="generate-process-header">
                                    <h2>2. Select Data & filter</h2>
                                </div>


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
                                        onGenerate={handleGenerate}
                                        loading={loadingData || loading}
                                        audience={audience}
                                        setAudience={setAudience}
                                        dateRange={dateRange}
                                        setDateRange={setDateRange}
                                    />
                                ) : (
                                    <div className="selector-card devrev-override">
                                        <div className="selector-sidebar">
                                            <div className="sidebar-header">
                                                <h3>Sprint Boards</h3>
                                                <input type="text" placeholder="Search boards..." className="dr-search" value={boardSearch} onChange={e => setBoardSearch(e.target.value)} />
                                            </div>
                                            <div className="repo-list">
                                                {filteredBoards.map(board => (
                                                    <div key={board.id} className={`repo-item ${selectedBoard?.id === board.id ? 'active' : ''}`} onClick={() => handleSelectBoard(board)}>
                                                        <Layers size={16} /> <span>{board.name || board.id}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="selector-main">
                                            <div className="filter-bar">
                                                <input type="text" placeholder="Search sprints..." className="dr-search dr-search-main" value={sprintSearch} onChange={e => setSprintSearch(e.target.value)} />
                                                <select className="pill-select" value={sprintFilter} onChange={e => setSprintFilter(e.target.value)}>
                                                    <option value="all">All Status</option>
                                                    <option value="active">Active</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                                <select className="pill-select" value={audience} onChange={e => setAudience(e.target.value)}>
                                                    <option value="qa">QA</option>
                                                    <option value="product">Product</option>
                                                    <option value="stakeholder">Stakeholder</option>
                                                </select>
                                            </div>
                                            <div className="commit-section">
                                                <div className="commit-list-header">
                                                    <div className="check-all" onClick={handleToggleAllSprints}>
                                                        {filteredSprints.length > 0 && filteredSprints.every(s => selectedSprints.find(sel => sel.id === s.id)) ? <CheckSquare size={18} className="icon-checked" /> : <Square size={18} className="icon-unchecked" />}
                                                        <span>Select All ({filteredSprints.length})</span>
                                                    </div>
                                                </div>
                                                <div className="commit-list">
                                                    {loadingData && sprints.length === 0 ? <div className="loading-state"><RefreshCw className="spin" /></div> : filteredSprints.map(sprint => {
                                                        const isSelected = !!selectedSprints.find(s => s.id === sprint.id);
                                                        return (
                                                            <div key={sprint.id} className={`commit-item ${isSelected ? 'selected' : ''}`} onClick={() => handleToggleSprint(sprint)}>
                                                                {isSelected ? <CheckSquare size={18} className="icon-checked" /> : <Square size={18} className="icon-unchecked" />}
                                                                <div className="commit-info">
                                                                    <span className="commit-msg">{sprint.name}</span>
                                                                    <span className="commit-meta">{sprint.state}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            <div className="selector-footer">
                                                <span className="selection-count">{selectedSprints.length} sprints selected</span>
                                                <button className="btn-primary" onClick={handleGenerate} disabled={selectedSprints.length === 0 || loading}>
                                                    {loading ? 'Generating...' : 'Generate Release Notes'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
