import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Phone, Mail, Lock, HelpCircle } from 'lucide-react';

interface LoginInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { phone?: string; email?: string; password: string; rememberMe: boolean }) => void;
}

export const LoginInterface = ({ isOpen, onClose, onLogin }: LoginInterfaceProps) => {
  const [loginType, setLoginType] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const credentials = {
      password,
      rememberMe: rememberPassword,
      ...(loginType === 'phone' ? { phone: `${countryCode}${phoneNumber}` } : { email })
    };
    onLogin(credentials);
  };

  const handleRegister = () => {
    // Will implement registration in next step
    console.log('Register clicked');
  };

  const handleForgotPassword = () => {
    // Will implement forgot password in next step
    console.log('Forgot password clicked');
  };

  const handleCustomerService = () => {
    // Will implement customer service in next step
    console.log('Customer service clicked');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-400 to-pink-400 text-white px-4 py-6 relative">
        <button 
          onClick={onClose}
          className="absolute left-4 top-6 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {/* Language selector */}
        <div className="absolute right-4 top-6 flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
          <div className="w-6 h-4 bg-blue-600 relative rounded-sm overflow-hidden">
            <div className="absolute inset-0 bg-red-600"></div>
            <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-600"></div>
            <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-2 bg-white rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <span className="text-sm font-medium">EN</span>
        </div>

        {/* Logo */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-2">
              <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                <div className="text-white text-sm font-bold">9</div>
              </div>
            </div>
            <span className="text-2xl font-bold tracking-wider">91CLUB</span>
          </div>
        </div>

        <div className="mt-6">
          <h1 className="text-2xl font-bold mb-2">Log in</h1>
          <p className="text-sm opacity-90 leading-relaxed">
            Please log in with your phone number or email<br />
            If you forget your password, please contact customer service
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 bg-gray-50 px-4 py-6">
        {/* Login Type Tabs */}
        <div className="flex bg-white rounded-lg p-1 mb-6 shadow-sm">
          <button
            onClick={() => setLoginType('phone')}
            className={`flex-1 flex items-center justify-center py-3 rounded-md transition-all duration-200 ${
              loginType === 'phone'
                ? 'bg-white text-red-500 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            <Phone className="w-5 h-5 mr-2" />
            <span className="font-medium">phone number</span>
          </button>
          <button
            onClick={() => setLoginType('email')}
            className={`flex-1 flex items-center justify-center py-3 rounded-md transition-all duration-200 ${
              loginType === 'email'
                ? 'bg-white text-red-500 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            <Mail className="w-5 h-5 mr-2" />
            <span className="font-medium">Email Login</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number Input */}
          {loginType === 'phone' && (
            <div>
              <div className="flex items-center mb-3">
                <Phone className="w-5 h-5 text-red-500 mr-2" />
                <span className="font-medium text-gray-700">Phone number</span>
              </div>
              <div className="flex space-x-3">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700"
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+86">+86</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="9234176732"
                  className="flex-1 px-4 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          {loginType === 'email' && (
            <div>
              <div className="flex items-center mb-3">
                <Mail className="w-5 h-5 text-red-500 mr-2" />
                <span className="font-medium text-gray-700">Mail</span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="please input your email"
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                required
              />
            </div>
          )}

          {/* Password Input */}
          <div>
            <div className="flex items-center mb-3">
              <Lock className="w-5 h-5 text-red-500 mr-2" />
              <span className="font-medium text-gray-700">Password</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={loginType === 'phone' ? 'AG746394' : 'Password'}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700 placeholder-gray-400 pr-12"
                required
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

          {/* Remember Password */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setRememberPassword(!rememberPassword)}
              className="flex items-center"
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
                rememberPassword 
                  ? 'bg-red-500 border-red-500' 
                  : 'border-gray-300'
              }`}>
                {rememberPassword && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-gray-600">Remember password</span>
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`w-full py-4 rounded-full text-white font-medium text-lg transition-all duration-200 ${
              loginType === 'phone'
                ? 'bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 shadow-lg'
                : 'bg-gray-300 text-gray-500'
            }`}
            disabled={loginType === 'email'}
          >
            Log in
          </button>

          {/* Register Button */}
          <button
            type="button"
            onClick={handleRegister}
            className="w-full py-4 bg-white border-2 border-red-400 text-red-400 rounded-full font-medium text-lg hover:bg-red-50 transition-colors"
          >
            Register
          </button>
        </form>

        {/* Bottom Actions */}
        <div className="flex justify-center space-x-16 mt-8">
          <button
            onClick={handleForgotPassword}
            className="flex flex-col items-center text-gray-600 hover:text-red-500 transition-colors"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-2">
              <Lock className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-sm">Forgot password</span>
          </button>
          
          <button
            onClick={handleCustomerService}
            className="flex flex-col items-center text-gray-600 hover:text-red-500 transition-colors"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md mb-2">
              <HelpCircle className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-sm">Customer Service</span>
          </button>
        </div>
      </div>
    </div>
  );
};