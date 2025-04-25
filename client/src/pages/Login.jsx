import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Container, Typography, Button, Box, Paper, TextField, Grid, CircularProgress } from '@mui/material';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required')
});

const Login = () => {
  const { currentUser, login, loading: authLoading } = useContext(AuthContext); 
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
      const user = await login(values.email, values.password);
      toast.success('Login successful!');
      navigate(user.role === 'patient' ? '/dashboard' : '/dentist/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Login
            </Typography>
            
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values, handleChange }) => (
                <Form>
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
                  
                  <Box mb={3}>
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
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    size="large"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;