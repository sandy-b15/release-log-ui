import { useState, useEffect } from 'react';
import { Check, Zap, Star, Users, ExternalLink, Download, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = `${import.meta.env.VITE_API_URL}/api`;
const api = axios.create({ baseURL: API, withCredentials: true });

const planIcons = { free: <Zap size={20} />, pro: <Star size={20} />, team: <Users size={20} /> };
const planColors = { free: '#e7e5e4', pro: '#1c1917', team: '#4f46e5' };

export default function PlansBilling() {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [billing, setBilling] = useState({ billingName: '', billingEmail: '', billingPhone: '', billingAddress: '' });
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingSaving, setBillingSaving] = useState(false);
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [plansRes, subRes, billRes, invRes] = await Promise.all([
          api.get('/plans'),
          api.get('/plans/my-subscription'),
          api.get('/plans/billing'),
          api.get('/plans/invoices'),
        ]);
        setPlans(plansRes.data || []);
        setSubscription(subRes.data);
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

  const handleSubscribe = async (planId) => {
    setSubscribing(planId);
    try {
      const { data } = await api.post('/plans/subscribe', { planId });
      setSubscription(data);
      toast.success(`Switched to ${data.plan_name} plan`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to subscribe');
    } finally {
      setSubscribing(null);
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

  const currentPlanName = subscription?.plan_name || 'free';

  return (
    <div className="tab-content">
      <div className="section-title">Choose a Plan</div>
      <div className="section-desc">Select the plan that fits your workflow</div>
      <div className="plans-grid">
        {plans.map(p => {
          const isActive = p.name === currentPlanName;
          const color = planColors[p.name] || '#888';
          const icon = planIcons[p.name] || <Zap size={20} />;
          const features = Array.isArray(p.features) ? p.features : [];
          // Add limit descriptions
          const limits = [];
          if (p.max_generations === -1) limits.push('Unlimited generations');
          else limits.push(`${p.max_generations} generations/month`);
          limits.push(`${p.max_integrations} integration${p.max_integrations !== 1 ? 's' : ''}`);
          if (p.max_channels > 0) limits.push(`${p.max_channels} publish channels`);
          const allFeatures = [...limits, ...features];

          return (
            <div className={`plan-card${isActive ? ' active' : ''}`} key={p.id}>
              {isActive && <div className="current-badge">Current</div>}
              <div className="plan-icon" style={{ background: isActive ? color : '#f5f5f4', color: isActive ? '#fff' : '#78716c' }}>{icon}</div>
              <div className="plan-name" style={{ textTransform: 'capitalize' }}>{p.name}</div>
              <div className="plan-price">${Number(p.price_monthly).toFixed(0)}<span>/month</span></div>
              <ul className="plan-features">
                {allFeatures.map(f => <li key={f}><Check /> {f}</li>)}
              </ul>
              {isActive
                ? <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>Current Plan</button>
                : (
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
                    onClick={() => handleSubscribe(p.id)}
                    disabled={subscribing === p.id}
                  >
                    {subscribing === p.id ? <Loader2 size={14} className="spin" /> : null}
                    {p.price_monthly > (subscription?.price_monthly || 0) ? 'Upgrade' : 'Switch'}
                  </button>
                )}
            </div>
          );
        })}
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
    </div>
  );
}
