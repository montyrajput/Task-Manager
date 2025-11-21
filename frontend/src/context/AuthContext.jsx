import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  
  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { username, password });

      setToken(res.data.token);
      setUser(res.data.user);

      setLoading(false);

      
      return { ok: true, user: res.data.user };
    } catch (err) {
      setLoading(false);
      return { ok: false, message: err.response?.data?.message || err.message };
    }
  };

  
  const register = async ({ username, password, role }) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { username, password, role });

      setToken(res.data.token);
      setUser(res.data.user);

      setLoading(false);
      return { ok: true, user: res.data.user };
    } catch (err) {
      setLoading(false);
      return { ok: false, message: err.response?.data?.message || err.message };
    }
  };

  
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
