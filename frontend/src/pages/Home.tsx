import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <ChatIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to GRC Chatbot
        </Typography>
        <Typography variant="body1" paragraph>
          A commercial-grade Governance, Risk, and Compliance chatbot powered by
          advanced AI technology. Get instant answers to your GRC-related
          questions and streamline your compliance processes.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<ChatIcon />}
          onClick={() => navigate('/chat')}
          sx={{ mt: 2 }}
        >
          Start Chatting
        </Button>
      </Paper>
    </Container>
  );
};

export default Home; 