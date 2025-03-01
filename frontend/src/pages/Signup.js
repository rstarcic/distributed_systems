import React, {useState} from 'react';
import { Card, InputAdornment, CardActions, CardContent, Button, IconButton, Typography, TextField } from '@mui/material';
import "../styles/Signup.css"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router';
import axios from "axios";

const API_URL = "http://localhost:8000/auth";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); 

    const navigate = useNavigate()

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmedPassword = () => {
        setShowConfirmedPassword(!showConfirmedPassword)
    }

    const handleSignup = async () => {
        if (password !== confirmedPassword) {
            setErrorMessage("Passwords do not match!");
        } else {
            setErrorMessage("");
        }
        try {
            const response = await axios.post(`${API_URL}/register`, new URLSearchParams({ email: email, password: password }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
    
            if (response.status === 200) {
                console.log("Sign up successful!");
                alert("Sign up successful!");
                navigate("/login"); 
            } else {
                setErrorMessage("Failed to sign up. Please try again.");
            }
        } catch (error) {
            console.error("Sign up error:", error);
            setErrorMessage("Sign up failed! Please check your details.");
        }
    };

    return (
        <div className="signup-container">
            <Card className="signup-card">
              <CardContent className="signup-card-content">
                <Typography className="signup-card-header">
                  Signup
                    </Typography>
                    <TextField className="email-field" label="Email" variant="outlined" required={ true } value={ email } onChange={ (e) => setEmail(e.target.value) }/>
                    <TextField className="password-field" type={ showPassword ? "text" : "password" } label="Password" value={ password } onChange={ (e) => setPassword(e.target.value) } required={ true } variant="outlined" slotProps={ {
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={ handleClickShowPassword }
                                        edge="end"
                                    >
                                        { showPassword ? <VisibilityOffIcon /> : <VisibilityIcon /> }
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    } }
                    />
                    <TextField className="confirm-password-field" type={ showConfirmedPassword ? "text" : "password" } label="Confirm password" value={ confirmedPassword } onChange={ (e) => setConfirmedPassword(e.target.value) } required={ true } variant="outlined"
                    slotProps={ {
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={ handleClickShowConfirmedPassword }
                                        edge="end"
                                    >
                                        { showConfirmedPassword ? <VisibilityOffIcon /> : <VisibilityIcon /> }
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    } }
                    />
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
             </CardContent>
              <CardActions className="signup-card-actions">
                <Button className="signin-button" variant="contained" size="medium" onClick={handleSignup}>Sign in</Button>
              </CardActions>
            </Card>
    </div>      
    );
  };
  
export default Signup;