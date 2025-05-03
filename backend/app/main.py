from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.routes import router as api_router
from app.core.logger import api_logger
import time
import traceback

app = FastAPI(
    title="GRC Chatbot API",
    description="API for GRC Chatbot using AutoGen and Groq LLM",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    api_logger.info(
        "Request processed",
        method=request.method,
        url=str(request.url),
        status_code=response.status_code,
        process_time=process_time
    )
    
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    api_logger.error(
        "Unhandled exception occurred",
        error=str(exc),
        traceback=traceback.format_exc(),
        path=request.url.path,
        method=request.method
    )
    
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred"}
    )

@app.get("/")
async def root():
    api_logger.info("Root endpoint accessed")
    return {"message": "GRC Chatbot API is running"} 