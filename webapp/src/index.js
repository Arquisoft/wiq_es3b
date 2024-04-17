import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/layout.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from './SessionContext';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'roboto',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700, 
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionProvider>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
    </SessionProvider>
  </React.StrictMode>
);

reportWebVitals();
