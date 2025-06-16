import { Express } from 'express';
import { Server } from 'http';
import { authenticateToken, AuthRequest } from './auth.js';
import { storage } from './storage.js';
import { gameEngine } from './gameEngine.js';
import { analyticsService } from './analytics.js';

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const result = await storage.createUser(req.body);
      res.json({ success: true, user: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { phone, email, password } = req.body;
      const user = await storage.getUserByUsername(phone) || await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = 'demo_token_' + Date.now();
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/auth/profile', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Single Game Route Handler
  app.post('/api/games/:gameType/play', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { gameType } = req.params;
      const { betAmount } = req.body;
      let result;

      switch (gameType) {
        case 'wingo':
          const { betType: wingoType = 'number', betValue: wingoValue = 5 } = req.body;
          result = await gameEngine.playWinGo(req.user!.id, betAmount, wingoType, wingoValue);
          break;
        
        case 'k3':
          const { betType: k3Type = 'sum', betValue: k3Value = 10 } = req.body;
          result = await gameEngine.playK3Lottery(req.user!.id, betAmount, k3Type, k3Value);
          break;
        
        case 'aviator':
          const { cashOutMultiplier = 1.5 } = req.body;
          result = await gameEngine.playAviator(req.user!.id, betAmount, cashOutMultiplier);
          break;
        
        case 'mines':
          const { mineCount = 3, revealedTiles = [0] } = req.body;
          result = await gameEngine.playMines(req.user!.id, betAmount, mineCount, revealedTiles);
          break;
        
        case 'dice':
          const { prediction = 'over', targetNumber = 50 } = req.body;
          result = await gameEngine.playDice(req.user!.id, betAmount, prediction, targetNumber);
          break;
        
        case 'dragon-tiger':
          const { betType = 'dragon' } = req.body;
          result = await gameEngine.playDragonTiger(req.user!.id, betAmount, betType);
          break;
        
        default:
          // Fallback for any unrecognized game types
          const isWin = Math.random() > 0.45;
          const multiplier = isWin ? 1.5 + Math.random() * 2 : 0;
          const winAmount = isWin ? Math.floor(betAmount * multiplier) : 0;
          
          const currentUser = await storage.getUser(req.user!.id);
          if (currentUser) {
            const currentBalance = Number(currentUser.walletBalance || 0);
            const newBalance = currentBalance - betAmount + winAmount;
            await storage.updateUserWalletBalance(req.user!.id, newBalance.toString());
          }
          
          result = {
            gameId: Date.now(),
            result: Math.floor(Math.random() * 100),
            multiplier: multiplier,
            winAmount: winAmount,
            isWin: isWin
          };
          break;
      }
      
      res.json(result);
    } catch (error: any) {
      console.error(`Game ${req.params.gameType} error:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // Wallet Routes
  app.get('/api/wallet/balance', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({
        balance: user.balance,
        walletBalance: user.walletBalance,
        bonusBalance: user.bonusBalance
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/wallet/transactions', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const transactions = await storage.getUserWalletTransactions(req.user!.id, limit);
      res.json({ transactions });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/wallet/deposit', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { amount, method } = req.body;
      const transaction = await storage.createWalletTransaction({
        userId: req.user!.id,
        type: 'deposit',
        amount: amount.toString(),
        status: 'completed',
        paymentMethod: method || 'demo'
      });
      
      const user = await storage.getUser(req.user!.id);
      if (user) {
        const newBalance = parseFloat(user.walletBalance) + amount;
        await storage.updateUserWalletBalance(req.user!.id, newBalance.toString());
      }
      
      res.json({ success: true, transaction });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/wallet/withdraw', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { amount, method } = req.body;
      const user = await storage.getUser(req.user!.id);
      
      if (!user || parseFloat(user.walletBalance) < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      
      const transaction = await storage.createWalletTransaction({
        userId: req.user!.id,
        type: 'withdrawal',
        amount: amount.toString(),
        status: 'completed',
        paymentMethod: method || 'demo'
      });
      
      const newBalance = parseFloat(user.walletBalance) - amount;
      await storage.updateUserWalletBalance(req.user!.id, newBalance.toString());
      
      res.json({ success: true, transaction });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Game History
  app.get('/api/user/game-history', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const history = await storage.getUserGameHistory(req.user!.id);
      res.json({ history });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Analytics and Live Data
  app.get('/api/analytics/live-stats', async (req, res) => {
    try {
      const stats = await gameEngine.getLiveStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Test endpoint to verify game functionality
  app.post('/api/test/game', async (req, res) => {
    try {
      const { gameType = 'aviator', betAmount = 50 } = req.body;
      
      // Get demo user (ID 1)
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ error: 'Demo user not found' });
      }

      const beforeBalance = Number(user.walletBalance || 0);
      let result;

      switch (gameType) {
        case 'aviator':
          result = await gameEngine.playAviator(1, betAmount, 1.5);
          break;
        case 'dice':
          result = await gameEngine.playDice(1, betAmount, 'over', 50);
          break;
        default:
          result = await gameEngine.playAviator(1, betAmount, 1.5);
      }

      const afterUser = await storage.getUser(1);
      const afterBalance = Number(afterUser?.walletBalance || 0);

      res.json({
        success: true,
        gameResult: result,
        balanceChange: {
          before: beforeBalance,
          after: afterBalance,
          change: afterBalance - beforeBalance,
          expected: result.winAmount - betAmount
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return app as any; // Return app, server will be started in index.ts
}