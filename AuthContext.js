// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from './apiClient'; 
import * as tokenStorage from './tokenStorage'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await tokenStorage.getToken();
      if (storedToken) {
        setToken(storedToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  
  const login = async (username, password) => { 
    try {
      const response = await apiClient.post('/user/login', {
        username, 
        password,
      });
      const { token } = response.data;
      setToken(token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await tokenStorage.saveToken(token);
    } catch (error) {
      console.error('Error en el login:', error);
      throw error; 
    }
  };

  
  const logout = async () => {
    setToken(null);
    delete apiClient.defaults.headers.common['Authorization'];
    await tokenStorage.deleteToken();
  };

  
  const register = async (username, gmail, password, birthday) => {
    try {

      await apiClient.post('/user', {
        username,
        gmail,
        password,
        birthday 
      });

      // Si el registro es exitoso, inicia sesión automáticamente
      await login(username, password);

    } catch (error) {
      console.error('Error en el registro:', error);
      throw error; 
    }
  };
  // -------------------------


  const value = {
    token,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};