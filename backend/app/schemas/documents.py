from pydantic import BaseModel, Field


class DocumentMetadata(BaseModel):
    department: str | None = None
    category: str | None = None
    tags: list[str] = Field(default_factory=list)
    chunking_strategy: str = "recursive"


class DocumentUpdate(BaseModel):
    department: str | None = None
    category: str | None = None
    tags: list[str] | None = None

