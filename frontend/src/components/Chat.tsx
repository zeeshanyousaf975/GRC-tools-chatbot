import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Paper, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from '../hooks/useChat';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import Message from './Message';
import Loading from './Loading';

const Chat: React.FC = () => {
    const { messages, loading, error, fetchChatHistory, sendMessage } = useChat();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchChatHistory();
    }, [fetchChatHistory]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        await sendMessage(input);
        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useKeyboardShortcuts([
        {
            key: 'Enter',
            action: handleSendMessage,
        },
        {
            key: 'Escape',
            action: () => setInput(''),
        },
        {
            key: 'r',
            ctrlKey: true,
            action: fetchChatHistory,
        },
    ]);

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Paper elevation={3} sx={{ flex: 1, overflow: 'auto', mb: 2, p: 2 }}>
                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
                {loading && <Loading message="Sending message..." />}
                <div ref={messagesEndRef} />
            </Paper>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message... (Press Enter to send, Ctrl+R to refresh)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
                <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Chat; 