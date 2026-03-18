import { useNavigate } from 'react-router-dom';
import { Sparkles, Cable, Send, Check, ChevronDown, LayoutDashboard, Layers, ListChecks, GitBranch } from 'lucide-react';
import Nav from '../../components/landing/Nav';
import Footer from '../../components/landing/Footer';
import FadeIn from '../../components/landing/FadeIn';
import SEO from '../../components/SEO';
import { I } from '../../components/landing/Icons';
import mondayLogo from '../../assets/monday-logo.svg';
import githubLogo from '../../assets/github.png';
import jiraLogo from '../../assets/jira_logo.webp';
import devrevLogo from '../../assets/devrev-logo.webp';
import linearLogo from '../../assets/linear-logo.svg';
import asanaLogo from '../../assets/asana-logo.svg';
import clickupLogo from '../../assets/clickup-logo.svg';
import '../Landing/LandingPage.css';
import './IntegrationLanding.css';

/* ── App Mockup (Monday-focused) ── */
function MondayMockup() {
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
            { name: 'Monday', color: '#ff3d57', active: true },
            { name: 'GitHub', color: '#18181b', active: false },
            { name: 'Jira', color: '#0ea5e9', active: false },
          ].map((s) => (
            <div key={s.name} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, marginBottom: 4,
              background: s.active ? 'rgba(255,61,87,.04)' : 'transparent',
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
                <span>March 12, 2026</span>
                <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ width: 5, height: 5, borderRadius: 5, background: '#ff3d57', opacity: 0.5 }} /> 12 Items from Monday.com
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(16,185,129,.08)', color: 'var(--land-teal)', fontSize: 11, fontWeight: 600 }}>Synced</div>
              <div style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(14,165,233,.08)', color: 'var(--land-sky)', fontSize: 11, fontWeight: 600 }}>Draft</div>
            </div>
          </div>

          {[
            { cat: 'New Features', color: 'var(--land-teal)', items: ['#1234: Automated approval workflow for deployments', '#1235: Custom dashboard widget builder'] },
            { cat: 'Improvements', color: 'var(--land-sky)', items: ['#1238: Board loading time reduced by 60%', '#1239: Enhanced column formula support'] },
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

/* ── Monday Publish Config Mockup ── */
function MondayPublishMockup() {
  return (
    <div style={{
      background: '#1e293b', borderRadius: 14, border: '1px solid rgba(255,255,255,.08)',
      padding: 24, maxWidth: 380, width: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,61,87,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LayoutDashboard size={16} color="#ff3d57" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>Monday.com Publish</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Board & item settings</div>
        </div>
      </div>

      {/* Board selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Target Board</div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px',
          background: 'rgba(255,255,255,.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,.08)',
        }}>
          <span style={{ fontSize: 13, color: '#e2e8f0' }}>Release Notes Board</span>
          <ChevronDown size={14} color="#64748b" />
        </div>
      </div>

      {/* Group selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>Group</div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px',
          background: 'rgba(255,255,255,.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,.08)',
        }}>
          <span style={{ fontSize: 13, color: '#e2e8f0' }}>March 2026</span>
          <ChevronDown size={14} color="#64748b" />
        </div>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <span style={{ fontSize: 13, color: '#cbd5e1' }}>Include HTML update</span>
        <div style={{
          width: 40, height: 22, borderRadius: 11, background: '#ff3d57', position: 'relative', cursor: 'pointer',
        }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: '#fff', position: 'absolute', top: 2, right: 2, transition: 'all .2s' }} />
        </div>
      </div>
    </div>
  );
}

/* ── Sample Release Notes Preview ── */
function SampleReleasePreview() {
  return (
    <div style={{
      borderRadius: 14, border: '1px solid var(--land-border)',
      background: 'var(--land-card)', padding: 28, maxWidth: 640, margin: '0 auto',
      boxShadow: '0 0 0 1px rgba(0,0,0,.03), 0 12px 40px -10px rgba(0,0,0,.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 8, height: 8, borderRadius: 8, background: '#ff3d57' }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--land-text)' }}>Generated from Monday.com</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--land-muted)', fontFamily: 'var(--land-mono)' }}>v2.4.0 - March 2026</span>
      </div>

      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--land-text)', letterSpacing: '-.02em' }}>What&apos;s New in v2.4.0</div>

      {[
        { cat: 'New Features', color: 'var(--land-teal)', items: [
          'Automated approval workflow for deployments — streamlines multi-stage release pipelines with configurable gates',
          'Custom dashboard widget builder — create personalized views with drag-and-drop components',
        ]},
        { cat: 'Improvements', color: 'var(--land-sky)', items: [
          'Board loading performance improved by 60% through optimized query batching',
          'Enhanced column formula support with 12 new functions and better error messages',
        ]},
        { cat: 'Bug Fixes', color: 'var(--land-warm)', items: [
          'Fixed item duplication when moving between groups during bulk operations',
        ]},
      ].map((g) => (
        <div key={g.cat} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: g.color, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: 6, background: g.color }} />{g.cat}
          </div>
          {g.items.map((it) => (
            <div key={it} style={{ fontSize: 13, color: 'var(--land-muted)', paddingLeft: 12, marginBottom: 4, lineHeight: 1.65 }}>- {it}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function MondayLanding() {
  const navigate = useNavigate();

  return (
    <div className="landing-root">
      <SEO
        title="Monday.com Integration — AI Release Notes from Boards & Items"
        description="Generate release notes from Monday.com boards and items automatically. AI-powered changelog from your Monday workspace. Connect Monday.com, generate, publish everywhere."
        keywords="monday.com release notes, monday changelog, monday integration, generate release notes from monday, monday ai release notes, monday board release notes, automated release notes monday, monday.com release notes generator"
        canonical="https://releaslyy.com/integrations/monday"
      />
      <div className="land-noise" />
      <Nav />

      {/* ── Hero Section ── */}
      <section className="land-sec land-hero-sec integ-hero-gradient" style={{ paddingTop: 160, paddingBottom: 60, textAlign: 'center', overflow: 'hidden' }}>
        <div className="land-orb" style={{ width: 600, height: 600, opacity: 0.07, background: 'radial-gradient(circle,rgba(255,61,87,.5),transparent)', top: -100, left: '50%', marginLeft: -300, animation: 'land-pulse 6s ease-in-out infinite' }} />
        <div className="land-orb" style={{ width: 400, height: 400, opacity: 0.05, background: 'radial-gradient(circle,rgba(99,102,241,.4),transparent)', top: 200, right: -100, animation: 'land-pulse 8s ease-in-out infinite 2s' }} />

        <div className="land-con" style={{ position: 'relative', zIndex: 2 }}>
          <FadeIn>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100,
              background: 'rgba(255,61,87,.06)', border: '1px solid rgba(255,61,87,.2)',
              fontSize: 13, color: '#ff3d57', fontWeight: 500, marginBottom: 32,
            }}>
              <Sparkles size={14} />
              Now supporting Monday.com — Boards, Groups &amp; Items
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 style={{
              fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-.035em',
              maxWidth: 820, margin: '0 auto 24px', color: 'var(--land-text)',
            }}>
              Generate Release Notes from Monday.com Items{' '}
              <span style={{
                fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400,
                background: 'linear-gradient(135deg, #ff3d57, var(--land-accent))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                with AI
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="land-hero-subtitle" style={{ fontSize: 18, color: 'var(--land-muted)', maxWidth: 580, margin: '0 auto 40px', lineHeight: 1.65 }}>
              Connect your Monday.com workspace, select boards and items, and let AI transform your work into polished release notes in seconds.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="integ-hero-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/signup')} className="land-btn land-btn-p">Start for free {I.arrow}</button>
              <button onClick={() => navigate('/docs')} className="land-btn land-btn-s">
                <span style={{ display: 'flex', color: 'var(--land-muted)' }}>{I.plug}</span>
                View Monday Setup
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="integ-logos-row" style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
              {[
                { src: mondayLogo, alt: 'Monday.com', label: 'Monday' },
                { src: githubLogo, alt: 'GitHub', label: 'GitHub' },
                { src: jiraLogo, alt: 'Jira', label: 'Jira' },
                { src: devrevLogo, alt: 'DevRev', label: 'DevRev' },
                { src: linearLogo, alt: 'Linear', label: 'Linear' },
                { src: asanaLogo, alt: 'Asana', label: 'Asana' },
                { src: clickupLogo, alt: 'ClickUp', label: 'ClickUp' },
              ].map((logo) => (
                <div key={logo.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={logo.src} alt={logo.alt} style={{ width: 28, height: 28, objectFit: 'contain' }} />
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
              <MondayMockup />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── What Data We Pull Section ── */}
      <section className="land-sec" style={{ position: 'relative' }}>
        <div className="land-orb" style={{ width: 500, height: 500, opacity: 0.05, background: 'radial-gradient(circle,rgba(255,61,87,.4),transparent)', bottom: -100, right: -100 }} />
        <div className="land-con" style={{ position: 'relative', zIndex: 2 }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#ff3d57', textTransform: 'uppercase', letterSpacing: '.12em' }}>Data Sources</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-.03em', marginTop: 12, color: 'var(--land-text)' }}>
                What Releaslyy pulls from{' '}
                <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400 }}>Monday.com</span>
              </h2>
            </div>
          </FadeIn>
          <div className="integ-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { icon: <LayoutDashboard size={20} />, title: 'Boards', desc: 'All active boards ordered by recent usage', color: '#ff3d57' },
              { icon: <Layers size={20} />, title: 'Groups', desc: 'Board groups for logical item organization', color: 'var(--land-sky)' },
              { icon: <ListChecks size={20} />, title: 'Items', desc: 'Full item details: name, status, priority, people, tags, and all column values', color: 'var(--land-teal)' },
              { icon: <GitBranch size={20} />, title: 'Subitems', desc: 'Nested subitems for detailed work breakdown', color: 'var(--land-accent)' },
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

      {/* ── Where We Publish Section (Dark) ── */}
      <section className="land-sec integ-dark-section">
        <div className="land-con">
          <div className="integ-slack-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <FadeIn>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 100,
                  background: 'rgba(255,61,87,.1)', border: '1px solid rgba(255,61,87,.2)',
                  fontSize: 12, color: '#ff3d57', fontWeight: 600, marginBottom: 24,
                }}>
                  Publish Everywhere
                </div>
                <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-.03em', marginBottom: 16, color: '#f1f5f9' }}>
                  Publish release notes back to{' '}
                  <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400, color: '#ff3d57' }}>Monday.com</span>
                  {' '}and beyond
                </h2>
                <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.65, marginBottom: 32 }}>
                  Generate once, distribute everywhere. Push your AI-written release notes back to Monday.com boards or any other destination your team uses.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    'Create items on any Monday board with HTML updates',
                    'Publish to GitHub Releases, Slack, and more',
                    'Share via public changelog page',
                    'Export as Markdown, DOCX, or PDF',
                  ].map((text) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 11, background: 'rgba(255,61,87,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Check size={13} color="#ff3d57" />
                      </div>
                      <span style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <MondayPublishMockup />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Sample Release Notes Section ── */}
      <section className="land-sec" style={{ position: 'relative' }}>
        <div className="land-orb" style={{ width: 500, height: 500, opacity: 0.05, background: 'radial-gradient(circle,rgba(255,61,87,.4),transparent)', top: -100, left: -100 }} />
        <div className="land-con" style={{ position: 'relative', zIndex: 2 }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#ff3d57', textTransform: 'uppercase', letterSpacing: '.12em' }}>Preview</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-.03em', marginTop: 12, color: 'var(--land-text)' }}>
                See what AI generates from{' '}
                <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400 }}>Monday.com</span>
                {' '}data
              </h2>
              <p style={{ fontSize: 16, color: 'var(--land-muted)', maxWidth: 520, margin: '16px auto 0', lineHeight: 1.6 }}>
                Releaslyy reads your Monday.com items, understands the context, and writes release notes your team and customers will love.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <SampleReleasePreview />
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
                <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400 }}>Monday.com</span>
                {' '}releases
              </h2>
              <p style={{ fontSize: 16, color: 'var(--land-muted)', maxWidth: 520, margin: '16px auto 0', lineHeight: 1.6 }}>
                Pull items from Monday.com, generate with AI, publish everywhere.
              </p>
            </div>
          </FadeIn>
          <div className="integ-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {[
              { icon: <Sparkles size={20} />, title: 'AI Release Notes', desc: 'Analyzes Monday.com items, groups, and board data — then writes human-readable summaries organized by category.', color: 'var(--land-accent)' },
              { icon: <Cable size={20} />, title: 'Multi-Source Ingestion', desc: 'Pull data from Monday.com, GitHub, Jira, and more. Releaslyy unifies everything into a single release timeline.', color: 'var(--land-sky)' },
              { icon: <Send size={20} />, title: 'Publish Everywhere', desc: 'Push generated notes to Monday.com boards, GitHub Releases, Slack channels, or changelog pages automatically.', color: 'var(--land-teal)' },
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

      {/* ── How It Works Section ── */}
      <section className="land-sec">
        <div className="land-con">
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--land-sky)', textTransform: 'uppercase', letterSpacing: '.12em' }}>How it works</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-.03em', marginTop: 12, color: 'var(--land-text)' }}>
                Three steps to{' '}
                <span style={{ fontFamily: 'var(--land-serif)', fontStyle: 'italic', fontWeight: 400 }}>effortless</span>
                {' '}Monday.com releases
              </h2>
            </div>
          </FadeIn>
          <div className="integ-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { num: '01', title: 'Connect Monday.com', desc: 'Link your Monday.com workspace with one click. Releaslyy syncs your boards, groups, and items automatically.', color: 'var(--land-sky)' },
              { num: '02', title: 'AI Analyzes Items', desc: 'Our AI reads your Monday.com items, subitems, statuses, and column values to understand what shipped and why it matters.', color: 'var(--land-accent)' },
              { num: '03', title: 'Generate & Publish', desc: 'Review the AI draft, customize the tone, then publish -- to Monday.com, GitHub Releases, Slack, or your changelog page.', color: 'var(--land-warm)' },
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
              background: 'linear-gradient(135deg,rgba(24,24,27,.02) 0%,rgba(255,61,87,.04) 100%)',
              border: '1px solid rgba(24,24,27,.08)',
            }}>
              <div className="land-orb" style={{ width: 400, height: 400, opacity: 0.06, background: 'radial-gradient(circle,rgba(255,61,87,.4),transparent)', top: -150, left: '50%', marginLeft: -200 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-.03em', marginBottom: 16, color: 'var(--land-text)' }}>
                  Stop writing release notes manually
                </h2>
                <p style={{ fontSize: 16, color: 'var(--land-muted)', maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.6 }}>
                  Connect Monday.com, let AI do the writing, and publish everywhere -- in seconds. Free to start, no credit card required.
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
