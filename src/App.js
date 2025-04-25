import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DoctorListing from './components/DoctorListing';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  TextField, 
  InputAdornment, 
  Box,
  IconButton,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Dark + Silver Accent Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#94c5ff', // Light blue accent
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c3c8ff', // Light purple accent
    },
    background: {
      default: '#0f1624', // Very dark blue/black background
      paper: '#1a1f2e', // Slightly lighter than background
      card: '#1e2133', // Card background
      accent: '#171c2c', // Accent background
    },
    text: {
      primary: '#e0e0e0', // Almost white text
      secondary: '#a0a0a0', // Light gray text
      accent: '#94c5ff', // Light blue text accent
    },
    divider: 'rgba(120, 120, 120, 0.15)', // Subtle dividers
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#ffffff',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    subtitle1: {
      letterSpacing: '0.01em',
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to bottom right, rgba(30, 33, 51, 0.95), rgba(25, 28, 45, 0.95))',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(120, 120, 120, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 12,
          transition: 'all 0.3s ease-in-out',
          border: '1px solid rgba(100, 100, 120, 0.15)',
          '&:hover': {
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(120, 120, 120, 0.2)',
            transform: 'translateY(-3px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to bottom, rgba(30, 33, 51, 0.97), rgba(25, 28, 45, 0.97))',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(120, 120, 120, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          backgroundImage: 'linear-gradient(135deg, #4286f5, #5e9cff)',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #3471d8, #4286f5)',
          },
        },
        outlined: {
          borderColor: '#94c5ff',
          borderWidth: 1.5,
          boxShadow: '0 0 10px rgba(68, 142, 242, 0.2)',
          '&:hover': {
            borderColor: '#b8d8ff',
            boxShadow: '0 0 15px rgba(68, 142, 242, 0.4)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 33, 51, 0.5)',
          backdropFilter: 'blur(10px)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(150, 150, 150, 0.3)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(150, 150, 150, 0.5)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#94c5ff',
            borderWidth: '1.5px',
          },
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: 'rgba(150, 150, 150, 0.5)',
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: 'rgba(150, 150, 150, 0.5)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '2px solid rgba(120, 180, 255, 0.2)',
        },
      },
    },
  },
});

function AnimatedStar({ top, left, size, delay, duration }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [twinkle, setTwinkle] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), delay);
    
    // Subtle movement effect
    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 10 - 5,
        y: Math.random() * 10 - 5
      });
      
      // Twinkle effect
      setTwinkle(prev => !prev);
    }, duration);
    
    return () => clearInterval(interval);
  }, [delay, duration]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        opacity: visible ? (twinkle ? 0.9 : 0.6) : 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: `opacity 1.5s ease, transform ${duration/1000}s ease`,
        zIndex: 0
      }}
    >
      {twinkle ? 
        <StarIcon sx={{ fontSize: size, color: 'rgba(180, 180, 255, 0.6)' }} /> : 
        <StarBorderIcon sx={{ fontSize: size, color: 'rgba(180, 180, 255, 0.5)' }} />
      }
    </Box>
  );
}

function App() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Generate stars data
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 15 + 10, // 10-25px
    delay: Math.random() * 3000, // 0-3s delay
    duration: Math.random() * 3000 + 2000 // 2-5s duration
  }));

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle search button click
  const handleSearchSubmit = () => {
    // This would be for additional search logic if needed
    console.log("Search submitted:", searchQuery);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Animated background */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 10% 10%, #1a2342 0%, #0f1624 70%)',
            backgroundSize: 'cover',
            zIndex: -1,
            overflow: 'hidden'
          }}
        >
          {/* Stars */}
          {stars.map(star => (
            <AnimatedStar key={star.id} {...star} />
          ))}
          
          {/* Gradient overlay */}
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(15, 22, 36, 0.4) 0%, rgba(15, 22, 36, 0.8) 80%)',
              zIndex: 1
            }}
          />
        </Box>

        {/* Top Search Bar */}
        <AppBar 
          position="static" 
          sx={{ 
            backgroundColor: 'transparent',
            backgroundImage: 'linear-gradient(to bottom, rgba(15, 20, 35, 0.9), rgba(20, 25, 40, 0.7))',
            backdropFilter: 'blur(10px)',
            boxShadow: 'none',
            borderBottom: '1px solid rgba(100, 100, 120, 0.15)',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ justifyContent: 'center', py: 1.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  width: { xs: '90%', sm: '70%' },
                  maxWidth: '600px',
                  position: 'relative',
                }}
              >
                <TextField
                  placeholder="Search Symptoms, Doctors, Specialists, Clinics"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchQuery}
                  onChange={handleSearchChange}
                  sx={{
                    backgroundColor: 'rgba(30, 35, 50, 0.5)',
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)',
                    '& .MuiOutlinedInput-root': {
                      paddingRight: 0,
                      '& fieldset': {
                        borderColor: 'rgba(150, 150, 200, 0.2)',
                        borderWidth: 1.5,
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(150, 150, 200, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(150, 150, 255, 0.5)',
                        boxShadow: '0 0 10px rgba(100, 150, 255, 0.2)',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: '12px 14px',
                      fontSize: '0.95rem',
                      color: theme.palette.text.primary,
                    },
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IconButton
                    onClick={handleSearchSubmit}
                    sx={{
                      backgroundColor: 'rgba(85, 130, 230, 0.9)',
                      height: '100%',
                      width: '45px',
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(100, 150, 255, 1)',
                      },
                    }}
                  >
                    <SearchIcon sx={{ color: 'white' }} />
                  </IconButton>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        
        {/* Main Content Area */}
        <Box sx={{ 
          pt: 3, 
          minHeight: 'calc(100vh - 80px)',
          position: 'relative',
          zIndex: 2
        }}>
          <Container 
            maxWidth="xl" 
            disableGutters
            sx={{
              px: { xs: 0, sm: 1, md: 2 },
              mx: 'auto',
              maxWidth: { xs: '100%', lg: '1280px' }
            }}
          >
            <DoctorListing searchQuery={searchQuery} /> 
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
