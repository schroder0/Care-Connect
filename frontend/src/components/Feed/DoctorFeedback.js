import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
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
} from '@mui/material'
import PageTemplate from '../../components/PageTemplate'
import CommentIcon from '@mui/icons-material/Comment'
import { format } from 'date-fns'

const DoctorFeedback = () => {
  const { userData, authLoading } = useAuth()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    fetch(`/api/feedback/${userData._id}`)
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching feedback:', error)
        setLoading(false)
      })
  }, [userData._id, authLoading])

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
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
            {feedbacks.length === 0 ? (
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  color: '#666',
                  py: 4,
                }}
              >
                No feedback received yet
              </Typography>
            ) : (
              <List sx={{ width: '100%' }}>
                {feedbacks.map((feedback, index) => (
                  <React.Fragment key={feedback._id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        py: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(67,206,162,0.1)',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: '#185a9d',
                            width: 50,
                            height: 50,
                            fontSize: '1.5rem',
                          }}
                        >
                          {feedback.patientId.username[0].toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ mb: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: '#185a9d',
                                mb: 0.5,
                              }}
                            >
                              {feedback.patientId.username}
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
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{
                                color: '#666',
                                mb: 1,
                                fontStyle: 'italic',
                              }}
                            >
                              "{feedback.comment}"
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#999',
                              }}
                            >
                              {format(new Date(feedback.createdAt), 'MMMM d, yyyy')}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < feedbacks.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    </PageTemplate>
  )
}

export default DoctorFeedback
