import FadeIn from "./FadeIn";

export default function SocialProof() {
  return (
    <section className="land-sec" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div className="land-con">
        <FadeIn>
          <p style={{ textAlign: "center", fontSize: 13, color: "var(--land-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 32 }}>
            Trusted by fast-moving teams
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 48, flexWrap: "wrap", opacity: .25 }}>
            {["Vercel", "Supabase", "Raycast", "Linear", "Resend"].map((l) => (
              <span key={l} style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-.02em", color: "var(--land-text)" }}>{l}</span>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div style={{
            maxWidth: 560, margin: "48px auto 0", textAlign: "center", padding: 32,
            borderRadius: 16, background: "var(--land-card)", border: "1px solid var(--land-border)",
          }}>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--land-text)", fontStyle: "italic", fontFamily: "var(--land-serif)", marginBottom: 16 }}>
              "We used to copy-paste from Jira tickets into a Google Doc. Now Releaslyy pulls everything — commits, sprints, the lot — and writes release notes better than we ever did."
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 32, background: "linear-gradient(135deg,var(--land-primary),var(--land-accent))" }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Sarah Chen</div>
                <div style={{ fontSize: 12, color: "var(--land-muted)" }}>Head of Product, Acme Inc.</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
