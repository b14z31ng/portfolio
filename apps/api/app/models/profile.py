"""
Profile SQLAlchemy model.
Single-row table storing all portfolio owner's personal information.
All public-facing personal data should come from this table.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String, Text, LargeBinary
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Profile(Base):
    """Portfolio owner profile — single row storing all personal info."""

    __tablename__ = "profiles"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    # ── Identity ──
    full_name: Mapped[str] = mapped_column(
        String(255), nullable=False, default="",
    )
    headline: Mapped[str] = mapped_column(
        String(500), nullable=False, default="",
        doc="Professional headline shown below name",
    )

    # ── Hero Section ──
    hero_title: Mapped[str] = mapped_column(
        Text, nullable=False, default="",
        doc="Main hero heading text",
    )
    hero_subtitle: Mapped[str] = mapped_column(
        Text, nullable=False, default="",
        doc="Secondary hero text / tagline",
    )
    hero_description: Mapped[str] = mapped_column(
        Text, nullable=False, default="",
        doc="Hero paragraph below the headline",
    )

    # ── About Section ──
    about_description: Mapped[str] = mapped_column(
        Text, nullable=False, default="",
        doc="About Me section content (supports markdown)",
    )

    # ── Contact & Location ──
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)

    # ── Social Links ──
    github_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    website_url: Mapped[str | None] = mapped_column(String(512), nullable=True)

    # ── Availability ──
    availability_status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="available",
        doc="available | open | busy | unavailable",
    )

    # ── Media ──
    profile_image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    resume_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    resume_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    resume_uploaded_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True,
    )

    # ── SEO ──
    seo_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    seo_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    og_image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    favicon_url: Mapped[str | None] = mapped_column(String(512), nullable=True)

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
        return f"<Profile {self.full_name}>"


class Resume(Base):
    """Resume / CV files for recruiters to download."""

    __tablename__ = "resumes"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    title: Mapped[str] = mapped_column(
        String(255), nullable=False, default="My Resume",
    )
    description: Mapped[str | None] = mapped_column(
        Text, nullable=True,
        doc="Optional description of the resume version",
    )
    version: Mapped[str | None] = mapped_column(
        String(50), nullable=True,
        doc="Version label e.g. v2.1, Summer 2026",
    )
    file_url: Mapped[str] = mapped_column(
        String(512), nullable=False,
        doc="URL to the uploaded PDF file",
    )
    file_name: Mapped[str] = mapped_column(
        String(255), nullable=False,
        doc="Original filename of the uploaded PDF",
    )
    thumbnail_url: Mapped[str | None] = mapped_column(
        String(512), nullable=True,
        doc="Optional preview thumbnail image URL",
    )
    file_size: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0,
        doc="File size in bytes",
    )
    mime_type: Mapped[str] = mapped_column(
        String(100), nullable=False, default="application/pdf",
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False,
        doc="Only one resume can be active at a time",
    )
    is_featured: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False,
    )
    display_order: Mapped[int] = mapped_column(
        Integer, default=0, nullable=False,
    )

    created_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    updated_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    file_data: Mapped[bytes | None] = mapped_column(LargeBinary, nullable=True)

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
        return f"<Resume {self.title}>"
