import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../api/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('access_token');
    
    if (token) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }
    
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      const { user, tokens } = response.data;
      
      Cookies.set('access_token', tokens.access, { expires: 7 });
      Cookies.set('refresh_token', tokens.refresh, { expires: 7 });
      
      setUser(user);
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user, tokens } = response.data;
      
      Cookies.set('access_token', tokens.access, { expires: 7 });
      Cookies.set('refresh_token', tokens.refresh, { expires: 7 });
      
      setUser(user);
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    const refreshToken = Cookies.get('refresh_token');
    try {
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};