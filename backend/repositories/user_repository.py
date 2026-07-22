"""
AegisIQ User Repository

User-specific queries built on top of BaseRepository.
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.models import UserModel
from backend.repositories.base import BaseRepository


class UserRepository(BaseRepository[UserModel]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(UserModel, session)

    async def get_by_email(self, email: str) -> UserModel | None:
        result = await self.session.execute(
            select(UserModel).where(UserModel.email == email)
        )
        return result.scalar_one_or_none()

    async def email_exists(self, email: str) -> bool:
        return await self.get_by_email(email) is not None

    async def get_by_role(
        self, role: str, limit: int = 20, offset: int = 0
    ) -> list[UserModel]:
        result = await self.session.execute(
            select(UserModel)
            .where(UserModel.role == role)
            .order_by(UserModel.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())
