from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.v1.deps import db, require_permission
from app.core.permissions import Permission
from app.core.serialization import serialize_mongo
from app.services.analytics import overview

router = APIRouter(dependencies=[Depends(require_permission(Permission.ANALYTICS_ACCESS))])


@router.get("/overview")
async def get_overview(database: AsyncIOMotorDatabase = Depends(db)):
    return await overview(database)


@router.get("/usage")
async def usage(database: AsyncIOMotorDatabase = Depends(db)):
    rows = await database.queries.find({}).sort("created_at", -1).limit(100).to_list(100)
    return serialize_mongo(rows)
