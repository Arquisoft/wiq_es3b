import React, { useState } from 'react';
import AddUser from './AddUser';
import Login from './Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { FormattedMessage } from 'react-intl';
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
      <h1 className="titleLoginRegister">ASW - WIQ Quiz</h1>
      {showLogin ? <Login goTo={(x) => goTo(x)} changeLanguage={(y) => changeLanguage(y)} locale={locale} /> : 
      <AddUser goTo={(x) => goTo(x)} changeLanguage={(y) => changeLanguage(y)} locale={locale} />}
      <Typography component="div" align="center" sx={{ marginTop: 2 }}>
        {showLogin ? (
          <div className='btnRegister'>
            <Link className='link' name="gotoregister" component="button" variant="body2" onClick={handleToggleView}>
              <FormattedMessage id='noAccountRegister'/>
            </Link>
            <button className="btn sing" onClick={handleToggleView}><FormattedMessage id="signUp" tagName="span" /></button>
          </div>
        ) : (
          <div className='btnRegister'>
            <Link className='link' component="button" variant="body2" onClick={handleToggleView}>
              <FormattedMessage id='alreadyAccount'/>
            </Link>
          <button className="btn sing" onClick={handleToggleView}><FormattedMessage id="signIn" tagName="span" /></button>
          </div>
        )}
      </Typography>
    </Container>
    </div>
    </main>
  );
}

export default User;