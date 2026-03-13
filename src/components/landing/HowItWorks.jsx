import FadeIn from "./FadeIn";

export default function HowItWorks() {
  const steps = [
    { num: "01", title: "Connect Your Tools", desc: "Link GitHub, Jira, DevRev, Zoho — or any combination. Releaslyy watches for merges, sprint closures, and new tags.", color: "var(--land-sky)" },
    { num: "02", title: "AI Analyzes Everything", desc: "Our AI reads commits, PRs, sprint items, and linked issues across all sources to understand what shipped and why.", color: "var(--land-accent)" },
    { num: "03", title: "Generate & Publish", desc: "Review the draft, customize the tone, then publish — back to GitHub Releases, DevRev, Jira, email, or your changelog page.", color: "var(--land-warm)" },
  ];

  return (
    <section className="land-sec">
      <div className="land-con">
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--land-sky)", textTransform: "uppercase", letterSpacing: ".12em" }}>How it works</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-.03em", marginTop: 12, color: "var(--land-text)" }}>
              Three steps to{" "}
              <span style={{ fontFamily: "var(--land-serif)", fontStyle: "italic", fontWeight: 400 }}>effortless</span>{" "}releases
            </h2>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {steps.map((s, i) => (
            <FadeIn key={s.num} delay={i * 0.12}>
              <div style={{
                padding: 32, borderRadius: 14, background: "var(--land-card)", border: "1px solid var(--land-border)",
                position: "relative", overflow: "hidden", height: "100%",
              }}>
                <div style={{ position: "absolute", top: 16, right: 20, fontSize: 64, fontWeight: 800, color: "rgba(0,0,0,.03)", lineHeight: 1, fontFamily: "var(--land-mono)" }}>{s.num}</div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "12", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--land-mono)", fontSize: 14, fontWeight: 700, color: s.color }}>{s.num}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-.02em", marginBottom: 8, color: "var(--land-text)" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "var(--land-muted)", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
