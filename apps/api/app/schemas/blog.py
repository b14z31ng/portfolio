"""
Pydantic schemas for blog posts.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ──────────────────────────────────────
# Response schemas
# ──────────────────────────────────────
class BlogPostResponse(BaseModel):
    """Full blog post details."""
    id: str
    slug: str
    title: str
    summary: str
    content: str
    banner_url: Optional[str] = None
    tags: Optional[list[str]] = None
    is_published: bool
    read_time: int
    views: int
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BlogPostCardResponse(BaseModel):
    """Compact blog post details for lists."""
    id: str
    slug: str
    title: str
    summary: str
    banner_url: Optional[str] = None
    tags: Optional[list[str]] = None
    is_published: bool
    read_time: int
    views: int
    published_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class BlogPostListResponse(BaseModel):
    """Paginated list of blog posts."""
    items: list[BlogPostCardResponse]
    total: int


# ──────────────────────────────────────
# Request schemas
# ──────────────────────────────────────
class BlogPostCreate(BaseModel):
    """Request to create a blog post."""
    title: str = Field(..., min_length=3, max_length=255)
    summary: str = Field("", max_length=500)
    content: str = Field(..., min_length=10)
    banner_url: Optional[str] = None
    tags: Optional[list[str]] = None
    is_published: bool = False


class BlogPostUpdate(BaseModel):
    """Request to update a blog post."""
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    banner_url: Optional[str] = None
    tags: Optional[list[str]] = None
    is_published: Optional[bool] = None
