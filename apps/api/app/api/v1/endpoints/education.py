"""
Education API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.education import Education
from app.models.user import User
from app.schemas.education import (
    EducationCreate,
    EducationListResponse,
    EducationResponse,
    EducationUpdate,
)

router = APIRouter()


# ──────────────────────────────────────
# Public endpoints
# ──────────────────────────────────────
@router.get("/public", response_model=EducationListResponse)
async def list_public_educations(
    db: AsyncSession = Depends(get_db),
) -> EducationListResponse:
    """List all educations sorted by sort order (public)."""
    query = select(Education).order_by(
        Education.sort_order.asc(),
        Education.start_date.desc(),
    )
    result = await db.execute(query)
    items = result.scalars().all()
    return EducationListResponse(
        items=[EducationResponse.model_validate(i) for i in items],
        total=len(items),
    )


# ──────────────────────────────────────
# Admin endpoints
# ──────────────────────────────────────
@router.get("", response_model=EducationListResponse)
async def list_all_educations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EducationListResponse:
    """List all educations (admin)."""
    query = select(Education).order_by(
        Education.sort_order.asc(),
        Education.start_date.desc(),
    )
    result = await db.execute(query)
    items = result.scalars().all()
    return EducationListResponse(
        items=[EducationResponse.model_validate(i) for i in items],
        total=len(items),
    )


@router.post("", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
async def create_education(
    body: EducationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EducationResponse:
    """Create a new education entry."""
    new_item = Education(
        institution=body.institution,
        degree=body.degree,
        field_of_study=body.field_of_study,
        start_date=body.start_date,
        end_date=body.end_date if not body.is_current else None,
        is_current=body.is_current,
        description=body.description,
        sort_order=body.sort_order,
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return EducationResponse.model_validate(new_item)


@router.get("/{edu_id}", response_model=EducationResponse)
async def get_education(
    edu_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EducationResponse:
    """Get education details by ID."""
    result = await db.execute(select(Education).where(Education.id == edu_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Education entry not found")
    return EducationResponse.model_validate(item)


@router.patch("/{edu_id}", response_model=EducationResponse)
async def update_education(
    edu_id: str,
    body: EducationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EducationResponse:
    """Update education details."""
    result = await db.execute(select(Education).where(Education.id == edu_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Education entry not found")

    update_data = body.model_dump(exclude_unset=True)

    if update_data.get("is_current"):
        item.end_date = None

    for field, value in update_data.items():
        setattr(item, field, value)

    await db.commit()
    await db.refresh(item)
    return EducationResponse.model_validate(item)


@router.delete("/{edu_id}")
async def delete_education(
    edu_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Delete education entry."""
    result = await db.execute(select(Education).where(Education.id == edu_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Education entry not found")

    await db.delete(item)
    await db.commit()
    return {"message": "Education entry deleted successfully"}
