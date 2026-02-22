# Architecture & Technical Decisions

## Overview

The application follows a standard client-server architecture with a decoupled React frontend
and a FastAPI backend. The backend owns all AI interactions to keep the Anthropic API key
server-side only.

---

## Frontend: React + TypeScript (Vite)

**Why React + TypeScript?**
- Largest ecosystem and community support
- TypeScript eliminates a class of runtime bugs and improves maintainability
- Vite provides a fast dev experience with HMR

**Key libraries (planned):**
- `react-query` (TanStack Query) — server state management, caching, background refetching
- `react-router-dom` — client-side routing
- `zod` — runtime schema validation on form inputs, shared with backend types where possible
- `tailwindcss` — utility-first CSS for rapid UI development

---

## Backend: Python + FastAPI

**Why FastAPI?**
- Native `async/await` support pairs well with I/O-bound tasks (DB queries, Claude API calls)
- Automatic OpenAPI/Swagger docs out of the box
- Pydantic-native — request validation and serialization with minimal boilerplate
- Python is the natural home for AI/ML tooling including the Anthropic SDK

**Structure:**
```
backend/app/
├── api/          # FastAPI routers — thin, delegate to services
├── models/       # SQLAlchemy ORM models
├── schemas/      # Pydantic request/response schemas
├── services/     # Business logic (home profiles, task generation, AI)
├── prompts/      # Claude system/user prompt templates (.txt)
└── main.py       # App entry point, middleware, router registration
```

---

## Database: SQLite → PostgreSQL

**Development:** SQLite via SQLAlchemy — zero-config, file-based, fast for local dev.

**Production:** PostgreSQL on Railway or Supabase — SQLAlchemy abstracts the switch; only
`DATABASE_URL` needs to change.

**Migrations:** Alembic manages schema migrations. Every schema change requires a migration
file — no `create_all()` in production.

---

## Auth: Supabase Auth

**Why Supabase Auth?**
- Handles email/password, magic links, and OAuth (Google, etc.) with minimal code
- JWT tokens issued by Supabase are verified on the FastAPI backend using the Supabase JWT secret
- Free tier is generous for MVP scale

**Auth flow:**
1. User authenticates via Supabase Auth (frontend SDK)
2. Supabase issues a JWT
3. Frontend sends JWT as `Authorization: Bearer <token>` on every API request
4. FastAPI middleware validates the JWT against the Supabase secret

---

## AI: Anthropic Claude API

**Why Claude?**
- High-quality natural language generation for home maintenance advice
- Reliable structured output (JSON mode) for generating task lists programmatically
- Context window supports detailed home profiles as input

**Integration pattern:**
- All Claude calls are isolated in `backend/app/services/ai_service.py`
- System prompts are stored in `backend/app/prompts/` as plain text files — versioned in git
- The service accepts a structured `HomeProfile` object and returns a typed `TaskPlan`
- Model defaults to `claude-sonnet-4-6`; configurable via `CLAUDE_MODEL` env var

**Cost controls:**
- Log input/output token counts per request
- Set conservative `max_tokens` limits per call type
- Cache generated task plans in the DB — only regenerate when the home profile changes

---

## Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | Vercel | Auto-deploy on push to `main` |
| Backend | Railway or Render | Dockerfile or Nixpacks build |
| Database | Railway PostgreSQL | Managed, automatic backups |
| Auth | Supabase | Managed |

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo vs polyrepo | Monorepo | Simpler for solo/small team; shared types possible |
| REST vs GraphQL | REST | Sufficient for this domain; less overhead |
| ORM vs raw SQL | SQLAlchemy ORM | Portability between SQLite and PostgreSQL |
| AI on backend only | Yes | API key stays server-side; enables caching and rate limiting |
| SSR vs SPA | SPA | No SEO requirements for authenticated app; simpler deployment |
