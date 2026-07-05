"""
Database initialization.
Seeds the admin user on first run if not already present.
"""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import hash_password
from app.models.user import User

settings = get_settings()


async def init_db(db: AsyncSession) -> None:
    """
    Initialize database with the admin user.
    Only creates the user if it doesn't already exist.
    """
    result = await db.execute(
        select(User).where(User.email == settings.ADMIN_EMAIL)
    )
    existing_user = result.scalar_one_or_none()

    if existing_user is None:
        admin = User(
            email=settings.ADMIN_EMAIL,
            hashed_password=hash_password(settings.ADMIN_PASSWORD),
            name="Portfolio Owner",
            is_active=True,
        )
        db.add(admin)
        await db.commit()
        print(f"[DB] Admin user created: {settings.ADMIN_EMAIL}")
    else:
        print(f"[DB] Admin user already exists: {settings.ADMIN_EMAIL}")
