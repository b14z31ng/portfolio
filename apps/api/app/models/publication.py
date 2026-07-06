"""
Publication SQLAlchemy model.
Represents published academic or technical work.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Publication(Base):
    """Published work — papers, articles, conference proceedings."""

    __tablename__ = "publications"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    slug: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True,
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    subtitle: Mapped[str | None] = mapped_column(String(500), nullable=True)
    authors: Mapped[str] = mapped_column(String(1000), nullable=False)

    # ── Publication Venue ──
    conference: Mapped[str | None] = mapped_column(String(500), nullable=True)
    journal: Mapped[str | None] = mapped_column(String(500), nullable=True)
    publisher: Mapped[str | None] = mapped_column(String(255), nullable=True)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    publication_date: Mapped[str | None] = mapped_column(
        String(10), nullable=True, doc="Format YYYY-MM",
    )

    # ── Status ──
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="published",
        doc="published | accepted | under_review | draft",
    )

    # ── Identifiers & Links ──
    doi: Mapped[str | None] = mapped_column(String(255), nullable=True)
    citation: Mapped[str | None] = mapped_column(Text, nullable=True)
    bibtex: Mapped[str | None] = mapped_column(Text, nullable=True)
    pdf_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    presentation_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    github_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    url: Mapped[str | None] = mapped_column(String(512), nullable=True)

    # ── Content ──
    abstract: Mapped[str | None] = mapped_column(Text, nullable=True)
    keywords: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    images: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    categories: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)
    tags: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)

    # ── Visibility ──
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # ── Timestamps ──
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
        return f"<Publication {self.title}>"
