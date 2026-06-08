from fastapi import APIRouter, Depends
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.v1.deps import db, require_permission
from app.core.permissions import Permission
from app.core.serialization import serialize_mongo

router = APIRouter(dependencies=[Depends(require_permission(Permission.USER_MANAGEMENT))])


@router.get("/users")
async def users(database: AsyncIOMotorDatabase = Depends(db)):
    rows = await database.users.find({}, {"hashed_password": 0}).to_list(200)
    for row in rows:
        row["id"] = str(row.pop("_id"))
    return rows


@router.patch("/users/{user_id}/role")
async def update_role(user_id: str, role: str, database: AsyncIOMotorDatabase = Depends(db)):
    lookup = ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id
    await database.users.update_one({"_id": lookup}, {"$set": {"role": role}})
    return {"status": "updated"}


@router.get("/audit-logs")
async def audit_logs(database: AsyncIOMotorDatabase = Depends(db)):
    rows = await database.audit_logs.find({}).sort("created_at", -1).limit(200).to_list(200)
    return serialize_mongo(rows)


@router.get("/security-logs")
async def security_logs(database: AsyncIOMotorDatabase = Depends(db)):
    rows = await database.security_logs.find({}).sort("created_at", -1).limit(200).to_list(200)
    return serialize_mongo(rows)
