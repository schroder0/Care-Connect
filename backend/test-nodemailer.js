require('dotenv').config()
const { sendAppointmentApprovalEmail } = require('./services/emailService')

// Test email functionality
async function testEmailService() {
  try {
    console.log('Testing nodemailer with current configuration...')
    console.log('EMAIL_USER:', process.env.EMAIL_USER)
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'App Password is set' : 'No password set')
    
    // Test sending an approval email
    console.log('\nSending test approval email...')
    await sendAppointmentApprovalEmail(
      'test.patient@example.com', // Test recipient email
      'John Doe', // Patient name
      'Dr. Smith', // Doctor name  
      new Date('2025-01-15'), // Scheduled date
      '10:00 AM', // Scheduled time
      'Your appointment has been approved. Please arrive 15 minutes early.' // Doctor response
    )
    
    console.log('✅ Test email sent successfully!')
    console.log('Nodemailer is working correctly with your Gmail configuration.')
    
  } catch (error) {
    console.error('❌ Email test failed:')
    console.error('Error message:', error.message)
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Gmail Authentication Issue:')
      console.log('- Make sure you have 2-Factor Authentication enabled on your Gmail account')
      console.log('- Generate an App Password from https://myaccount.google.com/apppasswords')
      console.log('- Replace the current EMAIL_PASS in .env with the 16-character App Password')
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n🌐 Network Issue:')
      console.log('- Check your internet connection')
      console.log('- Gmail SMTP might be blocked by firewall')
    } else {
      console.log('\n❓ Other Issue:')
      console.log('- Check if your Gmail account settings allow less secure apps')
      console.log('- Verify the EMAIL_USER and EMAIL_PASS in your .env file')
    }
  }
}

testEmailService()
