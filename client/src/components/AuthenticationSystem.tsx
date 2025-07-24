import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, User, Lock, Phone, Mail, ArrowRight, Crown, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Props {
  onSuccess: (user: any) => void;
}

export default function AuthenticationSystem({ onSuccess }: Props) {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        username: loginData.username,
        password: loginData.password
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.username}!`,
        });
        onSuccess(data.user);
      } else {
        const error = await response.json();
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.username || !signupData.phone || !signupData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/register', {
        username: signupData.username,
        phone: signupData.phone,
        email: signupData.email,
        password: signupData.password
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        toast({
          title: "Account Created",
          description: `Welcome to Perfect91Club, ${data.user.username}!`,
        });
        onSuccess(data.user);
      } else {
        const error = await response.json();
        toast({
          title: "Signup Failed",
          description: error.message || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Signup Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-40 w-28 h-28 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-20 animate-bounce delay-500"></div>
        
        {/* Floating Stars */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Star className="w-2 h-2" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-md mx-auto bg-white min-h-screen relative z-10">
        
        {/* Header with Brand */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10"></div>
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl"
            >
              <Crown className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black text-white mb-2"
            >
              PERFECT91CLUB
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-purple-100 text-sm font-medium"
            >
              Premium Indian Gaming Platform
            </motion.p>
          </div>
        </div>

        {/* Auth Mode Toggle */}
        <div className="p-6 pb-4">
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                authMode === 'login'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-500'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                authMode === 'signup'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-500'
              }`}
            >
              SIGN UP
            </button>
          </div>
        </div>

        {/* Forms */}
        <div className="px-6 pb-8">
          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              <motion.form
                key="login"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Username or Phone"
                      value={loginData.username}
                      onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                      className="pl-12 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-12 pr-12 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      LOGIN
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSignup}
                className="space-y-5"
              >
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Username"
                      value={signupData.username}
                      onChange={(e) => setSignupData(prev => ({ ...prev, username: e.target.value }))}
                      className="pl-12 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={signupData.phone}
                      onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-12 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="email"
                      placeholder="Email (optional)"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-12 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-12 pr-12 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-12 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      CREATE ACCOUNT
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </Button>

                <div className="text-center text-xs text-gray-500 leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <span className="text-purple-600 font-medium">Terms of Service</span> and{' '}
                  <span className="text-purple-600 font-medium">Privacy Policy</span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Demo Login */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4">
            <div className="text-center">
              <div className="text-sm font-bold text-yellow-700 mb-2">🎮 Demo Access</div>
              <div className="text-xs text-yellow-600 mb-3">
                For testing: Username: <span className="font-bold">demo</span> | Password: <span className="font-bold">demo123</span>
              </div>
              <button
                onClick={() => {
                  setLoginData({ username: 'demo', password: 'demo123' });
                  setAuthMode('login');
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
              >
                Use Demo Account
              </button>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="px-6 pb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-purple-50 rounded-2xl p-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-bold text-purple-700">Premium Games</div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-bold text-blue-700">Secure Wallet</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-4">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div className="text-xs font-bold text-green-700">Real Rewards</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}