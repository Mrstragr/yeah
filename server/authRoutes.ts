import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { storage } from './storage';
import { 
  InsertUser, 
  InsertKycPersonalDetails, 
  InsertKycDocumentVerification 
} from '@shared/schema';
import { otpService } from './otpService';

const router = express.Router();

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'gaming-platform-secret-jwt-key';

// Generate JWT token
const generateToken = (user: any) => {
  return jwt.sign(
    { 
      id: user.id, 
      phone: user.phone, 
      email: user.email,
      isVerified: user.kycStatus === 'verified'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Middleware to verify JWT token
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByPhone(phone);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    // Check if email already exists
    const existingEmail = await storage.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate referral code
    const referralCode = 'RF' + Math.random().toString(36).substr(2, 8).toUpperCase();

    // Create user data
    const userData: InsertUser = {
      username: fullName.toLowerCase().replace(/\s+/g, ''),
      email,
      phone,
      password: hashedPassword,
      firstName: fullName.split(' ')[0],
      lastName: fullName.split(' ').slice(1).join(' ') || '',
      referralCode,
      kycStatus: 'pending'
    };

    const newUser = await storage.createUser(userData);
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        fullName: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        phone: newUser.phone,
        isVerified: newUser.kycStatus === 'verified',
        kycStatus: newUser.kycStatus
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone and password are required'
      });
    }

    // Demo login for testing - matches existing app samples
    if (phone === '9876543210' && password === 'demo123') {
      const token = generateToken({ 
        id: 1, 
        phone: '9876543210', 
        email: 'demo@perfect91club.com',
        kycStatus: 'verified'
      });
      
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: 1,
          fullName: 'Demo Player',
          email: 'demo@perfect91club.com',
          phone: '9876543210',
          isVerified: true,
          kycStatus: 'verified',
          walletBalance: '10000.00'
        }
      });
    }

    // Find user by phone
    const user = await storage.getUserByPhone(phone);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Update last login
    await storage.updateUserLastLogin(user.id);

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email,
        phone: user.phone,
        isVerified: user.kycStatus === 'verified',
        kycStatus: user.kycStatus,
        walletBalance: user.walletBalance
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user profile (protected)
router.get('/profile', authenticateToken, async (req: any, res) => {
  try {
    const user = await storage.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email,
        phone: user.phone,
        isVerified: user.kycStatus === 'verified',
        kycStatus: user.kycStatus,
        walletBalance: user.walletBalance,
        vipLevel: user.vipLevel,
        referralCode: user.referralCode
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

// Submit personal details for KYC
router.post('/kyc/personal-details', authenticateToken, async (req: any, res) => {
  try {
    const personalDetails: InsertKycPersonalDetails = {
      userId: req.user.id,
      ...req.body
    };

    await storage.saveKycPersonalDetails(personalDetails);
    
    res.json({
      success: true,
      message: 'Personal details saved successfully'
    });

  } catch (error) {
    console.error('KYC personal details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save personal details'
    });
  }
});

// Verify Aadhar
router.post('/kyc/aadhar-verify', authenticateToken, async (req: any, res) => {
  try {
    const { aadharNumber } = req.body;

    if (!aadharNumber) {
      return res.status(400).json({
        success: false,
        message: 'Aadhar number is required'
      });
    }

    // Demo verification - in production, integrate with UIDAI API
    const isValidDemo = aadharNumber === '123456789012';
    
    const verificationData: InsertKycDocumentVerification = {
      userId: req.user.id,
      documentType: 'aadhar',
      documentNumber: aadharNumber,
      status: isValidDemo ? 'verified' : 'pending'
    };

    await storage.saveKycDocumentVerification(verificationData);

    res.json({
      success: true,
      message: isValidDemo ? 'Aadhar verified successfully' : 'Aadhar verification initiated',
      status: isValidDemo ? 'verified' : 'pending'
    });

  } catch (error) {
    console.error('Aadhar verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Aadhar verification failed'
    });
  }
});

// Verify PAN
router.post('/kyc/pan-verify', authenticateToken, async (req: any, res) => {
  try {
    const { panNumber, panName, dateOfBirth } = req.body;

    if (!panNumber || !panName || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'PAN number, name, and date of birth are required'
      });
    }

    // Demo verification - in production, integrate with Income Tax Department API
    const isValidDemo = panNumber === 'ABCDE1234F';
    
    const verificationData: InsertKycDocumentVerification = {
      userId: req.user.id,
      documentType: 'pan',
      documentNumber: panNumber,
      documentName: panName,
      documentDob: dateOfBirth,
      status: isValidDemo ? 'verified' : 'pending'
    };

    await storage.saveKycDocumentVerification(verificationData);

    res.json({
      success: true,
      message: isValidDemo ? 'PAN verified successfully' : 'PAN verification initiated',
      status: isValidDemo ? 'verified' : 'pending'
    });

  } catch (error) {
    console.error('PAN verification error:', error);
    res.status(500).json({
      success: false,
      message: 'PAN verification failed'
    });
  }
});

