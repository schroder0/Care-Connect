import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  getPatientAppointmentRequests,
  addMessageToRequest,
} from '../../services/api'
import {
  Container,
  Paper,
  Typography,
  Chip,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
  CardContent,
  Grid,
} from '@mui/material'
import PageTemplate from '../../components/PageTemplate'
import { Today as TodayIcon } from '@mui/icons-material'

const UpcomingAppointments = () => {
  const { userData, isLoading: authLoading } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [chatDialogOpen, setChatDialogOpen] = useState(false)

  const safeRender = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback
    if (typeof value === 'string' || typeof value === 'number') return value
    if (typeof value === 'object' && value.message) return value.message
    return fallback
  }

  useEffect(() => {
    if (authLoading) return

    if (userData?.medicalId) {
      fetchAppointments()
    } else {
      setLoading(false)
    }
  }, [userData, authLoading])

  const fetchAppointments = async () => {
    try {
      const response = await getPatientAppointmentRequests(userData.medicalId)
      if (response && response.data) {
        const approvedAppointments = (response.data.requests || []).filter(
          (req) => req.status === 'approved'
        )
        setAppointments(approvedAppointments)
      } else {
        setAppointments([])
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setAppointments([])
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedAppointment) return

    try {
      await addMessageToRequest(selectedAppointment._id, {
        message: newMessage,
        senderMedicalId: userData.medicalId,
        senderName: userData.username,
      })
      setNewMessage('')
      fetchAppointments()
      const updatedResponse = await getPatientAppointmentRequests(userData.medicalId)
      const approvedAppointments = (updatedResponse.data.requests || []).filter(
        (req) => req.status === 'approved'
      )
      const updatedAppointment = approvedAppointments.find(
        (r) => r._id === selectedAppointment._id
      )
      setSelectedAppointment(updatedAppointment)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    }
  }

  const openChat = (appointment) => {
    setSelectedAppointment(appointment)
    setChatDialogOpen(true)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const isUpcoming = (dateString, timeString) => {
    const appointmentDateTime = new Date(`${dateString} ${timeString}`)
    return appointmentDateTime > new Date()
  }

  if (loading) {
    return (
      <PageTemplate>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography>Loading upcoming appointments...</Typography>
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
              Please log in to view upcoming appointments.
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
              Please update your profile with a medical ID to view upcoming appointments.
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
              backgroundColor: 'success.main',
              borderRadius: '50%',
              p: 2,
              mb: 2,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TodayIcon sx={{ fontSize: 40 }} />
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
            Upcoming Appointments
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ textAlign: 'center', mb: 4, maxWidth: 600 }}
          >
            View and manage your scheduled appointments
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
              No upcoming appointments found
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
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="start"
                      mb={2}
                    >
                      <Typography variant="h6">
                        Dr. {safeRender(appointment.doctorName, 'Unknown Doctor')}
                      </Typography>
                      <Chip label="APPROVED" color="success" size="small" />
                    </Box>

                    <Typography variant="body2" color="textSecondary">
                      <strong>Doctor Medical ID:</strong>{' '}
                      {safeRender(appointment.doctorMedicalId)}
                    </Typography>

                    {appointment.scheduledDate && appointment.scheduledTime && (
                      <Box
                        sx={{
                          my: 2,
                          p: 2,
                          bgcolor: 'success.light',
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: 'success.contrastText' }}
                        >
                          <strong>Scheduled:</strong>{' '}
                          {formatDate(appointment.scheduledDate)} at{' '}
                          {appointment.scheduledTime}
                        </Typography>
                        {!isUpcoming(
                          appointment.scheduledDate,
                          appointment.scheduledTime
                        ) && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'warning.main',
                              display: 'block',
                              mt: 1,
                              fontWeight: 500,
                            }}
                          >
                            (Past appointment)
                          </Typography>
                        )}
                      </Box>
                    )}

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Symptoms:</strong>{' '}
                      {safeRender(appointment.symptoms, 'Not specified')}
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Contact:</strong>{' '}
                      {safeRender(appointment.contactInfo, 'Not provided')}
                    </Typography>

                    {appointment.doctorResponse && (
                      <Box
                        sx={{
                          mb: 2,
                          p: 2,
                          bgcolor: 'info.light',
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: 'info.contrastText' }}
                        >
                          <strong>Doctor's Response:</strong>{' '}
                          {safeRender(
                            appointment.doctorResponse,
                            'No response provided'
                          )}
                        </Typography>
                      </Box>
                    )}

                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => openChat(appointment)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                        }}
                      >
                        Chat ({appointment.messages?.length || 0})
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog
          open={chatDialogOpen}
          onClose={() => setChatDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <DialogTitle>
            Chat with Dr. {selectedAppointment?.doctorName || 'Doctor'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
              {selectedAppointment?.messages?.map((message, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent sx={{ py: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    >
                      {message.senderName || 'Unknown User'}
                    </Typography>
                    <Typography variant="body2">
                      {message.message || 'No message content'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {message.timestamp
                        ? new Date(message.timestamp).toLocaleString()
                        : 'Unknown time'}
                    </Typography>
                  </CardContent>
                </Card>
              )) || (
                <Typography variant="body2" color="textSecondary">
                  No messages yet
                </Typography>
              )}
            </Box>
            <Divider sx={{ my: 2 }} />
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setChatDialogOpen(false)}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Close
            </Button>
            <Button
              onClick={handleSendMessage}
              variant="contained"
              disabled={!newMessage.trim()}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1a4f8c 0%, #3db892 100%)',
                },
              }}
            >
              Send Message
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </PageTemplate>
  )
}

export default UpcomingAppointments
