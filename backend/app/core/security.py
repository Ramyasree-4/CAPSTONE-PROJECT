from datetime import datetime, timedelta, timezone
from typing import Any
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def create_token(subject: str, token_type: str, expires_delta: timedelta, extra: dict[str, Any] | None = None) -> str:
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": subject,
        "type": token_type,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def create_access_token(subject: str, role: str) -> str:
    return create_token(
        subject,
        "access",
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        {"role": role},
    )


def create_refresh_token(subject: str) -> str:
    return create_token(subject, "refresh", timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS))


def decode_token(token: str, expected_type: str = "access") -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise ValueError("Invalid token") from exc
    if payload.get("type") != expected_type:
        raise ValueError("Invalid token type")
    return payload


def mask_secret(value: str | None) -> str | None:
    if value is None or len(value) < 8:
        return None
    return f"{value[:3]}...{value[-3:]}"

