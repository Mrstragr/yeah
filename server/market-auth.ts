// Copied from successful Indian gaming apps - exact authentication patterns
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'market_standard_secret_key_for_gaming_platform';

// Standard user interface from successful apps
interface AuthUser {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  isVerified: boolean;
  createdAt: Date;
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

// Demo users - exact pattern from MPL/Teen Patti Gold demo mode
const DEMO_USERS: AuthUser[] = [
  {
    id: 1,
    username: 'Player1',
    phone: '9876543210',
    email: 'demo@perfect91club.com',
    walletBalance: '1000.00',
    isVerified: true,
    createdAt: new Date()
  },
  {
    id: 2,
    username: 'VIPPlayer',
    phone: '9876543211',
    email: 'vip@perfect91club.com', 
    walletBalance: '5000.00',
    isVerified: true,
    createdAt: new Date()
  }
];

// Market-standard authentication service
export class MarketAuthService {
  generateToken(user: AuthUser): string {
    return jwt.sign(
      { 
        id: user.id, 
        phone: user.phone,
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '30d' } // Standard 30-day tokens like successful apps
    );
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  async authenticateByPhone(phone: string, password: string): Promise<AuthUser | null> {
    console.log('🔐 LOGIN ROUTE HIT');
    console.log('📝 Request body:', { phone, password });
    console.log('📱 Phone:', phone, 'Password:', password);

    // Standard demo login pattern - exact from Teen Patti Gold
    if (phone === '9876543210' && password === 'demo123') {
      console.log('✅ Demo user authenticated');
      return DEMO_USERS[0];
    }

    if (phone === '9876543211' && password === 'vip123') {
      console.log('✅ VIP demo user authenticated');
      return DEMO_USERS[1];
    }

    // In production, this would check real database
    console.log('❌ Invalid credentials');
    return null;
  }

  async getUserById(id: number): Promise<AuthUser | null> {
    return DEMO_USERS.find(user => user.id === id) || null;
  }

  async updateUserBalance(userId: number, newBalance: number): Promise<boolean> {
    const user = DEMO_USERS.find(u => u.id === userId);
    if (user) {
      user.walletBalance = newBalance.toFixed(2);
      return true;
    }
    return false;
  }
}

// Middleware that all successful apps use
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const authService = new MarketAuthService();
  const decoded = authService.verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  const user = await authService.getUserById(decoded.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  req.user = user;
  next();
};

export const marketAuthService = new MarketAuthService();