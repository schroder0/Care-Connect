import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import HealthAndSafetyRoundedIcon from '@mui/icons-material/HealthAndSafetyRounded'

const items = [
  {
    icon: <LocalHospitalRoundedIcon />,
    title: 'Comprehensive Care',
    description:
      'Access a full range of health services from experienced doctors, ensuring all your medical needs are met.',
  },
  {
    icon: <VerifiedUserRoundedIcon />,
    title: 'Secure and Private',
    description:
      'Your health information is protected with top-level security, ensuring your privacy at all times.',
  },
  {
    icon: <InsightsRoundedIcon />,
    title: 'Actionable Insights',
    description:
      'Receive detailed analytics and insights on your health, helping you make informed decisions.',
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: '24/7 Support',
    description:
      'Our customer support team is available around the clock to assist you with any queries or issues.',
  },
  {
    icon: <EventAvailableRoundedIcon />,
    title: 'Easy Appointments',
    description:
      'Schedule and manage appointments effortlessly with our user-friendly booking system.',
  },
  {
    icon: <HealthAndSafetyRoundedIcon />,
    title: 'Quality Assurance',
    description:
      'We adhere to the highest standards of healthcare, ensuring you receive the best possible care.',
  },
]

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(67,206,162,0.95) 0%, rgba(24,90,157,0.95) 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")',
          opacity: 0.1,
          zIndex: 0,
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          py: { xs: 8, sm: 10 },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={3} useFlexGap sx={{ width: '100%', alignItems: 'center', mb: 8 }}>
          <Typography
            component="h2"
            variant="h2"
            sx={{
              fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
              fontWeight: 800,
              textAlign: 'center',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              background: 'linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              animation: 'fadeInDown 1s ease-out',
            }}
          >
            Why Choose Us
          </Typography>
          <Typography
            textAlign="center"
            sx={{
              color: '#ffffff',
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
              maxWidth: '800px',
              opacity: 0.9,
              animation: 'fadeIn 1s ease-out 0.5s both',
              px: { xs: 2, sm: 0 },
            }}
          >
            Discover the features that make us the leading healthcare platform
          </Typography>
        </Stack>

        <Grid container spacing={4} sx={{ width: '100%', mx: 'auto' }}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: { xs: 3, sm: 4 },
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  animation: `fadeInUp 1s ease-out ${index * 0.2}s both`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                    background: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    mb: 2,
                    '& svg': {
                      fontSize: 32,
                      color: '#ffffff',
                    },
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    color: '#ffffff',
                    mb: 2,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
