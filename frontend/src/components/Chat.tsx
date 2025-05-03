import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { Box, TextField, IconButton, Paper, Alert, Button, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useChat } from '../hooks/useChat';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import Message from './Message';
import Loading from './Loading';
import { Message as MessageType } from '../types';

const Chat = () => {
    const { messages, loading, error, fetchChatHistory, sendMessage, clearHistory } = useChat();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [clearLoading, setClearLoading] = useState(false);

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

    const handleClearHistory = async () => {
        if (window.confirm('Are you sure you want to clear the chat history? This cannot be undone.')) {
            setClearLoading(true);
            await clearHistory();
            setClearLoading(false);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}
                </Box>
                <Tooltip title="Clear chat history">
                    <IconButton 
                        color="error" 
                        onClick={handleClearHistory}
                        disabled={loading || clearLoading || messages.length === 0}
                        sx={{ ml: 2 }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Paper elevation={3} sx={{ flex: 1, overflow: 'auto', mb: 2, p: 2 }}>
                {messages.map((message: MessageType) => (
                    <Message key={message.id} message={message} />
                ))}
                {loading && <Loading message="Sending message..." />}
                {clearLoading && <Loading message="Clearing chat history..." />}
                <div ref={messagesEndRef} />
            </Paper>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message... (Press Enter to send, Ctrl+R to refresh)"
                    value={input}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading || clearLoading}
                />
                <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={loading || clearLoading || !input.trim()}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Chat; 