"""
Pydantic schemas for resume endpoints.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ──────────────────────────────────────
# Response schemas
# ──────────────────────────────────────
class ResumeResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    version: Optional[str] = None
    file_url: str
    file_name: str
    thumbnail_url: Optional[str] = None
    file_size: int
    mime_type: str
    is_active: bool
    is_featured: bool
    display_order: int
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ResumeListResponse(BaseModel):
    items: list[ResumeResponse]
    total: int


# ──────────────────────────────────────
# Request schemas
# ──────────────────────────────────────
class ResumeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    version: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None
