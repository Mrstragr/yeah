// Copied from successful Indian gaming apps - exact API patterns
import { Express } from 'express';
import { createServer } from 'http';
import { marketAuthService, authenticateToken } from './market-auth';
import { marketPaymentService } from './market-payments';

interface AuthRequest {
  user?: {
    id: number;
    username: string;
    phone: string;
    email: string;
    walletBalance: string;
    isVerified: boolean;
  };
  body: any;
}

export async function setupMarketRoutes(app: Express) {
  // Standard authentication routes from successful apps
  app.post('/api/auth/login', async (req: any, res: any) => {
    try {
      const { phone, password } = req.body;
      
      const user = await marketAuthService.authenticateByPhone(phone, password);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid phone number or password' 
        });
      }

      const token = marketAuthService.generateToken(user);
      
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          email: user.email,
          walletBalance: user.walletBalance,
          isVerified: user.isVerified
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  });

  // Standard profile route
  app.get('/api/auth/profile', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
      res.json({
        success: true,
        user: req.user
      });
    } catch (error: any) {
      console.error('Profile error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch profile' 
      });
    }
  });

  // Standard wallet routes - exact from MPL/Teen Patti Gold
  app.get('/api/wallet/balance', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
      res.json({
        success: true,
        balance: parseFloat(req.user?.walletBalance || '0')
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch balance' 
      });
    }
  });

  // Standard deposit route
  app.post('/api/wallet/deposit', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
      const { amount } = req.body;
      const userId = req.user?.id;

      if (!userId || !amount || amount < 10) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid deposit amount (minimum ₹10)' 
        });
      }

      const order = await marketPaymentService.createDepositOrder(userId, amount);
      
      res.json({
        success: true,
        orderId: order.orderId,
        amount: order.amount,
        currency: 'INR'
      });
    } catch (error: any) {
      console.error('Deposit error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create payment order' 
      });
    }
  });

  // Standard payment verification
  app.post('/api/wallet/verify-payment', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
      const { orderId, paymentId, signature } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          error: 'User not authenticated' 
        });
      }

      const isValid = await marketPaymentService.verifyPayment(orderId, paymentId, signature);
      
      if (isValid) {
        // Find the transaction and update user balance
        const transaction = marketPaymentService.getTransaction(
          marketPaymentService.getUserTransactions(userId, 50)
            .find(t => t.orderId === orderId)?.id || 0
        );

        if (transaction) {
          const currentBalance = parseFloat(req.user?.walletBalance || '0');
          const newBalance = currentBalance + transaction.amount;
          
          await marketAuthService.updateUserBalance(userId, newBalance);
          
          res.json({
            success: true,
            message: 'Payment verified successfully',
            newBalance: newBalance.toFixed(2)
          });
        } else {
          res.status(404).json({ 
            success: false, 
            error: 'Transaction not found' 
          });
        }
      } else {
        res.status(400).json({ 
          success: false, 
          error: 'Payment verification failed' 
        });
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to verify payment' 
      });
    }
  });

  // Standard withdrawal route
  app.post('/api/wallet/withdraw', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
      const { amount, accountDetails } = req.body;
      const userId = req.user?.id;

      if (!userId || !amount || amount < 100) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid withdrawal amount (minimum ₹100)' 
        });
      }

      const currentBalance = parseFloat(req.user?.walletBalance || '0');
      if (amount > currentBalance) {
        return res.status(400).json({ 
          success: false, 
          error: 'Insufficient balance' 
        });
      }

      const transaction = await marketPaymentService.processWithdrawal(userId, amount, accountDetails);
      
      // Update user balance
      const newBalance = currentBalance - amount;
      await marketAuthService.updateUserBalance(userId, newBalance);

      res.json({
        success: true,
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          status: transaction.status,
          createdAt: transaction.createdAt
        },
        newBalance: newBalance.toFixed(2)
      });
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to process withdrawal' 
      });
    }
  });

  // Standard transaction history
  app.get('/api/wallet/transactions', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          error: 'User not authenticated' 
        });
      }

      const transactions = marketPaymentService.getUserTransactions(userId, 20);
      
      res.json({
        success: true,
        transactions: transactions.map(t => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          status: t.status,
          createdAt: t.createdAt,
          paymentId: t.paymentId,
          orderId: t.orderId
        }))
      });
    } catch (error: any) {
      console.error('Transactions error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch transactions' 
      });
    }
  });

  // Standard game routes
  app.post('/api/games/bet', authenticateToken, async (req: AuthRequest, res: any) => {
    try {
      const { gameId, amount, betType } = req.body;
      const userId = req.user?.id;

      if (!userId || !amount || amount < 1) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid bet amount' 
        });
      }

      const currentBalance = parseFloat(req.user?.walletBalance || '0');
      if (amount > currentBalance) {
        return res.status(400).json({ 
          success: false, 
          error: 'Insufficient balance' 
        });
      }

      // Record bet
      const betTransaction = marketPaymentService.recordBet(userId, amount);
      
      // Simulate game result (demo mode)
      const isWin = Math.random() > 0.5;
      const multiplier = isWin ? 1.5 + Math.random() * 2 : 0;
      const winAmount = isWin ? amount * multiplier : 0;

      let newBalance = currentBalance - amount;
      
      if (isWin) {
        const winTransaction = marketPaymentService.recordWin(userId, winAmount);
        newBalance += winAmount;
      }

      await marketAuthService.updateUserBalance(userId, newBalance);

      res.json({
        success: true,
        result: {
          isWin,
          multiplier: multiplier.toFixed(2),
          winAmount: winAmount.toFixed(2),
          betAmount: amount,
          newBalance: newBalance.toFixed(2)
        }
      });
    } catch (error: any) {
      console.error('Game bet error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to process bet' 
      });
    }
  });

  // Health check route
  app.get('/api/test', (req: any, res: any) => {
    res.json({ 
      status: 'ok', 
      message: 'Market Standard API is working',
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}