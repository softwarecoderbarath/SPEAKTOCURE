import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DoctorFinder from './components/DoctorFinder';

// Import contexts
import { UserProvider, UserContext } from './contexts/UserContext';

// Import pages
import HomePage from './components/pages/HomePage';
import IdentityLanguagePage from './components/pages/IdentityLanguagePage';
import TutorialPage from './components/pages/TutorialPage';
import WelcomePage from './components/pages/WelcomePage';
import VoiceInputPage from './components/pages/VoiceInputPage';
import DiagnosisPage from './components/pages/DiagnosisPage';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

// Redirect handler component
const RedirectHandler = () => {
  const { shouldRedirectToHome, setShouldRedirectToHome } = useContext(UserContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (shouldRedirectToHome) {
      navigate('/');
      setShouldRedirectToHome(false);
    }
  }, [shouldRedirectToHome, navigate, setShouldRedirectToHome]);
  
  return null;
};

// Main App component with Router
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
}

// Child component that can use router hooks
function AppContent() {
  return (
    <>
      <RedirectHandler />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/identity" element={<IdentityLanguagePage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/voice-input" element={<VoiceInputPage />} />
        <Route path="/diagnosis" element={<DiagnosisPage />} />
        <Route path="/find-doctor" element={<DoctorFinder />} />
      </Routes>
    </>
  );
}

export default App;