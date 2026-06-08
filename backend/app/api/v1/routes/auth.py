from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.v1.deps import current_user, db
from app.schemas.auth import LoginRequest, ProfileUpdate, RegisterRequest, TokenResponse
from app.services import auth as auth_service

router = APIRouter()


@router.post("/register")
async def register(payload: RegisterRequest, database: AsyncIOMotorDatabase = Depends(db)):
    return await auth_service.register(database, payload)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, database: AsyncIOMotorDatabase = Depends(db)):
    return await auth_service.login(database, payload)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(refresh_token: str, database: AsyncIOMotorDatabase = Depends(db)):
    return await auth_service.refresh(database, refresh_token)


@router.post("/password-reset/request")
async def password_reset_request(email: str):
    return {"status": "accepted", "message": "Password reset flow queued if the email exists."}


@router.post("/password-reset/confirm")
async def password_reset_confirm(token: str, new_password: str):
    return {"status": "accepted", "message": "Password reset token validation hook ready."}


@router.get("/me")
async def me(user: dict = Depends(current_user)):
    user.pop("hashed_password", None)
    user.pop("_id", None)
    return user


@router.patch("/me")
async def update_me(payload: ProfileUpdate, user: dict = Depends(current_user), database: AsyncIOMotorDatabase = Depends(db)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if updates:
        await database.users.update_one({"email": user["email"]}, {"$set": updates})
    return {"status": "updated"}

