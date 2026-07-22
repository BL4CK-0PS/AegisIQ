"""
AegisIQ Assessment Repository

Assessment + QuestionRecord queries.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.models import AssessmentModel, QuestionRecordModel
from backend.repositories.base import BaseRepository


class AssessmentRepository(BaseRepository[AssessmentModel]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(AssessmentModel, session)

    async def get_by_candidate(
        self, candidate_id: str, limit: int = 20, offset: int = 0
    ) -> list[AssessmentModel]:
        result = await self.session.execute(
            select(AssessmentModel)
            .where(AssessmentModel.candidate_id == candidate_id)
            .options(selectinload(AssessmentModel.questions))
            .order_by(AssessmentModel.started_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())

    async def get_by_candidate_count(self, candidate_id: str) -> int:
        from sqlalchemy import func
        result = await self.session.execute(
            select(func.count())
            .select_from(AssessmentModel)
            .where(AssessmentModel.candidate_id == candidate_id)
        )
        return result.scalar_one()

    async def get_with_questions(self, assessment_id: str) -> AssessmentModel | None:
        result = await self.session.execute(
            select(AssessmentModel)
            .options(selectinload(AssessmentModel.questions))
            .where(AssessmentModel.id == assessment_id)
        )
        return result.scalar_one_or_none()


class QuestionRecordRepository(BaseRepository[QuestionRecordModel]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(QuestionRecordModel, session)

    async def get_by_assessment(
        self, assessment_id: str, limit: int = 100, offset: int = 0
    ) -> list[QuestionRecordModel]:
        result = await self.session.execute(
            select(QuestionRecordModel)
            .where(QuestionRecordModel.assessment_id == assessment_id)
            .order_by(QuestionRecordModel.created_at.asc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())
