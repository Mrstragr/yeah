import { useState, useEffect } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  walletBalance: number;
  isVerified: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('91club_user');
    const savedToken = localStorage.getItem('91club_token');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        console.error('Error parsing saved user data:', err);
        localStorage.removeItem('91club_user');
        localStorage.removeItem('91club_token');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    const token = `demo_token_${Date.now()}`;
    localStorage.setItem('91club_user', JSON.stringify(userData));
    localStorage.setItem('91club_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('91club_user');
    localStorage.removeItem('91club_token');
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}