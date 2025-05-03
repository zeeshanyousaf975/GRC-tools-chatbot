import { config } from '../config';
import { Message } from '../types';

export const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export const formatMessage = (message: Message): string => {
    if (message.content.length > config.ui.maxMessageLength) {
        return `${message.content.substring(0, config.ui.maxMessageLength)}...`;
    }
    return message.content;
};

export const isUserMessage = (message: Message): boolean => {
    return message.sender === 'user';
};

export const isBotMessage = (message: Message): boolean => {
    return message.sender === 'assistant';
}; 