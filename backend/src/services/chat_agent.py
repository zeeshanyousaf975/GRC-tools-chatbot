from typing import List, Dict, Any, Optional
from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager
from loguru import logger
from tenacity import retry, stop_after_attempt, wait_exponential
from ..core.config import settings

class ChatAgentService:
    def __init__(self):
        self.config_list = [
            {
                "model": settings.GROQ_MODEL,
                "api_key": settings.GROQ_API_KEY,
                "base_url": settings.GROQ_API_BASE_URL,
            }
        ]
        
        try:
            # Initialize the agents
            self.assistant = AssistantAgent(
                name="assistant",
                llm_config={"config_list": self.config_list},
                system_message="You are a GRC (Governance, Risk, and Compliance) expert assistant. "
                            "You help users with questions about governance, risk management, and compliance. "
                            "You provide accurate, detailed, and professional responses."
            )
            
            self.user_proxy = UserProxyAgent(
                name="user_proxy",
                human_input_mode="NEVER",
                max_consecutive_auto_reply=10,
                code_execution_config={"work_dir": settings.WORK_DIR},
            )
            
            # Initialize group chat
            self.groupchat = GroupChat(
                agents=[self.user_proxy, self.assistant],
                messages=[],
                max_round=settings.MAX_CONVERSATION_ROUNDS
            )
            
            self.manager = GroupChatManager(
                groupchat=self.groupchat,
                llm_config={"config_list": self.config_list}
            )
            
            logger.info("ChatAgent service initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize ChatAgent service: {str(e)}")
            raise

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        reraise=True
    )
    async def process_message(self, message: str) -> Dict[str, Any]:
        try:
            logger.info(f"Processing message: {message}")
            
            if not message or not isinstance(message, str):
                raise ValueError("Invalid message format")
            
            # Start the conversation
            self.user_proxy.initiate_chat(
                self.manager,
                message=message
            )
            
            if not self.groupchat.messages:
                raise RuntimeError("No messages in conversation")
            
            # Get the last message from the assistant
            last_message = self.groupchat.messages[-1]
            
            response = {
                "content": last_message["content"],
                "role": last_message["role"],
                "timestamp": last_message.get("timestamp", ""),
            }
            
            logger.info("Message processed successfully")
            return response
            
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            raise

    def get_chat_history(self) -> List[Dict[str, Any]]:
        try:
            logger.info("Retrieving chat history")
            
            if not self.groupchat.messages:
                return []
            
            history = [
                {
                    "content": msg["content"],
                    "role": msg["role"],
                    "timestamp": msg.get("timestamp", ""),
                }
                for msg in self.groupchat.messages
            ]
            
            logger.info(f"Retrieved {len(history)} messages from chat history")
            return history
            
        except Exception as e:
            logger.error(f"Error retrieving chat history: {str(e)}")
            raise 