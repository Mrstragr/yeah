import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Enhanced Security Middleware
export class SecurityService {
  
  // Rate limiting for different endpoints
  static createRateLimits() {
    return {
      // General API rate limit
      general: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
      }),

      // Authentication rate limit
      auth: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // Limit each IP to 5 login attempts per windowMs
        message: 'Too many login attempts, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
      }),

      // Payment rate limit
      payment: rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 3, // Limit each IP to 3 payment requests per minute
        message: 'Too many payment requests, please wait before trying again.',
        standardHeaders: true,
        legacyHeaders: false,
      }),

      // Game betting rate limit
      betting: rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 30, // Limit each IP to 30 bets per minute
        message: 'Betting too fast, please slow down.',
        standardHeaders: true,
        legacyHeaders: false,
      }),

      // KYC submission rate limit
      kyc: rateLimit({
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
        max: 3, // Limit each IP to 3 KYC submissions per day
        message: 'Too many KYC submissions, please try again tomorrow.',
        standardHeaders: true,
        legacyHeaders: false,
      })
    };
  }

  // Enhanced helmet configuration for gaming platform
  static getHelmetConfig() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          connectSrc: ["'self'", "https://api.razorpay.com", "wss:", "ws:"],
          frameSrc: ["'self'", "https://api.razorpay.com"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    });
  }

  // Input validation and sanitization
  static validateInput(req: Request, res: Response, next: NextFunction) {
    // Sanitize string inputs
    const sanitizeString = (str: string) => {
      return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/[<>]/g, '')
                .trim();
    };

    // Recursively sanitize object
    const sanitizeObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return sanitizeString(obj);
      }
      if (typeof obj === 'object' && obj !== null) {
        const sanitized: any = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          sanitized[key] = sanitizeObject(obj[key]);
        }
        return sanitized;
      }
      return obj;
    };

    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    next();
  }

  // Advanced fraud detection
  static async detectFraud(req: Request, res: Response, next: NextFunction) {
    const suspiciousPatterns = {
      // Multiple rapid transactions
      rapidTransactions: async (userId: number) => {
        // Implementation for detecting rapid transactions
        return false;
      },

      // Unusual betting patterns
      unusualBetting: async (userId: number) => {
        // Implementation for detecting unusual betting patterns
        return false;
      },

      // Multiple account creation from same IP
      multipleAccounts: async (ip: string) => {
        // Implementation for detecting multiple accounts
        return false;
      }
    };

    // Store request metadata for fraud analysis
    req.fraudMetadata = {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date(),
      endpoint: req.path
    };

    next();
  }

  // Age verification middleware
  static async verifyAge(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user has completed age verification
      if (user.kycStatus !== 'verified') {
        return res.status(403).json({ 
          error: 'Age verification required',
          requiresKyc: true 
        });
      }

      next();
    } catch (error) {
      console.error('Age verification error:', error);
      res.status(500).json({ error: 'Verification service unavailable' });
    }
  }

  // Transaction monitoring
  static async monitorTransaction(
    userId: number, 
    amount: number, 
    type: 'deposit' | 'withdrawal' | 'bet',
    metadata: any = {}
  ) {
    const alerts = [];

    // Large transaction alert
    if (amount > 50000) {
      alerts.push({
        type: 'LARGE_TRANSACTION',
        userId,
        amount,
        transactionType: type,
        metadata
      });
    }

    // Daily limit check
    const dailyLimit = type === 'deposit' ? 200000 : 100000;
    // Implementation for daily limit check

    // Velocity check
    // Implementation for transaction velocity check

    // Log alerts for manual review
    if (alerts.length > 0) {
      console.log('🚨 TRANSACTION ALERTS:', alerts);
      // In production, send to monitoring system
    }

    return alerts;
  }

  // Session security
  static enhanceSessionSecurity() {
    return {
      // Session timeout based on activity
      checkSessionTimeout: (req: Request, res: Response, next: NextFunction) => {
        const session = req.session as any;
        const maxInactivity = 30 * 60 * 1000; // 30 minutes

        if (session.lastActivity && 
            Date.now() - session.lastActivity > maxInactivity) {
          session.destroy((err: any) => {
            if (err) console.error('Session destroy error:', err);
          });
          return res.status(401).json({ error: 'Session expired' });
        }

        session.lastActivity = Date.now();
        next();
      },

      // Device fingerprinting
      deviceFingerprint: (req: Request, res: Response, next: NextFunction) => {
        const fingerprint = crypto.createHash('sha256')
          .update(req.get('User-Agent') || '')
          .update(req.get('Accept-Language') || '')
          .update(req.ip || '')
          .digest('hex');

        (req as any).deviceFingerprint = fingerprint;
        next();
      }
    };
  }
}

// Compliance monitoring
export class ComplianceService {
  
  // Log all gaming activities for regulatory compliance
  static async logGamingActivity(
    userId: number,
    gameType: string,
    betAmount: number,
    result: any,
    metadata: any = {}
  ) {
    const logEntry = {
      userId,
      gameType,
      betAmount,
      result,
      timestamp: new Date(),
      metadata,
      compliance: {
        logged: true,
        auditTrail: true
      }
    };

    // In production, store in dedicated compliance database
    console.log('📋 COMPLIANCE LOG:', logEntry);
    
    return logEntry;
  }

  // Generate regulatory reports
  static async generateComplianceReport(
    startDate: Date,
    endDate: Date,
    type: 'daily' | 'weekly' | 'monthly'
  ) {
    // Implementation for generating compliance reports
    return {
      period: { startDate, endDate, type },
      totalUsers: 0,
      totalTransactions: 0,
      totalBets: 0,
      kycVerified: 0,
      suspiciousActivities: []
    };
  }

  // Anti-money laundering checks
  static async amlCheck(userId: number, amount: number, type: string) {
    const amlFlags = [];

    // Large cash transaction
    if (amount > 100000) {
      amlFlags.push('LARGE_TRANSACTION');
    }

    // Rapid deposits and withdrawals
    // Implementation for detecting rapid transactions

    // Multiple small transactions (structuring)
    // Implementation for detecting structuring

    if (amlFlags.length > 0) {
      console.log('🚨 AML ALERT:', { userId, amount, type, flags: amlFlags });
      // In production, escalate to compliance team
    }

    return amlFlags;
  }
}

// Export configured middleware
export const securityMiddleware = {
  rateLimits: SecurityService.createRateLimits(),
  helmet: SecurityService.getHelmetConfig(),
  validateInput: SecurityService.validateInput,
  detectFraud: SecurityService.detectFraud,
  verifyAge: SecurityService.verifyAge,
  ...SecurityService.enhanceSessionSecurity()
};