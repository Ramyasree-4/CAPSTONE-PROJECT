from datetime import datetime, timezone
from uuid import uuid4
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.v1.deps import current_user, db
from app.schemas.feedback import FeedbackRequest

router = APIRouter()


@router.post("")
async def submit(payload: FeedbackRequest, database: AsyncIOMotorDatabase = Depends(db), user: dict = Depends(current_user)):
    record = payload.model_dump()
    record.update({"_id": str(uuid4()), "user_id": user["id"], "created_at": datetime.now(timezone.utc)})
    await database.feedback.insert_one(record)
    return {"status": "recorded"}


@router.get("/analytics")
async def feedback_analytics(database: AsyncIOMotorDatabase = Depends(db)):
    likes = await database.feedback.count_documents({"rating": "like"})
    dislikes = await database.feedback.count_documents({"rating": "dislike"})
    return {"likes": likes, "dislikes": dislikes, "total": likes + dislikes}

