"""
Pydantic schemas for project endpoints.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TechnologyResponse(BaseModel):
    id: str
    name: str
    slug: str
    category: str
    color: Optional[str] = None
    icon_url: Optional[str] = None
    model_config = {"from_attributes": True}


class ProjectResponse(BaseModel):
    """Full project response for detail pages."""
    id: str
    slug: str
    title: str
    summary: str
    description: Optional[str] = None
    banner_url: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    readme: Optional[str] = None
    architecture: Optional[str] = None
    features: Optional[list[str]] = None
    challenges: Optional[str] = None
    solutions: Optional[str] = None
    lessons_learned: Optional[str] = None
    screenshots: Optional[list[str]] = None
    stars: int = 0
    forks: int = 0
    language: Optional[str] = None
    is_featured: bool = False
    is_published: bool = False
    sort_order: int = 0
    technologies: list[TechnologyResponse] = []
    last_synced_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class ProjectCardResponse(BaseModel):
    """Compact project response for cards/lists."""
    id: str
    slug: str
    title: str
    summary: str
    banner_url: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    stars: int = 0
    language: Optional[str] = None
    is_featured: bool = False
    is_published: bool = False
    technologies: list[TechnologyResponse] = []
    model_config = {"from_attributes": True}


class ProjectListResponse(BaseModel):
    items: list[ProjectCardResponse]
    total: int


class ProjectUpdateRequest(BaseModel):
    """Update project fields."""
    title: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    banner_url: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    architecture: Optional[str] = None
    features: Optional[list[str]] = None
    challenges: Optional[str] = None
    solutions: Optional[str] = None
    lessons_learned: Optional[str] = None
    screenshots: Optional[list[str]] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    sort_order: Optional[int] = None


class GenerateResultResponse(BaseModel):
    generated: int
    message: str
