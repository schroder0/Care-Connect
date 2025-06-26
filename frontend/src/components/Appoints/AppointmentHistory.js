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

const AppointmentHistory = () => {
  const { userData, isLoading: authLoading } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Don't fetch while authentication is still loading
    if (authLoading) return
    
    if (userData?.medicalId) {
      console.log('Fetching appointment history for medical ID:', userData.medicalId)
      fetchHistory()
    } else {
      console.log('No medical ID found in userData')
      setLoading(false)
    }
  }, [userData, authLoading])

  const fetchHistory = async () => {
    try {
      console.log('Making API call to fetch appointment history for:', userData.medicalId)
      const response = await getAppointmentHistory(userData.medicalId)
      console.log('Appointment history API response:', response.data)
      
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
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (!userData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="error">
            Please log in to view appointment history.
          </Typography>
        </Paper>
      </Container>
    )
  }

  if (!userData.medicalId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="warning.main">
            Please update your profile with a medical ID to view appointment history.
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Appointment History
      </Typography>

      {appointments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No appointment history found
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6">
                      {userData.role === 'doctor' 
                        ? `Patient: ${appointment.patientName || 'Unknown Patient'}`
                        : `Doctor: ${appointment.doctorName || 'Unknown Doctor'}`
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
                    <Box sx={{ mb: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ color: 'info.contrastText' }}>
                        <strong>Scheduled:</strong> {formatDate(appointment.scheduledDate)} at {appointment.scheduledTime}
                      </Typography>
                    </Box>
                  )}

                  {appointment.doctorResponse && (
                    <Box sx={{ mb: 2, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ color: 'success.contrastText' }}>
                        <strong>Doctor&apos;s Response:</strong> {
                          typeof appointment.doctorResponse === 'string' 
                            ? appointment.doctorResponse 
                            : appointment.doctorResponse.message || 'No response provided'
                        }
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="caption" color="textSecondary">
                    <strong>Created:</strong> {new Date(appointment.createdAt).toLocaleString()}
                  </Typography>

                  {appointment.messages && appointment.messages.length > 0 && (
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                      <strong>Messages:</strong> {appointment.messages.length} message(s)
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default AppointmentHistory
