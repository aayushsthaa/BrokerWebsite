import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role:string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  savedProperties: string[];
  login: (token: string) => void;
  logout: () => void;
  toggleSavedProperty: (propertyId: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedProperties = async (token: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedProperties(response.data.map((p: any) => p._id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: User = jwtDecode(token);
        setUser(decoded);
        fetchSavedProperties(token);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded: User = jwtDecode(token);
    setUser(decoded);
    fetchSavedProperties(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setSavedProperties([]);
  };

  const toggleSavedProperty = async (propertyId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/toggle-save`, 
        { propertyId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedProperties(response.data.savedProperties);
    } catch (err) {
      console.error(err);
    }
  };

  const value = {
    user,
    loading,
    savedProperties,
    login,
    logout,
    toggleSavedProperty,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};