import { useState } from "react";
import Nav from "../../components/landing/Nav";
import Footer from "../../components/landing/Footer";
import FadeIn from "../../components/landing/FadeIn";
import SEO from "../../components/SEO";
import "../Landing/LandingPage.css";
import "./DocsPage.css";

const SIDEBAR_ITEMS = [
  { id: "getting-started", label: "Getting Started" },
  { id: "connecting-source", label: "Connecting a Source" },
  { id: "generating-notes", label: "Generating Release Notes" },
  { id: "llm-keys", label: "LLM Keys (BYOK)" },
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
        <p>Welcome to Releaslyy — the AI-powered release notes generator that turns your commits, tickets, and sprints into polished, audience-ready release notes in seconds.</p>

        <h3>Quick Start</h3>
        <ol>
          <li><strong>Sign up</strong> — Create your account using Google OAuth. No passwords to remember.</li>
          <li><strong>Connect a source</strong> — Link your GitHub, Jira, Linear, Asana, ClickUp, Monday.com, or DevRev account.</li>
          <li><strong>Generate</strong> — Select commits or sprints, configure your audience and tone, then let Releaslyy AI do the rest.</li>
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
        <p>Releaslyy pulls data from your existing development tools. Head to the <strong>Integrations</strong> page from the sidebar to connect your first source.</p>

        <h3>Supported Sources</h3>
        <table>
          <thead>
            <tr><th>Source</th><th>What it pulls</th><th>Setup</th></tr>
          </thead>
          <tbody>
            <tr><td>GitHub</td><td>Repos, branches, merged PRs</td><td>OAuth or Personal Access Token</td></tr>
            <tr><td>Jira</td><td>Projects, boards, sprints, versions, issues</td><td>OAuth (supports multi-site)</td></tr>
            <tr><td>Linear</td><td>Teams, projects, cycles, issues</td><td>OAuth</td></tr>
            <tr><td>Asana</td><td>Workspaces, projects, sections, tasks</td><td>OAuth (auto-refresh)</td></tr>
            <tr><td>ClickUp</td><td>Workspaces, spaces, folders, lists, tasks</td><td>OAuth</td></tr>
            <tr><td>Monday.com</td><td>Boards, groups, items, subitems</td><td>OAuth</td></tr>
            <tr><td>DevRev</td><td>Sprint boards, sprints, work items</td><td>Personal Access Token</td></tr>
          </tbody>
        </table>

        <h3>Managing Connections</h3>
        <p>You can connect multiple sources simultaneously. Each connection can be disconnected or reconfigured at any time from the Integrations page or Settings without affecting your previously generated release notes. All tokens are encrypted with AES-256-GCM.</p>
      </>
    ),
  },
  "generating-notes": {
    title: "Generating Release Notes",
    content: (
      <>
        <p>The generation wizard walks you through three simple steps to create release notes tailored to your audience.</p>

        <h3>Step 1 — Select Source</h3>
        <p>Choose one or more connected sources to pull from: GitHub, Jira, Linear, Asana, ClickUp, Monday.com, or DevRev. You can select multiple sources if you have them connected.</p>

        <h3>Step 2 — Pick Changes</h3>
        <p>Select the specific data to include in your release notes:</p>
        <ul>
          <li><strong>GitHub</strong> — Select a repository and branch, then pick merged PRs. Filter by date range.</li>
          <li><strong>Jira</strong> — Select a project, then choose Board/Sprint mode or Release Version mode. Multi-select sprints or versions, then pick individual issues. Filter issues by type, status, priority, assignee, or labels.</li>
          <li><strong>Linear</strong> — Select a team, then browse projects or cycles. Pick individual issues with full details (status, priority, assignee, labels).</li>
          <li><strong>Asana</strong> — Select a workspace and project, optionally filter by section, then pick tasks with assignee, status, and custom fields.</li>
          <li><strong>ClickUp</strong> — Browse workspaces → spaces → lists, then pick tasks with status, priority, assignees, and tags.</li>
          <li><strong>Monday.com</strong> — Select a board, optionally filter by group, then pick items including subitems with all column values.</li>
          <li><strong>DevRev</strong> — Select a sprint board, multi-select sprints, then pick individual work items from those sprints.</li>
        </ul>

        <h3>Step 3 — Configure</h3>
        <ul>
          <li><strong>Title</strong> — Give your release notes a custom title (e.g., "v2.4.0 — Performance & Polish").</li>
          <li><strong>Audience</strong> — Choose who the notes are for: <em>QA / Testing</em>, <em>Product Team</em>, or <em>Stakeholders</em>. The AI adjusts language and detail level accordingly.</li>
          <li><strong>Tone</strong> — Pick a tone: Professional, Casual, or Technical.</li>
          <li><strong>LLM Provider</strong> — Use the default Releaslyy AI or select your own provider (Grok, OpenAI, Anthropic, Gemini) if you've added API keys.</li>
          <li><strong>Custom Prompt</strong> — Under Advanced Options, add additional instructions for the AI (e.g., "Focus on user-facing changes" or "Group by feature area").</li>
        </ul>

        <p>Click <strong>Generate</strong> and the AI will analyze your source data and produce structured, categorized release notes. This typically takes just a few seconds.</p>

        <div className="docs-callout">
          <strong>Note:</strong> Generated notes are saved automatically. You can find them on the Dashboard at any time.
        </div>
      </>
    ),
  },
  "llm-keys": {
    title: "LLM Keys (Bring Your Own Key)",
    content: (
      <>
        <p>Releaslyy supports multiple AI providers for generating release notes. By default, Releaslyy AI handles everything — but you can bring your own API key for more control.</p>

        <h3>Supported Providers</h3>
        <table>
          <thead>
            <tr><th>Provider</th><th>Models</th></tr>
          </thead>
          <tbody>
            <tr><td>Grok</td><td>LLaMA, Mixtral, and more</td></tr>
            <tr><td>OpenAI</td><td>GPT-4o, GPT-4, GPT-3.5 Turbo</td></tr>
            <tr><td>Anthropic</td><td>Claude Sonnet, Claude Haiku</td></tr>
            <tr><td>Gemini</td><td>Gemini Pro, Gemini Flash</td></tr>
          </tbody>
        </table>

        <h3>Adding a Key</h3>
        <ol>
          <li>Go to <strong>Settings → LLM Keys</strong>.</li>
          <li>Click <strong>Add Key</strong> and select a provider.</li>
          <li>Paste your API key and optionally choose a preferred model.</li>
          <li>Set a key as <strong>default</strong> to use it automatically for all generations.</li>
        </ol>

        <h3>Using Your Key</h3>
        <p>During generation (Step 3 — Configure), the LLM selector will show all providers you have keys for. Select the one you want, and Releaslyy will use your key directly. Your keys are encrypted with AES-256-CBC and never exposed in the UI after saving.</p>

        <div className="docs-callout">
          <strong>Tip:</strong> The Dashboard shows an "API Keys" stat card so you can quickly see how many keys you have configured.
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

        <h3>Publish to Channels</h3>
        <p>Click the <strong>Publish</strong> button in the editor to open the publish panel. You can publish to multiple channels simultaneously:</p>
        <ul>
          <li><strong>GitHub Releases</strong> — Publish as a GitHub release to your selected repository. Choose the tag name and whether to mark it as a draft or pre-release.</li>
          <li><strong>Jira</strong> — Publish to a Jira release version. Select the project and version to attach the notes to.</li>
          <li><strong>Linear</strong> — Publish as a Project Update to any Linear project with full markdown formatting.</li>
          <li><strong>Asana</strong> — Create a task in your Asana project with an AI summary and full HTML release notes as an attachment.</li>
          <li><strong>ClickUp</strong> — Create a task in any ClickUp list with the release notes as markdown description.</li>
          <li><strong>Monday.com</strong> — Create an item on a Monday board with the release notes as an HTML update.</li>
          <li><strong>DevRev</strong> — Publish as a part or article in your DevRev workspace.</li>
          <li><strong>Slack</strong> — Post an AI-generated summary to any Slack channel with the full release notes as a file attachment.</li>
        </ul>
        <p>Each channel shows its publish status (success, failed, pending) with retry support for failed publishes.</p>

        <h3>Public Changelog</h3>
        <p>Toggle any release note to <strong>Public</strong> from the publish panel to generate a shareable link. Public notes are accessible at <code>/n/&#123;slug&#125;</code> without login — share with stakeholders, embed in Slack summaries, or link from external tools. Toggle back to <strong>Private</strong> to revoke access instantly.</p>

        <h3>Export Options</h3>
        <p>Use the <strong>Export</strong> dropdown in the top bar to download your release notes:</p>
        <ul>
          <li><strong>Markdown (.md)</strong> — Perfect for GitHub Releases, READMEs, and developer documentation.</li>
          <li><strong>Word (.doc)</strong> — For sharing with stakeholders who prefer document formats.</li>
          <li><strong>PDF (.pdf)</strong> — Print-ready format for formal distribution.</li>
        </ul>

        <h3>Copy to Clipboard</h3>
        <p>Click the copy button in the editor to copy the full content as formatted text, ready to paste into Notion, email, or any other tool.</p>
      </>
    ),
  },
  integrations: {
    title: "Integrations",
    content: (
      <>
        <p>Releaslyy is designed to sit at the center of your release workflow, pulling from any source and publishing to any destination.</p>

        <h3>Current Integrations</h3>
        <ul>
          <li><strong>GitHub</strong> — Connect via OAuth or Personal Access Token to pull merged PRs from your repositories. Also used as a publish channel for GitHub Releases.</li>
          <li><strong>Jira</strong> — Connect via OAuth to pull issues from sprints or release versions. Supports multi-site selection, multi-select for sprints and versions, searchable dropdowns, and issue filtering by type, status, priority, assignee, and labels. Also used as a publish channel.</li>
          <li><strong>Linear</strong> — Connect via OAuth to pull issues from teams, projects, and cycles. Browse by team hierarchy, filter by cycle or project, and view full issue details. Publish back as Project Updates.</li>
          <li><strong>Asana</strong> — Connect via OAuth to pull tasks from workspaces and projects. Filter by section, view assignees and custom fields. Publish as tasks with HTML attachments. Token auto-refreshes.</li>
          <li><strong>ClickUp</strong> — Connect via OAuth to pull tasks from workspaces, spaces, and lists. View status, priority, assignees, and tags. Publish as tasks in any list with markdown.</li>
          <li><strong>Monday.com</strong> — Connect via OAuth to pull items from boards and groups, including subitems. Extract status, priority, and people from column values. Publish as board items with HTML updates.</li>
          <li><strong>DevRev</strong> — Connect with a Personal Access Token to browse sprint boards, select sprints, and pick individual work items. Also used as a publish channel.</li>
          <li><strong>Slack</strong> — Connect via OAuth to publish AI-generated summaries to Slack channels with the full release notes as a file attachment.</li>
        </ul>

        <h3>Public Release Notes</h3>
        <p>Any release note can be made public with a shareable link. Toggle visibility from the editor — public notes are accessible at <code>/n/&#123;slug&#125;</code> without login. Use this to share changelogs with stakeholders, embed in Slack summaries, or link from external tools.</p>

        <h3>Planned Integrations</h3>
        <p>We're actively building integrations for:</p>
        <ul>
          <li><strong>GitLab</strong> — Pull merge requests and tags</li>
          <li><strong>Bitbucket</strong> — Pull commits and PRs</li>
          <li><strong>Notion</strong> — Sync with your team's knowledge base</li>
        </ul>
      </>
    ),
  },
  settings: {
    title: "Settings & Account",
    content: (
      <>
        <p>Manage your account and preferences from the <strong>Settings</strong> page, accessible via the sidebar.</p>

        <h3>Basic Info</h3>
        <p>Update your profile details (name, email, company, role), upload an avatar, set or change your password, or delete your account.</p>

        <h3>Plans & Billing</h3>
        <p>View available plans (Free, Pro, Team), manage your subscription, update billing details, and view invoice history.</p>

        <h3>Usage Metrics</h3>
        <p>Track your generation stats including total notes, provider breakdown, and a usage chart over time.</p>

        <h3>LLM Keys</h3>
        <p>Add and manage API keys for external LLM providers. Set a default provider to use automatically for all generations. See the <strong>LLM Keys (BYOK)</strong> section for details.</p>

        <h3>Integrations</h3>
        <p>View and manage all your connected services. You can disconnect a service at any time — your previously generated notes remain unaffected.</p>

        <h3>Projects</h3>
        <p>Create and switch between projects using the project switcher in the top bar. Each project has its own set of release notes, keeping your work organized.</p>
      </>
    ),
  },
  faq: {
    title: "FAQ",
    content: (
      <>
        <div className="docs-faq-item">
          <h3>What AI model does Releaslyy use?</h3>
          <p>By default, Releaslyy uses the Grok LLaMA 3.3 70B model for fast, high-quality release note generation. You can also bring your own API key for OpenAI, Anthropic, or Gemini and choose your preferred model from their catalogue.</p>
        </div>

        <div className="docs-faq-item">
          <h3>Is my code or data shared with anyone?</h3>
          <p>No. Releaslyy only reads commit messages, PR titles, and ticket summaries — never your source code. Your data is processed securely and is never shared with third parties.</p>
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
          <h3>Can I use Releaslyy with multiple repositories?</h3>
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
      <SEO
        title="Documentation — How to Generate Release Notes"
        description="Learn how to generate release notes from commits, Jira tickets, Linear issues, Asana tasks, ClickUp tasks, and Monday.com items. Step-by-step guides for all integrations, BYOK setup with OpenAI, Anthropic, Grok, Gemini."
        keywords="how to generate release notes from commits, ai tool to create changelog from git commits, generate release notes from jira tickets, github release notes generator for free, linear release notes, asana release notes, clickup release notes, monday.com release notes, BYOK setup, release notes automation tutorial, automated release notes tool"
        canonical="https://releaslyy.com/docs"
      />
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
                  <span style={{ fontFamily: "var(--land-serif)", fontStyle: "italic", fontWeight: 400 }}>Releaslyy</span>
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
                <a href="mailto:hello@releaslyy.com" style={{ color: "var(--land-accent)", fontWeight: 500, borderBottom: "1px dashed rgba(99,102,241,.3)" }}>
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
