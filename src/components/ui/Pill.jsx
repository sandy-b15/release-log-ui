const colorMap = {
  indigo: ['var(--il)', 'var(--it)'],
  emerald: ['var(--el)', 'var(--et)'],
  sky: ['var(--sl)', 'var(--st)'],
  amber: ['var(--al)', 'var(--at)'],
  rose: ['var(--rl)', 'var(--rt)'],
  violet: ['var(--vl)', 'var(--vt)'],
  orange: ['var(--ol)', 'var(--ot)'],
  neutral: ['var(--s1)', 'var(--muted)'],
};

const Pill = ({ children, color = 'indigo' }) => {
  const [bg, c] = colorMap[color] || colorMap.indigo;
  return (
    <span style={{
      display: 'inline-flex',
      padding: '3px 9px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 600,
      background: bg,
      color: c,
      letterSpacing: '.01em',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
};

export default Pill;
