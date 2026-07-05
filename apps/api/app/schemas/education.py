"""
Pydantic schemas for education.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ──────────────────────────────────────
# Response schemas
# ──────────────────────────────────────
class EducationResponse(BaseModel):
    id: str
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: bool
    description: Optional[str] = None
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class EducationListResponse(BaseModel):
    items: list[EducationResponse]
    total: int


# ──────────────────────────────────────
# Request schemas
# ──────────────────────────────────────
class EducationCreate(BaseModel):
    institution: str = Field(..., min_length=1, max_length=255)
    degree: str = Field(..., min_length=1, max_length=255)
    field_of_study: Optional[str] = None
    start_date: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    end_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$")
    is_current: bool = False
    description: Optional[str] = None
    sort_order: int = 0


class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    sort_order: Optional[int] = None
