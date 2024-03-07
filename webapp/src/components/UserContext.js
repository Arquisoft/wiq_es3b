import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    username: '',
  });

  const updateUser = (newData) => {
    setUserData((prevData) => ({ ...prevData, ...newData }));
  };

  return <UserContext.Provider value={{ userData, updateUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
