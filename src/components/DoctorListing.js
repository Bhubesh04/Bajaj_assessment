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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DoctorCard from './DoctorCard';

function DoctorListing() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [consultationType, setConsultationType] = useState('all');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setFilteredDoctors(data);
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
  const specialties = [...new Set(doctors.flatMap(doctor => 
    doctor.specialities.map(spec => spec.name)
  ))].sort();

  // Filter and sort doctors based on selected filters and searchQuery prop
  useEffect(() => {
    let filtered = [...doctors];

    // Filter by search query
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
        const feeA = parseInt(a.fees?.replace(/[^0-9]/g, '') || '0');
        const feeB = parseInt(b.fees?.replace(/[^0-9]/g, '') || '0');
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
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Area: Title + Search */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          Find Your Doctor
        </Typography>
        <TextField
          label="Search by name..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          data-testid="autocomplete-input"
        />
      </Box>

      {/* Main Content: Filters + Results */}
      <Grid container spacing={4}>
        {/* Filters Panel (Left Column) */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2.5, position: 'sticky', top: '20px' }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Filters
            </Typography>
            
            {/* Sort By Section */}
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Sort By
              </Typography>
              <FormControl component="fieldset" size="small">
                <RadioGroup
                  aria-label="sort-by"
                  name="sort-by-group"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <FormControlLabel value="fees" control={<Radio size="small" />} label="Fees (Low to High)" data-testid="sort-fees" />
                  <FormControlLabel value="experience" control={<Radio size="small" />} label="Experience (High to Low)" data-testid="sort-experience" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Divider sx={{ my: 2 }} />

            {/* Consultation Mode Section */}
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom data-testid="filter-header-moc">
                Consultation Mode
              </Typography>
              <FormControl component="fieldset" size="small">
                <RadioGroup
                  aria-label="consultation-mode"
                  name="consultation-mode-group"
                  value={consultationType}
                  onChange={(e) => setConsultationType(e.target.value)}
                >
                  <FormControlLabel value="all" control={<Radio size="small" />} label="All" />
                  <FormControlLabel value="video" control={<Radio size="small" />} label="Video Consult" data-testid="filter-video-consult" />
                  <FormControlLabel value="clinic" control={<Radio size="small" />} label="In-Clinic" data-testid="filter-in-clinic" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Divider sx={{ my: 2 }} />

            {/* Specialties Section */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom data-testid="filter-header-speciality">
                Specialties
              </Typography>
              <FormGroup sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
                {specialties.map((specialty) => (
                  <FormControlLabel
                    key={specialty}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedSpecialties.includes(specialty)}
                        onChange={() => handleSpecialtyChange(specialty)}
                      />
                    }
                    label={specialty}
                    data-testid={`filter-specialty-${specialty.replace(/[^a-zA-Z]/g, '')}`}
                    sx={{ mr: 0 }}
                  />
                ))}
              </FormGroup>
            </Box>
          </Paper>
        </Grid>

        {/* Doctor List (Right Column) */}
        <Grid item xs={12} md={9}>
          {filteredDoctors.length > 0 ? (
            <Grid container spacing={3}>
              {filteredDoctors.map((doctor) => (
                <Grid item xs={12} sm={6} lg={4} key={doctor.id}>
                  <DoctorCard doctor={doctor} />
                </Grid>
              ))}
            </Grid>
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