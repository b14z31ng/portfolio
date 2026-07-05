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
from fastapi import Request
from fastapi.responses import Response

@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response()
        origin = request.headers.get("origin")
        if origin:
            response.headers["Access-Control-Allow-Origin"] = origin
        else:
            response.headers["Access-Control-Allow-Origin"] = "*"
        
        req_headers = request.headers.get("access-control-request-headers")
        if req_headers:
            response.headers["Access-Control-Allow-Headers"] = req_headers
        else:
            response.headers["Access-Control-Allow-Headers"] = "*"
            
        req_method = request.headers.get("access-control-request-method")
        if req_method:
            response.headers["Access-Control-Allow-Methods"] = req_method
        else:
            response.headers["Access-Control-Allow-Methods"] = "*"
            
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

    response = await call_next(request)
    origin = request.headers.get("origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

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

