import React from 'react';

const Selector = ({ repos, branches, onSelect, loading }) => {
  const [selectedRepo, setSelectedRepo] = React.useState('');
  const [selectedBranch, setSelectedBranch] = React.useState('');
  const [audience, setAudience] = React.useState('product');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  const handleRepoChange = (e) => {
    const repo = e.target.value;
    setSelectedRepo(repo);
    onSelect('repo', repo);
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleGenerate = () => {
    onSelect('generate', {
      repo: selectedRepo,
      branch: selectedBranch,
      audience,
      startDate,
      endDate
    });
  };

  return (
    <div className="card">
      <h2>Select Data</h2>

      <label className="label">Repository</label>
      <select value={selectedRepo} onChange={handleRepoChange} disabled={loading}>
        <option value="">Select a repository</option>
        {repos.map((repo) => (
          <option key={repo.id} value={repo.full_name}>{repo.full_name}</option>
        ))}
      </select>

      {selectedRepo && (
        <>
          <label className="label">Branch</label>
          <select value={selectedBranch} onChange={handleBranchChange} disabled={loading}>
            <option value="">Select a branch</option>
            {branches.map((branch) => (
              <option key={branch.name} value={branch.name}>{branch.name}</option>
            ))}
          </select>

          <label className="label">Date Range (Optional)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label className="label" style={{ fontSize: '0.85em', marginTop: '5px' }}>From</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="label" style={{ fontSize: '0.85em', marginTop: '5px' }}>To</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </>
      )}

      <label className="label">Target Audience</label>
      <select value={audience} onChange={(e) => setAudience(e.target.value)}>
        <option value="product">Product Team / Executives (Summary)</option>
        <option value="qa">QA / Testing Team (Detailed)</option>
      </select>

      <button
        onClick={handleGenerate}
        disabled={!selectedRepo || !selectedBranch || loading}
        style={{ width: '100%', marginTop: '20px' }}
      >
        {loading ? 'Generating...' : 'Generate Release Notes'}
      </button>
    </div>
  );
};

export default Selector;
