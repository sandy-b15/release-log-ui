export const providerColors = {
  Groq: '#f97316',
  OpenAI: '#10b981',
  Anthropic: '#d97706',
  Gemini: '#3b82f6',
};

export const providerModels = {
  Groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
  OpenAI: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
  Anthropic: ['claude-sonnet-4-5', 'claude-haiku-4-5'],
  Gemini: ['gemini-1.5-pro', 'gemini-1.5-flash'],
};

export function SourceBadge({ source }) {
  const m = { GitHub: 's-badge-green', Jira: 's-badge-blue', DevRev: 's-badge-purple' };
  return <span className={`s-badge ${m[source] || 's-badge-muted'}`}>{source}</span>;
}

export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{label}</div>
      <div className="ct-value">{payload[0].value.toLocaleString()} tokens</div>
    </div>
  );
}
