
import { useState, useEffect, useRef } from 'react';
import { Square, CheckSquare, RefreshCw } from 'lucide-react';
import './DataSelector.css';

const BackIcon = () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M11 6.5H2m0 0L5.5 3M2 6.5L5.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const ArrowIcon = () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M2 6.5h9m0 0L7.5 3m3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const DataSelector = ({
    repos,
    selectedRepo,
    onSelectRepo,
    branches,
    selectedBranch,
    onSelectBranch,
    commits,
    selectedCommits,
    onToggleCommit,
    onToggleAll,
    onGenerate,
    loading,
    dateRange,
    setDateRange,
    onBack,
    showBackButton,
}) => {
    return (
        <div className="selector-card-v2">
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', height: 480 }}>
                {/* Repos sidebar */}
                <div className="selector-sidebar-v2" style={{ overflowY: 'auto' }}>
                    <div className="selector-sidebar-header-v2">Repositories</div>
                    <div style={{ padding: '4px 10px' }}>
                        {repos.map(repo => (
                            <button
                                key={repo.id}
                                className={`selector-repo-btn-v2 ${selectedRepo === repo.full_name ? 'active' : ''}`}
                                onClick={() => !loading && onSelectRepo(repo.full_name)}
                            >
                                {repo.name}
                            </button>
                        ))}
                        {repos.length === 0 && (
                            <div style={{ padding: 12, textAlign: 'center', fontSize: 12, color: 'var(--m2)' }}>No repositories found</div>
                        )}
                    </div>
                </div>

                {/* Main panel */}
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Filters */}
                    <div className="selector-filter-row-v2" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-l)' }}>
                        <div>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--m2)', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.06em' }}>Branch</label>
                            <select
                                className="selector-filter-select-v2"
                                value={selectedBranch}
                                onChange={(e) => onSelectBranch(e.target.value)}
                                disabled={!selectedRepo || loading}
                                style={{ margin: 0 }}
                            >
                                <option value="">Select branch</option>
                                {branches.map(b => (
                                    <option key={b.name} value={b.name}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--m2)', display: 'block', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '.06em' }}>Date Range</label>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                <input
                                    type="date"
                                    className="selector-date-input-v2"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                    disabled={!selectedRepo || loading}
                                />
                                <span style={{ fontSize: 10, color: 'var(--m2)' }}>to</span>
                                <input
                                    type="date"
                                    className="selector-date-input-v2"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                    disabled={!selectedRepo || loading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Commit list */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px' }}>
                        {loading && commits.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--indigo)', gap: 12 }}>
                                <RefreshCw className="spin" size={24} />
                                <span style={{ fontSize: 13, color: 'var(--muted)' }}>Fetching PRs...</span>
                            </div>
                        ) : !selectedBranch ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--m2)', fontSize: 13 }}>
                                Select a repository and branch to view PRs.
                            </div>
                        ) : (
                            <>
                                <div className="selector-list-header-v2" onClick={onToggleAll} style={{ padding: '8px 0 10px' }}>
                                    {selectedCommits.length === commits.length && commits.length > 0
                                        ? <CheckSquare size={18} style={{ color: 'var(--emerald)' }} />
                                        : <Square size={18} style={{ color: 'var(--m2)' }} />
                                    }
                                    <span>Select All ({commits.length})</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {commits.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: 20, fontSize: 13, color: 'var(--m2)' }}>No PRs found in selected range/branch.</div>
                                    ) : commits.map((pr) => {
                                        const isSelected = selectedCommits.includes(pr.id);
                                        return (
                                            <div
                                                key={pr.id}
                                                className={`selector-item-v2 ${isSelected ? 'selected' : ''}`}
                                                onClick={() => onToggleCommit(pr.id)}
                                            >
                                                <div className={`selector-checkbox-v2 ${isSelected ? 'checked' : ''}`}>
                                                    {isSelected && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                                                        <span style={{ color: 'var(--indigo)', fontFamily: 'var(--mono)', fontSize: 11, marginRight: 4 }}>#{pr.number}</span>
                                                        {pr.title}
                                                    </div>
                                                    <div style={{ fontSize: 10, color: 'var(--m2)', marginTop: 2 }}>
                                                        {pr.user.login} · {new Date(pr.merged_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="selector-footer-v2">
                {showBackButton && (
                    <button className="btn btn-secondary" onClick={onBack}>
                        <BackIcon /> Back
                    </button>
                )}
                {!showBackButton && <div />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{selectedCommits.length} selected</span>
                    <button
                        className="btn btn-primary"
                        onClick={onGenerate}
                        disabled={selectedCommits.length === 0 || loading}
                    >
                        {loading ? 'Processing...' : <>Continue <ArrowIcon /></>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataSelector;
