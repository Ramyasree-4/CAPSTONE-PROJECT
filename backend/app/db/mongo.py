from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URI)


def get_database() -> AsyncIOMotorDatabase:
    return client[settings.MONGODB_DB]