// Verify Bank Account
router.post('/kyc/bank-verify', authenticateToken, async (req: any, res) => {
  try {
    const { accountNumber, ifscCode, accountHolderName, accountType } = req.body;

    if (!accountNumber || !ifscCode || !accountHolderName || !accountType) {
      return res.status(400).json({
        success: false,
        message: 'All bank details are required'
      });
    }

    // Demo verification - in production, implement penny drop verification
    const isValidDemo = accountNumber.length >= 9;
    
    const verificationData: InsertKycDocumentVerification = {
      userId: req.user.id,
      documentType: 'bank',
      bankAccount: accountNumber,
      ifscCode,
      accountHolderName,
      accountType,
      status: isValidDemo ? 'verified' : 'pending'
    };

    await storage.saveKycDocumentVerification(verificationData);

    res.json({
      success: true,
      message: isValidDemo ? 'Bank account verified successfully' : 'Bank verification initiated',
      status: isValidDemo ? 'verified' : 'pending'
    });

  } catch (error) {
    console.error('Bank verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Bank verification failed'
    });
  }
});

// Get KYC status
router.get('/kyc/status', authenticateToken, async (req: any, res) => {
  try {
    const personalDetails = await storage.getKycPersonalDetails(req.user.id);
    const documents = await storage.getKycDocuments(req.user.id);

    const status = {
      personal: personalDetails ? 'completed' : 'pending',
      aadhar: 'pending',
      pan: 'pending',
      bank: 'pending',
      document: 'pending'
    };

    documents.forEach(doc => {
      if (doc.documentType === 'aadhar') {
        status.aadhar = doc.status;
      } else if (doc.documentType === 'pan') {
        status.pan = doc.status;
      } else if (doc.documentType === 'bank') {
        status.bank = doc.status;
      } else if (doc.documentType === 'identity') {
        status.document = doc.status;
      }
    });

    res.json({
      success: true,
      status,
      personalDetails,
      documents
    });

  } catch (error) {
    console.error('KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get KYC status'
    });
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phone, purpose, tempUserData } = req.body;

    if (!phone || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and purpose are required'
      });
    }

    // Validate purpose
    if (!['signup', 'login', 'forgot-password'].includes(purpose)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid purpose'
      });
    }

    // For forgot-password, check if user exists
    if (purpose === 'forgot-password') {
      const existingUser = await storage.getUserByPhone(phone);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User with this phone number does not exist'
        });
      }
    }

    const result = await otpService.sendOTP(phone, purpose, tempUserData);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, purpose, tempUserData } = req.body;

    if (!phone || !otp || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, OTP, and purpose are required'
      });
    }

    const result = otpService.verifyOTP(phone, otp, purpose);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Handle different purposes
    switch (purpose) {
      case 'signup':
        // Complete user registration
        if (!tempUserData) {
          return res.status(400).json({
            success: false,
            message: 'User data not found'
          });
        }

        // Create user
        const hashedPassword = await bcrypt.hash(tempUserData.password, 10);
        const referralCode = 'RF' + Math.random().toString(36).substr(2, 8).toUpperCase();

        const userData: InsertUser = {
          username: tempUserData.fullName.toLowerCase().replace(/\s+/g, ''),
          email: tempUserData.email,
          phone: tempUserData.phone,
          password: hashedPassword,
          firstName: tempUserData.fullName.split(' ')[0],
          lastName: tempUserData.fullName.split(' ').slice(1).join(' ') || '',
          referralCode,
          kycStatus: 'pending'
        };

        const newUser = await storage.createUser(userData);
        const token = generateToken(newUser);

        res.status(201).json({
          success: true,
          message: 'Registration successful',
          token,
          user: {
            id: newUser.id,
            fullName: tempUserData.fullName,
            email: newUser.email,
            phone: newUser.phone,
            isVerified: false,
            kycStatus: 'pending',
            walletBalance: newUser.walletBalance
          }
        });
        break;

      case 'login':
        // Login user
        const user = await storage.getUserByPhone(phone);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        await storage.updateUserLastLogin(user.id);
        const loginToken = generateToken(user);

        res.json({
          success: true,
          message: 'Login successful',
          token: loginToken,
          user: {
            id: user.id,
            fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.email,
            phone: user.phone,
            isVerified: user.kycStatus === 'verified',
            kycStatus: user.kycStatus,
            walletBalance: user.walletBalance
          }
        });
        break;

      case 'forgot-password':
        // Return reset token
        res.json({
          success: true,
          message: 'OTP verified successfully',
          resetToken: result.data?.resetToken
        });
        break;

      default:
        res.status(400).json({
          success: false,
          message: 'Invalid purpose'
        });
    }

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { phone, newPassword, resetToken } = req.body;

    if (!phone || !newPassword || !resetToken) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, new password, and reset token are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Verify reset token
    const isValidToken = otpService.verifyResetToken(phone, resetToken);
    if (!isValidToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await storage.updateUserPassword(phone, hashedPassword);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

export { router as authRoutes };