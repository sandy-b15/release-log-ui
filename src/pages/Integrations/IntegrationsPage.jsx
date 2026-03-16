import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Hash, Plus, Cable, Send, ArrowRight, Users, Code2, Megaphone, HeartHandshake, Puzzle, Loader2, Terminal, Wand2, Star, CheckCircle2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Nav from '../../components/landing/Nav';
import Footer from '../../components/landing/Footer';
import FadeIn from '../../components/landing/FadeIn';
import SEO from '../../components/SEO';
import githubLogo from '../../assets/github.png';
import jiraLogo from '../../assets/jira_logo.webp';
import devrevLogo from '../../assets/devrev-logo.webp';
import zohoLogo from '../../assets/Zoho-logo.webp';
import '../Landing/LandingPage.css';
import './IntegrationsPage.css';

const INTEGRATIONS = [
  {
    id: 'github',
    name: 'GitHub',
    logo: githubLogo,
    logoAlt: 'GitHub',
    description: 'Pull commits, PRs, and tags directly from GitHub. Generate release notes and publish back to GitHub Releases.',
    status: 'available',
    href: '/docs',
  },
  {
    id: 'jira',
    name: 'Jira',
    logo: jiraLogo,
    logoAlt: 'Jira',
    description: 'Connect Jira sprints and issues. Generate release notes from your sprint backlog and publish to Jira releases.',
    status: 'available',
    href: '/integrations/jira',
  },
  {
    id: 'devrev',
    name: 'DevRev',
    logo: devrevLogo,
    logoAlt: 'DevRev',
    description: 'Sync DevRev work items and sprints. AI generates release notes and publishes back to DevRev.',
    status: 'available',
    href: '/integrations/devrev',
  },
  {
    id: 'slack',
    name: 'Slack',
    logo: null,
    logoAlt: 'Slack',
    description: 'Auto-publish release notes to Slack channels. Rich formatting, thread support, and team mentions.',
    status: 'soon',
    href: '/integrations/slack',
  },
  {
    id: 'zoho',
    name: 'Zoho Sprints',
    logo: zohoLogo,
    logoAlt: 'Zoho Sprints',
    description: 'Connect Zoho Sprints to generate release notes from your sprint items and backlog.',
    status: 'soon',
    href: null,
  },
  {
    id: 'more',
    name: 'More Integrations',
    logo: null,
    logoAlt: null,
    description: 'GitLab, Bitbucket, Linear, Notion — more integrations coming soon. Request yours on our support page.',
    status: 'placeholder',
    href: '/support',
  },
];

const HOW_IT_WORKS = [
  {
    num: '01',
    icon: <Cable size={20} />,
    title: 'Connect',
    desc: 'Link your GitHub, Jira, DevRev, or Slack workspace with one click. OAuth-based, secure, revocable.',
    color: 'var(--land-sky)',
  },
  {
    num: '02',
    icon: <Sparkles size={20} />,
    title: 'Generate',
    desc: 'Select commits, issues, or sprint items. AI generates release notes in 6 audience formats.',
    color: 'var(--land-accent)',
  },
  {
    num: '03',
    icon: <Send size={20} />,
    title: 'Publish',
    desc: 'Push notes back to GitHub Releases, Jira, DevRev, or Slack channels automatically.',
    color: 'var(--land-teal)',
  },
];

