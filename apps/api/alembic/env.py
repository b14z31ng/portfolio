"""
Alembic environment configuration.
Configures Alembic to use the application's database models and settings.
"""
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core.config import get_settings
from app.db.session import Base
# Import models to ensure they are registered with Base.metadata for migrations
from app.models.user import User
from app.models.repository import Repository
from app.models.project import Project, Technology, ProjectTechnology
from app.models.blog import BlogPost
from app.models.experience import Experience
from app.models.education import Education
from app.models.research import Research
from app.models.certificate import Certificate
from app.models.profile import Profile, Resume
from app.models.publication import Publication

# ──────────────────────────────────────
# Alembic Config
# ──────────────────────────────────────
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Use application settings for DB URL
settings = get_settings()
config.set_main_option("sqlalchemy.url", settings.DATABASE_SYNC_URL)

# Target metadata for autogenerate
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        # Self-healing logic for desynced database state (e.g. alembic_version exists but tables are missing)
        import sqlalchemy as sa
        inspector = sa.inspect(connection)
        tables = inspector.get_table_names()
        if "alembic_version" in tables and "profiles" not in tables:
            connection.execute(sa.text("DROP TABLE IF EXISTS alembic_version CASCADE"))
            connection.commit()

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
