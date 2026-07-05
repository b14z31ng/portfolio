"""
Application configuration using Pydantic Settings.
All settings are loaded from environment variables.
"""
from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ──────────────────────────────────────
    # Application
    # ──────────────────────────────────────
    APP_NAME: str = "Developer Portfolio API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Production-grade personal developer portfolio API"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # ──────────────────────────────────────
    # Server
    # ──────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    # ──────────────────────────────────────
    # Database
    # ──────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/portfolio"
    DATABASE_SYNC_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/portfolio"

    # ──────────────────────────────────────
    # Redis
    # ──────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ──────────────────────────────────────
    # Authentication
    # ──────────────────────────────────────
    SECRET_KEY: str = "change-me-in-production-use-a-strong-random-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ──────────────────────────────────────
    # Admin credentials (single user)
    # ──────────────────────────────────────
    ADMIN_EMAIL: str = "admin@portfolio.dev"
    ADMIN_PASSWORD: str = "change-me-in-production"

    # ──────────────────────────────────────
    # GitHub
    # ──────────────────────────────────────
    GITHUB_TOKEN: Optional[str] = None
    GITHUB_USERNAME: Optional[str] = None

    # ──────────────────────────────────────
    # Cloudinary
    # ──────────────────────────────────────
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

    # ──────────────────────────────────────
    # Frontend
    # ──────────────────────────────────────
    FRONTEND_URL: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        """Parse comma-separated CORS origins."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance."""
    return Settings()
