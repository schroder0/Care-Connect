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
  Grid,
  CircularProgress,
} from '@mui/material'

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

  if (authLoading || loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        View your past appointments and medical records
      </Typography>

      {appointments.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No appointment history found
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment._id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {userData.role === 'doctor' 
                      ? `Patient: ${appointment.patientName || 'Unknown Patient'}`
                      : `Dr. ${appointment.doctorName || 'Unknown Doctor'}`
                    }
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Medical ID:</strong> {
                        userData.role === 'doctor' 
                          ? appointment.patientMedicalId || 'N/A'
                          : appointment.doctorMedicalId || 'N/A'
                      }
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Date:</strong> {formatDate(appointment.date)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Time:</strong> {appointment.time}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Status:</strong> {appointment.status || 'Unknown'}
                    </Typography>
                  </Box>
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
