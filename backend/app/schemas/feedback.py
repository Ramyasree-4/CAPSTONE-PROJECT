from pydantic import BaseModel, Field


class FeedbackRequest(BaseModel):
    query_id: str
    rating: str = Field(pattern="^(like|dislike)$")
    category: str | None = None
    comment: str | None = None

