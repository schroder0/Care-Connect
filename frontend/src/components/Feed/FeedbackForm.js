import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { createFeedback } from '../../services/api'
import {
  TextField,
  Button,
  Typography,
  Rating,
  Box,
  Card,
  CardContent,
  Alert,
  Snackbar,
} from '@mui/material'
import PageTemplate from '../../components/PageTemplate'
import FeedbackIcon from '@mui/icons-material/Feedback'

const FeedbackForm = () => {
  const { userData } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { userId: userData.id, rating, comment }
    createFeedback(data)
      .then((response) => {
        setSnackbar({ open: true, message: 'Feedback submitted successfully', severity: 'success' })
        setRating(0)
        setComment('')
      })
      .catch((error) => {
        console.error(error)
        setSnackbar({ open: true, message: 'Failed to submit feedback', severity: 'error' })
      })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <PageTemplate>
      <Box
        sx={{
          maxWidth: '800px',
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
          <FeedbackIcon sx={{ fontSize: 40 }} />
          Share Your Experience
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
            <form onSubmit={handleSubmit}>
              <Box
                marginBottom={4}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  component="legend"
                  variant="h6"
                  sx={{ color: '#185a9d', fontWeight: 600 }}
                >
                  How would you rate your experience?
                </Typography>
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue || 0)
                  }}
                  size="large"
                  sx={{
                    fontSize: '2rem',
                    '& .MuiRating-iconFilled': {
                      color: '#43cea2',
                    },
                  }}
                />
              </Box>
              <TextField
                label="Share your thoughts"
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
                multiline
                rows={6}
                margin="normal"
                variant="outlined"
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#185a9d',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#43cea2',
                    },
                  },
                }}
              />
              <Box mt={2} display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                    borderRadius: '30px',
                    padding: '12px 48px',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 20px rgba(24,90,157,0.3)',
                    },
                  }}
                >
                  Submit Feedback
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PageTemplate>
  )
}

export default FeedbackForm
