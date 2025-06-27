import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  TextField,
  Button,
  Typography,
  Rating,
  Box,
  Card,
  CardContent,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import PageTemplate from '../PageTemplate'
import FeedbackIcon from '@mui/icons-material/Feedback'
import axios from 'axios'

const FeedbackForm = () => {
  const { userData } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  // Fetch doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true)
      try {
        const response = await axios.get('http://localhost:5001/api/doctors', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Process and validate the doctor data
        const doctorsList = Array.isArray(response.data) ? response.data : [];
        const validDoctors = doctorsList.filter(doctor => 
          doctor && doctor._id && (doctor.firstName || doctor.lastName)
        );

        if (validDoctors.length === 0) {
          console.warn('No valid doctors found in response:', response.data);
          setSnackbar({
            open: true,
            message: 'No doctors are currently available',
            severity: 'info'
          });
        }

        setDoctors(validDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Failed to load doctors list',
          severity: 'error'
        });
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedDoctor) {
      setSnackbar({
        open: true,
        message: 'Please select a doctor',
        severity: 'error'
      })
      return
    }

    if (rating === 0) {
      setSnackbar({
        open: true,
        message: 'Please provide a rating',
        severity: 'error'
      })
      return
    }

    if (!comment.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide a comment',
        severity: 'error'
      })
      return
    }

    setLoading(true)

    const feedbackData = {
      doctorId: selectedDoctor,
      patientId: userData._id,
      rating,
      comment: comment.trim()
    }

    try {
      const response = await axios.post('http://localhost:5001/api/feedback', feedbackData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setSnackbar({
        open: true,
        message: 'Feedback submitted successfully',
        severity: 'success'
      })
      // Reset form
      setRating(0)
      setComment('')
      setSelectedDoctor('')
    } catch (error) {
      console.error('Feedback submission error:', error)
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to submit feedback',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <PageTemplate>
      <Box
        sx={{
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
          animation: 'fadeIn 1s ease-out',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <FeedbackIcon sx={{ fontSize: 40 }} />
          Share Your Experience
        </Typography>

        <Card
          sx={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(24,90,157,0.2)',
            },
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
                <Select
                  labelId="doctor-select-label"
                  value={selectedDoctor}
                  label="Select Doctor"
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required
                  disabled={loadingDoctors}
                >
                  {loadingDoctors ? (
                    <MenuItem value="">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={20} />
                        <span>Loading doctors...</span>
                      </Box>
                    </MenuItem>
                  ) : doctors.length === 0 ? (
                    <MenuItem value="">No doctors available</MenuItem>
                  ) : (
                    doctors
                      .sort((a, b) => {
                        // Sort by last name, then first name
                        const lastNameCompare = a.lastName?.localeCompare(b.lastName || '');
                        return lastNameCompare !== 0 ? lastNameCompare : a.firstName?.localeCompare(b.firstName || '');
                      })
                      .map((doctor) => (
                        <MenuItem 
                          key={doctor._id} 
                          value={doctor._id}
                          sx={{
                            py: 1.5,
                            '&:hover': {
                              background: 'rgba(67, 206, 162, 0.08)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Dr. {doctor.firstName || ''} {doctor.lastName || ''}
                            </Typography>
                            {doctor.specialty && (
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {doctor.specialty}
                              </Typography>
                            )}
                          </Box>
                        </MenuItem>
                      ))
                  )}
                </Select>
              </FormControl>

              <Box
                marginBottom={4}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  component="legend"
                  variant="h6"
                  sx={{ color: '#185a9d', fontWeight: 600 }}
                >
                  Rate your experience
                </Typography>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue)
                  }}
                  size="large"
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#43cea2',
                    },
                    '& .MuiRating-iconHover': {
                      color: '#185a9d',
                    },
                  }}
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Your Comments"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                sx={{ mb: 4 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                  color: 'white',
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1b4f8f 0%, #3ab891 100%)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PageTemplate>
  )
}

export default FeedbackForm
