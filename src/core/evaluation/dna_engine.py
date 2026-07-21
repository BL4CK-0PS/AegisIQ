from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from pydantic import BaseModel, Field

from src.core.evaluation.evaluator import EvaluationResult
from src.core.knowledge.seed_data import SEED_MITRE_TECHNIQUES, SEED_SKILLS
from src.core.knowledge.taxonomy import (
    Capability,
    KnowledgeArea,
    MitreMapping,
    MitreTechnique,
    ProficiencyLevel,
    Skill,
    SkillDnaProfile,
)

logger = logging.getLogger(__name__)


class SkillSummary(BaseModel):
    skill_name: str
    average_score: float
    evaluation_count: int
    confidence: float
    proficiency_level: ProficiencyLevel = ProficiencyLevel.BEGINNER


class VerifiedSkillEntry(BaseModel):
    skill_name: str
    verified_level: ProficiencyLevel
    confidence: float
    evidence_count: int
    last_demonstrated: str = ""
    mitre_technique_ids: list[str] = Field(default_factory=list)


class WeaknessEntry(BaseModel):
    skill_name: str
    average_score: float
    gap_description: str
    recommended_focus: str


class ConsolidatedProfile(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    evaluations: list[EvaluationResult] = Field(default_factory=list)
    overall_average_score: float = 0.0
    skill_summaries: list[SkillSummary] = Field(default_factory=list)
    demonstrated_skills: list[str] = Field(default_factory=list)
    missing_concepts: list[str] = Field(default_factory=list)
    detected_mitre_techniques: list[str] = Field(default_factory=list)
    overall_confidence: float = 0.0
    weaknesses: list[WeaknessEntry] = Field(default_factory=list)
    evaluation_count: int = 0


class CyberTwinModel(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:12])
    candidate_label: str = "Anonymous"
    verified_skills: list[VerifiedSkillEntry] = Field(default_factory=list)
    capability_profile: dict[str, Any] = Field(default_factory=dict)
    experience_graph: dict[str, Any] = Field(default_factory=dict)
    overall_score: float = 0.0
    overall_confidence: float = 0.0
    weakness_areas: list[WeaknessEntry] = Field(default_factory=list)
    last_updated: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


class CapabilityEngineError(Exception):
    """Raised when capability engine operations fail."""


