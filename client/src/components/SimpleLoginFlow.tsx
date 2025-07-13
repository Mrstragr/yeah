import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, Mail, User } from 'lucide-react';

interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  balance: string;
  isVerified: boolean;
}

interface SimpleLoginFlowProps {
  onAuthSuccess: (user: User) => void;
  onAuthError: (error: string) => void;
}

export default function SimpleLoginFlow({ onAuthSuccess, onAuthError }: SimpleLoginFlowProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      onAuthError('Please enter phone and password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store auth token
        localStorage.setItem('authToken', data.token);
        
        // Fetch user profile
        const profileResponse = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          onAuthSuccess({
            id: userData.id,
            username: userData.username || userData.firstName || 'User',
            phone: userData.phone,
            email: userData.email,
            balance: userData.balance,
            isVerified: userData.isVerified || false
          });
        } else {
          onAuthError('Failed to load user profile');
        }
      } else {
        onAuthError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      onAuthError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!phone || !password || !email || !firstName) {
      onAuthError('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          password,
          email,
          firstName,
          lastName
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store auth token
        localStorage.setItem('authToken', data.token);
        
        onAuthSuccess({
          id: data.user.id,
          username: data.user.firstName || 'User',
          phone: data.user.phone,
          email: data.user.email,
          balance: data.user.balance,
          isVerified: false
        });
      } else {
        onAuthError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      onAuthError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-orange-500 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* 91CLUB Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-red-600 mb-2">
            ⭕91CLUB
          </div>
          <div className="text-gray-600">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </div>
        </div>

        {/* Toggle Login/Register */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isLogin 
                ? 'bg-red-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isLogin 
                ? 'bg-red-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Register
          </button>
        </div>

        <div className="space-y-4">
          {/* Registration fields */}
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="First Name *"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </>
          )}

          {/* Phone number */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit button */}
          <button
            onClick={isLogin ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Create Account')}
          </button>

          {/* KYC Notice for registration */}
          {!isLogin && (
            <div className="text-center text-sm text-gray-600 mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="font-medium text-yellow-800">📋 KYC Verification Required</p>
              <p className="mt-1">You can complete KYC verification later from your account settings or when making deposits/withdrawals.</p>
            </div>
          )}

          {/* Demo credentials for login */}
          {isLogin && (
            <div className="text-center text-sm text-gray-600 mt-4">
              Demo: 9876543210 / demo123
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}