import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const themeStyles = {
    appBar: {
      background: 'rgba(8, 13, 26, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(160, 130, 255, 0.15)',
      boxShadow: 'none',
      padding: '5px 0'
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
      color: '#f5f0ff',
      letterSpacing: '0.5px'
    },
    button: {
      fontFamily: "'DM Sans', sans-serif",
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '15px',
      color: '#9b9ec8',
      '&:hover': {
        color: '#a78bfa',
        background: 'rgba(167, 139, 250, 0.1)'
      }
    },
    logout: {
      color: '#f0606a',
      background: 'rgba(240, 96, 106, 0.1)',
      fontWeight: 600,
      marginLeft: '15px',
      '&:hover': {
        background: '#f0606a',
        color: '#fff'
      }
    }
  };

  return (
    <AppBar position="static" sx={themeStyles.appBar}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h6" component="div" sx={{ ...themeStyles.title, flexGrow: 1 }}>
            Hostel <span style={{ color: '#a78bfa' }}>Management</span>
          </Typography>
          {isLoggedIn && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {role === 'student' && (
                <>
                  <Button sx={themeStyles.button} component={Link} to="/student/dashboard">Dashboard</Button>
                  <Button sx={themeStyles.button} component={Link} to="/rooms">Room</Button>
                </>
              )}
              {role === 'warden' && (
                <>
                  <Button sx={themeStyles.button} component={Link} to="/warden/dashboard">Dashboard</Button>
                  <Button sx={themeStyles.button} component={Link} to="/rooms">Rooms</Button>
                </>
              )}
              <Button sx={{ ...themeStyles.button, ...themeStyles.logout }} onClick={handleLogout}>Logout</Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;