import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useEntitlements } from '../../hooks/useEntitlements';

export default function ExpiryBanner() {
  const { isExpiringSoon, isGracePeriod, daysRemaining, subscription } = useEntitlements();
  const navigate = useNavigate();

  if (!isExpiringSoon && !isGracePeriod) return null;

  let message = '';
  let variant = 'warning'; // 'warning' or 'danger'

  if (isGracePeriod) {
    variant = 'danger';
    message = daysRemaining != null
      ? `Payment failed. Update your payment method within ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} to avoid losing Pro features.`
      : 'Payment failed. Update your payment method to avoid losing Pro features.';
  } else if (subscription?.status === 'trialing') {
    message = daysRemaining != null
      ? `Your trial ends in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Add a payment method to keep Pro access.`
      : 'Your trial is ending soon. Add a payment method to keep Pro access.';
  } else if (subscription?.cancelled_at) {
    message = daysRemaining != null
      ? `Your Pro plan expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`
      : 'Your Pro plan is expiring soon.';
  } else {
    message = 'Your subscription needs attention.';
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 20px',
      borderRadius: 'var(--rs)',
      margin: '0 0 16px',
      fontSize: 13,
      fontWeight: 500,
      background: variant === 'danger' ? 'var(--rl)' : 'var(--al)',
      color: variant === 'danger' ? 'var(--rt)' : 'var(--at)',
      border: `1px solid ${variant === 'danger' ? 'var(--rose)' : 'var(--amber)'}`,
    }}>
      <AlertTriangle size={16} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{message}</span>
      <button
        className="btn btn-sm"
        style={{
          background: variant === 'danger' ? 'var(--rose)' : 'var(--amber)',
          color: '#fff',
          border: 'none',
          flexShrink: 0,
        }}
        onClick={() => navigate('/settings')}
      >
        Manage billing
      </button>
    </div>
  );
}
