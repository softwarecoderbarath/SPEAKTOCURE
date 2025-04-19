import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    phoneNumber: '',
    language: 'english',
    needsHelp: false,
    symptoms: '',
    diagnosis: null,
    selectedDoctor: null,
  });

  const [lastActivity, setLastActivity] = useState(Date.now());
  const [shouldRedirectToHome, setShouldRedirectToHome] = useState(false);

  // Reset activity timer on user interaction
  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  // Check for inactivity and set redirect flag
  useEffect(() => {
    const inactivityTimeout = 3 * 60 * 1000; // 3 minutes
    
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > inactivityTimeout) {
        // Reset user data and set redirect flag
        setUser({
          name: '',
          phoneNumber: '',
          language: 'english',
          needsHelp: false,
          symptoms: '',
          diagnosis: null,
          selectedDoctor: null,
        });
        setShouldRedirectToHome(true);
      }
    }, 30000); // Check every 30 seconds
    
    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity);
    });
    
    return () => {
      clearInterval(interval);
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [lastActivity]);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      updateActivity, 
      shouldRedirectToHome, 
      setShouldRedirectToHome 
    }}>
      {children}
    </UserContext.Provider>
  );
};