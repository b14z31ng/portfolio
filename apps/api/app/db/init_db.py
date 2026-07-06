"""
Database initialization.
Seeds the admin user and default profile on first run.
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import hash_password
from app.models.user import User
from app.models.profile import Profile
from app.models.publication import Publication  # noqa: F401 — ensure table creation
from app.models.profile import Resume  # noqa: F401 — ensure table creation

settings = get_settings()


async def init_db(db: AsyncSession) -> None:
    """
    Initialize database with the admin user and default profile.
    Only creates records if they don't already exist.
    """
    # ── Admin User ──
    result = await db.execute(
        select(User).where(User.email == settings.ADMIN_EMAIL)
    )
    existing_user = result.scalar_one_or_none()

    if existing_user is None:
        admin = User(
            email=settings.ADMIN_EMAIL,
            hashed_password=hash_password(settings.ADMIN_PASSWORD),
            name="Reshad Romim",
            is_active=True,
        )
        db.add(admin)
        await db.commit()
        print(f"[DB] Admin user created: {settings.ADMIN_EMAIL}")
    else:
        print(f"[DB] Admin user already exists: {settings.ADMIN_EMAIL}")

    # ── Default Profile ──
    result = await db.execute(select(Profile).limit(1))
    existing_profile = result.scalar_one_or_none()

    if existing_profile is None:
        profile = Profile(
            full_name="Reshad Romim",
            headline="Backend Engineer · AI Developer · CS Student",
            hero_title="Engineering intelligent systems\nfrom backend to deployment.",
            hero_subtitle="Backend Engineer & AI Developer",
            hero_description=(
                "Computer Science student and software engineer focused on "
                "backend systems, artificial intelligence, and scalable architecture. "
                "I build production-grade applications with Python, FastAPI, and Next.js — "
                "designed for performance, maintainability, and real-world impact."
            ),
            about_description=(
                "I'm a Computer Science student and self-driven software engineer with a deep focus on "
                "backend engineering, artificial intelligence, and modern web development. "
                "My work centers on building production-ready systems — from RESTful APIs and database "
                "architecture to machine learning pipelines and full-stack applications.\n\n"
                "I believe great software is built on clean architecture, thoughtful design, and continuous "
                "iteration. Every project I take on is an opportunity to solve real problems with elegant, "
                "maintainable code.\n\n"
                "Currently, I'm focused on deepening my expertise in distributed systems, "
                "machine learning engineering, and cloud-native development — while building tools "
                "that make a meaningful difference."
            ),
            email="",
            github_url="https://github.com/b14z31ng",
            linkedin_url="https://www.linkedin.com/in/reshadromimkhan/",
            availability_status="available",
            seo_title="Reshad Romim — Backend Engineer & AI Developer",
            seo_description=(
                "Portfolio of Reshad Romim — Computer Science student and software engineer "
                "specializing in backend systems, artificial intelligence, and scalable architecture."
            ),
        )
        db.add(profile)
        await db.commit()
        print("[DB] Default profile created for Reshad Romim")
    else:
        print("[DB] Profile already exists")
