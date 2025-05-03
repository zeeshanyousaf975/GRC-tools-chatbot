from pydantic_settings import BaseSettings
from typing import Optional
from app.core.logger import config_logger
import os
import traceback
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "GRC Chatbot"
    
    # LLM API Settings
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_API_BASE: str = "https://api.groq.com/openai/v1"
    MODEL_NAME: str = "llama-3.3-70b-versatile"
    
    # AutoGen Settings
    AUTOGEN_CONFIG_LIST: list = [
        {
            "model": MODEL_NAME,
            "api_key": GROQ_API_KEY,
            "base_url": GROQ_API_BASE,
        }
    ]
    
    # Chat Settings
    MAX_TOKENS: int = 4096
    TEMPERATURE: float = 0.7
    
    # Logging Settings
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE: str = "logs/grc_chatbot.log"
    LOG_MAX_BYTES: int = 10 * 1024 * 1024  # 10MB
    LOG_BACKUP_COUNT: int = 5
    
    class Config:
        case_sensitive = True
        env_file = ".env"

try:
    settings = Settings()
    if not settings.GROQ_API_KEY:
        config_logger.error("GROQ_API_KEY is not set in environment variables")
        raise ValueError("GROQ_API_KEY environment variable is required")
    config_logger.info("Configuration loaded successfully")
except Exception as e:
    config_logger.error(
        "Failed to load configuration",
        error=str(e),
        traceback=traceback.format_exc()
    )
    raise 