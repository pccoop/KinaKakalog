from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.activity_logger import log_activity
from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    MessageResponse,
    RefreshTokenRequest,
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegisterRequest, db: Annotated[Session, Depends(get_db)]):
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

    user = User(
        login=clean_login,
        name=data.name.strip() or clean_login,
        email=data.email.strip() if data.email else None,
        hashed_password=get_password_hash(data.password),
        role=settings.role_user,
        is_blocked=False,
        failed_attempts=0,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    log_activity(
        db=db,
        user_id=user.id,
        user_login=user.login,
        user_role=user.role,
        action="user.register",
        entity_type="user",
        entity_id=user.id,
        details=f"Самостоятельная регистрация пользователя «{user.login}»",
    )

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        message=settings.msg_success_login,
        user=UserResponse.model_validate(user),
    )

@router.post("/login", response_model=TokenResponse)
def login(data: UserLoginRequest, db: Annotated[Session, Depends(get_db)]):
    clean_login = data.login.strip()
    user = db.scalar(select(User).where(User.login == clean_login))

    if not user:
        log_activity(
            db=db,
            user_login=clean_login,
            user_role="Гость",
            action="auth.login.failed",
            entity_type="auth",
            details=f"Попытка входа с несуществующим логином «{clean_login}»",
            status="failure",
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=settings.msg_invalid_credentials,
        )

    if user.is_blocked:
        now = datetime.now(timezone.utc).replace(tzinfo=None)
        if user.blocked_until is not None:
            if now >= user.blocked_until:
                user.is_blocked = False
                user.blocked_until = None
                user.failed_attempts = 0
                db.commit()
                log_activity(
                    db=db,
                    user_id=user.id,
                    user_login=user.login,
                    user_role=user.role,
                    action="auth.lockout.expired",
                    entity_type="auth",
                    entity_id=user.id,
                    details=f"Срок временной блокировки учётной записи «{user.login}» истёк. Доступ автоматически восстановлен.",
                )
            else:
                remaining_sec = max(1, int((user.blocked_until - now).total_seconds()))
                log_activity(
                    db=db,
                    user_id=user.id,
                    user_login=user.login,
                    user_role=user.role,
                    action="auth.blocked_attempt",
                    entity_type="auth",
                    entity_id=user.id,
                    details=f"Попытка входа во временно заблокированную учётную запись «{user.login}» (осталось {remaining_sec} сек.)",
                    status="failure",
                )
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail={
                        "message": f"Учётная запись временно заблокирована из-за 3 неверных попыток ввода. До окончания блокировки осталось: {remaining_sec} сек.",
                        "code": "TEMPORARY_LOCKOUT",
                        "is_temporary": True,
                        "remaining_seconds": remaining_sec,
                        "blocked_until": user.blocked_until.isoformat(),
                    },
                )
        else:
            log_activity(
                db=db,
                user_id=user.id,
                user_login=user.login,
                user_role=user.role,
                action="auth.blocked_attempt",
                entity_type="auth",
                entity_id=user.id,
                details=f"Попытка входа в заблокированную администратором учётную запись «{user.login}»",
                status="failure",
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=settings.msg_blocked,
            )

    if not data.captcha_verified:
        user.failed_attempts += 1
        if user.failed_attempts >= settings.max_failed_attempts:
            now = datetime.now(timezone.utc).replace(tzinfo=None)
            user.is_blocked = True
            user.blocked_until = now + timedelta(seconds=settings.lockout_duration_seconds)
            db.commit()
            log_activity(
                db=db,
                user_id=user.id,
                user_login=user.login,
                user_role=user.role,
                action="auth.account.locked",
                entity_type="auth",
                entity_id=user.id,
                details=f"Учётная запись «{user.login}» заблокирована на {settings.lockout_duration_seconds} сек. из-за 3 неверных попыток капчи",
                status="failure",
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "message": f"Учётная запись временно заблокирована из-за 3 неверных попыток ввода. До окончания блокировки осталось: {settings.lockout_duration_seconds} сек.",
                    "code": "TEMPORARY_LOCKOUT",
                    "is_temporary": True,
                    "remaining_seconds": settings.lockout_duration_seconds,
                    "blocked_until": user.blocked_until.isoformat(),
                },
            )
        db.commit()
        remaining = settings.max_failed_attempts - user.failed_attempts
        log_activity(
            db=db,
            user_id=user.id,
            user_login=user.login,
            user_role=user.role,
            action="auth.captcha.failed",
            entity_type="auth",
            entity_id=user.id,
            details=f"Неверно собран пазл капчи для «{user.login}» (попытка {user.failed_attempts}/{settings.max_failed_attempts})",
            status="failure",
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Пазл капчи собран неверно. Осталось попыток: {remaining}",
        )

    if not verify_password(data.password, user.hashed_password):
        user.failed_attempts += 1
        if user.failed_attempts >= settings.max_failed_attempts:
            now = datetime.now(timezone.utc).replace(tzinfo=None)
            user.is_blocked = True
            user.blocked_until = now + timedelta(seconds=settings.lockout_duration_seconds)
            db.commit()
            log_activity(
                db=db,
                user_id=user.id,
                user_login=user.login,
                user_role=user.role,
                action="auth.account.locked",
                entity_type="auth",
                entity_id=user.id,
                details=f"Учётная запись «{user.login}» заблокирована на {settings.lockout_duration_seconds} сек. после 3 неудачных попыток ввода пароля",
                status="failure",
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "message": f"Учётная запись временно заблокирована из-за 3 неверных попыток ввода. До окончания блокировки осталось: {settings.lockout_duration_seconds} сек.",
                    "code": "TEMPORARY_LOCKOUT",
                    "is_temporary": True,
                    "remaining_seconds": settings.lockout_duration_seconds,
                    "blocked_until": user.blocked_until.isoformat(),
                },
            )
        db.commit()
        remaining = settings.max_failed_attempts - user.failed_attempts
        log_activity(
            db=db,
            user_id=user.id,
            user_login=user.login,
            user_role=user.role,
            action="auth.login.failed",
            entity_type="auth",
            entity_id=user.id,
            details=f"Неверный пароль для «{user.login}» (попытка {user.failed_attempts}/{settings.max_failed_attempts})",
            status="failure",
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=settings.msg_invalid_credentials,
        )

    user.failed_attempts = 0
    user.is_blocked = False
    user.blocked_until = None
    db.commit()

    log_activity(
        db=db,
        user_id=user.id,
        user_login=user.login,
        user_role=user.role,
        action="auth.login.success",
        entity_type="auth",
        entity_id=user.id,
        details=f"Пользователь «{user.login}» успешно вошёл в систему",
        status="success",
    )

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        message=settings.msg_success_login,
        user=UserResponse.model_validate(user),
    )

