import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  CheckCircle2,
  AlertCircle,
  Shield,
  Flag,
  MapPin,
  Calendar,
  Star,
  Crown,
  Trophy,
  Timer,
  Fingerprint,
  QrCode
} from 'lucide-react';

interface AuthSystemProps {
  onLoginSuccess: (userData: any) => void;
  onClose: () => void;
}

export function EnhancedAuthSystem({ onLoginSuccess, onClose }: AuthSystemProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'otp'>('login');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    state: '',
    referralCode: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [verification, setVerification] = useState({
    phone: false,
    email: false,
    captcha: false,
    biometric: false
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // OTP Timer Effect
  useEffect(() => {
    if (authMode === 'otp' && otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
  }, [authMode, otpTimer]);

  // Indian States for Registration
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir'
  ];

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { phone: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Login Successful',
        description: 'Welcome back to Perfect91Club!',
      });
      onLoginSuccess(data);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials',
        variant: 'destructive',
      });
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAuthMode('otp');
      setOtpTimer(60);
      setCanResendOtp(false);
      toast({
        title: 'Registration Successful',
        description: 'Please verify your phone number with the OTP sent',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    },
  });

  // OTP Verification Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async (otpData: { phone: string; otp: string }) => {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(otpData),
      });
      
      if (!response.ok) {
        throw new Error('OTP verification failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Phone Verified',
        description: 'Your account has been successfully verified!',
      });
      onLoginSuccess(data);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Verification Failed',
        description: error.message || 'Invalid OTP. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'login') {
      loginMutation.mutate({
        phone: formData.phone,
        password: formData.password
      });
    } else if (authMode === 'register') {
      if (step === 1) {
        // Validate step 1
        if (!formData.phone || !formData.email || !formData.password) {
          toast({
            title: 'Incomplete Information',
            description: 'Please fill all required fields',
            variant: 'destructive',
          });
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: 'Password Mismatch',
            description: 'Passwords do not match',
            variant: 'destructive',
          });
          return;
        }
        setStep(2);
      } else if (step === 2) {
        // Validate step 2 and register
        if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.state) {
          toast({
            title: 'Incomplete Information',
            description: 'Please fill all required fields',
            variant: 'destructive',
          });
          return;
        }
        if (!formData.agreeToTerms) {
          toast({
            title: 'Terms & Conditions',
            description: 'Please accept the terms and conditions',
            variant: 'destructive',
          });
          return;
        }
        registerMutation.mutate(formData);
      }
    } else if (authMode === 'otp') {
      if (!formData.otp || formData.otp.length !== 6) {
        toast({
          title: 'Invalid OTP',
          description: 'Please enter a valid 6-digit OTP',
          variant: 'destructive',
        });
        return;
      }
      verifyOtpMutation.mutate({
        phone: formData.phone,
        otp: formData.otp
      });
    }
  };

  const resendOtp = () => {
    // Resend OTP logic
    setOtpTimer(60);
    setCanResendOtp(false);
    toast({
      title: 'OTP Sent',
      description: 'A new OTP has been sent to your phone number',
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2
      }
    }
  };

  const slideVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      x: -50,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const renderLoginForm = () => (
    <motion.div
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="auth-form-container"
    >
      <div className="auth-header">
        <motion.div
          className="welcome-icon"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          👑
        </motion.div>
        <h2>Welcome Back</h2>
        <p>Sign in to continue your gaming journey</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Phone Number</label>
          <div className="input-group">
            <Smartphone className="input-icon" />
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <div className="auth-options">
          <label className="checkbox-group">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <button type="button" className="forgot-password">
            Forgot Password?
          </button>
        </div>

        <motion.button
          type="submit"
          className="auth-submit-btn"
          disabled={loginMutation.isPending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loginMutation.isPending ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              Signing In...
            </div>
          ) : (
            <>
              <Shield className="btn-icon" />
              Sign In Securely
            </>
          )}
        </motion.button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="social-login">
          <motion.button
            type="button"
            className="social-btn google"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
            Continue with Google
          </motion.button>
        </div>

        <p className="auth-switch">
          New to Perfect91Club?{' '}
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className="switch-mode"
          >
            Create Account
          </button>
        </p>
      </form>
    </motion.div>
  );

  const renderRegisterForm = () => (
    <motion.div
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="auth-form-container"
    >
      <div className="auth-header">
        <motion.div
          className="welcome-icon"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          🎮
        </motion.div>
        <h2>Join Perfect91Club</h2>
        <p>Create your account and start winning</p>
      </div>

      <div className="registration-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <span>Account Details</span>
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <span>Personal Info</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="form-group">
                <label>Phone Number <span className="required">*</span></label>
                <div className="input-group">
                  <Smartphone className="input-icon" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address <span className="required">*</span></label>
                <div className="input-group">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password <span className="required">*</span></label>
                <div className="input-group">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password <span className="required">*</span></label>
                <div className="input-group">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="form-row">
                <div className="form-group">
                  <label>First Name <span className="required">*</span></label>
                  <div className="input-group">
                    <User className="input-icon" />
                    <input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Last Name <span className="required">*</span></label>
                  <div className="input-group">
                    <User className="input-icon" />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Date of Birth <span className="required">*</span></label>
                <div className="input-group">
                  <Calendar className="input-icon" />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>State <span className="required">*</span></label>
                <div className="input-group">
                  <MapPin className="input-icon" />
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  >
                    <option value="">Select your state</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Referral Code (Optional)</label>
                <div className="input-group">
                  <Star className="input-icon" />
                  <input
                    type="text"
                    placeholder="Enter referral code"
                    value={formData.referralCode}
                    onChange={(e) => handleInputChange('referralCode', e.target.value)}
                  />
                </div>
              </div>

              <label className="checkbox-group terms">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  required
                />
                <span>
                  I agree to the{' '}
                  <button type="button" className="link">Terms & Conditions</button>
                  {' '}and{' '}
                  <button type="button" className="link">Privacy Policy</button>
                </span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="form-actions">
          {step === 2 && (
            <motion.button
              type="button"
              className="back-btn"
              onClick={() => setStep(1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back
            </motion.button>
          )}

          <motion.button
            type="submit"
            className="auth-submit-btn"
            disabled={registerMutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {registerMutation.isPending ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                {step === 1 ? 'Next...' : 'Creating Account...'}
              </div>
            ) : (
              <>
                {step === 1 ? 'Continue' : 'Create Account'}
              </>
            )}
          </motion.button>
        </div>

        <p className="auth-switch">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className="switch-mode"
          >
            Sign In
          </button>
        </p>
      </form>
    </motion.div>
  );

  const renderOtpVerification = () => (
    <motion.div
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="auth-form-container otp-container"
    >
      <div className="auth-header">
        <motion.div
          className="welcome-icon"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📱
        </motion.div>
        <h2>Verify Your Phone</h2>
        <p>Enter the 6-digit code sent to {formData.phone}</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="otp-input-container">
          <label>Verification Code</label>
          <div className="otp-input-group">
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="otp-input"
              required
            />
            <div className="otp-timer">
              {otpTimer > 0 ? (
                <span>Resend in {otpTimer}s</span>
              ) : (
                <button
                  type="button"
                  className="resend-btn"
                  onClick={resendOtp}
                  disabled={!canResendOtp}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          className="auth-submit-btn"
          disabled={verifyOtpMutation.isPending || formData.otp.length !== 6}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {verifyOtpMutation.isPending ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              Verifying...
            </div>
          ) : (
            <>
              <CheckCircle2 className="btn-icon" />
              Verify & Continue
            </>
          )}
        </motion.button>

        <p className="auth-switch">
          Wrong number?{' '}
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className="switch-mode"
          >
            Change Number
          </button>
        </p>
      </form>
    </motion.div>
  );

  return (
    <div className="enhanced-auth-overlay">
      <motion.div
        className="enhanced-auth-modal"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.button
          className="close-btn"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ×
        </motion.button>

        <div className="auth-content">
          <AnimatePresence mode="wait">
            {authMode === 'login' && renderLoginForm()}
            {authMode === 'register' && renderRegisterForm()}
            {authMode === 'otp' && renderOtpVerification()}
          </AnimatePresence>
        </div>

        <div className="auth-footer">
          <div className="security-badges">
            <div className="badge">
              <Shield className="badge-icon" />
              <span>SSL Secured</span>
            </div>
            <div className="badge">
              <Fingerprint className="badge-icon" />
              <span>Safe & Secure</span>
            </div>
            <div className="badge">
              <Flag className="badge-icon" />
              <span>Made in India</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}