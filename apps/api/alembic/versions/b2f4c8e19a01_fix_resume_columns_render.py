"""fix_resume_columns_render

Revision ID: b2f4c8e19a01
Revises: 068ea3d2c082
Create Date: 2026-07-07 13:59:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2f4c8e19a01'
down_revision: Union[str, None] = '068ea3d2c082'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('resumes')]

    # Idempotently add every column the Resume model expects.
    # Uses server_default for NOT NULL columns so it works even with existing rows.
    cols_to_add = [
        ('title', sa.Column('title', sa.String(length=255), nullable=False, server_default='My Resume')),
        ('description', sa.Column('description', sa.Text(), nullable=True)),
        ('version', sa.Column('version', sa.String(length=50), nullable=True)),
        ('file_url', sa.Column('file_url', sa.String(length=512), nullable=False, server_default='')),
        ('file_name', sa.Column('file_name', sa.String(length=255), nullable=False, server_default='')),
        ('thumbnail_url', sa.Column('thumbnail_url', sa.String(length=512), nullable=True)),
        ('file_size', sa.Column('file_size', sa.Integer(), nullable=False, server_default='0')),
        ('mime_type', sa.Column('mime_type', sa.String(length=100), nullable=False, server_default='application/pdf')),
        ('is_featured', sa.Column('is_featured', sa.Boolean(), nullable=False, server_default=sa.text('false'))),
        ('display_order', sa.Column('display_order', sa.Integer(), nullable=False, server_default='0')),
        ('created_by', sa.Column('created_by', sa.String(length=255), nullable=True)),
        ('updated_by', sa.Column('updated_by', sa.String(length=255), nullable=True)),
    ]

    for name, col_obj in cols_to_add:
        if name not in columns:
            op.add_column('resumes', col_obj)

    # Drop legacy columns if they still exist
    if 'resume_filename' in columns:
        op.drop_column('resumes', 'resume_filename')
    if 'resume_url' in columns:
        op.drop_column('resumes', 'resume_url')


def downgrade() -> None:
    # This is a repair migration; downgrade is a no-op.
    pass
