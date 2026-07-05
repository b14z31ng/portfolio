"""
Pydantic schemas for repository endpoints.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ──────────────────────────────────────
# Response schemas
# ──────────────────────────────────────
class RepositoryResponse(BaseModel):
    """Repository data returned to the frontend."""
    id: str
    github_id: int
    name: str
    full_name: str
    description: Optional[str] = None
    html_url: str
    homepage: Optional[str] = None
    language: Optional[str] = None
    stargazers_count: int = 0
    forks_count: int = 0
    topics: Optional[list[str]] = None
    is_fork: bool = False
    is_archived: bool = False
    is_selected: bool = False
    default_branch: str = "main"
    pushed_at: Optional[datetime] = None
    last_synced_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class RepositoryListResponse(BaseModel):
    """Paginated repository list response."""
    items: list[RepositoryResponse]
    total: int


# ──────────────────────────────────────
# Request schemas
# ──────────────────────────────────────
class RepositorySelectionRequest(BaseModel):
    """Request to toggle repository selection."""
    repository_ids: list[str] = Field(
        ...,
        description="List of repository IDs to mark as selected",
    )


# ──────────────────────────────────────
# GitHub sync schemas
# ──────────────────────────────────────
class GitHubStatusResponse(BaseModel):
    """GitHub connection status."""
    connected: bool
    username: Optional[str] = None
    total_repos: int = 0
    selected_repos: int = 0
    last_synced_at: Optional[datetime] = None


class SyncResultResponse(BaseModel):
    """Result of a GitHub sync operation."""
    synced: int
    created: int
    updated: int
    message: str
