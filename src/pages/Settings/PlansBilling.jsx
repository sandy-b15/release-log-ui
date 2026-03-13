import { useState, useEffect } from 'react';
import { Check, Zap, Star, Users, ExternalLink, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEntitlements } from '../../hooks/useEntitlements';
import { useRazorpay } from '../../hooks/useRazorpay';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import api, { authApi } from '../../lib/api';
import { buildFeatures } from '../../lib/planFeatures';

function detectCurrency() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) return 'INR';
  } catch {}
  return 'USD';
}

const planIcons = { free: <Zap size={20} />, pro: <Star size={20} />, team: <Users size={20} /> };
const planColors = { free: '#e7e5e4', pro: '#1c1917', team: '#4f46e5' };

const statusColors = {
  active: 's-badge-green',
  trialing: 's-badge-blue',
  past_due: 's-badge-red',
  cancelled: 's-badge-red',
};

export default function PlansBilling() {
  const { plan, entitlements, usage, subscription: entSub, canUse, refetch: refetchEntitlements } = useEntitlements();
  const { openCheckout } = useRazorpay();
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [billing, setBilling] = useState({ billingName: '', billingEmail: '', billingPhone: '', billingAddress: '' });
  const [invoices, setInvoices] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingSaving, setBillingSaving] = useState(false);
  const [subscribing, setSubscribing] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [currency] = useState(detectCurrency);

  useEffect(() => {
    async function load() {
      try {
        const [plansRes, subRes, billRes, invRes, meRes] = await Promise.all([
          api.get('/plans'),
          api.get('/plans/my-subscription'),
          api.get('/plans/billing'),
          api.get('/plans/invoices'),
          authApi.get('/auth/me'),
        ]);
        setPlans(plansRes.data || []);
        setSubscription(subRes.data);
        if (meRes.data) setUser(meRes.data);
        if (billRes.data) {
          setBilling({
            billingName: billRes.data.billing_name || '',
            billingEmail: billRes.data.billing_email || '',
            billingPhone: billRes.data.billing_phone || '',
            billingAddress: billRes.data.billing_address || '',
          });
        }
        setInvoices(invRes.data || []);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to load plans data');
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSubscribe = async (selectedPlan) => {
    setSubscribing(selectedPlan.slug);
    try {
      if (selectedPlan.slug === 'free') {
        await api.post('/plans/subscribe', { planSlug: 'free' });
        await refetchEntitlements();
        toast.success('Switched to Free plan');
      } else {
        const { data } = await api.post('/billing/create-order', {
          planSlug: selectedPlan.slug,
          interval: 'monthly',
          currency,
        });
        const paymentResult = await openCheckout({
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency,
          rzKeyId: data.rzKeyId,
          planName: selectedPlan.display_name,
          userEmail: user?.email || '',
          userName: user?.name || '',
        });
        await api.post('/billing/verify-payment', paymentResult);
        await refetchEntitlements();
        toast.success(`Upgraded to ${selectedPlan.display_name}!`);
      }
    } catch (err) {
      if (err.message !== 'Payment cancelled') {
        toast.error(err.response?.data?.error || 'Failed to subscribe');
      }
    } finally {
      setSubscribing(null);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelConfirm(false);
    try {
      const { data } = await api.post('/billing/cancel-subscription');
      const endDate = data.endsAt
        ? new Date(data.endsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'end of billing period';
      toast.success(`Subscription cancelled. Access continues until ${endDate}.`);
      await refetchEntitlements();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to cancel subscription');
    }
  };

  const handleSaveBilling = async () => {
    setBillingSaving(true);
    try {
      await api.put('/plans/billing', billing);
      toast.success('Billing details saved');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save billing');
    } finally {
      setBillingSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="tab-content" style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <Loader2 size={24} className="spin" style={{ color: 'var(--muted)' }} />
      </div>
    );
  }

  const currentPlanSlug = plan?.slug || subscription?.plan_name || 'free';

  return (
    <div className="tab-content">
      <div className="section-title">Choose a Plan</div>
      <div className="section-desc">Select the plan that fits your workflow</div>
      <div className="plans-grid">
        {plans.map(p => {
          const isActive = p.slug === currentPlanSlug;
          const color = planColors[p.slug] || '#888';
          const icon = planIcons[p.slug] || <Zap size={20} />;
          const features = buildFeatures(p.entitlements);
          const priceRaw = currency === 'INR' ? p.price_inr_monthly : p.price_usd_monthly;
          const price = (priceRaw != null && !isNaN(priceRaw)) ? priceRaw / 100 : 0;
          const symbol = currency === 'INR' ? '₹' : '$';
          const isComingSoon = p.status === 'coming_soon';

          return (
            <div className={`plan-card${isActive ? ' active' : ''}`} key={p.slug} style={isComingSoon ? { opacity: 0.6 } : undefined}>
              {isActive && <div className="current-badge">Current</div>}
              <div className="plan-icon" style={{ background: isActive ? color : '#f5f5f4', color: isActive ? '#fff' : '#78716c' }}>{icon}</div>
              <div className="plan-name">{p.display_name}</div>
              <div className="plan-price">{symbol}{price}<span>/month</span></div>
              <ul className="plan-features">
                {features.map(f => <li key={f.text}><Check /> {f.text}</li>)}
              </ul>
              {isComingSoon ? (
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }} disabled>Coming Soon</button>
              ) : isActive ? (
                p.slug !== 'free' ? (
                  <button
                    className="btn btn-danger"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                    onClick={() => setCancelConfirm(true)}
                  >
                    Cancel Subscription
                  </button>
                ) : (
                  <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>Current Plan</button>
                )
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                  onClick={() => handleSubscribe(p)}
                  disabled={subscribing === p.slug}
                >
                  {subscribing === p.slug ? <Loader2 size={14} className="spin" /> : null}
                  {price > 0 ? 'Upgrade' : 'Switch'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Usage Section */}
      <div style={{ maxWidth: 640, marginBottom: 20 }}>
        <div className="s-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div className="section-title">Usage</div>
              <div className="section-desc">Your current usage this billing period</div>
            </div>
            {entSub?.status && (
              <span className={`s-badge ${statusColors[entSub.status] || 's-badge-gray'}`} style={{ textTransform: 'capitalize' }}>
                {entSub.status === 'past_due' ? 'Past Due' : entSub.status}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span className="form-label" style={{ margin: 0 }}>Generations</span>
                <span style={{ color: 'var(--muted)', fontSize: 12 }}>
                  {usage?.generations_this_month ?? 0} / {entitlements?.max_generations_per_month === -1 ? '\u221e' : (entitlements?.max_generations_per_month ?? 0)}
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  borderRadius: 4,
                  background: 'var(--indigo)',
                  width: entitlements?.max_generations_per_month === -1
                    ? '5%'
                    : `${Math.min(100, ((usage?.generations_this_month ?? 0) / (entitlements?.max_generations_per_month || 1)) * 100)}%`,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span className="form-label" style={{ margin: 0 }}>Projects</span>
                <span style={{ color: 'var(--muted)', fontSize: 12 }}>
                  {usage?.projects_count ?? 0} / {entitlements?.max_projects === -1 ? '\u221e' : (entitlements?.max_projects ?? 0)}
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  borderRadius: 4,
                  background: 'var(--indigo)',
                  width: entitlements?.max_projects === -1
                    ? '5%'
                    : `${Math.min(100, ((usage?.projects_count ?? 0) / (entitlements?.max_projects || 1)) * 100)}%`,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640 }}>
        <div className="s-card" style={{ marginBottom: 20 }}>
          <div className="section-title">Billing Details</div>
          <div className="section-desc">Manage your billing information</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Billing Name</label>
              <input className="form-input" placeholder="Full name" value={billing.billingName} onChange={e => setBilling(b => ({ ...b, billingName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Billing Email</label>
              <input className="form-input" placeholder="billing@company.com" value={billing.billingEmail} onChange={e => setBilling(b => ({ ...b, billingEmail: e.target.value }))} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" placeholder="+1 (555) 000-0000" value={billing.billingPhone} onChange={e => setBilling(b => ({ ...b, billingPhone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" placeholder="Billing address" value={billing.billingAddress} onChange={e => setBilling(b => ({ ...b, billingAddress: e.target.value }))} />
            </div>
          </div>
          {subscription?.renews_at && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
              <span>Next billing: <strong style={{ color: 'var(--text)' }}>{new Date(subscription.renews_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></span>
            </div>
          )}
          <button className="btn btn-primary" onClick={handleSaveBilling} disabled={billingSaving}>
            {billingSaving ? <Loader2 size={14} className="spin" /> : <Check size={14} />} Save Billing
          </button>
        </div>

        {invoices.length > 0 && (
          <div className="s-card">
            <div className="section-title">Invoice History</div>
            <div className="section-desc">Your billing history</div>
            <div className="s-table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Amount</th><th>Status</th><th></th></tr></thead>
                <tbody>{invoices.map((inv, i) => (
                  <tr key={i}>
                    <td>{new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td style={{ fontWeight: 500 }}>${Number(inv.amount).toFixed(2)}</td>
                    <td><span className={`s-badge ${inv.status === 'active' ? 's-badge-green' : 's-badge-red'}`}>{inv.status === 'active' ? 'Paid' : inv.status}</span></td>
                    <td>{inv.invoice_link && <a href={inv.invoice_link} target="_blank" rel="noreferrer"><button className="btn btn-icon"><Download /></button></a>}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={cancelConfirm}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your subscription? You will retain access until the end of your current billing period."
        confirmLabel="Cancel Subscription"
        onConfirm={handleCancelSubscription}
        onCancel={() => setCancelConfirm(false)}
      />
    </div>
  );
}
