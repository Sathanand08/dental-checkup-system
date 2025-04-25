import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import { 
  Container, Typography, Button, Box, Paper, Grid, 
  Card, CardContent, CardMedia, CircularProgress, Divider 
} from '@mui/material';

const CheckupDetail = () => {
  const { checkupId } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [checkup, setCheckup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckup = async () => {
      try {
        const response = await api.get(`/api/checkups/${checkupId}`);
        setCheckup(response.data);
      } catch (error) {
        toast.error('Failed to fetch checkup details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCheckup();
  }, [checkupId]);

  const generatePDF = () => {
    // Create a temporary element for PDF generation
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 20px;">
        <h1 style="text-align: center;">Dental Checkup Report</h1>
        <hr style="margin: 20px 0;" />
        
        <div style="margin-bottom: 20px;">
          <h2>Checkup Information</h2>
          <p><strong>Patient:</strong> ${checkup.patient.name}</p>
          <p><strong>Dentist:</strong> ${checkup.dentist.name}</p>
          <p><strong>Date:</strong> ${new Date(checkup.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${checkup.status}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h2>Dentist Notes</h2>
          <p>${checkup.notes || 'No notes provided'}</p>
        </div>
        
        ${checkup.images && checkup.images.length > 0 ? `
          <div>
            <h2>Images & Descriptions</h2>
            ${checkup.images.map((image, index) => `
              <div style="margin-bottom: 15px; page-break-inside: avoid;">
                <p><strong>Image ${index + 1}</strong></p>
                <img src="${window.location.origin}/${image.path}" style="max-width: 100%; max-height: 300px;" />
                <p>${image.description || 'No description provided'}</p>
              </div>
            `).join('')}
          </div>
        ` : '<p>No images uploaded</p>'}
      </div>
    `;

    const options = {
      margin: 1,
      filename: `dental-checkup-${checkupId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().from(element).set(options).save();
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!checkup) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">Checkup not found</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Checkup Details
          </Typography>
          
          {checkup.status === 'completed' && (
            <Button 
              variant="contained" 
              onClick={generatePDF}
            >
              Export PDF
            </Button>
          )}
        </Box>
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Patient Information</Typography>
              <Typography variant="body1">Name: {checkup.patient.name}</Typography>
              <Typography variant="body1">Email: {checkup.patient.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Dentist Information</Typography>
              <Typography variant="body1">Name: {checkup.dentist.name}</Typography>
              <Typography variant="body1">Email: {checkup.dentist.email}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1">
                <strong>Status:</strong> {checkup.status}
              </Typography>
              <Typography variant="body1">
                <strong>Requested Date:</strong> {new Date(checkup.createdAt).toLocaleDateString()}
              </Typography>
              {checkup.updatedAt !== checkup.createdAt && (
                <Typography variant="body1">
                  <strong>Last Updated:</strong> {new Date(checkup.updatedAt).toLocaleDateString()}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
        
        {checkup.status === 'completed' && (
          <>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Dentist Notes</Typography>
              <Typography variant="body1">
                {checkup.notes || 'No notes provided'}
              </Typography>
            </Paper>
            
            {checkup.images && checkup.images.length > 0 && (
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Checkup Images</Typography>
                <Grid container spacing={2}>
                  {checkup.images.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={`/${image.path}`}
                          alt={`Checkup image ${index + 1}`}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {image.description || 'No description provided'}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
          </>
        )}
        
        {checkup.status === 'requested' && (
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              This checkup is waiting for the dentist to review.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You'll be able to see results once the dentist completes the checkup.
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default CheckupDetail;