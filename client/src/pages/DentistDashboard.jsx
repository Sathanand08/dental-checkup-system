// src/pages/DentistDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Container, Typography, Button, Box, Paper, Card, CardContent, CardActions, Divider, CircularProgress } from '@mui/material';

const DentistDashboard = () => {
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckups = async () => {
      try {
        const response = await api.get('/api/checkups/dentist');
        setCheckups(response.data);
      } catch (error) {
        toast.error('Failed to fetch checkups');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCheckups();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dentist Dashboard
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Patient Checkup Requests
          </Typography>
          
          {checkups.length === 0 ? (
            <Typography>No checkup requests</Typography>
          ) : (
            checkups.map((checkup) => (
              <Card key={checkup._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">
                    Patient: {checkup.patient.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {checkup.patient.email}
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
                    variant="contained"
                    component={Link}
                    to={`/dentist/checkup/${checkup._id}`}
                  >
                    {checkup.status === 'requested' ? 'Update Checkup' : 'View Details'}
                  </Button>
                </CardActions>
              </Card>
            ))
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default DentistDashboard;