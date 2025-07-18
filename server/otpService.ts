import { randomInt } from 'crypto';

// In-memory OTP storage (for demo - in production use Redis or database)
interface OTPData {
  otp: string;
  phone: string;
  purpose: 'signup' | 'login' | 'forgot-password';
  expiresAt: Date;
  attempts: number;
  tempUserData?: any;
}

const otpStorage = new Map<string, OTPData>();

// SMS Service Configuration (Demo mode)
const SMS_SERVICE_CONFIG = {
  enabled: process.env.SMS_SERVICE_ENABLED === 'true',
  provider: process.env.SMS_PROVIDER || 'demo', // 'twilio', 'textlocal', 'demo'
  apiKey: process.env.SMS_API_KEY,
  senderId: process.env.SMS_SENDER_ID || 'TASHANWIN'
};

class OTPService {
  // Generate 6-digit OTP
  generateOTP(): string {
    return randomInt(100000, 999999).toString();
  }

  // Generate unique key for OTP storage
  private getOTPKey(phone: string, purpose: string): string {
    return `${phone}-${purpose}`;
  }

  // Send OTP via SMS
  async sendOTP(phone: string, purpose: 'signup' | 'login' | 'forgot-password', tempUserData?: any): Promise<{ success: boolean; message: string }> {
    try {
      // Generate OTP
      const otp = this.generateOTP();
      const key = this.getOTPKey(phone, purpose);

      // Store OTP with 5-minute expiry
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      otpStorage.set(key, {
        otp,
        phone,
        purpose,
        expiresAt,
        attempts: 0,
        tempUserData
      });

      // Send SMS
      const smsResult = await this.sendSMS(phone, otp, purpose);
      
      if (smsResult.success) {
        console.log(`OTP sent to ${phone}: ${otp} (Demo mode)`);
        return {
          success: true,
          message: 'OTP sent successfully'
        };
      } else {
        return {
          success: false,
          message: 'Failed to send OTP'
        };
      }
    } catch (error) {
      console.error('OTP generation error:', error);
      return {
        success: false,
        message: 'Failed to generate OTP'
      };
    }
  }

  // Verify OTP
  verifyOTP(phone: string, otp: string, purpose: 'signup' | 'login' | 'forgot-password'): { success: boolean; message: string; data?: any } {
    const key = this.getOTPKey(phone, purpose);
    const otpData = otpStorage.get(key);

    if (!otpData) {
      return {
        success: false,
        message: 'OTP not found or expired'
      };
    }

    // Check expiry
    if (new Date() > otpData.expiresAt) {
      otpStorage.delete(key);
      return {
        success: false,
        message: 'OTP has expired'
      };
    }

    // Check attempts
    if (otpData.attempts >= 3) {
      otpStorage.delete(key);
      return {
        success: false,
        message: 'Too many invalid attempts'
      };
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      otpData.attempts++;
      return {
        success: false,
        message: 'Invalid OTP'
      };
    }

    // OTP verified successfully
    const tempUserData = otpData.tempUserData;
    otpStorage.delete(key); // Remove used OTP

    return {
      success: true,
      message: 'OTP verified successfully',
      data: {
        phone,
        purpose,
        tempUserData,
        resetToken: purpose === 'forgot-password' ? this.generateResetToken(phone) : undefined
      }
    };
  }

  // Generate reset token for password reset
  private generateResetToken(phone: string): string {
    const token = randomInt(100000000, 999999999).toString();
    // Store reset token with 15-minute expiry
    const resetKey = `reset-${phone}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    otpStorage.set(resetKey, {
      otp: token,
      phone,
      purpose: 'forgot-password',
      expiresAt,
      attempts: 0
    } as OTPData);
    return token;
  }

  // Verify reset token
  verifyResetToken(phone: string, token: string): boolean {
    const resetKey = `reset-${phone}`;
    const tokenData = otpStorage.get(resetKey);

    if (!tokenData || new Date() > tokenData.expiresAt || tokenData.otp !== token) {
      if (tokenData) otpStorage.delete(resetKey);
      return false;
    }

    otpStorage.delete(resetKey);
    return true;
  }

  // Send SMS using configured provider
  private async sendSMS(phone: string, otp: string, purpose: string): Promise<{ success: boolean; message: string }> {
    const message = this.getSMSTemplate(otp, purpose);

    if (!SMS_SERVICE_CONFIG.enabled || SMS_SERVICE_CONFIG.provider === 'demo') {
      // Demo mode - just log the OTP
      console.log(`[DEMO SMS] To: +91${phone}, Message: ${message}`);
      return { success: true, message: 'SMS sent (demo mode)' };
    }

    // In production, integrate with actual SMS provider
    switch (SMS_SERVICE_CONFIG.provider) {
      case 'twilio':
        return await this.sendViaTwilio(phone, message);
      case 'textlocal':
        return await this.sendViaTextLocal(phone, message);
      default:
        return { success: false, message: 'SMS provider not configured' };
    }
  }

  // Get SMS template based on purpose
  private getSMSTemplate(otp: string, purpose: string): string {
    switch (purpose) {
      case 'signup':
        return `Welcome to TashanWin! Your verification code is ${otp}. Valid for 5 minutes. Do not share this code.`;
      case 'login':
        return `Your TashanWin login verification code is ${otp}. Valid for 5 minutes. Do not share this code.`;
      case 'forgot-password':
        return `Your TashanWin password reset code is ${otp}. Valid for 5 minutes. Do not share this code.`;
      default:
        return `Your TashanWin verification code is ${otp}. Valid for 5 minutes.`;
    }
  }

  // Twilio SMS integration (placeholder)
  private async sendViaTwilio(phone: string, message: string): Promise<{ success: boolean; message: string }> {
    // Implement Twilio integration here
    // const client = twilio(accountSid, authToken);
    // const result = await client.messages.create({...});
    return { success: false, message: 'Twilio integration not implemented' };
  }

  // TextLocal SMS integration (placeholder)
  private async sendViaTextLocal(phone: string, message: string): Promise<{ success: boolean; message: string }> {
    // Implement TextLocal integration here
    return { success: false, message: 'TextLocal integration not implemented' };
  }

  // Clean expired OTPs (should be called periodically)
  cleanExpiredOTPs(): void {
    const now = new Date();
    for (const [key, otpData] of otpStorage.entries()) {
      if (now > otpData.expiresAt) {
        otpStorage.delete(key);
      }
    }
  }
}

export const otpService = new OTPService();

// Clean expired OTPs every 10 minutes
setInterval(() => {
  otpService.cleanExpiredOTPs();
}, 10 * 60 * 1000);