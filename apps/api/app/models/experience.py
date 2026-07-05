"""
Experience SQLAlchemy model.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Experience(Base):
    """Professional experience / job entry."""

    __tablename__ = "experiences"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    company: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    company_url: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    role: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    achievements: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        nullable=True,
    )
    technologies: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        nullable=True,
    )
    start_date: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        doc="Format YYYY-MM",
    )
    end_date: Mapped[str | None] = mapped_column(
        String(10),
        nullable=True,
        doc="Format YYYY-MM or None if current",
    )
    is_current: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
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
        return f"<Experience {self.role} at {self.company}>"
