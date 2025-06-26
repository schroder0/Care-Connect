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
  List,
  ListItem,
  ListItemText,
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
import { PendingActions as PendingActionsIcon } from '@mui/icons-material'

const PendingRequests = () => {
  const { userData, isLoading: authLoading } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [chatDialogOpen, setChatDialogOpen] = useState(false)

  useEffect(() => {
    if (authLoading) return

    if (userData?.medicalId) {
      fetchRequests()
    } else {
      setLoading(false)
    }
  }, [userData, authLoading])

  const fetchRequests = async () => {
    try {
      const response = await getPatientAppointmentRequests(userData.medicalId)
      if (response && response.data) {
        const pendingRequests = (response.data.requests || []).filter(req => req.status === 'pending')
        setRequests(pendingRequests)
      } else {
        setRequests([])
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching requests:', error)
      setRequests([])
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRequest) return

    try {
      await addMessageToRequest(selectedRequest._id, {
        message: newMessage,
        senderMedicalId: userData.medicalId,
        senderName: userData.username,
      })
      setNewMessage('')
      fetchRequests()
      const updatedResponse = await getPatientAppointmentRequests(userData.medicalId)
      const updatedRequest = updatedResponse.data.requests.find(
        (r) => r._id === selectedRequest._id
      )
      setSelectedRequest(updatedRequest)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    }
  }

  const openChat = (request) => {
    setSelectedRequest(request)
    setChatDialogOpen(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'approved':
        return 'success'
      case 'rejected':
        return 'error'
      case 'cancelled':
        return 'default'
      default:
        return 'default'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (timeString) => {
    return timeString
  }

  if (loading) {
    return (
      <PageTemplate>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography>Loading pending requests...</Typography>
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
              Please log in to view your pending appointment requests.
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
              Please update your profile with a medical ID to view appointment requests.
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
              backgroundColor: 'warning.main',
              borderRadius: '50%',
              p: 2,
              mb: 2,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PendingActionsIcon sx={{ fontSize: 40 }} />
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
            Pending Requests
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ textAlign: 'center', mb: 4, maxWidth: 600 }}
          >
            Track the status of your appointment requests
          </Typography>
        </Box>

        {requests.length === 0 ? (
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
              No pending appointment requests found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Your approved or rejected requests will appear in upcoming appointments or appointment history.
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {requests.map((request) => (
              <Grid item xs={12} md={6} key={request._id}>
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
                      <Typography variant="h6">Dr. {request.doctorName}</Typography>
                      <Chip
                        label={request.status.toUpperCase()}
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="textSecondary">
                      Preferred Date: {formatDate(request.preferredDate)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Preferred Time: {formatTime(request.preferredTime)}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Symptoms: {request.symptoms}
                    </Typography>

                    {request.status === 'approved' && request.scheduledDate && (
                      <Box
                        sx={{
                          mt: 2,
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
                          {formatDate(request.scheduledDate)} at{' '}
                          {request.scheduledTime}
                        </Typography>
                      </Box>
                    )}

                    {request.doctorResponse && (
                      <Box
                        sx={{
                          mt: 2,
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
                          {request.doctorResponse.message}
                        </Typography>
                      </Box>
                    )}

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => openChat(request)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                        }}
                      >
                        Chat ({request.messages?.length || 0})
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
          <DialogTitle>Chat with Dr. {selectedRequest?.doctorName}</DialogTitle>
          <DialogContent>
            <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
              {selectedRequest?.messages?.map((message, index) => (
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
                      {message.senderName}
                    </Typography>
                    <Typography variant="body2">{message.message}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(message.timestamp).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
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

export default PendingRequests
