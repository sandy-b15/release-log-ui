import { useNavigate } from 'react-router-dom';
import { Sparkles, Cable, Send, Check, Hash, ChevronDown } from 'lucide-react';
import Nav from '../../components/landing/Nav';
import Footer from '../../components/landing/Footer';
import FadeIn from '../../components/landing/FadeIn';
import SEO from '../../components/SEO';
import { I } from '../../components/landing/Icons';
import devrevLogo from '../../assets/devrev-logo.webp';
import githubLogo from '../../assets/github.png';
import '../Landing/LandingPage.css';
import './IntegrationLanding.css';

/* ── App Mockup (DevRev-focused) ── */
function DevRevMockup() {
  return (
    <div className="integ-mockup-outer" style={{ padding: '20px 24px 0' }}>
      {/* Browser chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ff5f57', '#ffbd2e', '#28c840'].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: 10, background: c, opacity: 0.7 }} />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: 'var(--land-muted)', fontFamily: 'var(--land-mono)' }}>
          releaslyy.com/generate
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, paddingBottom: 20 }}>
        {/* Sidebar */}
        <div style={{ background: 'rgba(0,0,0,.02)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--land-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Sources</div>
          {[
            { name: 'DevRev', color: '#10b981', active: true },
            { name: 'GitHub', color: '#18181b', active: false },
            { name: 'Jira', color: '#0ea5e9', active: false },
          ].map((s) => (
            <div key={s.name} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, marginBottom: 4,
              background: s.active ? 'rgba(16,185,129,.04)' : 'transparent',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 6, background: s.color, opacity: 0.6 }} />
              <span style={{ fontSize: 12, color: s.active ? 'var(--land-text)' : 'var(--land-muted)', fontWeight: s.active ? 500 : 400 }}>{s.name}</span>
              {s.active && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--land-teal)', fontFamily: 'var(--land-mono)' }}>synced</span>}
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--land-border)', margin: '10px 0', paddingTop: 10, fontSize: 11, fontWeight: 600, color: 'var(--land-muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Releases</div>
          {['v2.4.0', 'v2.3.1', 'v2.3.0'].map((v, i) => (
            <div key={v} style={{
              padding: '7px 10px', borderRadius: 8, marginBottom: 4, fontSize: 12, fontFamily: 'var(--land-mono)',
              background: i === 0 ? 'rgba(24,24,27,.04)' : 'transparent',
              color: i === 0 ? 'var(--land-text)' : 'var(--land-muted)', fontWeight: i === 0 ? 600 : 400,
            }}>{v} {i === 0 && <span style={{ fontSize: 9, opacity: 0.5 }}>latest</span>}</div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ background: 'rgba(0,0,0,.02)', borderRadius: 10, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.02em' }}>Release v2.4.0</div>
              <div style={{ fontSize: 12, color: 'var(--land-muted)', marginTop: 2, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span>March 10, 2026</span>
                <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ width: 5, height: 5, borderRadius: 5, background: 'var(--land-teal)', opacity: 0.5 }} /> 8 DevRev work items
                </span>
              </div>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(16,185,129,.08)', color: 'var(--land-teal)', fontSize: 11, fontWeight: 600 }}>Published</div>
          </div>

          {[
            { cat: 'New Features', color: 'var(--land-teal)', items: ['AI-powered ticket categorization from DevRev', 'Slack notification on release publish'] },
            { cat: 'Improvements', color: 'var(--land-sky)', items: ['Faster sprint data sync from DevRev workspace', 'Better formatting for technical audiences'] },
          ].map((g) => (
            <div key={g.cat} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: g.color, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: 6, background: g.color }} />{g.cat}
              </div>
              {g.items.map((it) => (
                <div key={it} style={{ fontSize: 13, color: 'var(--land-muted)', paddingLeft: 12, marginBottom: 3, lineHeight: 1.6 }}>- {it}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Slack Config Mockup ── */
function SlackConfigMockup() {
  return (
    <div style={{
      background: '#1e293b', borderRadius: 14, border: '1px solid rgba(255,255,255,.08)',
      padding: 24, maxWidth: 380, width: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Hash size={16} color="#10b981" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>Slack Configuration</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Auto-publish settings</div>
        </div>
      </div>

      {/* Channel selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Channel</div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px',
          background: 'rgba(255,255,255,.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,.08)',
        }}>
          <span style={{ fontSize: 13, color: '#e2e8f0' }}># product-releases</span>
          <ChevronDown size={14} color="#64748b" />
        </div>
      </div>

      {/* Format options */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Format</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Summary', 'Detailed', 'Bullet'].map((f, i) => (
            <div key={f} style={{
              padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
              background: i === 0 ? 'rgba(16,185,129,.15)' : 'rgba(255,255,255,.05)',
              color: i === 0 ? '#10b981' : '#94a3b8',
              border: i === 0 ? '1px solid rgba(16,185,129,.3)' : '1px solid rgba(255,255,255,.06)',
            }}>{f}</div>
          ))}
        </div>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <span style={{ fontSize: 13, color: '#cbd5e1' }}>Auto-post on publish</span>
        <div style={{
          width: 40, height: 22, borderRadius: 11, background: '#10b981', position: 'relative', cursor: 'pointer',
        }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: '#fff', position: 'absolute', top: 2, right: 2, transition: 'all .2s' }} />
        </div>
      </div>
    </div>
  );
}

export default function IntegrationLanding() {
  const navigate = useNavigate();

  return (
    <div className="landing-root">
      <SEO
        title="DevRev Integration — AI Release Notes Generator"
        description="Generate release notes from DevRev work items and sprints automatically. AI-powered changelog generator for DevRev. Connect, generate, publish to Slack."
        keywords="devrev release notes, devrev changelog, devrev integration, generate release notes from devrev, devrev ai release notes, devrev slack integration, devrev sprint release notes, automated release notes devrev"
        canonical="https://releaslyy.com/integrations/devrev"
      />
      <div className="land-noise" />
      <Nav />

      {/* ── Hero Section ── */}
      <section className="land-sec land-hero-sec integ-hero-gradient" style={{ paddingTop: 160, paddingBottom: 60, textAlign: 'center', overflow: 'hidden' }}>
        <div className="land-orb" style={{ width: 600, height: 600, opacity: 0.07, background: 'radial-gradient(circle,rgba(16,185,129,.5),transparent)', top: -100, left: '50%', marginLeft: -300, animation: 'land-pulse 6s ease-in-out infinite' }} />
        <div className="land-orb" style={{ width: 400, height: 400, opacity: 0.05, background: 'radial-gradient(circle,rgba(99,102,241,.4),transparent)', top: 200, right: -100, animation: 'land-pulse 8s ease-in-out infinite 2s' }} />

        <div className="land-con" style={{ position: 'relative', zIndex: 2 }}>
          <FadeIn>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100,
              background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.2)',
              fontSize: 13, color: 'var(--land-teal)', fontWeight: 500, marginBottom: 32,
            }}>
              <Sparkles size={14} />
              Now supporting DevRev &amp; Slack Automations
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 style={{
              fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-.035em',
              maxWidth: 820, margin: '0 auto 24px', color: 'var(--land-text)',
            }}>
              Generate Release Notes from DevRev Work Items{' '}
              <span style={{
                fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400,
                background: 'linear-gradient(135deg, var(--land-teal), var(--land-accent))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                with AI
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="land-hero-subtitle" style={{ fontSize: 18, color: 'var(--land-muted)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.65 }}>
              Connect your DevRev workspace, and let AI transform your tickets, sprints, and work items into polished release notes your team and customers will love.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="integ-hero-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/signup')} className="land-btn land-btn-p">Start for free {I.arrow}</button>
              <button onClick={() => navigate('/docs')} className="land-btn land-btn-s">
                <span style={{ display: 'flex', color: 'var(--land-muted)' }}>{I.plug}</span>
                View DevRev Setup
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="integ-logos-row" style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
              {[
                { src: devrevLogo, alt: 'DevRev', label: 'DevRev' },
                { src: null, alt: 'Slack', label: 'Slack' },
                { src: githubLogo, alt: 'GitHub', label: 'GitHub' },
              ].map((logo) => (
                <div key={logo.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {logo.src ? (
                    <img src={logo.src} alt={logo.alt} style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  ) : (
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(16,185,129,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Hash size={16} color="var(--land-teal)" />
                    </div>
                  )}
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--land-muted)' }}>{logo.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── App Mockup Section ── */}
      <section className="land-sec" style={{ paddingTop: 0, paddingBottom: 60 }}>
        <div className="land-con">
          <FadeIn delay={0.1}>
            <div className="integ-mockup-outer" style={{
              borderRadius: 16, border: '1px solid var(--land-border)',
              background: 'linear-gradient(180deg, var(--land-card) 0%, var(--land-bg) 100%)',
              overflow: 'hidden',
              boxShadow: '0 0 0 1px rgba(0,0,0,.03), 0 20px 60px -15px rgba(0,0,0,.08)',
            }}>
              <DevRevMockup />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="land-sec" id="features" style={{ position: 'relative' }}>
        <div className="land-orb" style={{ width: 500, height: 500, opacity: 0.05, background: 'radial-gradient(circle,rgba(16,185,129,.4),transparent)', bottom: -100, left: -100 }} />
        <div className="land-con" style={{ position: 'relative', zIndex: 2 }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--land-teal)', textTransform: 'uppercase', letterSpacing: '.12em' }}>Features</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-.03em', marginTop: 12, color: 'var(--land-text)' }}>
                Everything you need for{' '}
                <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400 }}>DevRev</span>
                {' '}releases
              </h2>
              <p style={{ fontSize: 16, color: 'var(--land-muted)', maxWidth: 520, margin: '16px auto 0', lineHeight: 1.6 }}>
                Pull tickets from DevRev, generate with AI, publish everywhere.
              </p>
            </div>
          </FadeIn>
          <div className="integ-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {[
              { icon: <Sparkles size={20} />, title: 'AI Release Notes', desc: 'Analyzes DevRev work items, sprint items, and linked work items -- then writes human-readable summaries organized by category.', color: 'var(--land-accent)' },
              { icon: <Cable size={20} />, title: 'Multi-Source Ingestion', desc: 'Pull data from DevRev alongside GitHub and Jira. Releaslyy unifies everything into a single release timeline.', color: 'var(--land-sky)' },
              { icon: <Send size={20} />, title: 'Slack Publishing', desc: 'Publish generated release notes directly to Slack channels. Keep your team and stakeholders informed automatically.', color: 'var(--land-teal)' },
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <div style={{
                  padding: 28, borderRadius: 14, background: 'var(--land-card)', border: '1px solid var(--land-border)',
                  transition: 'all .3s ease', cursor: 'default', height: '100%',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d0d0d6'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--land-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: f.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-.02em', marginBottom: 8, color: 'var(--land-text)' }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--land-muted)', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slack Integration Section (Dark) ── */}
      <section className="land-sec integ-dark-section">
        <div className="land-con">
          <div className="integ-slack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <FadeIn>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 100,
                  background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)',
                  fontSize: 12, color: '#10b981', fontWeight: 600, marginBottom: 24,
                }}>
                  Coming Soon / Future Goals
                </div>
                <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-.03em', marginBottom: 16, color: '#f1f5f9' }}>
                  Automatically Send Release Notes to{' '}
                  <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400, color: '#10b981' }}>Slack</span>
                </h2>
                <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.65, marginBottom: 32 }}>
                  Configure once, publish forever. Every time you generate release notes, Releaslyy can automatically post a formatted summary to your chosen Slack channels.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    'Choose channels for different audiences (dev, product, customers)',
                    'Pick a summary format that fits your team culture',
                    'Toggle auto-publish per release or per channel',
                  ].map((text) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 11, background: 'rgba(16,185,129,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Check size={13} color="#10b981" />
                      </div>
                      <span style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <SlackConfigMockup />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="land-sec">
        <div className="land-con">
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--land-sky)', textTransform: 'uppercase', letterSpacing: '.12em' }}>How it works</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-.03em', marginTop: 12, color: 'var(--land-text)' }}>
                Three steps to{' '}
                <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400 }}>effortless</span>
                {' '}DevRev releases
              </h2>
            </div>
          </FadeIn>
          <div className="integ-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { num: '01', title: 'Connect Your Tools', desc: 'Link your DevRev workspace (and optionally GitHub, Jira). Releaslyy syncs your tickets, sprints, and work items.', color: 'var(--land-sky)' },
              { num: '02', title: 'AI Analyzes Everything', desc: 'Our AI reads DevRev work items, sprint items, and linked issues to understand what shipped, why it matters, and who it affects.', color: 'var(--land-accent)' },
              { num: '03', title: 'Generate & Publish', desc: 'Review the AI draft, customize the tone, then publish -- to Slack, GitHub Releases, DevRev, email, or your changelog page.', color: 'var(--land-warm)' },
            ].map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.12}>
                <div style={{
                  padding: 32, borderRadius: 14, background: 'var(--land-card)', border: '1px solid var(--land-border)',
                  position: 'relative', overflow: 'hidden', height: '100%',
                }}>
                  <div className="integ-step-number">{s.num}</div>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <span style={{ fontFamily: 'var(--land-mono)', fontSize: 14, fontWeight: 700, color: s.color }}>{s.num}</span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-.02em', marginBottom: 8, color: 'var(--land-text)' }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--land-muted)', lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="land-sec">
        <div className="land-con">
          <FadeIn>
            <div className="land-cta-box" style={{
              textAlign: 'center', padding: '64px 32px', borderRadius: 20, position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(135deg,rgba(24,24,27,.02) 0%,rgba(16,185,129,.04) 100%)',
              border: '1px solid rgba(24,24,27,.08)',
            }}>
              <div className="land-orb" style={{ width: 400, height: 400, opacity: 0.06, background: 'radial-gradient(circle,rgba(16,185,129,.4),transparent)', top: -150, left: '50%', marginLeft: -200 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-.03em', marginBottom: 16, color: 'var(--land-text)' }}>
                  Stop writing release notes manually
                </h2>
                <p style={{ fontSize: 16, color: 'var(--land-muted)', maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.6 }}>
                  Connect DevRev, let AI do the writing, and publish to Slack and everywhere else -- in seconds. Free to start, no credit card required.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate('/signup')} className="land-btn land-btn-p">Get started for free {I.arrow}</button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
