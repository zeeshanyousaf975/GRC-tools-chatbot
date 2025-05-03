import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Container,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { chatApi } from '../services/api';
import { Message as MessageType } from '../types';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [clearLoading, setClearLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { data: chatHistory, isLoading: isLoadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: async () => {
      const response = await chatApi.getChatHistory();
      return response;
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await chatApi.sendMessage(message);
      console.log('API service response:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('Processing response data:', data);
      
      let responseContent = '';
      
      if (data.status === 'success' && data.data) {
        responseContent = data.data.content;
      } else if (data.status === 'error' && data.error) {
        responseContent = `Error: ${data.error}`;
      } else if (typeof data === 'object' && data.response) {
        responseContent = data.response;
      } else {
        responseContent = "I received your message but couldn't generate a proper response.";
      }
      
      if (responseContent.includes("didn't ask a question") || 
          responseContent.includes("haven't entered a question") ||
          responseContent.includes("provide a question")) {
        const lastUserMessage = messages.find(m => m.sender === 'user');
        if (lastUserMessage && lastUserMessage.content.trim().length > 0) {
          responseContent = "I'm sorry, but I'm having trouble understanding your question. Could you please rephrase it?";
        }
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: responseContent,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
        },
      ]);
    },
  });

  const clearChatMutation = useMutation({
    mutationFn: async () => {
      return await chatApi.clearChatHistory();
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        // Clear the local messages
        setMessages([{
          id: Date.now().toString(),
          content: "I'm ready to help with GRC topics. What would you like to know?",
          sender: 'assistant',
          timestamp: new Date().toISOString(),
        }]);
      }
    },
  });

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    await sendMessageMutation.mutateAsync(input);
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear the chat history? This cannot be undone.')) {
      setClearLoading(true);
      await clearChatMutation.mutateAsync();
      setClearLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Tooltip title="Clear chat history">
          <IconButton
            color="error"
            onClick={handleClearHistory}
            disabled={sendMessageMutation.isPending || clearLoading || messages.length === 0}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Paper
        elevation={3}
        sx={{
          height: '70vh',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            mb: 2,
            p: 2,
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  backgroundColor:
                    message.sender === 'user' ? 'primary.main' : 'background.paper',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                }}
              >
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))}
          {(sendMessageMutation.isPending || clearLoading) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {clearLoading ? 'Clearing chat history...' : 'Sending message...'}
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            disabled={sendMessageMutation.isPending || clearLoading}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!input.trim() || sendMessageMutation.isPending || clearLoading}
          >
            {sendMessageMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat; 