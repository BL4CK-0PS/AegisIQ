"""
AegisIQ Evaluation Repository

EvaluationResult + CyberTwin + LearningRoadmap queries.
"""

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models import (
    EvaluationResultModel,
    QuestionRecordModel,
    AssessmentModel,
    CyberTwinModel,
    LearningRoadmapModel,
)
from backend.repositories.base import BaseRepository


class EvaluationRepository(BaseRepository[EvaluationResultModel]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(EvaluationResultModel, session)

    async def get_by_question(self, question_id: str) -> EvaluationResultModel | None:
        result = await self.session.execute(
            select(EvaluationResultModel).where(
                EvaluationResultModel.question_id == question_id
            )
        )
        return result.scalar_one_or_none()

    async def get_by_assessment(self, assessment_id: str) -> list[EvaluationResultModel]:
        result = await self.session.execute(
            select(EvaluationResultModel)
            .join(
                QuestionRecordModel,
                EvaluationResultModel.question_id == QuestionRecordModel.id,
            )
            .where(QuestionRecordModel.assessment_id == assessment_id)
            .order_by(EvaluationResultModel.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_candidate(
        self, candidate_id: str, limit: int = 20, offset: int = 0
    ) -> list[EvaluationResultModel]:
        result = await self.session.execute(
            select(EvaluationResultModel)
            .join(
                QuestionRecordModel,
                EvaluationResultModel.question_id == QuestionRecordModel.id,
            )
            .join(
                AssessmentModel,
                QuestionRecordModel.assessment_id == AssessmentModel.id,
            )
            .where(AssessmentModel.candidate_id == candidate_id)
            .order_by(EvaluationResultModel.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())

    async def get_by_candidate_count(self, candidate_id: str) -> int:
        result = await self.session.execute(
            select(func.count())
            .select_from(EvaluationResultModel)
            .join(
                QuestionRecordModel,
                EvaluationResultModel.question_id == QuestionRecordModel.id,
            )
            .join(
                AssessmentModel,
                QuestionRecordModel.assessment_id == AssessmentModel.id,
            )
            .where(AssessmentModel.candidate_id == candidate_id)
        )
        return result.scalar_one()


class CyberTwinRepository(BaseRepository[CyberTwinModel]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(CyberTwinModel, session)


class LearningRoadmapRepository(BaseRepository[LearningRoadmapModel]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(LearningRoadmapModel, session)
