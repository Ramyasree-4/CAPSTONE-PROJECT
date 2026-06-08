from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(min_length=2)
    conversation_id: str | None = None
    model: str = "mistral:mistral-large-latest"
    filters: dict = Field(default_factory=dict)


class Citation(BaseModel):
    document_id: str
    filename: str
    chunk_index: int
    score: float


class ChatResponse(BaseModel):
    query_id: str
    answer: str
    citations: list[Citation]
    retrieved_chunks: list[dict]
    latency_ms: int
    token_usage: dict
    cost_estimate: float
