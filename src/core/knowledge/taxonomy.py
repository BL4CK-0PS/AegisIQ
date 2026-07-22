from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel, Field


class ProficiencyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class LearningObjective(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    description: str
    assessment_criteria: list[str] = Field(default_factory=list)
    bloom_taxonomy_level: str = "understand"

    model_config = {"frozen": True}


class KnowledgeArea(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    name: str
    description: str
    learning_objectives: list[LearningObjective] = Field(default_factory=list)

    model_config = {"frozen": True}


class Skill(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    name: str
    description: str
    alternative_labels: list[str] = Field(default_factory=list)
    prerequisite_skill_ids: list[str] = Field(default_factory=list)
    related_skill_ids: list[str] = Field(default_factory=list)
    knowledge_areas: list[KnowledgeArea] = Field(default_factory=list)
    proficiency_level: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE

    model_config = {"frozen": True}


class Technology(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    name: str
    category: str = "tool"
    description: str
    skill_ids: list[str] = Field(default_factory=list)
    depends_on_technology_ids: list[str] = Field(default_factory=list)

    model_config = {"frozen": True}


class MitreTactic(BaseModel):
    id: str
    name: str
    description: str


class MitreTechnique(BaseModel):
    id: str
    name: str
    description: str
    tactic: MitreTactic
    sub_techniques: list[MitreTechnique] = Field(default_factory=list)

    model_config = {"frozen": True}


class MitreMapping(BaseModel):
    technique: MitreTechnique
    skill_ids: list[str] = Field(default_factory=list)
    detection_methods: list[str] = Field(default_factory=list)
    mitigation_references: list[str] = Field(default_factory=list)

    model_config = {"frozen": True}


class Capability(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    name: str
    description: str
    skills: list[Skill] = Field(default_factory=list)
    mitre_mappings: list[MitreMapping] = Field(default_factory=list)
    technologies: list[Technology] = Field(default_factory=list)
    proficiency_level: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE

    model_config = {"frozen": True}


class CyberDomain(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    name: str
    description: str
    capabilities: list[Capability] = Field(default_factory=list)
    technologies: list[Technology] = Field(default_factory=list)
    mitre_mappings: list[MitreMapping] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    version: str = "1.0.0"

    model_config = {"frozen": True}


class SkillDnaProfile(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    version: str = "1.0.0"
    title: str
    capabilities: list[Capability] = Field(default_factory=list)
    knowledge_areas: list[KnowledgeArea] = Field(default_factory=list)
    responsibilities: list[str] = Field(default_factory=list)
    assessment_objectives: list[str] = Field(default_factory=list)
    difficulty: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE
    estimated_duration_minutes: int = 90
    recommended_rubric: str = "intermediate"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {"frozen": True}
