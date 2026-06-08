from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response
from time import monotonic


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limit: int = 120, window_seconds: int = 60):
        super().__init__(app)
        self.limit = limit
        self.window_seconds = window_seconds
        self.hits: dict[str, list[float]] = {}

    async def dispatch(self, request: Request, call_next) -> Response:
        key = request.client.host if request.client else "anonymous"
        now = monotonic()
        window_start = now - self.window_seconds
        recent = [hit for hit in self.hits.get(key, []) if hit > window_start]
        if len(recent) >= self.limit:
            return JSONResponse({"detail": "Rate limit exceeded"}, status_code=429)
        recent.append(now)
        self.hits[key] = recent
        return await call_next(request)

