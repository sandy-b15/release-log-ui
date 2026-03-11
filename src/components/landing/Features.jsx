import FadeIn from "./FadeIn";
import { I } from "./Icons";

export default function Features() {
  const features = [
    { icon: I.sparkle, title: "AI Release Notes", desc: "Analyzes commits, PRs, sprint items, and linked issues — then writes human-readable summaries organized by category.", color: "var(--land-accent)" },
    { icon: I.plug, title: "Multi-Source Ingestion", desc: "Pull data from GitHub, Jira, DevRev, and Zoho Sprints. Releasly unifies everything into a single release timeline.", color: "var(--land-sky)" },
    { icon: I.send, title: "Auto-Publish Back", desc: "Push generated notes to GitHub Releases, create DevRev work items, or update Jira — all automatically.", color: "var(--land-warm)" },
    { icon: I.mail, title: "Email Notifications", desc: "Send polished release emails to customers, stakeholders, or your entire mailing list with one click.", color: "var(--land-pink)" },
    { icon: I.page, title: "Changelog Pages", desc: "Beautiful, hosted changelog pages with your branding. Embed in your app or share a public URL.", color: "var(--land-purple)" },
    { icon: I.workflow, title: "Workflow Automation", desc: "Set up triggers: when a sprint closes or a tag is pushed, Releasly generates and publishes without lifting a finger.", color: "var(--land-orange)" },
  ];

  return (
    <section className="land-sec" id="features" style={{ position: "relative" }}>
      <div className="land-orb" style={{ width: 500, height: 500, opacity: .05, background: "radial-gradient(circle,rgba(139,92,246,.4),transparent)", bottom: -100, left: -100 }} />
      <div className="land-con" style={{ position: "relative", zIndex: 2 }}>
        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--land-accent)", textTransform: "uppercase", letterSpacing: ".12em" }}>Features</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-.03em", marginTop: 12, color: "var(--land-text)" }}>
              Collect, generate,{" "}
              <span style={{ fontFamily: "var(--land-serif)", fontStyle: "italic", fontWeight: 400 }}>publish</span>
              {" "}— all automated
            </h2>
            <p style={{ fontSize: 16, color: "var(--land-muted)", maxWidth: 520, margin: "16px auto 0", lineHeight: 1.6 }}>
              From sprint trackers to customer inboxes — Releasly handles the full release communication pipeline.
            </p>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.08}>
              <div style={{
                padding: 28, borderRadius: 14, background: "var(--land-card)", border: "1px solid var(--land-border)",
                transition: "all .3s ease", cursor: "default", height: "100%",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#d0d0d6"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--land-border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: f.color + "12", display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-.02em", marginBottom: 8, color: "var(--land-text)" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--land-muted)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
