import React, { useState, useContext } from 'react';
import axios from 'axios';
import { SessionContext } from '../SessionContext';
import { Container, Typography, TextField, Button, Snackbar, IconButton } from '@mui/material';
import profileImg1 from '../assets/defaultImgProfile.jpg';
import profileImg2 from '../assets/perfil2.jpg';
import profileImg3 from '../assets/perfil3.jpg';
import profileImg4 from '../assets/perfil4.jpg';
import profileImg5 from '../assets/perfil5.jpg';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = ({ goTo }) => { 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState('defaultImgProfile.jpg');

  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { saveSessionData } = useContext(SessionContext);

  const addUser = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      await axios.post(`${apiEndpoint}/adduser`, { username, password, profileImage });
      setOpenSnackbar(true);

      // Llamar a la función de inicio de sesión automáticamente después de registrar un usuario
      loginUser();
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const loginUser = async () => {
    try {
      // Llamar a la API para iniciar sesión con las credenciales recién registradas
      const response = await axios.post(`${apiEndpoint}/login`, { username, password });

      // Extraer datos de la respuesta
      const { createdAt: userCreatedAt, username: loggedInUsername, userId: userId } = response.data;
      
      // Guardar la sesión del usuario
      saveSessionData({ username: loggedInUsername, createdAt: userCreatedAt, userId: userId});

      // Ir al siguiente componente después de iniciar sesión automáticamente
      goTo(1); 
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleImageClick = (imageName) => {
    setProfileImage(imageName);
  }

  return (
    <Container component="div" maxWidth="xs" sx={{ marginTop: 4 }}>
      <Typography component="h1" variant="h5">
        Add User
      </Typography>
      <TextField
        name="username"
        margin="normal"
        fullWidth
        label="Username"
        value={username}
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
      <Typography component="h2" variant="h5">
        Select a profile image
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
      <Button variant="contained" color="primary" onClick={addUser}>
        Add User
      </Button>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="User added successfully" />
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}
    </Container>
  );
};

export default AddUser;