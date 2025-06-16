import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameEngine } from "./gameEngine";
import { authService, authenticateToken, optionalAuth, type AuthRequest } from "./auth";
import { analyticsService } from "./analytics";
import { insertUserSchema, insertGameSchema, insertGameCategorySchema, insertUserGameHistorySchema } from "@shared/schema";
import { z } from "zod";
import WebSocket, { WebSocketServer } from 'ws';

// Validation schemas
const loginSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6),
}).refine(data => data.phone || data.email, {
  message: "Either phone or email is required",
});

const registerSchema = z.object({
  phone: z.string().min(10),
  email: z.string().email().optional(),
  password: z.string().min(6),
  username: z.string().optional(),
  referralCode: z.string().optional(),
});

const gamePlaySchema = z.object({
  gameId: z.number(),
  betAmount: z.number().positive(),
  gameData: z.any()
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  app.get('/api/auth/profile', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const profile = await authService.getProfile(req.user!.id);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  // Game Routes
  app.get('/api/games', optionalAuth, async (req, res) => {
    try {
      const games = await storage.getAllGames();
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/games/categories', async (req, res) => {
    try {
      const categories = await storage.getAllGameCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/games/recommended', optionalAuth, async (req, res) => {
    try {
      const games = await storage.getRecommendedGames(6);
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // WIN GO Game
  app.post('/api/games/wingo/play', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { betAmount, betType, betValue } = req.body;
      const result = await gameEngine.playWinGo(req.user!.id, betAmount, betType, betValue);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // K3 Lottery Game
  app.post('/api/games/k3/play', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { betAmount, betType, betValue } = req.body;
      const result = await gameEngine.playK3Lottery(req.user!.id, betAmount, betType, betValue);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Aviator Game
  app.post('/api/games/aviator/play', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { betAmount, cashOutMultiplier } = req.body;
      const result = await gameEngine.playAviator(req.user!.id, betAmount, cashOutMultiplier);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Dice Game
  app.post('/api/games/dice/play', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { betAmount, prediction, targetNumber } = req.body;
      const result = await gameEngine.playDice(req.user!.id, betAmount, prediction || 'over', targetNumber || 50);
      
      // Update user balance
      const currentUser = await storage.getUser(req.user!.id);
      if (currentUser) {
        const newBalance = parseFloat(currentUser.walletBalance) + result.winAmount - betAmount;
        await storage.updateUserWalletBalance(req.user!.id, newBalance.toString());
      }
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Mines Game
  app.post('/api/games/mines/play', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { betAmount, mineCount, revealedTiles } = req.body;
      const result = await gameEngine.playMines(req.user!.id, betAmount, mineCount || 3, revealedTiles || []);
      
      // Update user balance
      const currentUser = await storage.getUser(req.user!.id);
      if (currentUser) {
        const newBalance = parseFloat(currentUser.walletBalance) + result.winAmount - betAmount;
        await storage.updateUserWalletBalance(req.user!.id, newBalance.toString());
      }
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generic game handler for other game types  
  app.post('/api/games/:gameType/play', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { gameType } = req.params;
      const { betAmount } = req.body;
      
      // Handle specific game types or use generic logic
      let result;
      
      switch (gameType) {
        case 'mines':
          const { mineCount = 3, revealedTiles = [0] } = req.body;
          result = await gameEngine.playMines(req.user!.id, betAmount, mineCount, revealedTiles);
          break;
        default:
          // Generic game simulation with proper balance handling
          const isWin = Math.random() > 0.4; // Better win rate
          const multiplier = isWin ? 1.2 + Math.random() * 2.8 : 0;
          const winAmount = isWin ? Math.floor(betAmount * multiplier) : 0;
          
          // Update balance properly
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
      res.status(500).json({ error: error.message });
    }
  });

  // Dice Game
  app.post('/api/games/dice/play', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { betAmount, prediction, targetNumber } = req.body;
      const result = await gameEngine.playDice(req.user!.id, betAmount, prediction, targetNumber);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Dragon Tiger Game
  app.post('/api/games/dragon-tiger/play', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { betAmount, betType } = req.body;
      const result = await gameEngine.playDragonTiger(req.user!.id, betAmount, betType);
      res.json(result);
    } catch (error: any) {
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
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/wallet/deposit', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { amount, paymentMethod } = req.body;
      
      // Create deposit transaction
      const transaction = await storage.createWalletTransaction({
        userId: req.user!.id,
        type: 'deposit',
        amount: amount.toString(),
        currency: 'INR',
        status: 'completed', // In real app, this would be pending until payment confirmation
        paymentMethod,
        description: `Deposit via ${paymentMethod}`
      });

      // Update user balance
      const currentUser = await storage.getUser(req.user!.id);
      if (currentUser) {
        const newBalance = parseFloat(currentUser.walletBalance) + amount;
        await storage.updateUserWalletBalance(req.user!.id, newBalance.toString());
      }

      res.json({ transaction, success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/wallet/withdraw', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { amount, paymentMethod } = req.body;
      
      // Check if user has sufficient balance
      const currentUser = await storage.getUser(req.user!.id);
      if (!currentUser || parseFloat(currentUser.walletBalance) < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Create withdrawal transaction
      const transaction = await storage.createWalletTransaction({
        userId: req.user!.id,
        type: 'withdrawal',
        amount: amount.toString(),
        currency: 'INR',
        status: 'pending', // Withdrawals need approval
        paymentMethod,
        description: `Withdrawal via ${paymentMethod}`
      });

      // Update user balance
      const newBalance = parseFloat(currentUser.walletBalance) - amount;
      await storage.updateUserWalletBalance(req.user!.id, newBalance.toString());

      res.json({ transaction, success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User Game History
  app.get('/api/user/game-history', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const history = await storage.getUserGameHistory(req.user!.id);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Promotions
  app.get('/api/promotions', async (req, res) => {
    try {
      const promotions = await storage.getActivePromotions();
      res.json(promotions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Live Statistics
  app.get('/api/live-stats', async (req, res) => {
    try {
      const stats = await gameEngine.getLiveStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Analytics
  app.get('/api/analytics/top-earners', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const topEarners = await storage.getTodaysTopEarners(limit);
      res.json(topEarners);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    // Send initial game state
    ws.send(JSON.stringify({
      type: 'connected',
      timestamp: new Date().toISOString()
    }));

    // Handle client messages
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'subscribe_game':
            // Subscribe to specific game updates
            ws.send(JSON.stringify({
              type: 'game_subscribed',
              gameId: data.gameId,
              timestamp: new Date().toISOString()
            }));
            break;
            
          case 'get_live_stats':
            const stats = await gameEngine.getLiveStats();
            ws.send(JSON.stringify({
              type: 'live_stats',
              data: stats,
              timestamp: new Date().toISOString()
            }));
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Broadcast live updates every 5 seconds
  setInterval(async () => {
    try {
      const stats = await gameEngine.getLiveStats();
      const winGoResult = gameEngine.getLatestWinGoResult();
      const k3Result = gameEngine.getLatestK3Result();
      
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'live_update',
            data: {
              stats,
              winGoResult,
              k3Result
            },
            timestamp: new Date().toISOString()
          }));
        }
      });
    } catch (error) {
      console.error('Broadcast error:', error);
    }
  }, 5000);

  return httpServer;
}