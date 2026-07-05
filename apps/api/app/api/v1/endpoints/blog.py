"""
Blog API endpoints.
"""
from datetime import datetime, timezone
import math

from fastapi import APIRouter, Depends, HTTPException, Query, status
from slugify import slugify
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.blog import BlogPost
from app.models.user import User
from app.schemas.blog import (
    BlogPostCardResponse,
    BlogPostCreate,
    BlogPostListResponse,
    BlogPostResponse,
    BlogPostUpdate,
)

router = APIRouter()


def estimate_read_time(content: str) -> int:
    """Estimate read time in minutes (based on 200 WPM)."""
    words = len(content.split())
    return max(1, math.ceil(words / 200))


# ──────────────────────────────────────
# Public endpoints
# ──────────────────────────────────────
@router.get("/public", response_model=BlogPostListResponse)
async def list_public_posts(
    tag: str | None = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> BlogPostListResponse:
    """List all published blog posts (public)."""
    query = select(BlogPost).where(BlogPost.is_published == True)
    count_query = select(func.count(BlogPost.id)).where(BlogPost.is_published == True)

    if tag:
        # PostgreSQL array search
        query = query.where(BlogPost.tags.any(tag))
        count_query = count_query.where(BlogPost.tags.any(tag))

    total = await db.scalar(count_query) or 0
    offset = (page - 1) * per_page

    query = query.order_by(BlogPost.published_at.desc()).offset(offset).limit(per_page)
    result = await db.execute(query)
    posts = result.scalars().all()

    return BlogPostListResponse(
        items=[BlogPostCardResponse.model_validate(p) for p in posts],
        total=total,
    )


@router.get("/public/{slug}", response_model=BlogPostResponse)
async def get_public_post(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> BlogPostResponse:
    """Get a single published blog post by slug and increment views."""
    result = await db.execute(
        select(BlogPost).where(BlogPost.slug == slug, BlogPost.is_published == True)
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    # Increment views
    post.views += 1
    await db.commit()
    await db.refresh(post)

    return BlogPostResponse.model_validate(post)


# ──────────────────────────────────────
# Admin endpoints
# ──────────────────────────────────────
@router.get("", response_model=BlogPostListResponse)
async def list_all_posts(
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BlogPostListResponse:
    """List all posts (admin, includes drafts)."""
    query = select(BlogPost)
    count_query = select(func.count(BlogPost.id))

    if search:
        search_filter = BlogPost.title.ilike(f"%{search}%") | BlogPost.summary.ilike(f"%{search}%")
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    total = await db.scalar(count_query) or 0
    offset = (page - 1) * per_page

    query = query.order_by(BlogPost.created_at.desc()).offset(offset).limit(per_page)
    result = await db.execute(query)
    posts = result.scalars().all()

    return BlogPostListResponse(
        items=[BlogPostCardResponse.model_validate(p) for p in posts],
        total=total,
    )


@router.post("", response_model=BlogPostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    body: BlogPostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BlogPostResponse:
    """Create a new blog post."""
    post_slug = slugify(body.title)

    # Check unique slug
    slug_exists = await db.scalar(
        select(func.count(BlogPost.id)).where(BlogPost.slug == post_slug)
    )
    if slug_exists:
        post_slug = f"{post_slug}-{int(datetime.now().timestamp())}"

    read_time = estimate_read_time(body.content)
    published_at = datetime.now(timezone.utc) if body.is_published else None

    new_post = BlogPost(
        slug=post_slug,
        title=body.title,
        summary=body.summary or body.content[:200] + "...",
        content=body.content,
        banner_url=body.banner_url,
        tags=body.tags or [],
        is_published=body.is_published,
        read_time=read_time,
        published_at=published_at,
    )

    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)
    return BlogPostResponse.model_validate(new_post)


@router.get("/{post_id}", response_model=BlogPostResponse)
async def get_post(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BlogPostResponse:
    """Get a blog post by ID."""
    result = await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return BlogPostResponse.model_validate(post)


@router.patch("/{post_id}", response_model=BlogPostResponse)
async def update_post(
    post_id: str,
    body: BlogPostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BlogPostResponse:
    """Update a blog post."""
    result = await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    update_data = body.model_dump(exclude_unset=True)

    if "title" in update_data and update_data["title"] != post.title:
        post_slug = slugify(update_data["title"])
        # Check slug collision
        slug_exists = await db.scalar(
            select(func.count(BlogPost.id)).where(BlogPost.slug == post_slug, BlogPost.id != post_id)
        )
        if slug_exists:
            post_slug = f"{post_slug}-{int(datetime.now().timestamp())}"
        post.slug = post_slug

    if "content" in update_data:
        post.read_time = estimate_read_time(update_data["content"])

    if "is_published" in update_data:
        if update_data["is_published"] and not post.is_published:
            post.published_at = datetime.now(timezone.utc)
        elif not update_data["is_published"]:
            post.published_at = None

    for field, value in update_data.items():
        setattr(post, field, value)

    await db.commit()
    await db.refresh(post)
    return BlogPostResponse.model_validate(post)


@router.delete("/{post_id}", status_code=status.HTTP_200_OK)
async def delete_post(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """Delete a blog post."""
    result = await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")

    await db.delete(post)
    await db.commit()
    return {"message": "Blog post deleted successfully"}
