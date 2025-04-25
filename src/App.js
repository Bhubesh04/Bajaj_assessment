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
      main: '#007bff', // A vibrant blue
      contrastText: '#ffffff', // White text on primary
    },
    secondary: {
      main: '#6c757d', // A neutral secondary color
    },
    background: {
      default: '#f8f9fa', // Very light grey background
      paper: '#ffffff',   // White for paper elements like cards/filters
    },
    text: {
      primary: '#343a40', // Dark grey for primary text
      secondary: '#6c757d', // Lighter grey for secondary text
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif', // Modern font stack
    h4: {
      fontWeight: 600, // Bolder headings
      color: '#343a40',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // No uppercase buttons
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8, // Slightly more rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // No default shadow on buttons
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#0056b3', // Darker blue on hover
          },
        },
        outlinedPrimary: {
          borderColor: '#007bff',
          '&:hover': {
            backgroundColor: 'rgba(0, 123, 255, 0.04)', // Light blue background on hover
            borderColor: '#0056b3',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)', // Subtle shadow for paper
        },
      },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ced4da', // Lighter border for inputs
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#adb5bd',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#007bff', // Blue border on focus
                    borderWidth: '1px', // Ensure consistent border width
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
        {/* Top Blue Search Bar - Styled to match image */}
        <AppBar 
          position="static" 
          sx={{ 
            backgroundColor: '#2a7fec', // Exact blue from image sample
            boxShadow: 'none', // No shadow on the bar itself
          }}
        >
          <Container maxWidth="lg"> {/* Center content */}
            <Toolbar disableGutters sx={{ justifyContent: 'center', py: 1 }}>
                <TextField
                  placeholder="Search Symptoms, Doctors, Specialists, Clinics"
                  variant="outlined"
                  size="small"
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 1,
                    width: '70%', // Adjust width to approximate image
                    maxWidth: '800px',
                    '& .MuiOutlinedInput-root': {
                        paddingRight: 0, // Remove padding for icon button
                      '& fieldset': {
                        borderColor: 'transparent', // No border
                      },
                      '&:hover fieldset': {
                        borderColor: 'transparent',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'transparent',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                        padding: '8.5px 14px', // Match default small TextField padding
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {/* Search Icon Button (Optional clickable) */}
                         <Box sx={{ 
                             backgroundColor: 'primary.main', // Same blue as bar
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center',
                             padding: '8px',
                             borderTopRightRadius: (theme) => theme.shape.borderRadius,
                             borderBottomRightRadius: (theme) => theme.shape.borderRadius,
                             marginRight: '-1px' // Overlap slightly
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
        <Container maxWidth="lg" sx={{ pt: 3 }}> {/* Reduced top padding */}
          <DoctorListing /> 
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
