import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  getDoctorAppointmentRequests,
  updateAppointmentRequestStatus,
  addMessageToRequest,
} from '../../services/api'
import {
  Container,
  Paper,
  Typography,
  List,
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

const DoctorPendingRequests = () => {
  const { userData, isLoading: authLoading } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [chatDialogOpen, setChatDialogOpen] = useState(false)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [doctorResponse, setDoctorResponse] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [actionType, setActionType] = useState('') // 'approve' or 'reject'

  useEffect(() => {
    // Don't make API calls while authentication is still loading
    if (authLoading) return

    console.log('DoctorPendingRequests - userData:', userData) // Debug log
    if (userData?.medicalId) {
      console.log(
        'Fetching doctor requests for medical ID:',
        userData.medicalId
      ) // Debug log
      fetchRequests()
    } else {
      console.log('No medical ID found in userData') // Debug log
      setLoading(false)
    }
  }, [userData, authLoading])

  const fetchRequests = async () => {
    try {
      console.log(
        'Making API call to fetch doctor requests for:',
        userData.medicalId
      ) // Debug log
      const response = await getDoctorAppointmentRequests(userData.medicalId)
      console.log('Doctor API response:', response.data) // Debug log
      
      // Filter only pending requests
      const pendingRequests = (response.data.requests || []).filter(req => req.status === 'pending')
      setRequests(pendingRequests)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching requests:', error)
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
      // Update the selected request
      const updatedResponse = await getDoctorAppointmentRequests(
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

  const handleApproveReject = async () => {
    if (!selectedRequest) return

    const updateData = {
      status: actionType,
      doctorResponse: doctorResponse,
    }

    if (actionType === 'approved') {
      if (!scheduledDate || !scheduledTime) {
        alert('Please provide scheduled date and time for approval')
        return
      }
      updateData.scheduledDate = scheduledDate
      updateData.scheduledTime = scheduledTime
    }

    try {
      await updateAppointmentRequestStatus(selectedRequest._id, updateData)
      alert(`Appointment request ${actionType} successfully`)
      setActionDialogOpen(false)
      setDoctorResponse('')
      setScheduledDate('')
      setScheduledTime('')
      fetchRequests()
    } catch (error) {
      console.error('Error updating request:', error)
      alert('Failed to update request')
    }
  }

  const openChat = (request) => {
    setSelectedRequest(request)
    setChatDialogOpen(true)
  }

  const openActionDialog = (request, action) => {
    setSelectedRequest(request)
    setActionType(action)
    setActionDialogOpen(true)
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading appointment requests...</Typography>
      </Container>
    )
  }

  if (!userData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h6" color="error">
            Please log in to view appointment requests.
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Appointment Requests
      </Typography>

      {requests.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No pending appointment requests found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            All requests have been processed. Check upcoming appointments for approved requests.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {requests.map((request) => (
            <Grid item xs={12} md={6} key={request._id}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="start"
                  mb={2}
                >
                  <Typography variant="h6">{request.patientName}</Typography>
                  <Chip
                    label={request.status.toUpperCase()}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="textSecondary">
                  <strong>Medical ID:</strong> {request.patientMedicalId}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Preferred Date:</strong>{' '}
                  {formatDate(request.preferredDate)}
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  <strong>Preferred Time:</strong> {request.preferredTime}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Symptoms:</strong> {request.symptoms}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Contact:</strong> {request.contactInfo}
                </Typography>

                {request.status === 'approved' && request.scheduledDate && (
                  <Box
                    sx={{
                      mb: 2,
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

                <Box display="flex" gap={1} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => openChat(request)}
                  >
                    Chat ({request.messages?.length || 0})
                  </Button>

                  {request.status === 'pending' && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => openActionDialog(request, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => openActionDialog(request, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Chat Dialog */}
      <Dialog
        open={chatDialogOpen}
        onClose={() => setChatDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chat with {selectedRequest?.patientName}</DialogTitle>
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

      {/* Action Dialog (Approve/Reject) */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionType === 'approved' ? 'Approve' : 'Reject'} Appointment Request
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Response Message"
            value={doctorResponse}
            onChange={(e) => setDoctorResponse(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            placeholder={`Enter your ${actionType === 'approved' ? 'approval' : 'rejection'} message...`}
          />

          {actionType === 'approved' && (
            <>
              <TextField
                fullWidth
                type="date"
                label="Scheduled Date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="time"
                label="Scheduled Time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color={actionType === 'approved' ? 'success' : 'error'}
            onClick={handleApproveReject}
          >
            {actionType === 'approved' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default DoctorPendingRequests
