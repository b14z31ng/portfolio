"""Initial schema

Revision ID: fd65a30f8473
Revises: 
Create Date: 2026-07-06 01:51:07.798875

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fd65a30f8473'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()

    # Helper function to check index existence
    def index_exists(table_name, index_name) -> bool:
        if table_name not in tables:
            return False
        indexes = inspector.get_indexes(table_name)
        return any(ix['name'] == index_name for ix in indexes)

    # 1. users
    if 'users' not in tables:
        op.create_table(
            'users',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('email', sa.String(length=255), nullable=False),
            sa.Column('hashed_password', sa.String(length=255), nullable=False),
            sa.Column('name', sa.String(length=255), nullable=False),
            sa.Column('is_active', sa.Boolean(), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )
    if not index_exists('users', 'ix_users_email'):
        op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. profiles
    if 'profiles' not in tables:
        op.create_table(
            'profiles',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('full_name', sa.String(length=255), nullable=False),
            sa.Column('headline', sa.String(length=500), nullable=False),
            sa.Column('hero_title', sa.Text(), nullable=False),
            sa.Column('hero_subtitle', sa.Text(), nullable=False),
            sa.Column('hero_description', sa.Text(), nullable=False),
            sa.Column('about_description', sa.Text(), nullable=False),
            sa.Column('email', sa.String(length=255), nullable=True),
            sa.Column('phone', sa.String(length=50), nullable=True),
            sa.Column('location', sa.String(length=255), nullable=True),
            sa.Column('github_url', sa.String(length=512), nullable=True),
            sa.Column('linkedin_url', sa.String(length=512), nullable=True),
            sa.Column('website_url', sa.String(length=512), nullable=True),
            sa.Column('availability_status', sa.String(length=50), nullable=False),
            sa.Column('profile_image_url', sa.String(length=512), nullable=True),
            sa.Column('resume_url', sa.String(length=512), nullable=True),
            sa.Column('resume_filename', sa.String(length=255), nullable=True),
            sa.Column('resume_uploaded_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('seo_title', sa.String(length=255), nullable=True),
            sa.Column('seo_description', sa.Text(), nullable=True),
            sa.Column('og_image_url', sa.String(length=512), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )

    # 3. repositories
    if 'repositories' not in tables:
        op.create_table(
            'repositories',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('github_id', sa.Integer(), nullable=False),
            sa.Column('name', sa.String(length=255), nullable=False),
            sa.Column('full_name', sa.String(length=512), nullable=False),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('html_url', sa.String(length=512), nullable=False),
            sa.Column('homepage', sa.String(length=512), nullable=True),
            sa.Column('language', sa.String(length=100), nullable=True),
            sa.Column('stargazers_count', sa.Integer(), nullable=False),
            sa.Column('forks_count', sa.Integer(), nullable=False),
            sa.Column('topics', sa.ARRAY(sa.String()), nullable=True),
            sa.Column('is_fork', sa.Boolean(), nullable=False),
            sa.Column('is_archived', sa.Boolean(), nullable=False),
            sa.Column('is_selected', sa.Boolean(), nullable=False),
            sa.Column('readme_content', sa.Text(), nullable=True),
            sa.Column('default_branch', sa.String(length=100), nullable=False),
            sa.Column('pushed_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('last_synced_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )
    if not index_exists('repositories', 'ix_repositories_github_id'):
        op.create_index(op.f('ix_repositories_github_id'), 'repositories', ['github_id'], unique=True)

    # 4. projects
    if 'projects' not in tables:
        op.create_table(
            'projects',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('slug', sa.String(length=255), nullable=False),
            sa.Column('title', sa.String(length=255), nullable=False),
            sa.Column('summary', sa.Text(), nullable=False),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('banner_url', sa.String(length=512), nullable=True),
            sa.Column('github_url', sa.String(length=512), nullable=True),
            sa.Column('live_url', sa.String(length=512), nullable=True),
            sa.Column('readme', sa.Text(), nullable=True),
            sa.Column('architecture', sa.Text(), nullable=True),
            sa.Column('features', sa.ARRAY(sa.String()), nullable=True),
            sa.Column('challenges', sa.Text(), nullable=True),
            sa.Column('solutions', sa.Text(), nullable=True),
            sa.Column('lessons_learned', sa.Text(), nullable=True),
            sa.Column('screenshots', sa.ARRAY(sa.String()), nullable=True),
            sa.Column('stars', sa.Integer(), nullable=False),
            sa.Column('forks', sa.Integer(), nullable=False),
            sa.Column('language', sa.String(length=100), nullable=True),
            sa.Column('repository_id', sa.String(length=36), nullable=True),
            sa.Column('is_featured', sa.Boolean(), nullable=False),
            sa.Column('is_published', sa.Boolean(), nullable=False),
            sa.Column('sort_order', sa.Integer(), nullable=False),
            sa.Column('last_synced_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.ForeignKeyConstraint(['repository_id'], ['repositories.id'], ondelete='SET NULL'),
            sa.PrimaryKeyConstraint('id')
        )
    if not index_exists('projects', 'ix_projects_slug'):
        op.create_index(op.f('ix_projects_slug'), 'projects', ['slug'], unique=True)

    # 5. technologies
    if 'technologies' not in tables:
        op.create_table(
            'technologies',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('name', sa.String(length=100), nullable=False),
            sa.Column('slug', sa.String(length=100), nullable=False),
            sa.Column('category', sa.String(length=50), nullable=False),
            sa.Column('color', sa.String(length=20), nullable=True),
            sa.Column('icon_url', sa.String(length=512), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
    if not index_exists('technologies', 'ix_technologies_name'):
        op.create_index(op.f('ix_technologies_name'), 'technologies', ['name'], unique=True)
    if not index_exists('technologies', 'ix_technologies_slug'):
        op.create_index(op.f('ix_technologies_slug'), 'technologies', ['slug'], unique=True)

    # 6. project_technologies
    if 'project_technologies' not in tables:
        op.create_table(
            'project_technologies',
            sa.Column('project_id', sa.String(length=36), nullable=False),
            sa.Column('technology_id', sa.String(length=36), nullable=False),
            sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
            sa.ForeignKeyConstraint(['technology_id'], ['technologies.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('project_id', 'technology_id')
        )

    # 7. blog_posts
    if 'blog_posts' not in tables:
        op.create_table(
            'blog_posts',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('slug', sa.String(length=255), nullable=False),
            sa.Column('title', sa.String(length=255), nullable=False),
            sa.Column('content', sa.Text(), nullable=False),
            sa.Column('summary', sa.Text(), nullable=False),
            sa.Column('cover_image_url', sa.String(length=512), nullable=True),
            sa.Column('tags', sa.ARRAY(sa.String()), nullable=True),
            sa.Column('is_published', sa.Boolean(), nullable=False),
            sa.Column('published_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )
    if not index_exists('blog_posts', 'ix_blog_posts_slug'):
        op.create_index(op.f('ix_blog_posts_slug'), 'blog_posts', ['slug'], unique=True)

    # 8. educations
    if 'educations' not in tables:
        op.create_table(
            'educations',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('institution', sa.String(length=255), nullable=False),
            sa.Column('degree', sa.String(length=255), nullable=False),
            sa.Column('field_of_study', sa.String(length=255), nullable=False),
            sa.Column('start_date', sa.DateTime(timezone=True), nullable=False),
            sa.Column('end_date', sa.DateTime(timezone=True), nullable=True),
            sa.Column('is_current', sa.Boolean(), nullable=False),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('sort_order', sa.Integer(), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )

    # 9. experiences
    if 'experiences' not in tables:
        op.create_table(
            'experiences',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('company', sa.String(length=255), nullable=False),
            sa.Column('position', sa.String(length=255), nullable=False),
            sa.Column('location', sa.String(length=255), nullable=True),
            sa.Column('start_date', sa.DateTime(timezone=True), nullable=False),
            sa.Column('end_date', sa.DateTime(timezone=True), nullable=True),
            sa.Column('is_current', sa.Boolean(), nullable=False),
            sa.Column('description', sa.Text(), nullable=True),
            sa.Column('skills', sa.ARRAY(sa.String()), nullable=True),
            sa.Column('sort_order', sa.Integer(), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )

    # 10. research
    if 'research' not in tables:
        op.create_table(
            'research',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('title', sa.String(length=255), nullable=False),
            sa.Column('abstract', sa.Text(), nullable=False),
            sa.Column('authors', sa.String(length=255), nullable=False),
            sa.Column('journal', sa.String(length=255), nullable=True),
            sa.Column('publication_date', sa.DateTime(timezone=True), nullable=True),
            sa.Column('doi', sa.String(length=100), nullable=True),
            sa.Column('is_published', sa.Boolean(), nullable=False),
            sa.Column('sort_order', sa.Integer(), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )

    # 11. certificates
    if 'certificates' not in tables:
        op.create_table(
            'certificates',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('name', sa.String(length=255), nullable=False),
            sa.Column('issuer', sa.String(length=255), nullable=False),
            sa.Column('issue_date', sa.DateTime(timezone=True), nullable=False),
            sa.Column('expiry_date', sa.DateTime(timezone=True), nullable=True),
            sa.Column('credential_id', sa.String(length=255), nullable=True),
            sa.Column('credential_url', sa.String(length=512), nullable=True),
            sa.Column('sort_order', sa.Integer(), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )

    # 12. publications
    if 'publications' not in tables:
        op.create_table(
            'publications',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('slug', sa.String(length=255), nullable=False),
            sa.Column('title', sa.String(length=255), nullable=False),
            sa.Column('subtitle', sa.String(length=255), nullable=True),
            sa.Column('authors', sa.String(length=255), nullable=False),
            sa.Column('conference', sa.String(length=255), nullable=True),
            sa.Column('journal', sa.String(length=255), nullable=True),
            sa.Column('publisher', sa.String(length=255), nullable=True),
            sa.Column('year', sa.Integer(), nullable=True),
            sa.Column('publication_date', sa.DateTime(timezone=True), nullable=True),
            sa.Column('status', sa.String(length=50), nullable=False),
            sa.Column('doi', sa.String(length=100), nullable=True),
            sa.Column('citation', sa.Text(), nullable=True),
            sa.Column('bibtex', sa.Text(), nullable=True),
            sa.Column('pdf_url', sa.String(length=512), nullable=True),
            sa.Column('presentation_url', sa.String(length=512), nullable=True),
            sa.Column('github_url', sa.String(length=512), nullable=True),
            sa.Column('url', sa.String(length=512), nullable=True),
            sa.Column('abstract', sa.Text(), nullable=True),
            sa.Column('keywords', sa.ARRAY(sa.String()), nullable=True),
            sa.Column('images', sa.ARRAY(sa.String()), nullable=True),
            sa.Column('categories', sa.ARRAY(sa.String()), nullable=True),
            sa.Column('tags', sa.ARRAY(sa.String()), nullable=True),
            sa.Column('is_featured', sa.Boolean(), nullable=False),
            sa.Column('is_published', sa.Boolean(), nullable=False),
            sa.Column('sort_order', sa.Integer(), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )
    if not index_exists('publications', 'ix_publications_slug'):
        op.create_index(op.f('ix_publications_slug'), 'publications', ['slug'], unique=True)

    # 13. resumes
    if 'resumes' not in tables:
        op.create_table(
            'resumes',
            sa.Column('id', sa.String(length=36), nullable=False),
            sa.Column('resume_url', sa.String(length=512), nullable=False),
            sa.Column('resume_filename', sa.String(length=255), nullable=False),
            sa.Column('is_active', sa.Boolean(), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()

    if 'resumes' in tables:
        op.drop_table('resumes')
    if 'publications' in tables:
        op.drop_table('publications')
    if 'certificates' in tables:
        op.drop_table('certificates')
    if 'research' in tables:
        op.drop_table('research')
    if 'experiences' in tables:
        op.drop_table('experiences')
    if 'educations' in tables:
        op.drop_table('educations')
    if 'blog_posts' in tables:
        op.drop_table('blog_posts')
    if 'project_technologies' in tables:
        op.drop_table('project_technologies')
    if 'technologies' in tables:
        op.drop_table('technologies')
    if 'projects' in tables:
        op.drop_table('projects')
    if 'repositories' in tables:
        op.drop_table('repositories')
    if 'profiles' in tables:
        op.drop_table('profiles')
    if 'users' in tables:
        op.drop_table('users')
