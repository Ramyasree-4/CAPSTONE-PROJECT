from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.domain import AuditEvent, SecurityEvent


async def audit(database: AsyncIOMotorDatabase, event: AuditEvent) -> None:
    await database.audit_logs.insert_one(event.model_dump())


async def security_log(database: AsyncIOMotorDatabase, event: SecurityEvent) -> None:
    await database.security_logs.insert_one(event.model_dump())

