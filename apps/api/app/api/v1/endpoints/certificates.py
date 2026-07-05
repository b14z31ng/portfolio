"""
Certificates API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.certificate import Certificate
from app.models.user import User
from app.schemas.certificate import (
    CertificateCreate,
    CertificateListResponse,
    CertificateResponse,
    CertificateUpdate,
)

router = APIRouter()


# ──────────────────────────────────────
# Public endpoints
# ──────────────────────────────────────
@router.get("/public", response_model=CertificateListResponse)
async def list_public_certificates(
    db: AsyncSession = Depends(get_db),
) -> CertificateListResponse:
    """List all active certificates sorted by sort order."""
    query = select(Certificate).where(Certificate.is_active == True).order_by(
        Certificate.sort_order.asc(),
        Certificate.issue_date.desc(),
    )
    result = await db.execute(query)
    items = result.scalars().all()
    return CertificateListResponse(
        items=[CertificateResponse.model_validate(i) for i in items],
        total=len(items),
    )


# ──────────────────────────────────────
# Admin endpoints
# ──────────────────────────────────────
@router.get("", response_model=CertificateListResponse)
async def list_all_certificates(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CertificateListResponse:
    """List all certificates (admin)."""
    query = select(Certificate).order_by(
        Certificate.sort_order.asc(),
        Certificate.issue_date.desc(),
    )
    result = await db.execute(query)
    items = result.scalars().all()
    return CertificateListResponse(
        items=[CertificateResponse.model_validate(i) for i in items],
        total=len(items),
    )


@router.post("", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
async def create_certificate(
    body: CertificateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CertificateResponse:
    """Create a new certificate entry."""
    new_item = Certificate(
        title=body.title,
        provider=body.provider,
        credential_id=body.credential_id,
        credential_url=body.credential_url,
        issue_date=body.issue_date,
        expiration_date=body.expiration_date,
        is_active=body.is_active,
        sort_order=body.sort_order,
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return CertificateResponse.model_validate(new_item)


@router.get("/{cert_id}", response_model=CertificateResponse)
async def get_certificate(
    cert_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CertificateResponse:
    """Get certificate details by ID."""
    result = await db.execute(select(Certificate).where(Certificate.id == cert_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Certificate entry not found")
    return CertificateResponse.model_validate(item)


@router.patch("/{cert_id}", response_model=CertificateResponse)
async def update_certificate(
    cert_id: str,
    body: CertificateUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CertificateResponse:
    """Update certificate details."""
    result = await db.execute(select(Certificate).where(Certificate.id == cert_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Certificate entry not found")

    update_data = body.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(item, field, value)

    await db.commit()
    await db.refresh(item)
    return CertificateResponse.model_validate(item)


@router.delete("/{cert_id}")
async def delete_certificate(
    cert_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Delete certificate entry."""
    result = await db.execute(select(Certificate).where(Certificate.id == cert_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Certificate entry not found")

    await db.delete(item)
    await db.commit()
    return {"message": "Certificate entry deleted successfully"}
