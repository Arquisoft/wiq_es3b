// src/components/AddUser.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, IconButton } from '@mui/material';

import profileImg1 from '../assets/defaultImgProfile.jpg';
import profileImg2 from '../assets/perfil2.jpg';
import profileImg3 from '../assets/perfil3.jpg';
import profileImg4 from '../assets/perfil4.jpg';
import profileImg5 from '../assets/perfil5.jpg';
import { SessionContext } from '../SessionContext';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = ({goTo}) => {
  const { saveSessionData } = useContext(SessionContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState('defaultImgProfile.jpg');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const addUser = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      await axios.post(`${apiEndpoint}/adduser`, { username, password, profileImage });
      setOpenSnackbar(true);
      try{
        const response = await axios.post(`${apiEndpoint}/login`, { username, password });
        const { createdAt: userCreatedAt, username: loggedInUsername, token, profileImage, userId: id } = response.data;
        setLoginSuccess(true);
        saveSessionData({ username: loggedInUsername, createdAt: userCreatedAt, token: token, profileImage: profileImage, userId: id });
      } catch (error) {
      }
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  useEffect(() => {
    if (loginSuccess) {
      goTo(1);
    }
  }, [loginSuccess, goTo]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleImageClick = (imageName) => {
    setProfileImage(imageName);
  }

  return (
    <Container component="div" maxWidth="xs" sx={{ marginTop: 8 }}>
      <Typography component="h2" variant="h5">
        &gt; Register a user
      </Typography>
      <TextField
        name="username"
        margin="normal"
        fullWidth
        label="Username"
        value={username}
        className='inputAddUser'
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
      <TextField
        name="confirmPassword"
        margin="normal"
        fullWidth
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Typography component="h3" variant="h5" sx={{ marginTop: 4 }}>
        Select a profile picture
      </Typography>
      <div id='fotosPerfil'>
        <IconButton className={`fotoPerfilBtn`} onClick={() => handleImageClick('defaultImgProfile.jpg')}>
          <img className={`fotoPerfil ${profileImage === 'defaultImgProfile.jpg' ? 'selectedImg' : ''}`}
                src={profileImg1} alt='Imagen Perfil 1' />
        </IconButton>
        <IconButton className={`fotoPerfilBtn`} onClick={() => handleImageClick('perfil2.jpg')}>
          <img className={`fotoPerfil ${profileImage === 'perfil2.jpg' ? 'selectedImg' : ''}`}
                src={profileImg2} alt='Imagen Perfil 2' />
        </IconButton>
        <IconButton className={`fotoPerfilBtn`} onClick={() => handleImageClick('perfil3.jpg')}>
          <img className={`fotoPerfil ${profileImage === 'perfil3.jpg' ? 'selectedImg' : ''}`}
                src={profileImg3} alt='Imagen Perfil 3' />
        </IconButton>
        <IconButton className={`fotoPerfilBtn`} onClick={() => handleImageClick('perfil4.jpg')}>
          <img className={`fotoPerfil ${profileImage === 'perfil4.jpg' ? 'selectedImg' : ''}`}
                src={profileImg4} alt='Imagen Perfil 4' />
        </IconButton>
        <IconButton className={`fotoPerfilBtn`} onClick={() => handleImageClick('perfil5.jpg')}>
          <img className={`fotoPerfil ${profileImage === 'perfil5.jpg' ? 'selectedImg' : ''}`}
                src={profileImg5} alt='Imagen Perfil 5' />
        </IconButton>
      </div>
      <Button className='buttonLoginRegister' variant="contained" color="primary" onClick={addUser} sx={{ marginTop: 4 }}>
        Sign up
      </Button>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="User added successfully" />
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}
    </Container>
  );
};

export default AddUser;
