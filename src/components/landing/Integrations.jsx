import FadeIn from "./FadeIn";
import { SOURCES, DESTINATIONS } from "./data";
import logoR from "../../assets/logos/releaslyy-favicon.svg";

export default function Integrations() {
  return (
    <section className="land-sec" id="integrations" style={{ position: "relative", overflow: "hidden" }}>
      <div className="land-orb" style={{ width: 500, height: 500, opacity: .05, background: "radial-gradient(circle,rgba(14,165,233,.4),transparent)", top: "50%", left: "50%", marginLeft: -250, marginTop: -250 }} />
      <div className="land-con" style={{ position: "relative", zIndex: 2 }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--land-sky)", textTransform: "uppercase", letterSpacing: ".12em" }}>Integrations</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-.03em", marginTop: 12, color: "var(--land-text)" }}>
              Your entire stack,{" "}
              <span style={{ fontFamily: "var(--land-serif)", fontStyle: "italic", fontWeight: 400 }}>connected</span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--land-muted)", maxWidth: 500, margin: "16px auto 0", lineHeight: 1.6 }}>
              Pull from any source. Publish to any destination. Releaslyy sits at the center of your release workflow.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="land-int-grid">
            <div className="land-int-col-left">
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--land-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4, textAlign: "right", width: "100%" }}>Collect From</div>
              {SOURCES.map((s, i) => (
                <FadeIn key={s.name} delay={0.2 + i * 0.06} style={{ width: "100%" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10,
                    background: "var(--land-card)", border: "1px solid var(--land-border)", justifyContent: "flex-end",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--land-text)" }}>{s.name}</span>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: s.color, flexShrink: 0 }}>
                      {s.logo ? <img src={s.logo} alt={s.name} style={{ width: 18, height: 18, objectFit: "contain" }} /> : s.abbr}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.3}>
              <div className="land-int-center" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative", width: 100, height: 100 }}>
                  <svg width="100" height="100" viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, animation: "land-spin 20s linear infinite" }}>
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(24,24,27,.08)" strokeWidth="1.5" strokeDasharray="8 6" />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 12, borderRadius: "50%",
                    background: "linear-gradient(135deg,rgba(24,24,27,.04),rgba(99,102,241,.06))",
                    border: "1px solid rgba(24,24,27,.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,var(--land-primary),var(--land-accent))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={logoR} alt="Releaslyy" style={{ width: 18, height: 18, objectFit: "contain" }} />
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-.01em", color: "var(--land-text)" }}>Releaslyy AI</div>
              </div>
            </FadeIn>

            <div className="land-int-col-right">
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--land-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4, width: "100%" }}>Publish To</div>
              {DESTINATIONS.map((d, i) => (
                <FadeIn key={d.name} delay={0.2 + i * 0.06} style={{ width: "100%" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10,
                    background: "var(--land-card)", border: "1px solid var(--land-border)",
                  }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: d.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: d.color, flexShrink: 0 }}>
                      {d.logo ? <img src={d.logo} alt={d.name} style={{ width: 18, height: 18, objectFit: "contain" }} /> : d.abbr}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--land-text)" }}>{d.name}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <p style={{ textAlign: "center", fontSize: 14, color: "var(--land-muted)", marginTop: 24 }}>
            More integrations coming soon — Slack, Linear, Notion, and more.{" "}
            <a href="/integrations#request" onClick={(e) => {
              e.preventDefault();
              navigate("/integrations#request");
            }} style={{ color: "var(--land-accent)", fontWeight: 500, borderBottom: "1px dashed rgba(99,102,241,.3)" }}>Request an integration</a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
