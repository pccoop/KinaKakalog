from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_admin
from app.core.activity_logger import log_activity
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.auth import (
    AdminCreateUserRequest,
    AdminUpdateUserRequest,
    MessageResponse,
    UserResponse,
)

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(require_admin)],
):
    stmt = select(User).order_by(User.id.desc())
    users = db.scalars(stmt).all()
    return [UserResponse.model_validate(u) for u in users]

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    data: AdminCreateUserRequest,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(require_admin)],
):
    clean_login = data.login.strip()
    if not clean_login:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Логин не может быть пустым",
        )

    existing = db.scalar(select(User).where(User.login == clean_login))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=settings.msg_login_exists,
        )

    if data.role not in [settings.role_admin, settings.role_user]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недопустимая роль пользователя",
        )

    user = User(
        login=clean_login,
        name=data.name.strip() or clean_login,
        hashed_password=get_password_hash(data.password),
        role=data.role,
        is_blocked=False,
        failed_attempts=0,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    log_activity(
        db=db,
        user_id=_.id,
        user_login=_.login,
        user_role=_.role,
        action="user.admin_create",
        entity_type="user",
        entity_id=user.id,
        details=f"Администратор «{_.login}» создал пользователя «{user.login}» (роль: {user.role})",
    )

    return UserResponse.model_validate(user)

@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    data: AdminUpdateUserRequest,
    current_admin: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")

    if data.role is not None and data.role not in [settings.role_admin, settings.role_user]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недопустимая роль пользователя",
        )

    if user.id == current_admin.id:
        if data.role is not None and data.role != settings.role_admin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=settings.msg_self_demote_forbidden,
            )
        if data.is_blocked is True:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=settings.msg_self_block_forbidden,
            )

    if data.name is not None:
        user.name = data.name.strip()
    if data.role is not None:
        user.role = data.role
    if data.is_blocked is not None:
        user.is_blocked = data.is_blocked
        if not data.is_blocked:
            user.blocked_until = None
            user.failed_attempts = 0
        else:
            user.blocked_until = None
    if data.password:
        user.hashed_password = get_password_hash(data.password)

    db.commit()
    db.refresh(user)

    log_activity(
        db=db,
        user_id=current_admin.id,
        user_login=current_admin.login,
        user_role=current_admin.role,
        action="user.admin_update",
        entity_type="user",
        entity_id=user.id,
        details=f"Администратор «{current_admin.login}» изменил профиль «{user.login}» (роль: {user.role}, заблокирован: {user.is_blocked})",
    )

    return UserResponse.model_validate(user)

@router.post("/users/{user_id}/unblock", response_model=MessageResponse)
def unblock_user(
    user_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(require_admin)],
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")

    user.is_blocked = False
    user.blocked_until = None
    user.failed_attempts = 0
    db.commit()

    log_activity(
        db=db,
        user_id=_.id,
        user_login=_.login,
        user_role=_.role,
        action="user.unblock",
        entity_type="user",
        entity_id=user.id,
        details=f"Администратор «{_.login}» снял блокировку с пользователя «{user.login}»",
    )

    return MessageResponse(message=f"Пользователь «{user.login}» успешно разблокирован.")
