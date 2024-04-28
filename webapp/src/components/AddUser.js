// src/components/AddUser.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar, IconButton } from '@mui/material';

import profileImg1 from '../assets/defaultImgProfile.jpg';
import profileImg2 from '../assets/perfil2.jpg';
import profileImg3 from '../assets/perfil3.jpg';
import profileImg4 from '../assets/perfil4.jpg';
import profileImg5 from '../assets/perfil5.jpg';
import { SessionContext } from '../SessionContext';
import { FormattedMessage } from 'react-intl';
import '../css/addUser.css';
import '../css/animatedBG.css';
import LanguageSelect from './LanguageSelect';
import Link from '@mui/material/Link';


const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

const AddUser = ({goTo, changeLanguage, locale, handleToggleView}) => {

  const [langEnd, setLangEnd] = useState(locale);

  useEffect(() => {
    changeLanguage(langEnd);
    
  }, [locale, changeLanguage, langEnd]);

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
      if (password.length < 4) {
        setError('Password must be at least 4 characters long');
        return;
      }
      
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
        saveSessionData({ username: loggedInUsername, createdAt: userCreatedAt, token, profileImage, userId: id });
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
    <Container component="div" maxWidth="xs" sx={{ marginTop: 4 }}>
      <h1 className="titleLoginRegister upEffect">ASW - WIQ Quiz</h1>
      <div className='inputsRegister'>
        <div className='topLogin upEffect'>
        <Typography component="h2" variant="h5">
          &gt; {<FormattedMessage id="register" />}
        </Typography>
        
        <LanguageSelect value={langEnd} onChange={(e) => {setLangEnd(e.target.value)}}/>
      </div>

      <TextField
        name="username"
        margin="normal"
        fullWidth
        label= {<FormattedMessage id="username" />}
        value={username}
        className='upEffect'
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        name="password"
        margin="normal"
        fullWidth
        label= {<FormattedMessage id="password" />}
        type="password"
        className='upEffect'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        name="confirmPassword"
        margin="normal"
        fullWidth
        label= {<FormattedMessage id="confirmPassword" />}
        type="password"
        className='upEffect'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Typography className={`selectImgText upEffect`} component="h3" variant="h5" sx={{ marginTop: 4 }}>
        <FormattedMessage id="selectProfileImg" />
      </Typography>
      <div id='fotosPerfil' className='upEffect'>
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
      <div className='btnRegister upEffect'>
        <button className="btn" onClick={addUser}><FormattedMessage id="signUp" tagName="span" /></button>
      </div>
      <div className='btnRegister upEffect'>
            <Link className='link' component="button" variant="body2" onClick={handleToggleView}>
              <FormattedMessage id='alreadyAccount'/>
            </Link>
          <button className="btn sing" onClick={handleToggleView}><FormattedMessage id="signIn" tagName="span" /></button>
      </div>
      <ul className="circles">
              <li></li><li></li><li></li><li></li><li></li>
              <li></li><li></li><li></li><li></li><li></li>
            </ul>
        </div> 
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={<FormattedMessage id="userAdd" />} />
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={<FormattedMessage id={error} />} />
      )}
    </Container>
  );
};

export default AddUser;
