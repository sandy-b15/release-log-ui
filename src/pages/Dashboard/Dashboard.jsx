import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { RefreshCw, Square, CheckSquare, Trash2 } from 'lucide-react';
import TopBar from '../../components/Header/Header';
import DataSelector from '../../components/DataSelector/DataSelector';
import Pill from '../../components/ui/Pill';
import StepIndicator from '../../components/ui/StepIndicator';
import devrevLogo from '../../assets/devrev-logo.webp';
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

                const [ghRes, drRes] = await Promise.all([
                    api.get('/tokens/github').catch(() => ({ data: { hasToken: false } })),
                    api.get('/tokens/devrev').catch(() => ({ data: { hasToken: false } }))
                ]);

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

                try {
                    const notesRes = await api.get('/notes');
                    setGeneratedNotes(notesRes.data.notes || []);
                    const countRes = await api.get('/notes/count');
                    setTotalNotesGenerated(countRes.data.count || 0);
                } catch (e) {
                    console.error("Failed to fetch notes", e);
                }

                if (!ghRes.data.hasToken) setSource('devrev');
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
                const title = releaseTitle || `GitHub Release Notes - ${new Date().toLocaleDateString()}`;
                const genRes = await api.post('/generate', { commits: commitList, audience, title, tone });
                sessionStorage.setItem('last_integration', 'github');
                navigate('/generate', { state: { notes: genRes.data.notes, noteId: genRes.data.noteId, noteTitle: genRes.data.title } });
            } else {
                const title = releaseTitle || `DevRev Release Notes - ${new Date().toLocaleDateString()}`;
                const genRes = await api.post('/devrev/generate', { sprints: selectedSprints, audience, title, tone });
                sessionStorage.setItem('last_integration', 'devrev');
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
                                                    <Pill color={note.source === 'GitHub' ? 'sky' : 'emerald'}>{note.source}</Pill>
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
                                            Generate your first release note from GitHub or DevRev data.
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
                                            placeholder={`${source === 'github' ? 'GitHub' : 'DevRev'} Release Notes - ${new Date().toLocaleDateString()}`}
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
