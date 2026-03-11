import { useNavigate } from "react-router-dom";
import FadeIn from "./FadeIn";
import { I } from "./Icons";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="land-sec">
      <div className="land-con">
        <FadeIn>
          <div style={{
            textAlign: "center", padding: "64px 32px", borderRadius: 20, position: "relative", overflow: "hidden",
            background: "linear-gradient(135deg,rgba(24,24,27,.02) 0%,rgba(99,102,241,.04) 100%)",
            border: "1px solid rgba(24,24,27,.08)",
          }}>
            <div className="land-orb" style={{ width: 400, height: 400, opacity: .06, background: "radial-gradient(circle,rgba(99,102,241,.4),transparent)", top: -150, left: "50%", marginLeft: -200 }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-.03em", marginBottom: 16, color: "var(--land-text)" }}>
                Stop writing release notes manually
              </h2>
              <p style={{ fontSize: 16, color: "var(--land-muted)", maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.6 }}>
                Connect your tools, let AI do the writing, and publish everywhere — in seconds. Free to start, no credit card required.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => navigate('/login')} className="land-btn land-btn-p">Get started for free {I.arrow}</button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
