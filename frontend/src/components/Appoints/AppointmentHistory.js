import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getAppointmentHistory } from '../../services/api'
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material'
import PageTemplate from '../../components/PageTemplate'
import { History as HistoryIcon } from '@mui/icons-material'

const AppointmentHistory = () => {
  const { userData, isLoading: authLoading } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    if (userData?.medicalId) {
      fetchHistory()
    } else {
      setLoading(false)
    }
  }, [userData, authLoading])

  const fetchHistory = async () => {
    try {
      const response = await getAppointmentHistory(userData.medicalId)
      setAppointments(response.data.appointments || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching appointment history:', error)
      setAppointments([])
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'approved':
        return 'success'
      case 'rejected':
        return 'error'
      default:
        return 'default'
    }
  }

  if (authLoading || loading) {
    return (
      <PageTemplate>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        </Container>
      </PageTemplate>
    )
  }

  if (!userData) {
    return (
      <PageTemplate>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" color="error">
              Please log in to view appointment history.
            </Typography>
          </Paper>
        </Container>
      </PageTemplate>
    )
  }

  if (!userData.medicalId) {
    return (
      <PageTemplate>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" color="warning.main">
              Please update your profile with a medical ID to view appointment history.
            </Typography>
          </Paper>
        </Container>
      </PageTemplate>
    )
  }

  return (
    <PageTemplate>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box
            sx={{
              backgroundColor: 'grey.800',
              borderRadius: '50%',
              p: 2,
              mb: 2,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HistoryIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              mb: 2,
            }}
          >
            Appointment History
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ textAlign: 'center', mb: 4, maxWidth: 600 }}
          >
            View your past appointments and medical records
          </Typography>
        </Box>

        {appointments.length === 0 ? (
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(24, 90, 157, 0.1)',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" color="textSecondary">
              No appointment history found
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {appointments.map((appointment) => (
              <Grid item xs={12} md={6} key={appointment._id}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(24, 90, 157, 0.1)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                      <Typography variant="h6">
                        {userData.role === 'doctor' 
                          ? `Patient: ${appointment.patientName || 'Unknown Patient'}`
                          : `Dr. ${appointment.doctorName || 'Unknown Doctor'}`
                        }
                      </Typography>
                      <Chip 
                        label={appointment.status?.toUpperCase() || 'UNKNOWN'} 
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      <strong>Medical ID:</strong> {
                        userData.role === 'doctor' 
                          ? appointment.patientMedicalId || 'N/A'
                          : appointment.doctorMedicalId || 'N/A'
                      }
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Symptoms:</strong> {appointment.symptoms || 'Not specified'}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Contact:</strong> {appointment.contactInfo || 'Not provided'}
                    </Typography>

                    {appointment.scheduledDate && appointment.scheduledTime && (
                      <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'info.contrastText' }}>
                          <strong>Scheduled:</strong> {formatDate(appointment.scheduledDate)} at {appointment.scheduledTime}
                        </Typography>
                      </Box>
                    )}

                    {appointment.doctorResponse && (
                      <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                        <Typography variant="body2" sx={{ color: 'success.contrastText' }}>
                          <strong>Doctor's Response:</strong> {
                            typeof appointment.doctorResponse === 'string' 
                              ? appointment.doctorResponse 
                              : appointment.doctorResponse.message || 'No response provided'
                          }
                        </Typography>
                      </Box>
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Typography variant="caption" color="textSecondary">
                        <strong>Created:</strong> {new Date(appointment.createdAt).toLocaleString()}
                      </Typography>

                      {appointment.messages && appointment.messages.length > 0 && (
                        <Typography variant="caption" color="textSecondary">
                          <strong>Messages:</strong> {appointment.messages.length}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </PageTemplate>
  )
}

export default AppointmentHistory
