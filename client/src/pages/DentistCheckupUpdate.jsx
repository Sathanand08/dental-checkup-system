import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  Container, Typography, Button, Box, Paper, TextField, 
  CircularProgress, Grid, Card, CardContent, IconButton
} from '@mui/material';

const DentistCheckupUpdate = () => {
  const { checkupId } = useParams();
  const navigate = useNavigate();
  const [checkup, setCheckup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState([]);
  const [imageDescriptions, setImageDescriptions] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const fetchCheckup = async () => {
      try {
        const response = await api.get(`/api/checkups/${checkupId}`);
        setCheckup(response.data);
        setNotes(response.data.notes || '');
        
        // If there are already images, set their descriptions
        if (response.data.images && response.data.images.length > 0) {
          const descriptions = response.data.images.map(img => img.description || '');
          setImageDescriptions(descriptions);
        }
      } catch (error) {
        toast.error('Failed to fetch checkup details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCheckup();
  }, [checkupId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    
    // Generate previews for new images
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
    
    // Initialize descriptions for new images
    setImageDescriptions([...imageDescriptions, ...files.map(() => '')]);
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...imageDescriptions];
    newDescriptions[index] = value;
    setImageDescriptions(newDescriptions);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewImages];
    const newDescriptions = [...imageDescriptions];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    newDescriptions.splice(index, 1);
    
    setImages(newImages);
    setPreviewImages(newPreviews);
    setImageDescriptions(newDescriptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append('notes', notes);
      
      images.forEach((image, index) => {
        formData.append('images', image);
        formData.append('descriptions', imageDescriptions[index]);
      });
      
      await api.put(`/api/checkups/${checkupId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Checkup updated successfully');
      navigate('/dentist/dashboard');
    } catch (error) {
      toast.error('Failed to update checkup');
    } finally {
      setSubmitting(false);
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
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Update Checkup
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">
            Patient: {checkup.patient.name}
          </Typography>
          <Typography variant="body1">
            Email: {checkup.patient.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Requested: {new Date(checkup.createdAt).toLocaleDateString()}
          </Typography>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Dentist Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Add your notes about the checkup here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Box>
            
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Upload Images
              </Typography>
              <input
                accept="image/*"
                id="upload-image"
                type="file"
                multiple
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="upload-image">
                <Button variant="contained" component="span">
                  Upload Images
                </Button>
              </label>
            </Box>
            
            {previewImages.length > 0 && (
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Uploaded Images
                </Typography>
                <Grid container spacing={2}>
                  {previewImages.map((preview, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card>
                        <img 
                          src={preview} 
                          alt={`Preview ${index}`} 
                          style={{ 
                            width: '100%', 
                            height: '150px', 
                            objectFit: 'cover' 
                          }} 
                        />
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                              fullWidth
                              size="small"
                              placeholder="Image description"
                              value={imageDescriptions[index] || ''}
                              onChange={(e) => handleDescriptionChange(index, e.target.value)}
                            />
                            <Button 
                              color="error" 
                              onClick={() => removeImage(index)}
                              size="small"
                            >
                              Remove
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              sx={{ mt: 2 }}
            >
              {submitting ? 'Updating...' : 'Update Checkup'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default DentistCheckupUpdate;