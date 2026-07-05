"""
Project generation service.
Transforms GitHub repositories into professional project pages.
Detects technologies, parses READMEs, and generates summaries.
"""
import re
from datetime import datetime, timezone
from typing import Optional

from slugify import slugify
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project, ProjectTechnology, Technology
from app.models.repository import Repository

# ──────────────────────────────────────
# Technology Detection Patterns
# ──────────────────────────────────────
TECH_PATTERNS: dict[str, dict[str, str]] = {
    # Languages
    "Python": {"category": "language", "color": "#3572A5"},
    "TypeScript": {"category": "language", "color": "#3178c6"},
    "JavaScript": {"category": "language", "color": "#f1e05a"},
    "Rust": {"category": "language", "color": "#dea584"},
    "Go": {"category": "language", "color": "#00ADD8"},
    "Java": {"category": "language", "color": "#b07219"},
    "C++": {"category": "language", "color": "#f34b7d"},
    "C#": {"category": "language", "color": "#178600"},
    "Ruby": {"category": "language", "color": "#701516"},
    "PHP": {"category": "language", "color": "#4F5D95"},
    "Swift": {"category": "language", "color": "#F05138"},
    "Kotlin": {"category": "language", "color": "#A97BFF"},
    "Dart": {"category": "language", "color": "#00B4AB"},
    # Frameworks
    "React": {"category": "framework", "color": "#61dafb"},
    "Next.js": {"category": "framework", "color": "#000000"},
    "Vue": {"category": "framework", "color": "#4FC08D"},
    "Angular": {"category": "framework", "color": "#DD0031"},
    "Svelte": {"category": "framework", "color": "#FF3E00"},
    "Django": {"category": "framework", "color": "#092E20"},
    "Flask": {"category": "framework", "color": "#000000"},
    "FastAPI": {"category": "framework", "color": "#009688"},
    "Express": {"category": "framework", "color": "#000000"},
    "NestJS": {"category": "framework", "color": "#E0234E"},
    "Spring": {"category": "framework", "color": "#6DB33F"},
    "Rails": {"category": "framework", "color": "#CC0000"},
    "Laravel": {"category": "framework", "color": "#FF2D20"},
    # Libraries
    "TailwindCSS": {"category": "library", "color": "#06B6D4"},
    "Tailwind": {"category": "library", "color": "#06B6D4"},
    "Bootstrap": {"category": "library", "color": "#7952B3"},
    "Redux": {"category": "library", "color": "#764ABC"},
    "GraphQL": {"category": "library", "color": "#E10098"},
    "Prisma": {"category": "library", "color": "#2D3748"},
    "SQLAlchemy": {"category": "library", "color": "#D71F00"},
    "Framer Motion": {"category": "library", "color": "#0055FF"},
    # Databases
    "PostgreSQL": {"category": "database", "color": "#4169E1"},
    "MySQL": {"category": "database", "color": "#4479A1"},
    "MongoDB": {"category": "database", "color": "#47A248"},
    "Redis": {"category": "database", "color": "#DC382D"},
    "SQLite": {"category": "database", "color": "#003B57"},
    "Supabase": {"category": "database", "color": "#3ECF8E"},
    "Firebase": {"category": "database", "color": "#FFCA28"},
    # Tools
    "Docker": {"category": "tool", "color": "#2496ED"},
    "Kubernetes": {"category": "tool", "color": "#326CE5"},
    "GitHub Actions": {"category": "tool", "color": "#2088FF"},
    "Terraform": {"category": "tool", "color": "#7B42BC"},
    "Nginx": {"category": "tool", "color": "#009639"},
    # Platforms
    "AWS": {"category": "platform", "color": "#FF9900"},
    "Vercel": {"category": "platform", "color": "#000000"},
    "Render": {"category": "platform", "color": "#46E3B7"},
    "Heroku": {"category": "platform", "color": "#430098"},
    "Cloudflare": {"category": "platform", "color": "#F38020"},
}


