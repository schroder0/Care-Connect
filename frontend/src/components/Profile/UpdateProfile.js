import React, { useState, useEffect } from 'react'
import { fetchProfile } from './profileUtils'
import { useAuth } from '../../contexts/AuthContext'
import { updateProfile } from '../../services/api'
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from '@mui/material'

const API_URL = 'http://localhost:5001/api'

const UpdateProfile = () => {
  const { userData, isLoading: authLoading } = useAuth()
  const userId = userData?.id
  const [formData, setFormData] = useState({
    userId,
    username: '',
    email: '',
    phoneNumber: '',
    medicalId: '',
    specialty: '',
    location: '',
  })
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    medicalId: '',
    profilePicture: '',
    role: '',
    specialty: '',
    location: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Don't fetch profile while authentication is still loading
    if (authLoading) return

    fetchProfile(userData, setLoading, setProfile, API_URL)
  }, [userData, authLoading])
  // Update formData when profile is loaded
  useEffect(() => {
    if (profile.username) {
      setFormData({
        userId,
        username: profile.username,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        medicalId: profile.medicalId,
        specialty: profile.specialty || '',
        location: profile.location || '',
      })
    }
  }, [profile, userId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
      .then((response) => {
        console.log(response.data) // eslint-disable-line no-console
        alert('Profile updated successfully')
        // Update the profile state to reflect the changes
        setProfile({
          ...profile,
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          medicalId: formData.medicalId,
          specialty: formData.specialty,
          location: formData.location,
        })
      })
      .catch((error) => {
        console.error(error) // eslint-disable-line no-console
        alert('Failed to update profile')
      })
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Update Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          {' '}
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />{' '}
          <TextField
            label="Medical ID"
            name="medicalId"
            value={formData.medicalId}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          {/* Doctor-specific fields */}
          {profile.role === 'doctor' && (
            <>
              <TextField
                label="Specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="e.g., Cardiology, Dermatology, Internal Medicine"
              />
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="e.g., City Hospital, Downtown Clinic"
              />
            </>
          )}
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Update Profile
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}

export default UpdateProfile
