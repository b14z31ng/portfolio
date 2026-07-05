"""
Education SQLAlchemy model.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Education(Base):
    """Education entry."""

    __tablename__ = "educations"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    institution: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    degree: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    field_of_study: Mapped[str | None] = mapped_column(
        String(255),
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
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
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
        return f"<Education at {self.institution}>"
