'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getCurrentUser, setAuthCookie, removeAuthCookie } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Llamar a la API de autenticación
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return false;
      }
      
      // Si la autenticación es exitosa, usar el token de la API
      const token = data.token;
      setAuthCookie(token);
      setUser(data.user);
      return true;
      
    } catch {
      return false;
    }
  };

  const logout = () => {
    removeAuthCookie();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };
};