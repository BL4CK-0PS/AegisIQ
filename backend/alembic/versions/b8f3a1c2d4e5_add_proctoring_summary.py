"""add proctoring_summary column to assessments

Revision ID: b8f3a1c2d4e5
Revises: 93766706048b
Create Date: 2026-07-24 12:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "b8f3a1c2d4e5"
down_revision: Union[str, Sequence[str], None] = "93766706048b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add proctoring_summary JSON column to assessments table."""
    op.add_column(
        "assessments",
        sa.Column("proctoring_summary", sa.JSON(), nullable=True),
    )


def downgrade() -> None:
    """Remove proctoring_summary column from assessments table."""
    op.drop_column("assessments", "proctoring_summary")
