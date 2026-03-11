# Release Log

AI-powered Release Notes Generator that connects to version control and project management tools to automatically generate tailored release notes for different audiences.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, React Router 7 |
| Editor | Tiptap (rich text with tables, links, markdown) |
| Backend | Express.js 4, Passport.js (Google OAuth 2.0) |
| Database | PostgreSQL (sessions, users, tokens, notes) |
| AI | Groq SDK (openai/gpt-oss-120b) |
| Integrations | GitHub (Octokit), Jira (REST API), DevRev API |
| Hosting | Firebase (UI), Railway (Server) |

## Features

### Authentication
- [x] Google OAuth 2.0 login
- [x] Session-based auth with PostgreSQL store
- [x] Protected routes with auth guard
- [x] Secure cookies (httpOnly, sameSite, secure)

### Integrations
- [x] GitHub — connect via Personal Access Token, scope validation
- [x] Jira — connect via API token + domain, OAuth-based project access
- [x] DevRev — connect via access token
- [ ] GitLab — coming soon
- [ ] Bitbucket — coming soon

### Data Selection
- [x] GitHub: browse repos, branches, and merged PRs
- [x] GitHub: filter PRs by date range
- [x] GitHub: multi-select PRs for generation
- [x] Jira: browse projects, boards, sprints, and release versions
- [x] Jira: Board/Sprint mode — multi-select sprints across boards
- [x] Jira: Release Version mode — multi-select versions
- [x] Jira: searchable dropdowns for all selectors
- [x] Jira: filter issues by type, status, priority, assignee, and labels
- [x] DevRev: browse sprint boards and sprints
- [x] DevRev: filter sprints by name and status
- [x] DevRev: multi-select sprints for generation

### AI Generation
- [x] Audience-specific prompts (QA, Product, Stakeholder)
- [x] Generate from GitHub PRs
- [x] Generate from Jira issues (sprint or version based)
- [x] Generate from DevRev sprints
- [x] Auto-save generated notes to database

### Editor & Export
- [x] Rich text editor (Tiptap) with full toolbar
- [x] Bold, italic, underline, strikethrough, headings, lists
- [x] Blockquote, code blocks, horizontal rules, links
- [x] Undo/redo
- [x] Export as Markdown (.md)
- [x] Export as Word (.doc)
- [x] Export as PDF
- [x] Copy to clipboard

### Dashboard
- [x] Overview with stats and generated notes history
- [x] View past notes from history table
- [x] Generate view with source selection (GitHub/Jira/DevRev)

### Security
- [x] AES-256-GCM encryption for stored tokens
- [x] Helmet CSP headers
- [x] CORS origin whitelist
- [x] GitHub token scope validation

## Upcoming Features

- [ ] GitLab, Bitbucket integrations
- [ ] Team management and collaboration
- [ ] Notification preferences
- [ ] API key management (Settings page)
- [ ] One-click publish to Confluence
- [ ] Scheduled/automated generation
- [ ] Custom prompt templates
- [ ] Note editing history and versioning

## Project Structure

```
release-log-ui/                    release-log-server/
├── src/                           ├── index.js          (Express entry)
│   ├── main.jsx                   ├── db.js             (PostgreSQL)
│   ├── App.jsx                    ├── routes/
│   ├── pages/                     │   ├── auth.js       (Google OAuth)
│   │   ├── LandingPage.jsx        │   ├── tokens.js     (Token CRUD)
│   │   ├── Login.jsx              │   ├── github.js     (GitHub API)
│   │   ├── Dashboard.jsx          │   ├── generate.js   (AI generation)
│   │   ├── GenerateEdit.jsx       │   ├── jira.js       (Jira API)
│   │   ├── Integration.jsx        │   ├── devrev.js     (DevRev API)
│   │   ├── Docs.jsx               │   └── notes.js      (Notes CRUD)
│   │   └── Settings.jsx           ├── middleware/
│   └── components/                │   └── auth.js       (Auth guard)
│       ├── Header.jsx             ├── utils/
│       ├── Sidebar.jsx            │   ├── crypto.js     (AES encryption)
│       ├── ProtectedRoute.jsx     │   └── prompts.js    (Template loader)
│       ├── DataSelector.jsx       └── prompts/          (6 templates)
│       └── ConfirmDialog.jsx
└── firebase.json
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
ENCRYPTION_KEY=...          # 64-char hex
SERVER_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:5173
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
