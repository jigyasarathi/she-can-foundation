import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('shecan_token');
    const saved = localStorage.getItem('shecan_admin');
    if (token && saved) {
      setAdmin(JSON.parse(saved));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('shecan_token', data.token);
    localStorage.setItem('shecan_admin', JSON.stringify(data.admin));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('shecan_token');
    localStorage.removeItem('shecan_admin');
    delete api.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
