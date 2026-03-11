import { useNavigate } from "react-router-dom";
import FadeIn from "./FadeIn";
import { I } from "./Icons";

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free", price: "$0", period: "forever", desc: "For indie devs and side projects",
      features: ["1 source integration", "50 releases/mo", "Basic AI summaries", "Public changelog page", "Community support"],
      cta: "Get Started", accent: false,
    },
    {
      name: "Pro", price: "$19", period: "/month", desc: "For growing teams shipping fast",
      features: ["Unlimited integrations", "Unlimited releases", "Advanced AI summaries", "Auto-publish to all platforms", "Email notifications", "Custom branding", "Priority support"],
      cta: "Start Free Trial", accent: true, popular: true,
    },
    {
      name: "Team", price: "$49", period: "/month", desc: "For teams that need collaboration",
      features: ["Everything in Pro", "5 team members", "Review & approval workflow", "API & webhook access", "SSO & audit logs", "Dedicated support"],
      cta: "Contact Sales", accent: false,
    },
  ];

  return (
    <section className="land-sec" id="pricing" style={{ position: "relative" }}>
      <div className="land-orb" style={{ width: 600, height: 600, opacity: .04, background: "radial-gradient(circle,rgba(99,102,241,.3),transparent)", top: "50%", left: "50%", marginLeft: -300, marginTop: -300 }} />
      <div className="land-con" style={{ position: "relative", zIndex: 2 }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--land-accent)", textTransform: "uppercase", letterSpacing: ".12em" }}>Pricing</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-.03em", marginTop: 12, color: "var(--land-text)" }}>
              Simple, transparent{" "}
              <span style={{ fontFamily: "var(--land-serif)", fontStyle: "italic", fontWeight: 400 }}>pricing</span>
            </h2>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, maxWidth: 960, margin: "0 auto" }}>
          {plans.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.1}>
              <div style={{
                padding: 32, borderRadius: 14, position: "relative", height: "100%",
                background: p.accent ? "linear-gradient(180deg,rgba(24,24,27,.02) 0%,var(--land-card) 100%)" : "var(--land-card)",
                border: p.accent ? "1px solid rgba(24,24,27,.15)" : "1px solid var(--land-border)",
                display: "flex", flexDirection: "column",
                boxShadow: p.accent ? "0 8px 30px rgba(0,0,0,.06)" : "none",
              }}>
                {p.popular && (
                  <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", padding: "4px 14px", borderRadius: 100, background: "var(--land-primary)", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: ".04em" }}>MOST POPULAR</div>
                )}
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: "var(--land-text)" }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-.03em", color: "var(--land-text)" }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: "var(--land-muted)" }}>{p.period}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--land-muted)", marginBottom: 24, lineHeight: 1.5 }}>{p.desc}</p>
                <div style={{ flex: 1 }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 14, color: "var(--land-text)" }}>
                      <span style={{ color: "var(--land-teal)", display: "flex", flexShrink: 0 }}>{I.check}</span>{f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className={`land-btn ${p.accent ? "land-btn-p" : "land-btn-s"}`}
                  style={{ width: "100%", justifyContent: "center", marginTop: 24 }}
                >{p.cta}</button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
