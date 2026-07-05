"""
Pydantic schemas for experience.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ──────────────────────────────────────
# Response schemas
# ──────────────────────────────────────
class ExperienceResponse(BaseModel):
    id: str
    company: str
    company_url: Optional[str] = None
    role: str
    location: Optional[str] = None
    description: Optional[str] = None
    achievements: Optional[list[str]] = None
    technologies: Optional[list[str]] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ExperienceListResponse(BaseModel):
    items: list[ExperienceResponse]
    total: int


# ──────────────────────────────────────
# Request schemas
# ──────────────────────────────────────
class ExperienceCreate(BaseModel):
    company: str = Field(..., min_length=1, max_length=255)
    company_url: Optional[str] = None
    role: str = Field(..., min_length=1, max_length=255)
    location: Optional[str] = None
    description: Optional[str] = None
    achievements: Optional[list[str]] = None
    technologies: Optional[list[str]] = None
    start_date: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    end_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$")
    is_current: bool = False
    sort_order: int = 0


class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    company_url: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    achievements: Optional[list[str]] = None
    technologies: Optional[list[str]] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    sort_order: Optional[int] = None
