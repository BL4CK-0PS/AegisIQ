"""
AegisIQ SQLAlchemy ORM Models

Maps all domain entities to PostgreSQL tables.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    String,
    Float,
    Boolean,
    DateTime,
    Text,
    JSON,
    Integer,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from backend.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _uuid12() -> str:
    return uuid.uuid4().hex[:12]


class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(12), primary_key=True, default=_uuid12)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    display_name = Column(String(255), nullable=False)
    role = Column(String(50), default="professional")
    created_at = Column(DateTime(timezone=True), default=_utcnow)
    updated_at = Column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow)

    assessments = relationship(
        "AssessmentModel", back_populates="candidate", lazy="selectin"
    )


class AssessmentModel(Base):
    __tablename__ = "assessments"

    id = Column(String(12), primary_key=True, default=_uuid12)
    candidate_id = Column(String(12), ForeignKey("users.id"), nullable=False, index=True)
    domain = Column(String(255), nullable=False)
    status = Column(String(50), default="active")
    current_difficulty = Column(String(20), default="beginner")
    started_at = Column(DateTime(timezone=True), default=_utcnow)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    summary = Column(JSON, default=dict)
    proctoring_summary = Column(JSON, nullable=True)

    candidate = relationship("UserModel", back_populates="assessments", lazy="selectin")
    questions = relationship(
        "QuestionRecordModel",
        back_populates="assessment",
        lazy="selectin",
        cascade="all, delete-orphan",
    )


class QuestionRecordModel(Base):
    __tablename__ = "question_records"

    id = Column(String(12), primary_key=True, default=_uuid12)
    assessment_id = Column(String(12), ForeignKey("assessments.id"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    domain = Column(String(255), nullable=False)
    skill = Column(String(255), nullable=False)
    difficulty = Column(String(20), nullable=False)
    score = Column(Float, default=0.0)
    confidence = Column(Float, default=0.0)
    passed = Column(Boolean, default=False)
    is_follow_up = Column(Boolean, default=False)
    candidate_answer = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    assessment = relationship(
        "AssessmentModel", back_populates="questions", lazy="selectin"
    )


class EvaluationResultModel(Base):
    __tablename__ = "evaluation_results"

    id = Column(String(12), primary_key=True, default=_uuid12)
    question_id = Column(String(12), ForeignKey("question_records.id"), nullable=True, index=True)
    overall_score = Column(Float, default=0.0)
    confidence = Column(Float, default=0.0)
    proficiency_level = Column(String(20), default="beginner")
    passed = Column(Boolean, default=False)
    criteria_scores = Column(JSON, default=list)
    missing_concepts = Column(JSON, default=list)
    demonstrated_skills = Column(JSON, default=list)
    mitre_technique_ids = Column(JSON, default=list)
    overall_justification = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), default=_utcnow)


class CyberTwinModel(Base):
    __tablename__ = "cyber_twins"

    id = Column(String(12), primary_key=True, default=_uuid12)
    user_id = Column(String(12), ForeignKey("users.id"), nullable=True, index=True)
    candidate_label = Column(String(255), default="Anonymous")
    overall_score = Column(Float, default=0.0)
    overall_confidence = Column(Float, default=0.0)
    verified_skills = Column(JSON, default=list)
    capability_profile = Column(JSON, default=dict)
    experience_graph = Column(JSON, default=dict)
    weakness_areas = Column(JSON, default=list)
    last_updated = Column(DateTime(timezone=True), default=_utcnow)


class LearningRoadmapModel(Base):
    __tablename__ = "learning_roadmaps"

    id = Column(String(12), primary_key=True, default=_uuid12)
    user_id = Column(String(12), ForeignKey("users.id"), nullable=True, index=True)
    candidate_label = Column(String(255), default="Anonymous")
    overall_score = Column(Float, default=0.0)
    proficiency_level = Column(String(20), default="beginner")
    timeline_weeks = Column(Integer, default=8)
    steps = Column(JSON, default=list)
    milestones = Column(JSON, default=list)
    labs = Column(JSON, default=list)
    focus_areas = Column(JSON, default=list)
    generated_at = Column(DateTime(timezone=True), default=_utcnow)


class AnswerRepairGuideModel(Base):
    __tablename__ = "answer_repair_guides"

    id = Column(String(12), primary_key=True, default=_uuid12)
    user_id = Column(String(12), ForeignKey("users.id"), nullable=True, index=True)
    question_text = Column(Text, default="")
    domain = Column(String(255), default="")
    skill = Column(String(255), default="")
    mitre_technique = Column(String(255), default="")
    original_score = Column(Float, default=0.0)
    what_was_missing = Column(JSON, default=list)
    model_answer = Column(Text, default="")
    model_answer_breakdown = Column(JSON, default=list)
    key_principles = Column(JSON, default=list)
    practice_exercise = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), default=_utcnow)
