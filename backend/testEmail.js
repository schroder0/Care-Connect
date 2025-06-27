// Test script for email service
// This is a standalone test file to verify email configuration
// Run with: node testEmail.js

require('dotenv').config()
const { sendAppointmentConfirmationEmail } = require('./services/emailService')

async function testEmailService() {
  console.log('Testing email service...')
  
  // Check if environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email environment variables not set!')
    console.log('Please set EMAIL_USER and EMAIL_PASS in your .env file')
    return
  }

  console.log('Email user:', process.env.EMAIL_USER)
  
  // Test data
  const testAppointmentDetails = {
    patientName: 'Test Patient',
    doctorName: 'Test Doctor',
    symptoms: 'Test symptoms',
    scheduledDate: new Date().toISOString(),
    scheduledTime: '10:00 AM',
    doctorResponse: 'Test doctor response'
  }

  try {
    const result = await sendAppointmentConfirmationEmail(
      'test-patient@example.com', // Replace with a real email for testing
      'test-doctor@example.com',  // Replace with a real email for testing
      testAppointmentDetails
    )

    if (result.success) {
      console.log('✅ Email test successful!')
      console.log('Patient email ID:', result.patientEmailId)
      console.log('Doctor email ID:', result.doctorEmailId)
    } else {
      console.log('❌ Email test failed:', result.error)
    }
  } catch (error) {
    console.error('❌ Email test error:', error.message)
  }
}

// Run the test
testEmailService()
