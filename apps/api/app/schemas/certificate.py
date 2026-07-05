"""
Pydantic schemas for certificate.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ──────────────────────────────────────
# Response schemas
# ──────────────────────────────────────
class CertificateResponse(BaseModel):
    id: str
    title: str
    provider: str
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    issue_date: str
    expiration_date: Optional[str] = None
    is_active: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CertificateListResponse(BaseModel):
    items: list[CertificateResponse]
    total: int


# ──────────────────────────────────────
# Request schemas
# ──────────────────────────────────────
class CertificateCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    provider: str = Field(..., min_length=1, max_length=255)
    credential_id: Optional[str] = Field(None, max_length=255)
    credential_url: Optional[str] = Field(None, max_length=500)
    issue_date: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    expiration_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$")
    is_active: bool = True
    sort_order: int = 0


class CertificateUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    provider: Optional[str] = Field(None, min_length=1, max_length=255)
    credential_id: Optional[str] = Field(None, max_length=255)
    credential_url: Optional[str] = Field(None, max_length=500)
    issue_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$")
    expiration_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$")
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None
