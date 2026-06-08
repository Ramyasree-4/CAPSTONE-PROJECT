from datetime import datetime, timezone
from time import perf_counter
from uuid import uuid4
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.vector import vector_store
from app.schemas.rag import ChatRequest, ChatResponse, Citation
from app.services.llm_gateway import llm_gateway

INJECTION_PATTERNS = ["ignore previous", "system prompt", "developer message", "reveal secrets"]


def detect_prompt_injection(text: str) -> bool:
    lowered = text.lower()
    return any(pattern in lowered for pattern in INJECTION_PATTERNS)


async def chat(database: AsyncIOMotorDatabase, payload: ChatRequest, user: dict) -> ChatResponse:
    if detect_prompt_injection(payload.question):
        await database.security_logs.insert_one(
            {
                "actor_id": user["id"],
                "event_type": "prompt_injection_detected",
                "severity": "warning",
                "details": {"question": payload.question[:500]},
                "created_at": datetime.now(timezone.utc),
            }
        )
        raise HTTPException(status_code=400, detail="Potential prompt injection detected")

    started = perf_counter()
    chunks = await vector_store.search(payload.question, filters=payload.filters, limit=5)
    citations = [
        Citation(
            document_id=chunk["document_id"],
            filename=chunk["metadata"].get("filename", "Unknown"),
            chunk_index=chunk["chunk_index"],
            score=round(float(chunk.get("score", 0)), 3),
        )
        for chunk in chunks
    ]
    context = "\n\n".join(chunk["text"] for chunk in chunks)
    llm_result = await llm_gateway.generate(payload.question, context, payload.model)
    answer = llm_result.answer
    latency_ms = int((perf_counter() - started) * 1000)
    token_usage = llm_result.token_usage or {"prompt_tokens": len(context.split()), "completion_tokens": len(answer.split())}
    actual_model = f"{llm_result.provider}:{llm_result.model}"
    cost_estimate = estimate_cost(actual_model, token_usage)
    query_id = str(uuid4())
    record = {
        "_id": query_id,
        "conversation_id": payload.conversation_id or str(uuid4()),
        "user_id": user["id"],
        "question": payload.question,
        "answer": answer,
        "citations": [citation.model_dump() for citation in citations],
        "retrieved_chunks": chunks,
        "requested_model": payload.model,
        "model": actual_model,
        "fallback_used": llm_result.fallback_used,
        "latency_ms": latency_ms,
        "token_usage": token_usage,
        "cost_estimate": cost_estimate,
        "created_at": datetime.now(timezone.utc),
    }
    await database.queries.insert_one(record)
    return ChatResponse(
        query_id=query_id,
        answer=answer,
        citations=citations,
        retrieved_chunks=chunks,
        latency_ms=latency_ms,
        token_usage=token_usage,
        cost_estimate=cost_estimate,
    )


def estimate_cost(model: str, token_usage: dict) -> float:
    total = token_usage["prompt_tokens"] + token_usage["completion_tokens"]
    rates = {
        "mistral": 0.000004,
        "openai": 0.000005,
        "groq": 0.000001,
        "anthropic": 0.000006,
    }
    provider = model.split(":", 1)[0]
    rate = rates.get(provider, 0.000001)
    return round(total * rate, 6)
