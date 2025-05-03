from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import asyncio
import uvloop

from .api.routes import router
from .core.config import settings

# Use uvloop for better performance
asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

app = FastAPI(
    title="GRC Chatbot API",
    description="API for the GRC Chatbot using AutoGen ChatAgent",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info("Starting GRC Chatbot API server")
    logger.info(f"API version: {settings.API_V1_STR}")
    logger.info(f"Project name: {settings.PROJECT_NAME}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    logger.info("Shutting down GRC Chatbot API server") 