"""
Research API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.research import Research
from app.models.user import User
from app.schemas.research import (
    ResearchCreate,
    ResearchListResponse,
    ResearchResponse,
    ResearchUpdate,
)

router = APIRouter()


# ──────────────────────────────────────
# Public endpoints
# ──────────────────────────────────────
@router.get("/public", response_model=ResearchListResponse)
async def list_public_research(
    db: AsyncSession = Depends(get_db),
) -> ResearchListResponse:
    """List all public research publications sorted by sort order."""
    query = select(Research).where(Research.is_published == True).order_by(
        Research.sort_order.asc(),
        Research.published_date.desc(),
    )
    result = await db.execute(query)
    items = result.scalars().all()
    return ResearchListResponse(
        items=[ResearchResponse.model_validate(i) for i in items],
        total=len(items),
    )


# ──────────────────────────────────────
# Admin endpoints
# ──────────────────────────────────────
@router.get("", response_model=ResearchListResponse)
async def list_all_research(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResearchListResponse:
    """List all research publications (admin)."""
    query = select(Research).order_by(
        Research.sort_order.asc(),
        Research.published_date.desc(),
    )
    result = await db.execute(query)
    items = result.scalars().all()
    return ResearchListResponse(
        items=[ResearchResponse.model_validate(i) for i in items],
        total=len(items),
    )


@router.post("", response_model=ResearchResponse, status_code=status.HTTP_201_CREATED)
async def create_research(
    body: ResearchCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResearchResponse:
    """Create a new research publication."""
    new_item = Research(
        title=body.title,
        authors=body.authors,
        journal=body.journal,
        doi=body.doi,
        url=body.url,
        published_date=body.published_date,
        abstract=body.abstract,
        is_published=body.is_published,
        sort_order=body.sort_order,
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return ResearchResponse.model_validate(new_item)


@router.get("/{research_id}", response_model=ResearchResponse)
async def get_research(
    research_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResearchResponse:
    """Get research details by ID."""
    result = await db.execute(select(Research).where(Research.id == research_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Research entry not found")
    return ResearchResponse.model_validate(item)


@router.patch("/{research_id}", response_model=ResearchResponse)
async def update_research(
    research_id: str,
    body: ResearchUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ResearchResponse:
    """Update research details."""
    result = await db.execute(select(Research).where(Research.id == research_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Research entry not found")

    update_data = body.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(item, field, value)

    await db.commit()
    await db.refresh(item)
    return ResearchResponse.model_validate(item)


@router.delete("/{research_id}")
async def delete_research(
    research_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Delete research entry."""
    result = await db.execute(select(Research).where(Research.id == research_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Research entry not found")

    await db.delete(item)
    await db.commit()
    return {"message": "Research entry deleted successfully"}
