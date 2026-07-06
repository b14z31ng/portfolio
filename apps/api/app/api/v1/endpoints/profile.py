"""
Profile API endpoints.
GET /profile/public — public profile data (no auth)
GET /profile — full profile (admin)
PATCH /profile — update profile (admin)
POST /profile/resume — upload resume (admin)
DELETE /profile/resume — delete resume (admin)
"""
import os
import uuid
import shutil
from datetime import datetime, timezone

import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.core.config import get_settings
from app.db.session import get_db
from app.models.profile import Profile, Resume
from app.models.user import User
from app.models.project import Project
from app.models.blog import BlogPost
from app.models.repository import Repository
from app.models.research import Research
from app.models.publication import Publication
from app.models.certificate import Certificate
from app.schemas.profile import ProfilePublicResponse, ProfileResponse, ProfileUpdate

router = APIRouter()
settings = get_settings()

# Cloudinary config check (reuse existing config from media module)
cloudinary_configured = bool(
    settings.CLOUDINARY_CLOUD_NAME
    and settings.CLOUDINARY_API_KEY
    and settings.CLOUDINARY_API_SECRET
)

UPLOAD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))),
    "uploads",
)
os.makedirs(UPLOAD_DIR, exist_ok=True)


async def _get_or_create_profile(db: AsyncSession) -> Profile:
    """Get the singleton profile row, creating it if it doesn't exist."""
    result = await db.execute(select(Profile).limit(1))
    profile = result.scalar_one_or_none()
    if profile is None:
        profile = Profile()
        db.add(profile)
        await db.flush()
    return profile


async def _overlay_active_resume(profile: Profile, db: AsyncSession) -> Profile:
    """Overlay the active resume from the resumes table onto the profile."""
    result = await db.execute(
        select(Resume).where(Resume.is_active == True).limit(1)
    )
    active_resume = result.scalar_one_or_none()
    if active_resume:
        profile.resume_url = active_resume.file_url
        profile.resume_filename = active_resume.file_name
        profile.resume_uploaded_at = active_resume.created_at
    else:
        profile.resume_url = None
        profile.resume_filename = None
        profile.resume_uploaded_at = None
    return profile


@router.get("/public", response_model=ProfilePublicResponse)
async def get_public_profile(
    db: AsyncSession = Depends(get_db),
) -> ProfilePublicResponse:
    """Get the public profile — no authentication required."""
    profile = await _get_or_create_profile(db)
    profile = await _overlay_active_resume(profile, db)
    return ProfilePublicResponse.model_validate(profile)


@router.get("", response_model=ProfileResponse)
async def get_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProfileResponse:
    """Get the full profile for admin editing."""
    profile = await _get_or_create_profile(db)
    profile = await _overlay_active_resume(profile, db)
    return ProfileResponse.model_validate(profile)


@router.patch("", response_model=ProfileResponse)
async def update_profile(
    body: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProfileResponse:
    """Update profile fields."""
    profile = await _get_or_create_profile(db)
    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
    await db.flush()
    profile = await _overlay_active_resume(profile, db)
    return ProfileResponse.model_validate(profile)


@router.post("/resume", response_model=ProfileResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProfileResponse:
    """Upload or replace the resume (PDF only)."""
    if not file.content_type or not file.content_type.startswith("application/pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume must be a PDF file",
        )

    # Max 10 MB
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size must be under 10 MB",
        )

    profile = await _get_or_create_profile(db)

    if cloudinary_configured:
        try:
            import io
            upload_result = cloudinary.uploader.upload(
                io.BytesIO(contents),
                folder="portfolio_resumes",
                resource_type="raw",
                public_id=f"resume_{uuid.uuid4().hex[:8]}",
            )
            profile.resume_url = upload_result.get("secure_url")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Cloudinary upload failed: {str(e)}",
            )
    else:
        # Local fallback
        new_filename = f"resume_{uuid.uuid4().hex[:8]}.pdf"
        file_path = os.path.join(UPLOAD_DIR, new_filename)
        with open(file_path, "wb") as f:
            f.write(contents)
        profile.resume_url = f"/uploads/{new_filename}"

    profile.resume_filename = file.filename
    profile.resume_uploaded_at = datetime.now(timezone.utc)
    await db.flush()

    return ProfileResponse.model_validate(profile)


@router.delete("/resume", response_model=ProfileResponse)
async def delete_resume(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProfileResponse:
    """Delete the current resume."""
    profile = await _get_or_create_profile(db)
    profile.resume_url = None
    profile.resume_filename = None
    profile.resume_uploaded_at = None
    await db.flush()
    return ProfileResponse.model_validate(profile)


@router.get("/dashboard-stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Get dashboard stats and profile completion details."""
    projects_count = await db.scalar(select(func.count(Project.id))) or 0
    blog_count = await db.scalar(select(func.count(BlogPost.id))) or 0
    repos_count = await db.scalar(select(func.count(Repository.id))) or 0
    research_count = await db.scalar(select(func.count(Research.id))) or 0
    publications_count = await db.scalar(select(func.count(Publication.id))) or 0
    certificates_count = await db.scalar(select(func.count(Certificate.id))) or 0

    profile = await _get_or_create_profile(db)

    completion_fields = {
        "full_name": bool(profile.full_name),
        "headline": bool(profile.headline),
        "hero_title": bool(profile.hero_title),
        "hero_subtitle": bool(profile.hero_subtitle),
        "hero_description": bool(profile.hero_description),
        "about_description": bool(profile.about_description),
        "email": bool(profile.email),
        "github_url": bool(profile.github_url),
        "linkedin_url": bool(profile.linkedin_url),
        "profile_image_url": bool(profile.profile_image_url),
        "resume_url": bool(profile.resume_url),
    }

    completed_count = sum(1 for val in completion_fields.values() if val)
    total_fields = len(completion_fields)
    completion_percentage = int((completed_count / total_fields) * 100) if total_fields > 0 else 100

    return {
        "counts": {
            "projects": projects_count,
            "blog_posts": blog_count,
            "repositories": repos_count,
            "research": research_count,
            "publications": publications_count,
            "certificates": certificates_count,
        },
        "profile_completion": {
            "percentage": completion_percentage,
            "fields": completion_fields,
        }
    }

