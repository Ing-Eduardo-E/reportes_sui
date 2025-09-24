import Cookies from 'js-cookie';
import { User } from '@/types';

// Esta función ahora se ejecuta en el cliente y llama a la API
export const validateCredentials = async (username: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return null;
    }
    
    return data.user;
    
  } catch {
    return null;
  }
};

// Simple token generation without JWT library (client-side compatible)
export const generateToken = (user: User): string => {
  const payload = {
    user,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  // Simple base64 encoding for client-side token
  return btoa(JSON.stringify(payload));
};

export const verifyToken = (token: string): User | null => {
  try {
    const decoded = JSON.parse(atob(token));
    
    // Check if token is expired
    if (decoded.exp < Date.now()) {
      return null;
    }
    
    return decoded.user;
  } catch {
    return null;
  }
};

export const setAuthCookie = (token: string): void => {
  Cookies.set('auth-token', token, { 
    expires: 1, // 1 día
    secure: false, // true en producción con HTTPS
    sameSite: 'lax'
  });
};

export const getAuthCookie = (): string | undefined => {
  return Cookies.get('auth-token');
};

export const removeAuthCookie = (): void => {
  Cookies.remove('auth-token');
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const token = getAuthCookie();
  if (!token) return null;
  
  return verifyToken(token);
};