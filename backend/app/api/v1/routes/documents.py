import json
from fastapi import APIRouter, Depends, File, Form, UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.v1.deps import current_user, db, require_permission
from app.core.permissions import Permission
from app.core.serialization import serialize_mongo
from app.schemas.documents import DocumentUpdate
from app.services.documents import upload_document

router = APIRouter()


@router.post("", dependencies=[Depends(require_permission(Permission.DOCUMENT_UPLOAD))])
async def upload(
    file: UploadFile = File(...),
    metadata: str = Form("{}"),
    database: AsyncIOMotorDatabase = Depends(db),
    user: dict = Depends(current_user),
):
    return await upload_document(database, file, json.loads(metadata), user)


@router.get("")
async def list_documents(q: str | None = None, department: str | None = None, database: AsyncIOMotorDatabase = Depends(db)):
    filters = {}
    if department:
        filters["department"] = department
    if q:
        filters["filename"] = {"$regex": q, "$options": "i"}
    rows = await database.documents.find(filters).sort("created_at", -1).to_list(200)
    return serialize_mongo(rows)


@router.get("/{document_id}")
async def detail(document_id: str, database: AsyncIOMotorDatabase = Depends(db)):
    return serialize_mongo(await database.documents.find_one({"_id": document_id}))


@router.patch("/{document_id}")
async def update(document_id: str, payload: DocumentUpdate, database: AsyncIOMotorDatabase = Depends(db)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    await database.documents.update_one({"_id": document_id}, {"$set": updates})
    return {"status": "updated"}


@router.delete("/{document_id}", dependencies=[Depends(require_permission(Permission.DOCUMENT_DELETE))])
async def delete(document_id: str, database: AsyncIOMotorDatabase = Depends(db)):
    await database.documents.delete_one({"_id": document_id})
    await database.chunks.delete_many({"document_id": document_id})
    return {"status": "deleted"}
