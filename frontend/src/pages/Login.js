import React, {useState} from 'react';
import { Card, InputAdornment, CardActions, CardContent, Button, IconButton, Typography, TextField } from '@mui/material';
import "../styles/Login.css"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:8000/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
  };
  
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        new URLSearchParams({ username: email, password: password }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
  
      if (response.status === 200) {
        alert("Login successful!");
        navigate("/recipes")
        console.log("Token:", response.data.access_token);
        localStorage.setItem("token", response.data.access_token);
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed! Please check your credentials.");
    }
  };

    return (
        <div className="login-container">
            <Card className="card">
              <CardContent className="card-content">
                <Typography className="card-header">
                  Login
                </Typography>
                    <TextField className="email-field" label="Email" variant="outlined" required={ true } value={ email } onChange={ (e) => setEmail(e.target.value) } />
                    <TextField className="password-field" type={ showPassword ? "text" : "password" } label="Password" value={ password } onChange={ (e) => setPassword(e.target.value) } required={ true } id="outlined-basic" variant="outlined"
               slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}/>
             </CardContent>
              <CardActions className="card-actions">
                <Button className="continue-button" variant="contained" size="medium" onClick={handleLogin}>Sign in</Button>
              </CardActions>
            </Card>
    </div>      
    );
  };
  
export default Login;
  