"""
AegisIQ AI Orchestrator

Central wiring layer that connects all src/core/ modules.
Lazily initialises providers and engines on first use.
"""

import logging
from typing import Any, Optional, Union

from backend.config import get_settings
from backend.services.provider_factory import create_ai_client

from src.core.ai.client import AIClient
from src.core.ai.prompt_loader import PromptLoader
from src.core.engine.question_generator import QuestionGenerator, GeneratedQuestionSet
from src.core.engine.scenarios import (
    ScenarioGenerator,
    IncidentScenario,
    ThreatHuntingScenario,
)
from src.core.engine.branching import (
    AdaptiveSessionManager,
    AdaptiveSession,
    DifficultyAdjustment,
)
from src.core.evaluation.evaluator import AnswerEvaluator, EvaluationResult
from src.core.evaluation.dna_engine import (
    CapabilityEngine,
    ConsolidatedProfile,
    CyberTwinModel as CTModel,
)
from src.core.evaluation.career_compass import CareerCompassEngine, RoleGapAnalysis
from src.core.knowledge.seed_data import ALL_DOMAINS, SEED_SKILLS
from src.core.knowledge.taxonomy import (
    CyberDomain,
    MitreTechnique,
    ProficiencyLevel,
    Skill,
    SkillDnaProfile,
)
from src.core.knowledge.rubrics import get_rubric_for_difficulty, ScoringRubric
from src.core.mentor.mentor_engine import AIMentorEngine, LearningRoadmap
from src.core.mentor.feedback import FeedbackEngine, AnswerRepairGuide

logger = logging.getLogger(__name__)

_ai_client: Optional[AIClient] = None
_prompt_loader: Optional[PromptLoader] = None
_settings = get_settings()


def _get_client() -> AIClient:
    global _ai_client
    if _ai_client is None:
        _ai_client, _ = create_ai_client()
    return _ai_client


def _get_loader() -> PromptLoader:
    global _prompt_loader
    if _prompt_loader is None:
        _, _prompt_loader = create_ai_client()
    return _prompt_loader


def _resolve_difficulty(level: str) -> ProficiencyLevel:
    mapping = {
        "beginner": ProficiencyLevel.BEGINNER,
        "intermediate": ProficiencyLevel.INTERMEDIATE,
        "advanced": ProficiencyLevel.ADVANCED,
        "expert": ProficiencyLevel.EXPERT,
    }
    return mapping.get(level.lower(), ProficiencyLevel.INTERMEDIATE)


def _find_domain(name: str) -> CyberDomain:
    for d in ALL_DOMAINS:
        if d.name.lower() == name.lower():
            return d
    return ALL_DOMAINS[0]


def _find_skill(name: str) -> Skill:
    skill = SEED_SKILLS.get(name)
    if skill is None:
        raise ValueError(
            f"Unknown skill '{name}'. Available: {list(SEED_SKILLS.keys())}"
        )
    return skill


# ---------------------------------------------------------------------------
# JD Intelligence
# ---------------------------------------------------------------------------


async def parse_jd(
    jd_text: str,
    title: str = "Parsed Job Description",
) -> SkillDnaProfile:
    domain = ALL_DOMAINS[0]
    ka = domain.capabilities[0].skills[0].knowledge_areas if domain.capabilities else []
    return SkillDnaProfile(
        title=title,
        capabilities=domain.capabilities,
        knowledge_areas=ka,
        responsibilities=[jd_text[:200]],
        assessment_objectives=["Analyse job description for skill requirements"],
        difficulty=ProficiencyLevel.INTERMEDIATE,
    )


# ---------------------------------------------------------------------------
# Question / Scenario Generation
# ---------------------------------------------------------------------------


async def generate_skill_assessment(
    domain_name: str,
    skill_name: str,
    difficulty: str,
    question_count: int = 5,
) -> GeneratedQuestionSet:
    domain = _find_domain(domain_name)
    skill = _find_skill(skill_name)
    diff = _resolve_difficulty(difficulty)

    gen = QuestionGenerator(
        ai_client=_get_client(),
        prompt_loader=_get_loader(),
    )
    return await gen.generate_skill_assessment(
        domain=domain,
        skill=skill,
        difficulty=diff,
        question_count=question_count,
    )


def build_incident_scenario(technique_id: str, difficulty: str) -> IncidentScenario:
    technique: MitreTechnique = ScenarioGenerator.lookup_technique(technique_id)
    diff = _resolve_difficulty(difficulty)
    return ScenarioGenerator.create_incident_scenario(
        technique=technique, difficulty=diff
    )


