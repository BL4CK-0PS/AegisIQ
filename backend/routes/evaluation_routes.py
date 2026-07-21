"""
AegisIQ Evaluation Routes

Profile consolidation, Cyber Twin, and reporting endpoints.
"""

import logging
from typing import Any

from fastapi import APIRouter, HTTPException, status

from backend.orchestrator import (
    build_profile,
    build_cyber_twin,
    analyze_career_gaps,
    find_best_roles,
    generate_roadmap,
)
from backend.schemas import (
    BuildProfileRequest,
    BuildProfileResponse,
    CareerCompassRequest,
    CareerCompassResponse,
    BestFitRolesResponse,
    RoadmapRequest,
    RoadmapResponse,
    CyberTwinResponse,
)
from src.core.evaluation.dna_engine import (
    ConsolidatedProfile,
    CyberTwinModel as CTModel,
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/profile/build", response_model=BuildProfileResponse)
async def build_profile_endpoint(payload: BuildProfileRequest) -> dict[str, Any]:
    from src.core.evaluation.evaluator import EvaluationResult

    evals: list[EvaluationResult] = []
    try:
        profile: ConsolidatedProfile = build_profile(evals)
        return {
            "status": "success",
            "profile_id": profile.id,
            "overall_average_score": profile.overall_average_score,
            "overall_confidence": profile.overall_confidence,
            "skill_summaries": [s.model_dump() for s in profile.skill_summaries],
            "demonstrated_skills": profile.demonstrated_skills,
            "missing_concepts": profile.missing_concepts,
            "detected_mitre_techniques": profile.detected_mitre_techniques,
            "weaknesses": [w.model_dump() for w in profile.weaknesses],
            "evaluation_count": profile.evaluation_count,
        }
    except Exception as exc:
        logger.error("Profile build failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


@router.post("/cyber-twin/build", response_model=CyberTwinResponse)
async def build_cyber_twin_endpoint() -> dict[str, Any]:
    try:
        profile: ConsolidatedProfile = build_profile([])
        twin: CTModel = build_cyber_twin(profile, label="Anonymous")
        return {
            "status": "success",
            "twin_id": twin.id,
            "candidate_label": twin.candidate_label,
            "overall_score": twin.overall_score,
            "overall_confidence": twin.overall_confidence,
            "verified_skills": [s.model_dump() for s in twin.verified_skills],
            "capability_profile": twin.capability_profile,
            "experience_graph": twin.experience_graph,
            "weakness_areas": [w.model_dump() for w in twin.weakness_areas],
            "last_updated": twin.last_updated,
        }
    except Exception as exc:
        logger.error("Cyber Twin build failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


@router.post("/career-compass/analyze", response_model=CareerCompassResponse)
async def career_compass_analyze(payload: CareerCompassRequest) -> dict[str, Any]:
    try:
        from src.core.knowledge.taxonomy import SkillDnaProfile

        dummy = SkillDnaProfile(title="Candidate")
        analysis = analyze_career_gaps(dummy, payload.target_role)
        return {
            "status": "success",
            "target_role": analysis.target_role,
            "overall_match_percentage": analysis.overall_match_percentage,
            "domain_results": [d.model_dump() for d in analysis.domain_results],
            "critical_gaps": [g.model_dump() for g in analysis.critical_gaps],
            "progression_steps": analysis.progression_steps,
        }
    except Exception as exc:
        logger.error("Career Compass failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.get("/career-compass/roles", response_model=BestFitRolesResponse)
async def career_compass_roles() -> dict[str, Any]:
    from src.core.knowledge.taxonomy import SkillDnaProfile

    dummy = SkillDnaProfile(title="Candidate")
    roles = find_best_roles(dummy, top_n=7)
    return {"status": "success", "roles": roles}


@router.post("/roadmap/generate", response_model=RoadmapResponse)
async def generate_roadmap_endpoint(payload: RoadmapRequest) -> dict[str, Any]:
    try:
        profile: ConsolidatedProfile = build_profile([])
        roadmap = await generate_roadmap(
            profile=profile,
            timeline_weeks=payload.timeline_weeks,
            label=payload.candidate_label,
        )
        return {
            "status": "success",
            "roadmap_id": roadmap.id,
            "candidate_label": roadmap.candidate_label,
            "overall_score": roadmap.overall_score,
            "proficiency_level": roadmap.proficiency_level.value,
            "timeline_weeks": roadmap.timeline_weeks,
            "steps": [s.model_dump() for s in roadmap.steps],
            "milestones": [m.model_dump() for m in roadmap.milestones],
            "labs": [lab.model_dump() for lab in roadmap.labs],
            "focus_areas": roadmap.focus_areas,
            "generated_at": roadmap.generated_at,
        }
    except Exception as exc:
        logger.error("Roadmap generation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)
        )
