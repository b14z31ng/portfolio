"""
API v1 router aggregating all endpoint routers.
"""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    blog,
    education,
    experience,
    github,
    health,
    projects,
    repositories,
    research,
    certificates,
    media,
    profile,
    publications,
    resumes,
)

router = APIRouter(prefix="/api/v1")

# ──────────────────────────────────────
# Health
# ──────────────────────────────────────
router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"],
)

# ──────────────────────────────────────
# Authentication
# ──────────────────────────────────────
router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"],
)

# ──────────────────────────────────────
# GitHub Integration
# ──────────────────────────────────────
router.include_router(
    github.router,
    prefix="/github",
    tags=["GitHub"],
)

# ──────────────────────────────────────
# Repositories
# ──────────────────────────────────────
router.include_router(
    repositories.router,
    prefix="/repositories",
    tags=["Repositories"],
)

# ──────────────────────────────────────
# Projects
# ──────────────────────────────────────
router.include_router(
    projects.router,
    prefix="/projects",
    tags=["Projects"],
)

# ──────────────────────────────────────
# Blog
# ──────────────────────────────────────
router.include_router(
    blog.router,
    prefix="/blog",
    tags=["Blog"],
)

# ──────────────────────────────────────
# Experience
# ──────────────────────────────────────
router.include_router(
    experience.router,
    prefix="/experience",
    tags=["Experience"],
)

# ──────────────────────────────────────
# Education
# ──────────────────────────────────────
router.include_router(
    education.router,
    prefix="/education",
    tags=["Education"],
)

# ──────────────────────────────────────
# Research
# ──────────────────────────────────────
router.include_router(
    research.router,
    prefix="/research",
    tags=["Research"],
)

# ──────────────────────────────────────
# Certificates
# ──────────────────────────────────────
router.include_router(
    certificates.router,
    prefix="/certificates",
    tags=["Certificates"],
)

# ──────────────────────────────────────
# Media
# ──────────────────────────────────────
router.include_router(
    media.router,
    prefix="/media",
    tags=["Media"],
)

# ──────────────────────────────────────
# Profile
# ──────────────────────────────────────
router.include_router(
    profile.router,
    prefix="/profile",
    tags=["Profile"],
)

# ──────────────────────────────────────
# Publications
# ──────────────────────────────────────
router.include_router(
    publications.router,
    prefix="/publications",
    tags=["Publications"],
)

# ──────────────────────────────────────
# Resumes
# ──────────────────────────────────────
router.include_router(
    resumes.router,
    prefix="/resumes",
    tags=["Resumes"],
)
