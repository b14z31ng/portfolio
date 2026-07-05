"""
Repository SQLAlchemy model.
Stores GitHub repository metadata synced from the owner's account.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Repository(Base):
    """GitHub repository synced from the owner's account."""

    __tablename__ = "repositories"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    github_id: Mapped[int] = mapped_column(
        Integer,
        unique=True,
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    full_name: Mapped[str] = mapped_column(
        String(512),
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    html_url: Mapped[str] = mapped_column(
        String(512),
        nullable=False,
    )
    homepage: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    language: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    stargazers_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    forks_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    topics: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        nullable=True,
    )
    is_fork: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    is_archived: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    is_selected: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        doc="Whether this repo is selected for the portfolio",
    )
    readme_content: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        doc="Cached README.md content",
    )
    default_branch: Mapped[str] = mapped_column(
        String(100),
        default="main",
        nullable=False,
    )
    pushed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    last_synced_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
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
        return f"<Repository {self.full_name}>"