function IntegrationCard({ integration, index, navigate }) {
  const isPlaceholder = integration.status === 'placeholder';
  const isAvailable = integration.status === 'available';
  const isSoon = integration.status === 'soon';

  const handleLearnMore = () => {
    if (!integration.href) return;
    navigate(integration.href);
  };

  return (
    <FadeIn delay={index * 0.07}>
      <div
        className={`integ-hub-card${isPlaceholder ? ' integ-hub-card--dashed' : ''}`}
        style={{ cursor: integration.href ? 'pointer' : 'default' }}
        onClick={integration.href ? handleLearnMore : undefined}
      >
        {/* Logo / Icon */}
        <div style={{ marginBottom: 16 }}>
          {isPlaceholder ? (
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(113,113,122,.06)',
              border: '1px dashed var(--land-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--land-muted)',
            }}>
              <Plus size={18} />
            </div>
          ) : integration.logo ? (
            <img
              src={integration.logo}
              alt={integration.logoAlt}
              style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8 }}
            />
          ) : (
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(16,185,129,.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--land-teal)',
            }}>
              <Hash size={20} />
            </div>
          )}
        </div>

        {/* Name + badge row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--land-text)' }}>
            {integration.name}
          </span>
          {isAvailable && (
            <span className="integ-hub-badge integ-hub-badge--available">
              <span style={{ width: 5, height: 5, borderRadius: 5, background: 'var(--land-teal)', display: 'inline-block' }} />
              Available
            </span>
          )}
          {isSoon && (
            <span className="integ-hub-badge integ-hub-badge--soon">
              Coming Soon
            </span>
          )}
        </div>

        {/* Description */}
        <p style={{
          fontSize: 14, color: 'var(--land-muted)', lineHeight: 1.65,
          flex: 1, marginBottom: integration.href ? 20 : 0,
        }}>
          {integration.description}
        </p>

        {/* Learn more link */}
        {integration.href && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 13, fontWeight: 600,
            color: isPlaceholder ? 'var(--land-muted)' : 'var(--land-accent)',
            marginTop: 'auto',
          }}>
            {isPlaceholder ? 'Request an integration' : 'Learn more'}
            <ArrowRight size={13} />
          </div>
        )}
      </div>
    </FadeIn>
  );
}

