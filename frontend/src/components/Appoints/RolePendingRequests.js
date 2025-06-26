import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import PendingRequests from './PendingRequests'
import DoctorPendingRequests from '../Doct/DoctorPendingRequests'
import { Typography, Container } from '@mui/material'

const RolePendingRequests = () => {
  const { userRole, userData, isAuthenticated } = useAuth()

  console.log('RolePendingRequests: User role:', userRole)
  console.log('RolePendingRequests: User data:', userData)
  console.log('RolePendingRequests: Is authenticated:', isAuthenticated)

  // Render appropriate component based on user role
  if (userRole === 'doctor') {
    console.log('RolePendingRequests: Rendering DoctorPendingRequests')
    return <DoctorPendingRequests />
  } else if (userRole === 'patient') {
    console.log('RolePendingRequests: Rendering PendingRequests (patient)')
    return <PendingRequests />
  } else {
    console.log('RolePendingRequests: Unknown role, showing access denied')
    return (
      <Container>
        <Typography variant="h6" color="error">
          Access denied. Only patients and doctors can view pending requests.
          Current role: {userRole || 'undefined'}
        </Typography>
      </Container>
    )
  }
}

export default RolePendingRequests
