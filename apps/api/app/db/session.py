"""
Database engine, session factory, and base model for SQLAlchemy.
"""
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings

settings = get_settings()

# ──────────────────────────────────────
# Async engine
# ──────────────────────────────────────
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)

# ──────────────────────────────────────
# Session factory
# ──────────────────────────────────────
async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# ──────────────────────────────────────
# Base model
# ──────────────────────────────────────
class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


# ──────────────────────────────────────
# Dependency
# ──────────────────────────────────────
async def get_db() -> AsyncSession:
    """Yield a database session for dependency injection."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
