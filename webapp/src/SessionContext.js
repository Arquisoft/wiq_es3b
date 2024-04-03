import React, { createContext, useState, useEffect } from 'react';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(() => {
    const storedSessionData = localStorage.getItem('sessionData');
    return storedSessionData ? JSON.parse(storedSessionData) : null;
  });

  const saveSessionData = (data) => {
    console.log('Datos de sesión guardados:', data);
    
    setSessionData(data);
    localStorage.setItem('sessionData', JSON.stringify(data));
  };

  const clearSessionData = () => {
    setSessionData(null);
    localStorage.removeItem('sessionData');
  };

  useEffect(() => {
    const storedSessionData = localStorage.getItem('sessionData');
    if (storedSessionData) {
      setSessionData(JSON.parse(storedSessionData));
    }
  }, []);

  return (
    <SessionContext.Provider value={{ sessionData, saveSessionData, clearSessionData }}>
      {children}
    </SessionContext.Provider>
  );
};
