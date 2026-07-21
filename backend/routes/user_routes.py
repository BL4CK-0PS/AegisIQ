"""
AegisIQ User Routes

CRUD operations for user profiles. Admin-only for listing/deleting.
"""

import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth import get_current_user, hash_password, require_role
from backend.database import get_session
from backend.models import UserModel

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


@router.get("/", response_model=list[UserResponse])
async def list_users(
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(require_role("admin", "capability_analyst")),
) -> list[dict[str, Any]]:
    result = await db.execute(select(UserModel).order_by(UserModel.created_at.desc()))
    users = result.scalars().all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "display_name": u.display_name,
            "role": u.role,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in users
    ]


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(get_current_user),
) -> dict[str, Any]:
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return {
        "id": user.id,
        "email": user.email,
        "display_name": user.display_name,
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


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

    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if payload.display_name is not None:
        user.display_name = payload.display_name
    if payload.password is not None:
        user.hashed_password = hash_password(payload.password)

    await db.commit()
    await db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "display_name": user.display_name,
        "role": user.role,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    db: AsyncSession = Depends(get_session),
    current_user: UserModel = Depends(require_role("admin")),
) -> None:
    result = await db.execute(select(UserModel).where(UserModel.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    await db.execute(delete(UserModel).where(UserModel.id == user_id))
    await db.commit()
    logger.info("User deleted: %s (%s)", user.email, user_id)
