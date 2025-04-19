import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';

const TutorialPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // Simple activity tracking without context dependency
  const updateActivity = () => {
    // Just a placeholder function that doesn't depend on context
    console.log('User activity updated');
  };

  // Add effect to verify component is mounting
  useEffect(() => {
    console.log('Tutorial page mounted');
  }, []);

  const steps = [
    {
      label: 'Welcome to SpeakToCure',
      description: "This app helps you describe your symptoms and get healthcare guidance. We'll walk you through how to use it.",
    },
    {
      label: 'Speak Your Symptoms',
      description: "When prompted, describe how you feel in your own words. Speak clearly and mention all symptoms you're experiencing.",
    },
    {
      label: 'Review the Analysis',
      description: "The app will analyze your symptoms and suggest possible conditions. It will also recommend whether you should see a doctor.",
    },
    {
      label: 'Find Healthcare Providers',
      description: "If needed, the app can help you find nearby doctors and healthcare facilities based on your location.",
    },
  ];

  const handleNext = () => {
    updateActivity();
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    updateActivity();
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    updateActivity();
    navigate('/welcome');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
            How to Use SpeakToCure
          </Typography>
          
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="h6">{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body1" sx={{ mb: 3 }}>{step.description}</Typography>
                  <Box sx={{ mb: 2 }}>
                    <div>
                      <Button
                        variant="contained"
                        onClick={index === steps.length - 1 ? handleFinish : handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </Box>
    </Container>
  );
};

export default TutorialPage;