@router.post("/refresh", response_model=TokenResponse)
def refresh_token_endpoint(data: RefreshTokenRequest, db: Annotated[Session, Depends(get_db)]):
    payload = decode_token(data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный или просроченный refresh токен",
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверные данные токена",
        )
    try:
        uid = int(user_id)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверные данные токена",
        )
    user = db.get(User, uid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден",
        )

    if user.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=settings.msg_blocked,
        )

    new_access = create_access_token(user.id)
    new_refresh = create_refresh_token(user.id)

    return TokenResponse(
        access_token=new_access,
        refresh_token=new_refresh,
        token_type="bearer",
        message="Токен успешно обновлён",
        user=UserResponse.model_validate(user),
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: Annotated[User, Depends(get_current_user)]):
    return UserResponse.model_validate(current_user)

@router.post("/change-password", response_model=MessageResponse)
def change_password(
    data: ChangePasswordRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if not verify_password(data.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Текущий пароль указан неверно",
        )

    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()

    log_activity(
        db=db,
        user_id=current_user.id,
        user_login=current_user.login,
        user_role=current_user.role,
        action="user.password_change",
        entity_type="user",
        entity_id=current_user.id,
        details=f"Пользователь «{current_user.login}» сменил свой пароль",
    )

    return MessageResponse(message="Пароль успешно изменён")

@router.post("/logout", response_model=MessageResponse)
def logout():
    return MessageResponse(message="Успешный выход из системы.")
