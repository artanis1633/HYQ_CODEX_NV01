from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    LLM_API_KEY: str = ""
    LLM_BASE_URL: str = ""
    LLM_MODEL: str = ""
    LLM_TEMPERATURE: float = 0.2
    LLM_MAX_TOKENS: int = 1200

    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4-1106-preview"
    OPENAI_TEMPERATURE: float = 0.7
    OPENAI_MAX_TOKENS: int = 2000

    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True

    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    DATABASE_URL: str = "sqlite:///./nvidia_configurator.db"

    CHROMA_PERSIST_DIR: str = "./chroma_db"
    CHROMA_COLLECTION_NAME: str = "nvidia_knowledge_base"

    KNOWLEDGE_BASE_DIR: str = "./knowledge_base/source_documents"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def effective_llm_api_key(self) -> str:
        return self.LLM_API_KEY or self.OPENAI_API_KEY

    @property
    def effective_llm_base_url(self) -> str:
        return self.LLM_BASE_URL or "https://api.openai.com/v1"

    @property
    def effective_llm_model(self) -> str:
        return self.LLM_MODEL or self.OPENAI_MODEL

    @property
    def effective_llm_temperature(self) -> float:
        return self.LLM_TEMPERATURE if self.LLM_API_KEY else self.OPENAI_TEMPERATURE

    @property
    def effective_llm_max_tokens(self) -> int:
        return self.LLM_MAX_TOKENS if self.LLM_API_KEY else self.OPENAI_MAX_TOKENS

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
