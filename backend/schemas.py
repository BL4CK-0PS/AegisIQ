"""
AegisIQ Pydantic Schemas (DTOs)

Request and response models for all API endpoints.
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


# --- Health ---


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


# --- JD Intelligence ---


class ParseJDRequest(BaseModel):
    jd_text: str = Field(..., min_length=20, description="Raw job description text")
    title: str = Field(default="Parsed Job Description", max_length=255)


class ParseJDResponse(BaseModel):
    status: str
    profile_id: str = ""
    title: str
    difficulty: str
    capabilities: list[dict[str, Any]]
    knowledge_areas: list[dict[str, Any]]
    responsibilities: list[str]
    assessment_objectives: list[str]
    estimated_duration_minutes: int
    recommended_rubric: str
    mitre_technique_ids: list[str] = Field(default_factory=list)


# --- Assessment ---


class GenerateAssessmentRequest(BaseModel):
    domain: str = Field(default="Web Application Security")
    skill: str = Field(default="Web Vulnerability Scanning")
    difficulty: str = Field(
        default="intermediate", pattern=r"^(beginner|intermediate|advanced|expert)$"
    )
    question_count: int = Field(default=5, ge=1, le=10)


class GenerateAssessmentResponse(BaseModel):
    status: str
    domain: str
    skill: str
    difficulty: str
    questions: list[dict[str, Any]]
    total_time_estimate_minutes: int


class IncidentScenarioRequest(BaseModel):
    technique_id: str = Field(default="T1190")
    difficulty: str = Field(default="intermediate")


class IncidentScenarioResponse(BaseModel):
    status: str
    scenario: dict[str, Any]


# --- Evaluation ---


class EvaluateResponseRequest(BaseModel):
    question_text: str
    candidate_answer: str = Field(..., min_length=1)
    domain: str = Field(default="Web Application Security")
    skill: str = Field(default="General")
    difficulty: str = Field(default="intermediate")


class EvaluateResponseResponse(BaseModel):
    status: str
    overall_score: float
    confidence: float
    proficiency_level: str
    passed: bool
    criteria_scores: list[dict[str, Any]]
    missing_concepts: list[str]
    demonstrated_skills: list[str]
    mitre_technique_ids: list[str]
    overall_justification: str


# --- Consolidated Profile ---


class BuildProfileRequest(BaseModel):
    evaluation_ids: list[str] = Field(default_factory=list)


class BuildProfileResponse(BaseModel):
    status: str
    profile_id: str
    overall_average_score: float
    overall_confidence: float
    skill_summaries: list[dict[str, Any]]
    demonstrated_skills: list[str]
    missing_concepts: list[str]
    detected_mitre_techniques: list[str]
    weaknesses: list[dict[str, Any]]
    evaluation_count: int


# --- Cyber Twin ---


class CyberTwinResponse(BaseModel):
    status: str
    twin_id: str
    candidate_label: str
    overall_score: float
    overall_confidence: float
    verified_skills: list[dict[str, Any]]
    capability_profile: dict[str, Any]
    experience_graph: dict[str, Any]
    weakness_areas: list[dict[str, Any]]
    last_updated: str


# --- Career Compass ---


class CareerCompassRequest(BaseModel):
    candidate_label: str = Field(default="Anonymous")
    target_role: str


class CareerCompassResponse(BaseModel):
    status: str
    target_role: str
    overall_match_percentage: float
    domain_results: list[dict[str, Any]]
    critical_gaps: list[dict[str, Any]]
    progression_steps: list[str]


class BestFitRolesResponse(BaseModel):
    status: str
    roles: list[dict[str, Any]]


# --- Learning Roadmap ---


class RoadmapRequest(BaseModel):
    candidate_label: str = Field(default="Anonymous")
    timeline_weeks: int = Field(default=8, ge=4, le=24)


class RoadmapResponse(BaseModel):
    status: str
    roadmap_id: str
    candidate_label: str
    overall_score: float
    proficiency_level: str
    timeline_weeks: int
    steps: list[dict[str, Any]]
    milestones: list[dict[str, Any]]
    labs: list[dict[str, Any]]
    focus_areas: list[str]
    generated_at: str


# --- Answer Repair ---


class RepairGuideRequest(BaseModel):
    question_text: str
    candidate_answer: str
    domain: str = ""
    skill: str = ""
    mitre_technique_id: str = ""


class RepairGuideResponse(BaseModel):
    status: str
    guide_id: str
    what_was_missing: list[str]
    model_answer: str
    model_answer_breakdown: list[str]
    key_principles: list[dict[str, Any]]
    practice_exercise: str


# --- Session (Adaptive) ---


class StartSessionRequest(BaseModel):
    domain: str
    initial_difficulty: str = Field(default="beginner")


class RecordAnswerRequest(BaseModel):
    session_id: str
    question_id: str
    question_text: str
    domain: str
    skill: str
    difficulty: str
    score: float = Field(ge=0.0, le=100.0)
    confidence: float = Field(ge=0.0, le=1.0)
    passed: bool
    is_follow_up: bool = False


class CompleteSessionRequest(BaseModel):
    session_id: str


class SessionResponse(BaseModel):
    status: str
    session: dict[str, Any]


# --- Assessment (DB-backed) ---


class CreateAssessmentRequest(BaseModel):
    domain: str = Field(default="Web Application Security")
    skill: str = Field(default="Web Vulnerability Scanning")
    difficulty: str = Field(default="beginner")
    question_count: int = Field(default=5, ge=1, le=10)


class RecordAssessmentAnswerRequest(BaseModel):
    assessment_id: str
    question_id: str
    question_text: str
    domain: str
    skill: str
    difficulty: str
    candidate_answer: str = Field(default="")


class CompleteAssessmentRequest(BaseModel):
    assessment_id: str


class PaginatedAssessmentsResponse(BaseModel):
    assessments: list[dict[str, Any]]
    total: int
    limit: int
    offset: int


# --- Providers ---


class ProvidersResponse(BaseModel):
    available: dict[str, bool]
    active: str
    configured: list[str]
