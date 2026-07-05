"""
Repository CRUD API endpoints.
List, select, and manage synced GitHub repositories.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.repository import Repository
from app.models.user import User
from app.schemas.repository import (
    RepositoryListResponse,
    RepositoryResponse,
    RepositorySelectionRequest,
)

router = APIRouter()


@router.get("", response_model=RepositoryListResponse)
async def list_repositories(
    search: str | None = Query(None, description="Search by name or description"),
    language: str | None = Query(None, description="Filter by language"),
    selected_only: bool = Query(False, description="Show only selected repos"),
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RepositoryListResponse:
    """List all synced repositories with search and filters."""
    query = select(Repository)
    count_query = select(func.count(Repository.id))

    # Filters
    if search:
        search_filter = (
            Repository.name.ilike(f"%{search}%")
            | Repository.description.ilike(f"%{search}%")
        )
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    if language:
        query = query.where(Repository.language == language)
        count_query = count_query.where(Repository.language == language)

    if selected_only:
        query = query.where(Repository.is_selected == True)
        count_query = count_query.where(Repository.is_selected == True)

    # Count
    total = await db.scalar(count_query) or 0

    # Paginate
    offset = (page - 1) * per_page
    query = query.order_by(
        Repository.is_selected.desc(),
        Repository.stargazers_count.desc(),
        Repository.pushed_at.desc(),
    ).offset(offset).limit(per_page)

    result = await db.execute(query)
    repos = result.scalars().all()

    return RepositoryListResponse(
        items=[RepositoryResponse.model_validate(r) for r in repos],
        total=total,
    )


@router.get("/{repo_id}", response_model=RepositoryResponse)
async def get_repository(
    repo_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RepositoryResponse:
    """Get a single repository by ID."""
    result = await db.execute(
        select(Repository).where(Repository.id == repo_id)
    )
    repo = result.scalar_one_or_none()

    if repo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found",
        )

    return RepositoryResponse.model_validate(repo)


@router.put("/select", response_model=dict)
async def select_repositories(
    body: RepositorySelectionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Update repository selection.
    Marks the given IDs as selected and deselects all others.
    """
    # Deselect all
    await db.execute(
        update(Repository).values(is_selected=False)
    )

    # Select specified
    if body.repository_ids:
        await db.execute(
            update(Repository)
            .where(Repository.id.in_(body.repository_ids))
            .values(is_selected=True)
        )

    await db.commit()

    return {
        "message": f"Updated selection: {len(body.repository_ids)} repositories selected",
        "selected": len(body.repository_ids),
    }


@router.patch("/{repo_id}/toggle-select", response_model=RepositoryResponse)
async def toggle_repository_selection(
    repo_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RepositoryResponse:
    """Toggle the selection state of a single repository."""
    result = await db.execute(
        select(Repository).where(Repository.id == repo_id)
    )
    repo = result.scalar_one_or_none()

    if repo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Repository not found",
        )

    repo.is_selected = not repo.is_selected
    await db.commit()
    await db.refresh(repo)

    if repo.is_selected:
        # Fetch README if not cached
        if not repo.readme_content:
            from app.services.github_service import github_service
            await github_service.sync_readme_for_repo(db, repo.id)
            await db.refresh(repo)

        # Generate and publish the project
        from app.services.project_engine import project_engine
        await project_engine.generate_from_repository(db, repo)
    else:
        # Unpublish project if repository is deselected
        from app.models.project import Project
        proj_result = await db.execute(
            select(Project).where(Project.repository_id == repo.id)
        )
        project = proj_result.scalar_one_or_none()
        if project:
            project.is_published = False
            await db.commit()

    return RepositoryResponse.model_validate(repo)
