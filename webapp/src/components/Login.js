// src/components/Login.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar } from '@mui/material';
import { SessionContext } from '../SessionContext';
import '../css/login.css';
import '../css/animatedBG.css';

const Login = ({ goTo }) => {

  const { saveSessionData, sessionData } = useContext(SessionContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  // eslint-disable-next-line
  const [createdAt, setCreatedAt] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // eslint-disable-next-line
  const [timeStart, setTimeStart] = useState(0);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      // Extract data from the response
      const { createdAt: userCreatedAt, username: loggedInUsername, token, profileImage, userId: id } = response.data;
      
      setTimeStart(Date.now());
      setCreatedAt(userCreatedAt);
      setLoginSuccess(true);
      saveSessionData({ username: loggedInUsername, createdAt: userCreatedAt, token, profileImage, userId: id });
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };
  const autologin = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/verify`, {
        headers: {
          Authorization: 'Bearer '+sessionData.token
        }
      });
      if(response.status && response.status===200){
        goTo(1);
      }
    } catch (error) {
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  useEffect(() => {
    sessionData?.token && autologin();
    //eslint-disable-next-line
  }, []);  
  useEffect(() => {
    if (loginSuccess) {
      goTo(1);
    }
  }, [loginSuccess, goTo]);

  return (
    <Container component="div" maxWidth="xs" sx={{ marginTop: 4 }}>
      <div className="area" >
        <div className='inputsRegister'>
          <Typography component="h2" variant="h5">
            &gt; Login
          </Typography>
          <TextField
            name="username"
            margin="normal"
            fullWidth
            label="Username"
            value={username}
            className='tf'
            sx={{ color:'#8f95fd !important' }}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            name="password"
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button className="btn" onClick={loginUser}><span>Login</span></button>
          </div>
            <ul className="circles">
              <li></li><li></li><li></li><li></li><li></li>
              <li></li><li></li><li></li><li></li><li></li>
            </ul>
        </div> 
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
          {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
          )}
        </div>
    </Container>
  );
};

export default Login;
