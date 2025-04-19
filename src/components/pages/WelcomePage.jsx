import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Paper,
  Avatar
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { UserContext } from '../../contexts/UserContext';
import textToSpeech from '../../services/textToSpeech';

const WelcomePage = () => {
  const { user, updateActivity } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if no name (user hasn't completed identity form)
    if (!user.name) {
      navigate('/identity');
      return;
    }
    
    // Get language code for text-to-speech
    const languageMap = {
      english: 'en-US',
      hindi: 'hi-IN',
      tamil: 'ta-IN',
      bengali: 'bn-IN',
      telugu: 'te-IN',
      marathi: 'mr-IN',
      gujarati: 'gu-IN',
      kannada: 'kn-IN',
      malayalam: 'ml-IN',
      punjabi: 'pa-IN',
    };
    
    const languageCode = languageMap[user.language] || 'en-US';
    
    // Welcome message in the selected language
    const welcomeMessages = {
      english: `Welcome ${user.name}! I'm your healthcare assistant. Please describe your symptoms when you're ready.`,
      hindi: `स्वागत है ${user.name}! मैं आपका स्वास्थ्य सहायक हूं। जब आप तैयार हों, कृपया अपने लक्षणों का वर्णन करें।`,
      tamil: `வரவேற்கிறோம் ${user.name}! நான் உங்கள் சுகாதார உதவியாளர். தயவுசெய்து நீங்கள் தயாராக இருக்கும்போது உங்கள் அறிகுறிகளை விவரிக்கவும்.`,
      bengali: `স্বাগতম ${user.name}! আমি আপনার স্বাস্থ্যসেবা সহকারী। আপনি প্রস্তুত হলে দয়া করে আপনার উপসর্গগুলি বর্ণনা করুন।`,
      telugu: `స్వాగతం ${user.name}! నేను మీ ఆరోగ్య సహాయకుడిని. మీరు సిద్ధంగా ఉన్నప్పుడు దయచేసి మీ లక్షణాలను వివరించండి.`,
      marathi: `स्वागत आहे ${user.name}! मी तुमचा आरोग्य सहाय्यक आहे. कृपया तुम्ही तयार असताना तुमच्या लक्षणांचे वर्णन करा.`,
      gujarati: `સ્વાગત છે ${user.name}! હું તમારો આરોગ્ય સહાયક છું. કૃપા કરીને તમે તૈયાર હો ત્યારે તમારા લક્ષણોનું વર્ણન કરો.`,
      kannada: `ಸ್ವಾಗತ ${user.name}! ನಾನು ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಹಾಯಕ. ನೀವು ಸಿದ್ಧವಾದಾಗ ದಯವಿಟ್ಟು ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ.`,
      malayalam: `സ്വാഗതം ${user.name}! ഞാൻ നിങ്ങളുടെ ആരോഗ്യ സഹായിയാണ്. നിങ്ങൾ തയ്യാറാകുമ്പോൾ ദയവായി നിങ്ങളുടെ രോഗലക്ഷണങ്ങൾ വിവരിക്കുക.`,
      punjabi: `ਜੀ ਆਇਆਂ ਨੂੰ ${user.name}! ਮੈਂ ਤੁਹਾਡਾ ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਜਦੋਂ ਤੁਸੀਂ ਤਿਆਰ ਹੋਵੋ ਤਾਂ ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ।`,
    };
    
    const welcomeText = welcomeMessages[user.language] || welcomeMessages.english;
    
    // Read welcome message aloud
    textToSpeech.speak(welcomeText, languageCode);
    
    return () => {
      // Stop speaking when component unmounts
      textToSpeech.stop();
    };
  }, [user.name, user.language, navigate]);

  const handleContinue = () => {
    updateActivity();
    navigate('/voice-input');
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
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2, textAlign: 'center' }}>
          <Avatar
            sx={{
              m: 'auto',
              mb: 3,
              bgcolor: 'primary.main',
              width: 80,
              height: 80,
            }}
          >
            <MicIcon sx={{ fontSize: 40 }} />
          </Avatar>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user.name}!
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            I'm your healthcare assistant. I'll listen to your symptoms and provide guidance.
            Please speak clearly when describing how you feel.
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleContinue}
            sx={{ py: 1.5, px: 4, borderRadius: 28, fontSize: '1.1rem' }}
          >
            Describe My Symptoms
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default WelcomePage;