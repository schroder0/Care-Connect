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
} from '@mui/material'

const BookAppointment = () => {
  const { userData, setUserData, isLoading: authLoading } = useAuth() // Get userData from AuthContext
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
    // Don't process user data while authentication is still loading
    if (authLoading) return

    if (userData?.medicalId) {
      setFormData((prevData) => ({
        ...prevData,
        patientMedicalId: userData.medicalId,
      }))
    } else if (userData?.id && !userProfileLoading) {
      // If userData exists but medicalId is missing, fetch full profile
      setUserProfileLoading(true)
      getProfile(userData.id)
        .then((response) => {
          const fullUserData = response.data.user
          // Update the AuthContext with the full user data
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

    // Validate that user has a medical ID
    if (!userData?.medicalId) {
      alert(
        'Please update your profile with a medical ID before booking an appointment.'
      )
      return
    }

    const data = { ...formData } // Send formData directly with medical IDs
    console.log('Submitting appointment request with data:', data) // Debug log
    console.log('Making POST request to /api/appointment-requests') // Debug log
    createAppointmentRequest(data)
      .then((response) => {
        console.log(response.data) // eslint-disable-line no-console
        alert(
          'Appointment request submitted successfully! Please check your pending requests for updates.'
        )
        // Reset form but keep patient medical ID
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
        console.error(error) // eslint-disable-line no-console
        alert(
          `Failed to submit appointment request: ${error.response?.data?.message || error.message}`
        )
      })
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Request Appointment
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Select Doctor *</InputLabel>
            <Select
              name="doctorMedicalId"
              value={formData.doctorMedicalId}
              onChange={handleChange}
              label="Select Doctor *"
              disabled={loading}
            >
              {loading ? (
                <MenuItem disabled>Loading doctors...</MenuItem>
              ) : doctors.length === 0 ? (
                <MenuItem disabled>No doctors available</MenuItem>
              ) : (
                doctors.map((doctor) => {
                  const displayText = `${doctor.username}${
                    doctor.specialty ? ` - ${doctor.specialty}` : ''
                  }${doctor.location ? ` (${doctor.location})` : ''} [ID: ${doctor.medicalId}]`

                  return (
                    <MenuItem key={doctor._id} value={doctor.medicalId}>
                      {displayText}
                    </MenuItem>
                  )
                })
              )}
            </Select>
            <FormHelperText>
              Select a doctor from the list. The medical ID will be
              automatically filled.
            </FormHelperText>
          </FormControl>
          <TextField
            label="Patient Medical ID"
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
          />
          <TextField
            label="Symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Contact Info"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Notification Type</InputLabel>
            <Select
              name="notificationType"
              value={formData.notificationType}
              onChange={handleChange}
              label="Notification Type"
            >
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="sms">SMS</MenuItem>
            </Select>
          </FormControl>
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={!userData?.medicalId || userProfileLoading}
            >
              {userProfileLoading ? 'Loading...' : 'Book Appointment'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}

export default BookAppointment
