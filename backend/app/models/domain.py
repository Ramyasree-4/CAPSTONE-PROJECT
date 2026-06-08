from datetime import datetime, timezone
from pydantic import BaseModel, Field


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class AuditEvent(BaseModel):
    actor_id: str | None = None
    action: str
    resource_type: str
    resource_id: str | None = None
    metadata: dict = Field(default_factory=dict)
    ip_address: str | None = None
    created_at: datetime = Field(default_factory=utc_now)


class SecurityEvent(BaseModel):
    actor_id: str | None = None
    event_type: str
    severity: str = "info"
    details: dict = Field(default_factory=dict)
    ip_address: str | None = None
    created_at: datetime = Field(default_factory=utc_now)

