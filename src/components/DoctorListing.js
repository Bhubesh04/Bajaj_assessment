import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  FormControl,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  CircularProgress,
  TextField,
  InputAdornment,
  Divider,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Fade,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import DoctorCard from './DoctorCard';

function DoctorListing() {
  const theme = useTheme();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtySearchQuery, setSpecialtySearchQuery] = useState('');
  const [consultationType, setConsultationType] = useState('all');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    sortBy: true,
    specialties: true,
    consultation: true,
  });
  const [filterCount, setFilterCount] = useState(0);

  // Fetch doctors data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        console.error("Fetch error: ", err);
        setError(err.message || 'Failed to fetch doctors data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Track active filter count
  useEffect(() => {
    let count = 0;
    if (sortBy) count++;
    if (consultationType !== 'all') count++;
    if (selectedSpecialties.length > 0) count += selectedSpecialties.length;
    setFilterCount(count);
  }, [sortBy, consultationType, selectedSpecialties]);

  // Get unique specialties from doctors data
  const allSpecialties = [...new Set(doctors.flatMap(doctor => 
    doctor.specialities.map(spec => spec.name)
  ))].sort();

  // Filter specialties based on search
  const filteredSpecialties = allSpecialties.filter(spec =>
    spec.toLowerCase().includes(specialtySearchQuery.toLowerCase())
  );

  // Filter and sort doctors based on selected filters and searchQuery prop
  useEffect(() => {
    let filtered = [...doctors];

    // Filter by top search query (doctor name)
    if (searchQuery) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by consultation type
    if (consultationType === 'video') {
      filtered = filtered.filter(doctor => doctor.video_consult);
    } else if (consultationType === 'clinic') {
      filtered = filtered.filter(doctor => doctor.in_clinic);
    }

    // Filter by specialties
    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter(doctor =>
        doctor.specialities.some(spec => selectedSpecialties.includes(spec.name))
      );
    }

    // Sort doctors
    if (sortBy === 'fees') {
      filtered.sort((a, b) => {
        const feeA = parseInt(a.fees?.replace(/[^0-9]/g, '') || '999999');
        const feeB = parseInt(b.fees?.replace(/[^0-9]/g, '') || '999999');
        return feeA - feeB;
      });
    } else if (sortBy === 'experience') {
      filtered.sort((a, b) => {
        const expA = parseInt(a.experience?.match(/\d+/)?.[0] || '0');
        const expB = parseInt(b.experience?.match(/\d+/)?.[0] || '0');
        return expB - expA;
      });
    }

    setFilteredDoctors(filtered);
  }, [doctors, searchQuery, consultationType, selectedSpecialties, sortBy]);

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleClearAllFilters = () => {
    setSortBy('');
    setConsultationType('all');
    setSelectedSpecialties([]);
    setSpecialtySearchQuery('');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ 
        height: '80vh',
        flexDirection: 'column',
        gap: 3
      }}>
        <CircularProgress 
          size={60} 
          thickness={4} 
          sx={{ 
            color: theme.palette.primary.main,
            boxShadow: '0 0 20px rgba(100, 150, 255, 0.3)'
          }} 
        />
        <Typography variant="h6" color="text.secondary" sx={{ 
          opacity: 0.8,
          animation: 'pulse 1.5s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': { opacity: 0.6 },
            '50%': { opacity: 0.9 },
            '100%': { opacity: 0.6 },
          }
        }}>
          Finding the best doctors for you...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          Error loading doctors
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: '500px', textAlign: 'center' }}>
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          sx={{ mt: 3 }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Main Content: Filters + Results */}
      <Grid container spacing={2}>
        {/* Filters Panel (Left Column) */}
        <Grid item xs={12} md={2.5} lg={2} sx={{ 
          maxWidth: { md: '220px' },
          position: 'relative'
        }}>
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(25, 28, 40, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(100, 120, 170, 0.15)',
              overflow: 'hidden',
              position: 'sticky',
              top: '20px',
              transition: 'all 0.3s ease'
            }}
          >
            <Box sx={{ position: 'relative' }}>
              {/* Filter Count Badge */}
              {filterCount > 0 && (
                <Chip
                  label={filterCount}
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    fontWeight: 'bold',
                    height: 22,
                    minWidth: 22,
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.5)',
                    border: '1px solid rgba(200, 220, 255, 0.3)',
                  }}
                />
              )}

              {/* Sort By Section */}
              <Box 
                sx={{ 
                  p: 2,
                  borderBottom: '1px solid rgba(150, 165, 200, 0.15)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 120, 200, 0.05)',
                  }
                }}
                onClick={() => toggleSection('sortBy')}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TuneIcon sx={{ fontSize: 18, mr: 1, color: theme.palette.primary.main }} />
                    <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                      Sort By
                    </Typography>
                  </Box>
                  <KeyboardArrowDownIcon 
                    sx={{ 
                      transform: expandedSections.sortBy ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      fontSize: '1.2rem',
                      color: theme.palette.text.secondary
                    }} 
                  />
                </Box>
              </Box>
              
              {expandedSections.sortBy && (
                <Fade in={expandedSections.sortBy} timeout={400}>
                  <Box sx={{ p: 2, pt: 1, pb: 1.5 }}>
                    <FormControl component="fieldset" size="small" sx={{ width: '100%' }}>
                      <RadioGroup
                        aria-label="sort-by"
                        name="sort-by-group"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <FormControlLabel 
                          value="fees" 
                          control={
                            <Radio 
                              size="small" 
                              sx={{ 
                                color: 'rgba(150, 160, 180, 0.5)',
                                padding: '4px',
                                '&.Mui-checked': {
                                  color: theme.palette.primary.main,
                                }
                              }} 
                            />
                          } 
                          label={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: '0.8rem', 
                                color: sortBy === 'fees' ? theme.palette.primary.main : theme.palette.text.primary,
                                fontWeight: sortBy === 'fees' ? 500 : 400,
                                transition: 'color 0.2s ease, font-weight 0.2s ease'
                              }}
                            >
                              Price: Low-High
                            </Typography>
                          }
                          data-testid="sort-fees" 
                          sx={{ my: 0.25 }}
                        />
                        <FormControlLabel 
                          value="experience" 
                          control={
                            <Radio 
                              size="small" 
                              sx={{ 
                                color: 'rgba(150, 160, 180, 0.5)', 
                                padding: '4px',
                                '&.Mui-checked': {
                                  color: theme.palette.primary.main,
                                }
                              }} 
                            />
                          } 
                          label={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: '0.8rem', 
                                color: sortBy === 'experience' ? theme.palette.primary.main : theme.palette.text.primary,
                                fontWeight: sortBy === 'experience' ? 500 : 400,
                                lineHeight: 1.2,
                                transition: 'color 0.2s ease, font-weight 0.2s ease'
                              }}
                            >
                              Experience- Most Experienced first
                            </Typography>
                          }
                          data-testid="sort-experience" 
                          sx={{ my: 0.25, pr: 1 }}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Fade>
              )}

              {/* Filters Section Header */}
              <Box sx={{ 
                p: 2,
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid rgba(150, 165, 200, 0.15)',
                borderTop: '1px solid rgba(150, 165, 200, 0.15)',
                background: 'rgba(30, 35, 50, 0.3)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FilterAltOutlinedIcon sx={{ fontSize: 18, mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle2" fontWeight={500} color="text.primary" sx={{ fontSize: '0.85rem' }}>
                    Filters
                  </Typography>
                </Box>
                <Tooltip title="Clear all filters" placement="top" arrow>
                  <Button
                    size="small"
                    onClick={handleClearAllFilters}
                    disabled={filterCount === 0}
                    sx={{ 
                      textTransform: 'none', 
                      color: filterCount > 0 ? theme.palette.primary.main : 'rgba(150, 160, 180, 0.5)', 
                      fontSize: '0.7rem',
                      p: 0,
                      minWidth: 'auto',
                      fontWeight: 400,
                      opacity: filterCount > 0 ? 1 : 0.5,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        opacity: 0.9,
                      }
                    }}
                  >
                    Clear All
                  </Button>
                </Tooltip>
              </Box>

              {/* Specialties Section */}
              <Box 
                sx={{ 
                  p: 2, 
                  borderBottom: '1px solid rgba(150, 165, 200, 0.15)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 120, 200, 0.05)',
                  }
                }}
                onClick={() => toggleSection('specialties')}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                    Specialities
                  </Typography>
                  <KeyboardArrowDownIcon 
                    sx={{ 
                      transform: expandedSections.specialties ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      fontSize: '1.2rem',
                      color: theme.palette.text.secondary
                    }} 
                  />
                </Box>
              </Box>
              
              {expandedSections.specialties && (
                <Fade in={expandedSections.specialties} timeout={400}>
                  <Box sx={{ p: 2, pt: 1 }}>
                    <TextField
                      placeholder="Search specialties"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={specialtySearchQuery}
                      onChange={(e) => setSpecialtySearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" sx={{ color: 'rgba(150, 160, 180, 0.7)', fontSize: '0.9rem' }} />
                          </InputAdornment>
                        ),
                        endAdornment: specialtySearchQuery ? (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setSpecialtySearchQuery('')}>
                              <ClearIcon fontSize="small" sx={{ color: 'rgba(150, 160, 180, 0.7)', fontSize: '0.9rem' }} />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                        sx: {
                          fontSize: '0.8rem',
                          borderRadius: theme.shape.borderRadius,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(150, 165, 200, 0.2)'
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '7px 10px 7px 0',
                            color: theme.palette.text.primary
                          }
                        }
                      }}
                      sx={{ mb: 1.5 }}
                    />
                    <FormGroup sx={{ maxHeight: 180, overflowY: 'auto', pr: 1 }}>
                      {filteredSpecialties.length > 0 ? filteredSpecialties.map((specialty) => (
                        <FormControlLabel
                          key={specialty}
                          control={
                            <Checkbox
                              size="small"
                              checked={selectedSpecialties.includes(specialty)}
                              onChange={() => handleSpecialtyChange(specialty)}
                              sx={{ 
                                color: 'rgba(150, 160, 180, 0.5)', 
                                padding: '3px',
                                '&.Mui-checked': {
                                  color: theme.palette.primary.main,
                                } 
                              }}
                            />
                          }
                          label={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: '0.8rem', 
                                color: selectedSpecialties.includes(specialty) ? theme.palette.primary.main : theme.palette.text.primary,
                                fontWeight: selectedSpecialties.includes(specialty) ? 500 : 400,
                                transition: 'color 0.2s ease'
                              }}
                            >
                              {specialty}
                            </Typography>
                          }
                          data-testid={`filter-specialty-${specialty.replace(/[^a-zA-Z]/g, '')}`}
                          sx={{ mr: 0, mb: 0.2, ml: -0.5 }}
                        />
                      )) : (
                        <Typography variant="caption" color="text.secondary">No matching specialties</Typography>
                      )}
                    </FormGroup>
                  </Box>
                </Fade>
              )}

              {/* Consultation Mode Section */}
              <Box 
                sx={{ 
                  p: 2, 
                  borderBottom: '1px solid rgba(150, 165, 200, 0.15)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 120, 200, 0.05)',
                  }
                }}
                onClick={() => toggleSection('consultation')}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                    Mode of consultation
                  </Typography>
                  <KeyboardArrowDownIcon 
                    sx={{ 
                      transform: expandedSections.consultation ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      fontSize: '1.2rem',
                      color: theme.palette.text.secondary
                    }} 
                  />
                </Box>
              </Box>
              
              {expandedSections.consultation && (
                <Fade in={expandedSections.consultation} timeout={400}>
                  <Box sx={{ p: 2, pt: 1, pb: 2.5 }}>
                    <FormControl component="fieldset" size="small" sx={{ width: '100%' }}>
                      <RadioGroup
                        aria-label="consultation-mode"
                        name="consultation-mode-group"
                        value={consultationType}
                        onChange={(e) => setConsultationType(e.target.value)}
                      >
                        <FormControlLabel 
                          value="all" 
                          control={
                            <Radio 
                              size="small" 
                              sx={{ 
                                color: 'rgba(150, 160, 180, 0.5)', 
                                padding: '4px',
                                '&.Mui-checked': {
                                  color: theme.palette.primary.main,
                                }
                              }} 
                            />
                          } 
                          label={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: '0.8rem', 
                                color: consultationType === 'all' ? theme.palette.primary.main : theme.palette.text.primary,
                                fontWeight: consultationType === 'all' ? 500 : 400,
                                transition: 'color 0.2s ease'
                              }}
                            >
                              All
                            </Typography>
                          }
                          sx={{ my: 0.25 }}
                        />
                        <FormControlLabel 
                          value="video" 
                          control={
                            <Radio 
                              size="small" 
                              sx={{ 
                                color: 'rgba(150, 160, 180, 0.5)', 
                                padding: '4px',
                                '&.Mui-checked': {
                                  color: theme.palette.primary.main,
                                }
                              }} 
                            />
                          } 
                          label={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: '0.8rem', 
                                color: consultationType === 'video' ? theme.palette.primary.main : theme.palette.text.primary,
                                fontWeight: consultationType === 'video' ? 500 : 400,
                                transition: 'color 0.2s ease'
                              }}
                            >
                              Video Consultation
                            </Typography>
                          } 
                          data-testid="filter-video-consult"
                          sx={{ my: 0.25 }}
                        />
                        <FormControlLabel 
                          value="clinic" 
                          control={
                            <Radio 
                              size="small" 
                              sx={{ 
                                color: 'rgba(150, 160, 180, 0.5)', 
                                padding: '4px',
                                '&.Mui-checked': {
                                  color: theme.palette.primary.main,
                                }
                              }} 
                            />
                          } 
                          label={
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: '0.8rem', 
                                color: consultationType === 'clinic' ? theme.palette.primary.main : theme.palette.text.primary,
                                fontWeight: consultationType === 'clinic' ? 500 : 400,
                                transition: 'color 0.2s ease'
                              }}
                            >
                              In-clinic Consultation
                            </Typography>
                          } 
                          data-testid="filter-in-clinic"
                          sx={{ my: 0.25, pr: 1 }}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Fade>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Doctor List (Right Column) */}
        <Grid item xs={12} md={9.5} lg={10} sx={{ 
          display: 'flex',
          justifyContent: 'center',
          pl: { md: 3 }
        }}>
          {filteredDoctors.length > 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              width: '100%',
              maxWidth: '900px'
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 0
              }}>
                <Typography 
                  variant="h6" 
                  color="text.primary"
                  sx={{
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                  }}
                >
                  {filteredDoctors.length} Doctors Available
                </Typography>
                <Chip 
                  label={`${filterCount} Filter${filterCount !== 1 ? 's' : ''} Applied`} 
                  size="small"
                  sx={{ 
                    display: filterCount > 0 ? 'flex' : 'none',
                    backgroundColor: 'rgba(100, 150, 255, 0.15)', 
                    border: '1px solid rgba(100, 150, 255, 0.2)',
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      px: 1.5
                    }
                  }}
                />
              </Box>

              {filteredDoctors.map((doctor, index) => (
                <Box 
                  key={doctor.id} 
                  sx={{ 
                    transform: 'translateY(0)',
                    transition: 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    }
                  }}
                >
                  <DoctorCard doctor={doctor} />
                </Box>
              ))}
            </Box>
          ) : (
            <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                mt: 8,
                p: 4,
                width: '100%',
                maxWidth: '600px',
                border: '1px solid rgba(150, 165, 200, 0.15)',
                borderRadius: 3,
                backgroundColor: 'rgba(30, 35, 50, 0.5)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                No doctors found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                We couldn't find any doctors matching your criteria. Try adjusting your filters.
              </Typography>
              <Button
                variant="outlined"
                onClick={handleClearAllFilters}
                sx={{ mt: 2 }}
              >
                Clear All Filters
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default DoctorListing; 