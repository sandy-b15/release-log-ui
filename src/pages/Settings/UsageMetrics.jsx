import { Sparkles, FileText, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { providerColors, SourceBadge, CustomTooltip } from './settingsData.jsx';

// Mock data — replace with API calls later
const usageHistory = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    tokens: Math.floor(Math.random() * 12000) + 1000,
  };
});

const generationLog = [
  { id: 1, date: 'Mar 12, 2026', title: 'v2.4.0 Release Notes', source: 'GitHub', provider: 'Anthropic', tokens: 3420, status: 'completed' },
  { id: 2, date: 'Mar 12, 2026', title: 'Sprint 14 Summary', source: 'Jira', provider: 'OpenAI', tokens: 2890, status: 'completed' },
  { id: 3, date: 'Mar 11, 2026', title: 'Q1 Feature Roundup', source: 'DevRev', provider: 'Groq', tokens: 4100, status: 'completed' },
  { id: 4, date: 'Mar 10, 2026', title: 'Hotfix Notes', source: 'GitHub', provider: 'Gemini', tokens: 1240, status: 'completed' },
  { id: 5, date: 'Mar 9, 2026', title: 'Backend Improvements', source: 'GitHub', provider: 'Anthropic', tokens: 2670, status: 'failed' },
];

const providerUsage = { Groq: 18200, OpenAI: 12400, Anthropic: 24600, Gemini: 8100 };
const totalProviderTokens = Object.values(providerUsage).reduce((a, b) => a + b, 0);

export default function UsageMetrics() {
  const totalTokens = usageHistory.reduce((s, d) => s + d.tokens, 0);
  const avgTokens = Math.round(totalTokens / generationLog.length);

  return (
    <div className="tab-content" style={{ position: 'relative' }}>
      <div className="coming-soon-overlay">
        <div className="coming-soon-label">Coming Soon</div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label"><Sparkles size={14} /> Total Tokens Used</div>
          <div className="stat-value">{totalProviderTokens.toLocaleString()}</div>
          <div className="stat-sub">This month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><FileText size={14} /> Generations</div>
          <div className="stat-value">{generationLog.length}</div>
          <div className="stat-sub">This month</div>
        </div>
        <div className="stat-card">
          <div className="stat-label"><TrendingUp size={14} /> Avg Tokens / Gen</div>
          <div className="stat-value">{avgTokens.toLocaleString()}</div>
          <div className="stat-sub">Per generation</div>
        </div>
      </div>

      {/* Provider breakdown */}
      <div className="s-card" style={{ marginBottom: 20 }}>
        <div className="section-title">Usage by Provider</div>
        <div className="section-desc">Token distribution across AI providers</div>
        <div className="provider-bar-track">
          {Object.entries(providerUsage).map(([name, val]) => (
            <div key={name} className="provider-bar-seg" style={{ width: `${(val / totalProviderTokens) * 100}%`, background: providerColors[name] }} />
          ))}
        </div>
        <div className="provider-legend">
          {Object.entries(providerUsage).map(([name, val]) => (
            <div className="provider-legend-item" key={name}>
              <span className="provider-dot" style={{ background: providerColors[name] }} />
              {name}: {val.toLocaleString()} ({Math.round((val / totalProviderTokens) * 100)}%)
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="s-card" style={{ marginBottom: 20 }}>
        <div className="section-title">Token Usage — Last 30 Days</div>
        <div className="section-desc">Daily token consumption across all providers</div>
        <div style={{ width: '100%', height: 260, marginTop: 12 }}>
          <ResponsiveContainer>
            <AreaChart data={usageHistory}>
              <defs>
                <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1c1917" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#1c1917" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eeeeed" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a8a29e' }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: '#a8a29e' }} tickLine={false} axisLine={false} width={50} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="tokens" stroke="#1c1917" strokeWidth={2} fill="url(#tGrad)" dot={false} activeDot={{ r: 4, fill: '#1c1917' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Generation Log */}
      <div className="s-card">
        <div className="section-title">Generation Log</div>
        <div className="section-desc">Recent AI generation activity</div>
        <div className="s-table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Title</th><th>Source</th><th>Provider</th><th>Tokens</th><th>Status</th></tr></thead>
            <tbody>{generationLog.map(g => (
              <tr key={g.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{g.date}</td>
                <td style={{ fontWeight: 500, color: 'var(--text)' }}>{g.title}</td>
                <td><SourceBadge source={g.source} /></td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span className="provider-dot" style={{ background: providerColors[g.provider] }} />
                    {g.provider}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{g.tokens.toLocaleString()}</td>
                <td><span className={`s-badge ${g.status === 'completed' ? 's-badge-green' : 's-badge-red'}`}>{g.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
