import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import express, { Express } from 'express';

// Rate limiting configurations
export const createRateLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// Security middleware setup
export const setupSecurity = (app: Express) => {
  // CORS configuration
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-domain.com'] // Replace with your actual domain
      : ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true,
    optionsSuccessStatus: 200
  }));

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
        connectSrc: ["'self'", "https://api.razorpay.com"],
        frameSrc: ["'self'", "https://api.razorpay.com"]
      }
    },
    crossOriginEmbedderPolicy: false
  }));

  // Rate limiting
  app.use('/api/auth/login', createRateLimiter(15 * 60 * 1000, 5, 'Too many login attempts'));
  app.use('/api/auth/register', createRateLimiter(60 * 60 * 1000, 3, 'Too many registration attempts'));
  app.use('/api/wallet/', createRateLimiter(5 * 60 * 1000, 10, 'Too many wallet requests'));
  app.use('/api/games/', createRateLimiter(60 * 1000, 30, 'Too many game requests'));
  app.use('/api/', createRateLimiter(15 * 60 * 1000, 100, 'Too many API requests'));

  // Request size limit
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
};

// Input validation helpers
export const validateBetAmount = (amount: number): boolean => {
  return amount >= 1 && amount <= 100000 && Number.isInteger(amount);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};