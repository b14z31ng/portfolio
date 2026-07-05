"""
Pydantic schemas for authentication endpoints.
"""
from pydantic import BaseModel, EmailStr, Field


# ──────────────────────────────────────
# Request Schemas
# ──────────────────────────────────────
class LoginRequest(BaseModel):
    """Login request body."""
    email: EmailStr = Field(..., description="Admin email address")
    password: str = Field(..., min_length=1, description="Admin password")


class RefreshRequest(BaseModel):
    """Token refresh request body."""
    refresh_token: str = Field(..., description="Valid refresh token")


# ──────────────────────────────────────
# Response Schemas
# ──────────────────────────────────────
class TokenResponse(BaseModel):
    """JWT token pair response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Current user profile response."""
    id: str
    email: str
    name: str
    is_active: bool

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
