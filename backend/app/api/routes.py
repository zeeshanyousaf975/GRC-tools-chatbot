from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Any
from app.services.autogen_service import AutoGenService
from app.core.logger import api_logger
import traceback
import json

router = APIRouter()
autogen_service = AutoGenService()

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class ChatHistory(BaseModel):
    messages: List[Dict[str, Any]]

@router.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage, request: Request):
    """
    Process a chat message and return the response
    """
    api_logger.info(
        "Received chat request",
        message_length=len(message.message),
        client_ip=request.client.host
    )
    
    try:
        # Get response from AutoGen
        response = await autogen_service.process_message(message.message)
        
        if not response:
            api_logger.warning("Empty response received from AutoGen service")
            response = "I apologize, but I couldn't generate a response. Please try again."
        
        api_logger.info(
            "Chat request processed successfully",
            response_length=len(response),
            response_preview=response[:100] if response else ""
        )
        
        # Create the response object
        chat_response = ChatResponse(response=response)
        
        # Log the full response for debugging
        api_logger.info(
            "Preparing response payload",
            response_type=type(chat_response).__name__,
            response_dict=chat_response.dict(),
            response_json=json.dumps(chat_response.dict())
        )
        
        return chat_response
    except Exception as e:
        api_logger.error(
            "Error processing chat request",
            error=str(e),
            traceback=traceback.format_exc(),
            client_ip=request.client.host
        )
        raise HTTPException(
            status_code=500,
            detail=f"Error processing message: {str(e)}"
        )

@router.get("/chat/history", response_model=ChatHistory)
async def get_chat_history(request: Request):
    """
    Get the chat history
    """
    api_logger.info(
        "Received chat history request",
        client_ip=request.client.host
    )
    
    try:
        messages = autogen_service.get_chat_history()
        api_logger.info(
            "Chat history retrieved successfully",
            message_count=len(messages)
        )
        return ChatHistory(messages=messages)
    except Exception as e:
        api_logger.error(
            "Error retrieving chat history",
            error=str(e),
            traceback=traceback.format_exc(),
            client_ip=request.client.host
        )
        raise HTTPException(
            status_code=500,
            detail="An error occurred while retrieving chat history"
        )

class ClearHistoryResponse(BaseModel):
    success: bool
    message: str

@router.post("/chat/clear", response_model=ClearHistoryResponse)
async def clear_chat_history(request: Request):
    """
    Clear the chat history and reset the conversation
    """
    api_logger.info(
        "Received clear chat history request",
        client_ip=request.client.host
    )
    
    try:
        success = autogen_service.clear_chat_history()
        
        if success:
            api_logger.info("Chat history cleared successfully")
            return ClearHistoryResponse(
                success=True,
                message="Chat history cleared successfully"
            )
        else:
            api_logger.warning("Failed to clear chat history")
            return ClearHistoryResponse(
                success=False,
                message="Failed to clear chat history"
            )
    except Exception as e:
        api_logger.error(
            "Error clearing chat history",
            error=str(e),
            traceback=traceback.format_exc(),
            client_ip=request.client.host
        )
        raise HTTPException(
            status_code=500,
            detail="An error occurred while clearing chat history"
        ) 