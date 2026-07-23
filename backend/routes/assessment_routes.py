"""
AegisIQ Assessment Routes

Full session lifecycle: create, record answers, evaluate, complete, get results.
Uses repositories for clean database access.
"""

import logging
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth import get_current_user
from backend.database import get_session
from backend.models import UserModel
from backend.repositories.assessment_repository import (
    AssessmentRepository,
    QuestionRecordRepository,
)
from backend.repositories.evaluation_repository import EvaluationRepository
from backend.orchestrator import (
    start_session,
    get_session_summary,
    evaluate_response,
)
from backend.schemas import (
    CreateAssessmentRequest,
    RecordAssessmentAnswerRequest,
    PaginatedAssessmentsResponse,
)
from src.core.engine.branching import AdaptiveSession

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_assessment(
    payload: CreateAssessmentRequest,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    try:
        session: AdaptiveSession = start_session(
            domain=payload.domain,
            difficulty=payload.difficulty,
        )

        repo = AssessmentRepository(db)
        assessment = await repo.create(
            id=session.id,
            candidate_id=current_user.id,
            domain=payload.domain,
            status="active",
            current_difficulty=session.current_difficulty.value,
            summary=get_session_summary(session),
        )

        logger.info(
            "Assessment created: %s for user %s",
            assessment.id,
            current_user.email,
        )

        return {
            "status": "success",
            "assessment_id": assessment.id,
            "domain": payload.domain,
            "difficulty": session.current_difficulty.value,
            "state": "ACTIVE",
        }

    except Exception as exc:
        logger.error("Assessment creation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get("/", response_model=PaginatedAssessmentsResponse)
async def list_assessments(
    limit: int = Query(20, ge=1, le=100, description="Max results to return"),
    offset: int = Query(0, ge=0, description="Number of results to skip"),
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    repo = AssessmentRepository(db)
    assessments = await repo.get_by_candidate(
        candidate_id=current_user.id, limit=limit, offset=offset
    )
    total = await repo.get_by_candidate_count(current_user.id)
    return {
        "assessments": [
            {
                "id": a.id,
                "domain": a.domain,
                "status": a.status,
                "current_difficulty": a.current_difficulty,
                "started_at": a.started_at.isoformat() if a.started_at else None,
                "completed_at": a.completed_at.isoformat() if a.completed_at else None,
                "question_count": len(a.questions) if a.questions else 0,
            }
            for a in assessments
        ],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.get("/{assessment_id}")
async def get_assessment(
    assessment_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    repo = AssessmentRepository(db)
    assessment = await repo.get_with_questions(assessment_id)
    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found"
        )

    return {
        "id": assessment.id,
        "domain": assessment.domain,
        "status": assessment.status,
        "current_difficulty": assessment.current_difficulty,
        "started_at": assessment.started_at.isoformat()
        if assessment.started_at
        else None,
        "completed_at": assessment.completed_at.isoformat()
        if assessment.completed_at
        else None,
        "question_count": len(assessment.questions) if assessment.questions else 0,
    }


@router.post("/record")
async def record_answer_endpoint(
    payload: RecordAssessmentAnswerRequest,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    repo = AssessmentRepository(db)
    assessment = await repo.get_by_id(payload.assessment_id)
    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found"
        )

    qr_repo = QuestionRecordRepository(db)
    record = await qr_repo.create(
        assessment_id=assessment.id,
        question_text=payload.question_text,
        domain=payload.domain,
        skill=payload.skill,
        difficulty=payload.difficulty,
        candidate_answer=payload.candidate_answer,
    )

    logger.debug(
        "Answer recorded for assessment %s, question %s", assessment.id, record.id
    )

    return {
        "status": "success",
        "record_id": record.id,
        "question_text": payload.question_text[:100],
    }


@router.post("/{assessment_id}/evaluate")
async def evaluate_assessment(
    assessment_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    repo = AssessmentRepository(db)
    assessment = await repo.get_with_questions(assessment_id)
    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found"
        )

    questions = assessment.questions or []
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No answers recorded for this assessment",
        )

    logger.info(
        "Evaluating assessment %s with %d questions",
        assessment_id,
        len(questions),
    )
    for q in questions:
        logger.info(
            "Question %s: has_answer=%s answer_len=%d",
            q.id,
            bool(q.candidate_answer),
            len(q.candidate_answer) if q.candidate_answer else 0,
        )

    eval_repo = EvaluationRepository(db)
    evaluation_results = []
    for q in questions:
        if not q.candidate_answer:
            continue
        try:
            evaluation = await evaluate_response(
                question_text=q.question_text,
                candidate_answer=q.candidate_answer,
                domain=q.domain,
                skill=q.skill,
                difficulty=q.difficulty,
            )
            eval_record = await eval_repo.create(
                question_id=q.id,
                overall_score=evaluation.overall_score,
                confidence=evaluation.confidence,
                proficiency_level=evaluation.proficiency_level.value,
                passed=evaluation.passed,
                criteria_scores=[c.model_dump() for c in evaluation.criteria_scores],
                missing_concepts=evaluation.missing_concepts,
                demonstrated_skills=evaluation.demonstrated_skills,
                mitre_technique_ids=evaluation.mitre_technique_ids,
                overall_justification=evaluation.overall_justification,
            )
            evaluation_results.append(eval_record)
        except Exception as exc:
            logger.warning("Evaluation failed for question %s: %s", q.id, exc)
            continue

    avg_score = (
        sum(e.overall_score for e in evaluation_results) / len(evaluation_results)
        if evaluation_results
        else 0.0
    )

    return {
        "status": "success",
        "assessment_id": assessment_id,
        "evaluations_count": len(evaluation_results),
        "average_score": round(avg_score, 2),
        "evaluations": [
            {
                "id": e.id,
                "score": e.overall_score,
                "confidence": e.confidence,
                "proficiency_level": e.proficiency_level,
                "passed": e.passed,
                "mitre_technique_ids": e.mitre_technique_ids,
            }
            for e in evaluation_results
        ],
    }


@router.post("/{assessment_id}/complete")
async def complete_assessment_endpoint(
    assessment_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    repo = AssessmentRepository(db)
    assessment = await repo.get_by_id(assessment_id)
    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found"
        )

    assessment.status = "completed"
    assessment.completed_at = datetime.now(timezone.utc)

    try:
        repo2 = AssessmentRepository(db)
        full_assessment = await repo2.get_with_questions(assessment_id)
        question_count = len(full_assessment.questions) if full_assessment and full_assessment.questions else 0
        domains = list({q.domain for q in (full_assessment.questions or []) if q.domain})
        difficulties = list({q.difficulty for q in (full_assessment.questions or []) if q.difficulty})
        summary = {
            "total_questions": question_count,
            "domain": assessment.domain,
            "domains_covered": domains,
            "difficulties_covered": difficulties,
        }
    except Exception:
        summary = {"total_questions": 0, "domain": assessment.domain}

    assessment.summary = summary

    try:
        await db.commit()
    except Exception as exc:
        logger.error("Failed to commit assessment completion %s: %s", assessment_id, exc)
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save assessment completion",
        )

    return {"status": "success", "assessment_id": assessment_id, "summary": summary}


@router.get("/{assessment_id}/results")
async def get_assessment_results(
    assessment_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    eval_repo = EvaluationRepository(db)
    evals = await eval_repo.get_by_assessment(assessment_id)

    return {
        "assessment_id": assessment_id,
        "evaluation_count": len(evals),
        "results": [
            {
                "id": e.id,
                "overall_score": e.overall_score,
                "confidence": e.confidence,
                "proficiency_level": e.proficiency_level,
                "passed": e.passed,
                "criteria_scores": e.criteria_scores,
                "missing_concepts": e.missing_concepts,
                "demonstrated_skills": e.demonstrated_skills,
                "mitre_technique_ids": e.mitre_technique_ids,
                "overall_justification": e.overall_justification,
            }
            for e in evals
        ],
    }
