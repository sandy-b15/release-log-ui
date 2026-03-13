# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build to dist/
npm run lint     # ESLint (flat config, React hooks + refresh)
npm run preview  # Preview production build locally
```

No test framework is configured.

## Architecture

This is the **frontend** for Release Log, an AI-powered release notes generator. The backend lives in a sibling repo (`release-log-server`).

**Stack**: React 19 + Vite 7, React Router 7 (BrowserRouter), Axios, Tiptap rich text editor, lucide-react icons, react-hot-toast, recharts. Deployed on Vercel with SPA rewrite (`vercel.json`).

**Routing** (`App.jsx`): Two route groups:
- **Public** (no sidebar): `/`, `/login`, `/pricing`, `/docs`, `/privacy`, `/terms`, `/support`
- **Authenticated** (wrapped in `AppShell` with `Sidebar` + `ProtectedRoute`): `/dashboard`, `/integration`, `/generate`, `/settings`

**Key pages**:
- `Dashboard` — Overview stats + generate wizard (3 steps: source selection, change picking, config with LLM/audience/tone)
- `GenerateEdit` — Tiptap editor for generated notes, export to MD/DOC/PDF
- `Integration` — Connect GitHub, Jira, DevRev (GitLab/Bitbucket coming soon)
- `Settings` — 5 tabs: Basic Info, Plans & Billing, Usage Metrics, LLM Keys, Integrations

**API communication**: All requests go to the backend via Axios with `withCredentials: true` (cookie-based sessions). The backend URL comes from `VITE_API_URL` env var.

## Code Conventions

**CSS**: Use CSS custom properties from `App.css` — never hardcode hex colors. Key vars: `--primary`, `--text`, `--muted`, `--bg`, `--border`, `--indigo`, `--emerald`, `--rose`, `--amber`, `--sky`, `--violet`, `--orange`. Accent variants: `--il` (light), `--it` (text). Radii: `--r` (14px), `--rs` (8px), `--rl2` (20px).

**Buttons**: Always use `.btn` base class + `.btn-primary` / `.btn-secondary` / `.btn-danger`. Use `.btn-sm` for smaller, `.btn btn-icon` for icon-only. Never create per-page button classes.

**Inputs/Dropdowns**: Use global input styles from `index.css`. For dropdowns, use the `SearchDropdown` component (`components/ui/SearchDropdown.jsx`) instead of native `<select>`.

**Logos**: Always use image logos from `src/assets/` for integrations and LLM providers. Never use letter abbreviations, colored dots, or generic icons.

**Error handling**: Every API call must have error handling with `toast.error()` on failure and `toast.success()` on success (from `react-hot-toast`). Never silently swallow errors.

**ESLint**: `no-unused-vars` is set to error but ignores variables starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`).
