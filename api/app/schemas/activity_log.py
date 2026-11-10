from datetime import datetime

from pydantic import BaseModel, ConfigDict

class ActivityLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int | None = None
    user_login: str
    user_role: str
    action: str
    entity_type: str
    entity_id: str | None = None
    details: str
    status: str
    ip_address: str | None = None
    created_at: datetime

class ActivityLogListResponse(BaseModel):
    items: list[ActivityLogRead]
    total: int
    page: int
    limit: int
    total_pages: int
