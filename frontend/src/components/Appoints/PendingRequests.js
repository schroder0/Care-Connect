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
} from '@mui/material'

const PendingRequests = () => {
  const { userData, isLoading: authLoading } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [chatDialogOpen, setChatDialogOpen] = useState(false)

  useEffect(() => {
    // Don't make API calls while authentication is still loading
    if (authLoading) return

    console.log('PendingRequests - userData:', userData) // Debug log
    if (userData?.medicalId) {
      console.log('Fetching requests for medical ID:', userData.medicalId) // Debug log
      fetchRequests()
    } else {
      console.log('No medical ID found in userData') // Debug log
      setLoading(false)
    }
  }, [userData, authLoading])

  const fetchRequests = async () => {
    try {
      console.log('Making API call to fetch requests for:', userData.medicalId) // Debug log
      console.log(userData.medicalId) // Debug log
      const response = await getPatientAppointmentRequests(userData.medicalId)
      console.log('API response:', response) // Debug log

      if (response && response.data) {
        console.log('API response data:', response.data) // Debug log
        // Filter only pending requests
        const pendingRequests = (response.data.requests || []).filter(req => req.status === 'pending')
        setRequests(pendingRequests)
      } else {
        console.error('Invalid response structure:', response)
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
      fetchRequests() // Refresh to get updated messages
      // Update the selected request to show new message
      const updatedResponse = await getPatientAppointmentRequests(
        userData.medicalId
      )
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
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading pending requests...</Typography>
      </Container>
    )
  }

  if (!userData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="error">
            Please log in to view your pending appointment requests.
          </Typography>
        </Paper>
      </Container>
    )
  }

  if (!userData.medicalId) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="warning.main">
            Please update your profile with a medical ID to view appointment
            requests.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Current user data: {JSON.stringify(userData, null, 2)}
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Appointment Requests
      </Typography>

      {requests.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No pending appointment requests found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Your approved or rejected requests will appear in upcoming appointments or appointment history.
          </Typography>
        </Paper>
      ) : (
        <List>
          {requests.map((request) => (
            <Paper key={request._id} sx={{ mb: 2, p: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="start"
              >
                <Box flex={1}>
                  <Typography variant="h6">Dr. {request.doctorName}</Typography>
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
                        mt: 1,
                        p: 1,
                        bgcolor: 'success.light',
                        borderRadius: 1,
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
                        mt: 1,
                        p: 1,
                        bgcolor: 'info.light',
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: 'info.contrastText' }}
                      >
                        <strong>Doctor&apos;s Response:</strong>{' '}
                        {request.doctorResponse.message}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="end"
                  gap={1}
                >
                  <Chip
                    label={request.status.toUpperCase()}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => openChat(request)}
                  >
                    Chat ({request.messages?.length || 0})
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </List>
      )}

      {/* Chat Dialog */}
      <Dialog
        open={chatDialogOpen}
        onClose={() => setChatDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chat with Dr. {selectedRequest?.doctorName}</DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
            {selectedRequest?.messages?.map((message, index) => (
              <Card key={index} sx={{ mb: 1 }}>
                <CardContent sx={{ py: 1 }}>
                  <Typography variant="subtitle2" color="primary">
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default PendingRequests
