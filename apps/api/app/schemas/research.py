"""
Pydantic schemas for research.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ──────────────────────────────────────
# Response schemas
# ──────────────────────────────────────
class ResearchResponse(BaseModel):
    id: str
    title: str
    authors: str
    journal: str
    doi: Optional[str] = None
    url: Optional[str] = None
    published_date: str
    abstract: Optional[str] = None
    is_published: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ResearchListResponse(BaseModel):
    items: list[ResearchResponse]
    total: int


# ──────────────────────────────────────
# Request schemas
# ──────────────────────────────────────
class ResearchCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    authors: str = Field(..., min_length=1, max_length=255)
    journal: str = Field(..., min_length=1, max_length=255)
    doi: Optional[str] = Field(None, max_length=100)
    url: Optional[str] = Field(None, max_length=500)
    published_date: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    abstract: Optional[str] = None
    is_published: bool = True
    sort_order: int = 0


class ResearchUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    authors: Optional[str] = Field(None, min_length=1, max_length=255)
    journal: Optional[str] = Field(None, min_length=1, max_length=255)
    doi: Optional[str] = Field(None, max_length=100)
    url: Optional[str] = Field(None, max_length=500)
    published_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$")
    abstract: Optional[str] = None
    is_published: Optional[bool] = None
    sort_order: Optional[int] = None
