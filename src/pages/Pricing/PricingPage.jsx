import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Nav from '../../components/landing/Nav';
import Footer from '../../components/landing/Footer';
import SEO from '../../components/SEO';
import { useRazorpay } from '../../hooks/useRazorpay';
import api, { authApi } from '../../lib/api';
import { buildFeatures } from '../../lib/planFeatures';
import '../Landing/LandingPage.css';

function detectCurrency() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) return 'INR';
  } catch { }
  return 'USD';
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SoonBadge = () => (
  <span style={{
    fontSize: 10, fontWeight: 500, padding: '2px 6px', borderRadius: 4,
    background: '#fef3c7', color: '#92400e', marginLeft: 6, whiteSpace: 'nowrap',
  }}>Soon</span>
);

function PlanCard({ plan, isAnnual, currency, onAction }) {
  const priceInr = isAnnual ? plan.price_inr_annual : plan.price_inr_monthly;
  const priceUsd = isAnnual ? plan.price_usd_annual : plan.price_usd_monthly;
  const priceRaw = currency === 'INR' ? priceInr : priceUsd;
  // Prices stored in smallest unit (paise/cents) — convert to display
  const price = priceRaw != null ? (priceRaw / 100) : null;
  const symbol = currency === 'INR' ? '₹' : '$';
  const isComingSoon = plan.status === 'coming_soon';
  const features = buildFeatures(plan.entitlements);

  // Annual savings
  const monthlyFull = currency === 'INR' ? plan.price_inr_monthly : plan.price_usd_monthly;
  const annualPerMonth = currency === 'INR' ? plan.price_inr_annual : plan.price_usd_annual;
  const annualSaving = isAnnual && monthlyFull && annualPerMonth
    ? ((monthlyFull - annualPerMonth) * 12) / 100
    : 0;

  return (
    <div style={{
      background: '#ffffff',
      border: plan.featured ? '2px solid #18181b' : '1px solid #e5e4e2',
      borderRadius: 16, padding: '28px 24px',
      display: 'flex', flexDirection: 'column', position: 'relative',
      opacity: isComingSoon ? 0.7 : 1,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }}
      onMouseEnter={e => { if (!isComingSoon) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)'; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {plan.badge && (
        <span style={{
          display: 'inline-block', width: 'fit-content', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.02em', padding: '4px 10px', borderRadius: 6, marginBottom: 12,
          background: isComingSoon ? '#f5f5f4' : '#f0fdf4',
          color: isComingSoon ? '#78716c' : '#166534',
        }}>{plan.badge}</span>
      )}

      <h3 style={{ fontSize: 20, fontWeight: 600, color: '#1c1917', margin: '0 0 8px', fontFamily: "'Satoshi', sans-serif" }}>
        {plan.display_name}
      </h3>

      <div style={{ marginBottom: 4 }}>
        {price !== null && price > 0 ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span className="land-price-amount" style={{ fontWeight: 700, color: '#1c1917', fontFamily: "'Satoshi', sans-serif" }}>
              {symbol}{Math.round(price)}
            </span>
            <span style={{ fontSize: 15, color: '#78716c' }}>/mo</span>
          </div>
        ) : price === 0 ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span className="land-price-amount" style={{ fontWeight: 700, color: '#1c1917', fontFamily: "'Satoshi', sans-serif" }}>
              {symbol}0
            </span>
            <span style={{ fontSize: 15, color: '#78716c' }}>/forever</span>
          </div>
        ) : (
          <span style={{ fontSize: 28, fontWeight: 700, color: '#1c1917', fontFamily: "'Satoshi', sans-serif" }}>Custom</span>
        )}
      </div>

      <p style={{ fontSize: 13, color: '#a8a29e', margin: '0 0 16px', minHeight: 18 }}>
        {isAnnual && annualSaving > 0
          ? `${symbol}${Math.round(annualPerMonth / 100 * 12)}/yr · Save ${symbol}${Math.round(annualSaving)}/yr`
          : price === 0 ? 'No credit card required' : isComingSoon ? 'Notify me when available' : '\u00A0'}
      </p>

      <p style={{ fontSize: 14, color: '#57534e', lineHeight: 1.55, margin: '0 0 20px' }}>
        {plan.description}
      </p>

      <button
        onClick={() => onAction(plan.cta_action, plan)}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: 10, fontSize: 14,
          fontWeight: 600, fontFamily: "'Satoshi', sans-serif", cursor: 'pointer',
          border: plan.cta_style === 'primary' ? 'none' : '1px solid #d6d3d1',
          background: plan.cta_style === 'primary' ? '#18181b' : '#ffffff',
          color: plan.cta_style === 'primary' ? '#ffffff' : '#1c1917',
          transition: 'all 0.15s ease', marginBottom: 24,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = plan.cta_style === 'primary' ? '#27272a' : '#fafaf9'; }}
        onMouseLeave={e => { e.currentTarget.style.background = plan.cta_style === 'primary' ? '#18181b' : '#ffffff'; }}
      >
        {plan.cta_text}
      </button>

      <div style={{ height: 1, background: '#e5e4e2', marginBottom: 16 }} />

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#a8a29e', margin: '0 0 12px' }}>
          {plan.display_name === 'Free' ? 'Includes' : `Everything in ${plan.display_name === 'Pro' ? 'Free' : plan.display_name === 'Team' ? 'Pro' : 'Team'}, plus`}
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {features.map((f, i) => (
            <li key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, padding: '5px 0',
              fontSize: 13, color: f.soon ? '#a8a29e' : '#44403c', lineHeight: 1.45,
            }}>
              <span style={{ color: plan.featured ? '#1c1917' : '#78716c' }}><CheckIcon /></span>
              <span>{f.text}{f.soon && <SoonBadge />}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #e5e4e2' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        fontFamily: "'Satoshi', sans-serif",
      }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: '#1c1917', paddingRight: 16 }}>{question}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <path d="M4 6L8 10L12 6" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.25s ease' }}>
        <p style={{ fontSize: 14, color: '#57534e', lineHeight: 1.6, margin: '0 0 18px', paddingRight: 32 }}>{answer}</p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [currency, setCurrency] = useState(detectCurrency);
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { openCheckout } = useRazorpay();

  useEffect(() => {
    // Fetch plans
    api.get('/plans').then(r => setPlans(r.data || [])).catch(() => { });
    // Check if logged in
    authApi.get('/auth/me').then(r => setUser(r.data)).catch(() => { });
  }, []);

  const handleAction = async (action, plan) => {
    switch (action) {
      case 'signup':
        navigate('/login');
        break;
      case 'checkout': {
        if (!user) {
          navigate('/login?redirect=/pricing');
          return;
        }
        try {
          const { data } = await api.post('/billing/create-order', {
            planSlug: plan.slug,
            interval: isAnnual ? 'annual' : 'monthly',
            currency,
          });
          const paymentResult = await openCheckout({
            orderId: data.orderId,
            amount: data.amount,
            currency: data.currency,
            rzKeyId: data.rzKeyId,
            planName: plan.display_name,
            userEmail: user.email,
            userName: user.name,
          });
          // Verify payment on server
          await api.post('/billing/verify-payment', paymentResult);
          toast.success(`Welcome to ${plan.display_name}!`);
          navigate('/settings');
        } catch (err) {
          if (err.message !== 'Payment cancelled') {
            toast.error(err.response?.data?.error || err.message || 'Checkout failed');
          }
        }
        break;
      }
      case 'waitlist':
        window.location.href = 'mailto:hello@releaslyy.com?subject=Waitlist%20-%20Team';
        break;
      case 'contact_sales':
        window.location.href = 'mailto:hello@releaslyy.com?subject=Enterprise%20inquiry';
        break;
      default:
        break;
    }
  };

  const toggleCurrency = () => setCurrency(c => c === 'INR' ? 'USD' : 'INR');

  return (
    <div className="landing-root">
      <SEO
        title="Pricing — Free AI Release Notes Generator"
        description="Generate release notes automatically — free forever. Upgrade to Pro for unlimited AI-generated changelogs, BYOK, publish to GitHub/Jira/Slack. From $19/mo."
        keywords="ai changelog generator free, automated release notes tool, free release notes generator, github release notes generator for free, jira release notes generator for free, devrev release notes generator for free, release notes tool pricing, BYOK AI pricing, product update generator"
        canonical="https://releaslyy.com/pricing"
      />
      <div className="land-noise" />
      <Nav />
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '120px 24px 80px', fontFamily: "'Satoshi', sans-serif" }}>
        {/* Header */}
        <div className="land-pricing-header" style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4a80f0', display: 'block', marginBottom: 12 }}>Pricing</span>
          <h1 style={{ fontWeight: 700, color: '#1c1917', margin: '0 0 12px', lineHeight: 1.2 }}>
            Start free. Upgrade when you're ready.
          </h1>
          <p style={{ fontSize: 17, color: '#78716c', margin: '0 0 32px', lineHeight: 1.5, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Every plan includes the full generate flow. Pro unlocks multi-source, publish-back, and bring-your-own AI.
          </p>

          {/* Controls: Billing toggle + Currency switcher */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {/* Billing toggle */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#f5f5f4', borderRadius: 10, padding: 4 }}>
              <button onClick={() => setIsAnnual(false)} style={{
                padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                fontFamily: "'Satoshi', sans-serif", border: 'none', cursor: 'pointer',
                background: !isAnnual ? '#ffffff' : 'transparent', color: !isAnnual ? '#1c1917' : '#78716c',
                boxShadow: !isAnnual ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s ease',
              }}>Monthly</button>
              <button onClick={() => setIsAnnual(true)} style={{
                padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                fontFamily: "'Satoshi', sans-serif", border: 'none', cursor: 'pointer',
                background: isAnnual ? '#ffffff' : 'transparent', color: isAnnual ? '#1c1917' : '#78716c',
                boxShadow: isAnnual ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s ease',
              }}>
                Annual
                {(() => {
                  const paid = plans.find(p => p.slug === 'pro');
                  if (!paid) return null;
                  const monthly = currency === 'INR' ? paid.price_inr_monthly : paid.price_usd_monthly;
                  const annual = currency === 'INR' ? paid.price_inr_annual : paid.price_usd_annual;
                  const pct = monthly > 0 ? Math.round((1 - annual / monthly) * 100) : 0;
                  return pct > 0 ? <span style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', marginLeft: 6 }}>Save {pct}%</span> : null;
                })()}
              </button>
            </div>

            {/* Currency toggle */}
            <button onClick={toggleCurrency} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              borderRadius: 8, fontSize: 13, fontWeight: 500, border: '1px solid #e5e4e2',
              background: '#fff', cursor: 'pointer', color: '#57534e',
              fontFamily: "'Satoshi', sans-serif",
            }}>
              {currency === 'INR' ? '₹ INR' : '$ USD'}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 5L6 8L9 5" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="land-pricing-grid">
          {plans.map((plan) => (
            <PlanCard key={plan.slug} plan={plan} isAnnual={isAnnual} currency={currency} onAction={handleAction} />
          ))}
        </div>

        {/* Bottom note */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <p style={{ fontSize: 14, color: '#a8a29e', lineHeight: 1.6, margin: '0 0 8px' }}>
            All paid plans include a 14-day free trial. No credit card required to start.
          </p>
          <p style={{ fontSize: 14, color: '#a8a29e', lineHeight: 1.6, margin: 0 }}>
            Questions? Reach out at{' '}
            <a href="mailto:hello@releaslyy.com" style={{ color: '#4a80f0', textDecoration: 'none' }}>hello@releaslyy.com</a>
          </p>
        </div>

        {/* FAQ */}
        <div className="land-faq-wrap">
          <h2 style={{ fontWeight: 700, color: '#1c1917', textAlign: 'center', marginBottom: 32 }}>
            Frequently asked questions
          </h2>
          {[
            { q: 'What happens when I hit the free plan limit?', a: "You'll still have access to all your existing release notes. You just won't be able to generate new ones until the next month, or until you upgrade to Pro." },
            { q: 'Can I use my own API key on the free plan?', a: 'BYOK (Bring Your Own Key) is a Pro feature. The free plan uses Releaslyy AI, our built-in model that requires no API key.' },
            { q: "What's included in the 14-day trial?", a: 'The full Pro plan — unlimited generations, all integrations, multi-source, publish-back, and BYOK. No credit card needed to start.' },
            { q: 'Can I cancel anytime?', a: "Yes. Cancel from your Settings page at any time. You'll keep access until the end of your billing period." },
            { q: "Does Pro include Slack publishing?", a: "Yes! Slack is fully supported. Connect your workspace, pick a channel, and publish — as full release notes or an AI-generated summary with a link to the public changelog." },
            { q: 'When will Team and Enterprise plans be available?', a: "We're building team collaboration features now. Join the waitlist and we'll notify you as soon as they're ready." },
            { q: 'What payment methods are supported?', a: 'We use Razorpay for payments. UPI, Indian cards, netbanking, and international cards are all supported.' },
          ].map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
