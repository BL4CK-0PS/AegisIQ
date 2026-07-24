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
        try:
            _ai_client, _ = create_ai_client()
        except Exception as exc:
            logger.warning(
                "Primary AI provider failed (%s), falling back to MockProvider", exc
            )
            _ai_client, _ = create_ai_client(provider_name="mock")
    return _ai_client


def _get_loader() -> PromptLoader:
    global _prompt_loader
    if _prompt_loader is None:
        try:
            _, _prompt_loader = create_ai_client()
        except Exception as exc:
            logger.warning("Prompt loader init failed (%s), falling back to MockProvider", exc)
            _, _prompt_loader = create_ai_client(provider_name="mock")
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
    client = _get_client()
    loader = _get_loader()

    variables: dict[str, Any] = {
        "jd_text": jd_text,
        "title": title,
        "domain_list": ", ".join(d.name for d in ALL_DOMAINS),
    }
    try:
        rendered: str = loader.render("jd_parsing", variables)
    except Exception:
        rendered = (
            "Analyse the following job description and extract structured data.\n\n"
            f"Job Description:\n{jd_text}\n\n"
            "Return a JSON object with keys: title, domain, skills (list of strings), "
            "mitre_techniques (list of technique IDs like T1190), technologies (list of strings), "
            "difficulty (beginner|intermediate|advanced|expert), responsibilities (list of strings), "
            "assessment_objectives (list of strings)."
        )

    try:
        raw: str = await client.generate(prompt=rendered, schema=_JD_PARSE_SCHEMA)
    except Exception as exc:
        logger.warning("LLM JD parse failed, falling back to keyword matching: %s", exc)
        return _fallback_jd_parse(jd_text, title)

    import json as _json

    cleaned = raw.strip()
    if cleaned.startswith("```"):
        lines = cleaned.splitlines()
        start = 1 if lines[0].startswith("```") else 0
        end = -1 if lines[-1].strip() == "```" else len(lines)
        cleaned = "\n".join(lines[start:end]).strip()

    try:
        data: dict[str, Any] = _json.loads(cleaned)
    except _json.JSONDecodeError:
        logger.warning("Failed to parse JD JSON from LLM, falling back")
        return _fallback_jd_parse(jd_text, title)

    domain_name: str = data.get("domain", ALL_DOMAINS[0].name)
    domain = _find_domain(domain_name)
    skills_names: list[str] = data.get("skills", [])
    matched_skills: list[Skill] = []
    for sname in skills_names:
        try:
            matched_skills.append(_find_skill(sname))
        except ValueError:
            pass

    difficulty_str: str = data.get("difficulty", "intermediate")
    difficulty = _resolve_difficulty(difficulty_str)

    knowledge_areas = [
        ka
        for cap in domain.capabilities
        for skill in cap.skills
        for ka in skill.knowledge_areas
    ]

    return SkillDnaProfile(
        title=data.get("title", title),
        capabilities=domain.capabilities,
        knowledge_areas=knowledge_areas,
        responsibilities=data.get("responsibilities", jd_text.split("\n")[:20]),
        assessment_objectives=data.get(
            "assessment_objectives",
            [f"Assess {s.name} capability" for s in matched_skills[:10]],
        ),
        difficulty=difficulty,
        recommended_rubric=difficulty.value,
    )


def _fallback_jd_parse(jd_text: str, title: str) -> SkillDnaProfile:
    text_lower = jd_text.lower()
    matched_domains = [
        d
        for d in ALL_DOMAINS
        if any(
            kw in text_lower
            for kw in d.name.lower().split()
        ) or any(
            kw in text_lower
            for cap in d.capabilities
            for s in cap.skills
            for kw in s.name.lower().split() + s.alternative_labels
        )
    ]
    profile_domain = matched_domains[0] if matched_domains else ALL_DOMAINS[0]

    difficulty = ProficiencyLevel.INTERMEDIATE
    if "senior" in text_lower or "advanced" in text_lower or "lead" in text_lower:
        difficulty = ProficiencyLevel.ADVANCED
    if "expert" in text_lower or "architect" in text_lower or "principal" in text_lower:
        difficulty = ProficiencyLevel.EXPERT
    if "junior" in text_lower or "entry" in text_lower or "tier 1" in text_lower:
        difficulty = ProficiencyLevel.BEGINNER

    knowledge_areas = [
        ka
        for cap in profile_domain.capabilities
        for skill in cap.skills
        for ka in skill.knowledge_areas
    ]

    return SkillDnaProfile(
        title=title,
        capabilities=profile_domain.capabilities,
        knowledge_areas=knowledge_areas,
        responsibilities=[line.strip() for line in jd_text.split("\n") if line.strip()][
            :20
        ],
        assessment_objectives=["Analyse job description for skill requirements"],
        difficulty=difficulty,
        recommended_rubric=difficulty.value,
    )


_JD_PARSE_SCHEMA: dict[str, Any] = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "domain": {"type": "string"},
        "skills": {"type": "array", "items": {"type": "string"}},
        "mitre_techniques": {"type": "array", "items": {"type": "string"}},
        "technologies": {"type": "array", "items": {"type": "string"}},
        "difficulty": {
            "type": "string",
            "enum": ["beginner", "intermediate", "advanced", "expert"],
        },
        "responsibilities": {"type": "array", "items": {"type": "string"}},
        "assessment_objectives": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["title", "domain", "skills", "difficulty"],
}


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
