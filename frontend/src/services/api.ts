import axios from 'axios';
import { Message, ChatHistory, ApiResponse } from '../types';
import { logger } from './logger';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const chatApi = {
    sendMessage: async (message: string): Promise<ApiResponse<Message>> => {
        try {
            logger.info('Sending message to backend', { message });
            const response = await api.post<any>('/chat', { message });
            
            // Log the entire response for debugging
            logger.info('Received raw response from backend', { 
                responseData: JSON.stringify(response.data), 
                responseType: typeof response.data,
                responseStatus: response.status,
                responseHeaders: response.headers
            });
            
            // Extract the response content based on the backend format
            let responseContent = '';
            
            if (typeof response.data === 'string') {
                // If response is directly a string
                responseContent = response.data;
                logger.info('Response is a string', { responseContent });
            } else if (response.data && typeof response.data === 'object') {
                // If response is an object with a response property (our backend format)
                logger.info('Response is an object', { keys: Object.keys(response.data) });
                
                // Check if response property exists and is not empty
                if ('response' in response.data && response.data.response) {
                    responseContent = response.data.response;
                    logger.info('Found response property', { 
                        responseContent, 
                        responseLength: responseContent.length 
                    });
                }
            }
            
            // If still empty, use a default message
            if (!responseContent) {
                logger.warn('No response content found, using default message');
                responseContent = "I'm ready to help with GRC topics. Please ask a specific question.";
            }
            
            logger.info('Final extracted response content', { 
                responseLength: responseContent.length,
                responsePreview: responseContent.substring(0, 50) 
            });
            
            // Create the message object to return
            const messageObj: Message = {
                id: Date.now().toString(),
                content: responseContent,
                sender: 'assistant',
                timestamp: new Date().toISOString()
            };
            
            logger.info('Returning message object', { message: messageObj });
            
            return {
                status: 'success',
                data: messageObj
            };
        } catch (error) {
            logger.error('Error sending message', error);
            return {
                status: 'error',
                error: 'Failed to send message',
            };
        }
    },

    getChatHistory: async (): Promise<ApiResponse<ChatHistory>> => {
        try {
            logger.info('Fetching chat history');
            const response = await api.get<ApiResponse<ChatHistory>>('/chat/history');
            logger.info('Received chat history', { history: response.data });
            return response.data;
        } catch (error) {
            logger.error('Error fetching chat history', error);
            return {
                status: 'error',
                error: 'Failed to fetch chat history',
            };
        }
    },
    
    clearChatHistory: async (): Promise<ApiResponse<void>> => {
        try {
            logger.info('Clearing chat history');
            const response = await api.post('/chat/clear');
            
            logger.info('Received clear history response', { 
                success: response.data?.success,
                message: response.data?.message
            });
            
            if (response.data?.success) {
                return {
                    status: 'success'
                };
            } else {
                return {
                    status: 'error',
                    error: response.data?.message || 'Failed to clear chat history'
                };
            }
        } catch (error) {
            logger.error('Error clearing chat history', error);
            return {
                status: 'error',
                error: 'Failed to clear chat history',
            };
        }
    }
}; 