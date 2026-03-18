import { useNavigate } from "react-router-dom";
import FadeIn from "./FadeIn";
import { SOURCES, DESTINATIONS } from "./data";
import logoR from "../../assets/logos/releaslyy-favicon.svg";

function SourceCard({ s, i }) {
  return (
    <FadeIn delay={0.2 + i * 0.08} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
      <div className={`land-int-card${i === 0 ? ' land-int-card--active' : ''}`}
        style={{ justifyContent: "flex-end", animationDelay: `${i * 0.2}s` }}
      >
        <div style={{ textAlign: "right", flex: 1 }}>
          <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--land-text)" }}>{s.name}</span>
          {i === 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--land-accent)", textTransform: "uppercase", letterSpacing: ".06em" }}>Active Stream</span>
          )}
        </div>
        <div className="land-int-icon" style={{ background: s.bg, borderColor: s.color + '30' }}>
          {s.logo ? <img src={s.logo} alt={s.name} style={{ width: 22, height: 22, objectFit: "contain" }} /> : <span style={{ fontSize: 12, fontWeight: 800, color: s.color }}>{s.abbr}</span>}
        </div>
      </div>
    </FadeIn>
  );
}

function DestCard({ d, i }) {
  return (
    <FadeIn delay={0.2 + i * 0.08} style={{ width: "100%" }}>
      <div className={`land-int-card${i === 0 ? ' land-int-card--active' : ''}`}
        style={{ animationDelay: `${i * 0.2 + 0.1}s` }}
      >
        <div className="land-int-icon" style={{ background: d.bg, borderColor: d.color + '30' }}>
          {d.logo ? <img src={d.logo} alt={d.name} style={{ width: 22, height: 22, objectFit: "contain" }} /> : <span style={{ fontSize: 12, fontWeight: 800, color: d.color }}>{d.abbr}</span>}
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--land-text)" }}>{d.name}</span>
          {i === 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: "var(--land-accent2)", textTransform: "uppercase", letterSpacing: ".06em" }}>Sync Active</span>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

export default function Integrations() {
  const navigate = useNavigate();

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
            {/* Left Column — Collect From */}
            <div className="land-int-col-left">
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", width: "100%", marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: 6, background: "var(--land-accent)", animation: "land-pulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--land-muted)", textTransform: "uppercase", letterSpacing: ".15em" }}>Collect From</span>
              </div>
              {SOURCES.map((s, i) => <SourceCard key={s.name} s={s} i={i} />)}
            </div>

            {/* Center — Releaslyy AI Hub */}
            <FadeIn delay={0.3}>
              <div className="land-int-center">
                <div className="land-int-hub">
                  {/* Spinning dashed orbit */}
                  <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: "absolute", inset: -10, animation: "land-spin 20s linear infinite" }}>
                    <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(99,102,241,.15)" strokeWidth="1.5" strokeDasharray="8 6" />
                  </svg>
                  {/* Orbiting dot */}
                  <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: "absolute", inset: -10, animation: "land-spin 8s linear infinite" }}>
                    <circle cx="60" cy="4" r="4" fill="var(--land-accent)" opacity="0.6" />
                  </svg>
                  {/* Glow */}
                  <div style={{ position: "absolute", inset: -20, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,.15), transparent)", animation: "land-pulse 4s ease-in-out infinite", pointerEvents: "none" }} />
                  {/* Inner circle */}
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: "var(--land-card)", border: "2px solid var(--land-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 40px rgba(99,102,241,.15)",
                    position: "relative", zIndex: 2,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "linear-gradient(135deg,var(--land-primary),var(--land-accent))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 20px rgba(99,102,241,.3)",
                    }}>
                      <img src={logoR} alt="Releaslyy" style={{ width: 22, height: 22, objectFit: "contain" }} />
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <div style={{
                    fontSize: 18, fontWeight: 800, letterSpacing: "-.02em",
                    background: "linear-gradient(135deg, var(--land-accent), var(--land-accent2))",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>Releaslyy AI</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: 5, background: "var(--land-teal)", animation: "land-pulse 2s ease-in-out infinite" }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--land-muted)" }}>Processing releases</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right Column — Publish To */}
            <div className="land-int-col-right">
              <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--land-muted)", textTransform: "uppercase", letterSpacing: ".15em" }}>Publish To</span>
                <div style={{ width: 6, height: 6, borderRadius: 6, background: "var(--land-accent2)", animation: "land-pulse 2s ease-in-out infinite" }} />
              </div>
              {DESTINATIONS.map((d, i) => <DestCard key={d.name} d={d} i={i} />)}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <p style={{ textAlign: "center", fontSize: 14, color: "var(--land-muted)", marginTop: 32 }}>
            Now supporting Linear, Asana, ClickUp, Monday.com, and more.{" "}
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
