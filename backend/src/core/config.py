from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "GRC Chatbot"
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000"]
    
    # Groq API Settings
    GROQ_API_KEY: str
    GROQ_API_BASE_URL: str = "https://api.groq.com/openai/v1"
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    # Chat Agent Settings
    MAX_CONVERSATION_ROUNDS: int = 50
    WORK_DIR: str = "workspace"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings() 