"""
Certificate SQLAlchemy model.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Certificate(Base):
    """Professional Certificate entry."""

    __tablename__ = "certificates"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    provider: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    credential_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    credential_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    issue_date: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        doc="Format YYYY-MM",
    )
    expiration_date: Mapped[str | None] = mapped_column(
        String(10),
        nullable=True,
        doc="Format YYYY-MM or None if no expiration",
    )
    is_active: Mapped[bool] = mapped_column(
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
        return f"<Certificate {self.title} from {self.provider}>"
