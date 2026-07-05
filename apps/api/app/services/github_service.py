"""
GitHub API integration service.
Fetches repositories and README content from the owner's GitHub account.
"""
import base64
from datetime import datetime, timezone
from typing import Optional

import httpx
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.repository import Repository

settings = get_settings()

GITHUB_API_BASE = "https://api.github.com"


class GitHubService:
    """Service for interacting with the GitHub API."""

    def __init__(self) -> None:
        self.token = settings.GITHUB_TOKEN
        self.username = settings.GITHUB_USERNAME

    @property
    def headers(self) -> dict[str, str]:
        """Build GitHub API request headers."""
        h = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "PortfolioApp/1.0",
        }
        if self.token:
            h["Authorization"] = f"Bearer {self.token}"
        return h

    @property
    def is_connected(self) -> bool:
        """Check if GitHub credentials are configured."""
        return bool(self.token and self.username)

    # ──────────────────────────────────────
    # Fetch from GitHub API
    # ──────────────────────────────────────
    async def fetch_repositories(self) -> list[dict]:
        """
        Fetch all public repositories for the configured GitHub user.
        Handles pagination to get all repos.
        """
        if not self.is_connected:
            raise ValueError("GitHub is not connected. Set GITHUB_TOKEN and GITHUB_USERNAME.")

        repos: list[dict] = []
        page = 1
        per_page = 100

        async with httpx.AsyncClient(timeout=30.0) as client:
            while True:
                response = await client.get(
                    f"{GITHUB_API_BASE}/users/{self.username}/repos",
                    headers=self.headers,
                    params={
                        "per_page": per_page,
                        "page": page,
                        "sort": "pushed",
                        "direction": "desc",
                        "type": "owner",
                    },
                )
                response.raise_for_status()
                data = response.json()

                if not data:
                    break

                repos.extend(data)
                page += 1

                if len(data) < per_page:
                    break

        return repos

    async def fetch_readme(self, full_name: str) -> Optional[str]:
        """
        Fetch the README.md content for a repository.
        Returns the decoded content or None if not found.
        """
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                response = await client.get(
                    f"{GITHUB_API_BASE}/repos/{full_name}/readme",
                    headers=self.headers,
                )
                if response.status_code == 404:
                    return None

                response.raise_for_status()
                data = response.json()

                content = data.get("content", "")
                encoding = data.get("encoding", "base64")

                if encoding == "base64" and content:
                    return base64.b64decode(content).decode("utf-8")

                return content or None

            except (httpx.HTTPError, Exception):
                return None

    async def fetch_languages(self, full_name: str) -> dict[str, int]:
        """Fetch language breakdown for a repository."""
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                response = await client.get(
                    f"{GITHUB_API_BASE}/repos/{full_name}/languages",
                    headers=self.headers,
                )
                response.raise_for_status()
                return response.json()
            except (httpx.HTTPError, Exception):
                return {}

    # ──────────────────────────────────────
    # Sync to Database
    # ──────────────────────────────────────
    async def sync_repositories(self, db: AsyncSession) -> dict:
        """
        Synchronize all GitHub repos to the database.
        Creates new records and updates existing ones.
        Returns sync statistics.
        """
        github_repos = await self.fetch_repositories()

        created = 0
        updated = 0

        for repo_data in github_repos:
            # Skip forks by default (can be configured later)
            if repo_data.get("fork", False):
                continue

            github_id = repo_data["id"]

            # Check if repo already exists
            result = await db.execute(
                select(Repository).where(Repository.github_id == github_id)
            )
            existing = result.scalar_one_or_none()

            pushed_at = None
            if repo_data.get("pushed_at"):
                pushed_at = datetime.fromisoformat(
                    repo_data["pushed_at"].replace("Z", "+00:00")
                )

            now = datetime.now(timezone.utc)

            if existing:
                # Update existing record
                existing.name = repo_data["name"]
                existing.full_name = repo_data["full_name"]
                existing.description = repo_data.get("description")
                existing.html_url = repo_data["html_url"]
                existing.homepage = repo_data.get("homepage")
                existing.language = repo_data.get("language")
                existing.stargazers_count = repo_data.get("stargazers_count", 0)
                existing.forks_count = repo_data.get("forks_count", 0)
                existing.topics = repo_data.get("topics", [])
                existing.is_fork = repo_data.get("fork", False)
                existing.is_archived = repo_data.get("archived", False)
                existing.default_branch = repo_data.get("default_branch", "main")
                existing.pushed_at = pushed_at
                existing.last_synced_at = now
                existing.updated_at = now
                updated += 1
            else:
                # Create new record
                new_repo = Repository(
                    github_id=github_id,
                    name=repo_data["name"],
                    full_name=repo_data["full_name"],
                    description=repo_data.get("description"),
                    html_url=repo_data["html_url"],
                    homepage=repo_data.get("homepage"),
                    language=repo_data.get("language"),
                    stargazers_count=repo_data.get("stargazers_count", 0),
                    forks_count=repo_data.get("forks_count", 0),
                    topics=repo_data.get("topics", []),
                    is_fork=repo_data.get("fork", False),
                    is_archived=repo_data.get("archived", False),
                    default_branch=repo_data.get("default_branch", "main"),
                    pushed_at=pushed_at,
                    last_synced_at=now,
                )
                db.add(new_repo)
                created += 1

        await db.commit()

        total = created + updated
        return {
            "synced": total,
            "created": created,
            "updated": updated,
            "message": f"Successfully synced {total} repositories ({created} new, {updated} updated)",
        }

    async def sync_readme_for_repo(
        self, db: AsyncSession, repo_id: str
    ) -> Optional[str]:
        """Fetch and cache README for a specific repository."""
        result = await db.execute(
            select(Repository).where(Repository.id == repo_id)
        )
        repo = result.scalar_one_or_none()

        if repo is None:
            return None

        readme = await self.fetch_readme(repo.full_name)
        repo.readme_content = readme
        await db.commit()
        return readme

    # ──────────────────────────────────────
    # Status
    # ──────────────────────────────────────
    async def get_status(self, db: AsyncSession) -> dict:
        """Get GitHub connection and sync status."""
        total = await db.scalar(select(func.count(Repository.id)))
        selected = await db.scalar(
            select(func.count(Repository.id)).where(Repository.is_selected == True)
        )
        last_synced = await db.scalar(
            select(func.max(Repository.last_synced_at))
        )

        return {
            "connected": self.is_connected,
            "username": self.username if self.is_connected else None,
            "total_repos": total or 0,
            "selected_repos": selected or 0,
            "last_synced_at": last_synced,
        }


# Singleton instance
github_service = GitHubService()
