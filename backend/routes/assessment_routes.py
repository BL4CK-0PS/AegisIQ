"""
AegisIQ Assessment Routes

Full session lifecycle: create, record answers, evaluate, complete, get results.
"""

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth import get_current_user
from backend.database import get_session
from backend.models import (
    UserModel,
    AssessmentModel,
    QuestionRecordModel,
    EvaluationResultModel,
)
from backend.orchestrator import (
    start_session,
    get_session_summary,
    evaluate_response,
)
from src.core.engine.branching import AdaptiveSession

logger = logging.getLogger(__name__)
router = APIRouter()


class CreateAssessmentRequest(BaseModel):
    domain: str = Field(default="Web Application Security")
    skill: str = Field(default="Web Vulnerability Scanning")
    difficulty: str = Field(default="beginner")
    question_count: int = Field(default=5, ge=1, le=10)


class RecordAnswerRequest(BaseModel):
    assessment_id: str
    question_id: str
    question_text: str
    domain: str
    skill: str
    difficulty: str
    candidate_answer: str = Field(default="")


class CompleteAssessmentRequest(BaseModel):
    assessment_id: str


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

        assessment = AssessmentModel(
            id=session.id,
            candidate_id=current_user.id,
            domain=payload.domain,
            status="active",
            current_difficulty=session.current_difficulty.value,
            summary=get_session_summary(session),
        )
        db.add(assessment)
        await db.commit()

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


@router.get("/{assessment_id}")
async def get_assessment(
    assessment_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    result = await db.execute(
        select(AssessmentModel).where(AssessmentModel.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
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
    payload: RecordAnswerRequest,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    result = await db.execute(
        select(AssessmentModel).where(AssessmentModel.id == payload.assessment_id)
    )
    assessment = result.scalar_one_or_none()
    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found"
        )

    record = QuestionRecordModel(
        assessment_id=assessment.id,
        question_text=payload.question_text,
        domain=payload.domain,
        skill=payload.skill,
        difficulty=payload.difficulty,
        candidate_answer=payload.candidate_answer,
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)

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
    result = await db.execute(
        select(AssessmentModel).where(AssessmentModel.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found"
        )

    questions: list[QuestionRecordModel] = assessment.questions or []
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No answers recorded for this assessment",
        )

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
            eval_record = EvaluationResultModel(
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
            db.add(eval_record)
            evaluation_results.append(eval_record)
        except Exception as exc:
            logger.warning("Evaluation failed for question %s: %s", q.id, exc)
            continue

    await db.commit()

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
    result = await db.execute(
        select(AssessmentModel).where(AssessmentModel.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found"
        )

    assessment.status = "completed"
    from datetime import datetime, timezone

    assessment.completed_at = datetime.now(timezone.utc)

    session_ref = AdaptiveSession(
        id=assessment.id,
        domain=assessment.domain,
    )
    summary = get_session_summary(session_ref)
    assessment.summary = summary

    await db.commit()

    return {"status": "success", "assessment_id": assessment_id, "summary": summary}


@router.get("/{assessment_id}/results")
async def get_assessment_results(
    assessment_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    evals_result = await db.execute(
        select(EvaluationResultModel)
        .join(
            QuestionRecordModel,
            EvaluationResultModel.question_id == QuestionRecordModel.id,
        )
        .join(
            AssessmentModel,
            QuestionRecordModel.assessment_id == AssessmentModel.id,
        )
        .where(AssessmentModel.id == assessment_id)
    )
    evals = evals_result.scalars().all()

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
