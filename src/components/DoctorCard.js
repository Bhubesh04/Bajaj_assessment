import React from 'react';
import {
  Card,
  Typography,
  Box,
  Button,
  Avatar,
  Grid,
  Chip,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn,
  Videocam,
  Home,
  StarRounded,
  AccessTimeRounded,
  CalendarToday,
  ArrowForwardIos,
  BookmarkBorderRounded
} from '@mui/icons-material';

function DoctorCard({ doctor }) {
  const theme = useTheme();
  const fee = doctor.fees?.replace(/[^\d.]/g, '') || 'N/A';
  const experience = doctor.experience?.match(/\d+/)?.[0] || '?';
  
  // Random rating based on doctor's ID for demo
  const rating = ((parseInt(doctor.id) % 20) / 4 + 4).toFixed(1);
  
  // Get first speciality for the specialty chip
  const primarySpecialty = doctor.specialities?.[0]?.name || 'Specialist';

  return (
    <Card
      sx={{
        display: 'flex',
        backgroundColor: 'transparent',
        backdropFilter: 'blur(16px)',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid rgba(100, 120, 170, 0.15)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '&:hover': {
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(100, 150, 255, 0.2)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          background: 'linear-gradient(to bottom right, rgba(30, 33, 58, 0.95), rgba(25, 28, 40, 0.9))',
        }
      }}
      data-testid="doctor-card"
    >
      {/* Bookmark Icon (top right) */}
      <Tooltip title="Save for later" placement="top" arrow>
        <IconButton
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(5px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            zIndex: 10,
            padding: 1,
          }}
        >
          <BookmarkBorderRounded fontSize="small" sx={{ color: theme.palette.text.secondary }} />
        </IconButton>
      </Tooltip>

      <Grid container spacing={0}>
        {/* Left Side: Avatar and Rating */}
        <Grid item xs={12} md={2.5} sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          p: 3,
          pb: { xs: 1, md: 3 },
          borderRight: { md: '1px solid rgba(150, 165, 200, 0.1)' },
          backgroundColor: 'rgba(30, 40, 70, 0.2)'
        }}>
          {doctor.photo ? (
            <Avatar
              src={doctor.photo}
              alt={doctor.name}
              sx={{
                width: 90,
                height: 90,
                border: '2px solid rgba(120, 180, 255, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                mb: 2
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 90,
                height: 90,
                background: 'linear-gradient(135deg, #4a8cff, #2563eb)',
                color: '#fff',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                border: '2px solid rgba(120, 180, 255, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                mb: 2
              }}
            >
              {doctor.name_initials || doctor.name?.charAt(0) || 'Dr'}
            </Avatar>
          )}
          
          {/* Rating */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              borderRadius: 5,
              py: 0.5,
              px: 1.5,
              mb: 1
            }}
          >
            <StarRounded sx={{ color: '#FFD700', fontSize: 18, mr: 0.5 }} />
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary,
                fontSize: '0.9rem'
              }}
            >
              {rating}
            </Typography>
          </Box>
          
          {/* Experience */}
          <Chip
            icon={<AccessTimeRounded style={{ fontSize: 14, color: theme.palette.primary.main }} />}
            label={`${experience} yrs exp.`}
            size="small"
            sx={{
              background: 'rgba(100, 150, 255, 0.1)',
              border: '1px solid rgba(100, 150, 255, 0.2)',
              color: theme.palette.primary.main,
              fontWeight: 500,
              mb: 1.5,
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
          
          {/* Next Available */}
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.secondary, 
              fontSize: '0.7rem',
              display: { xs: 'none', md: 'block' }
            }}
          >
            NEXT AVAILABLE
          </Typography>
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            mt: 0.5 
          }}>
            <CalendarToday sx={{ fontSize: 14, mr: 0.5, color: '#94c5ff' }} />
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#94c5ff', fontWeight: 500 }}>
              Today, 2PM
            </Typography>
          </Box>
        </Grid>

        {/* Middle: Doctor Info */}
        <Grid item xs={12} md={6.5} sx={{ p: 3, pt: { xs: 0, md: 3 }, flex: 1 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
            {/* Primary Specialty Chip */}
            <Chip 
              label={primarySpecialty}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(100, 150, 255, 0.15)', 
                fontSize: '0.7rem',
                height: 24,
                '& .MuiChip-label': { px: 1.2 },
                color: theme.palette.primary.main
              }} 
            />
            
            {/* Consultation mode chips */}
            {doctor.in_clinic && (
              <Chip 
                icon={<Home sx={{ fontSize: '0.9rem !important' }} />}
                label="In-Clinic"
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  fontSize: '0.7rem',
                  height: 24,
                  '& .MuiChip-label': { px: 1.2 },
                  color: theme.palette.text.secondary
                }}
              />
            )}
            {doctor.video_consult && (
              <Chip 
                icon={<Videocam sx={{ fontSize: '0.9rem !important' }} />}
                label="Video Consult"
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  fontSize: '0.7rem',
                  height: 24,
                  '& .MuiChip-label': { px: 1.2 },
                  color: theme.palette.text.secondary
                }}
              />
            )}
          </Box>
          
          <Typography
            variant="h6"
            component="h2"
            sx={{ 
              color: theme.palette.text.primary, 
              fontWeight: 600, 
              mb: 0.5,
              fontSize: '1.1rem'
            }}
            data-testid="doctor-name"
          >
            {doctor.name}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{ 
              mb: 2, 
              fontSize: '0.9rem', 
              color: theme.palette.primary.main,
              fontWeight: 500
            }}
            data-testid="doctor-specialty"
          >
            {doctor.specialities?.map(spec => spec.name).join(', ') || 'Specialist'}
          </Typography>
          
          {/* Clinic Information */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Home sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
              <Typography
                variant="body2"
                sx={{ 
                  color: theme.palette.text.primary, 
                  fontWeight: 500,
                  fontSize: '0.85rem'
                }}
              >
                {doctor.clinic?.name || 'Gulmohar Clinic'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
              <Typography
                variant="body2"
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '0.85rem' 
                }}
              >
                {doctor.clinic?.address?.locality || 'Varanasi'}
              </Typography>
            </Box>
          </Box>
          
          {/* Doctor Description - Mobile only next available */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            alignItems: 'center',
            mt: 2
          }}>
            <CalendarToday sx={{ fontSize: 14, mr: 0.5, color: '#94c5ff' }} />
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#94c5ff', fontWeight: 500 }}>
              Next Available: Today, 2PM
            </Typography>
          </Box>
        </Grid>

        {/* Right Side: Fee and Book button */}
        <Grid item xs={12} md={3} sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(30, 40, 70, 0.2)',
          borderLeft: { md: '1px solid rgba(150, 165, 200, 0.1)' },
          p: 3,
          pt: { xs: 2, md: 3 },
          pb: { xs: 3, md: 3 }
        }}>
          <Typography
            variant="h6"
            sx={{ 
              mb: 1, 
              color: theme.palette.text.primary,
              fontWeight: 600
            }}
            data-testid="doctor-fee"
          >
            ₹ {fee}
          </Typography>
          
          <Typography
            variant="caption"
            sx={{ 
              mb: 3, 
              color: theme.palette.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.7rem'
            }}
          >
            Consultation Fee
          </Typography>
          
          <Button
            variant="contained"
            sx={{ 
              py: 1,
              px: 3,
              borderRadius: 2,
              fontWeight: 600,
              backgroundImage: 'linear-gradient(135deg, #4a8cff, #2563eb)',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)',
              '&:hover': {
                backgroundImage: 'linear-gradient(135deg, #3a7ae6, #1d58d8)',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.45)',
                transform: 'translateY(-2px)',
              },
              width: '100%'
            }}
            endIcon={<ArrowForwardIos sx={{ fontSize: '0.9rem' }} />}
          >
            Book Appointment
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}

export default DoctorCard;