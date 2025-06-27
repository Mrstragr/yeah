import { useState, useRef, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AdvancedLoginSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

type AuthStep = 'login' | 'register' | 'verify-mobile' | 'verify-email' | 'forgot-password';

export const AdvancedLoginSystem = ({ isOpen, onClose, onLoginSuccess }: AdvancedLoginSystemProps) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    referralCode: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate CAPTCHA
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(captcha);
    
    // Draw CAPTCHA on canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 150, 50);
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(0, 0, 150, 50);
        
        // Add noise lines
        for (let i = 0; i < 5; i++) {
          ctx.strokeStyle = `hsl(${Math.random() * 360}, 50%, 70%)`;
          ctx.beginPath();
          ctx.moveTo(Math.random() * 150, Math.random() * 50);
          ctx.lineTo(Math.random() * 150, Math.random() * 50);
          ctx.stroke();
        }
        
        // Draw CAPTCHA text
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#1e40af';
        ctx.textAlign = 'center';
        ctx.fillText(captcha, 75, 30);
        
        // Add noise dots
        for (let i = 0; i < 50; i++) {
          ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
          ctx.fillRect(Math.random() * 150, Math.random() * 50, 2, 2);
        }
      }
    }
  };

  // Start OTP timer
  const startOtpTimer = () => {
    setOtpTimer(60);
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (captchaInput.toLowerCase() !== captchaCode.toLowerCase()) {
      toast({
        title: "Invalid CAPTCHA",
        description: "Please enter the correct CAPTCHA code",
        variant: "destructive"
      });
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    setIsLoading(true);
    
    try {
      switch (currentStep) {
        case 'login':
          await handleLogin();
          break;
        case 'register':
          await handleRegister();
          break;
        case 'verify-mobile':
          await handleMobileVerification();
          break;
        case 'verify-email':
          await handleEmailVerification();
          break;
        case 'forgot-password':
          await handleForgotPassword();
          break;
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    const response = await apiRequest('POST', '/api/auth/login', {
      phone: formData.phone,
      password: formData.password
    });

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      onLoginSuccess(data.token);
      toast({
        title: "Login Successful",
        description: "Welcome back to Perfect91Club!"
      });
      onClose();
    }
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to terms and conditions",
        variant: "destructive"
      });
      return;
    }

    await apiRequest('POST', '/api/auth/send-otp', {
      phone: formData.phone,
      email: formData.email
    });

    setCurrentStep('verify-mobile');
    startOtpTimer();
    toast({
      title: "OTP Sent",
      description: "Verification code sent to your mobile"
    });
  };

  const handleMobileVerification = async () => {
    await apiRequest('POST', '/api/auth/verify-mobile', {
      phone: formData.phone,
      otp: formData.otp
    });

    setCurrentStep('verify-email');
    toast({
      title: "Mobile Verified",
      description: "Now verify your email address"
    });
  };

  const handleEmailVerification = async () => {
    const response = await apiRequest('POST', '/api/auth/register', {
      username: formData.username,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
      referralCode: formData.referralCode,
      emailOtp: formData.otp
    });

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      onLoginSuccess(data.token);
      toast({
        title: "Registration Successful",
        description: "Welcome to Perfect91Club!"
      });
      onClose();
    }
  };

  const handleForgotPassword = async () => {
    await apiRequest('POST', '/api/auth/forgot-password', {
      phone: formData.phone
    });

    toast({
      title: "Reset Link Sent",
      description: "Password reset instructions sent to your phone"
    });
    setCurrentStep('login');
  };

  // Initialize CAPTCHA on mount
  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
    }
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Perfect91Club</h2>
              <p className="text-blue-100 text-sm">
                {currentStep === 'login' && 'Welcome Back'}
                {currentStep === 'register' && 'Join the Club'}
                {currentStep === 'verify-mobile' && 'Verify Mobile'}
                {currentStep === 'verify-email' && 'Verify Email'}
                {currentStep === 'forgot-password' && 'Reset Password'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Login Form */}
          {currentStep === 'login' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </>
          )}

          {/* Registration Form */}
          {currentStep === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Create a strong password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter referral code"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mr-2"
                  required
                />
                <label className="text-sm text-gray-600">
                  I agree to <span className="text-blue-600 underline">Terms & Conditions</span> and <span className="text-blue-600 underline">Privacy Policy</span>
                </label>
              </div>
            </>
          )}

          {/* OTP Verification */}
          {(currentStep === 'verify-mobile' || currentStep === 'verify-email') && (
            <>
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  Enter the 6-digit verification code sent to your{' '}
                  {currentStep === 'verify-mobile' ? 'mobile number' : 'email address'}
                </p>
                <p className="font-medium text-blue-600">
                  {currentStep === 'verify-mobile' ? formData.phone : formData.email}
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              {otpTimer > 0 ? (
                <p className="text-center text-gray-600">
                  Resend code in {otpTimer}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    // Resend OTP logic
                    startOtpTimer();
                    toast({
                      title: "OTP Resent",
                      description: "New verification code sent"
                    });
                  }}
                  className="w-full text-blue-600 hover:text-blue-800 text-sm"
                >
                  Resend Verification Code
                </button>
              )}
            </>
          )}

          {/* Forgot Password */}
          {currentStep === 'forgot-password' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 9876543210"
                required
              />
            </div>
          )}

          {/* CAPTCHA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <div className="flex items-center space-x-2">
              <canvas
                ref={canvasRef}
                width={150}
                height={50}
                className="border border-gray-300 rounded cursor-pointer"
                onClick={generateCaptcha}
              />
              <button
                type="button"
                onClick={generateCaptcha}
                className="text-blue-600 hover:text-blue-800 text-xs"
              >
                🔄
              </button>
            </div>
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              placeholder="Enter the code above"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {isLoading ? 'Processing...' : (
              currentStep === 'login' ? 'Login' :
              currentStep === 'register' ? 'Register' :
              currentStep === 'verify-mobile' ? 'Verify Mobile' :
              currentStep === 'verify-email' ? 'Verify Email' :
              'Reset Password'
            )}
          </button>

          {/* Footer Links */}
          <div className="text-center space-y-2 pt-4 border-t">
            {currentStep === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentStep('register')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Don't have an account? Sign up
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setCurrentStep('forgot-password')}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Forgot Password?
                </button>
              </>
            )}
            
            {(currentStep === 'register' || currentStep === 'verify-mobile' || currentStep === 'verify-email') && (
              <button
                type="button"
                onClick={() => setCurrentStep('login')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Already have an account? Login
              </button>
            )}

            {currentStep === 'forgot-password' && (
              <button
                type="button"
                onClick={() => setCurrentStep('login')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Back to Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};