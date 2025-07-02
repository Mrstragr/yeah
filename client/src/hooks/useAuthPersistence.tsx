import { useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuthPersistence() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const login = useCallback(async (phone: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store auth token with expiration
        const expirationTime = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authExpiration', expirationTime.toString());
        
        // Fetch and store user profile
        const userProfile = await fetchUserProfile(data.token);
        if (userProfile) {
          setAuthState({
            user: userProfile,
            isLoading: false,
            isAuthenticated: true,
          });
          return { success: true };
        }
      }
      
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to demo mode for development
      if (phone === '9876543210' && password === 'demo123') {
        const demoUser: User = {
          id: 1,
          username: 'Demo User',
          phone: '9876543210',
          email: 'demo@91club.com',
          walletBalance: '1000.00',
          isVerified: true
        };
        
        setAuthState({
          user: demoUser,
          isLoading: false,
          isAuthenticated: true,
        });
        
        return { success: true };
      }
      
      return { success: false, message: 'Connection error. Try demo credentials: 9876543210 / demo123' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authExpiration');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const fetchUserProfile = useCallback(async (token: string): Promise<User | null> => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
    return null;
  }, []);

  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    const expiration = localStorage.getItem('authExpiration');
    
    if (!token || !expiration) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Check if token is expired
    if (Date.now() > parseInt(expiration)) {
      logout();
      return;
    }

    // Verify token with server
    const userProfile = await fetchUserProfile(token);
    if (userProfile) {
      setAuthState({
        user: userProfile,
        isLoading: false,
        isAuthenticated: true,
      });
    } else {
      logout();
    }
  }, [logout, fetchUserProfile]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updates } : null,
    }));
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    ...authState,
    login,
    logout,
    updateUser,
    checkAuthStatus,
  };
}