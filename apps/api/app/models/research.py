"""
Research SQLAlchemy model.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Research(Base):
    """Research publication entry."""

    __tablename__ = "research"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    authors: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    journal: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    doi: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    published_date: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        doc="Format YYYY-MM",
    )
    abstract: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    is_published: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    sort_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Research publication {self.title}>"
