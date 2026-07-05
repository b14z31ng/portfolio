# Project Overview: Developer Portfolio CMS

A production-grade, highly polished personal developer portfolio website integrated with a private Content Management System (CMS). This project is designed as a unified monorepo that automates portfolio building by synchronizing selected GitHub repositories and translating them into showcase-ready project pages, along with managing blogs, research, experience, education, and credentials.

---

## 🏛️ System Architecture

The application is structured as a **Monorepo** consisting of two main services (Next.js frontend and FastAPI backend), shared utility packages, and deployment infrastructure.

```mermaid
graph TD
    %% Client & Frontend
    subgraph Client ["Client Layer"]
        V[Visitor Browser]
        A[Admin Browser]
    end

    subgraph Frontend ["Frontend App (Next.js 15+ App Router)"]
        FW[Public Portfolio Site]
        FA[Admin Dashboard / CMS]
        Theme[Abyss / Dark / Light Themes]
    end

    %% API Layer
    subgraph Backend ["Backend App (FastAPI)"]
        API[FastAPI Gateway]
        Auth[JWT Authentication]
        Sync[GitHub Service]
        PE[Project Engine]
    end

    %% Databases & Storage
    subgraph Storage ["Storage Layer"]
        DB[(PostgreSQL Database)]
        Cache[(Redis Cache)]
        Media[Local/Cloudinary Media]
    end

    %% External
    GH[(GitHub API)]

    %% Flow Relationships
    V --> FW
    A --> FA
    FW --> API
    FA --> API
    API --> Auth
    API --> Sync
    API --> PE
    Sync <--> GH
    API <--> DB
    API <--> Cache
    API <--> Media
```

---

## 💻 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15+ (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion | Modern, server-side rendered frontend, featuring smooth animations and a premium glassmorphic theme system. |
| **Backend** | FastAPI, Python 3.11+, SQLAlchemy 2.0 (Async), Alembic | High-performance, asynchronous REST API with auto-generated OpenAPI documentation. |
| **Database** | PostgreSQL 16 | Relational database to persist users, project metadata, blog posts, and configuration. |
| **Caching** | Redis 7 | Used for API response caching, rate limiting, and temporary state storage. |
| **Auth** | JWT (JSON Web Tokens) | Secure stateless authentication for the admin panel, storing secure HTTP-only tokens. |
| **Media Library**| Cloudinary / Local Storage | Asset management for screenshots, logos, and banners. |
| **Deployment** | Docker & Docker Compose, Render | Infrastructure configuration for local containerized development and automated hosting. |

---

## 📁 Repository Structure

```
portfolio/
├── apps/
│   ├── api/                   # FastAPI Backend
│   │   ├── alembic/           # Database migration files
│   │   ├── app/
│   │   │   ├── api/           # API router/v1 endpoints (Auth, Blog, Projects, etc.)
│   │   │   ├── core/          # App settings, security, and exception configurations
│   │   │   ├── db/            # Database initialization, models, and session management
│   │   │   ├── models/        # SQLAlchemy database models
│   │   │   ├── schemas/       # Pydantic schemas for data serialization/validation
│   │   │   └── services/      # Business logic (GitHub Service, Project Engine)
│   │   ├── uploads/           # Local media uploads directory
│   │   ├── requirements.txt   # Python pip requirements
│   │   └── main.py            # API Entrypoint
│   └── web/                   # Next.js Frontend
│       ├── src/
│       │   ├── app/           # App router page structure
│       │   │   ├── (portfolio)# Public portfolio routes (Blog, Projects, Timeline)
│       │   │   └── admin/     # Admin dashboard & management routes (private CMS)
│       │   ├── components/    # Reusable shadcn/ui and custom components
│       │   ├── hooks/         # Custom React hooks (e.g. useAuth, useTheme)
│       │   └── lib/           # Axios clients, UI helper utilities
│       ├── tailwind.config.js # Styling configurations
│       └── package.json       # Node package manager configurations
├── packages/                  # Shared monorepo packages
│   ├── config/                # Shared eslint, tsconfig configuration
│   ├── types/                 # Shared TypeScript interfaces
│   └── utils/                 # General utility scripts
├── infrastructure/            # Production / Containerization configuration
│   └── docker/                # Custom Dockerfiles
├── docker-compose.yml         # Container orchestrations for local execution
├── PROJECT_PLAN.md            # Detailed implementation roadmap
└── README.md                  # Quick-start documentation
```

---

## ⚙️ Core Engines & Workflows

### 1. GitHub Integration & Project Engine
The centerpiece of the application is the **Project Engine** (`apps/api/app/services/project_engine.py`), which automates the conversion of raw GitHub repositories into public portfolio project pages:

*   **Repository Sync**: Fetch all public/private repositories from GitHub using OAuth credentials or developer access tokens.
*   **Technology Detection**: Automatically scans the repository's primary programming language, repository topics, and contents of the `README.md` to map them against a pre-defined set of technology entities.
*   **README Parsing**: Clean markdown formats (removing badges, raw markdown links, and HTML tags) and extract the first meaningful introductory paragraph to generate a concise summary.
*   **Feature Extraction**: Scans headings matching `# Features`, `# Key Features`, or `# Highlights` and parses bullet lists to auto-extract features.
*   **Database Translation**: Map the analyzed repository metadata into the `projects` table, marking it as published automatically when selected by the owner.

