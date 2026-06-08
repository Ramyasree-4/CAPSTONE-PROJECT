from app.core.config import settings


class VectorStore:
    def __init__(self) -> None:
        self.persist_dir = settings.CHROMA_PERSIST_DIR
        self._memory: list[dict] = []

    async def upsert_chunks(self, chunks: list[dict]) -> None:
        self._memory.extend(chunks)

    async def search(self, query: str, filters: dict | None = None, limit: int = 5) -> list[dict]:
        filters = filters or {}
        terms = set(query.lower().split())
        scored = []
        for chunk in self._memory:
            metadata = chunk.get("metadata", {})
            if any(metadata.get(k) != v for k, v in filters.items()):
                continue
            text = chunk.get("text", "")
            score = len(terms.intersection(text.lower().split())) / max(len(terms), 1)
            scored.append({**chunk, "score": score})
        return sorted(scored, key=lambda item: item["score"], reverse=True)[:limit]


vector_store = VectorStore()