def build_threat_hunting_scenario(technique_ids: list[str]) -> ThreatHuntingScenario:
    techniques = [ScenarioGenerator.lookup_technique(tid) for tid in technique_ids]
    return ScenarioGenerator.create_threat_hunting_scenario(techniques=techniques)


# ---------------------------------------------------------------------------
# Evaluation
# ---------------------------------------------------------------------------


async def evaluate_response(
    question_text: str,
    candidate_answer: str,
    domain: str,
    skill: str,
    difficulty: str,
) -> EvaluationResult:
    diff = _resolve_difficulty(difficulty)
    rubric: ScoringRubric = get_rubric_for_difficulty(diff.value)

    evaluator = AnswerEvaluator(
        ai_client=_get_client(),
        prompt_loader=_get_loader(),
    )
    return await evaluator.evaluate(
        question_text=question_text,
        candidate_answer=candidate_answer,
        rubric=rubric,
        domain=domain,
        skill=skill,
    )


# ---------------------------------------------------------------------------
# Profile / Cyber Twin
# ---------------------------------------------------------------------------


def build_profile(evaluations: list[EvaluationResult]) -> ConsolidatedProfile:
    return CapabilityEngine.aggregate_evaluations(evaluations)


def build_cyber_twin(
    profile: ConsolidatedProfile,
    label: str = "Anonymous",
) -> CTModel:
    return CapabilityEngine.build_cyber_twin(profile=profile, candidate_label=label)


# ---------------------------------------------------------------------------
# Career Compass
# ---------------------------------------------------------------------------


def analyze_career_gaps(
    profile: Union[SkillDnaProfile, CTModel],
    target_role: str,
) -> RoleGapAnalysis:
    return CareerCompassEngine.analyze_against_role(profile, target_role)


def find_best_roles(
    profile: Union[SkillDnaProfile, CTModel],
    top_n: int = 3,
) -> list[dict[str, Any]]:
    return CareerCompassEngine.find_best_fit_roles(profile, top_n=top_n)


# ---------------------------------------------------------------------------
# Mentor (Roadmap + Feedback)
# ---------------------------------------------------------------------------


async def generate_roadmap(
    profile: ConsolidatedProfile,
    timeline_weeks: int = 8,
    label: str = "Anonymous",
) -> LearningRoadmap:
    mentor = AIMentorEngine(
        ai_client=_get_client(),
        prompt_loader=_get_loader(),
    )
    return await mentor.generate_roadmap(
        profile=profile,
        timeline_weeks=timeline_weeks,
        candidate_label=label,
    )


async def generate_repair_guide(
    question_text: str,
    candidate_answer: str,
    evaluation_result: EvaluationResult,
    domain: str = "",
    skill: str = "",
    mitre_technique_id: str = "",
) -> AnswerRepairGuide:
    feedback = FeedbackEngine(
        ai_client=_get_client(),
        prompt_loader=_get_loader(),
    )
    return await feedback.generate_answer_repair(
        question_text=question_text,
        candidate_answer=candidate_answer,
        evaluation_result=evaluation_result,
        domain=domain,
        skill=skill,
        mitre_technique_id=mitre_technique_id,
    )


# ---------------------------------------------------------------------------
# Adaptive Session
# ---------------------------------------------------------------------------

_session_manager: Optional[AdaptiveSessionManager] = None


def _get_session_manager() -> AdaptiveSessionManager:
    global _session_manager
    if _session_manager is None:
        _session_manager = AdaptiveSessionManager()
    return _session_manager


def start_session(domain: str, difficulty: str = "beginner") -> AdaptiveSession:
    diff = _resolve_difficulty(difficulty)
    return _get_session_manager().start_session(domain=domain, initial_difficulty=diff)


def record_answer(
    session: AdaptiveSession,
    question_id: str,
    question_text: str,
    domain: str,
    skill: str,
    difficulty: str,
    score: float,
    confidence: float,
    passed: bool,
    is_follow_up: bool = False,
) -> AdaptiveSession:
    diff = _resolve_difficulty(difficulty)
    return _get_session_manager().record_answer(
        session=session,
        question_id=question_id,
        question_text=question_text,
        domain=domain,
        skill=skill,
        difficulty=diff,
        score=score,
        confidence=confidence,
        passed=passed,
        is_follow_up=is_follow_up,
    )


def compute_next_difficulty(
    session: AdaptiveSession,
    current_skill: str = "",
) -> DifficultyAdjustment:
    return _get_session_manager().compute_next_difficulty(
        session, current_skill=current_skill
    )


def complete_session(session: AdaptiveSession) -> AdaptiveSession:
    return _get_session_manager().complete_session(session)


def get_session_summary(session: AdaptiveSession) -> dict[str, Any]:
    return _get_session_manager().get_session_summary(session)
