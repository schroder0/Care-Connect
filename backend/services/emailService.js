const nodemailer = require('nodemailer')

// Create transporter based on email provider
const createTransporter = () => {
  // Configure for Gmail
  if (process.env.EMAIL_USER.includes('gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }
  
  // Configure for Outlook/Hotmail
  if (process.env.EMAIL_USER.includes('outlook.com') || process.env.EMAIL_USER.includes('hotmail.com')) {
    return nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }
  
  // Configure for Yahoo
  if (process.env.EMAIL_USER.includes('yahoo.com')) {
    return nodemailer.createTransport({
      service: 'yahoo',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }
  
  // Default SMTP configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Send email function
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"CareConnect" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    }
    
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}

// Send appointment approval email to patient
const sendAppointmentApprovalEmail = async (patientEmail, patientName, doctorName, scheduledDate, scheduledTime, doctorResponse) => {
  const subject = 'Appointment Approved - CareConnect'
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Appointment Approved!</h2>
      <p>Dear ${patientName},</p>
      <p>Great news! Your appointment request has been approved by Dr. ${doctorName}.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3>Appointment Details:</h3>
        <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
        <p><strong>Date:</strong> ${new Date(scheduledDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${scheduledTime}</p>
        ${doctorResponse ? `<p><strong>Doctor's Note:</strong> ${doctorResponse}</p>` : ''}
      </div>
      
      <p>Please make sure to arrive 10 minutes before your scheduled time.</p>
      <p>If you need to reschedule or have any questions, please contact us through the CareConnect platform.</p>
      
      <p>Best regards,<br>The CareConnect Team</p>
    </div>
  `
  
  return await sendEmail(patientEmail, subject, htmlContent)
}

// Send appointment approval confirmation to doctor
const sendDoctorConfirmationEmail = async (doctorEmail, doctorName, patientName, scheduledDate, scheduledTime) => {
  const subject = 'Appointment Confirmation - CareConnect'
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2196F3;">Appointment Confirmed</h2>
      <p>Dear Dr. ${doctorName},</p>
      <p>This is to confirm that you have approved an appointment with the following details:</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3>Appointment Details:</h3>
        <p><strong>Patient:</strong> ${patientName}</p>
        <p><strong>Date:</strong> ${new Date(scheduledDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${scheduledTime}</p>
      </div>
      
      <p>The patient has been notified about the approval.</p>
      <p>You can manage your appointments through the CareConnect doctor portal.</p>
      
      <p>Best regards,<br>The CareConnect Team</p>
    </div>
  `
  
  return await sendEmail(doctorEmail, subject, htmlContent)
}

// Send appointment rejection email to patient
const sendAppointmentRejectionEmail = async (patientEmail, patientName, doctorName, reason) => {
  const subject = 'Appointment Update - CareConnect'
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f44336;">Appointment Update</h2>
      <p>Dear ${patientName},</p>
      <p>We regret to inform you that your appointment request with Dr. ${doctorName} could not be approved at this time.</p>
      
      ${reason ? `
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <p><strong>Reason:</strong> ${reason}</p>
      </div>
      ` : ''}
      
      <p>We encourage you to:</p>
      <ul>
        <li>Try booking with another available doctor</li>
        <li>Choose a different date or time</li>
        <li>Contact us if you need assistance finding alternative options</li>
      </ul>
      
      <p>Thank you for your understanding.</p>
      
      <p>Best regards,<br>The CareConnect Team</p>
    </div>
  `
  
  return await sendEmail(patientEmail, subject, htmlContent)
}

module.exports = {
  sendEmail,
  sendAppointmentApprovalEmail,
  sendDoctorConfirmationEmail,
  sendAppointmentRejectionEmail,
}
