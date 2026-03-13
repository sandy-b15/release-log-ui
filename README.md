# Release Log

AI-powered Release Notes Generator that connects to version control and project management tools to automatically generate tailored release notes for different audiences.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, React Router 7 |
| Editor | Tiptap (rich text with tables, links, markdown) |
| Backend | Express.js 4, Passport.js (Google OAuth 2.0) |
| Database | PostgreSQL (sessions, users, tokens, notes, plans) |
| AI | Multi-provider: Groq, OpenAI, Anthropic, Gemini (Bring Your Own Key) |
| Integrations | GitHub (Octokit), Jira (OAuth + REST API), DevRev API |
| Hosting | Vercel (UI), Railway (Server + PostgreSQL) |

## Features

### Authentication
- [x] Google OAuth 2.0 login
- [x] Session-based auth with PostgreSQL store
- [x] Protected routes with auth guard
- [x] Secure cookies (httpOnly, sameSite, secure)

### Integrations
- [x] GitHub — connect via Personal Access Token, scope validation
- [x] Jira — OAuth-based connection with multi-site support
- [x] DevRev — connect via Personal Access Token
- [ ] GitLab — coming soon
- [ ] Bitbucket — coming soon

### Data Selection
- [x] GitHub: browse repos, branches, and merged PRs
- [x] GitHub: filter PRs by date range
- [x] GitHub: multi-select PRs for generation
- [x] Jira: browse projects, boards, sprints, and release versions
- [x] Jira: Board/Sprint mode — multi-select sprints, view and select individual issues
- [x] Jira: Release Version mode — multi-select versions, view and select individual issues
- [x] Jira: searchable dropdowns for all selectors
- [x] Jira: filter issues by type, status, priority, assignee, and labels
- [x] DevRev: browse sprint boards, sprints, and work items
- [x] DevRev: filter sprints by name and status
- [x] DevRev: multi-select sprints, view and select individual work items

### AI Generation
- [x] Audience-specific prompts (QA, Product, Stakeholder, Executive)
- [x] Tone selection (Professional, Casual, Technical)
- [x] Custom prompt support — add additional instructions for the AI
- [x] Generate from GitHub PRs
- [x] Generate from Jira issues (sprint or version based)
- [x] Generate from DevRev work items
- [x] Auto-save generated notes to database
- [x] Multi-provider LLM support (Releaslyy AI, Groq, OpenAI, Anthropic, Gemini)
- [x] Bring Your Own Key — use your own API keys for any supported provider

### Editor & Export
- [x] Rich text editor (Tiptap) with full toolbar
- [x] Bold, italic, underline, strikethrough, headings, lists
- [x] Blockquote, code blocks, horizontal rules, links, tables
- [x] Undo/redo
- [x] Export as Markdown (.md)
- [x] Export as Word (.doc)
- [x] Export as PDF
- [x] Copy to clipboard

### Publishing
- [x] Publish to GitHub Releases
- [x] Publish to Jira release versions
- [x] Publish to DevRev (as part/article)
- [x] Multi-channel publish with per-channel configuration
- [x] Publish status tracking with retry on failure

### Dashboard
- [x] Overview with 4 stat cards (Notes Generated, Published, Integrations, API Keys)
- [x] Generated notes history with view/delete
- [x] 3-step generate wizard (Source → Pick Changes → Configure)
- [x] Project switcher for multi-project support

### Settings
- [x] Basic Info — profile, password, account deletion
- [x] Plans & Billing — subscription management, billing details, invoices
- [x] Usage Metrics — generation stats, provider breakdown, usage chart
- [x] LLM Keys — add/remove API keys, set default provider
- [x] Integrations — view and manage connected services

### Security
- [x] AES-256-GCM encryption for integration tokens
- [x] AES-256-CBC encryption for LLM API keys
- [x] Helmet CSP headers
- [x] CORS origin whitelist
- [x] GitHub token scope validation

## Project Structure

```
release-log-ui/                    release-log-server/
├── src/                           ├── index.js          (Express entry)
│   ├── main.jsx                   ├── db.js             (PostgreSQL + schema)
│   ├── App.jsx                    ├── routes/
│   ├── pages/                     │   ├── auth.js       (Google OAuth)
│   │   ├── Landing/               │   ├── tokens.js     (Token CRUD)
│   │   ├── Login.jsx              │   ├── github.js     (GitHub API)
│   │   ├── Dashboard/             │   ├── generate.js   (GitHub generation)
│   │   ├── GenerateEdit/          │   ├── jira.js       (Jira API + generation)
│   │   ├── Integration/           │   ├── devrev.js     (DevRev API + generation)
│   │   ├── Docs/                  │   ├── notes.js      (Notes CRUD)
│   │   └── Settings/              │   ├── publish.js    (Publish events)
│   ├── components/                │   ├── llmKeys.js    (LLM key CRUD)
│   │   ├── Header/                │   ├── llmCatalogue.js (Provider catalogue)
│   │   ├── Sidebar/               │   ├── user.js       (Profile CRUD)
│   │   ├── PublishModal/          │   └── plans.js      (Plans & billing)
│   │   ├── ConfirmDialog/         ├── services/
│   │   ├── generate/              │   ├── llmService.js  (Multi-provider LLM)
│   │   ├── ui/                    │   └── llmKeyService.js (Key encryption)
│   │   └── ProtectedRoute.jsx     ├── utils/
│   ├── hooks/                     │   ├── crypto.js     (AES encryption)
│   │   └── useLLMKeys.js          │   └── prompts.js    (Template loader)
│   └── assets/                    └── prompts/          (12 templates)
└── vercel.json
```

## Environment Variables

### UI (.env)
```
VITE_API_URL=http://localhost:3000
```

### Server (.env)
```
PORT=3000
NODE_ENV=local
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SESSION_SECRET=...
GROQ_API_KEY=...
ENCRYPTION_KEY=...                # 64-char hex (for token encryption)
LLM_KEY_ENCRYPTION_SECRET=...     # 64-char hex (for LLM key encryption)
SERVER_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:5173
JIRA_CLIENT_ID=...                # For Jira OAuth
JIRA_CLIENT_SECRET=...
JIRA_REDIRECT_URI=...
```

## Getting Started

```bash
# Server
cd release-log-server
npm install
npm run dev

# UI
cd release-log-ui
npm install
npm run dev
```
