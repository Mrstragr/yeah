import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, RefreshCw } from 'lucide-react';

interface OTPVerificationProps {
  phoneNumber: string;
  purpose: 'signup' | 'login' | 'forgot-password';
  onVerificationSuccess: (data: any) => void;
  onVerificationError: (error: string) => void;
  onBack: () => void;
  tempUserData?: any; // For signup flow
}

export default function OTPVerification({
  phoneNumber,
  purpose,
  onVerificationSuccess,
  onVerificationError,
  onBack,
  tempUserData
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      onVerificationError('Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: otpCode,
          purpose,
          tempUserData // Include temp user data for signup
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onVerificationSuccess(data);
      } else {
        onVerificationError(data.message || 'Invalid OTP. Please try again.');
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      onVerificationError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          purpose
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCountdown(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      } else {
        onVerificationError(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      onVerificationError('Connection error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const getPurposeText = () => {
    switch (purpose) {
      case 'signup': return 'Complete Registration';
      case 'login': return 'Secure Login';
      case 'forgot-password': return 'Reset Password';
      default: return 'Verify Phone';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-orange-500 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{getPurposeText()}</h1>
          </div>
        </div>

        {/* OTP Icon and Info */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📱</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Enter Verification Code</h2>
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit code to
          </p>
          <p className="text-red-600 font-semibold text-lg">
            +91 {phoneNumber}
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none transition-colors"
              maxLength={1}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerifyOTP}
          disabled={loading || otp.join('').length !== 6}
          className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors mb-4"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>

        {/* Resend Section */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-3">
            Didn't receive the code?
          </p>
          
          {canResend ? (
            <button
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="flex items-center justify-center mx-auto text-red-600 font-semibold hover:text-red-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${resendLoading ? 'animate-spin' : ''}`} />
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
          ) : (
            <div className="flex items-center justify-center text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>Resend in {countdown}s</span>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> In demo mode, use OTP: <span className="font-mono font-bold">123456</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}