const process = require('process')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const http = require('http')
const { initSocket } = require('./socket')
require('dotenv').config()

// Routes imports
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const symptomRoutes = require('./routes/symptomRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const appointmentRequestRoutes = require('./routes/appointmentRequestRoutes')
const activityLogRoutes = require('./routes/activityLogRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const doctorRoutes = require('./routes/doctorRoutes')
const adminRoutes = require('./routes/adminRoutes')
const feedbackRoutes = require('./routes/feedbackRoutes')

// Express app
const app = express()

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [process.env.FRONTEND_URL]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      } else {
        return callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true, // Allow cookies to be sent with requests
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public'))) //eslint-disable-line

// Routes
authRoutes(app)
profileRoutes(app)
symptomRoutes(app)
app.use('/api', appointmentRoutes) // Updated to use router
appointmentRequestRoutes(app)
doctorRoutes(app)
adminRoutes(app)
activityLogRoutes(app)
analyticsRoutes(app)
feedbackRoutes(app)

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) //eslint-disable-line

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI ?? 'mongodb://localhost/mydatabase')
  .then(() => {
    console.info('Connected to MongoDB')
  })
  .catch((err) => {
    console.error('Database  error:', err)
  })

const PORT = process.env.PORT || 5001

const server = http.createServer(app)
initSocket(server)

// Removed WebSocket upgrade handler to avoid conflicts with Socket.IO
// server.on('upgrade', (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit('connection', ws, request)
//   })
// })

server.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`)
})