class CapabilityEngine:
    """Aggregates evaluations into a Skill DNA Profile and Cyber Twin representation."""

    @staticmethod
    def aggregate_evaluations(
        evaluations: list[EvaluationResult],
    ) -> ConsolidatedProfile:
        if not evaluations:
            raise CapabilityEngineError("Cannot aggregate an empty evaluation list")

        score_sum: float = 0.0
        confidence_sum: float = 0.0
        all_skills: set[str] = set()
        all_missing: set[str] = set()
        all_mitre: set[str] = set()
        skill_scores: dict[str, list[float]] = {}
        skill_confidences: dict[str, list[float]] = {}

        for ev in evaluations:
            score_sum += ev.overall_score
            confidence_sum += ev.confidence

            if ev.skill:
                all_skills.add(ev.skill)
                skill_scores.setdefault(ev.skill, []).append(ev.overall_score)
                skill_confidences.setdefault(ev.skill, []).append(ev.confidence)

            for s in ev.demonstrated_skills:
                all_skills.add(s)
                skill_scores.setdefault(s, []).append(ev.overall_score)
                skill_confidences.setdefault(s, []).append(ev.confidence)

            for m in ev.missing_concepts:
                all_missing.add(m)

            for t in ev.mitre_technique_ids:
                all_mitre.add(t)

        eval_count: int = len(evaluations)
        overall_average: float = round(score_sum / eval_count, 2) if eval_count else 0.0
        overall_conf: float = (
            round(confidence_sum / eval_count, 2) if eval_count else 0.0
        )

        skill_summaries: list[SkillSummary] = []
        for s_name in sorted(all_skills):
            scores: list[float] = skill_scores.get(s_name, [])
            confs: list[float] = skill_confidences.get(s_name, [])
            avg_s: float = round(sum(scores) / len(scores), 2) if scores else 0.0
            avg_c: float = round(sum(confs) / len(confs), 2) if confs else 0.0
            level: ProficiencyLevel = CapabilityEngine._score_to_level(avg_s)
            skill_summaries.append(
                SkillSummary(
                    skill_name=s_name,
                    average_score=avg_s,
                    evaluation_count=len(scores),
                    confidence=avg_c,
                    proficiency_level=level,
                )
            )

        weaknesses: list[WeaknessEntry] = CapabilityEngine._detect_weaknesses(
            skill_summaries, all_missing
        )

        return ConsolidatedProfile(
            evaluations=evaluations,
            overall_average_score=overall_average,
            skill_summaries=skill_summaries,
            demonstrated_skills=sorted(all_skills),
            missing_concepts=sorted(all_missing),
            detected_mitre_techniques=sorted(all_mitre),
            overall_confidence=overall_conf,
            weaknesses=weaknesses,
            evaluation_count=eval_count,
        )

    @staticmethod
    def build_skill_dna(
        profile: ConsolidatedProfile,
        title: str = "Assessed Capability Profile",
    ) -> SkillDnaProfile:
        capabilities: list[Capability] = []
        knowledge_areas: list[KnowledgeArea] = []
        mitre_ids: set[str] = set()

        for s_name in profile.demonstrated_skills:
            matched_skill: Optional[Skill] = SEED_SKILLS.get(s_name)
            if matched_skill is None:
                matched_skill = Skill(
                    name=s_name, description="Identified during evaluation"
                )

            for cap in SEED_SKILLS.values():
                if cap.id == matched_skill.id and cap.knowledge_areas:
                    for ka in cap.knowledge_areas:
                        if ka not in knowledge_areas:
                            knowledge_areas.append(ka)

        for mitre_id in profile.detected_mitre_techniques:
            mitre_ids.add(mitre_id)
            technique: Optional[MitreTechnique] = SEED_MITRE_TECHNIQUES.get(mitre_id)
            if technique is not None:
                mitre_mapping: MitreMapping = MitreMapping(
                    technique=technique,
                    detection_methods=[],
                    mitigation_references=[],
                )
                if not any(
                    m.technique.id == technique.id
                    for c in capabilities
                    for m in c.mitre_mappings
                ):
                    capabilities.append(
                        Capability(
                            name=f"{technique.name} Response",
                            description=f"Capability related to MITRE {technique.id}: {technique.description}",
                            mitre_mappings=[mitre_mapping],
                            proficiency_level=CapabilityEngine._score_to_level(
                                profile.overall_average_score
                            ),
                        )
                    )

        difficulty: ProficiencyLevel = CapabilityEngine._score_to_level(
            profile.overall_average_score
        )

        return SkillDnaProfile(
            title=title,
            capabilities=capabilities,
            knowledge_areas=knowledge_areas,
            responsibilities=sorted(profile.demonstrated_skills),
            assessment_objectives=sorted(profile.missing_concepts),
            difficulty=difficulty,
            estimated_duration_minutes=profile.evaluation_count * 15,
            recommended_rubric=difficulty.value,
        )

    @staticmethod
    def build_cyber_twin(
        profile: ConsolidatedProfile,
        candidate_label: str = "Anonymous",
    ) -> CyberTwinModel:
        verified_skills: list[VerifiedSkillEntry] = []
        for summary in profile.skill_summaries:
            level: ProficiencyLevel = CapabilityEngine._score_to_level(
                summary.average_score
            )
            relevant_mitre: list[str] = [t for t in profile.detected_mitre_techniques]
            verified_skills.append(
                VerifiedSkillEntry(
                    skill_name=summary.skill_name,
                    verified_level=level,
                    confidence=summary.confidence,
                    evidence_count=summary.evaluation_count,
                    last_demonstrated=datetime.now(timezone.utc).isoformat(),
                    mitre_technique_ids=relevant_mitre[:3],
                )
            )

        capability_profile: dict[str, Any] = {
            "overall_score": profile.overall_average_score,
            "overall_confidence": profile.overall_confidence,
            "total_evaluations": profile.evaluation_count,
            "skills_verified": len(verified_skills),
            "weakness_count": len(profile.weaknesses),
            "mitre_techniques_detected": profile.detected_mitre_techniques,
        }

        experience_graph: dict[str, Any] = {
            "nodes": [
                {
                    "id": s.skill_name,
                    "type": "skill",
                    "score": s.average_score,
                    "confidence": s.confidence,
                }
                for s in profile.skill_summaries
            ],
            "edges": CapabilityEngine._build_experience_edges(profile),
            "mitre_techniques": [
                {"id": t, "label": CapabilityEngine._mitre_label(t)}
                for t in profile.detected_mitre_techniques
            ],
        }

        return CyberTwinModel(
            candidate_label=candidate_label,
            verified_skills=verified_skills,
            capability_profile=capability_profile,
            experience_graph=experience_graph,
            overall_score=profile.overall_average_score,
            overall_confidence=profile.overall_confidence,
            weakness_areas=profile.weaknesses,
        )

    @staticmethod
    def _score_to_level(score: float) -> ProficiencyLevel:
        if score >= 80:
            return ProficiencyLevel.EXPERT
        if score >= 65:
            return ProficiencyLevel.ADVANCED
        if score >= 45:
            return ProficiencyLevel.INTERMEDIATE
        return ProficiencyLevel.BEGINNER

    @staticmethod
    def _detect_weaknesses(
        summaries: list[SkillSummary],
        missing_concepts: list[str],
    ) -> list[WeaknessEntry]:
        weaknesses: list[WeaknessEntry] = []
        threshold: float = 45.0

        for s in summaries:
            if s.average_score < threshold:
                weaknesses.append(
                    WeaknessEntry(
                        skill_name=s.skill_name,
                        average_score=s.average_score,
                        gap_description=(
                            f"Score of {s.average_score}/100 indicates significant "
                            f"gap in {s.skill_name}. Requires foundational improvement."
                        ),
                        recommended_focus=(
                            f"Focus on building {s.skill_name} through structured "
                            f"learning and practical exercises."
                        ),
                    )
                )

        for concept in missing_concepts:
            if not any(w.skill_name == concept for w in weaknesses):
                weaknesses.append(
                    WeaknessEntry(
                        skill_name=concept,
                        average_score=0.0,
                        gap_description=(
                            f"Concept '{concept}' was not addressed in any evaluation. "
                            f"This represents a complete gap."
                        ),
                        recommended_focus=(
                            f"Study {concept} through foundational resources and "
                            f"attempt related practical challenges."
                        ),
                    )
                )

        return weaknesses

    @staticmethod
    def _build_experience_edges(
        profile: ConsolidatedProfile,
    ) -> list[dict[str, str]]:
        edges: list[dict[str, str]] = []
        mitre_list: list[str] = profile.detected_mitre_techniques

        for i in range(len(mitre_list) - 1):
            edges.append(
                {
                    "source": mitre_list[i],
                    "target": mitre_list[i + 1],
                    "relationship": "co_occurring_technique",
                }
            )

        for s_name in profile.demonstrated_skills:
            for mitre_id in mitre_list:
                if any(
                    mitre_id in s_name.upper() or s_name.upper() in mitre_id
                    for _ in [1]
                ):
                    continue
                if len(edges) < len(profile.demonstrated_skills) * 2:
                    edges.append(
                        {
                            "source": s_name,
                            "target": mitre_id,
                            "relationship": "skill_addresses_technique",
                        }
                    )

        return edges

    @staticmethod
    def _mitre_label(technique_id: str) -> str:
        technique: Optional[MitreTechnique] = SEED_MITRE_TECHNIQUES.get(technique_id)
        return technique.name if technique is not None else technique_id
