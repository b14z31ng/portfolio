"""
Publication API endpoints.
Full CRUD for publications with public listing.
"""
import re

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.publication import Publication
from app.models.user import User
from app.schemas.publication import (
    PublicationResponse,
    PublicationCardResponse,
    PublicationListResponse,
    PublicationCreate,
    PublicationUpdate,
)

router = APIRouter()


def _slugify(text: str) -> str:
    """Generate a URL-safe slug from text."""
    slug = text.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[-\s]+", "-", slug)
    return slug[:200]


# ──────────────────────────────────────
# Public endpoints
# ──────────────────────────────────────
@router.get("/public", response_model=PublicationListResponse)
async def list_public_publications(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    featured_only: bool = Query(False),
    db: AsyncSession = Depends(get_db),
) -> PublicationListResponse:
    """List published publications — no auth required."""
    query = select(Publication).where(Publication.is_published == True)
    if featured_only:
        query = query.where(Publication.is_featured == True)
    query = query.order_by(Publication.sort_order.asc(), Publication.year.desc().nulls_last())

    # Count
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    # Paginate
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PublicationListResponse(
        items=[PublicationCardResponse.model_validate(p) for p in items],
        total=total,
    )


@router.get("/public/{slug}", response_model=PublicationResponse)
async def get_public_publication(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> PublicationResponse:
    """Get a single published publication by slug — no auth required."""
    result = await db.execute(
        select(Publication).where(
            Publication.slug == slug,
            Publication.is_published == True,
        )
    )
    pub = result.scalar_one_or_none()
    if pub is None:
        raise HTTPException(status_code=404, detail="Publication not found")
    return PublicationResponse.model_validate(pub)


# ──────────────────────────────────────
# Admin endpoints
# ──────────────────────────────────────
@router.get("", response_model=PublicationListResponse)
async def list_publications(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PublicationListResponse:
    """List all publications (admin)."""
    query = select(Publication).order_by(
        Publication.sort_order.asc(), Publication.created_at.desc()
    )

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    items = result.scalars().all()

    return PublicationListResponse(
        items=[PublicationCardResponse.model_validate(p) for p in items],
        total=total,
    )


@router.get("/{publication_id}", response_model=PublicationResponse)
async def get_publication(
    publication_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PublicationResponse:
    """Get a single publication by ID (admin)."""
    result = await db.execute(
        select(Publication).where(Publication.id == publication_id)
    )
    pub = result.scalar_one_or_none()
    if pub is None:
        raise HTTPException(status_code=404, detail="Publication not found")
    return PublicationResponse.model_validate(pub)


@router.post("", response_model=PublicationResponse, status_code=status.HTTP_201_CREATED)
async def create_publication(
    body: PublicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PublicationResponse:
    """Create a new publication."""
    slug = _slugify(body.title)

    # Ensure unique slug
    existing = await db.execute(
        select(Publication).where(Publication.slug == slug)
    )
    if existing.scalar_one_or_none():
        slug = f"{slug}-{__import__('uuid').uuid4().hex[:6]}"

    pub = Publication(slug=slug, **body.model_dump())
    db.add(pub)
    await db.flush()
    return PublicationResponse.model_validate(pub)


@router.patch("/{publication_id}", response_model=PublicationResponse)
async def update_publication(
    publication_id: str,
    body: PublicationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PublicationResponse:
    """Update a publication."""
    result = await db.execute(
        select(Publication).where(Publication.id == publication_id)
    )
    pub = result.scalar_one_or_none()
    if pub is None:
        raise HTTPException(status_code=404, detail="Publication not found")

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(pub, field, value)

    await db.flush()
    return PublicationResponse.model_validate(pub)


@router.delete("/{publication_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_publication(
    publication_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """Delete a publication."""
    result = await db.execute(
        select(Publication).where(Publication.id == publication_id)
    )
    pub = result.scalar_one_or_none()
    if pub is None:
        raise HTTPException(status_code=404, detail="Publication not found")
    await db.delete(pub)
    await db.flush()
