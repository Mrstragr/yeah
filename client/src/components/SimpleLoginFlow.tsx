import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, Mail, User } from 'lucide-react';

// Lazy load OTP and ForgotPassword components
const OTPVerification = React.lazy(() => import('./OTPVerification'));
const ForgotPassword = React.lazy(() => import('./ForgotPassword'));

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
  const [currentView, setCurrentView] = useState<'auth' | 'otp' | 'forgot-password'>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState<'signup' | 'login' | 'forgot-password'>('signup');
  const [tempUserData, setTempUserData] = useState<any>(null);

  const handleLogin = async () => {
    if (!phone || !password) {
      onAuthError('Please enter phone and password');
      return;
    }

    setLoading(true);
    try {
      // First verify password
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store auth token temporarily
        localStorage.setItem('authToken', data.token);
        
        // Send OTP for additional security
        const otpResponse = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone,
            purpose: 'login'
          }),
        });

        const otpData = await otpResponse.json();
        
        if (otpData.success) {
          setOtpPurpose('login');
          setCurrentView('otp');
        } else {
          // Fallback to direct login if OTP fails
          onAuthSuccess({
            id: data.user.id,
            username: data.user.fullName || data.user.firstName || 'User',
            phone: data.user.phone,
            email: data.user.email,
            balance: data.user.walletBalance || '10000.00',
            isVerified: data.user.isVerified || false
          });
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
      onAuthError('Please fill all required fields: phone, password, email, and name');
      return;
    }

    if (phone.length < 10) {
      onAuthError('Please enter a valid 10-digit phone number');
      return;
    }

    if (password.length < 6) {
      onAuthError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Check if user already exists
      const checkResponse = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          purpose: 'signup',
          tempUserData: {
            phone,
            password,
            email,
            fullName: firstName + (lastName ? ' ' + lastName : '')
          }
        }),
      });

      const data = await checkResponse.json();

      if (checkResponse.ok && data.success) {
        // Store temp user data
        setTempUserData({
          phone,
          password,
          email,
          fullName: firstName + (lastName ? ' ' + lastName : '')
        });
        setOtpPurpose('signup');
        setCurrentView('otp');
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

  // Handle OTP verification success
  const handleOTPSuccess = (data: any) => {
    if (otpPurpose === 'signup' || otpPurpose === 'login') {
      onAuthSuccess({
        id: data.user.id,
        username: data.user.fullName || data.user.firstName || 'User',
        phone: data.user.phone,
        email: data.user.email,
        balance: data.user.walletBalance || '10000.00',
        isVerified: data.user.isVerified || false
      });
    }
  };

  // Handle forgot password success
  const handleForgotPasswordSuccess = () => {
    setCurrentView('auth');
    setIsLogin(true);
    onAuthError('Password reset successful! Please login with your new password.');
  };

  // Handle back to auth
  const handleBackToAuth = () => {
    setCurrentView('auth');
    setTempUserData(null);
  };

  // Show OTP screen
  if (currentView === 'otp') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-orange-500 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
        <OTPVerification
          phoneNumber={phone}
          purpose={otpPurpose}
          onVerificationSuccess={handleOTPSuccess}
          onVerificationError={onAuthError}
          onBack={handleBackToAuth}
          tempUserData={tempUserData}
        />
      </Suspense>
    );
  }

  // Show forgot password screen
  if (currentView === 'forgot-password') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-orange-500 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
        <ForgotPassword
          onBack={handleBackToAuth}
          onSuccess={handleForgotPasswordSuccess}
          onError={onAuthError}
        />
      </Suspense>
    );
  }

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
              placeholder="Phone number (10 digits)"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhone(value);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 6 characters)"
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
            {loading ? 'Please wait...' : (isLogin ? 'Login with OTP' : 'Register with OTP')}
          </button>

          {/* Forgot Password Link */}
          {isLogin && (
            <div className="text-center mt-4">
              <button
                onClick={() => setCurrentView('forgot-password')}
                className="text-red-600 text-sm font-medium hover:text-red-700 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* KYC Notice for registration */}
          {!isLogin && (
            <div className="text-center text-sm text-gray-600 mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="font-medium text-yellow-800">📋 KYC Verification Required</p>
              <p className="mt-1">You can complete KYC verification later from your account settings or when making deposits/withdrawals.</p>
            </div>
          )}

          {/* Demo info */}
          <div className="text-center text-sm text-gray-600 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-medium text-blue-800">📱 Demo Mode</p>
            <p className="mt-1">
              {isLogin 
                ? 'Use any 10-digit phone + password. OTP will be 123456'
                : 'Use any valid details. OTP will be 123456'
              }
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}