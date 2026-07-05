"""
Experience API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.experience import Experience
from app.models.user import User
from app.schemas.experience import (
    ExperienceCreate,
    ExperienceListResponse,
    ExperienceResponse,
    ExperienceUpdate,
)

router = APIRouter()


# ──────────────────────────────────────
# Public endpoints
# ──────────────────────────────────────
@router.get("/public", response_model=ExperienceListResponse)
async def list_public_experiences(
    db: AsyncSession = Depends(get_db),
) -> ExperienceListResponse:
    """List all experiences sorted by order and start date (public)."""
    query = select(Experience).order_by(
        Experience.sort_order.asc(),
        Experience.start_date.desc(),
    )
    result = await db.execute(query)
    items = result.scalars().all()
    return ExperienceListResponse(
        items=[ExperienceResponse.model_validate(i) for i in items],
        total=len(items),
    )


# ──────────────────────────────────────
# Admin endpoints
# ──────────────────────────────────────
@router.get("", response_model=ExperienceListResponse)
async def list_all_experiences(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ExperienceListResponse:
    """List all experiences (admin)."""
    query = select(Experience).order_by(
        Experience.sort_order.asc(),
        Experience.start_date.desc(),
    )
    result = await db.execute(query)
    items = result.scalars().all()
    return ExperienceListResponse(
        items=[ExperienceResponse.model_validate(i) for i in items],
        total=len(items),
    )


@router.post("", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
async def create_experience(
    body: ExperienceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ExperienceResponse:
    """Create a new experience."""
    new_item = Experience(
        company=body.company,
        company_url=body.company_url,
        role=body.role,
        location=body.location,
        description=body.description,
        achievements=body.achievements or [],
        technologies=body.technologies or [],
        start_date=body.start_date,
        end_date=body.end_date if not body.is_current else None,
        is_current=body.is_current,
        sort_order=body.sort_order,
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return ExperienceResponse.model_validate(new_item)


@router.get("/{exp_id}", response_model=ExperienceResponse)
async def get_experience(
    exp_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ExperienceResponse:
    """Get experience details by ID."""
    result = await db.execute(select(Experience).where(Experience.id == exp_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Experience entry not found")
    return ExperienceResponse.model_validate(item)


@router.patch("/{exp_id}", response_model=ExperienceResponse)
async def update_experience(
    exp_id: str,
    body: ExperienceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ExperienceResponse:
    """Update experience details."""
    result = await db.execute(select(Experience).where(Experience.id == exp_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Experience entry not found")

    update_data = body.model_dump(exclude_unset=True)

    if update_data.get("is_current"):
        item.end_date = None

    for field, value in update_data.items():
        setattr(item, field, value)

    await db.commit()
    await db.refresh(item)
    return ExperienceResponse.model_validate(item)


@router.delete("/{exp_id}")
async def delete_experience(
    exp_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Delete experience entry."""
    result = await db.execute(select(Experience).where(Experience.id == exp_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Experience entry not found")

    await db.delete(item)
    await db.commit()
    return {"message": "Experience entry deleted successfully"}
