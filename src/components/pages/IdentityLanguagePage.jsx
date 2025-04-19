import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  FormControlLabel, 
  Checkbox, 
  Typography, 
  Container, 
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { UserContext } from '../../contexts/UserContext';

const IdentityLanguagePage = () => {
  const { user, setUser, updateActivity } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    phoneNumber: user.phoneNumber || '',
    language: user.language || 'english',
    needsHelp: user.needsHelp || false
  });
  
  const [errors, setErrors] = useState({
    name: '',
    phoneNumber: ''
  });

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'bengali', label: 'Bengali' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'marathi', label: 'Marathi' },
    { value: 'gujarati', label: 'Gujarati' },
    { value: 'kannada', label: 'Kannada' },
    { value: 'malayalam', label: 'Malayalam' },
    { value: 'punjabi', label: 'Punjabi' }
  ];

  const handleChange = (e) => {
    updateActivity();
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', phoneNumber: '' };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateActivity();
    
    if (validateForm()) {
      setUser({
        ...user,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        language: formData.language,
        needsHelp: formData.needsHelp
      });
      
      if (formData.needsHelp) {
        navigate('/tutorial');
      } else {
        navigate('/welcome');
      }
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
            Tell us about yourself
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
              required
            />
            
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              margin="normal"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              required
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="language-select-label">Preferred Language</InputLabel>
              <Select
                labelId="language-select-label"
                name="language"
                value={formData.language}
                onChange={handleChange}
                label="Preferred Language"
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select the language you're most comfortable with</FormHelperText>
            </FormControl>
            
            <FormControlLabel
              control={
                <Checkbox
                  name="needsHelp"
                  checked={formData.needsHelp}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="I need help using the system"
              sx={{ mt: 2 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 4, mb: 2, py: 1.5, borderRadius: 28 }}
            >
              Submit & Continue
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default IdentityLanguagePage;