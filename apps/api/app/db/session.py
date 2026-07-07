"""
Database engine, session factory, and base model for SQLAlchemy.
"""
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings

settings = get_settings()

# ──────────────────────────────────────
# Async engine
# ──────────────────────────────────────
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)

# ──────────────────────────────────────
# Session factory
# ──────────────────────────────────────
async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# ──────────────────────────────────────
# Base model
# ──────────────────────────────────────
class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


# ──────────────────────────────────────
# Dependency
# ──────────────────────────────────────
async def get_db() -> AsyncSession:
    """Yield a database session for dependency injection."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ──────────────────────────────────────
# Self-healing Schema Sync
# ──────────────────────────────────────
from sqlalchemy import inspect, text

async def verify_and_sync_schema() -> None:
    """Inspect the database schema and automatically add any missing columns from models."""
    def sync_verify(connection):
        inspector = inspect(connection)
        
        # Import models inside function to avoid circular imports
        from app.models.user import User
        from app.models.profile import Profile, Resume
        from app.models.project import Project
        from app.models.experience import Experience
        from app.models.education import Education
        from app.models.certificate import Certificate
        from app.models.publication import Publication
        from app.models.research import Research
        from app.models.blog import BlogPost
        
        models = [
            User, Profile, Resume, Project, Experience,
            Education, Certificate, Publication, Research,
            BlogPost
        ]
        
        for model in models:
            table_name = model.__table__.name
            if not inspector.has_table(table_name):
                continue
                
            existing_cols = {col['name']: col for col in inspector.get_columns(table_name)}
            
            for col in model.__table__.columns:
                col_name = col.name
                if col_name not in existing_cols:
                    # Column is missing! Add it.
                    type_str = str(col.type)
                    # Convert column type to PostgreSQL dialect type string
                    if "VARCHAR" in type_str:
                        sql_type = f"VARCHAR({col.type.length})"
                    elif "TEXT" in type_str:
                        sql_type = "TEXT"
                    elif "INTEGER" in type_str:
                        sql_type = "INTEGER"
                    elif "BOOLEAN" in type_str:
                        sql_type = "BOOLEAN"
                    elif "TIMESTAMP" in type_str:
                        sql_type = "TIMESTAMP WITH TIME ZONE"
                    elif "BYTEA" in type_str or "BLOB" in type_str or "BINARY" in type_str:
                        sql_type = "BYTEA"
                    else:
                        sql_type = type_str
                        
                    # Build defaults and nullability
                    nullable_str = "NULL" if col.nullable else "NOT NULL"
                    default_str = ""
                    if col.server_default:
                        default_str = f" DEFAULT {col.server_default.arg.text}"
                    elif col.default and not callable(col.default.arg):
                        if isinstance(col.default.arg, str):
                            default_str = f" DEFAULT '{col.default.arg}'"
                        elif isinstance(col.default.arg, bool):
                            default_str = f" DEFAULT {str(col.default.arg).upper()}"
                        elif isinstance(col.default.arg, int):
                            default_str = f" DEFAULT {col.default.arg}"
                    
                    # If column is NOT NULL but has no default, allow it to be nullable for existing rows,
                    # or apply a default if it's a known type.
                    if not col.nullable and not default_str:
                        if "VARCHAR" in type_str or "TEXT" in type_str:
                            default_str = " DEFAULT ''"
                        elif "INTEGER" in type_str:
                            default_str = " DEFAULT 0"
                        elif "BOOLEAN" in type_str:
                            default_str = " DEFAULT FALSE"
                            
                    alter_query = f'ALTER TABLE "{table_name}" ADD COLUMN "{col_name}" {sql_type} {default_str} {nullable_str}'
                    print(f"[SCHEMA SYNC] Adding missing column to {table_name}: {alter_query}")
                    connection.execute(text(alter_query))
                    
    async with engine.begin() as conn:
        await conn.run_sync(sync_verify)
