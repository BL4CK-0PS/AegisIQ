"""
AegisIQ User Routes

CRUD operations for user profiles. Admin-only for listing/deleting.
Uses UserRepository for clean database access.
"""

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth import get_current_user, hash_password, require_role
from backend.database import get_session
from backend.models import UserModel
from backend.repositories.user_repository import UserRepository

logger = logging.getLogger(__name__)
router = APIRouter()


class UpdateUserRequest(BaseModel):
    display_name: str | None = Field(default=None, max_length=255)
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserResponse(BaseModel):
    id: str
    email: str
    display_name: str
    role: str
    created_at: str | None = None


class PaginatedUsersResponse(BaseModel):
    users: list[UserResponse]
    total: int
    limit: int
    offset: int


def _user_to_dict(u: UserModel) -> dict[str, Any]:
    return {
        "id": u.id,
        "email": u.email,
        "display_name": u.display_name,
        "role": u.role,
        "created_at": u.created_at.isoformat() if u.created_at else None,
    }


@router.get("/", response_model=PaginatedUsersResponse)
async def list_users(
    limit: int = Query(20, ge=1, le=100, description="Max results to return"),
    offset: int = Query(0, ge=0, description="Number of results to skip"),
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(require_role("admin", "capability_analyst")),
) -> dict[str, Any]:
    repo = UserRepository(db)
    users = await repo.get_all(limit=limit, offset=offset)
    total = await repo.count()
    return {
        "users": [_user_to_dict(u) for u in users],
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    if user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not your profile"
        )
    return _user_to_dict(user)


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    payload: UpdateUserRequest,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update other users",
        )

    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if payload.display_name is not None:
        user.display_name = payload.display_name
    if payload.password is not None:
        user.hashed_password = hash_password(payload.password)

    await db.commit()
    await db.refresh(user)

    return _user_to_dict(user)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(require_role("admin")),
) -> None:
    repo = UserRepository(db)
    deleted = await repo.delete_by_id(user_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    logger.info("User deleted: %s", user_id)
