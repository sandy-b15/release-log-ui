const CheckIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
    <path d="M2 6.5l3 3 5-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="13" height="13" fill="none" viewBox="0 0 13 13">
    <path d="M2 6.5h9m0 0L7.5 3m3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StepIndicator = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="fu" style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <div
            onClick={() => !s.disabled && onStepClick?.(s.n)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 20px',
              borderRadius: 10,
              cursor: s.disabled ? 'not-allowed' : 'pointer',
              transition: 'all .15s',
              opacity: s.disabled ? 0.45 : 1,
              background: currentStep === s.n ? 'var(--primary)' : currentStep > s.n ? 'var(--white)' : 'var(--white)',
              border: currentStep === s.n ? 'none' : '1px solid var(--border-l)',
            }}
          >
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              background: currentStep > s.n ? 'var(--emerald)' : 'transparent',
              color: currentStep === s.n ? 'var(--pt)' : currentStep > s.n ? '#fff' : 'var(--muted)',
            }}>
              {currentStep > s.n ? <CheckIcon /> : s.n}
            </div>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: currentStep === s.n ? 'var(--pt)' : currentStep > s.n ? 'var(--muted)' : 'var(--muted)',
            }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 32, height: 1, background: 'var(--border)', margin: '0 4px' }} />
          )}
        </div>
      ))}
    </div>
  );
};

export { ArrowIcon, CheckIcon };
export default StepIndicator;
