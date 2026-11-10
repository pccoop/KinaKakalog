import math
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_admin
from app.models.activity_log import ActivityLog
from app.models.user import User
from app.schemas.activity_log import ActivityLogListResponse, ActivityLogRead

router = APIRouter(prefix="/activity-logs", tags=["activity-logs"])

@router.get("", response_model=ActivityLogListResponse)
def list_activity_logs(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[User, Depends(require_admin)],
    entity_type: str | None = Query(default=None, description="Фильтр по типу сущности (auth, movie, user)"),
    action: str | None = Query(default=None, description="Фильтр по действию"),
    search: str | None = Query(default=None, description="Поиск по логину или деталям"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
):
    query = select(ActivityLog).order_by(desc(ActivityLog.created_at), desc(ActivityLog.id))

    if entity_type and entity_type.strip() and entity_type.lower() != "all":
        query = query.filter(ActivityLog.entity_type == entity_type.strip().lower())

    if action and action.strip():
        query = query.filter(ActivityLog.action == action.strip())

    if search and search.strip():
        term = f"%{search.strip().lower()}%"
        query = query.filter(
            func.lower(ActivityLog.user_login).like(term)
            | func.lower(ActivityLog.details).like(term)
        )

    count_query = select(func.count()).select_from(query.subquery())
    total = db.scalar(count_query) or 0

    offset = (page - 1) * limit
    paginated_query = query.offset(offset).limit(limit)
    items = db.scalars(paginated_query).all()

    total_pages = max(1, math.ceil(total / limit))

    return ActivityLogListResponse(
        items=[ActivityLogRead.model_validate(log) for log in items],
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages,
    )
