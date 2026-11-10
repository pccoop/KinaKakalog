import re
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core.config import settings

def validate_password_complexity(value: str) -> str:
    if len(value) < 8:
        raise ValueError("Пароль должен содержать не менее 8 символов")
    if len(value) > 72:
        raise ValueError("Пароль не должен превышать 72 символа")
    if not re.search(r"[a-zа-яё]", value):
        raise ValueError("Пароль должен содержать хотя бы одну строчную букву")
    if not re.search(r"[A-ZА-ЯЁ]", value):
        raise ValueError("Пароль должен содержать хотя бы одну заглавную букву")
    if not re.search(r"\d", value):
        raise ValueError("Пароль должен содержать хотя бы одну цифру")
    if not re.search(r"[^a-zA-Z0-9а-яА-ЯёЁ\s]", value):
        raise ValueError("Пароль должен содержать хотя бы один специальный символ (например, !@#$%^&*)")
    return value

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    login: str
    name: str
    email: str | None = None
    role: str
    is_blocked: bool
    blocked_until: datetime | None = None
    failed_attempts: int
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    message: str = settings.msg_success_login
    user: UserResponse

class UserRegisterRequest(BaseModel):
    login: str = Field(min_length=1, max_length=100)
    name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=72)
    email: str | None = None

    @field_validator("password")
    @classmethod
    def check_password(cls, v: str) -> str:
        return validate_password_complexity(v)

class UserLoginRequest(BaseModel):
    login: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=1, max_length=72)
    captcha_verified: bool = False

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ChangePasswordRequest(BaseModel):
    old_password: str = Field(min_length=1, max_length=72)
    new_password: str = Field(min_length=8, max_length=72)

    @field_validator("new_password")
    @classmethod
    def check_new_password(cls, v: str) -> str:
        return validate_password_complexity(v)

class MessageResponse(BaseModel):
    message: str

class AdminCreateUserRequest(BaseModel):
    login: str = Field(min_length=1, max_length=100)
    name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=72)
    role: str = Field(default=settings.role_user, pattern=r"^(Администратор|Пользователь)$")

    @field_validator("password")
    @classmethod
    def check_password(cls, v: str) -> str:
        return validate_password_complexity(v)

class AdminUpdateUserRequest(BaseModel):
    name: str | None = Field(default=None, max_length=100)
    role: str | None = Field(default=None, pattern=r"^(Администратор|Пользователь)$")
    is_blocked: bool | None = None
    password: str | None = Field(default=None, max_length=72)

    @field_validator("password")
    @classmethod
    def check_password(cls, v: str | None) -> str | None:
        if v:
            return validate_password_complexity(v)
        return v
