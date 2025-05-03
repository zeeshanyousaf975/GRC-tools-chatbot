import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <ChatIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          GRC Chatbot
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ mr: 2 }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/chat"
          >
            Chat
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 