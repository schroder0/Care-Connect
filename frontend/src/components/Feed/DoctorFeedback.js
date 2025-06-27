import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import {
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Rating,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Divider,
  Alert,
  Stack,
} from '@mui/material'
import PageTemplate from '../PageTemplate'
import CommentIcon from '@mui/icons-material/Comment'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { format, parseISO } from 'date-fns'

const DoctorFeedback = () => {
  const { userData } = useAuth()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/feedback/doctor/${userData._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        // Format the feedback data and ensure dates are handled properly
        const formattedFeedback = response.data.map(feedback => ({
          ...feedback,
          // If createdAt exists and is a valid date string, format it, otherwise use 'Date not available'
          formattedDate: feedback.createdAt 
            ? format(parseISO(feedback.createdAt), 'PPP')
            : 'Date not available'
        }));
        
        setFeedbacks(formattedFeedback);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError(error.response?.data?.message || 'Failed to load feedback. Please try again later.');
        setLoading(false);
      }
    }

    if (userData?._id) {
      fetchFeedbacks();
    }
  }, [userData?._id]);

  if (loading) {
    return (
      <PageTemplate>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </PageTemplate>
    )
  }

  return (
    <PageTemplate>
      <Box
        sx={{
          maxWidth: '1000px',
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
          <CommentIcon sx={{ fontSize: 40 }} />
          Patient Feedback
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: '12px',
              '& .MuiAlert-message': {
                fontSize: '1rem'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {!error && feedbacks.length === 0 && (
          <Card
            sx={{
              textAlign: 'center',
              p: 4,
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(230, 230, 230, 0.8)',
            }}
          >
            <Stack spacing={2} alignItems="center">
              <CommentIcon sx={{ fontSize: 48, color: '#185a9d' }} />
              <Typography variant="h6" color="text.secondary">
                No feedback received yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                When patients leave feedback, it will appear here.
              </Typography>
            </Stack>
          </Card>
        )}

        {feedbacks.length > 0 && (
          <List sx={{ width: '100%' }}>
            {feedbacks.map((feedback, index) => (
              <React.Fragment key={feedback._id || index}>
                <Card
                  sx={{
                    mb: 2,
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(230, 230, 230, 0.8)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
                    },
                  }}
                >
                  <CardContent>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#185a9d' }}>
                          <AccountCircleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {feedback.patientName || 'Anonymous Patient'}
                            </Typography>
                            <Rating 
                              value={feedback.rating} 
                              readOnly 
                              size="small"
                              sx={{
                                '& .MuiRating-iconFilled': {
                                  color: '#43cea2',
                                },
                              }}
                            />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.secondary',
                                ml: 'auto'
                              }}
                            >
                              {feedback.formattedDate}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'text.primary',
                              mt: 1,
                              lineHeight: 1.7,
                            }}
                          >
                            {feedback.comment}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </CardContent>
                </Card>
              </React.Fragment>
            ))}
          </List>
        )}

        {feedbacks.length === 0 ? (
          <Card
            sx={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
              p: 4,
            }}
          >
            <Typography variant="h6" textAlign="center" color="text.secondary">
              No feedback received yet.
            </Typography>
          </Card>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'transparent' }}>
            {feedbacks.map((feedback, index) => (
              <Card
                key={feedback._id}
                sx={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
                  mb: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(24,90,157,0.2)',
                  },
                }}
              >
                <CardContent>
                  <ListItem
                    alignItems="flex-start"
                    sx={{ px: 0, pt: 0 }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 56,
                          height: 56,
                        }}
                      >
                        <AccountCircleIcon sx={{ fontSize: 32 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: '#185a9d' }}
                          >
                            {feedback.patientId?.username || 'Anonymous'}
                          </Typography>
                          <Rating
                            value={feedback.rating}
                            readOnly
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#43cea2',
                              },
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 'auto' }}
                          >
                            {format(new Date(feedback.date), 'PPP')}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body1"
                          color="text.primary"
                          sx={{
                            mt: 1,
                            lineHeight: 1.8,
                            fontSize: '1.1rem',
                          }}
                        >
                          {feedback.comment}
                        </Typography>
                      }
                    />
                  </ListItem>
                </CardContent>
              </Card>
            ))}
          </List>
        )}
      </Box>
    </PageTemplate>
  )
}

export default DoctorFeedback
