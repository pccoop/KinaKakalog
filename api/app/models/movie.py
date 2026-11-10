from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

class Movie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    original_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    year: Mapped[int] = mapped_column(Integer, index=True, nullable=False)
    director: Mapped[str] = mapped_column(String(255), nullable=False)
    genres: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    country: Mapped[str | None] = mapped_column(String(100), nullable=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=120, nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=7.0, index=True, nullable=False)
    age_rating: Mapped[str] = mapped_column(String(10), default="16+", nullable=False)
    poster_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )
