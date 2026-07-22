"""
AegisIQ Base Repository

Generic async CRUD operations over SQLAlchemy ORM models.
"""

from typing import Any, Generic, Sequence, TypeVar

from sqlalchemy import select, func, delete as sa_delete
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    """Provides generic CRUD helpers for any declarative model."""

    def __init__(self, model: type[ModelT], session: AsyncSession) -> None:
        self.model = model
        self.session = session

    async def get_by_id(self, record_id: str) -> ModelT | None:
        return await self.session.get(self.model, record_id)

    async def get_all(
        self,
        limit: int = 20,
        offset: int = 0,
        order_by: Any | None = None,
    ) -> Sequence[ModelT]:
        stmt = select(self.model)
        if order_by is not None:
            stmt = stmt.order_by(order_by)
        else:
            try:
                stmt = stmt.order_by(self.model.created_at.desc())
            except AttributeError:
                pass
        stmt = stmt.limit(limit).offset(offset)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def count(self) -> int:
        stmt = select(func.count()).select_from(self.model)
        result = await self.session.execute(stmt)
        return result.scalar_one()

    async def create(self, **kwargs: Any) -> ModelT:
        instance = self.model(**kwargs)
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)
        return instance

    async def delete_by_id(self, record_id: str) -> bool:
        instance = await self.get_by_id(record_id)
        if instance is None:
            return False
        await self.session.delete(instance)
        await self.session.commit()
        return True

    async def exists(self, record_id: str) -> bool:
        return await self.get_by_id(record_id) is not None
