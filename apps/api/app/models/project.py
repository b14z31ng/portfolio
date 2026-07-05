"""
Project SQLAlchemy model.
Represents a portfolio project generated from a GitHub repository or created manually.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Technology(Base):
    """Technology / skill tag used across projects."""

    __tablename__ = "technologies"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    category: Mapped[str] = mapped_column(
        String(50), default="other", nullable=False,
        doc="language | framework | library | database | tool | platform | other",
    )
    color: Mapped[str | None] = mapped_column(String(20), nullable=True)
    icon_url: Mapped[str | None] = mapped_column(String(512), nullable=True)

    def __repr__(self) -> str:
        return f"<Technology {self.name}>"


class ProjectTechnology(Base):
    """Many-to-many association between projects and technologies."""

    __tablename__ = "project_technologies"

    project_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True
    )
    technology_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("technologies.id", ondelete="CASCADE"), primary_key=True
    )


class Project(Base):
    """Portfolio project — the centerpiece of the portfolio."""

    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False, default="")
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    banner_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    github_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    live_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    readme: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Generated content
    architecture: Mapped[str | None] = mapped_column(Text, nullable=True)
    features: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    challenges: Mapped[str | None] = mapped_column(Text, nullable=True)
    solutions: Mapped[str | None] = mapped_column(Text, nullable=True)
    lessons_learned: Mapped[str | None] = mapped_column(Text, nullable=True)
    screenshots: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)

    # GitHub metadata
    stars: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    forks: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    language: Mapped[str | None] = mapped_column(String(100), nullable=True)
    repository_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("repositories.id", ondelete="SET NULL"), nullable=True
    )

    # Status
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Timestamps
    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    technologies: Mapped[list["Technology"]] = relationship(
        secondary="project_technologies", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Project {self.title}>"
