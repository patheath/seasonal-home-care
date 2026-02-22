# Seasonal Home Care

A web application that helps homeowners stay on top of seasonal home maintenance with personalized, AI-generated task checklists and timely reminders.

## What It Does

Homeowners set up a profile describing their home (type, age, region, and features like a pool, fireplace, or deck). The app uses AI to generate a customized seasonal maintenance plan — covering Spring, Summer, Fall, and Winter — so nothing falls through the cracks.

## Features (v1 MVP)

- **Home Profile** — Capture key details about your home to personalize recommendations
- **AI Task Plans** — Claude generates a seasonal checklist tailored to your specific home
- **Seasonal Checklists** — Organized task lists for each season with clear descriptions
- **Reminders** — Get notified when seasonal tasks are coming up

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript (Vite) |
| Backend | Python + FastAPI |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | Supabase Auth |
| AI | Anthropic Claude API |
| Deploy | Vercel (frontend) + Railway/Render (backend) |

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- An [Anthropic API key](https://console.anthropic.com)
- A [Supabase](https://supabase.com) project

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your keys
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # fill in your keys
npm run dev
```

The app will be available at `http://localhost:5173`.

## Project Structure

```
seasonal-home-care/
├── frontend/    # React + TypeScript
├── backend/     # FastAPI + SQLAlchemy
└── docs/        # Architecture and product docs
```

## Contributing

This project is in early development. See [docs/architecture.md](docs/architecture.md) for technical decisions and [docs/product-requirements.md](docs/product-requirements.md) for the product roadmap.

## License

MIT
