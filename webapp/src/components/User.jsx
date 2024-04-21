import React, { useState } from 'react';
import AddUser from './AddUser';
import Login from './Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import '../css/users.css';

function User({ goTo, changeLanguage, locale }) {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <main>
      <div>
    <Container component="main">
      <CssBaseline />
      
      {showLogin ? 
      <Login goTo={(x) => goTo(x)} changeLanguage={(y) => changeLanguage(y)} locale={locale} handleToggleView={() => handleToggleView()} /> : 
      <AddUser goTo={(x) => goTo(x)} changeLanguage={(y) => changeLanguage(y)} locale={locale} handleToggleView={() => handleToggleView()} />}
      <Typography component="div" align="center" sx={{ marginTop: 2 }}>
      </Typography>
    </Container>
    </div>
    </main>
  );
}

export default User;