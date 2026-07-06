"""
Pydantic schemas for publication endpoints.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ──────────────────────────────────────
# Response schemas
# ──────────────────────────────────────
class PublicationResponse(BaseModel):
    """Full publication response."""
    id: str
    slug: str
    title: str
    subtitle: Optional[str] = None
    authors: str
    conference: Optional[str] = None
    journal: Optional[str] = None
    publisher: Optional[str] = None
    year: Optional[int] = None
    publication_date: Optional[str] = None
    status: str = "published"
    doi: Optional[str] = None
    citation: Optional[str] = None
    bibtex: Optional[str] = None
    pdf_url: Optional[str] = None
    presentation_url: Optional[str] = None
    github_url: Optional[str] = None
    url: Optional[str] = None
    abstract: Optional[str] = None
    keywords: Optional[list[str]] = None
    images: Optional[list[str]] = None
    categories: Optional[list[str]] = None
    tags: Optional[list[str]] = None
    is_featured: bool = False
    is_published: bool = True
    sort_order: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PublicationCardResponse(BaseModel):
    """Compact publication response for cards/lists."""
    id: str
    slug: str
    title: str
    authors: str
    conference: Optional[str] = None
    journal: Optional[str] = None
    year: Optional[int] = None
    status: str = "published"
    doi: Optional[str] = None
    pdf_url: Optional[str] = None
    github_url: Optional[str] = None
    abstract: Optional[str] = None
    keywords: Optional[list[str]] = None
    is_featured: bool = False
    is_published: bool = True

    model_config = {"from_attributes": True}


class PublicationListResponse(BaseModel):
    items: list[PublicationCardResponse]
    total: int


# ──────────────────────────────────────
# Request schemas
# ──────────────────────────────────────
class PublicationCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    subtitle: Optional[str] = Field(None, max_length=500)
    authors: str = Field(..., min_length=1, max_length=1000)
    conference: Optional[str] = Field(None, max_length=500)
    journal: Optional[str] = Field(None, max_length=500)
    publisher: Optional[str] = Field(None, max_length=255)
    year: Optional[int] = None
    publication_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$")
    status: str = Field("published", max_length=50)
    doi: Optional[str] = Field(None, max_length=255)
    citation: Optional[str] = None
    bibtex: Optional[str] = None
    pdf_url: Optional[str] = Field(None, max_length=512)
    presentation_url: Optional[str] = Field(None, max_length=512)
    github_url: Optional[str] = Field(None, max_length=512)
    url: Optional[str] = Field(None, max_length=512)
    abstract: Optional[str] = None
    keywords: Optional[list[str]] = None
    images: Optional[list[str]] = None
    categories: Optional[list[str]] = None
    tags: Optional[list[str]] = None
    is_featured: bool = False
    is_published: bool = True
    sort_order: int = 0


class PublicationUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    subtitle: Optional[str] = Field(None, max_length=500)
    authors: Optional[str] = Field(None, min_length=1, max_length=1000)
    conference: Optional[str] = Field(None, max_length=500)
    journal: Optional[str] = Field(None, max_length=500)
    publisher: Optional[str] = Field(None, max_length=255)
    year: Optional[int] = None
    publication_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}$")
    status: Optional[str] = Field(None, max_length=50)
    doi: Optional[str] = Field(None, max_length=255)
    citation: Optional[str] = None
    bibtex: Optional[str] = None
    pdf_url: Optional[str] = Field(None, max_length=512)
    presentation_url: Optional[str] = Field(None, max_length=512)
    github_url: Optional[str] = Field(None, max_length=512)
    url: Optional[str] = Field(None, max_length=512)
    abstract: Optional[str] = None
    keywords: Optional[list[str]] = None
    images: Optional[list[str]] = None
    categories: Optional[list[str]] = None
    tags: Optional[list[str]] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    sort_order: Optional[int] = None
