// src/components/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for mobile menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const navigateTo = (path) => {
    handleMenuClose();
    navigate(path);
  };

  return (
    <AppBar position="static" sx={{ width: '100%' }}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'white',
              display: 'flex'
            }}
          >
            Dental Checkup System
          </Typography>

          {!isMobile ? (
            // Desktop menu
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {currentUser ? (
                <>
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    Hello, {currentUser.name} ({currentUser.role})
                  </Typography>
                  {currentUser.role === 'patient' && (
                    <Button color="inherit" component={Link} to="/dashboard">
                      Dashboard
                    </Button>
                  )}
                  {currentUser.role === 'dentist' && (
                    <Button color="inherit" component={Link} to="/dentist/dashboard">
                      Dashboard
                    </Button>
                  )}
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                </>
              )}
            </Box>
          ) : (
            // Mobile hamburger menu
            <Box>
              <IconButton
                color="inherit"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                edge="end"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleMenuClose}
              >
                {currentUser ? (
                  [
                    <MenuItem key="user-info" disabled>
                      Hello, {currentUser.name} ({currentUser.role})
                    </MenuItem>,
                    currentUser.role === 'patient' && (
                      <MenuItem key="dashboard" onClick={() => navigateTo('/dashboard')}>
                        Dashboard
                      </MenuItem>
                    ),
                    currentUser.role === 'dentist' && (
                      <MenuItem key="dentist-dashboard" onClick={() => navigateTo('/dentist/dashboard')}>
                        Dashboard
                      </MenuItem>
                    ),
                    <MenuItem key="logout" onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  ]
                ) : (
                  [
                    <MenuItem key="login" onClick={() => navigateTo('/login')}>
                      Login
                    </MenuItem>,
                    <MenuItem key="register" onClick={() => navigateTo('/register')}>
                      Register
                    </MenuItem>
                  ]
                )}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;