"""
AegisIQ AI Routes — Production Ready

Wires src/core/ai, engine, evaluation, mentor modules into FastAPI endpoints.
"""

import json
import logging
from typing import Any

from fastapi import APIRouter, HTTPException, status

from backend.orchestrator import (
    generate_skill_assessment,
    build_incident_scenario,
    evaluate_response,
    generate_roadmap,
    generate_repair_guide,
    build_profile,
    build_cyber_twin,
    analyze_career_gaps,
    find_best_roles,
    parse_jd,
    start_session,
    record_answer,
    compute_next_difficulty,
    complete_session,
    get_session_summary,
)
from backend.schemas import (
    GenerateAssessmentRequest,
    GenerateAssessmentResponse,
    EvaluateResponseRequest,
    EvaluateResponseResponse,
    ParseJDRequest,
    ParseJDResponse,
    IncidentScenarioRequest,
    IncidentScenarioResponse,
    RepairGuideRequest,
    RepairGuideResponse,
    StartSessionRequest,
    RecordAnswerRequest,
    SessionResponse,
)
from backend.config import get_settings

from src.core.evaluation.evaluator import EvaluationResult

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()


@router.post("/parse-jd", response_model=ParseJDResponse, status_code=status.HTTP_200_OK)
async def parse_jd_endpoint(payload: ParseJDRequest) -> dict[str, Any]:
    try:
        profile = await parse_jd(jd_text=payload.jd_text, title=payload.title)
        return {
            "status": "success",
            "title": profile.title,
            "difficulty": profile.difficulty.value,
            "capabilities": [c.model_dump() for c in profile.capabilities],
            "knowledge_areas": [k.model_dump() for k in profile.knowledge_areas],
            "responsibilities": profile.responsibilities,
            "assessment_objectives": profile.assessment_objectives,
            "estimated_duration_minutes": profile.estimated_duration_minutes,
            "recommended_rubric": profile.recommended_rubric,
        }
    except Exception as exc:
        logger.error("JD parsing failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.post("/generate-assessment", response_model=GenerateAssessmentResponse, status_code=status.HTTP_200_OK)
async def generate_assessment(payload: GenerateAssessmentRequest) -> dict[str, Any]:
    try:
        qset = await generate_skill_assessment(
            domain_name=payload.domain,
            skill_name=payload.skill,
            difficulty=payload.difficulty,
            question_count=payload.question_count,
        )
        return {
            "status": "success",
            "domain": qset.domain,
            "skill": qset.skill,
            "difficulty": qset.difficulty.value,
            "questions": [q.model_dump() for q in qset.questions],
            "total_time_estimate_minutes": qset.total_time_estimate_minutes,
        }
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    except Exception as exc:
        logger.error("Assessment generation failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc))


@router.post("/incident-scenario", response_model=IncidentScenarioResponse)
async def incident_scenario(payload: IncidentScenarioRequest) -> dict[str, Any]:
    try:
        scenario = build_incident_scenario(payload.technique_id, payload.difficulty)
        return {"status": "success", "scenario": scenario.model_dump()}
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.post("/evaluate", response_model=EvaluateResponseResponse, status_code=status.HTTP_200_OK)
async def evaluate(payload: EvaluateResponseRequest) -> dict[str, Any]:
    try:
        result: EvaluationResult = await evaluate_response(
            question_text=payload.question_text,
            candidate_answer=payload.candidate_answer,
            domain=payload.domain,
            skill=payload.skill,
            difficulty=payload.difficulty,
        )
        return {
            "status": "success",
            "overall_score": result.overall_score,
            "confidence": result.confidence,
            "proficiency_level": result.proficiency_level.value,
            "passed": result.passed,
            "criteria_scores": [c.model_dump() for c in result.criteria_scores],
            "missing_concepts": result.missing_concepts,
            "demonstrated_skills": result.demonstrated_skills,
            "mitre_technique_ids": result.mitre_technique_ids,
            "overall_justification": result.overall_justification,
        }
    except Exception as exc:
        logger.error("Evaluation failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc))


@router.post("/repair-guide", response_model=RepairGuideResponse)
async def repair_guide(payload: RepairGuideRequest) -> dict[str, Any]:
    try:
        dummy_eval = EvaluationResult(
            question_text=payload.question_text,
            domain=payload.domain,
            skill=payload.skill,
        )
        guide = await generate_repair_guide(
            question_text=payload.question_text,
            candidate_answer=payload.candidate_answer,
            evaluation_result=dummy_eval,
            domain=payload.domain,
            skill=payload.skill,
            mitre_technique_id=payload.mitre_technique_id,
        )
        return {
            "status": "success",
            "guide_id": guide.id,
            "what_was_missing": guide.what_was_missing,
            "model_answer": guide.model_answer,
            "model_answer_breakdown": guide.model_answer_breakdown,
            "key_principles": [p.model_dump() for p in guide.key_principles],
            "practice_exercise": guide.practice_exercise,
        }
    except Exception as exc:
        logger.error("Repair guide failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc))


@router.post("/session/start", response_model=SessionResponse)
async def session_start(payload: StartSessionRequest) -> dict[str, Any]:
    session = start_session(domain=payload.domain, difficulty=payload.initial_difficulty)
    return {"status": "success", "session": session.model_dump()}


@router.post("/session/record", response_model=SessionResponse)
async def session_record(payload: RecordAnswerRequest) -> dict[str, Any]:
    session_ref = start_session(payload.domain)
    updated = record_answer(
        session=session_ref,
        question_id=payload.question_id,
        question_text=payload.question_text,
        domain=payload.domain,
        skill=payload.skill,
        difficulty=payload.difficulty,
        score=payload.score,
        confidence=payload.confidence,
        passed=payload.passed,
        is_follow_up=payload.is_follow_up,
    )
    return {"status": "success", "session": updated.model_dump()}


@router.post("/session/complete")
async def session_complete(payload: StartSessionRequest) -> dict[str, Any]:
    session = start_session(payload.domain)
    completed = complete_session(session)
    return {"status": "success", "session": completed.model_dump()}


@router.get("/providers")
async def list_providers() -> dict[str, Any]:
    import os

    providers = {
        "gemini": bool(os.getenv("GEMINI_API_KEY")),
        "mistral": bool(os.getenv("MISTRAL_API_KEY")),
        "ollama": True,
        "mock": True,
    }
    return {
        "available": providers,
        "active": os.getenv("LLM_PROVIDER", "ollama"),
        "configured": [k for k, v in providers.items() if v],
    }
