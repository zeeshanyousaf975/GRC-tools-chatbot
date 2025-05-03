from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from loguru import logger

from ..services.chat_agent import ChatAgentService

router = APIRouter()
chat_agent = ChatAgentService()

class MessageRequest(BaseModel):
    message: str

class MessageResponse(BaseModel):
    content: str
    role: str
    timestamp: str

class ChatHistoryResponse(BaseModel):
    messages: List[Dict[str, Any]]

@router.post("/chat", response_model=MessageResponse)
async def chat(request: MessageRequest):
    try:
        logger.info(f"Received chat request: {request.message}")
        response = await chat_agent.process_message(request.message)
        return MessageResponse(**response)
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat/history", response_model=ChatHistoryResponse)
async def get_chat_history():
    try:
        logger.info("Received request for chat history")
        history = chat_agent.get_chat_history()
        return ChatHistoryResponse(messages=history)
    except Exception as e:
        logger.error(f"Error in chat history endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 