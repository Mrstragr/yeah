import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { apiRequest } from '../lib/queryClient';

interface AuthenticationFlowProps {
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

interface User {
  id: number;
  phone: string;
  email: string;
  fullName: string;
  isVerified: boolean;
  kycStatus: string;
}

export default function AuthenticationFlow({ onClose, initialMode = 'login' }: AuthenticationFlowProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'kyc'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Form states
  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
    rememberMe: false
  });
  
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    ageConfirm: false
  });
  
  // KYC form states
  const [kycStep, setKycStep] = useState(1);
  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [verificationStatus, setVerificationStatus] = useState({
    personal: 'pending',
    document: 'pending',
    aadhar: 'pending',
    pan: 'pending',
    bank: 'pending'
  });
  
  const [documentUpload, setDocumentUpload] = useState({
    aadharNumber: '',
    panNumber: '',
    panName: '',
    panDob: '',
    bankAccount: '',
    confirmBankAccount: '',
    ifscCode: '',
    accountHolderName: '',
    accountType: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        phone: loginData.phone,
        password: loginData.password
      });
      
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('authToken', result.token);
        setUser(result.user);
        
        if (!result.user.isVerified) {
          setMode('kyc');
        } else {
          onClose();
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!signupData.agreeToTerms || !signupData.ageConfirm) {
      alert('Please accept all terms and confirm your age.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/auth/register', {
        fullName: signupData.fullName,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password
      });
      
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('authToken', result.token);
        setUser(result.user);
        setMode('kyc');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await apiRequest('POST', '/api/kyc/personal-details', personalDetails);
      setVerificationStatus(prev => ({ ...prev, personal: 'completed' }));
      setKycStep(2);
    } catch (error) {
      console.error('Personal details error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (type: string) => {
    setIsLoading(true);
    
    try {
      if (type === 'aadhar') {
        await apiRequest('POST', '/api/kyc/aadhar-verify', {
          aadharNumber: documentUpload.aadharNumber
        });
        setVerificationStatus(prev => ({ ...prev, aadhar: 'completed' }));
      } else if (type === 'pan') {
        await apiRequest('POST', '/api/kyc/pan-verify', {
          panNumber: documentUpload.panNumber,
          panName: documentUpload.panName,
          dateOfBirth: documentUpload.panDob
        });
        setVerificationStatus(prev => ({ ...prev, pan: 'completed' }));
      } else if (type === 'bank') {
        await apiRequest('POST', '/api/kyc/bank-verify', {
          accountNumber: documentUpload.bankAccount,
          ifscCode: documentUpload.ifscCode,
          accountHolderName: documentUpload.accountHolderName,
          accountType: documentUpload.accountType
        });
        setVerificationStatus(prev => ({ ...prev, bank: 'completed' }));
      }
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLogin = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
        <p className="text-gray-400">Sign in to continue your gaming journey</p>
      </div>

      <div className="space-y-4 mb-6">
        <button className="w-full bg-white text-black py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
          <span>🔗</span> Continue with Google
        </button>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
          <span>📘</span> Continue with Facebook
        </button>
      </div>

      <div className="text-center text-gray-400 mb-4">or continue with email</div>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="tel"
          placeholder="Phone Number"
          value={loginData.phone}
          onChange={(e) => setLoginData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          required
        />
        
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={loginData.rememberMe}
              onChange={(e) => setLoginData(prev => ({ ...prev, rememberMe: e.target.checked }))}
              className="rounded"
            />
            Remember me
          </label>
          <button type="button" className="text-sm text-blue-400 hover:text-blue-300">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="text-center mt-6">
        <span className="text-gray-400">Don't have an account? </span>
        <button
          onClick={() => setMode('signup')}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          Sign up
        </button>
      </div>
    </motion.div>
  );

  const renderSignup = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Join the Game!</h2>
        <p className="text-gray-400">Create your account and start winning</p>
      </div>

      <div className="space-y-4 mb-6">
        <button className="w-full bg-white text-black py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
          <span>🔗</span> Continue with Google
        </button>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
          <span>📘</span> Continue with Facebook
        </button>
      </div>

      <div className="text-center text-gray-400 mb-4">or continue with email</div>

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={signupData.fullName}
          onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          required
        />
        
        <input
          type="email"
          placeholder="Email Address"
          value={signupData.email}
          onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          required
        />
        
        <input
          type="tel"
          placeholder="Phone Number (10 digits)"
          value={signupData.phone}
          onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          required
        />
        
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={signupData.password}
            onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={signupData.confirmPassword}
            onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={signupData.ageConfirm}
              onChange={(e) => setSignupData(prev => ({ ...prev, ageConfirm: e.target.checked }))}
              className="mt-1 rounded"
              required
            />
            I confirm that I am 18 years or older
          </label>
          
          <label className="flex items-start gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={signupData.agreeToTerms}
              onChange={(e) => setSignupData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
              className="mt-1 rounded"
              required
            />
            I agree to the <span className="text-blue-400">Terms of Service</span> and <span className="text-blue-400">Privacy Policy</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center mt-6">
        <span className="text-gray-400">Already have an account? </span>
        <button
          onClick={() => setMode('login')}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          Sign in
        </button>
      </div>
    </motion.div>
  );

  const renderKYCVerification = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl"
    >
      <div className="bg-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Account Verification</h2>
            <p className="text-gray-400">Complete your profile</p>
          </div>
          <div className="ml-auto bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">
            In Progress
          </div>
        </div>

        {/* User Profile Section */}
        <div className="bg-blue-900/20 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user?.fullName || 'User'}</h3>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Verification Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { key: 'personal', label: 'Personal Details', time: '~2-3 minutes' },
            { key: 'document', label: 'Document Upload', time: '~3-5 minutes' },
            { key: 'aadhar', label: 'Aadhar Verification', time: '~2-3 minutes' },
            { key: 'pan', label: 'PAN Verification', time: '~2 minutes' },
            { key: 'bank', label: 'Bank Account Verification', time: '~3-5 minutes' }
          ].map((item) => (
            <div key={item.key} className="bg-gray-700 rounded-xl p-4 text-center">
              <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                verificationStatus[item.key as keyof typeof verificationStatus] === 'completed' 
                  ? 'bg-green-500' 
                  : verificationStatus[item.key as keyof typeof verificationStatus] === 'pending'
                  ? 'bg-blue-500'
                  : 'bg-gray-500'
              }`}>
                {verificationStatus[item.key as keyof typeof verificationStatus] === 'completed' ? (
                  <CheckCircle size={16} className="text-white" />
                ) : (
                  <Clock size={16} className="text-white" />
                )}
              </div>
              <h4 className="text-white font-medium text-sm mb-1">{item.label}</h4>
              <p className="text-gray-400 text-xs">{item.time}</p>
              <div className="text-xs text-gray-400 capitalize mt-1">
                {verificationStatus[item.key as keyof typeof verificationStatus]}
              </div>
            </div>
          ))}
        </div>

        {/* KYC Steps */}
        {kycStep === 1 && (
          <div className="bg-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Personal Details</h3>
            <p className="text-gray-400 mb-6">Basic information and address</p>

            <form onSubmit={handlePersonalDetailsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={personalDetails.firstName}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={personalDetails.lastName}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={personalDetails.dateOfBirth}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
                <select
                  value={personalDetails.gender}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, gender: e.target.value }))}
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <textarea
                placeholder="Enter your complete address"
                value={personalDetails.address}
                onChange={(e) => setPersonalDetails(prev => ({ ...prev, address: e.target.value }))}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none h-24"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={personalDetails.city}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, city: e.target.value }))}
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
                <select
                  value={personalDetails.state}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, state: e.target.value }))}
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select State</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="delhi">Delhi</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="tamil-nadu">Tamil Nadu</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="rajasthan">Rajasthan</option>
                  <option value="uttar-pradesh">Uttar Pradesh</option>
                  <option value="west-bengal">West Bengal</option>
                </select>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={personalDetails.pincode}
                  onChange={(e) => setPersonalDetails(prev => ({ ...prev, pincode: e.target.value }))}
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Personal Details'}
              </button>
            </form>
          </div>
        )}

        {kycStep === 2 && (
          <div className="space-y-6">
            {/* Document Upload */}
            <div className="bg-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Document Upload</h3>
              <p className="text-gray-400 mb-6">Identity and address proof</p>

              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <h4 className="text-white font-medium mb-2">Upload Identity & Address Proof Documents</h4>
                <p className="text-gray-400 text-sm mb-4">Drag and drop your files here, or click to browse</p>
                <p className="text-gray-500 text-xs">Supported formats: JPG, PNG, PDF • Max size: 5MB</p>
                <button className="bg-gray-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-gray-500 transition-colors">
                  Choose Files
                </button>
              </div>
            </div>

            {/* Aadhar Verification */}
            <div className="bg-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Aadhar Verification</h3>
              <p className="text-gray-400 mb-6">OTP-based Aadhar verification</p>

              <div className="bg-blue-900/20 rounded-lg p-4 mb-4">
                <h4 className="text-white font-medium mb-2">Secure Aadhar Verification</h4>
                <p className="text-gray-400 text-sm">We use UIDAI's secure API to verify your Aadhar. Your information is encrypted and never stored on our servers.</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="1234 5678 9012"
                  value={documentUpload.aadharNumber}
                  onChange={(e) => setDocumentUpload(prev => ({ ...prev, aadharNumber: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                
                <button
                  onClick={() => handleDocumentUpload('aadhar')}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                <div className="bg-orange-900/20 rounded-lg p-4">
                  <p className="text-orange-300 text-sm font-medium">Demo Mode</p>
                  <p className="text-orange-200 text-xs">Use Aadhar: 1234 5678 9012 and OTP: 123456 for testing</p>
                </div>
              </div>
            </div>

            {/* PAN Verification */}
            <div className="bg-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">PAN Verification</h3>
              <p className="text-gray-400 mb-6">Income Tax Department verification</p>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  value={documentUpload.panNumber}
                  onChange={(e) => setDocumentUpload(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                
                <input
                  type="text"
                  placeholder="Full Name (as per PAN Card)"
                  value={documentUpload.panName}
                  onChange={(e) => setDocumentUpload(prev => ({ ...prev, panName: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={documentUpload.panDob}
                  onChange={(e) => setDocumentUpload(prev => ({ ...prev, panDob: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />

                <button
                  onClick={() => handleDocumentUpload('pan')}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify PAN'}
                </button>

                <div className="bg-orange-900/20 rounded-lg p-4">
                  <p className="text-orange-300 text-sm font-medium">Demo Mode</p>
                  <p className="text-orange-200 text-xs">Use PAN: ABCDE1234F with any valid name and DOB for testing</p>
                </div>
              </div>
            </div>

            {/* Bank Account Verification */}
            <div className="bg-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Bank Account Verification</h3>
              <p className="text-gray-400 mb-6">Penny drop verification</p>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Account Number"
                  value={documentUpload.bankAccount}
                  onChange={(e) => setDocumentUpload(prev => ({ ...prev, bankAccount: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                
                <input
                  type="text"
                  placeholder="Re-enter Account Number"
                  value={documentUpload.confirmBankAccount}
                  onChange={(e) => setDocumentUpload(prev => ({ ...prev, confirmBankAccount: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                
                <input
                  type="text"
                  placeholder="SBIN0001234"
                  value={documentUpload.ifscCode}
                  onChange={(e) => setDocumentUpload(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                
                <input
                  type="text"
                  placeholder="Account Holder Name"
                  value={documentUpload.accountHolderName}
                  onChange={(e) => setDocumentUpload(prev => ({ ...prev, accountHolderName: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                
                <select
                  value={documentUpload.accountType}
                  onChange={(e) => setDocumentUpload(prev => ({ ...prev, accountType: e.target.value }))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select Account Type</option>
                  <option value="savings">Savings Account</option>
                  <option value="current">Current Account</option>
                </select>

                <button
                  onClick={() => handleDocumentUpload('bank')}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Verify Bank Account'}
                </button>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-900/20 rounded-xl p-6">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="text-blue-400" />
                Important Information
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ All information is encrypted and securely stored</li>
                <li>✓ Verification typically takes 24-48 hours</li>
                <li>✓ You'll receive email updates on verification status</li>
                <li>✓ Contact support for any assistance needed</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="min-h-full flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
            <AnimatePresence mode="wait">
              {mode === 'login' && renderLogin()}
              {mode === 'signup' && renderSignup()}
              {mode === 'kyc' && renderKYCVerification()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}