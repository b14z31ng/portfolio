"""
Health check endpoint for monitoring and deployment verification.
"""
from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def health_check() -> dict:
    """
    Health check endpoint.
    Returns service status and timestamp.
    Used by Render for deployment health monitoring.
    """
    return {
        "status": "healthy",
        "service": "portfolio-api",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
