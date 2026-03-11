import FadeIn from "./FadeIn";

export default function ProductDemo() {
  return (
    <section className="land-sec" style={{ position: "relative" }}>
      <div className="land-orb" style={{ width: 500, height: 500, opacity: .04, background: "radial-gradient(circle,rgba(14,165,233,.4),transparent)", top: "50%", right: -200, marginTop: -250 }} />
      <div className="land-con" style={{ position: "relative", zIndex: 2 }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--land-warm)", textTransform: "uppercase", letterSpacing: ".12em" }}>Demo</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-.03em", marginTop: 12, color: "var(--land-text)" }}>
              From scattered data to{" "}
              <span style={{ fontFamily: "var(--land-serif)", fontStyle: "italic", fontWeight: 400 }}>clarity</span>
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, maxWidth: 920, margin: "0 auto" }}>
          <FadeIn delay={0.1}>
            <div style={{ borderRadius: 14, background: "var(--land-card)", border: "1px solid var(--land-border)", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--land-border)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 8, background: "var(--land-warm)" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--land-muted)" }}>Raw Input Sources</span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--land-text)", opacity: .4, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>GitHub Commits</div>
                  <div style={{ fontFamily: "var(--land-mono)", fontSize: 12, lineHeight: 1.8, color: "var(--land-muted)" }}>
                    {["feat: add ai grouping for commits", "feat(slack): webhook integration", "fix: dedupe on merge events"].map((c) => (
                      <div key={c} style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--land-accent)", opacity: .5 }}>$</span>{c}</div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--land-text)", opacity: .4, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>Jira Sprint 24</div>
                  <div style={{ fontSize: 12, lineHeight: 1.8, color: "var(--land-muted)" }}>
                    {[{ key: "PROD-142", s: "Improve onboarding flow" }, { key: "PROD-155", s: "Dashboard perf optimization" }].map((t) => (
                      <div key={t.key} style={{ display: "flex", gap: 8 }}>
                        <span style={{ color: "var(--land-sky)", fontFamily: "var(--land-mono)", fontSize: 11 }}>{t.key}</span><span>{t.s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--land-text)", opacity: .4, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".06em" }}>DevRev Sprint</div>
                  <div style={{ fontSize: 12, lineHeight: 1.8, color: "var(--land-muted)" }}>
                    {[{ key: "ISS-89", s: "User-facing API rate limiting" }, { key: "ISS-91", s: "Fix SSO redirect loop" }].map((t) => (
                      <div key={t.key} style={{ display: "flex", gap: 8 }}>
                        <span style={{ color: "var(--land-teal)", fontFamily: "var(--land-mono)", fontSize: 11 }}>{t.key}</span><span>{t.s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div style={{ borderRadius: 14, background: "var(--land-card)", border: "1px solid var(--land-border)", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--land-border)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 8, background: "var(--land-teal)" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--land-muted)" }}>Generated Release Notes</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                  {["GH", "EM"].map((d) => (
                    <span key={d} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(24,24,27,.05)", color: "var(--land-text)", fontWeight: 600, fontFamily: "var(--land-mono)" }}>{d}</span>
                  ))}
                </div>
              </div>
              <pre style={{ padding: 16, fontFamily: "var(--land-mono)", fontSize: 12, lineHeight: 1.7, color: "var(--land-text)", whiteSpace: "pre-wrap", margin: 0, opacity: .8 }}>
{`## v2.4.0 — March 10, 2026

### Features
- **AI commit grouping** — Smart categorization
  that clusters related changes together
- **Slack notifications** — Get pinged when a
  release is published
- **API rate limiting** — User-facing endpoints
  now support configurable rate limits

### Improvements
- Redesigned onboarding flow for faster setup
- Dashboard loads 40% faster

### Bug Fixes
- Fixed duplicate entries on PR merge
- Resolved SSO redirect loop on Safari`}
              </pre>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
