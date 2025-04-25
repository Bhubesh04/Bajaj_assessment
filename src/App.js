import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DoctorListing from './components/DoctorListing';
import { Container, AppBar, Toolbar, TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Modern Blue & White Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2a7fec', // Match exact blue from image
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6c757d',
    },
    background: {
      default: '#f5f5f7', // Light grey background
      paper: '#ffffff',
    },
    text: {
      primary: '#343a40',
      secondary: '#6c757d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#343a40',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#0056b3',
          },
        },
        outlinedPrimary: {
          borderColor: '#2a7fec',
          '&:hover': {
            backgroundColor: 'rgba(42, 127, 236, 0.04)',
            borderColor: '#0056b3',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ced4da',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#adb5bd',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#2a7fec',
            borderWidth: '1px',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Top Blue Search Bar */}
        <AppBar 
          position="static" 
          sx={{ 
            backgroundColor: '#2a7fec',
            boxShadow: 'none',
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ justifyContent: 'center', py: 1 }}>
              <TextField
                placeholder="Search Symptoms, Doctors, Specialists, Clinics"
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 1,
                  width: { xs: '90%', sm: '70%' },
                  maxWidth: '600px',
                  '& .MuiOutlinedInput-root': {
                    paddingRight: 0,
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'transparent',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '8.5px 14px',
                    fontSize: '0.875rem',
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ 
                        backgroundColor: '#2a7fec',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '9px',
                        borderTopRightRadius: 4,
                        borderBottomRightRadius: 4,
                      }}>
                        <SearchIcon sx={{ color: 'white' }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Toolbar>
          </Container>
        </AppBar>
        
        {/* Main Content Area */}
        <Box sx={{ bgcolor: '#f5f5f7' }}>
          <Container maxWidth="lg" disableGutters>
            <DoctorListing /> 
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
