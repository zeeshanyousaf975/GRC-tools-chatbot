import { useState, useCallback } from 'react';
import { Message, ChatHistory } from '../types';
import { chatApi } from '../services/api';
import { logger } from '../services/logger';

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchChatHistory = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await chatApi.getChatHistory();
            if (response.status === 'success' && response.data) {
                setMessages(response.data);
            } else if (response.error) {
                setError(response.error);
            }
        } catch (error) {
            logger.error('Error fetching chat history', error);
            setError('Failed to fetch chat history');
        } finally {
            setLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };

        setMessages((prev: Message[]) => [...prev, newMessage]);
        setLoading(true);
        setError(null);

        try {
            logger.info('Sending message to API', { content });
            const response = await chatApi.sendMessage(content);
            
            if (response.status === 'success' && response.data) {
                logger.info('Received successful response from API', { 
                    responseId: response.data.id,
                    responseLength: response.data.content.length 
                });
                setMessages((prev: Message[]) => [...prev, response.data]);
            } else if (response.error) {
                logger.error('API returned error', { error: response.error });
                setError(response.error);
                
                // Add a system message indicating the error
                const errorMessage: Message = {
                    id: Date.now().toString(),
                    content: `Error: ${response.error}. Please try again.`,
                    sender: 'assistant',
                    timestamp: new Date().toISOString(),
                    status: 'error'
                };
                setMessages((prev: Message[]) => [...prev, errorMessage]);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger.error('Error sending message', { error });
            setError('Failed to send message');
            
            // Add a system message for the error
            const systemErrorMessage: Message = {
                id: Date.now().toString(),
                content: 'Sorry, there was a problem connecting to the server. Please try again later.',
                sender: 'assistant',
                timestamp: new Date().toISOString(),
                status: 'error'
            };
            setMessages((prev: Message[]) => [...prev, systemErrorMessage]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        messages,
        loading,
        error,
        fetchChatHistory,
        sendMessage,
    };
}; 