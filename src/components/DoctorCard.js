import React from 'react';
import {
  Card,
  Typography,
  Box,
  Button,
  Avatar,
  Grid,
} from '@mui/material';
import {
  LocationOn,
  WorkOutline,
  Videocam,
  Home,
} from '@mui/icons-material';

function DoctorCard({ doctor }) {
  const fee = doctor.fees?.replace(/[^\d.]/g, '') || 'N/A';
  const experience = doctor.experience?.match(/\d+/)?.[0] || '?';

  return (
    <Card
      sx={{
        p: 2,
        backgroundColor: '#fff',
        borderRadius: 1,
        boxShadow: 'none',
      }}
      data-testid="doctor-card"
    >
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs="auto">
          {doctor.photo ? (
            <Avatar
              src={doctor.photo}
              alt={doctor.name}
              sx={{ width: 70, height: 70 }}
            />
          ) : (
            <Avatar
              sx={{
                width: 70,
                height: 70,
                bgcolor: '#2a7fec',
                color: '#fff',
              }}
            >
              {doctor.name_initials || 'Dr'}
            </Avatar>
          )}
        </Grid>

        <Grid item xs>
          <Typography
            variant="subtitle1"
            component="div"
            fontWeight={500}
            color="#2a7fec"
            sx={{ mb: 0.5 }}
            data-testid="doctor-name"
          >
            {doctor.name}
          </Typography>
          
          <Typography
            variant="body2"
            color="#333"
            sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 400 }}
            data-testid="doctor-specialty"
          >
            {doctor.specialities?.map(spec => spec.name).join(', ') || 'Specialist'}
          </Typography>
          
          <Typography
            variant="body2"
            color="#666"
            sx={{ mb: 1, fontSize: '0.875rem' }}
            data-testid="doctor-experience"
          >
            {experience} yrs exp.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
            {doctor.in_clinic && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Home sx={{ fontSize: 18, mr: 0.5, color: '#666' }} />
                <Typography variant="body2" color="#666" sx={{ fontSize: '0.875rem' }}>
                  Gulmohar Clinic
                </Typography>
              </Box>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
            <LocationOn sx={{ fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              {doctor.clinic?.address?.locality || 'Varanasi'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md="auto" sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: { xs: 'flex-start', md: 'flex-end' }, 
          mt: { xs: 2, md: 0 },
          justifyContent: 'flex-start'
        }}>
          <Typography
            variant="subtitle1"
            fontWeight={500}
            color="#333"
            sx={{ mb: 1 }}
            data-testid="doctor-fee"
          >
            ₹ {fee}
          </Typography>
          
          <Button
            variant="outlined"
            sx={{ 
              borderColor: '#2a7fec', 
              color: '#2a7fec',
              textTransform: 'none',
              borderRadius: 1,
              py: 0.5,
              px: 2,
              fontSize: '0.875rem',
              minWidth: '140px',
              '&:hover': {
                borderColor: '#1a6edb',
                backgroundColor: 'rgba(42, 127, 236, 0.04)'
              }
            }}
          >
            Book Appointment
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}

export default DoctorCard;