function IntegrationRequestForm() {
  const [form, setForm] = useState({ name: '', email: '', tool: '', description: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.tool.trim()) {
      return toast.error('Please fill in name, email, and tool name');
    }
    setSending(true);
    try {
      // Send via mailto fallback — opens email client
      const subject = encodeURIComponent(`Integration Request: ${form.tool}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nTool: ${form.tool}\n\nDescription:\n${form.description}`
      );
      window.location.href = `mailto:hello@releaslyy.com?subject=${subject}&body=${body}`;
      setSent(true);
      toast.success('Opening your email client...');
    } catch {
      toast.error('Failed to open email client');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={{
        padding: 40, borderRadius: 16, background: 'var(--land-card)', border: '1px solid var(--land-border)',
        textAlign: 'center',
      }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16,185,129,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--land-teal)', margin: '0 auto 16px' }}>
          <Send size={22} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--land-text)', marginBottom: 8 }}>Request Submitted</h3>
        <p style={{ fontSize: 14, color: 'var(--land-muted)', lineHeight: 1.6 }}>
          Thanks for your request! We'll review it and get back to you at <strong>{form.email}</strong>.
        </p>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1px solid var(--land-border)', background: 'var(--land-card)',
    fontSize: 14, fontFamily: 'var(--land-font)', color: 'var(--land-text)',
    outline: 'none', transition: 'border-color .2s',
  };

  return (
    <form onSubmit={handleSubmit} style={{
      padding: 32, borderRadius: 16, background: 'var(--land-card)', border: '1px solid var(--land-border)',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--land-text)', marginBottom: 6 }}>Name</label>
          <input style={inputStyle} placeholder="Your name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--land-text)', marginBottom: 6 }}>Email</label>
          <input style={inputStyle} type="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--land-text)', marginBottom: 6 }}>Tool Name</label>
        <input style={inputStyle} placeholder="e.g., Linear, ClickUp, Asana..." value={form.tool} onChange={(e) => setForm(f => ({ ...f, tool: e.target.value }))} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--land-text)', marginBottom: 6 }}>Description <span style={{ fontWeight: 400, color: 'var(--land-muted)' }}>(optional)</span></label>
        <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="How would you use this integration?" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
      </div>
      <button type="submit" className="land-btn land-btn-p" style={{ justifyContent: 'center', width: '100%' }} disabled={sending}>
        {sending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
        Submit Request
      </button>
      <p style={{ fontSize: 12, color: 'var(--land-muted)', textAlign: 'center' }}>
        Or email us directly at <a href="mailto:hello@releaslyy.com" style={{ color: 'var(--land-accent)', fontWeight: 500 }}>hello@releaslyy.com</a>
      </p>
    </form>
  );
}

export default function IntegrationsPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-root">
      <SEO
        title="Integrations — GitHub, Jira, DevRev, Slack"
        description="Connect GitHub, Jira, DevRev, and Slack to Releaslyy. Pull commits and issues, generate AI release notes, and publish back automatically. Free to start."
        keywords="releaslyy integrations, github integration, jira integration, devrev integration, slack release notes, release notes integrations, changelog integrations, connect github jira devrev"
        canonical="https://releaslyy.com/integrations"
      />
      <div className="land-noise" />
      <Nav />

      {/* ── Hero ── */}
      <section
        className="land-sec land-hero-sec integ-hub-hero-gradient"
        style={{ paddingTop: 160, paddingBottom: 60, textAlign: 'center', overflow: 'hidden' }}
      >
        <div className="land-orb" style={{
          width: 600, height: 600, opacity: 0.07,
          background: 'radial-gradient(circle,rgba(99,102,241,.5),transparent)',
          top: -100, left: '50%', marginLeft: -300,
          animation: 'land-pulse 6s ease-in-out infinite',
        }} />
        <div className="land-orb" style={{
          width: 400, height: 400, opacity: 0.05,
          background: 'radial-gradient(circle,rgba(16,185,129,.4),transparent)',
          top: 200, right: -100,
          animation: 'land-pulse 8s ease-in-out infinite 2s',
        }} />

        <div className="land-con" style={{ position: 'relative', zIndex: 2 }}>
          <FadeIn>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 100,
              background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.2)',
              fontSize: 13, color: 'var(--land-accent)', fontWeight: 500, marginBottom: 32,
            }}>
              <Sparkles size={14} />
              Integrations
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 style={{
              fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 700, lineHeight: 1.08,
              letterSpacing: '-.035em', maxWidth: 820, margin: '0 auto 24px',
              color: 'var(--land-text)',
            }}>
              Connect your tools,{' '}
              <span style={{
                fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400,
                background: 'linear-gradient(135deg, var(--land-accent), var(--land-teal))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                automate
              </span>
              {' '}your releases
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p
              className="land-hero-subtitle"
              style={{ fontSize: 18, color: 'var(--land-muted)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.65 }}
            >
              Releaslyy integrates with the tools your team already uses. Pull data, generate AI release notes, and publish back — all in one flow.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <button onClick={() => navigate('/signup')} className="land-btn land-btn-p">
              Get started for free
              <ArrowRight size={16} />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── Integration Cards ── */}
      <section className="land-sec" style={{ paddingTop: 40 }}>
        <div className="land-con">
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{
                fontSize: 12, fontWeight: 600, color: 'var(--land-accent)',
                textTransform: 'uppercase', letterSpacing: '.12em',
              }}>
                All Platforms
              </span>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700,
                letterSpacing: '-.03em', marginTop: 12, color: 'var(--land-text)',
              }}>
                Every tool your team{' '}
                <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400 }}>
                  already uses
                </span>
              </h2>
              <p style={{
                fontSize: 16, color: 'var(--land-muted)', maxWidth: 520,
                margin: '16px auto 0', lineHeight: 1.6,
              }}>
                Connect one or combine multiple sources. Releaslyy unifies everything into a single release.
              </p>
            </div>
          </FadeIn>

          <div className="integ-hub-grid">
            {INTEGRATIONS.map((integration, i) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                index={i}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Before & After ── */}
      <section className="land-sec">
        <div className="land-con">
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--land-accent)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
                See The Difference
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-.03em', marginTop: 12, color: 'var(--land-text)' }}>
                Raw data in,{' '}
                <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400 }}>polished notes</span>
                {' '}out
              </h2>
              <p style={{ fontSize: 16, color: 'var(--land-muted)', maxWidth: 520, margin: '16px auto 0', lineHeight: 1.6 }}>
                Watch how Releaslyy transforms raw development data into professional release notes in seconds.
              </p>
            </div>
          </FadeIn>

          <div className="integ-before-after">
            {/* Before Card */}
            <FadeIn delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--land-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--land-muted)' }}>
                    <Terminal size={18} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--land-text)' }}>Before: Raw GitHub Data</h3>
                </div>
                <div style={{
                  borderRadius: 14, border: '1px solid var(--land-border)', background: 'var(--land-surface)',
                  padding: 24, fontFamily: 'var(--land-mono)', fontSize: 13, minHeight: 420,
                  position: 'relative', overflow: 'hidden',
                }}>
                  {[
                    { msg: 'feat: merge branch \'staging\'', hash: '7a2b9f1', pr: '#442', time: '2 hours ago' },
                    { msg: 'fix: updated regex for email validation', hash: '3c1d5e2', pr: '#441', time: '5 hours ago' },
                    { msg: 'docs: fixed typos in readme.md', hash: '9f8a7b6', pr: '#440', time: 'Yesterday' },
                    { msg: 'refactor: optimized query performance for dashboard', hash: '5e4d3c2', pr: '#439', time: 'Yesterday' },
                    { msg: 'chore: bump deps', hash: '1a2b3c4', pr: '#438', time: '2 days ago' },
                    { msg: 'fix: handle null pointer in user service', hash: '8d7e6f5', pr: '#437', time: '3 days ago' },
                  ].map((c, i) => (
                    <div key={i} style={{ padding: '10px 12px', borderBottom: '1px solid var(--land-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: 'var(--land-accent)', opacity: 0.7 }}>{c.msg}</span>
                        <span style={{ fontSize: 11, color: 'var(--land-muted)', opacity: 0.6 }}>{c.pr}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--land-muted)', opacity: 0.5 }}>
                        <span>{c.hash}</span>
                        <span>{c.time}</span>
                      </div>
                    </div>
                  ))}
                  {/* Fade overlay */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, var(--land-surface), transparent)' }} />
                </div>
                <p style={{ fontSize: 13, color: 'var(--land-muted)', fontStyle: 'italic' }}>
                  Unorganized commits and technical jargon that confuse your users.
                </p>
              </div>
            </FadeIn>

            {/* AI Transition */}
            <FadeIn delay={0.2}>
              <div className="integ-ai-divider">
                <div className="integ-ai-line" />
                <div style={{
                  width: 64, height: 64, borderRadius: 32, background: 'var(--land-card)',
                  border: '1px solid var(--land-border)', boxShadow: '0 8px 30px rgba(99,102,241,.15)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                }}>
                  <Wand2 size={22} style={{ color: 'var(--land-accent)' }} />
                  <span style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--land-text)' }}>AI</span>
                </div>
                <div className="integ-ai-line" />
              </div>
            </FadeIn>

            {/* After Card */}
            <FadeIn delay={0.3}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99,102,241,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--land-accent)' }}>
                    <Sparkles size={18} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--land-text)' }}>After: AI Generated Release</h3>
                </div>
                <div style={{
                  borderRadius: 14, border: '1px solid rgba(99,102,241,.2)',
                  background: 'var(--land-card)', padding: 28, minHeight: 420,
                  boxShadow: '0 0 40px -10px rgba(99,102,241,.1)', position: 'relative', overflow: 'hidden',
                }}>
                  {/* Glow */}
                  <div style={{ position: 'absolute', top: -60, right: -60, width: 160, height: 160, background: 'rgba(99,102,241,.04)', borderRadius: '50%', filter: 'blur(40px)' }} />
                  <div style={{ position: 'relative' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--land-border)', paddingBottom: 20, marginBottom: 24 }}>
                      <div>
                        <h4 style={{ fontSize: 20, fontWeight: 700, color: 'var(--land-text)', letterSpacing: '-.02em' }}>v2.4.0 — Performance Update</h4>
                        <p style={{ fontSize: 13, color: 'var(--land-muted)', marginTop: 4 }}>Released March 24, 2026</p>
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: 100, background: 'var(--land-accent)', color: '#fff', fontSize: 11, fontWeight: 700 }}>Stable</span>
                    </div>
                    {/* Categories */}
                    {[
                      { label: 'New Features', icon: <Star size={15} />, color: 'var(--land-accent)', items: [
                        { bold: 'Dashboard Performance:', text: ' Significant improvements to data loading speeds, resulting in 40% faster rendering.' },
                      ]},
                      { label: 'Bug Fixes', icon: <CheckCircle2 size={15} />, color: 'var(--land-teal)', items: [
                        { bold: null, text: 'Resolved an issue where special characters in email addresses caused validation failures.' },
                      ]},
                      { label: 'Improvements', icon: <TrendingUp size={15} />, color: 'var(--land-warm)', items: [
                        { bold: null, text: 'Updated documentation with clearer examples and improved search indexing.' },
                        { bold: null, text: 'Optimized database queries reducing average response time by 35%.' },
                      ]},
                    ].map((cat) => (
                      <div key={cat.label} style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: cat.color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
                          {cat.icon} {cat.label}
                        </div>
                        {cat.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8, paddingLeft: 4 }}>
                            <div style={{ width: 5, height: 5, borderRadius: 5, background: cat.color, marginTop: 7, flexShrink: 0 }} />
                            <p style={{ fontSize: 14, color: 'var(--land-muted)', lineHeight: 1.65 }}>
                              {item.bold && <strong style={{ color: 'var(--land-text)' }}>{item.bold}</strong>}
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--land-muted)', fontStyle: 'italic' }}>
                  Human-readable, categorized, and beautiful notes ready to publish.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── How Integrations Work ── */}
      <section className="land-sec" style={{ background: 'var(--land-surface)', borderRadius: 0 }}>
        <div className="land-con">
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{
                fontSize: 12, fontWeight: 600, color: 'var(--land-sky)',
                textTransform: 'uppercase', letterSpacing: '.12em',
              }}>
                How it works
              </span>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700,
                letterSpacing: '-.03em', marginTop: 12, color: 'var(--land-text)',
              }}>
                Three steps to{' '}
                <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400 }}>
                  effortless
                </span>
                {' '}releases
              </h2>
            </div>
          </FadeIn>

          <div className="integ-hub-steps">
            {HOW_IT_WORKS.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.12}>
                <div style={{
                  padding: 32, borderRadius: 14,
                  background: 'var(--land-card)', border: '1px solid var(--land-border)',
                  position: 'relative', overflow: 'hidden', height: '100%',
                  transition: 'all .3s ease',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#d0d0d6';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--land-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="integ-hub-step-num">{step.num}</div>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: step.color + '12',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: step.color, marginBottom: 20,
                  }}>
                    {step.icon}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
                  }}>
                    <span style={{
                      fontFamily: 'var(--land-mono)', fontSize: 11, fontWeight: 700,
                      color: step.color, textTransform: 'uppercase', letterSpacing: '.08em',
                    }}>
                      {step.num}
                    </span>
                    <h3 style={{
                      fontSize: 18, fontWeight: 600, letterSpacing: '-.02em',
                      color: 'var(--land-text)',
                    }}>
                      {step.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--land-muted)', lineHeight: 1.65 }}>
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Target Users ── */}
      <section className="land-sec">
        <div className="land-con">
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--land-accent)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
                Built For
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-.03em', marginTop: 12, color: 'var(--land-text)' }}>
                Who uses{' '}
                <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400 }}>Releaslyy?</span>
              </h2>
            </div>
          </FadeIn>
          <div className="integ-hub-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {[
              { icon: <Users size={22} />, title: 'Product Managers', desc: 'Generate stakeholder-ready release notes from sprint data without chasing engineers.', color: 'var(--land-accent)' },
              { icon: <Code2 size={22} />, title: 'Engineering Teams', desc: 'Auto-generate technical changelogs from commits and PRs. Focus on shipping, not writing.', color: 'var(--land-sky)' },
              { icon: <Megaphone size={22} />, title: 'Developer Relations', desc: 'Create public changelogs and developer community updates from your release data.', color: 'var(--land-purple)' },
              { icon: <HeartHandshake size={22} />, title: 'Customer Success', desc: 'Share product updates with customers in non-technical language. Keep them informed effortlessly.', color: 'var(--land-teal)' },
            ].map((user, i) => (
              <FadeIn key={user.title} delay={i * 0.08}>
                <div style={{
                  padding: 28, borderRadius: 14, background: 'var(--land-card)', border: '1px solid var(--land-border)',
                  transition: 'all .3s ease', height: '100%',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d0d0d6'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--land-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: user.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', color: user.color, marginBottom: 16 }}>{user.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-.02em', marginBottom: 8, color: 'var(--land-text)' }}>{user.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--land-muted)', lineHeight: 1.65 }}>{user.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Future Integrations ── */}
      <section className="land-sec" style={{ background: 'var(--land-surface)' }}>
        <div className="land-con">
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--land-warm)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
                On The Roadmap
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-.03em', marginTop: 12, color: 'var(--land-text)' }}>
                Future{' '}
                <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400 }}>integrations</span>
              </h2>
              <p style={{ fontSize: 16, color: 'var(--land-muted)', maxWidth: 480, margin: '16px auto 0', lineHeight: 1.6 }}>
                We're expanding support for more tools. Vote or request your integration below.
              </p>
            </div>
          </FadeIn>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, maxWidth: 600, margin: '0 auto' }}>
            {['Linear', 'Monday', 'ClickUp', 'Asana', 'GitLab', 'Bitbucket', 'Notion', 'Custom Tools'].map((tool, i) => (
              <FadeIn key={tool} delay={i * 0.05}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 100,
                  background: 'var(--land-card)', border: '1px solid var(--land-border)',
                  fontSize: 14, fontWeight: 500, color: 'var(--land-text)',
                  transition: 'all .2s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--land-accent)'; e.currentTarget.style.color = 'var(--land-accent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--land-border)'; e.currentTarget.style.color = 'var(--land-text)'; }}
                >
                  <Puzzle size={14} style={{ opacity: 0.5 }} />
                  {tool}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom Integration Request ── */}
      <section className="land-sec">
        <div className="land-con" style={{ maxWidth: 600 }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--land-teal)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
                Request an Integration
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-.03em', marginTop: 12, color: 'var(--land-text)' }}>
                Need a custom integration?
              </h2>
              <p style={{ fontSize: 15, color: 'var(--land-muted)', maxWidth: 460, margin: '12px auto 0', lineHeight: 1.6 }}>
                Tell us which tool you'd like to connect and we'll prioritize it on our roadmap.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <IntegrationRequestForm />
          </FadeIn>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="land-sec">
        <div className="land-con">
          <FadeIn>
            <div className="land-cta-box" style={{
              textAlign: 'center', padding: '64px 32px', borderRadius: 20,
              position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(135deg,rgba(24,24,27,.02) 0%,rgba(99,102,241,.04) 100%)',
              border: '1px solid rgba(24,24,27,.08)',
            }}>
              <div className="land-orb" style={{
                width: 400, height: 400, opacity: 0.06,
                background: 'radial-gradient(circle,rgba(99,102,241,.4),transparent)',
                top: -150, left: '50%', marginLeft: -200,
              }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{
                  fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700,
                  letterSpacing: '-.03em', marginBottom: 16, color: 'var(--land-text)',
                }}>
                  Stop writing release notes manually
                </h2>
                <p style={{
                  fontSize: 16, color: 'var(--land-muted)', maxWidth: 460,
                  margin: '0 auto 32px', lineHeight: 1.6,
                }}>
                  Connect your tools, let AI do the writing, and publish everywhere — in seconds. Free to start, no credit card required.
                </p>
                <button onClick={() => navigate('/signup')} className="land-btn land-btn-p">
                  Get started for free
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
