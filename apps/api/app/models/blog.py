"""
Blog post SQLAlchemy model.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class BlogPost(Base):
    """Technical article or blog post."""

    __tablename__ = "blog_posts"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    summary: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        default="",
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    banner_url: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )
    tags: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        nullable=True,
    )
    is_published: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    read_time: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        doc="Estimated reading time in minutes",
    )
    views: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    published_at: Mapped[datetime | None] = mapped_column(
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
        return f"<BlogPost {self.title}>"
