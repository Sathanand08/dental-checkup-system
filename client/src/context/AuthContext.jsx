import React, { createContext, useState, useEffect } from 'react';
import * as jwt_decode from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
          // Check if token is expired
          const decodedToken = jwt_decode.decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp > currentTime) {
            // Token is valid, load user data
            const userData = localStorage.getItem('user');
            
            if (userData) {
              const user = JSON.parse(userData);
              setCurrentUser(user);
              
              // Set token for API requests
              api.defaults.headers.common['x-auth-token'] = token;
            }
          } else {
            // Token is expired, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set for API requests
      api.defaults.headers.common['x-auth-token'] = token;
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set for API requests
      api.defaults.headers.common['x-auth-token'] = token;
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear API header
    delete api.defaults.headers.common['x-auth-token'];
    
    setCurrentUser(null);
  };

  useEffect(() => {
    console.log('Auth state updated:', { 
      isAuthenticated: !!currentUser,
      user: currentUser,
      loading
    });
  }, [currentUser, loading]);

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};