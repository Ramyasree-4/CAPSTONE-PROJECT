from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.permissions import Permission, has_permission
from app.core.security import decode_token
from app.db.mongo import get_database

bearer = HTTPBearer(auto_error=False)


async def db() -> AsyncIOMotorDatabase:
    return get_database()


async def current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    database: AsyncIOMotorDatabase = Depends(db),
) -> dict:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing credentials")
    try:
        payload = decode_token(credentials.credentials)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    user = await database.users.find_one({"email": payload["sub"]})
    if not user or not user.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user")
    user["id"] = str(user["_id"])
    return user


def require_permission(permission: Permission):
    async def dependency(user: dict = Depends(current_user)) -> dict:
        if not has_permission(user.get("role", ""), permission):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permission")
        return user

    return dependency

