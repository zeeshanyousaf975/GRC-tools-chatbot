import autogen
from typing import List, Dict, Any
from app.core.config import settings
from app.core.logger import service_logger
import traceback
import json
import asyncio

class MessageCollector:
    def __init__(self):
        self.messages = []
        
    def receive(self, message, sender, request_reply=False, silent=False):
        """
        Method to collect messages from agents
        
        Args:
            message: The message content
            sender: The sender agent
            request_reply: Whether to request a reply
            silent: Whether to be silent
        
        Returns:
            bool: Whether to be silent
        """
        service_logger.info(f"Collected message from {sender.name if hasattr(sender, 'name') else sender}", 
                           content_preview=str(message)[:50] if message else "")
        
        self.messages.append({
            "role": sender.name if hasattr(sender, 'name') else str(sender),
            "content": message
        })
        
        return silent

class AutoGenService:
    def __init__(self):
        service_logger.info("Initializing AutoGenService")
        try:
            self.config_list = settings.AUTOGEN_CONFIG_LIST
            service_logger.debug("AutoGen config loaded", config=self.config_list)
            
            # Initialize chat history
            self.chat_history = []
            
            # Create the message collector
            self.collector = MessageCollector()
            
            llm_config = {
                "config_list": self.config_list,
                "temperature": settings.TEMPERATURE,
                "max_tokens": settings.MAX_TOKENS,
            }
            
            # Define the assistant agent
            self.assistant = autogen.AssistantAgent(
                name="GRC_Assistant",
                llm_config=llm_config,
                system_message="""You are a GRC (Governance, Risk, and Compliance) expert assistant.
                You must ALWAYS respond directly to questions asked.
                When a user asks "what is X" or similar questions, provide a direct answer about X.
                Never ignore the user's query - always address it specifically as your first priority.
                
                Your expertise covers governance frameworks, risk management, compliance requirements,
                security standards, and audit processes. Provide detailed, accurate information on these topics.
                
                Only offer topic suggestions if the user asks for suggestions or doesn't ask a specific question.
                
                Remember: Every user message contains a question or topic they want information about - 
                never assume they didn't ask anything."""
            )
            service_logger.info("Assistant agent initialized", name=self.assistant.name)
            
            # Create the user proxy agent
            self.user_proxy = autogen.UserProxyAgent(
                name="User_Proxy",
                human_input_mode="NEVER",
                max_consecutive_auto_reply=0,
                is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
                code_execution_config=False,
                system_message="You represent the user. Pass their exact questions to the GRC_Assistant."
            )
            service_logger.info("User proxy agent initialized", name=self.user_proxy.name)
            
            # Register the collector to capture all messages
            # We need to connect both agents to properly track the conversation
            self.assistant.register_reply(self.collector.receive, -999)  # Lower number means higher priority
            self.user_proxy.register_reply(self.collector.receive, -999)
            
            # Set up the direct communication between the agents
            self.user_proxy.register_reply(self.assistant, 0)
            
        except Exception as e:
            service_logger.error("Failed to initialize AutoGenService", error=str(e), traceback=traceback.format_exc())
            raise

    async def process_message(self, message: str) -> str:
        """
        Process a user message using AutoGen and return the assistant's response
        """
        service_logger.info(f"Processing new message: '{message[:50]}...'", message_length=len(message))
        try:
            # Reset collector messages for this conversation
            self.collector.messages = []
            service_logger.info("Reset message collector")
            
            # Create a synchronous function to run the chat
            def run_chat():
                try:
                    service_logger.info("Starting chat with message", message_preview=message[:50])
                    # Initiate the chat with the user message
                    self.user_proxy.initiate_chat(
                        self.assistant,
                        message=message
                    )
                    service_logger.info("Chat completed successfully")
                except Exception as e:
                    service_logger.error(f"Error in chat: {str(e)}", traceback=traceback.format_exc())
            
            # Run the chat in a separate thread to not block the async function
            service_logger.info("Running chat in background thread")
            await asyncio.to_thread(run_chat)
            
            # Extract the assistant's response from the collector
            service_logger.info(f"Collected messages: {len(self.collector.messages)}")
            
            # Log all collected messages for debugging
            for idx, msg in enumerate(self.collector.messages):
                service_logger.info(f"Message {idx} - Role: {msg['role']}", content_preview=msg['content'][:50] if isinstance(msg['content'], str) else str(msg['content'])[:50])
            
            # Find the last assistant message
            assistant_messages = [m for m in self.collector.messages if m["role"] == "GRC_Assistant"]
            
            service_logger.info(f"Found {len(assistant_messages)} assistant messages")
            
            if assistant_messages:
                # Get the latest assistant message
                response = assistant_messages[-1]["content"]
                if not isinstance(response, str):
                    response = str(response)
                    
                service_logger.info("Found assistant response", 
                                   content_length=len(response),
                                   content_preview=response[:100])
                
                # Add to chat history
                self.chat_history.append({
                    "role": "user",
                    "content": message
                })
                self.chat_history.append({
                    "role": "assistant",
                    "content": response
                })
                
                service_logger.info("Added message to chat history", 
                                   history_count=len(self.chat_history))
                
                return response
            else:
                # Try a fallback approach - check if we have any messages at all
                if self.collector.messages:
                    # Get the last message that's not from the user
                    non_user_messages = [m for m in self.collector.messages if m["role"] != "User_Proxy"]
                    
                    if non_user_messages:
                        response = non_user_messages[-1]["content"]
                        if not isinstance(response, str):
                            response = str(response)
                            
                        service_logger.info("Found a non-user response as fallback", 
                                           content_length=len(response),
                                           content_preview=response[:100])
                        
                        # Add to chat history
                        self.chat_history.append({
                            "role": "user",
                            "content": message
                        })
                        self.chat_history.append({
                            "role": "assistant",
                            "content": response
                        })
                        
                        return response
                
                service_logger.warning("No assistant response found in collector")
                
                # Direct API call as a final fallback
                try:
                    import httpx
                    
                    service_logger.info("Attempting direct API call as fallback")
                    
                    async with httpx.AsyncClient() as client:
                        response = await client.post(
                            "https://api.groq.com/openai/v1/chat/completions",
                            headers={
                                "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                                "Content-Type": "application/json"
                            },
                            json={
                                "model": settings.MODEL_NAME,
                                "messages": [
                                    {"role": "system", "content": self.assistant.system_message},
                                    {"role": "user", "content": message}
                                ],
                                "temperature": settings.TEMPERATURE,
                                "max_tokens": settings.MAX_TOKENS
                            },
                            timeout=30.0
                        )
                        
                        # Parse response 
                        if response.status_code == 200:
                            response_data = response.json()
                            service_logger.info("Received API fallback response")
                            
                            # Extract text from response
                            if 'choices' in response_data and len(response_data['choices']) > 0:
                                result = response_data['choices'][0]['message']['content']
                                
                                # Add to chat history
                                self.chat_history.append({
                                    "role": "user",
                                    "content": message
                                })
                                self.chat_history.append({
                                    "role": "assistant",
                                    "content": result
                                })
                                
                                return result
                except Exception as api_error:
                    service_logger.error(f"Fallback API call failed: {str(api_error)}")
                    
                return "I couldn't generate a proper response to your question."
            
        except Exception as e:
            service_logger.error(
                "Error processing message",
                error=str(e),
                traceback=traceback.format_exc()
            )
            return f"Error processing message: {str(e)}"

    def get_chat_history(self) -> List[Dict[str, Any]]:
        """
        Get the chat history between the user and assistant
        """
        try:
            service_logger.info(
                "Retrieved chat history",
                message_count=len(self.chat_history)
            )
            return self.chat_history
        except Exception as e:
            service_logger.error(
                "Error retrieving chat history",
                error=str(e)
            )
            return [] 