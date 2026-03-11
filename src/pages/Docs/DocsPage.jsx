import { useState } from "react";
import Nav from "../../components/landing/Nav";
import Footer from "../../components/landing/Footer";
import FadeIn from "../../components/landing/FadeIn";
import "../Landing/LandingPage.css";
import "./DocsPage.css";

const SIDEBAR_ITEMS = [
  { id: "getting-started", label: "Getting Started" },
  { id: "connecting-source", label: "Connecting a Source" },
  { id: "generating-notes", label: "Generating Release Notes" },
  { id: "editor", label: "Editor & Formatting" },
  { id: "publishing", label: "Publishing & Export" },
  { id: "integrations", label: "Integrations" },
  { id: "settings", label: "Settings & Account" },
  { id: "faq", label: "FAQ" },
];

const SECTIONS = {
  "getting-started": {
    title: "Getting Started",
    content: (
      <>
        <p>Welcome to Releasly — the AI-powered release notes generator that turns your commits, tickets, and sprints into polished, audience-ready release notes in seconds.</p>

        <h3>Quick Start</h3>
        <ol>
          <li><strong>Sign up</strong> — Create your account using Google OAuth. No passwords to remember.</li>
          <li><strong>Connect a source</strong> — Link your GitHub repository, Jira project, DevRev workspace, or Zoho Sprints account.</li>
          <li><strong>Generate</strong> — Select commits or sprints, configure your audience and tone, then let Releasly AI do the rest.</li>
          <li><strong>Edit & publish</strong> — Fine-tune the generated notes in our rich text editor, then export or publish wherever you need.</li>
        </ol>

        <div className="docs-callout">
          <strong>Tip:</strong> Your first release notes can be generated in under 60 seconds after connecting a source.
        </div>
      </>
    ),
  },
  "connecting-source": {
    title: "Connecting a Source",
    content: (
      <>
        <p>Releasly pulls data from your existing development tools. Head to the <strong>Integrations</strong> page from the sidebar to connect your first source.</p>

        <h3>Supported Sources</h3>
        <table>
          <thead>
            <tr><th>Source</th><th>What it pulls</th><th>Setup</th></tr>
          </thead>
          <tbody>
            <tr><td>GitHub</td><td>Commits, PRs, tags</td><td>OAuth app authorization</td></tr>
            <tr><td>Jira</td><td>Issues, sprints, versions</td><td>API token + domain</td></tr>
            <tr><td>DevRev</td><td>Work items, sprints</td><td>PAT (Personal Access Token)</td></tr>
            <tr><td>Zoho Sprints</td><td>Sprint items, user stories</td><td>OAuth connection</td></tr>
          </tbody>
        </table>

        <h3>Managing Connections</h3>
        <p>You can connect multiple sources simultaneously. Each connection can be disconnected or reconfigured at any time from the Integrations page without affecting your previously generated release notes.</p>
      </>
    ),
  },
  "generating-notes": {
    title: "Generating Release Notes",
    content: (
      <>
        <p>The generation wizard walks you through three simple steps to create release notes tailored to your audience.</p>

        <h3>Step 1 — Select Source Data</h3>
        <p>Choose the connected source you want to pull from. For GitHub, select the repository and pick the commits to include. For Jira, DevRev, or Zoho, select the relevant sprints.</p>

        <h3>Step 2 — Configure</h3>
        <ul>
          <li><strong>Title</strong> — Give your release notes a custom title (e.g., "v2.4.0 — Performance & Polish").</li>
          <li><strong>Audience</strong> — Choose who the notes are for: <em>Developers</em>, <em>End Users</em>, <em>Stakeholders</em>, or <em>Internal Team</em>. The AI adjusts language and detail level accordingly.</li>
          <li><strong>Tone</strong> — Pick a tone: Professional, Casual, or Technical. This shapes the writing style of the output.</li>
        </ul>

        <h3>Step 3 — Generate</h3>
        <p>Click <strong>Generate</strong> and Releasly AI will analyze your source data and produce structured, categorized release notes. This typically takes just a few seconds.</p>

        <div className="docs-callout">
          <strong>Note:</strong> Generated notes are saved automatically. You can find them on the Dashboard at any time.
        </div>
      </>
    ),
  },
  editor: {
    title: "Editor & Formatting",
    content: (
      <>
        <p>After generation, you're taken to the rich text editor where you can refine the output before sharing.</p>

        <h3>Editor Toolbar</h3>
        <p>The toolbar provides formatting controls:</p>
        <ul>
          <li><strong>Text styles</strong> — Bold, italic, underline, strikethrough</li>
          <li><strong>Headings</strong> — H1 through H4 for document structure</li>
          <li><strong>Lists</strong> — Bullet lists and numbered lists</li>
          <li><strong>Block elements</strong> — Blockquotes, code blocks, horizontal rules</li>
          <li><strong>Links</strong> — Insert and edit hyperlinks</li>
        </ul>

        <h3>Edit vs Preview</h3>
        <p>Toggle between <strong>Edit</strong> mode (full editing capabilities) and <strong>Preview</strong> mode (read-only view of the final output) using the toggle at the top of the editor.</p>

        <h3>Saving Changes</h3>
        <p>Click the <strong>Save</strong> button next to the copy button to persist your edits. The button appears when you have unsaved changes. A toast notification confirms when your changes are saved.</p>
      </>
    ),
  },
  publishing: {
    title: "Publishing & Export",
    content: (
      <>
        <p>Once your release notes are ready, you have multiple ways to share them.</p>

        <h3>Copy to Clipboard</h3>
        <p>Click the copy button in the editor to copy the full content as formatted text, ready to paste into Slack, Notion, email, or any other tool.</p>

        <h3>Export Options</h3>
        <p>Use the <strong>Export</strong> dropdown in the top bar to download your release notes:</p>
        <ul>
          <li><strong>Markdown (.md)</strong> — Perfect for GitHub Releases, READMEs, and developer documentation.</li>
          <li><strong>HTML (.html)</strong> — Ready to embed in your website or changelog page.</li>
          <li><strong>Plain Text (.txt)</strong> — Simple text format for emails and basic documents.</li>
        </ul>

        <div className="docs-callout">
          <strong>Coming soon:</strong> Direct publishing to GitHub Releases, changelog pages, and email campaigns.
        </div>
      </>
    ),
  },
  integrations: {
    title: "Integrations",
    content: (
      <>
        <p>Releasly is designed to sit at the center of your release workflow, pulling from any source and publishing to any destination.</p>

        <h3>Current Integrations</h3>
        <ul>
          <li><strong>GitHub</strong> — Connect via OAuth to pull commits, PRs, and tags from your repositories.</li>
          <li><strong>Jira</strong> — Link your Atlassian account to pull sprint data and issue details.</li>
          <li><strong>DevRev</strong> — Connect with a Personal Access Token to sync work items and sprints.</li>
          <li><strong>Zoho Sprints</strong> — OAuth-based connection for sprint items and user stories.</li>
        </ul>

        <h3>Planned Integrations</h3>
        <p>We're actively building integrations for:</p>
        <ul>
          <li><strong>Slack</strong> — Post release notes directly to channels</li>
          <li><strong>Linear</strong> — Pull issues and cycles as source data</li>
          <li><strong>Notion</strong> — Publish notes as Notion pages</li>
          <li><strong>Confluence</strong> — Sync with your team's knowledge base</li>
        </ul>
      </>
    ),
  },
  settings: {
    title: "Settings & Account",
    content: (
      <>
        <p>Manage your account and preferences from the <strong>Settings</strong> page, accessible via the gear icon in the sidebar.</p>

        <h3>Account</h3>
        <ul>
          <li><strong>Profile</strong> — View your connected Google account and email.</li>
          <li><strong>Sign out</strong> — Log out from your current session.</li>
        </ul>

        <h3>Connected Services</h3>
        <p>View and manage all your connected integrations. You can disconnect a service at any time — your previously generated notes remain unaffected.</p>
      </>
    ),
  },
  faq: {
    title: "FAQ",
    content: (
      <>
        <div className="docs-faq-item">
          <h3>What AI model does Releasly use?</h3>
          <p>Releasly uses state-of-the-art large language models to analyze your development data and generate well-structured release notes. The AI is fine-tuned for technical writing and understands commit messages, ticket descriptions, and sprint summaries.</p>
        </div>

        <div className="docs-faq-item">
          <h3>Is my code or data shared with anyone?</h3>
          <p>No. Releasly only reads commit messages, PR titles, and ticket summaries — never your source code. Your data is processed securely and is never shared with third parties.</p>
        </div>

        <div className="docs-faq-item">
          <h3>Can I edit the generated notes?</h3>
          <p>Absolutely. Every set of generated notes opens in a full rich text editor where you can add, remove, or restructure content before exporting or publishing.</p>
        </div>

        <div className="docs-faq-item">
          <h3>How many release notes can I generate?</h3>
          <p>This depends on your plan. Check the <a href="/pricing" style={{ color: "var(--land-accent)", fontWeight: 500 }}>Pricing</a> page for details on limits and features per tier.</p>
        </div>

        <div className="docs-faq-item">
          <h3>Can I use Releasly with multiple repositories?</h3>
          <p>Yes. Once you connect your GitHub account, you can select any repository you have access to when generating release notes. Switch between repos freely.</p>
        </div>
      </>
    ),
  },
};

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const section = SECTIONS[activeSection];

  return (
    <div className="landing-root">
      <div className="land-noise" />
      <Nav />

      <div style={{ paddingTop: 64 }}>
        <section className="land-sec" style={{ paddingBottom: 0 }}>
          <div className="land-con">
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--land-sky)", textTransform: "uppercase", letterSpacing: ".12em" }}>Documentation</span>
                <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-.03em", marginTop: 12, color: "var(--land-text)" }}>
                  Learn how to use{" "}
                  <span style={{ fontFamily: "var(--land-serif)", fontStyle: "italic", fontWeight: 400 }}>Releasly</span>
                </h1>
                <p style={{ fontSize: 16, color: "var(--land-muted)", maxWidth: 500, margin: "16px auto 0", lineHeight: 1.6 }}>
                  Everything you need to generate, edit, and publish release notes from your development workflow.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        <section style={{ padding: "0 24px 100px" }}>
          <div className="land-con">
            <FadeIn delay={0.1}>
              <div className="docs-layout">
                {/* Sidebar */}
                <aside className="docs-sidebar">
                  <nav>
                    {SIDEBAR_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`docs-sidebar-btn ${activeSection === item.id ? "active" : ""}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </aside>

                {/* Content */}
                <main className="docs-content">
                  <h2 className="docs-content-title">{section.title}</h2>
                  <div className="docs-content-body">{section.content}</div>
                </main>
              </div>
            </FadeIn>
          </div>
        </section>

        <FadeIn delay={0.15}>
          <section style={{ padding: "0 24px 80px", textAlign: "center" }}>
            <div className="land-con">
              <p style={{ fontSize: 15, color: "var(--land-muted)" }}>
                Can't find what you're looking for?{" "}
                <a href="mailto:support@releasly.app" style={{ color: "var(--land-accent)", fontWeight: 500, borderBottom: "1px dashed rgba(99,102,241,.3)" }}>
                  Contact support
                </a>
              </p>
            </div>
          </section>
        </FadeIn>
      </div>

      <Footer />
    </div>
  );
}
