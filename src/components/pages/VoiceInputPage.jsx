import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Paper,
  CircularProgress,
  IconButton,
  TextField,
  Tabs,
  Tab,
  Divider,
  FormControlLabel,
  Switch
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import SendIcon from '@mui/icons-material/Send';
import { UserContext } from '../../contexts/UserContext';

const VoiceInputPage = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  // New state for text input
  const [textInput, setTextInput] = useState('');
  const [inputMethod, setInputMethod] = useState(0); // 0 for voice, 1 for text
  const [isTransliteration, setIsTransliteration] = useState(false); // Add this line for transliteration state
  
  const recognitionRef = useRef(null);
  
  // Language codes for speech recognition
  const languageCodes = {
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
  
  // Initialize speech recognition
  useEffect(() => {
    // Only initialize speech recognition if voice input is selected
    if (inputMethod !== 0) return;
    
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      // Automatically switch to text input if speech recognition is not supported
      setInputMethod(1);
      return;
    }
    
    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configure recognition
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = languageCodes[user.language] || 'en-US';
    
    // Set up event handlers
    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      setTranscript(finalTranscript || interimTranscript);
    };
    
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setError(`Error: ${event.error}. Please try again or use text input.`);
      setIsListening(false);
    };
    
    recognitionRef.current.onend = () => {
      if (isListening) {
        // Restart if we're still supposed to be listening
        recognitionRef.current.start();
      }
    };
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.language, isListening, inputMethod]);
  
  // Handle input method change
  const handleInputMethodChange = (event, newValue) => {
    // Stop listening if switching away from voice input
    if (isListening && newValue !== 0) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setInputMethod(newValue);
  };
  
  // Start/stop listening
  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Start listening
      setError('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error starting recognition:", err);
        setError("Could not start speech recognition. Please try again or use text input.");
      }
    }
  };
  
  // Handle text input change
  const handleTextInputChange = (e) => {
    setTextInput(e.target.value);
  };
  
  // UI text translations
  const uiText = {
    english: {
      title: "Describe Your Symptoms",
      voiceTab: "Voice",
      textTab: "Text",
      listeningPrompt: "Listening... Tap to stop.",
      startPrompt: "Tap microphone to start speaking",
      speechPlaceholder: "Your speech will appear here...",
      textPrompt: "Please type your symptoms below:",
      textPlaceholder: "Describe how you feel, what symptoms you're experiencing, and how long you've had them...",
      transliterationToggle: "Type in native language using English letters",
      errorEmpty: "Please describe your symptoms before submitting.",
      backButton: "Back",
      submitButton: "Submit",
      analyzingText: "Analyzing..."
    },
    hindi: {
      title: "अपने लक्षणों का वर्णन करें",
      voiceTab: "आवाज़",
      textTab: "टेक्स्ट",
      listeningPrompt: "सुन रहा है... रोकने के लिए टैप करें।",
      startPrompt: "बोलना शुरू करने के लिए माइक्रोफोन पर टैप करें",
      speechPlaceholder: "आपकी आवाज़ यहां दिखाई देगी...",
      textPrompt: "कृपया अपने लक्षणों का नीचे वर्णन करें:",
      textPlaceholder: "बताएं कि आप कैसा महसूस कर रहे हैं, आपको कौन से लक्षण हैं, और कब से हैं...",
      transliterationToggle: "अंग्रेजी अक्षरों का उपयोग करके अपनी भाषा में टाइप करें",
      errorEmpty: "कृपया जमा करने से पहले अपने लक्षणों का वर्णन करें।",
      backButton: "वापस",
      submitButton: "जमा करें",
      analyzingText: "विश्लेषण कर रहा है..."
    },
    tamil: {
      title: "உங்கள் அறிகுறிகளை விவரிக்கவும்",
      voiceTab: "குரல்",
      textTab: "உரை",
      listeningPrompt: "கேட்கிறது... நிறுத்த தட்டவும்.",
      startPrompt: "பேச தொடங்க மைக்ரோஃபோனைத் தட்டவும்",
      speechPlaceholder: "உங்கள் பேச்சு இங்கே தோன்றும்...",
      textPrompt: "உங்கள் அறிகுறிகளை கீழே விவரிக்கவும்:",
      textPlaceholder: "நீங்கள் எப்படி உணர்கிறீர்கள், எந்த அறிகுறிகளை அனுபவிக்கிறீர்கள், எவ்வளவு காலமாக உள்ளது என்பதை விவரிக்கவும்...",
      transliterationToggle: "ஆங்கில எழுத்துக்களைப் பயன்படுத்தி உங்கள் மொழியில் தட்டச்சு செய்யவும்",
      errorEmpty: "சமர்ப்பிப்பதற்கு முன் உங்கள் அறிகுறிகளை விவரிக்கவும்.",
      backButton: "பின்",
      submitButton: "சமர்ப்பி",
      analyzingText: "பகுப்பாய்வு செய்கிறது..."
    },
    // Add more languages as needed
  };
  
  // Get the appropriate text based on user language
  const getText = (key) => {
    return (uiText[user.language] && uiText[user.language][key]) || uiText.english[key];
  };
  
  // Handle transliteration toggle
  const handleTransliterationToggle = () => {
    setIsTransliteration(!isTransliteration);
  };
  
  // Process symptoms and navigate to results
  const handleSubmit = async () => {
    // Get the symptoms text from either voice or text input
    const symptomsText = inputMethod === 0 ? transcript : textInput;
    
    if (!symptomsText.trim()) {
      setError(getText('errorEmpty'));
      return;
    }
    
    setProcessing(true);
    
    try {
      // Save symptoms to user context
      setUser({
        ...user,
        symptoms: symptomsText,
        isTransliterated: inputMethod === 1 && isTransliteration
      });
      
      // For now, just navigate to a placeholder diagnosis page
      // In a real app, you would call your AI service here
      setTimeout(() => {
        setProcessing(false);
        navigate('/diagnosis');
      }, 2000);
    } catch (error) {
      console.error('Error processing symptoms:', error);
      setError('An error occurred while analyzing your symptoms. Please try again.');
      setProcessing(false);
    }
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
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {getText('title')}
          </Typography>
          
          <Tabs
            value={inputMethod}
            onChange={handleInputMethodChange}
            centered
            sx={{ mb: 3 }}
          >
            <Tab icon={<MicIcon />} label={getText('voiceTab')} />
            <Tab icon={<KeyboardIcon />} label={getText('textTab')} />
          </Tabs>
          
          {inputMethod === 0 ? (
            // Voice input UI
            <>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mb: 4, 
                  mt: 2 
                }}
              >
                <IconButton
                  color={isListening ? 'secondary' : 'primary'}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    border: '2px solid', 
                    borderColor: isListening ? 'secondary.main' : 'primary.main' 
                  }}
                  onClick={toggleListening}
                  disabled={processing}
                >
                  {isListening ? <StopIcon fontSize="large" /> : <MicIcon fontSize="large" />}
                </IconButton>
              </Box>
              
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                {isListening ? getText('listeningPrompt') : getText('startPrompt')}
              </Typography>
              
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  minHeight: 150, 
                  mb: 3, 
                  bgcolor: 'background.paper',
                  overflowY: 'auto'
                }}
              >
                {transcript ? (
                  <Typography variant="body1">{transcript}</Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center">
                    {getText('speechPlaceholder')}
                  </Typography>
                )}
              </Paper>
            </>
          ) : (
            // Text input UI
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {getText('textPrompt')}
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={isTransliteration}
                    onChange={handleTransliterationToggle}
                    color="primary"
                  />
                }
                label={getText('transliterationToggle')}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                placeholder={getText('textPlaceholder')}
                value={textInput}
                onChange={handleTextInputChange}
                disabled={processing}
                InputProps={{
                  sx: {
                    direction: user.language === 'arabic' || user.language === 'urdu' ? 'rtl' : 'ltr',
                  }
                }}
              />
            </Box>
          )}
          
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/welcome')}
              disabled={processing}
            >
              {getText('backButton')}
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={(inputMethod === 0 && !transcript.trim()) || (inputMethod === 1 && !textInput.trim()) || processing}
              startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            >
              {processing ? getText('analyzingText') : getText('submitButton')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VoiceInputPage;