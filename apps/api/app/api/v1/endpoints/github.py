"""
GitHub integration API endpoints.
Connect, sync, and manage GitHub repositories.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.repository import (
    GitHubStatusResponse,
    SyncResultResponse,
)
from app.services.github_service import github_service

router = APIRouter()


@router.get("/status", response_model=GitHubStatusResponse)
async def get_github_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GitHubStatusResponse:
    """Get GitHub connection status and sync statistics."""
    status_data = await github_service.get_status(db)
    return GitHubStatusResponse(**status_data)


@router.post("/sync", response_model=SyncResultResponse)
async def sync_repositories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SyncResultResponse:
    """
    Synchronize repositories from GitHub.
    Fetches all owner repositories and upserts them in the database.
    """
    if not github_service.is_connected:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitHub is not connected. Configure GITHUB_TOKEN and GITHUB_USERNAME.",
        )

    try:
        result = await github_service.sync_repositories(db)
        return SyncResultResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sync repositories: {str(e)}",
        )


@router.post("/sync-readme/{repo_id}")
async def sync_readme(
    repo_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Fetch and cache README for a specific repository."""
    if not github_service.is_connected:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitHub is not connected.",
        )

    readme = await github_service.sync_readme_for_repo(db, repo_id)
    if readme is None:
        return {"message": "No README found or repository not found"}

    return {"message": "README synced successfully", "has_readme": True}
