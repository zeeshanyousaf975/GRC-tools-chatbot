export const config = {
    api: {
        baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
        timeout: 10000, // 10 seconds
    },
    socket: {
        url: process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000',
    },
    features: {
        enableRealtimeUpdates: true,
        enableMarkdown: true,
        enableSyntaxHighlighting: true,
    },
    ui: {
        maxMessageLength: 1000,
        messageTimeFormat: 'HH:mm:ss',
        autoScrollDelay: 100,
    },
}; 