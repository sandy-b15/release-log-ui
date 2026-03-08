import React, { useState } from 'react';
import { Github } from 'lucide-react';

const Connect = ({ onConnect }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConnect(token);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Github size={32} />
        <h2>Connect to GitHub</h2>
      </div>
      <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>
        Enter your Personal Access Token (PAT) to access your private repositories. 
        We don't store this token.
      </p>
      <form onSubmit={handleSubmit}>
        <label className="label">GitHub Personal Access Token</label>
        <input 
          type="password" 
          placeholder="ghp_..." 
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <button type="submit" style={{ width: '100%' }}>Connect</button>
      </form>
      <p style={{ fontSize: '0.8em', marginTop: '10px', color: '#64748b' }}>
        Don't have a token? <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}>Generate one here</a>.
      </p>
    </div>
  );
};

export default Connect;
