"""add performance indexes and user FKs to orphan models

Revision ID: c4e7f2a1b9d0
Revises: b8f3a1c2d4e5
Create Date: 2026-07-24 14:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "c4e7f2a1b9d0"
down_revision: Union[str, Sequence[str], None] = "b8f3a1c2d4e5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index("ix_assessments_candidate_id", "assessments", ["candidate_id"])
    op.create_index(
        "ix_question_records_assessment_id", "question_records", ["assessment_id"]
    )
    op.create_index(
        "ix_evaluation_results_question_id", "evaluation_results", ["question_id"]
    )

    op.add_column("cyber_twins", sa.Column("user_id", sa.String(12), nullable=True))
    op.create_index("ix_cyber_twins_user_id", "cyber_twins", ["user_id"])
    op.create_foreign_key(
        "fk_cyber_twins_user_id", "cyber_twins", "users", ["user_id"], ["id"]
    )

    op.add_column(
        "learning_roadmaps", sa.Column("user_id", sa.String(12), nullable=True)
    )
    op.create_index("ix_learning_roadmaps_user_id", "learning_roadmaps", ["user_id"])
    op.create_foreign_key(
        "fk_learning_roadmaps_user_id",
        "learning_roadmaps",
        "users",
        ["user_id"],
        ["id"],
    )

    op.add_column(
        "answer_repair_guides", sa.Column("user_id", sa.String(12), nullable=True)
    )
    op.create_index(
        "ix_answer_repair_guides_user_id", "answer_repair_guides", ["user_id"]
    )
    op.create_foreign_key(
        "fk_answer_repair_guides_user_id",
        "answer_repair_guides",
        "users",
        ["user_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_index("ix_assessments_candidate_id", table_name="assessments")
    op.drop_index("ix_question_records_assessment_id", table_name="question_records")
    op.drop_index("ix_evaluation_results_question_id", table_name="evaluation_results")

    op.drop_foreign_key(
        "fk_answer_repair_guides_user_id", table_name="answer_repair_guides"
    )
    op.drop_index("ix_answer_repair_guides_user_id", table_name="answer_repair_guides")
    op.drop_column("answer_repair_guides", "user_id")

    op.drop_foreign_key("fk_learning_roadmaps_user_id", table_name="learning_roadmaps")
    op.drop_index("ix_learning_roadmaps_user_id", table_name="learning_roadmaps")
    op.drop_column("learning_roadmaps", "user_id")

    op.drop_foreign_key("fk_cyber_twins_user_id", table_name="cyber_twins")
    op.drop_index("ix_cyber_twins_user_id", table_name="cyber_twins")
    op.drop_column("cyber_twins", "user_id")
