import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET =
  process.env.JWT_SECRET || "fallback_secret_key_change_in_production";
const JWT_EXPIRES_IN = "7d";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    phone: string;
  };
}

export class AuthService {
  // Generate JWT token
  generateToken(user: {
    id: number;
    username: string;
    email: string;
    phone: string;
  }): string {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );
  }

  // Verify JWT token
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  // Compare password
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Register user
  async register(userData: {
    username?: string;
    email?: string;
    phone: string;
    password: string;
    referralCode?: string;
  }): Promise<{ user: any; token: string }> {
    // Check if user already exists
    const existingUser = await storage.getUserByPhone(userData.phone);
    if (existingUser) {
      throw new Error("User already exists with this phone number");
    }

    if (userData.email) {
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        throw new Error("User already exists with this email");
      }
    }

    // Generate username if not provided
    const username = userData.username || `User${userData.phone.slice(-4)}`;

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Generate referral code
    const referralCode = this.generateReferralCode();

    // Create user
    const user = await storage.createUser({
      username,
      email: userData.email || "",
      phone: userData.phone,
      password: hashedPassword,
      referralCode,
      referredBy: userData.referralCode || null,
      balance: "0.00",
      walletBalance: "500.00", // Welcome bonus
      bonusBalance: "100.00",
    });

    // Generate token
    const token = this.generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    });

    // Update last login
    await storage.updateUserLastLogin(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        walletBalance: user.walletBalance,
        bonusBalance: user.bonusBalance,
        vipLevel: user.vipLevel,
        kycStatus: user.kycStatus,
      },
      token,
    };
  }

  // Login user
  async login(credentials: {
    phone?: string;
    email?: string;
    password: string;
  }): Promise<{ user: any; token: string }> {
    console.log("🔐 Login attempt:", {
      phone: credentials.phone,
      email: credentials.email,
    });

    // Find user by phone or email
    let user;
    if (credentials.phone) {
      user = await storage.getUserByPhone(credentials.phone);
      console.log(
        "📱 User found by phone:",
        user ? `ID: ${user.id}, Username: ${user.username}` : "Not found",
      );
    } else if (credentials.email) {
      user = await storage.getUserByEmail(credentials.email);
      console.log(
        "📧 User found by email:",
        user ? `ID: ${user.id}, Username: ${user.username}` : "Not found",
      );
    }

    if (!user) {
      console.log("❌ No user found");
      throw new Error("Invalid credentials");
    }

    // Check password
    console.log("🔒 Checking password for user:", user.id);
    const isValidPassword = await this.comparePassword(
      credentials.password,
      user.password,
    );
    console.log("🔓 Password valid:", isValidPassword);

    if (!isValidPassword) {
      console.log("❌ Invalid password");
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = this.generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    });

    // Update last login
    await storage.updateUserLastLogin(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        walletBalance: user.walletBalance,
        bonusBalance: user.bonusBalance,
        vipLevel: user.vipLevel,
        kycStatus: user.kycStatus,
        totalDeposit: user.totalDeposit,
        totalWithdraw: user.totalWithdraw,
        totalBet: user.totalBet,
        totalWin: user.totalWin,
      },
      token,
    };
  }

  // Generate referral code
  private generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Get user profile
  async getProfile(userId: number): Promise<any> {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      balance: user.balance,
      walletBalance: user.walletBalance,
      bonusBalance: user.bonusBalance,
      vipLevel: user.vipLevel,
      kycStatus: user.kycStatus,
      referralCode: user.referralCode,
      totalDeposit: user.totalDeposit,
      totalWithdraw: user.totalWithdraw,
      totalBet: user.totalBet,
      totalWin: user.totalWin,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }
}

// Middleware to authenticate requests
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  try {
    // Handle demo tokens
    if (token.startsWith("demo_token_")) {
      console.log("🎭 Demo token detected, authenticating demo user");
      req.user = {
        id: 10,
        username: "demo",
        email: "demo@91club.com",
        phone: "9876543210",
      };
      next();
      return;
    }

    const authService = new AuthService();
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    // Get user from database
    const user = await storage.getUser(decoded.id);
    if (!user) {
      return res.status(403).json({ success: false, message: "User not found or inactive" });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    };

    next();
  } catch (error: any) {
    console.log("🚫 Token verification error:", error.message);
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

// Optional authentication (for public endpoints that benefit from user context)
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    const authService = new AuthService();
    const decoded = authService.verifyToken(token);

    if (decoded) {
      const user = await storage.getUser(decoded.id);
      if (user && user.isActive) {
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
        };
      }
    }
  }

  next();
};

export const authService = new AuthService();
