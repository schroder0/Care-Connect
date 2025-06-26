const {
  bookAppointment,
  getDoctorAvailability,
  getAppointmentHistory,
  getAllDoctors,
  getAllPatients,
} = require('../controllers/appointmentController')

const appointmentRoutes = (app) => {
  app.post('/api/book', bookAppointment)
  app.get('/api/availability', getDoctorAvailability)
  app.get('/api/history', getAppointmentHistory)
  app.get('/api/doctors', getAllDoctors)
  app.get('/api/patients', getAllPatients)
}

module.exports = appointmentRoutes
