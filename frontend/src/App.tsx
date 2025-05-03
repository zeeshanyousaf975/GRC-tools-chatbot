import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Chat from './pages/Chat';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 4,
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <Footer />
    </Box>
  );
}

export default App; 