const {
  bookAppointment,
  getDoctorAvailability,
  cancelAppointment,
  getAppointmentHistory,
  getAllDoctors,
  getAllPatients,
} = require('../controllers/appointmentController')

const appointmentRoutes = (app) => {
  app.post('/api/book', bookAppointment)
  app.get('/api/availability', getDoctorAvailability)
  app.post('/api/cancel', cancelAppointment)
  app.get('/api/history', getAppointmentHistory)
  app.get('/api/doctors', getAllDoctors)
  app.get('/api/patients', getAllPatients)
}

module.exports = appointmentRoutes
