import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Message as MessageType } from '../types';
import { formatTimestamp, formatMessage, isUserMessage } from '../utils/format';

interface MessageProps {
    message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
    const isUser = isUserMessage(message);
    const formattedContent = formatMessage(message);
    const timestamp = formatTimestamp(message.timestamp);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                mb: 2,
            }}
        >
            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    maxWidth: '70%',
                    backgroundColor: isUser ? '#e3f2fd' : '#f5f5f5',
                }}
            >
                <Typography variant="body1">{formattedContent}</Typography>
                <Typography variant="caption" color="text.secondary">
                    {timestamp}
                </Typography>
            </Paper>
        </Box>
    );
};

export default Message; 