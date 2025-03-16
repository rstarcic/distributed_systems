import React, {useState} from 'react';
import { Card, InputAdornment, CardActions, CardContent, Button, IconButton, Typography, TextField, Snackbar, Alert } from '@mui/material';
import "../styles/Signup.css"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router';
import axios from "axios";

const CLASSIC_URL = "http://localhost:8002";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [open, setOpen] = useState(false);


    const navigate = useNavigate()

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmedPassword = () => {
        setShowConfirmedPassword(!showConfirmedPassword)
    }

    const handleSignup = async () => {
        if (password !== confirmedPassword) {
            setMessage("Passwords do not match!");
            setMessageType("error");
            return;
        }
        try {
            const response = await axios.post(`${CLASSIC_URL}/auth/registration`, new URLSearchParams({ email: email, password: password }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
    
            if (response.status === 200) {
                setMessage("User registered successfully! 🎉");
                setMessageType("success");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error) {
            if(error.response) {
                if (error.response.status === 409) {
                    setMessage("User with this email alredy exists.");
                    setMessageType("error");
                } else {
                    setMessage("Failed to sign up. Please try again.");
                }
            } else {
                setMessage("Sign up failed! Please check your details.");
            }
        setMessageType("error");
        }
        setOpen(true);
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
             </CardContent>
              <CardActions className="signup-card-actions">
                <Button className="signin-button" variant="contained" size="medium" onClick={handleSignup}>Sign in</Button>
              </CardActions>
            </Card>
            <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={() => setOpen(false)} severity={messageType}>
                    {message}
                </Alert>
            </Snackbar>
    </div>      
    );
  };
  
export default Signup;