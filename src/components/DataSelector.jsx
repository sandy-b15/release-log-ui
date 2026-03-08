
import React, { useState, useEffect, useRef } from 'react';
import { Book, GitBranch, Calendar, Users, Square, CheckSquare, RefreshCw, ChevronDown } from 'lucide-react';
import './DataSelector.css';

// Custom dropdown component
const LucideDropdown = ({ icon: Icon, label, value, displayValue, options, onChange, disabled, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="lucide-dropdown" ref={ref}>
            <label><Icon size={14} /> {label}</label>
            <button
                className={`dropdown-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                type="button"
            >
                <span className={value ? '' : 'placeholder'}>{displayValue || placeholder}</span>
                <ChevronDown size={14} className={`chevron ${isOpen ? 'rotated' : ''}`} />
            </button>
            {isOpen && (
                <div className="dropdown-options">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            className={`dropdown-option ${value === opt.value ? 'selected' : ''}`}
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                            type="button"
                        >
                            {opt.label}
                        </button>
                    ))}
                    {options.length === 0 && (
                        <div className="dropdown-empty">No options available</div>
                    )}
                </div>
            )}
        </div>
    );
};

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
    audience,
    setAudience,
    dateRange,
    setDateRange
}) => {

    const branchOptions = branches.map(b => ({ value: b.name, label: b.name }));
    const audienceOptions = [
        { value: 'product', label: 'Product Team' },
        { value: 'qa', label: 'QA / Testing' },
        { value: 'stakeholder', label: 'Stakeholders' },
    ];

    const audienceLabel = audienceOptions.find(a => a.value === audience)?.label || '';

    return (
        <div className="selector-container">
            <div className="selector-card">
                {/* Left Sidebar: Repositories */}
                <div className="selector-sidebar">
                    <div className="sidebar-header">
                        <h3>Repositories</h3>
                    </div>
                    <div className="repo-list">
                        {repos.map(repo => (
                            <div
                                key={repo.id}
                                className={`repo-item ${selectedRepo === repo.full_name ? 'active' : ''}`}
                                onClick={() => !loading && onSelectRepo(repo.full_name)}
                            >
                                <Book size={18} />
                                <span className="repo-name">{repo.name}</span>
                            </div>
                        ))}
                        {repos.length === 0 && <div className="empty-state">No repositories found</div>}
                    </div>
                </div>

                {/* Right Panel: Filters & Commits */}
                <div className="selector-main">
                    {/* Top Filters Bar */}
                    <div className="filter-bar">
                        <LucideDropdown
                            icon={GitBranch}
                            label="Branch"
                            value={selectedBranch}
                            displayValue={selectedBranch}
                            options={branchOptions}
                            onChange={onSelectBranch}
                            disabled={!selectedRepo || loading}
                            placeholder="Select Branch"
                        />

                        <div className="lucide-dropdown">
                            <label><Calendar size={14} /> Date Range</label>
                            <div className="date-range-inputs">
                                <input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                    disabled={!selectedRepo || loading}
                                    className="date-input"
                                />
                                <span className="date-separator">to</span>
                                <input
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                    disabled={!selectedRepo || loading}
                                    className="date-input"
                                />
                            </div>
                        </div>

                        <LucideDropdown
                            icon={Users}
                            label="Audience"
                            value={audience}
                            displayValue={audienceLabel}
                            options={audienceOptions}
                            onChange={setAudience}
                            disabled={false}
                            placeholder="Select Audience"
                        />
                    </div>

                    {/* Commit List Area */}
                    <div className="commit-section">
                        {loading && commits.length === 0 ? (
                            <div className="loading-state">
                                <RefreshCw className="spin" size={24} />
                                <span>Fetching PRs...</span>
                            </div>
                        ) : !selectedBranch ? (
                            <div className="empty-state-large">
                                Select a repository and branch to view PRs.
                            </div>
                        ) : (
                            <>
                                <div className="commit-list-header">
                                    <div className="check-all" onClick={onToggleAll}>
                                        {selectedCommits.length === commits.length && commits.length > 0 ? (
                                            <CheckSquare size={18} className="icon-checked" />
                                        ) : (
                                            <Square size={18} className="icon-unchecked" />
                                        )}
                                        <span>Select All ({commits.length})</span>
                                    </div>
                                </div>
                                <div className="commit-list">
                                    {commits.length === 0 ? (
                                        <div className="empty-state" style={{ textAlign: 'center', marginTop: '20px' }}>No PRs found in currently selected range/branch.</div>
                                    ) : (
                                        commits.map((pr) => {
                                            const isSelected = selectedCommits.includes(pr.id);
                                            return (
                                                <div
                                                    key={pr.id}
                                                    className={`commit-item ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => onToggleCommit(pr.id)}
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare size={18} className="icon-checked" />
                                                    ) : (
                                                        <Square size={18} className="icon-unchecked" />
                                                    )}
                                                    <div className="commit-info">
                                                        <span className="commit-msg">#{pr.number}: {pr.title}</span>
                                                        <span className="commit-meta">
                                                            {pr.user.login} • {new Date(pr.merged_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="selector-footer">
                        <div className="selection-count">
                            {selectedCommits.length} selected
                        </div>
                        <button
                            className="btn-primary"
                            onClick={onGenerate}
                            disabled={selectedCommits.length === 0 || loading}
                        >
                            {loading ? 'Generating...' : 'Generate Release Notes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataSelector;
