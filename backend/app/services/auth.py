from datetime import datetime, timezone
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.permissions import Role
from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse


async def register(database: AsyncIOMotorDatabase, payload: RegisterRequest) -> dict:
    existing = await database.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=409, detail="User already exists")
    user = {
        "email": payload.email,
        "hashed_password": hash_password(payload.password),
        "full_name": payload.full_name,
        "department": payload.department,
        "role": Role.USER.value,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    result = await database.users.insert_one(user)
    user["id"] = str(result.inserted_id)
    user.pop("hashed_password")
    return user


async def login(database: AsyncIOMotorDatabase, payload: LoginRequest) -> TokenResponse:
    user = await database.users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await database.users.update_one({"_id": user["_id"]}, {"$set": {"last_login_at": datetime.now(timezone.utc)}})
    return TokenResponse(
        access_token=create_access_token(user["email"], user["role"]),
        refresh_token=create_refresh_token(user["email"]),
    )


async def refresh(database: AsyncIOMotorDatabase, refresh_token: str) -> TokenResponse:
    try:
        payload = decode_token(refresh_token, expected_type="refresh")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = await database.users.find_one({"email": payload["sub"]})
    if not user:
        raise HTTPException(status_code=401, detail="Unknown user")
    return TokenResponse(
        access_token=create_access_token(user["email"], user["role"]),
        refresh_token=create_refresh_token(user["email"]),
    )

