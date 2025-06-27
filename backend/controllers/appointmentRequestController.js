const AppointmentRequest = require('../models/appointmentRequestModel')
const User = require('../models/userModel')

// Create a new appointment request
exports.createAppointmentRequest = async (req, res) => {
  try {
    const { 
      doctorMedicalId, 
      patientMedicalId, 
      preferredDate, 
      preferredTime, 
      symptoms, 
      contactInfo, 
      notificationType 
    } = req.body

    // Get doctor and patient details
    const doctor = await User.findOne({ medicalId: doctorMedicalId, role: 'doctor' })
    const patient = await User.findOne({ medicalId: patientMedicalId, role: 'patient' })

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' })
    }

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }

    const appointmentRequest = new AppointmentRequest({
      doctorMedicalId,
      patientMedicalId,
      doctorName: doctor.username,
      patientName: patient.username,
      doctorEmail: doctor.email,
      patientEmail: patient.email,
      preferredDate: new Date(preferredDate),
      preferredTime,
      symptoms,
      contactInfo,
      notificationType,
      status: 'pending'
    })

    await appointmentRequest.save()

    res.status(201).json({
      message: 'Appointment request created successfully',
      appointmentRequest
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error creating appointment request',
      error: error.message
    })
  }
}

// Get all appointment requests for a doctor
exports.getDoctorAppointmentRequests = async (req, res) => {
  try {
    const { doctorMedicalId } = req.params

    const requests = await AppointmentRequest.find({ 
      doctorMedicalId,
      status: { $in: ['pending', 'approved'] }
    }).sort({ createdAt: -1 })

    res.status(200).json({ requests })
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching appointment requests',
      error: error.message
    })
  }
}

// Get all appointment requests for a patient
exports.getPatientAppointmentRequests = async (req, res) => {
  try {
    const { patientMedicalId } = req.params
    console.log("Fetching appointments for patient:", patientMedicalId);

    // Get current date at start of day
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const requests = await AppointmentRequest.find({ 
      patientMedicalId,
      status: { $in: ['pending', 'approved'] },
      preferredDate: { $gte: currentDate }
    }).sort({ preferredDate: 1 })

    console.log(`Found ${requests.length} appointments for patient`);
    res.status(200).json({ requests })
  } catch (error) {
    console.error('Error in getPatientAppointmentRequests:', error);
    res.status(500).json({
      message: 'Error fetching appointment requests',
      error: error.message
    })
  }
}

// Update appointment request status (approve/reject)
exports.updateAppointmentRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params
    const { status, doctorResponse, scheduledDate, scheduledTime } = req.body

    const request = await AppointmentRequest.findById(requestId)
    if (!request) {
      return res.status(404).json({ message: 'Appointment request not found' })
    }

    request.status = status
    if (doctorResponse) {
      request.doctorResponse = {
        message: doctorResponse,
        respondedAt: new Date()
      }
    }
    
    if (status === 'approved' && scheduledDate && scheduledTime) {
      request.scheduledDate = new Date(scheduledDate)
      request.scheduledTime = scheduledTime
    }

    await request.save()

    res.status(200).json({
      message: `Appointment request ${status} successfully`,
      request
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error updating appointment request',
      error: error.message
    })
  }
}

// Add a message to an appointment request
exports.addMessageToRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const { message, senderMedicalId, senderName } = req.body

    const request = await AppointmentRequest.findById(requestId)
    if (!request) {
      return res.status(404).json({ message: 'Appointment request not found' })
    }

    request.messages.push({
      sender: senderMedicalId,
      senderName,
      message,
      timestamp: new Date()
    })

    await request.save()

    res.status(200).json({
      message: 'Message added successfully',
      request
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error adding message',
      error: error.message
    })
  }
}

// Get a specific appointment request by ID
exports.getAppointmentRequestById = async (req, res) => {
  try {
    const { requestId } = req.params

    const request = await AppointmentRequest.findById(requestId)
    if (!request) {
      return res.status(404).json({ message: 'Appointment request not found' })
    }

    res.status(200).json({ request })
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching appointment request',
      error: error.message
    })
  }
}
