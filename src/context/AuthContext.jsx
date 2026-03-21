import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await api.post('/login', { email, senha });
      const { access_token } = response.data;
      
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      const currentUser = {
        email: payload.email,
        is_admin: payload.is_admin,
        user_id: payload.user_id,
      };

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      setToken(access_token);
      setUser(currentUser);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Erro ao fazer login. Verifique as credenciais.' 
      };
    }
  };

  const register = async (nome, email, senha) => {
    try {
      await api.post('/registrar', { nome, email, senha });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Erro ao criar conta.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
