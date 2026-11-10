from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog

def log_activity(
    db: Session,
    action: str,
    entity_type: str,
    details: str,
    user_login: str = "Гость",
    user_role: str = "Гость",
    user_id: int | None = None,
    entity_id: str | int | None = None,
    status: str = "success",
    ip_address: str | None = None,
    commit: bool = True,
) -> ActivityLog:
    log_entry = ActivityLog(
        user_id=user_id,
        user_login=user_login,
        user_role=user_role,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id is not None else None,
        details=details,
        status=status,
        ip_address=ip_address,
    )
    db.add(log_entry)
    if commit:
        db.commit()
        db.refresh(log_entry)
    return log_entry
