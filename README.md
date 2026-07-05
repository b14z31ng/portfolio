# Developer Portfolio

A production-grade personal developer portfolio with a private CMS.

## Architecture

```
apps/
  web/     → Next.js 16 (App Router, TypeScript, Tailwind v4, shadcn/ui)
  api/     → FastAPI (Python, SQLAlchemy, Alembic)

packages/
  types/   → Shared TypeScript types
  utils/   → Shared utility functions
  config/  → Shared configuration

infrastructure/
  docker/  → Dockerfiles
  render/  → Render deployment config
```

## Quick Start

### Prerequisites

- Node.js ≥ 20
- Python ≥ 3.11
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

### Development (with Docker)

```bash
# Start all services
docker-compose up -d

# Frontend: http://localhost:3000
# API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
```

### Development (without Docker)

```bash
# Frontend
cd apps/web
npm install
npm run dev

# Backend
cd apps/api
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Themes

- **Light** — Professional, clean, bright
- **Dark** — Muted, high contrast
- **Abyss** (default) — Deep blue-black with electric blue highlights

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL |
| Cache | Redis |
| Auth | JWT |
| Media | Cloudinary |
| Deploy | Docker, Render, GitHub Actions |

## License

MIT
