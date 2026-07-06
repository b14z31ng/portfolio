"""
Project API endpoints.
CRUD operations for portfolio projects.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.project import Project, Technology
from app.models.user import User
from app.schemas.project import (
    GenerateResultResponse,
    ProjectCardResponse,
    ProjectListResponse,
    ProjectResponse,
    ProjectUpdateRequest,
    TechnologyResponse,
)
from app.services.project_engine import project_engine

router = APIRouter()


# ──────────────────────────────────────
# Public endpoints
# ──────────────────────────────────────
@router.get("/public", response_model=ProjectListResponse)
async def list_public_projects(
    featured_only: bool = Query(False),
    search: str | None = Query(None),
    language: str | None = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> ProjectListResponse:
    """List published projects (public, no auth required)."""
    query = select(Project).where(Project.is_published == True)
    count_query = select(func.count(Project.id)).where(Project.is_published == True)

    if featured_only:
        query = query.where(Project.is_featured == True)
        count_query = count_query.where(Project.is_featured == True)

    if search:
        search_filter = Project.title.ilike(f"%{search}%") | Project.summary.ilike(f"%{search}%")
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    if language:
        query = query.where(Project.language == language)
        count_query = count_query.where(Project.language == language)

    total = await db.scalar(count_query) or 0
    offset = (page - 1) * per_page

    query = query.order_by(
        Project.sort_order.asc(), Project.is_featured.desc(), Project.created_at.desc()
    ).offset(offset).limit(per_page)

    result = await db.execute(query)
    projects = result.scalars().all()

    return ProjectListResponse(
        items=[ProjectCardResponse.model_validate(p) for p in projects],
        total=total,
    )


@router.get("/public/technologies", response_model=list[TechnologyResponse])
async def list_public_technologies(
    db: AsyncSession = Depends(get_db),
) -> list[TechnologyResponse]:
    """List all technologies (public, no auth required)."""
    print("[DEBUG] list_public_technologies route hit")
    result = await db.execute(select(Technology).order_by(Technology.name.asc()))
    technologies = result.scalars().all()
    return [TechnologyResponse.model_validate(t) for t in technologies]


@router.get("/public/{slug}", response_model=ProjectResponse)
async def get_public_project(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    """Get a single published project by slug (public)."""
    print(f"[DEBUG] get_public_project route hit with slug={slug}")
    result = await db.execute(
        select(Project).where(Project.slug == slug, Project.is_published == True)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse.model_validate(project)


# ──────────────────────────────────────
# Admin endpoints
# ──────────────────────────────────────
@router.get("", response_model=ProjectListResponse)
async def list_all_projects(
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProjectListResponse:
    """List all projects (admin, includes drafts)."""
    query = select(Project)
    count_query = select(func.count(Project.id))

    if search:
        search_filter = Project.title.ilike(f"%{search}%")
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    total = await db.scalar(count_query) or 0
    offset = (page - 1) * per_page

    query = query.order_by(Project.sort_order.asc(), Project.created_at.desc()).offset(offset).limit(per_page)

    result = await db.execute(query)
    projects = result.scalars().all()

    return ProjectListResponse(
        items=[ProjectCardResponse.model_validate(p) for p in projects],
        total=total,
    )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProjectResponse:
    """Get a single project by ID (admin)."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse.model_validate(project)


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    body: ProjectUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ProjectResponse:
    """Update a project's editable fields."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    await db.commit()
    await db.refresh(project)
    return ProjectResponse.model_validate(project)


@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Delete a project."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    await db.delete(project)
    await db.commit()
    return {"message": "Project deleted"}


@router.post("/generate", response_model=GenerateResultResponse)
async def generate_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GenerateResultResponse:
    """Generate project pages from all selected repositories."""
    try:
        result = await project_engine.generate_all_selected(db)
        return GenerateResultResponse(**result)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Generation failed: {str(e)}"
        )
