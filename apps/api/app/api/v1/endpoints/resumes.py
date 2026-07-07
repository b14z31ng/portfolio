"""
Resumes API endpoints.
Full CRUD + activate / deactivate / feature / unfeature + upload.
"""
import io
import os
import uuid
import shutil
from datetime import datetime, timezone

import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.core.config import get_settings
from app.db.session import get_db
from app.models.profile import Resume
from app.models.user import User
from app.schemas.resume import (
    ResumeListResponse,
    ResumeResponse,
    ResumeUpdate,
)

router = APIRouter()
settings = get_settings()

# Cloudinary config check
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

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


# ──────────────────────────────────────
# Public endpoints
# ──────────────────────────────────────
@router.get("/public", response_model=ResumeListResponse)
async def list_public_resumes(
    db: AsyncSession = Depends(get_db),
) -> ResumeListResponse:
    """List active resumes for public visitors."""
    query = (
        select(Resume)
        .where(Resume.is_active == True)
        .order_by(Resume.display_order.asc(), Resume.created_at.desc())
    )
    result = await db.execute(query)
    items = result.scalars().all()
    return ResumeListResponse(
        items=[ResumeResponse.model_validate(i) for i in items],
        total=len(items),
    )


@router.get("/active", response_model=ResumeResponse)
async def get_active_resume(
    db: AsyncSession = Depends(get_db),
) -> ResumeResponse:
    """Get the currently active resume (public)."""
    result = await db.execute(
        select(Resume).where(Resume.is_active == True).limit(1)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="No active resume found")
    return ResumeResponse.model_validate(item)


# ──────────────────────────────────────
# Admin endpoints
# ──────────────────────────────────────
@router.get("", response_model=ResumeListResponse)
async def list_all_resumes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeListResponse:
    """List all resumes (admin)."""
    query = select(Resume).order_by(
        Resume.display_order.asc(), Resume.created_at.desc()
    )
    result = await db.execute(query)
    items = result.scalars().all()
    return ResumeListResponse(
        items=[ResumeResponse.model_validate(i) for i in items],
        total=len(items),
    )


@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeResponse:
    """Upload a new resume PDF."""
    # Validate content type
    if not file.content_type or file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume must be a PDF file (application/pdf)",
        )

    # Validate extension
    if file.filename and not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must have a .pdf extension",
        )

    # Read and validate size
    contents = await file.read()
    file_size = len(contents)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size must be under {MAX_FILE_SIZE // (1024 * 1024)} MB",
        )

    # Upload to Cloudinary or local
    if cloudinary_configured:
        try:
            upload_result = cloudinary.uploader.upload(
                io.BytesIO(contents),
                folder="portfolio_resumes",
                resource_type="raw",
                public_id=f"resume_{uuid.uuid4().hex[:8]}",
            )
            file_url = upload_result.get("secure_url")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Cloudinary upload failed: {str(e)}",
            )
    else:
        new_filename = f"resume_{uuid.uuid4().hex[:8]}.pdf"
        file_path = os.path.join(UPLOAD_DIR, new_filename)
        with open(file_path, "wb") as f:
            f.write(contents)
        file_url = f"/uploads/{new_filename}"

    # Derive title from filename
    original_name = file.filename or "resume.pdf"
    title = os.path.splitext(original_name)[0].replace("_", " ").replace("-", " ").title()

    new_resume = Resume(
        title=title,
        file_url=file_url,
        file_name=original_name,
        file_size=file_size,
        mime_type="application/pdf",
        file_data=contents if not cloudinary_configured else None,
        created_by=current_user.email,
        updated_by=current_user.email,
    )
    db.add(new_resume)
    await db.commit()
    await db.refresh(new_resume)
    return ResumeResponse.model_validate(new_resume)


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
) -> ResumeResponse:
    """Get resume details by ID (public for viewer page)."""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Resume not found")
    return ResumeResponse.model_validate(item)


from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Response
from fastapi.responses import FileResponse, RedirectResponse
# ... (rest of imports/configs) ...
@router.get("/{resume_id}/pdf")
async def get_resume_pdf(
    resume_id: str,
    download: bool = False,
    db: AsyncSession = Depends(get_db),
):
    """Get the raw PDF file of a resume for inline viewing or download, with DB fallback."""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Resume not found")

    disposition = "attachment" if download else "inline"

    if item.file_url.startswith("/uploads/"):
        filename = item.file_url.split("/")[-1]
        file_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(file_path):
            return FileResponse(
                file_path,
                media_type="application/pdf",
                content_disposition_type=disposition,
                filename=item.file_name,
            )
        elif item.file_data is not None:
            # Serve from DB fallback
            return Response(
                content=item.file_data,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f'{disposition}; filename="{item.file_name}"'
                }
            )
        else:
            raise HTTPException(status_code=404, detail="PDF file not found on disk or database")
    else:
        return RedirectResponse(item.file_url)



@router.patch("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: str,
    body: ResumeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeResponse:
    """Update resume metadata."""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Resume not found")

    update_data = body.model_dump(exclude_unset=True)

    # Enforce single-active rule
    if update_data.get("is_active") is True and not item.is_active:
        await db.execute(
            update(Resume).where(Resume.id != resume_id).values(is_active=False)
        )

    for field, value in update_data.items():
        setattr(item, field, value)

    item.updated_by = current_user.email
    await db.commit()
    await db.refresh(item)
    return ResumeResponse.model_validate(item)


@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Delete a resume."""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Resume not found")

    await db.delete(item)
    await db.commit()
    return {"message": "Resume deleted successfully"}


# ──────────────────────────────────────
# Action endpoints
# ──────────────────────────────────────
@router.post("/{resume_id}/activate", response_model=ResumeResponse)
async def activate_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeResponse:
    """Activate a resume (deactivates all others)."""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Deactivate all others
    await db.execute(
        update(Resume).where(Resume.id != resume_id).values(is_active=False)
    )
    item.is_active = True
    item.updated_by = current_user.email
    await db.commit()
    await db.refresh(item)
    return ResumeResponse.model_validate(item)


@router.post("/{resume_id}/deactivate", response_model=ResumeResponse)
async def deactivate_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeResponse:
    """Deactivate a resume."""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Resume not found")

    item.is_active = False
    item.updated_by = current_user.email
    await db.commit()
    await db.refresh(item)
    return ResumeResponse.model_validate(item)


@router.post("/{resume_id}/feature", response_model=ResumeResponse)
async def feature_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeResponse:
    """Mark a resume as featured."""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Resume not found")

    item.is_featured = True
    item.updated_by = current_user.email
    await db.commit()
    await db.refresh(item)
    return ResumeResponse.model_validate(item)


@router.post("/{resume_id}/unfeature", response_model=ResumeResponse)
async def unfeature_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResumeResponse:
    """Unmark a resume as featured."""
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Resume not found")

    item.is_featured = False
    item.updated_by = current_user.email
    await db.commit()
    await db.refresh(item)
    return ResumeResponse.model_validate(item)
