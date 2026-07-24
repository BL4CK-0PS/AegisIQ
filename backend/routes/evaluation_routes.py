"""
AegisIQ Evaluation Routes

Profile consolidation, Cyber Twin, and reporting endpoints.
Uses EvaluationRepository for clean database access.
"""

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth import get_current_user
from backend.database import get_session
from backend.models import UserModel
from backend.repositories.evaluation_repository import EvaluationRepository
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
    CapabilityEngine,
    CyberTwinModel as CTModel,
)
from src.core.evaluation.evaluator import EvaluationResult, CriterionScore
from src.core.knowledge.taxonomy import ProficiencyLevel

logger = logging.getLogger(__name__)
router = APIRouter()


async def _fetch_evaluations(
    db: AsyncSession,
    evaluation_ids: list[str],
    current_user: UserModel,
) -> list[EvaluationResult]:
    """Fetch EvaluationResultModel rows via repository and convert to DTOs."""
    repo = EvaluationRepository(db)

    if evaluation_ids:
        rows = []
        for eid in evaluation_ids:
            row = await repo.get_by_id(eid)
            if row is not None:
                rows.append(row)
    else:
        rows = await repo.get_by_candidate(candidate_id=current_user.id)

    evaluations: list[EvaluationResult] = []
    for row in rows:
        try:
            question_domain = ""
            if row.question_id:
                from sqlalchemy import select as sa_select
                from backend.models import QuestionRecordModel

                q_result = await db.execute(
                    sa_select(QuestionRecordModel).where(
                        QuestionRecordModel.id == row.question_id
                    )
                )
                q_row = q_result.scalar_one_or_none()
                if q_row:
                    question_domain = q_row.domain

            raw_criteria = row.criteria_scores if row.criteria_scores else []
            criteria_scores = [
                CriterionScore(
                    criterion_name=c.get("criterion_name", c.get("name", "")),
                    score=c.get("score", 0),
                    max_score=c.get("max_score", 10),
                    justification=c.get("justification", c.get("comment", "")),
                    passed=c.get("passed", False),
                )
                for c in raw_criteria
                if isinstance(c, dict)
            ]

            evaluations.append(
                EvaluationResult(
                    question_text="",
                    domain=question_domain,
                    skill=(
                        row.demonstrated_skills[0] if row.demonstrated_skills else ""
                    ),
                    overall_score=row.overall_score,
                    confidence=row.confidence,
                    proficiency_level=ProficiencyLevel(row.proficiency_level),
                    passed=row.passed,
                    criteria_scores=criteria_scores,
                    missing_concepts=row.missing_concepts or [],
                    demonstrated_skills=row.demonstrated_skills or [],
                    mitre_technique_ids=row.mitre_technique_ids or [],
                    overall_justification=row.overall_justification or "",
                )
            )
        except Exception as exc:
            logger.warning("Skipping malformed evaluation %s: %s", row.id, exc)
            continue
    return evaluations


@router.post("/profile/build", response_model=BuildProfileResponse)
async def build_profile_endpoint(
    payload: BuildProfileRequest,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    try:
        evals = await _fetch_evaluations(db, payload.evaluation_ids, current_user)
        if not evals:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No evaluation results found. Complete an assessment first.",
            )
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
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Profile build failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


@router.post("/cyber-twin/build", response_model=CyberTwinResponse)
async def build_cyber_twin_endpoint(
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    try:
        evals = await _fetch_evaluations(db, [], current_user)
        if not evals:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No evaluation results found. Complete an assessment first.",
            )
        profile: ConsolidatedProfile = build_profile(evals)
        twin: CTModel = build_cyber_twin(profile, label=current_user.display_name)
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
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Cyber Twin build failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


@router.post("/career-compass/analyze", response_model=CareerCompassResponse)
async def career_compass_analyze(
    payload: CareerCompassRequest,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    try:
        evals = await _fetch_evaluations(db, [], current_user)
        if evals:
            profile: ConsolidatedProfile = build_profile(evals)
            skill_profile = CapabilityEngine.build_skill_dna(
                profile, title=current_user.display_name
            )
        else:
            from src.core.knowledge.taxonomy import SkillDnaProfile

            skill_profile = SkillDnaProfile(title=current_user.display_name)

        analysis = analyze_career_gaps(skill_profile, payload.target_role)
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
async def career_compass_roles(
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    try:
        evals = await _fetch_evaluations(db, [], current_user)
        if evals:
            profile: ConsolidatedProfile = build_profile(evals)
            skill_profile = CapabilityEngine.build_skill_dna(
                profile, title=current_user.display_name
            )
        else:
            from src.core.knowledge.taxonomy import SkillDnaProfile

            skill_profile = SkillDnaProfile(title=current_user.display_name)

        roles = find_best_roles(skill_profile, top_n=7)
        return {"status": "success", "roles": roles}
    except Exception as exc:
        logger.error("Career compass roles failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        )


@router.post("/roadmap/generate", response_model=RoadmapResponse)
async def generate_roadmap_endpoint(
    payload: RoadmapRequest,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    try:
        evals = await _fetch_evaluations(db, [], current_user)
        if not evals:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No evaluation results found. Complete an assessment first.",
            )
        profile: ConsolidatedProfile = build_profile(evals)
        roadmap = await generate_roadmap(
            profile=profile,
            timeline_weeks=payload.timeline_weeks,
            label=current_user.display_name,
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
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Roadmap generation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)
        )