```mermaid
sequenceDiagram
    participant Admin
    participant DB as Postgres Database
    participant API as FastAPI Backend
    participant GH as GitHub API

    Admin->>API: Select & Sync GitHub Repos
    API->>GH: Retrieve repository list & READMEs
    GH-->>API: Returns Repository details & Markdown Content
    API->>API: Execute ProjectEngine: Detect Tech Stack & Parse README
    API->>DB: Upsert into 'repositories' & 'projects' tables
    DB-->>API: Confirm database transaction
    API-->>Admin: Success status & updated Admin Dashboard
```

### 2. Multi-Theme Customization
The portfolio comes configured with a premium aesthetic system, supporting three visual themes that can be selected in the visitor UI or managed globally:
*   **Light**: Clean, professional layout with high readability.
*   **Dark**: Muted, high-contrast, distraction-free environment.
*   **Abyss (Default)**: Deep blue-black layout highlighted with electric cyan, blue, and purple accents for an ultra-modern developer look.

---

## 🗄️ Database Schemas (Models)

The application uses **PostgreSQL** with an asynchronous **SQLAlchemy** layer. Below are the key entity mappings:

### 1. Users (`users`)
Represents the portfolio owner. This is a single-user system designed for high security.
*   `id` (UUID, Primary Key)
*   `email` (String, Unique, Indexed)
*   `hashed_password` (String)
*   `name` (String, Default: "Admin")
*   `is_active` (Boolean)
*   `created_at` / `updated_at` (Timestamps)

### 2. Repositories (`repositories`)
Stores raw synced metadata straight from GitHub before project conversion.
*   `id` (UUID, Primary Key)
*   `github_id` (Integer, Unique, Indexed)
*   `name` (String)
*   `full_name` (String)
*   `description` (Text)
*   `html_url` / `homepage` (String)
*   `language` (String)
*   `stargazers_count` / `forks_count` (Integer)
*   `topics` (Array of Strings)
*   `is_selected` (Boolean) - True if converted to a portfolio project.
*   `readme_content` (Text) - Cached copy of the `README.md`.
*   `default_branch` (String)
*   `last_synced_at` / `pushed_at` (Timestamps)

### 3. Projects (`projects`)
The public-facing showcase item, generated from a repository or created manually.
*   `id` (UUID, Primary Key)
*   `slug` (String, Unique, Indexed)
*   `title` (String)
*   `summary` (Text)
*   `description` (Text)
*   `banner_url` / `github_url` / `live_url` (String)
*   `readme` (Text)
*   `architecture` / `challenges` / `solutions` / `lessons_learned` (Text)
*   `features` / `screenshots` (Array of Strings)
*   `stars` / `forks` (Integer)
*   `is_featured` / `is_published` (Boolean)
*   `sort_order` (Integer)
*   `repository_id` (Foreign Key -> `repositories.id`)

### 5. Technologies (`technologies`)
Contains technology tags linked to projects via a many-to-many relationship.
*   `id` (UUID, Primary Key)
*   `name` (String, Unique)
*   `slug` (String, Unique)
*   `category` (String: language, framework, library, database, tool, platform, other)
*   `color` (String, e.g. hex codes)
*   `icon_url` (String)

---

## 🔧 Environment Variables

### Backend (`apps/api/.env`)
```ini
ENVIRONMENT=development
APP_NAME="Developer Portfolio API"
APP_VERSION=1.0.0
APP_DESCRIPTION="API backend for Developer Portfolio CMS"
SECRET_KEY="your-jwt-signing-secret"
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Database & Cache
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/portfolio
REDIS_URL=redis://localhost:6379/0

# Admin Seed
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-immediately

# GitHub Integration
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_PERSONAL_ACCESS_TOKEN=your-github-pat
```

### Frontend (`apps/web/.env`)
```ini
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Running the Project

### Using Docker Compose (Recommended)
This runs the full stack (Next.js, FastAPI, Postgres, and Redis) locally without manually installing languages.

```bash
# Start all containers in background
docker-compose up -d

# View live container logs
docker-compose logs -f
```

### Running Locally (Manual Setup)

> [!NOTE]
> Make sure PostgreSQL and Redis are running on your system before proceeding.

#### 1. Setup Backend
```bash
cd apps/api
# Create virtual environment and install dependencies
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. Setup Frontend
```bash
cd apps/web
npm install
npm run dev
```
The frontend application will be hosted at `http://localhost:3000` and the API docs will be at `http://localhost:8000/api/docs`.

---

## 🎯 Production Checklist

- [ ] Change default `ADMIN_PASSWORD` and set secure `SECRET_KEY` in environment variables.
- [ ] Configure GitHub Webhooks to trigger automated project page sync when pushed.
- [ ] Connect a Cloudinary credentials account to handle user image/screenshot uploads.
- [ ] Ensure database backups are scheduled on production (PostgreSQL).
