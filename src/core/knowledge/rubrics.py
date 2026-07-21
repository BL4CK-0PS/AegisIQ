from __future__ import annotations

import uuid
from typing import Literal

from pydantic import BaseModel, Field


DifficultyLevel = Literal["beginner", "intermediate", "advanced", "expert"]


class RubricCriterion(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    name: str
    description: str
    weight: float = Field(ge=0.0, le=1.0)
    max_score: int = 5
    passing_threshold: float = 0.6

    model_config = {"frozen": True}


class RubricLevel(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    label: str
    min_score: int = Field(ge=0)
    max_score: int = Field(ge=0)
    description: str
    criteria_fulfilled: list[str] = Field(default_factory=list)

    model_config = {"frozen": True}


class ScoringRubric(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    name: str
    difficulty: DifficultyLevel
    description: str
    criteria: list[RubricCriterion] = Field(default_factory=list)
    levels: list[RubricLevel] = Field(default_factory=list)
    total_score_possible: int = 100
    passing_percentage: float = 0.65

    model_config = {"frozen": True}


RUBRIC_BEGINNER: ScoringRubric = ScoringRubric(
    name="Beginner Rubric",
    difficulty="beginner",
    description="Entry-level cybersecurity capability assessment rubric. "
    "Evaluates foundational knowledge, basic tool familiarity, and guided problem-solving.",
    criteria=[
        RubricCriterion(
            name="foundational_knowledge",
            description="Demonstrates understanding of core cybersecurity concepts, terminology, and basic attack vectors.",
            weight=0.25,
            max_score=5,
            passing_threshold=0.5,
        ),
        RubricCriterion(
            name="tool_familiarity",
            description="Shows awareness of common security tools and their basic use cases.",
            weight=0.15,
            max_score=5,
            passing_threshold=0.5,
        ),
        RubricCriterion(
            name="guided_analysis",
            description="Ability to follow structured investigation steps and reach correct conclusions with guidance.",
            weight=0.25,
            max_score=5,
            passing_threshold=0.5,
        ),
        RubricCriterion(
            name="communication",
            description="Clearly articulates observations and basic findings in simple language.",
            weight=0.15,
            max_score=5,
            passing_threshold=0.5,
        ),
        RubricCriterion(
            name="situational_awareness",
            description="Recognises common security scenarios and understands appropriate initial responses.",
            weight=0.20,
            max_score=5,
            passing_threshold=0.5,
        ),
    ],
    levels=[
        RubricLevel(
            label="Below Beginner",
            min_score=0,
            max_score=25,
            description="Does not meet foundational knowledge requirements. Significant gaps in core concepts.",
            criteria_fulfilled=[],
        ),
        RubricLevel(
            label="Developing",
            min_score=26,
            max_score=50,
            description="Shows partial understanding of core concepts but requires substantial guidance.",
            criteria_fulfilled=["foundational_knowledge"],
        ),
        RubricLevel(
            label="Competent Beginner",
            min_score=51,
            max_score=75,
            description="Demonstrates solid foundational knowledge and can follow guided analysis independently.",
            criteria_fulfilled=[
                "foundational_knowledge",
                "guided_analysis",
                "communication",
            ],
        ),
        RubricLevel(
            label="Strong Beginner",
            min_score=76,
            max_score=100,
            description="Exceeds entry-level expectations. Ready for intermediate challenges.",
            criteria_fulfilled=[
                "foundational_knowledge",
                "tool_familiarity",
                "guided_analysis",
                "communication",
                "situational_awareness",
            ],
        ),
    ],
    total_score_possible=100,
    passing_percentage=0.50,
)


RUBRIC_INTERMEDIATE: ScoringRubric = ScoringRubric(
    name="Intermediate Rubric",
    difficulty="intermediate",
    description="Mid-level cybersecurity practitioner assessment rubric. "
    "Evaluates independent analysis, incident response capability, and technical depth.",
    criteria=[
        RubricCriterion(
            name="technical_analysis",
            description="Demonstrates deep technical analysis of logs, network traffic, and system artifacts.",
            weight=0.25,
            max_score=5,
            passing_threshold=0.6,
        ),
        RubricCriterion(
            name="incident_response",
            description="Shows ability to triage, contain, and remediate security incidents with minimal guidance.",
            weight=0.25,
            max_score=5,
            passing_threshold=0.6,
        ),
        RubricCriterion(
            name="threat_intelligence",
            description="Applies threat intelligence to correlate indicators and understand attacker methodology.",
            weight=0.15,
            max_score=5,
            passing_threshold=0.6,
        ),
        RubricCriterion(
            name="decision_making",
            description="Makes sound prioritisation decisions under pressure with clear rationale.",
            weight=0.20,
            max_score=5,
            passing_threshold=0.6,
        ),
        RubricCriterion(
            name="communication",
            description="Produces clear, structured reports suitable for both technical and managerial audiences.",
            weight=0.15,
            max_score=5,
            passing_threshold=0.6,
        ),
    ],
    levels=[
        RubricLevel(
            label="Below Intermediate",
            min_score=0,
            max_score=30,
            description="Struggles with independent analysis. Requires significant guidance for incident response.",
            criteria_fulfilled=[],
        ),
        RubricLevel(
            label="Developing Intermediate",
            min_score=31,
            max_score=55,
            description="Can perform basic analysis independently but lacks depth in incident response.",
            criteria_fulfilled=["technical_analysis"],
        ),
        RubricLevel(
            label="Competent Practitioner",
            min_score=56,
            max_score=80,
            description="Handles standard incidents independently. Shows strong technical and decision skills.",
            criteria_fulfilled=[
                "technical_analysis",
                "incident_response",
                "decision_making",
                "communication",
            ],
        ),
        RubricLevel(
            label="Strong Intermediate",
            min_score=81,
            max_score=100,
            description="Exceeds mid-level expectations. Ready for advanced challenges and mentoring juniors.",
            criteria_fulfilled=[
                "technical_analysis",
                "incident_response",
                "threat_intelligence",
                "decision_making",
                "communication",
            ],
        ),
    ],
    total_score_possible=100,
    passing_percentage=0.55,
)


RUBRIC_ADVANCED: ScoringRubric = ScoringRubric(
    name="Advanced Rubric",
    difficulty="advanced",
    description="Senior cybersecurity professional assessment rubric. "
    "Evaluates strategic thinking, architecture, threat hunting, and mentoring capability.",
    criteria=[
        RubricCriterion(
            name="threat_hunting",
            description="Proactively identifies advanced threats using hypothesis-driven hunting methodologies.",
            weight=0.20,
            max_score=5,
            passing_threshold=0.7,
        ),
        RubricCriterion(
            name="security_architecture",
            description="Designs and evaluates security architectures with defence-in-depth principles.",
            weight=0.20,
            max_score=5,
            passing_threshold=0.7,
        ),
        RubricCriterion(
            name="strategic_reasoning",
            description="Demonstrates strategic thinking about risk, business impact, and long-term security posture.",
            weight=0.20,
            max_score=5,
            passing_threshold=0.7,
        ),
        RubricCriterion(
            name="mentoring_and_leadership",
            description="Provides clear guidance, reviews others work, and elevates team capability.",
            weight=0.15,
            max_score=5,
            passing_threshold=0.7,
        ),
        RubricCriterion(
            name="advanced_technical_depth",
            description="Shows expert-level knowledge in specialised domains with novel problem-solving.",
            weight=0.25,
            max_score=5,
            passing_threshold=0.7,
        ),
    ],
    levels=[
        RubricLevel(
            label="Below Advanced",
            min_score=0,
            max_score=35,
            description="Operates at intermediate level. Not yet ready for senior responsibilities.",
            criteria_fulfilled=[],
        ),
        RubricLevel(
            label="Developing Advanced",
            min_score=36,
            max_score=60,
            description="Shows depth in technical areas but lacks strategic and architectural breadth.",
            criteria_fulfilled=["advanced_technical_depth"],
        ),
        RubricLevel(
            label="Competent Senior",
            min_score=61,
            max_score=85,
            description="Operates effectively at senior level. Strong architecture and strategic skills.",
            criteria_fulfilled=[
                "security_architecture",
                "strategic_reasoning",
                "advanced_technical_depth",
            ],
        ),
        RubricLevel(
            label="Expert / Lead",
            min_score=86,
            max_score=100,
            description="Operates at architect or lead level. Mentors others and drives security strategy.",
            criteria_fulfilled=[
                "threat_hunting",
                "security_architecture",
                "strategic_reasoning",
                "mentoring_and_leadership",
                "advanced_technical_depth",
            ],
        ),
    ],
    total_score_possible=100,
    passing_percentage=0.60,
)


RUBRIC_REGISTRY: dict[DifficultyLevel, ScoringRubric] = {
    "beginner": RUBRIC_BEGINNER,
    "intermediate": RUBRIC_INTERMEDIATE,
    "advanced": RUBRIC_ADVANCED,
}


def get_rubric_for_difficulty(difficulty: DifficultyLevel) -> ScoringRubric:
    rubric = RUBRIC_REGISTRY.get(difficulty)
    if rubric is None:
        raise ValueError(f"Unknown difficulty level: {difficulty}")
    return rubric
