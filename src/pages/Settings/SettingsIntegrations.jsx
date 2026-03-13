import { useState, useEffect } from 'react';
import { Link2, Clock, FileText, RefreshCw, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import devrevLogo from '../../assets/devrev-logo.webp';
import jiraLogo from '../../assets/jira_logo.webp';
import api from '../../lib/api';

const integrationDefs = [
  {
    key: 'github',
    name: 'GitHub',
    desc: 'Pull commits, PRs, and releases from repositories',
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
    renderIcon: () => <Github size={22} />,
  },
  {
    key: 'jira',
    name: 'Jira',
    desc: 'Import issues via Fix Versions and JQL queries',
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    renderIcon: () => <img src={jiraLogo} alt="Jira" style={{ width: 24, height: 24, objectFit: 'contain' }} />,
  },
  {
    key: 'devrev',
    name: 'DevRev',
    desc: 'Sync sprint data and work items for release notes',
    iconBg: '#f5f3ff',
    iconColor: '#7c3aed',
    renderIcon: () => <img src={devrevLogo} alt="DevRev" style={{ width: 24, height: 24, objectFit: 'contain' }} />,
  },
];

export default function SettingsIntegrations() {
  const [connections, setConnections] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/tokens');
        const map = {};
        (res.data || []).forEach(t => { map[t.service] = true; });
        setConnections(map);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to load integrations');
      }
    }
    load();
  }, []);

  return (
    <div className="tab-content">
      <div className="section-title">Connected Services</div>
      <div className="section-desc">Manage data sources for generating release notes</div>
      <div className="integrations-grid">
        {integrationDefs.map(int => {
          const connected = !!connections[int.key];
          return (
            <div className="int-card" key={int.key}>
              <div className="int-icon" style={{ background: int.iconBg, color: int.iconColor }}>
                {int.renderIcon()}
              </div>
              <div className="int-body">
                <div className="int-name">
                  {int.name}
                  {connected && <span className="s-badge s-badge-green" style={{ fontSize: 10 }}>Connected</span>}
                </div>
                <div className="int-desc">{int.desc}</div>
                {connected && (
                  <div className="int-meta">
                    <span className="int-meta-item"><Clock size={12} /> Connected</span>
                  </div>
                )}
                <div style={{ marginTop: 12 }}>
                  {connected ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary btn-sm"><RefreshCw size={12} /> Sync</button>
                      <button className="btn btn-danger btn-sm">Disconnect</button>
                    </div>
                  ) : (
                    <button className="btn btn-primary btn-sm"><Link2 size={12} /> Connect</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
