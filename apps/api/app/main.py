"""
FastAPI application entry point.
Configures CORS, routers, lifecycle events, and database initialization.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import router as api_v1_router
from app.core.config import get_settings
from app.db.init_db import init_db
from app.db.session import Base, async_session_factory, engine

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle manager."""
    # ── Startup ──
    print(f"[STARTUP] {settings.APP_NAME} v{settings.APP_VERSION} starting...")
    print(f"[ENV] Environment: {settings.ENVIRONMENT}")

    # Create tables and seed admin user
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[DB] Database tables created")

    async with async_session_factory() as session:
        await init_db(session)

    yield
    # ── Shutdown ──
    await engine.dispose()
    print(f"[SHUTDOWN] {settings.APP_NAME} shutting down...")


# ──────────────────────────────────────
# Application factory
# ──────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ──────────────────────────────────────
# CORS
# ──────────────────────────────────────
origins = settings.cors_origins
allow_all = "*" in origins or not origins or (len(origins) == 1 and origins[0] == "")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else origins,
    allow_credentials=False if allow_all else True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────
# Routers
# ──────────────────────────────────────
app.include_router(api_v1_router)

# Mount uploads directory to serve media files statically
import os
uploads_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "uploads"
)
os.makedirs(uploads_path, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")



# ──────────────────────────────────────
# Root
# ──────────────────────────────────────
@app.get("/", tags=["Root"])
async def root():
    """API root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/api/docs",
    }

# Force reload triggers: reload-2

