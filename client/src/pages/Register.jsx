import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Container, Typography, Button, Box, Paper, TextField, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl, CircularProgress } from '@mui/material';

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().oneOf(['patient', 'dentist'], 'Invalid role').required('Role is required')
});

const Register = () => {
  const { currentUser, register, loading: authLoading } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate(currentUser.role === 'patient' ? '/dashboard' : '/dentist/dashboard');
    }
  }, [currentUser, authLoading, navigate]);

  if (authLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (currentUser) {
    return null;
  }

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await register(values);
      toast.success('Registration successful!');
      navigate(values.role === 'patient' ? '/dashboard' : '/dentist/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Register
        </Typography>
        
        <Formik
          initialValues={{ name: '', email: '', password: '', role: 'patient' }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange }) => (
            <Form>
              <Box mb={2}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  margin="normal"
                />
              </Box>
              
              <Box mb={2}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  margin="normal"
                />
              </Box>
              
              <Box mb={2}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  margin="normal"
                />
              </Box>
              
              <Box mb={3}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Register as</FormLabel>
                  <RadioGroup
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel value="patient" control={<Radio />} label="Patient" />
                    <FormControlLabel value="dentist" control={<Radio />} label="Dentist" />
                  </RadioGroup>
                </FormControl>
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default Register;