import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <HealthAndSafetyIcon color="primary" sx={{ fontSize: 80, mb: 2 }} />
          
          <Typography variant="h3" component="h1" gutterBottom>
            SpeakToCure
          </Typography>
          
          <Typography variant="h6" color="textSecondary" paragraph>
            Your AI-powered healthcare assistant
          </Typography>
          
          <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 4 }}>
            Describe your symptoms in your language and get instant guidance
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate('/identity')}
            sx={{ 
              py: 1.5, 
              px: 4, 
              borderRadius: 28,
              fontSize: '1.1rem',
            }}
          >
            Get Started
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;