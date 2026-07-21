"""initial_models

Revision ID: 93766706048b
Revises: 
Create Date: 2026-07-21 20:06:27.140554

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '93766706048b'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # ---------------------------------------------------------------
    # Step 1: Drop all old init.sql FK constraints pointing to users.id
    # so we can safely alter the column type from UUID to VARCHAR(12)
    # ---------------------------------------------------------------
    op.drop_constraint('assessments_user_id_fkey', 'assessments', type_='foreignkey')
    op.drop_constraint('assessments_skill_dna_id_fkey', 'assessments', type_='foreignkey')
    op.drop_constraint('cyber_twins_user_id_fkey', 'cyber_twins', type_='foreignkey')
    op.drop_constraint('audit_logs_user_id_fkey', 'audit_logs', type_='foreignkey')
    op.drop_constraint('job_descriptions_user_id_fkey', 'job_descriptions', type_='foreignkey')
    op.drop_constraint('capability_heatmaps_user_id_fkey', 'capability_heatmaps', type_='foreignkey')
    op.drop_constraint('cyber_twins_user_id_key', 'cyber_twins', type_='unique')
    op.drop_index(op.f('idx_assessments_status'), table_name='assessments')
    op.drop_index(op.f('idx_assessments_user_id'), table_name='assessments')
    op.drop_index(op.f('idx_cyber_twins_user_id'), table_name='cyber_twins')
    op.drop_index(op.f('idx_users_email'), table_name='users')
    op.drop_index(op.f('idx_users_role'), table_name='users')
    op.drop_index(op.f('idx_audit_logs_user_id'), table_name='audit_logs')
    op.drop_index(op.f('idx_audit_logs_action'), table_name='audit_logs')
    op.drop_index(op.f('idx_audit_logs_created_at'), table_name='audit_logs')
    op.drop_index(op.f('idx_jd_user_id'), table_name='job_descriptions')
    op.drop_index(op.f('idx_heatmaps_user_id'), table_name='capability_heatmaps')
    op.drop_index(op.f('idx_learning_paths_evaluation_id'), table_name='learning_paths')
    op.drop_index(op.f('idx_evidence_evaluation_id'), table_name='evidence')
    op.drop_index(op.f('idx_career_compass_twin_id'), table_name='career_compasses')
    op.drop_index(op.f('idx_responses_challenge_id'), table_name='responses')
    op.drop_index(op.f('idx_evaluations_response_id'), table_name='evaluations')
    op.drop_index(op.f('idx_challenges_assessment_id'), table_name='practical_challenges')
    op.drop_index(op.f('idx_skill_dna_jd_id'), table_name='skill_dna')
    op.drop_index(op.f('idx_reports_assessment_id'), table_name='reports')
    op.drop_constraint('reports_assessment_id_fkey', 'reports', type_='foreignkey')
    op.drop_constraint('skill_dna_jd_id_fkey', 'skill_dna', type_='foreignkey')
    op.drop_constraint('practical_challenges_assessment_id_fkey', 'practical_challenges', type_='foreignkey')
    op.drop_constraint('evaluations_response_id_fkey', 'evaluations', type_='foreignkey')
    op.drop_constraint('evidence_evaluation_id_fkey', 'evidence', type_='foreignkey')
    op.drop_constraint('learning_paths_evaluation_id_fkey', 'learning_paths', type_='foreignkey')
    op.drop_constraint('career_compasses_cyber_twin_id_fkey', 'career_compasses', type_='foreignkey')
    op.drop_constraint('responses_challenge_id_fkey', 'responses', type_='foreignkey')

    # ---------------------------------------------------------------
    # Step 2: Drop all old init.sql tables (now safe from FK errors)
    # ---------------------------------------------------------------
    op.drop_table('evidence')
    op.drop_table('learning_paths')
    op.drop_table('career_compasses')
    op.drop_table('responses')
    op.drop_table('evaluations')
    op.drop_table('practical_challenges')
    op.drop_table('skill_dna')
    op.drop_table('reports')
    op.drop_table('job_descriptions')
    op.drop_table('capability_heatmaps')
    op.drop_table('audit_logs')

    # ---------------------------------------------------------------
    # Step 3: Also drop old foreign keys from assessments & cyber_twins
    # to users (these will be re-created)
    # ---------------------------------------------------------------
    op.drop_column('assessments', 'duration_minutes')
    op.drop_column('assessments', 'blueprint')
    op.drop_column('assessments', 'user_id')
    op.drop_column('assessments', 'skill_dna_id')
    op.drop_column('assessments', 'created_at')

    op.drop_column('cyber_twins', 'user_id')

    # ---------------------------------------------------------------
    # Step 4: Alter users — change id UUID -> VARCHAR(12)
    # ---------------------------------------------------------------
    op.drop_column('users', 'is_active')
    op.drop_column('users', 'full_name')
    op.add_column('users', sa.Column('display_name', sa.String(length=255), nullable=False))
    op.alter_column('users', 'id',
               existing_type=sa.UUID(),
               type_=sa.String(length=12),
               existing_nullable=False)
    op.alter_column('users', 'hashed_password',
               existing_type=sa.TEXT(),
               type_=sa.String(length=255),
               existing_nullable=False)
    op.alter_column('users', 'role',
               existing_type=postgresql.ENUM('admin', 'capability_analyst', 'professional', 'reviewer', name='user_role'),
               type_=sa.String(length=50),
               nullable=True)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # ---------------------------------------------------------------
    # Step 5: Alter assessments — UUID -> VARCHAR
    # ---------------------------------------------------------------
    op.alter_column('assessments', 'id',
               existing_type=sa.UUID(),
               type_=sa.String(length=12),
               existing_nullable=False)
    op.alter_column('assessments', 'status',
               existing_type=postgresql.ENUM('planned', 'active', 'completed', 'failed', name='assessment_status'),
               type_=sa.String(length=50),
               nullable=True)
    op.add_column('assessments', sa.Column('candidate_id', sa.String(length=12), nullable=False))
    op.add_column('assessments', sa.Column('domain', sa.String(length=255), nullable=False))
    op.add_column('assessments', sa.Column('current_difficulty', sa.String(length=20), nullable=True))
    op.add_column('assessments', sa.Column('summary', sa.JSON(), nullable=True))
    op.create_foreign_key(None, 'assessments', 'users', ['candidate_id'], ['id'])

    # ---------------------------------------------------------------
    # Step 6: Alter cyber_twins — UUID -> VARCHAR
    # ---------------------------------------------------------------
    op.alter_column('cyber_twins', 'id',
               existing_type=sa.UUID(),
               type_=sa.String(length=12),
               existing_nullable=False)
    op.alter_column('cyber_twins', 'verified_skills',
               existing_type=postgresql.JSONB(astext_type=sa.Text()),
               type_=sa.JSON(),
               nullable=True)
    op.alter_column('cyber_twins', 'capability_profile',
               existing_type=postgresql.JSONB(astext_type=sa.Text()),
               type_=sa.JSON(),
               nullable=True)
    op.alter_column('cyber_twins', 'experience_graph',
               existing_type=postgresql.JSONB(astext_type=sa.Text()),
               type_=sa.JSON(),
               nullable=True)
    op.add_column('cyber_twins', sa.Column('candidate_label', sa.String(length=255), nullable=True))
    op.add_column('cyber_twins', sa.Column('overall_score', sa.Float(), nullable=True))
    op.add_column('cyber_twins', sa.Column('overall_confidence', sa.Float(), nullable=True))
    op.add_column('cyber_twins', sa.Column('weakness_areas', sa.JSON(), nullable=True))

    # ---------------------------------------------------------------
    # Step 7: Create new app-model tables
    # ---------------------------------------------------------------
    op.create_table('answer_repair_guides',
    sa.Column('id', sa.String(length=12), nullable=False),
    sa.Column('question_text', sa.Text(), nullable=True),
    sa.Column('domain', sa.String(length=255), nullable=True),
    sa.Column('skill', sa.String(length=255), nullable=True),
    sa.Column('mitre_technique', sa.String(length=255), nullable=True),
    sa.Column('original_score', sa.Float(), nullable=True),
    sa.Column('what_was_missing', sa.JSON(), nullable=True),
    sa.Column('model_answer', sa.Text(), nullable=True),
    sa.Column('model_answer_breakdown', sa.JSON(), nullable=True),
    sa.Column('key_principles', sa.JSON(), nullable=True),
    sa.Column('practice_exercise', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('learning_roadmaps',
    sa.Column('id', sa.String(length=12), nullable=False),
    sa.Column('candidate_label', sa.String(length=255), nullable=True),
    sa.Column('overall_score', sa.Float(), nullable=True),
    sa.Column('proficiency_level', sa.String(length=20), nullable=True),
    sa.Column('timeline_weeks', sa.Integer(), nullable=True),
    sa.Column('steps', sa.JSON(), nullable=True),
    sa.Column('milestones', sa.JSON(), nullable=True),
    sa.Column('labs', sa.JSON(), nullable=True),
    sa.Column('focus_areas', sa.JSON(), nullable=True),
    sa.Column('generated_at', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('question_records',
    sa.Column('id', sa.String(length=12), nullable=False),
    sa.Column('assessment_id', sa.String(length=12), nullable=False),
    sa.Column('question_text', sa.Text(), nullable=False),
    sa.Column('domain', sa.String(length=255), nullable=False),
    sa.Column('skill', sa.String(length=255), nullable=False),
    sa.Column('difficulty', sa.String(length=20), nullable=False),
    sa.Column('score', sa.Float(), nullable=True),
    sa.Column('confidence', sa.Float(), nullable=True),
    sa.Column('passed', sa.Boolean(), nullable=True),
    sa.Column('is_follow_up', sa.Boolean(), nullable=True),
    sa.Column('candidate_answer', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['assessment_id'], ['assessments.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('evaluation_results',
    sa.Column('id', sa.String(length=12), nullable=False),
    sa.Column('question_id', sa.String(length=12), nullable=True),
    sa.Column('overall_score', sa.Float(), nullable=True),
    sa.Column('confidence', sa.Float(), nullable=True),
    sa.Column('proficiency_level', sa.String(length=20), nullable=True),
    sa.Column('passed', sa.Boolean(), nullable=True),
    sa.Column('criteria_scores', sa.JSON(), nullable=True),
    sa.Column('missing_concepts', sa.JSON(), nullable=True),
    sa.Column('demonstrated_skills', sa.JSON(), nullable=True),
    sa.Column('mitre_technique_ids', sa.JSON(), nullable=True),
    sa.Column('overall_justification', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['question_id'], ['question_records.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('evaluation_results')
    op.drop_table('question_records')
    op.drop_table('learning_roadmaps')
    op.drop_table('answer_repair_guides')
    op.drop_column('cyber_twins', 'weakness_areas')
    op.drop_column('cyber_twins', 'overall_confidence')
    op.drop_column('cyber_twins', 'overall_score')
    op.drop_column('cyber_twins', 'candidate_label')
    op.drop_column('assessments', 'summary')
    op.drop_column('assessments', 'current_difficulty')
    op.drop_column('assessments', 'domain')
    op.drop_column('assessments', 'candidate_id')
    op.drop_column('users', 'display_name')
    op.drop_index(op.f('ix_users_email'), table_name='users')
