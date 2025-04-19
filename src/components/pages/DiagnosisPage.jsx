import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Chip,
  CircularProgress
} from '@mui/material';
import { UserContext } from '../../contexts/UserContext';
import { analyzeSymptomsText } from '../../services/diseaseService';

const DiagnosisPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);
  
  // Redirect if no symptoms data
  useEffect(() => {
    if (!user.symptoms) {
      navigate('/voice-input');
    } else {
      performDiagnosis(user.symptoms);
    }
  }, [user.symptoms, navigate]);
  
  // Function to perform diagnosis
  const performDiagnosis = async (symptomsText) => {
    setLoading(true);
    try {
      const result = await analyzeSymptomsText(symptomsText);
      setDiagnosis(result);
    } catch (err) {
      console.error('Error analyzing symptoms:', err);
      setError('An error occurred while analyzing your symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Get severity color
  const getSeverityColor = (severity) => {
    if (severity === 'high') return 'error';
    if (severity === 'medium') return 'warning';
    return 'success';
  };
  
  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Analyzing your symptoms...
          </Typography>
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
          }}
        >
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/voice-input')}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }
  
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
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
            Symptom Analysis
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Your symptoms:
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
              <Typography variant="body1">
                {user.symptoms}
              </Typography>
              {user.isTransliterated && (
                <Chip 
                  label="Transliterated" 
                  color="info" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              )}
            </Paper>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              Severity: 
              <Chip 
                label={diagnosis.severity.toUpperCase()} 
                color={getSeverityColor(diagnosis.severity)} 
                size="small" 
                sx={{ ml: 2 }}
              />
            </Typography>
            
            {diagnosis.needsDoctor ? (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Based on your symptoms, we recommend consulting a healthcare professional.
              </Alert>
            ) : diagnosis.severity === 'low' ? (
              <Alert severity="success" sx={{ mt: 2 }}>
                Your symptoms appear to be mild. Home care may be sufficient, but consult a doctor if symptoms worsen.
              </Alert>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                Monitor your symptoms closely. If they persist or worsen, consider consulting a healthcare professional.
              </Alert>
            )}
          </Box>
          
          {diagnosis.possibleConditions.length > 0 ? (
            <>
              <Typography variant="h6" gutterBottom>
                Possible conditions:
              </Typography>
              
              <List>
                {diagnosis.possibleConditions.map((condition, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={condition.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {condition.description}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              <strong>Recommended treatment:</strong> {condition.treatment}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < diagnosis.possibleConditions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </>
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              Based on our database, we couldn't find a specific match for your symptoms. This doesn't necessarily mean your condition is serious - it might just be a combination of symptoms our system doesn't recognize.
            </Alert>
          )}
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/voice-input')}
            >
              Back
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/find-doctor')}
            >
              Find a Doctor
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            Disclaimer: This is not a medical diagnosis. Always consult with a healthcare professional for medical advice.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default DiagnosisPage;