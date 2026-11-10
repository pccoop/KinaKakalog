from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

class MovieBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    original_title: str | None = Field(default=None, max_length=255)
    description: str = Field(..., min_length=1)
    year: int = Field(..., ge=1895, le=2100)
    director: str = Field(..., min_length=1, max_length=255)
    genres: str = Field(..., min_length=1, max_length=255)
    country: str | None = Field(default=None, max_length=100)
    duration_minutes: int = Field(default=120, ge=1, le=1000)
    rating: float = Field(default=7.0, ge=0.0, le=10.0)
    age_rating: str = Field(default="16+", max_length=10)
    poster_url: str | None = Field(default=None, max_length=1000)

class MovieCreate(MovieBase):
    pass

class MovieUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    original_title: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None, min_length=1)
    year: int | None = Field(default=None, ge=1895, le=2100)
    director: str | None = Field(default=None, min_length=1, max_length=255)
    genres: str | None = Field(default=None, min_length=1, max_length=255)
    country: str | None = Field(default=None, max_length=100)
    duration_minutes: int | None = Field(default=None, ge=1, le=1000)
    rating: float | None = Field(default=None, ge=0.0, le=10.0)
    age_rating: str | None = Field(default=None, max_length=10)
    poster_url: str | None = Field(default=None, max_length=1000)

class MovieRead(MovieBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime

class MovieListResponse(BaseModel):
    items: list[MovieRead]
    total: int
    page: int
    limit: int
    total_pages: int
    available_genres: list[str]