class ProjectEngine:
    """Engine to generate portfolio projects from GitHub repositories."""

    # ──────────────────────────────────────
    # Technology Detection
    # ──────────────────────────────────────
    def detect_technologies(
        self, readme: Optional[str], language: Optional[str], topics: Optional[list[str]]
    ) -> list[str]:
        """Detect technologies from README content, primary language, and topics."""
        detected: set[str] = set()

        # From primary language
        if language and language in TECH_PATTERNS:
            detected.add(language)

        # From topics
        if topics:
            topic_map = {t.lower(): t for t in TECH_PATTERNS}
            for topic in topics:
                normalized = topic.lower().replace("-", "").replace("_", "")
                for pattern_key, original in topic_map.items():
                    if normalized == pattern_key.lower().replace("-", "").replace("_", ""):
                        detected.add(original)

        # From README
        if readme:
            readme_lower = readme.lower()
            for tech_name in TECH_PATTERNS:
                # Use word boundary matching
                pattern = r'\b' + re.escape(tech_name.lower()) + r'\b'
                if re.search(pattern, readme_lower):
                    detected.add(tech_name)

        return sorted(detected)

    def clean_markdown(self, text: str) -> str:
        """Remove markdown links, images, formatting, and HTML tags."""
        # Remove images: ![alt](url)
        text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
        # Replace links with just link text: [text](url) -> text
        text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', text)
        # Remove HTML tags
        text = re.sub(r'<.*?>', '', text)
        # Remove bold/italic formatting
        text = re.sub(r'[*_`#]', '', text)
        # Replace multiple spaces/newlines with a single space
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    # ──────────────────────────────────────
    # Summary Generation
    # ──────────────────────────────────────
    def generate_summary(
        self, name: str, description: Optional[str], readme: Optional[str], techs: list[str]
    ) -> str:
        """Generate a project summary from available data."""
        if readme:
            # Extract first meaningful paragraph from README
            lines = readme.strip().split("\n")
            for line in lines:
                stripped = line.strip()
                # Skip headers, badges, empty lines, links, lists
                if (
                    stripped
                    and not stripped.startswith("#")
                    and not stripped.startswith("!")
                    and not stripped.startswith("[")
                    and not stripped.startswith("```")
                    and not stripped.startswith("-")
                    and not stripped.startswith("*")
                    and len(stripped) > 30
                ):
                    clean = self.clean_markdown(stripped)
                    if len(clean) > 20:
                        return clean[:300]

        if description:
            return description

        tech_str = ", ".join(techs[:5]) if techs else "modern technologies"
        return f"A software project built with {tech_str}."

    # ──────────────────────────────────────
    # Feature Extraction
    # ──────────────────────────────────────
    def extract_features(self, readme: Optional[str]) -> list[str]:
        """Extract feature list from README content."""
        if not readme:
            return []

        features: list[str] = []
        in_features = False

        for line in readme.split("\n"):
            stripped = line.strip()

            # Detect feature sections
            if re.match(r'^#{1,3}\s*(features|key features|highlights)', stripped, re.IGNORECASE):
                in_features = True
                continue

            # Stop at next heading
            if in_features and stripped.startswith("#"):
                break

            # Collect list items
            if in_features and re.match(r'^[-*+]\s+', stripped):
                feature = re.sub(r'^[-*+]\s+', '', stripped)
                # Remove markdown formatting
                feature = re.sub(r'[*_`]', '', feature)
                if feature and len(feature) > 5:
                    features.append(feature[:200])

        return features[:15]

    # ──────────────────────────────────────
    # Generate Project from Repository
    # ──────────────────────────────────────
    async def generate_from_repository(
        self, db: AsyncSession, repository: Repository
    ) -> Project:
        """
        Generate or update a Project from a Repository.
        Detects technologies, generates summary, and extracts features.
        """
        # Detect technologies
        tech_names = self.detect_technologies(
            repository.readme_content, repository.language, repository.topics
        )

        # Ensure technologies exist in DB
        tech_objects = []
        for tech_name in tech_names:
            tech_slug = slugify(tech_name)
            result = await db.execute(
                select(Technology).where(Technology.slug == tech_slug)
            )
            tech = result.scalar_one_or_none()

            if tech is None:
                tech_info = TECH_PATTERNS.get(tech_name, {})
                tech = Technology(
                    name=tech_name,
                    slug=tech_slug,
                    category=tech_info.get("category", "other"),
                    color=tech_info.get("color"),
                )
                db.add(tech)
                await db.flush()

            tech_objects.append(tech)

        # Generate content
        summary = self.generate_summary(
            repository.name, repository.description,
            repository.readme_content, tech_names,
        )
        features = self.extract_features(repository.readme_content)

        # Check if project already exists for this repo
        result = await db.execute(
            select(Project).where(Project.repository_id == repository.id)
        )
        project = result.scalar_one_or_none()

        project_slug = slugify(repository.name)
        now = datetime.now(timezone.utc)

        if project:
            # Update existing
            project.title = repository.name.replace("-", " ").replace("_", " ").title()
            project.summary = summary
            project.description = repository.readme_content
            project.github_url = repository.html_url
            project.live_url = repository.homepage
            project.readme = repository.readme_content
            project.stars = repository.stargazers_count
            project.forks = repository.forks_count
            project.language = repository.language
            project.features = features if features else project.features
            project.is_published = True
            project.last_synced_at = now
            project.updated_at = now
        else:
            # Create new
            project = Project(
                slug=project_slug,
                title=repository.name.replace("-", " ").replace("_", " ").title(),
                summary=summary,
                description=repository.readme_content,
                github_url=repository.html_url,
                live_url=repository.homepage,
                readme=repository.readme_content,
                stars=repository.stargazers_count,
                forks=repository.forks_count,
                language=repository.language,
                features=features,
                repository_id=repository.id,
                is_published=True,
                is_featured=False,
                last_synced_at=now,
            )
            db.add(project)
            await db.flush()

        # Update technology associations
        await db.execute(
            ProjectTechnology.__table__.delete().where(
                ProjectTechnology.project_id == project.id
            )
        )
        for tech in tech_objects:
            db.add(ProjectTechnology(project_id=project.id, technology_id=tech.id))

        await db.commit()
        await db.refresh(project)
        return project

    async def generate_all_selected(self, db: AsyncSession) -> dict:
        """Generate projects for all selected repositories."""
        result = await db.execute(
            select(Repository).where(Repository.is_selected == True)
        )
        repos = result.scalars().all()

        generated = 0
        for repo in repos:
            await self.generate_from_repository(db, repo)
            generated += 1

        return {
            "generated": generated,
            "message": f"Generated {generated} project pages from selected repositories",
        }


# Singleton
project_engine = ProjectEngine()
