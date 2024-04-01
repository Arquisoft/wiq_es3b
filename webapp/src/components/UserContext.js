import { createContext, useContext, useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    username: '',
  });
  const history = useNavigate(); 

  const updateUser = (newData) => {
    setUserData((prevData) => ({ ...prevData, ...newData }));
  };

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8000/login', { username, password });
      const { createdAt: userCreatedAt } = response.data;

      setUserData({ username });
      history.push('/'); 
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return <UserContext.Provider value={{ userData, updateUser, loginUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
