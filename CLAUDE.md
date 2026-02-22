# Seasonal Home Care — Claude Instructions

## Project Overview
A web application that helps individual homeowners stay on top of seasonal home maintenance.
Users set up a home profile and receive AI-generated, personalized seasonal task checklists
with reminders. The AI (Claude) generates task recommendations based on the home's details,
age, region, and features.

## Architecture

### Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript (Vite) |
| Backend | Python + FastAPI |
| Database | SQLite (local dev) → PostgreSQL (production) |
| Auth | Supabase Auth |
| AI | Anthropic Claude API (personalized task recommendations) |
| Frontend deploy | Vercel |
| Backend deploy | Railway or Render |

### Monorepo Structure
```
seasonal-home-care/
├── frontend/          # React + TypeScript app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/       # API client layer
│   │   └── types/
│   └── package.json
├── backend/           # FastAPI app
│   ├── app/
│   │   ├── api/       # Route handlers
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic schemas
│   │   ├── services/  # Business logic (including Claude integration)
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
└── docs/
```

## Common Commands

### Backend
```bash
# Setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run dev server
uvicorn app.main:app --reload --port 8000

# Run tests
pytest

# Database migrations (Alembic)
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Frontend
```bash
# Setup
cd frontend
npm install

# Run dev server
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

## Code Conventions

### Python / FastAPI
- Use Pydantic v2 for all request/response schemas
- Prefer async route handlers (`async def`)
- Keep route handlers thin — business logic lives in `services/`
- Use SQLAlchemy ORM for all DB access; never write raw SQL unless necessary
- Environment variables loaded via `python-dotenv` and typed with `pydantic-settings`
- Type hint everything; run `mypy` before committing

### React / TypeScript
- Strict TypeScript (`"strict": true` in tsconfig)
- Functional components only — no class components
- Co-locate component styles with the component file
- API calls go through the `src/api/` client layer, never fetch directly in components
- Use React Query for server state; avoid useEffect for data fetching

### General
- Never commit `.env` files — use `.env.example` with placeholder values
- All secrets go in environment variables
- Write tests for all service-layer functions

## Claude API Integration
- The `backend/app/services/ai_service.py` module owns all Claude API calls
- Use the `anthropic` Python SDK
- Model: `claude-sonnet-4-6` (default), allow override via env var `CLAUDE_MODEL`
- Always set a reasonable `max_tokens` limit per call
- Log token usage for cost tracking
- Keep system prompts in a dedicated `prompts/` directory as `.txt` files — do not inline long prompts in code

## Environment Variables
See `backend/.env.example` for the full list. Key vars:
- `ANTHROPIC_API_KEY` — Claude API key
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` — Supabase auth
- `DATABASE_URL` — SQLite path (dev) or Postgres URL (prod)

## Things to Avoid
- Do not put business logic in FastAPI route handlers
- Do not call the Claude API from the frontend directly (API key must stay server-side)
- Do not use `Any` type in TypeScript or Python unless absolutely unavoidable
- Do not store user PII beyond what is needed for the feature
