from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.v1.deps import db, require_permission
from app.core.permissions import Permission
from app.core.serialization import serialize_mongo
from app.services.evaluation import evaluate_query

router = APIRouter(dependencies=[Depends(require_permission(Permission.EVALUATION_ACCESS))])


@router.post("/{query_id}")
async def run(query_id: str, database: AsyncIOMotorDatabase = Depends(db)):
    return await evaluate_query(database, query_id)


@router.get("")
async def list_results(database: AsyncIOMotorDatabase = Depends(db)):
    rows = await database.evaluations.find({}).sort("created_at", -1).limit(200).to_list(200)
    return serialize_mongo(rows)
