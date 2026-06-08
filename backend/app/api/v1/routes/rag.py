from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.v1.deps import current_user, db
from app.core.serialization import serialize_mongo
from app.schemas.rag import ChatRequest, ChatResponse
from app.services.rag import chat

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def rag_chat(payload: ChatRequest, database: AsyncIOMotorDatabase = Depends(db), user: dict = Depends(current_user)):
    return await chat(database, payload, user)


@router.get("/conversations")
async def conversations(database: AsyncIOMotorDatabase = Depends(db), user: dict = Depends(current_user)):
    ids = await database.queries.distinct("conversation_id", {"user_id": user["id"]})
    return [{"id": item} for item in ids]


@router.get("/conversations/{conversation_id}")
async def conversation(conversation_id: str, database: AsyncIOMotorDatabase = Depends(db), user: dict = Depends(current_user)):
    rows = await database.queries.find({"conversation_id": conversation_id, "user_id": user["id"]}).to_list(200)
    return serialize_mongo(rows)


@router.get("/queries/{query_id}/export")
async def export_query(query_id: str, database: AsyncIOMotorDatabase = Depends(db), user: dict = Depends(current_user)):
    return serialize_mongo(await database.queries.find_one({"_id": query_id, "user_id": user["id"]}))
