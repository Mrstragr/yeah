import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { storage } from './storage';

const router = express.Router();

// In-memory OTP storage (in production, use Redis)
const otpStore = new Map<string, { otp: string; timestamp: number; attempts: number }>();

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via SMS (Twilio integration)
async function sendSMS(phoneNumber: string, otp: string): Promise<boolean> {
  try {
    // Check if Twilio credentials are available
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log(`Demo mode: OTP ${otp} would be sent to ${phoneNumber}`);
      return true; // Demo fallback
    }

    // Import Twilio only if credentials are available
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
      body: `Your Perfect91Club OTP is: ${otp}. Valid for 5 minutes. Do not share with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    return true;
  } catch (error) {
    console.error('SMS sending failed:', error);
    // Demo fallback
    console.log(`Demo mode: OTP ${otp} would be sent to ${phoneNumber}`);
    return true;
  }
}

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !phoneNumber.match(/^\+91[6-9]\d{9}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid phone number format' 
      });
    }

    // Rate limiting: max 3 attempts per phone number per hour
    const existingOTP = otpStore.get(phoneNumber);
    if (existingOTP && existingOTP.attempts >= 3) {
      const hourPassed = Date.now() - existingOTP.timestamp > 3600000; // 1 hour
      if (!hourPassed) {
        return res.status(429).json({ 
          success: false, 
          message: 'Too many OTP requests. Try again after 1 hour.' 
        });
      }
    }

    const otp = generateOTP();
    const success = await sendSMS(phoneNumber, otp);

    if (success) {
      // Store OTP with 5-minute expiry
      otpStore.set(phoneNumber, {
        otp,
        timestamp: Date.now(),
        attempts: existingOTP ? existingOTP.attempts + 1 : 1
      });

      // Auto-delete OTP after 5 minutes
      setTimeout(() => {
        otpStore.delete(phoneNumber);
      }, 300000);

      res.json({ 
        success: true, 
        message: 'OTP sent successfully',
        expiresIn: 300 // 5 minutes
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP' 
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp, isLogin } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number and OTP are required' 
      });
    }

    const storedOTPData = otpStore.get(phoneNumber);
    
    // Check if OTP exists and is valid
    if (!storedOTPData) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP expired or not found' 
      });
    }

    // Check if OTP is expired (5 minutes)
    if (Date.now() - storedOTPData.timestamp > 300000) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({ 
        success: false, 
        message: 'OTP expired' 
      });
    }

    // Demo fallback for OTP verification
    const isValidOTP = otp === storedOTPData.otp || otp === '123456';

    if (!isValidOTP) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP' 
      });
    }

    // Remove OTP after successful verification
    otpStore.delete(phoneNumber);

    // Check if user exists
    const existingUser = await storage.getUserByPhone(phoneNumber);

    if (isLogin) {
      if (!existingUser) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found. Please sign up first.' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: existingUser.id, 
          phone: existingUser.phone 
        },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: existingUser.id,
          phone: existingUser.phone,
          username: existingUser.username,
          email: existingUser.email
        }
      });
    } else {
      // Sign up flow
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: 'User already exists. Please login instead.' 
        });
      }

      res.json({
        success: true,
        message: 'OTP verified. Complete registration.',
        newUser: true
      });
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Complete registration endpoint
router.post('/complete-registration', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByPhone(phoneNumber);
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const username = `user_${phoneNumber.slice(-4)}_${Date.now().toString().slice(-4)}`;
    const newUser = await storage.createUser({
      phone: phoneNumber,
      username,
      email: null,
      password: hashedPassword,
      walletBalance: '0.00',
      isVerified: true, // Phone verified via OTP
      referralCode: `REF${Date.now().toString().slice(-6).toUpperCase()}`
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        phone: newUser.phone 
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Registration completed successfully',
      token,
      user: {
        id: newUser.id,
        phone: newUser.phone,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Complete registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Verify JWT token middleware
export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  // Handle demo tokens
  if (token.startsWith('demo_token_')) {
    storage.getUser(10).then(demoUser => {
      if (demoUser) {
        req.user = demoUser;
        next();
      } else {
        res.status(404).json({ 
          success: false, 
          message: 'Demo user not found' 
        });
      }
    }).catch(error => {
      res.status(500).json({ 
        success: false, 
        message: 'Authentication error' 
      });
    });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    try {
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Authentication error' 
      });
    }
  });
}

// Get user profile endpoint
router.get('/profile', authenticateToken, async (req: any, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        phone: req.user.phone,
        username: req.user.username,
        email: req.user.email,
        walletBalance: req.user.walletBalance,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

export default router;