from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "Enterprise RAG Platform"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = Field(default="change-me-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 14
    CORS_ORIGINS: list[str] = ["http://localhost:3004"]

    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "enterprise_rag"
    CHROMA_PERSIST_DIR: str = "./chroma"
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_MB: int = 50

    MISTRAL_API_KEY: str | None = None
    MISTRAL_MODEL: str = "mistral-large-latest"
    LLM_FALLBACK_ORDER: list[str] = ["mistral"]
    LANGSMITH_TRACING: bool = False
    LANGSMITH_API_KEY: str | None = None
    LANGSMITH_PROJECT: str = "enterprise-rag-platform"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
