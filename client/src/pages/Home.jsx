// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper, Grid } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minHeight: '50vh',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom align="center">
              Welcome to Dental Checkup System
            </Typography>
            <Typography variant="h6" paragraph align="center" sx={{ mb: 4 }}>
              This platform connects patients with dentists for virtual dental checkups.
            </Typography>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button variant="contained" component={Link} to="/register" size="large">
                Register
              </Button>
              <Button variant="outlined" component={Link} to="/login" size="large">
                Login
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;