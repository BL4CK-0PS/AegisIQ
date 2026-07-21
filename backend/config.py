"""
AegisIQ Backend Configuration

Centralized configuration loaded from environment variables.
"""

from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    app_name: str = "AegisIQ"
    app_version: str = "0.1.0"
    debug: bool = False
    demo_mode: bool = True

    # Database
    database_url: str = "postgresql://aegisiq:aegisiq_dev_2026@localhost:5432/aegisiq"
    postgres_db: str = "aegisiq"
    postgres_user: str = "aegisiq"
    postgres_password: str = "aegisiq_dev_2026"

    # JWT
    jwt_secret: str = "dev-jwt-secret-do-not-use-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 60
    jwt_refresh_expiration_days: int = 30

    # AI Provider
    llm_provider: str = "ollama"
    gemini_api_key: Optional[str] = None
    mistral_api_key: Optional[str] = None
    mistral_model: str = "mistral-large-latest"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3"
    llm_timeout: float = 120.0
    llm_max_retries: int = 3

    # CORS
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost",
    ]

    # Monitoring
    log_level: str = "INFO"
    enable_audit_logging: bool = True

    # Docker-compose env vars (tolerated, not used by backend directly)
    postgres_port: Optional[str] = None
    backend_port: Optional[str] = None
    frontend_port: Optional[str] = None
    vite_api_base_url: Optional[str] = None
    vite_app_name: Optional[str] = None
    nginx_http_port: Optional[str] = None
    nginx_https_port: Optional[str] = None

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }


@lru_cache
def get_settings() -> Settings:
    """Get cached application settings."""
    return Settings()
