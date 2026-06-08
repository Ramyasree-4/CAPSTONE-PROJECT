from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4
from fastapi import HTTPException, UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.db.vector import vector_store

SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".txt", ".csv", ".pptx"}


async def upload_document(database: AsyncIOMotorDatabase, file: UploadFile, metadata: dict, owner: dict) -> dict:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File is too large")

    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    document_id = str(uuid4())
    storage_path = upload_dir / f"{document_id}{suffix}"
    storage_path.write_bytes(content)
    now = datetime.now(timezone.utc)
    document = {
        "_id": document_id,
        "filename": file.filename,
        "content_type": file.content_type,
        "owner_id": owner["id"],
        "department": metadata.get("department") or owner.get("department"),
        "category": metadata.get("category"),
        "tags": metadata.get("tags", []),
        "version": 1,
        "size_bytes": len(content),
        "status": "processing",
        "storage_path": str(storage_path),
        "created_at": now,
        "updated_at": now,
    }
    await database.documents.insert_one(document)
    chunks = build_chunks(document, content.decode("utf-8", errors="ignore"), metadata.get("chunking_strategy", "recursive"))
    if chunks:
        await database.chunks.insert_many(chunks)
        await vector_store.upsert_chunks(chunks)
    await database.documents.update_one({"_id": document_id}, {"$set": {"status": "ready", "updated_at": now}})
    document["status"] = "ready"
    return document


def build_chunks(document: dict, text: str, strategy: str) -> list[dict]:
    cleaned = " ".join(text.split())
    if not cleaned:
        return []
    size = 900 if strategy in {"recursive", "semantic"} else 700
    overlap = 120 if strategy == "sliding_window" else 0
    chunks = []
    start = 0
    index = 0
    while start < len(cleaned):
        end = min(start + size, len(cleaned))
        chunk_text = cleaned[start:end]
        chunks.append(
            {
                "_id": f"{document['_id']}:{index}",
                "document_id": document["_id"],
                "chunk_index": index,
                "text": chunk_text,
                "metadata": {
                    "filename": document["filename"],
                    "department": document.get("department"),
                    "category": document.get("category"),
                    "tags": document.get("tags", []),
                    "strategy": strategy,
                },
                "embedding_id": f"emb:{document['_id']}:{index}",
                "created_at": datetime.now(timezone.utc),
            }
        )
        index += 1
        start = end - overlap if overlap and end < len(cleaned) else end
    return chunks

