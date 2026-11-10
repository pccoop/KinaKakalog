import math
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_admin
from app.core.activity_logger import log_activity
from app.models.movie import Movie
from app.models.user import User
from app.schemas.auth import MessageResponse
from app.schemas.movie import MovieCreate, MovieListResponse, MovieRead, MovieUpdate

router = APIRouter(prefix="/movies", tags=["movies"])

_cached_genres: list[str] | None = None

def _invalidate_genres_cache() -> None:
    global _cached_genres
    _cached_genres = None

def _extract_available_genres(db: Session) -> list[str]:
    global _cached_genres
    if _cached_genres is not None:
        return _cached_genres
    genres_rows = db.scalars(select(Movie.genres)).all()
    unique_genres: set[str] = set()
    for row in genres_rows:
        if row:
            for g in row.split(","):
                cleaned = g.strip()
                if cleaned:
                    unique_genres.add(cleaned)
    _cached_genres = sorted(unique_genres)
    return _cached_genres

@router.get("/genres", response_model=list[str])
def get_genres(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_user)],
):
    return _extract_available_genres(db)

@router.get("", response_model=MovieListResponse)
def list_movies(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_user)],
    search: str | None = Query(default=None, description="Поиск по названию или режиссёру"),
    genre: str | None = Query(default=None, description="Фильтр по жанру"),
    year_from: int | None = Query(default=None, ge=1895, le=2100),
    year_to: int | None = Query(default=None, ge=1895, le=2100),
    min_rating: float | None = Query(default=None, ge=0.0, le=10.0),
    sort_by: str = Query(
        default="rating_desc",
        description="Сортировка: rating_desc, rating_asc, year_desc, year_asc, title_asc",
    ),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=100),
):
    query = select(Movie)

    if search:
        search_term = f"%{search.strip().lower()}%"
        query = query.filter(
            func.lower(Movie.title).like(search_term)
            | func.lower(Movie.original_title).like(search_term)
            | func.lower(Movie.director).like(search_term)
        )

    if genre and genre.strip():
        genre_term = f"%{genre.strip().lower()}%"
        query = query.filter(func.lower(Movie.genres).like(genre_term))

    if year_from is not None:
        query = query.filter(Movie.year >= year_from)

    if year_to is not None:
        query = query.filter(Movie.year <= year_to)

    if min_rating is not None:
        query = query.filter(Movie.rating >= min_rating)

    if sort_by == "rating_asc":
        query = query.order_by(Movie.rating.asc(), Movie.id.desc())
    elif sort_by == "year_desc":
        query = query.order_by(Movie.year.desc(), Movie.rating.desc())
    elif sort_by == "year_asc":
        query = query.order_by(Movie.year.asc(), Movie.rating.desc())
    elif sort_by == "title_asc":
        query = query.order_by(Movie.title.asc())
    else:
        query = query.order_by(Movie.rating.desc(), Movie.id.desc())

    count_query = select(func.count()).select_from(query.subquery())
    total = db.scalar(count_query) or 0

    offset = (page - 1) * limit
    paginated_query = query.offset(offset).limit(limit)
    items = db.scalars(paginated_query).all()

    total_pages = max(1, math.ceil(total / limit))
    available_genres = _extract_available_genres(db)

    return MovieListResponse(
        items=[MovieRead.model_validate(m) for m in items],
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
        available_genres=available_genres,
    )

@router.get("/{movie_id}", response_model=MovieRead)
def get_movie(
    movie_id: int,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(get_current_user)],
):
    movie = db.get(Movie, movie_id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Фильм не найден",
        )
    return MovieRead.model_validate(movie)

@router.post("", response_model=MovieRead, status_code=status.HTTP_201_CREATED)
def create_movie(
    data: MovieCreate,
    current_admin: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
):
    movie = Movie(
        title=data.title.strip(),
        original_title=data.original_title.strip() if data.original_title else None,
        description=data.description.strip(),
        year=data.year,
        director=data.director.strip(),
        genres=data.genres.strip(),
        country=data.country.strip() if data.country else None,
        duration_minutes=data.duration_minutes,
        rating=round(data.rating, 1),
        age_rating=data.age_rating.strip(),
        poster_url=data.poster_url.strip() if data.poster_url else None,
    )
    db.add(movie)
    db.commit()
    db.refresh(movie)
    _invalidate_genres_cache()
    _invalidate_genres_cache()

    log_activity(
        db=db,
        user_id=current_admin.id,
        user_login=current_admin.login,
        user_role=current_admin.role,
        action="movie.create",
        entity_type="movie",
        entity_id=movie.id,
        details=f"Добавлен фильм «{movie.title}» ({movie.year})",
    )

    return MovieRead.model_validate(movie)

@router.put("/{movie_id}", response_model=MovieRead)
def update_movie(
    movie_id: int,
    data: MovieUpdate,
    current_admin: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
):
    movie = db.get(Movie, movie_id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Фильм не найден",
        )

    update_dict = data.model_dump(exclude_unset=True)
    nullable_fields = {"original_title", "country", "poster_url"}
    for field, val in update_dict.items():
        if val is None and field in nullable_fields:
            setattr(movie, field, None)
        elif isinstance(val, str):
            clean_str = val.strip()
            setattr(movie, field, clean_str if (clean_str or field not in nullable_fields) else None)
        elif val is not None:
            setattr(movie, field, val)

    db.commit()
    db.refresh(movie)
    _invalidate_genres_cache()

    log_activity(
        db=db,
        user_id=current_admin.id,
        user_login=current_admin.login,
        user_role=current_admin.role,
        action="movie.update",
        entity_type="movie",
        entity_id=movie.id,
        details=f"Обновлены данные фильма «{movie.title}» (ID {movie.id})",
    )

    return MovieRead.model_validate(movie)

@router.delete("/{movie_id}", response_model=MessageResponse)
def delete_movie(
    movie_id: int,
    current_admin: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
):
    movie = db.get(Movie, movie_id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Фильм не найден",
        )

    title_snapshot = movie.title
    db.delete(movie)
    db.commit()
    _invalidate_genres_cache()

    log_activity(
        db=db,
        user_id=current_admin.id,
        user_login=current_admin.login,
        user_role=current_admin.role,
        action="movie.delete",
        entity_type="movie",
        entity_id=movie_id,
        details=f"Удалён фильм «{title_snapshot}» (ID {movie_id})",
    )

    return MessageResponse(message=f"Фильм «{title_snapshot}» успешно удалён.")
