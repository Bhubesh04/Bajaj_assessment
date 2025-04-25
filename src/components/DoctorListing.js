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
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DoctorCard from './DoctorCard';

function DoctorListing() {
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
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <Typography color="error">Error loading doctors: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f7' }}>
      {/* Main Content: Filters + Results */}
      <Grid container spacing={0}>
        {/* Filters Panel (Left Column) - Make it much narrower */}
        <Grid item xs={12} md={2.5} lg={2} sx={{ bgcolor: '#fff', px: 0, maxWidth: { md: '220px' } }}>
          {/* Sort By Section */}
          <Box 
            sx={{ 
              p: 1.5, 
              borderBottom: '1px solid #eee',
              cursor: 'pointer'
            }}
            onClick={() => toggleSection('sortBy')}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                Sort by
              </Typography>
              <KeyboardArrowDownIcon 
                sx={{ 
                  transform: expandedSections.sortBy ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                  fontSize: '1.2rem'
                }} 
              />
            </Box>
          </Box>
          
          {expandedSections.sortBy && (
            <Box sx={{ p: 1.5, pt: 1 }}>
              <FormControl component="fieldset" size="small" sx={{ width: '100%' }}>
                <RadioGroup
                  aria-label="sort-by"
                  name="sort-by-group"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <FormControlLabel 
                    value="fees" 
                    control={<Radio size="small" sx={{ color: '#888', padding: '4px' }} />} 
                    label={<Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#333' }}>Price: Low-High</Typography>}
                    data-testid="sort-fees" 
                    sx={{ my: 0.25 }}
                  />
                  <FormControlLabel 
                    value="experience" 
                    control={<Radio size="small" sx={{ color: '#888', padding: '4px' }} />} 
                    label={<Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#333', lineHeight: 1.2 }}>Experience- Most Experienced first</Typography>}
                    data-testid="sort-experience" 
                    sx={{ my: 0.25, pr: 1 }}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          )}

          {/* Filters Section Header */}
          <Box sx={{ 
            p: 1.5,
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            borderTop: '1px solid #eee'
          }}>
            <Typography variant="subtitle2" fontWeight={500} color="text.primary" sx={{ fontSize: '0.85rem' }}>
              Filters
            </Typography>
            <Button
              size="small"
              onClick={handleClearAllFilters}
              sx={{ 
                textTransform: 'none', 
                color: '#2a7fec', 
                fontSize: '0.7rem',
                p: 0,
                minWidth: 'auto',
                fontWeight: 400
              }}
            >
              Clear All
            </Button>
          </Box>

          {/* Specialties Section */}
          <Box 
            sx={{ 
              p: 1.5, 
              borderBottom: '1px solid #eee',
              cursor: 'pointer'
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
                  transition: 'transform 0.3s',
                  fontSize: '1.2rem'
                }} 
              />
            </Box>
          </Box>
          
          {expandedSections.specialties && (
            <Box sx={{ p: 1.5, pt: 1 }}>
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
                      <SearchIcon fontSize="small" sx={{ color: '#888', fontSize: '0.9rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: specialtySearchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSpecialtySearchQuery('')}>
                        <ClearIcon fontSize="small" sx={{ color: '#888', fontSize: '0.9rem' }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                  sx: {
                    fontSize: '0.8rem',
                    borderRadius: '4px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ddd'
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: '7px 10px 7px 0'
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
                        sx={{ color: '#888', padding: '3px' }}
                      />
                    }
                    label={<Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#333' }}>{specialty}</Typography>}
                    data-testid={`filter-specialty-${specialty.replace(/[^a-zA-Z]/g, '')}`}
                    sx={{ mr: 0, mb: 0.2, ml: -0.5 }}
                  />
                )) : (
                  <Typography variant="caption" color="text.secondary">No matching specialties</Typography>
                )}
              </FormGroup>
            </Box>
          )}

          {/* Consultation Mode Section */}
          <Box 
            sx={{ 
              p: 1.5, 
              borderBottom: '1px solid #eee',
              cursor: 'pointer'
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
                  transition: 'transform 0.3s',
                  fontSize: '1.2rem'
                }} 
              />
            </Box>
          </Box>
          
          {expandedSections.consultation && (
            <Box sx={{ p: 1.5, pt: 1 }}>
              <FormControl component="fieldset" size="small" sx={{ width: '100%' }}>
                <RadioGroup
                  aria-label="consultation-mode"
                  name="consultation-mode-group"
                  value={consultationType}
                  onChange={(e) => setConsultationType(e.target.value)}
                >
                  <FormControlLabel 
                    value="all" 
                    control={<Radio size="small" sx={{ color: '#888', padding: '4px' }} />} 
                    label={<Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#333' }}>All</Typography>}
                    sx={{ my: 0.25 }}
                  />
                  <FormControlLabel 
                    value="video" 
                    control={<Radio size="small" sx={{ color: '#888', padding: '4px' }} />} 
                    label={<Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#333' }}>Video Consultation</Typography>} 
                    data-testid="filter-video-consult"
                    sx={{ my: 0.25 }}
                  />
                  <FormControlLabel 
                    value="clinic" 
                    control={<Radio size="small" sx={{ color: '#888', padding: '4px' }} />} 
                    label={<Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#333' }}>In-clinic Consultation</Typography>} 
                    data-testid="filter-in-clinic"
                    sx={{ my: 0.25, pr: 1 }}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          )}
        </Grid>

        {/* Doctor List (Right Column) */}
        <Grid item xs={12} md={9.5} lg={10} sx={{ 
          bgcolor: '#f5f5f7', 
          p: 2, 
          pl: { md: 3 },
          display: 'flex',
          justifyContent: 'center'
        }}>
          {filteredDoctors.length > 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              width: '100%',
              maxWidth: '900px'
            }}>
              {filteredDoctors.map((doctor) => (
                <Box key={doctor.id}>
                  <DoctorCard doctor={doctor} />
                </Box>
              ))}
            </Box>
          ) : (
            <Box textAlign="center" mt={5}>
              <Typography color="text.secondary">
                No doctors found matching your criteria.
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default DoctorListing; 