import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import "../styles/Navbar.css"
import { useNavigate } from 'react-router';

export default function Navbar() {
  const navigate = useNavigate()

  const isAuthenticated = localStorage.getItem("token");
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); 
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="navbar">
        <Toolbar>
          <Typography className="navbar-title">
            What's cooking
          </Typography>
          <div className="button-container">
          { !isAuthenticated ? (
              <>
            <Button variant="outlined" className="login-button" startIcon={<LoginIcon />} onClick={() => navigate("/login")}>Login</Button>
            <Button variant="contained" className="signup-button" startIcon={ <PersonAddIcon /> } onClick={ () => navigate("/signup") }>Sign Up</Button>
            </> ) : (
              <Button 
                variant="outlined" 
                className="logout-button" 
                startIcon={<LogoutIcon />} 
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            )} </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
