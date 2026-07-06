"""
Pydantic schemas for profile endpoints.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ──────────────────────────────────────
# Response schemas
# ──────────────────────────────────────
class ProfilePublicResponse(BaseModel):
    """Public profile data — no sensitive fields exposed."""
    full_name: str
    headline: str
    hero_title: str
    hero_subtitle: str
    hero_description: str
    about_description: str
    email: Optional[str] = None
    location: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    website_url: Optional[str] = None
    availability_status: str = "available"
    profile_image_url: Optional[str] = None
    resume_url: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    og_image_url: Optional[str] = None
    favicon_url: Optional[str] = None

    model_config = {"from_attributes": True}


class ProfileResponse(BaseModel):
    """Full profile response for admin."""
    id: str
    full_name: str
    headline: str
    hero_title: str
    hero_subtitle: str
    hero_description: str
    about_description: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    website_url: Optional[str] = None
    availability_status: str = "available"
    profile_image_url: Optional[str] = None
    resume_url: Optional[str] = None
    resume_filename: Optional[str] = None
    resume_uploaded_at: Optional[datetime] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    og_image_url: Optional[str] = None
    favicon_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ──────────────────────────────────────
# Request schemas
# ──────────────────────────────────────
class ProfileUpdate(BaseModel):
    """Update profile fields — all optional."""
    full_name: Optional[str] = Field(None, max_length=255)
    headline: Optional[str] = Field(None, max_length=500)
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_description: Optional[str] = None
    about_description: Optional[str] = None
    email: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, max_length=255)
    github_url: Optional[str] = Field(None, max_length=512)
    linkedin_url: Optional[str] = Field(None, max_length=512)
    website_url: Optional[str] = Field(None, max_length=512)
    availability_status: Optional[str] = Field(None, max_length=50)
    profile_image_url: Optional[str] = Field(None, max_length=512)
    seo_title: Optional[str] = Field(None, max_length=255)
    seo_description: Optional[str] = None
    og_image_url: Optional[str] = Field(None, max_length=512)
    favicon_url: Optional[str] = Field(None, max_length=512)
