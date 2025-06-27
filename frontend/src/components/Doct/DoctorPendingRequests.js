import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getDoctorAppointmentRequests,
  updateAppointmentRequestStatus,
  addMessageToRequest,
} from '../../services/api';
import {
  Container,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';

const DoctorPendingRequests = () => {
  const { userData } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    if (userData?.medicalId) {
      fetchRequests();
    }
  }, [userData]);

  const fetchRequests = async () => {
    try {
      const response = await getDoctorAppointmentRequests(userData.medicalId);
      // Filter only pending requests
      const pendingRequests = (response.data.requests || []).filter(req => req.status === 'pending');
      setRequests(pendingRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await updateAppointmentRequestStatus(requestId, {
        status: 'approved',
        doctorResponse: 'Appointment approved'
      });
      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await updateAppointmentRequestStatus(requestId, {
        status: 'rejected',
        doctorResponse: 'Appointment rejected'
      });
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleChat = async (request) => {
    setSelectedRequest(request);
    setChatMessages(request.messages || []);
    setChatOpen(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedRequest) return;

    try {
      await addMessageToRequest(selectedRequest._id, {
        message: message.trim(),
        senderMedicalId: userData.medicalId,
        senderName: userData.username,
      });
      setMessage('');
      fetchRequests();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Appointment Requests
      </Typography>

      <Grid container spacing={3}>
        {requests.map((request) => (
          <Grid item xs={12} key={request._id}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {request.patientName}
                  </Typography>
                  <Chip
                    label="PENDING"
                    color="warning"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Medical ID:</strong> {request.patientMedicalId}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Preferred Date:</strong>{' '}
                    {format(new Date(request.preferredDate), 'dd/MM/yyyy')}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Preferred Time:</strong> {request.preferredTime}
                  </Typography>
                  {request.symptoms && (
                    <Typography variant="body1">
                      <strong>Symptoms:</strong> {request.symptoms}
                    </Typography>
                  )}
                  <Typography variant="body1">
                    <strong>Contact:</strong> {request.contactInfo}
                  </Typography>
                </Box>

                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleChat(request)}
                  >
                    CHAT ({request.messages?.length || 0})
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(request._id)}
                    sx={{ ml: 1 }}
                  >
                    APPROVE
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleReject(request._id)}
                    sx={{ ml: 1 }}
                  >
                    REJECT
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}

        {requests.length === 0 && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                No pending appointment requests
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Chat Dialog */}
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Chat with {selectedRequest?.patientName}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2, maxHeight: '300px', overflowY: 'auto' }}>
            {chatMessages.map((msg, index) => (
              <Paper
                key={index}
                sx={{
                  p: 1,
                  mb: 1,
                  bgcolor: msg.sender === userData.medicalId ? 'primary.light' : 'background.default',
                  color: msg.sender === userData.medicalId ? 'primary.contrastText' : 'text.primary',
                }}
              >
                <Typography variant="caption" display="block">
                  {msg.senderName} - {format(new Date(msg.timestamp), 'MMM d, HH:mm')}
                </Typography>
                <Typography variant="body2">{msg.message}</Typography>
              </Paper>
            ))}
          </Box>
          <TextField
            fullWidth
            multiline
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatOpen(false)}>Close</Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={!message.trim()}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorPendingRequests;
