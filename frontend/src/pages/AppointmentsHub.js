import React from 'react';
import { Box, Button, Typography, Stack, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TodayIcon from '@mui/icons-material/Today';
import HistoryIcon from '@mui/icons-material/History';

const AppointmentButton = ({ icon, title, description, onClick }) => (
  <Card
    sx={{
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(24,90,157,0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(24,90,157,0.2)',
      },
    }}
    onClick={onClick}
  >
    <CardContent sx={{ p: 4, textAlign: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          '& svg': {
            fontSize: '3rem',
            color: '#185a9d',
          },
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#185a9d',
          mb: 2,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#4a5568',
          lineHeight: 1.7,
        }}
      >
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const AppointmentsHub = () => {
  const navigate = useNavigate();

  const appointmentOptions = [
    {
      icon: <EventNoteIcon />,
      title: 'Book Appointment',
      description: 'Schedule a new appointment with our healthcare professionals',
      path: '/book-appointment',
    },
    {
      icon: <PendingActionsIcon />,
      title: 'Pending Requests',
      description: 'View and manage your pending appointment requests',
      path: '/pending-requests',
    },
    {
      icon: <TodayIcon />,
      title: 'Upcoming Appointments',
      description: 'Check your scheduled upcoming appointments',
      path: '/upcoming-appointments',
    },
    {
      icon: <HistoryIcon />,
      title: 'Appointment History',
      description: 'View your past appointments and medical history',
      path: '/appointment-history',
    },
  ];

  return (
    <PageTemplate>
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          animation: 'fadeIn 1s ease-out',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            textAlign: 'center',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #185a9d 0%, #43cea2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4,
          }}
        >
          Appointment Center
        </Typography>
        
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto',
            mb: 8,
          }}
        >
          Manage all your healthcare appointments in one place. Book new appointments,
          track requests, and view your medical history.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
            },
            gap: 4,
          }}
        >
          {appointmentOptions.map((option, index) => (
            <AppointmentButton
              key={index}
              icon={option.icon}
              title={option.title}
              description={option.description}
              onClick={() => navigate(option.path)}
            />
          ))}
        </Box>
      </Box>
    </PageTemplate>
  );
};

export default AppointmentsHub;
