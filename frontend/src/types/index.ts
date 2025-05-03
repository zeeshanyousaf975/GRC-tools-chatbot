export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: string;
    status?: 'sending' | 'sent' | 'error';
}

export interface ChatHistory {
    messages: Message[];
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: 'success' | 'error';
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
}

export interface Logger {
    info: (message: string, data?: any) => void;
    error: (message: string, error: any) => void;
    warn: (message: string, data?: any) => void;
    debug: (message: string, data?: any) => void;
} 