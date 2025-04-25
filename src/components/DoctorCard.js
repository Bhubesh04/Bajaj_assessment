import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import {
  LocationOn,
  LocalHospital,
  CurrencyRupee,
  WorkOutline,
  Videocam,
} from '@mui/icons-material';

function DoctorCard({ doctor }) {
  const extractNumber = (str) => str?.match(/\d+/)?.[0] || '';

  return (
    <Card 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'background.paper',
        borderRadius: theme => theme.shape.borderRadius,
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
        }
      }} 
      data-testid="doctor-card"
    >
      <Box sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
        {doctor.photo ? (
          <Avatar
            src={doctor.photo}
            alt={doctor.name}
            sx={{ width: 60, height: 60, mr: 2, border: '2px solid', borderColor: 'primary.main' }}
          />
        ) : (
          <Avatar
            sx={{ 
              width: 60, 
              height: 60, 
              mr: 2,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontSize: '1.5rem' 
            }}
          >
            {doctor.name_initials || 'Dr'} 
          </Avatar>
        )}
        <Box>
          <Typography 
            variant="h6" 
            component="div" 
            fontWeight="bold" 
            color="text.primary"
            sx={{ lineHeight: 1.3 }}
            data-testid="doctor-name"
          >
            {doctor.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            data-testid="doctor-specialty"
          >
            {doctor.specialities?.map(spec => spec.name).join(', ') || 'Specialist'}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
          <WorkOutline sx={{ fontSize: 18, mr: 1 }} />
          <Typography variant="body2" data-testid="doctor-experience">
            {extractNumber(doctor.experience)} Years Experience
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
          <CurrencyRupee sx={{ fontSize: 18, mr: 1 }} />
          <Typography variant="body2" data-testid="doctor-fee">
            ₹{extractNumber(doctor.fees)} Consultation Fee
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          <LocationOn sx={{ fontSize: 18, mr: 1 }} />
          <Typography variant="body2" noWrap title={`${doctor.clinic?.name || 'Clinic'}, ${doctor.clinic?.address?.locality || 'Location'}`}>
            {doctor.clinic?.name || 'Clinic'}, {doctor.clinic?.address?.locality || 'Location'}
          </Typography>
        </Box>
        {doctor.doctor_introduction && (
          <Typography variant="caption" display="block" mt={1.5} color="text.secondary" sx={{ maxHeight: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {doctor.doctor_introduction}
          </Typography>
        )}
      </CardContent>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {doctor.in_clinic && (
            <Chip 
              icon={<LocalHospital fontSize="small" />} 
              label="In-Clinic" 
              size="small" 
              color="primary"
              variant="outlined"
            />
          )}
          {doctor.video_consult && (
             <Chip 
              icon={<Videocam fontSize="small" />} 
              label="Video Consult" 
              size="small" 
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
        >
          Book Appointment
        </Button>
      </Box>
    </Card>
  );
}

export default DoctorCard; 