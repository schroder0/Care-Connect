require('dotenv').config()
const { sendAppointmentApprovalEmail } = require('./services/emailService')

// Test email functionality
async function testEmail() {
  try {
    console.log('Testing email service...')
    console.log('EMAIL_USER:', process.env.EMAIL_USER)
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set')
    
    await sendAppointmentApprovalEmail(
      'test@example.com',
      'Test Patient',
      'Dr. Test Doctor',
      new Date('2025-01-15'),
      '10:00 AM',
      'This is a test appointment approval'
    )
    
    console.log('Test email sent successfully!')
  } catch (error) {
    console.error('Email test failed:', error.message)
  }
}

testEmail()
