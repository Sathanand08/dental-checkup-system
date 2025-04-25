// src/pages/PatientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  Container, Typography, Button, Box, Paper, Grid, 
  Card, CardContent, CardActions, Divider, CircularProgress 
} from '@mui/material';

const PatientDashboard = () => {
  const [dentists, setDentists] = useState([]);
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dentistsRes, checkupsRes] = await Promise.all([
          api.get('/api/dentists'),
          api.get('/api/checkups/patient')
        ]);
        
        setDentists(dentistsRes.data);
        setCheckups(checkupsRes.data);
      } catch (error) {
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const requestCheckup = async (dentistId) => {
    try {
      const response = await api.post('/api/checkups/request', { dentistId });
      setCheckups([response.data, ...checkups]);
      toast.success('Checkup requested successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request checkup');
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Patient Dashboard
        </Typography>
        
        {/* Checkups Section - Displayed at the Top */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Checkups
          </Typography>
          
          {checkups.length === 0 ? (
            <Typography>No checkups requested yet</Typography>
          ) : (
            <Grid container spacing={2} >
              {checkups.map((checkup) => (
                <Grid item xs={12} sm={6} md={4} key={checkup._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">
                        Dentist: {checkup.dentist.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {checkup.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Requested: {new Date(checkup.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        variant="outlined"
                        component={Link}
                        to={`/checkup/${checkup._id}`}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
        
        {/* Dentists Section - Displayed Below */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Available Dentists
          </Typography>
          
          {dentists.length === 0 ? (
            <Typography>No dentists available</Typography>
          ) : (
            <Grid container spacing={2}>
              {dentists.map((dentist) => (
                <Grid item xs={12} sm={6} md={4} key={dentist._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{dentist.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dentist.email}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => requestCheckup(dentist._id)}
                        fullWidth
                      >
                        Request Checkup
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default PatientDashboard;