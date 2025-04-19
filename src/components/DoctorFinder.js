import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Typography, Box, TextField, Button, Card, CardContent, 
  CardMedia, Grid, Rating, Divider, Dialog, DialogTitle, 
  DialogContent, DialogActions, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Phone, LocationOn, AccessTime, Email } from '@mui/icons-material';
import { getAllDoctors, findDoctorsBySymptoms, requestDoctorCall } from '../services/doctorService';
import SimpleMap from './SimpleMap';

const DoctorFinder = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [patientInfo, setPatientInfo] = useState({ name: '', phone: '', symptoms: '' });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const mapRef = useRef(null);
  
  // Load all doctors on component mount
  useEffect(() => {
    const allDoctors = getAllDoctors();
    // Set all doctor phone numbers to your number
    const updatedDoctors = allDoctors.map(doctor => ({
      ...doctor,
      phone: "9080187006"
    }));
    setDoctors(updatedDoctors);
    setFilteredDoctors(updatedDoctors);
  }, []);

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredDoctors(doctors);
      return;
    }

    const matchedDoctors = findDoctorsBySymptoms(searchQuery);
    // Ensure all matched doctors have your phone number
    const updatedMatchedDoctors = matchedDoctors.map(doctor => ({
      ...doctor,
      phone: "9080187006"
    }));
    setFilteredDoctors(updatedMatchedDoctors);
    // Also update the symptoms field in patient info
    setPatientInfo(prev => ({ ...prev, symptoms: searchQuery }));
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenDialog(true);
    
    // Center map on selected doctor if map reference exists
    if (mapRef.current) {
      mapRef.current.centerOnMarker(doctor.location.lat, doctor.location.lng);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDoctor(null);
  };

  // Handle patient info change
  const handlePatientInfoChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle request call
  const handleRequestCall = async () => {
    if (!patientInfo.name || !patientInfo.phone) {
      setNotification({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // Include symptoms in the request
      const patientDetails = {
        ...patientInfo,
        doctorName: selectedDoctor.name,
        doctorSpecialization: selectedDoctor.specialization,
        hospital: selectedDoctor.hospital
      };
      
      const response = await requestDoctorCall(selectedDoctor.id, patientDetails);
      setNotification({
        open: true,
        message: response.message,
        severity: 'success'
      });
      setOpenDialog(false);
      setPatientInfo({ name: '', phone: '', symptoms: searchQuery });
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || 'Failed to send request',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Calculate map center based on filtered doctors
  const getMapCenter = () => {
    if (filteredDoctors.length === 0) {
      // Default to center of India if no doctors
      return [20.5937, 78.9629];
    }
    
    // Calculate average lat/lng of filtered doctors
    const totalLat = filteredDoctors.reduce((sum, doc) => sum + doc.location.lat, 0);
    const totalLng = filteredDoctors.reduce((sum, doc) => sum + doc.location.lng, 0);
    
    return [
      totalLat / filteredDoctors.length,
      totalLng / filteredDoctors.length
    ];
  };

  // Prepare markers for the map
  const getMapMarkers = () => {
    return filteredDoctors.map(doctor => ({
      id: doctor.id,
      lat: doctor.location.lat,
      lng: doctor.location.lng,
      popup: `
        <div>
          <h4>${doctor.name}</h4>
          <p>${doctor.hospital}</p>
          <p>${doctor.specialization}</p>
        </div>
      `
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Find a Doctor
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" gutterBottom>
          Enter your symptoms or the type of doctor you're looking for
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="E.g., heart pain, headache, pediatrician"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSearch}
            sx={{ minWidth: '120px' }}
          >
            Search
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Doctors ({filteredDoctors.length})
          </Typography>
          <Box sx={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map(doctor => (
                <Card 
                  key={doctor.id} 
                  sx={{ mb: 2, cursor: 'pointer' }}
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <CardContent sx={{ display: 'flex', gap: 2 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100, borderRadius: '50%' }}
                      image={doctor.image}
                      alt={doctor.name}
                    />
                    <Box>
                      <Typography variant="h6">{doctor.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.specialization} • {doctor.experience}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                        {doctor.hospital}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Rating value={doctor.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {doctor.rating}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1">No doctors found matching your criteria.</Typography>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Map View
          </Typography>
          <Box sx={{ height: '600px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}>
            <SimpleMap 
              ref={mapRef}
              center={getMapCenter()} 
              zoom={5} 
              markers={getMapMarkers()}
              onMarkerClick={(markerId) => {
                const doctor = filteredDoctors.find(d => d.id === markerId);
                if (doctor) {
                  handleDoctorSelect(doctor);
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Doctor Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedDoctor && (
          <>
            <DialogTitle>{selectedDoctor.name}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 120, height: 120, borderRadius: '50%' }}
                  image={selectedDoctor.image}
                  alt={selectedDoctor.name}
                />
                <Box>
                  <Typography variant="h6">{selectedDoctor.name}</Typography>
                  <Typography variant="body1">{selectedDoctor.specialization}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedDoctor.experience}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Rating value={selectedDoctor.rating} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {selectedDoctor.rating}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn fontSize="small" sx={{ mr: 1 }} />
                {selectedDoctor.hospital}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, pl: 3 }}>
                {selectedDoctor.address}
              </Typography>

              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone fontSize="small" sx={{ mr: 1 }} />
                {selectedDoctor.phone}
              </Typography>

              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email fontSize="small" sx={{ mr: 1 }} />
                {selectedDoctor.email}
              </Typography>

              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime fontSize="small" sx={{ mr: 1 }} />
                {selectedDoctor.availability}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Request a Call
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Fill in your details and the doctor will call you back.
              </Typography>

              <TextField
                fullWidth
                margin="normal"
                label="Your Name"
                name="name"
                value={patientInfo.name}
                onChange={handlePatientInfoChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Your Phone Number"
                name="phone"
                value={patientInfo.phone}
                onChange={handlePatientInfoChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Your Symptoms"
                name="symptoms"
                value={patientInfo.symptoms || searchQuery}
                onChange={handlePatientInfoChange}
                multiline
                rows={3}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                onClick={handleRequestCall} 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Request Call'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DoctorFinder;