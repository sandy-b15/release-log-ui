import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FadeIn from "./FadeIn";
import { I } from "./Icons";
import api from '../../lib/api';
import { buildFeatures } from '../../lib/planFeatures';

export default function Pricing() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.get('/plans')
      .then(r => {
        // Show first 3 non-hidden plans for landing page
        const visible = (r.data || []).filter(p => p.status !== 'hidden').slice(0, 3);
        setPlans(visible);
      })
      .catch(() => {});
  }, []);

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
          {plans.map((p, i) => {
            const price = p.price_usd_monthly ? p.price_usd_monthly / 100 : 0;
            const isComingSoon = p.status === 'coming_soon';
            return (
              <FadeIn key={p.slug} delay={i * 0.1}>
                <div style={{
                  padding: 32, borderRadius: 14, position: "relative", height: "100%",
                  background: p.featured ? "linear-gradient(180deg,rgba(24,24,27,.02) 0%,var(--land-card) 100%)" : "var(--land-card)",
                  border: p.featured ? "1px solid rgba(24,24,27,.15)" : "1px solid var(--land-border)",
                  display: "flex", flexDirection: "column",
                  boxShadow: p.featured ? "0 8px 30px rgba(0,0,0,.06)" : "none",
                  opacity: isComingSoon ? 0.7 : 1,
                }}>
                  {p.featured && (
                    <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", padding: "4px 14px", borderRadius: 100, background: "var(--land-primary)", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: ".04em" }}>MOST POPULAR</div>
                  )}
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: "var(--land-text)" }}>{p.display_name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-.03em", color: "var(--land-text)" }}>
                      ${price > 0 ? price : 0}
                    </span>
                    <span style={{ fontSize: 14, color: "var(--land-muted)" }}>
                      {price === 0 ? '/forever' : '/month'}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "var(--land-muted)", marginBottom: 24, lineHeight: 1.5 }}>{p.description}</p>
                  <div style={{ flex: 1 }}>
                    {buildFeatures(p.entitlements).map((f) => (
                      <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 14, color: f.soon ? "var(--land-muted)" : "var(--land-text)" }}>
                        <span style={{ color: "var(--land-teal)", display: "flex", flexShrink: 0 }}>{I.check}</span>
                        {f.text}
                        {f.soon && <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 6px', borderRadius: 4, background: '#fef3c7', color: '#92400e', marginLeft: 4 }}>Soon</span>}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(isComingSoon ? '/pricing' : '/login')}
                    className={`land-btn ${p.featured ? "land-btn-p" : "land-btn-s"}`}
                    style={{ width: "100%", justifyContent: "center", marginTop: 24 }}
                  >{p.cta_text || (isComingSoon ? 'Coming soon' : 'Get Started')}</button>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
