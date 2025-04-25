import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Paper, Box } from '@mui/material';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" component={Link} to="/">
            Go Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;