import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  createAppointmentRequest,
  getAllDoctors,
  getProfile,
} from '../../services/api'
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Paper,
  Box,
  Card,
  CardContent,
} from '@mui/material'
import PageTemplate from '../../components/PageTemplate'
import { EventAvailable as EventAvailableIcon } from '@mui/icons-material'

const BookAppointment = () => {
  const { userData, setUserData, isLoading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    doctorMedicalId: '',
    patientMedicalId: userData?.medicalId || '',
    preferredDate: '',
    preferredTime: '',
    symptoms: '',
    contactInfo: '',
    notificationType: 'email',
  })
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProfileLoading, setUserProfileLoading] = useState(false)

  // Fetch all doctors when component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getAllDoctors()
        setDoctors(response.data.doctors || [])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching doctors:', error)
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  // Auto-populate patient medical ID if user is logged in
  useEffect(() => {
    if (authLoading) return

    if (userData?.medicalId) {
      setFormData((prevData) => ({
        ...prevData,
        patientMedicalId: userData.medicalId,
      }))
    } else if (userData?.id && !userProfileLoading) {
      setUserProfileLoading(true)
      getProfile(userData.id)
        .then((response) => {
          const fullUserData = response.data.user
          setUserData(fullUserData)
          setFormData((prevData) => ({
            ...prevData,
            patientMedicalId: fullUserData.medicalId || '',
          }))
          setUserProfileLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error)
          setUserProfileLoading(false)
        })
    }
  }, [userData, setUserData, userProfileLoading, authLoading])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!userData?.medicalId) {
      alert('Please update your profile with a medical ID before booking an appointment.')
      return
    }

    const data = { ...formData }
    createAppointmentRequest(data)
      .then((response) => {
        console.log(response.data)
        alert('Appointment request submitted successfully! Please check your pending requests for updates.')
        setFormData({
          doctorMedicalId: '',
          patientMedicalId: userData?.medicalId || '',
          preferredDate: '',
          preferredTime: '',
          symptoms: '',
          contactInfo: '',
          notificationType: 'email',
        })
      })
      .catch((error) => {
        console.error(error)
        alert(`Failed to submit appointment request: ${error.response?.data?.message || error.message}`)
      })
  }

  return (
    <PageTemplate>
      <Container maxWidth="md" sx={{ my: 4 }}>
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
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              p: 2,
              mb: 2,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EventAvailableIcon sx={{ fontSize: 40 }} />
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
            Book Appointment
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ textAlign: 'center', mb: 4, maxWidth: 600 }}
          >
            Schedule a consultation with one of our healthcare professionals
          </Typography>
        </Box>

        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(24, 90, 157, 0.1)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  name="doctorMedicalId"
                  value={formData.doctorMedicalId}
                  onChange={handleChange}
                  label="Select Doctor"
                  required
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.medicalId} value={doctor.medicalId}>
                      Dr. {doctor.username} - {doctor.specialization}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Your Medical ID"
                name="patientMedicalId"
                value={
                  userProfileLoading
                    ? 'Loading your medical ID...'
                    : formData.patientMedicalId || 'No medical ID found'
                }
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                disabled={true}
                helperText={
                  userProfileLoading
                    ? 'Fetching your medical ID from profile...'
                    : userData?.medicalId
                      ? 'Automatically filled from your profile'
                      : 'Please update your profile with a medical ID'
                }
                error={!userProfileLoading && !userData?.medicalId}
              />

              <TextField
                type="date"
                label="Preferred Date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                required
              />

              <TextField
                type="time"
                label="Preferred Time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                required
              />

              <TextField
                label="Symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                required
                placeholder="Please describe your symptoms in detail..."
              />

              <TextField
                label="Contact Info"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                placeholder="Enter your preferred contact information"
              />

              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Notification Preference</InputLabel>
                <Select
                  name="notificationType"
                  value={formData.notificationType}
                  onChange={handleChange}
                  label="Notification Preference"
                  required
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="sms">SMS</MenuItem>
                </Select>
              </FormControl>

              <Box mt={4} display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    minWidth: 200,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1a4f8c 0%, #3db892 100%)',
                    },
                  }}
                  disabled={!userData?.medicalId || userProfileLoading}
                >
                  {userProfileLoading ? 'Loading...' : 'Book Appointment'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </PageTemplate>
  )
}

export default BookAppointment
