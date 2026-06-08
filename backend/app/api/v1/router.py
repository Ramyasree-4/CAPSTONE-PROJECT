from fastapi import APIRouter

from app.api.v1.routes import admin, analytics, auth, documents, evaluations, feedback, rag

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(rag.router, prefix="/rag", tags=["rag"])
api_router.include_router(evaluations.router, prefix="/evaluations", tags=["evaluations"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

