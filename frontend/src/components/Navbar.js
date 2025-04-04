import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="navbar">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography className={`navbar-title ${location.pathname === "/recipes" ? "shifted" : ""}`} sx={{ display: "flex", alignItems: "center" }}>
              <Link to="/recipes" style={{ textDecoration: "none", color: "inherit" }}>
                What's cooking
              </Link>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem", flexGrow: 1, justifyContent: "center" }}>
            {isAuthenticated && (
              <>
                <Link to="/recipes" style={{ textDecoration: "none" }}>
                  <Button className={`nav-buttons ${location.pathname === "/recipes" ? "shifted" : ""}`} color="primary">
                    Recipes
                  </Button>
                </Link>
                <Link to="/recipes/create" style={{ textDecoration: "none" }}>
                  <Button className={`nav-buttons ${location.pathname === "/recipes" ? "shifted" : ""}`} color="primary">
                    Create Recipe
                  </Button>
                </Link>
              </>
            )}
          </Box>{" "}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!isAuthenticated ? (
              <>
                <Button variant="outlined" className="login-button" startIcon={<LoginIcon />} onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button variant="contained" className="signup-button" startIcon={<PersonAddIcon />} onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
              </>
            ) : (
              <Button variant="outlined" className="logout-button" startIcon={<LogoutIcon />} onClick={handleLogout}>
                Sign Out
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
