from datetime import datetime, timezone
from uuid import uuid4
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase


async def evaluate_query(database: AsyncIOMotorDatabase, query_id: str) -> dict:
    query = await database.queries.find_one({"_id": query_id})
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")
    has_citations = bool(query.get("citations"))
    answer_words = len(query.get("answer", "").split())
    result = {
        "_id": str(uuid4()),
        "query_id": query_id,
        "faithfulness": 0.86 if has_citations else 0.35,
        "context_precision": 0.82 if has_citations else 0.2,
        "context_recall": 0.78 if has_citations else 0.2,
        "answer_relevancy": min(0.95, max(0.4, answer_words / 120)),
        "hallucination_risk": 0.14 if has_citations else 0.65,
        "retrieval_quality": 0.8 if has_citations else 0.25,
        "created_at": datetime.now(timezone.utc),
    }
    await database.evaluations.insert_one(result)
    return result

