import FadeIn from "./FadeIn";
import { I } from "./Icons";
import { SOURCES } from "./data";
import { useNavigate } from "react-router-dom";

function DashboardMockup() {
  return (
    <div style={{ padding: "20px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57","#ffbd2e","#28c840"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: 10, background: c, opacity: .7 }} />)}
        </div>
        <div style={{ flex: 1, textAlign: "center", fontSize: 12, color: "var(--land-muted)", fontFamily: "var(--land-mono)" }}>app.releasly.io/releases</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, paddingBottom: 20 }}>
        <div style={{ background: "rgba(0,0,0,.02)", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--land-muted)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>Sources</div>
          {SOURCES.map((s, i) => (
            <div key={s.name} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8, marginBottom: 4,
              background: i === 0 ? "rgba(99,102,241,.04)" : "transparent",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 6, background: s.color, opacity: .6 }} />
              <span style={{ fontSize: 12, color: i === 0 ? "var(--land-text)" : "var(--land-muted)", fontWeight: i === 0 ? 500 : 400 }}>{s.name}</span>
              {i === 0 && <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--land-teal)", fontFamily: "var(--land-mono)" }}>synced</span>}
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--land-border)", margin: "10px 0", paddingTop: 10, fontSize: 11, fontWeight: 600, color: "var(--land-muted)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Releases</div>
          {["v2.4.0", "v2.3.1", "v2.3.0"].map((v, i) => (
            <div key={v} style={{
              padding: "7px 10px", borderRadius: 8, marginBottom: 4, fontSize: 12, fontFamily: "var(--land-mono)",
              background: i === 0 ? "rgba(24,24,27,.04)" : "transparent",
              color: i === 0 ? "var(--land-text)" : "var(--land-muted)", fontWeight: i === 0 ? 600 : 400,
            }}>{v} {i === 0 && <span style={{ fontSize: 9, opacity: .5 }}>latest</span>}</div>
          ))}
        </div>
        <div style={{ background: "rgba(0,0,0,.02)", borderRadius: 10, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-.02em" }}>v2.4.0</div>
              <div style={{ fontSize: 12, color: "var(--land-muted)", marginTop: 2, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <span>March 10, 2026</span>
                <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <span style={{ width: 5, height: 5, borderRadius: 5, background: "var(--land-text)", opacity: .3 }} /> 14 commits
                </span>
                <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <span style={{ width: 5, height: 5, borderRadius: 5, background: "var(--land-sky)", opacity: .5 }} /> 6 Jira tickets
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(16,185,129,.08)", color: "var(--land-teal)", fontSize: 11, fontWeight: 600 }}>Published</div>
              <div style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(245,158,11,.08)", color: "var(--land-warm)", fontSize: 11, fontWeight: 600 }}>Emailed</div>
            </div>
          </div>
          {[
            { cat: "Features", color: "var(--land-teal)", items: ["AI-powered commit grouping for smarter categorization", "Slack integration for automatic release notifications"] },
            { cat: "Improvements", color: "var(--land-sky)", items: ["Reduced changelog generation time by 40%", "Better markdown rendering in preview mode"] },
            { cat: "Bug Fixes", color: "var(--land-warm)", items: ["Fixed duplicate entries when merging PRs", "Resolved timezone offset in release dates"] },
          ].map((g) => (
            <div key={g.cat} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: g.color, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: 6, background: g.color }} />{g.cat}
              </div>
              {g.items.map((it) => (
                <div key={it} style={{ fontSize: 13, color: "var(--land-muted)", paddingLeft: 12, marginBottom: 3, lineHeight: 1.6 }}>• {it}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="land-sec" style={{ paddingTop: 160, paddingBottom: 60, textAlign: "center", overflow: "hidden" }}>
      <div className="land-orb" style={{ width: 600, height: 600, opacity: .07, background: "radial-gradient(circle,rgba(99,102,241,.5),transparent)", top: -100, left: "50%", marginLeft: -300, animation: "land-pulse 6s ease-in-out infinite" }} />
      <div className="land-orb" style={{ width: 400, height: 400, opacity: .05, background: "radial-gradient(circle,rgba(139,92,246,.4),transparent)", top: 200, right: -100, animation: "land-pulse 8s ease-in-out infinite 2s" }} />

      <div className="land-con" style={{ position: "relative", zIndex: 2 }}>
        <FadeIn>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100,
            background: "rgba(24,24,27,.04)", border: "1px solid rgba(24,24,27,.1)",
            fontSize: 13, color: "var(--land-text)", fontWeight: 500, marginBottom: 32,
          }}>
            <span style={{ display: "flex", color: "var(--land-accent)" }}>{I.sparkle}</span>
            Now with Jira, DevRev &amp; Zoho integrations
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 style={{
            fontSize: "clamp(40px, 6vw, 74px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-.035em",
            maxWidth: 860, margin: "0 auto 24px", color: "var(--land-text)",
          }}>
            Your tools talk,{" "}
            <span style={{ fontFamily: "var(--land-serif)", fontStyle: "italic", fontWeight: 400, background: "linear-gradient(135deg,var(--land-primary),var(--land-accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Releasly writes
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{ fontSize: 18, color: "var(--land-muted)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.65 }}>
            Connect GitHub, Jira, DevRev, or Zoho Sprints. AI generates beautiful release notes — then publishes them right back to your platforms and customers.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate('/login')} className="land-btn land-btn-p">Start for free {I.arrow}</button>
            <a href="#integrations" className="land-btn land-btn-s">
              <span style={{ display: "flex", color: "var(--land-muted)" }}>{I.plug}</span>
              View Integrations
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 36 }}>
            {SOURCES.map((s) => (
              <div key={s.name} className="land-platform-pill">
                <div className="land-dot" style={{ background: s.bg, color: s.color }}>
                  {s.logo ? <img src={s.logo} alt={s.name} style={{ width: 14, height: 14, objectFit: "contain" }} /> : s.abbr}
                </div>
                {s.name}
              </div>
            ))}
            <div className="land-platform-pill" style={{ borderStyle: "dashed", opacity: 0.5 }}>
              <div className="land-dot" style={{ background: "rgba(0,0,0,.04)", color: "var(--land-muted)" }}>+</div>
              More soon
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div style={{
            marginTop: 56, borderRadius: 16, border: "1px solid var(--land-border)",
            background: "linear-gradient(180deg,var(--land-card) 0%,var(--land-bg) 100%)",
            overflow: "hidden",
            boxShadow: "0 0 0 1px rgba(0,0,0,.03), 0 20px 60px -15px rgba(0,0,0,.08)",
          }}>
            <DashboardMockup />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
