import { Express } from 'express';
import { Server, createServer } from 'http';
import { authenticateToken, AuthRequest } from './auth.js';
import { storage } from './storage.js';
import { gameEngine } from './gameEngine.js';

// Demo balance (in a real app, this would come from a database)
let demoBalance = 10000;

import { analyticsService } from './analytics.js';
import { paymentService } from './payments.js';
import { asyncHandler } from './errorHandler.js';
import { validateBetAmount } from './security.js';
import realAuthRoutes from './real-auth.js';
import realPaymentRoutes from './real-payments.js';
import { authRoutes } from './authRoutes.js';
import { registerProductionRoutes } from './production-routes.js';
import { registerRealMoneyRoutes } from './real-money-routes.js';

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'API is working' });
  });

  // Game endpoint for balance
  app.get('/api/balance', (req, res) => {
    res.json({ balance: demoBalance });
  });

  // Game endpoints for the 5 production games
  app.post('/api/games/wingo', async (req, res) => {
    try {
      const { betAmount, betType, betValue } = req.body;
      
      // Validate bet amount
      if (betAmount > demoBalance) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      
      // Deduct bet amount
      demoBalance -= betAmount;
      
      // Play the game
      const result = await gameEngine.playWinGo(1, betAmount, betType, betValue);
      
      // Add winnings to balance
      demoBalance += result.winAmount;
      
      res.json({
        success: true,
        result: result,
        newBalance: demoBalance
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/games/aviator', async (req, res) => {
    try {
      const { betAmount, cashOutMultiplier, crashed, finalMultiplier } = req.body;
      
      // Validate bet amount
      if (betAmount > demoBalance) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      
      // Deduct bet amount
      demoBalance -= betAmount;
      
      // Play the game
      const result = await gameEngine.playAviator(1, betAmount, cashOutMultiplier, crashed, finalMultiplier);
      
      // Add winnings to balance
      demoBalance += result.winAmount;
      
      res.json({
        success: true,
        result: result,
        newBalance: demoBalance
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/games/mines', async (req, res) => {
    try {
      const { betAmount, mineCount, revealedTiles } = req.body;
      
      // Validate bet amount
      if (betAmount > demoBalance) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      
      // Deduct bet amount
      demoBalance -= betAmount;
      
      // Play the game
      const result = await gameEngine.playMines(1, betAmount, mineCount, revealedTiles);
      
      // Add winnings to balance
      demoBalance += result.winAmount;
      
      res.json({
        success: true,
        result: result,
        newBalance: demoBalance
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/games/dice', async (req, res) => {
    try {
      const { betAmount, prediction, targetNumber } = req.body;
      
      // Validate bet amount
      if (betAmount > demoBalance) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      
      // Deduct bet amount
      demoBalance -= betAmount;
      
      // Play the game
      const result = await gameEngine.playDice(1, betAmount, prediction, targetNumber);
      
      // Add winnings to balance
      demoBalance += result.winAmount;
      
      res.json({
        success: true,
        result: result,
        newBalance: demoBalance
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/games/dragon-tiger', async (req, res) => {
    try {
      const { betAmount, betType } = req.body;
      
      // Validate bet amount
      if (betAmount > demoBalance) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      
      // Deduct bet amount
      demoBalance -= betAmount;
      
      // Play the game
      const result = await gameEngine.playDragonTiger(1, betAmount, betType);
      
      // Add winnings to balance
      demoBalance += result.winAmount;
      
      res.json({
        success: true,
        result: result,
        newBalance: demoBalance
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Game statistics and history endpoints
  app.get('/api/games/:gameId/stats', (req, res) => {
    const { gameId } = req.params;
    res.json({
      gameId,
      totalPlayers: Math.floor(Math.random() * 1000) + 500,
      totalGames: Math.floor(Math.random() * 10000) + 5000,
      averageWin: Math.floor(Math.random() * 1000) + 100,
    });
  });

  app.get('/api/games/:gameId/history', (req, res) => {
    const { gameId } = req.params;
    const history = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      result: Math.floor(Math.random() * 10),
      multiplier: Math.floor(Math.random() * 10) + 1,
    }));
    res.json({ history });
  });

  // Enhanced Authentication Routes with KYC and OTP features
  app.use('/api/auth', authRoutes);
  
  // Real Authentication Routes (disabled for now - conflicts with OTP)
  // app.use('/api/auth', realAuthRoutes);

  // Register all production-ready routes
  registerProductionRoutes(app);
  registerRealMoneyRoutes(app);

  // Real Payment Routes  
  app.use('/api/payments', realPaymentRoutes);

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
    console.log('🔐 LOGIN ROUTE HIT');
    console.log('📝 Request body:', req.body);
    
    try {
      const { phone, email, password } = req.body;
      console.log('📱 Phone:', phone, 'Password:', password);
      
      // Demo user quick authentication
      if (phone === '9876543210' && password === 'demo123') {
        console.log('✅ Demo user authenticated');
        const token = 'demo_token_' + Date.now();
        res.json({
          success: true,
          token,
          user: {
            id: 10,
            username: 'demo',
            email: 'demo@91club.com',
            phone: '9876543210',
            walletBalance: '10814.00',
            balance: '0.00',
            bonusBalance: '100.00'
          }
        });
        return;
      }
      
      console.log('❌ Demo user authentication failed');
      
      // For other users, try database lookup
      let user;
      if (phone) {
        user = await storage.getUserByPhone(phone);
      } else if (email) {
        user = await storage.getUserByEmail(email);
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Use bcrypt to compare password
      const bcrypt = require('bcrypt');
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
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
          phone: user.phone,
          walletBalance: user.walletBalance,
          balance: user.balance,
          bonusBalance: user.bonusBalance
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
      
      // Validate bet amount
      if (!betAmount || betAmount <= 0 || betAmount > 50000) {
        return res.status(400).json({ error: 'Invalid bet amount' });
      }
      
      let result;

      switch (gameType) {
        case 'wingo':
          const { betType: wingoType, betValue: wingoValue } = req.body;
          if (!wingoType || wingoValue === undefined) {
            return res.status(400).json({ error: 'WinGo game requires betType and betValue' });
          }
          result = await gameEngine.playWinGo(req.user!.id, betAmount, wingoType, wingoValue);
          break;
        
        case 'k3':
          const { betType: k3Type = 'sum', betValue: k3Value = 10 } = req.body;
          result = await gameEngine.playK3Lottery(req.user!.id, betAmount, k3Type, k3Value);
          break;
        
        case 'aviator':
          const { cashOutMultiplier } = req.body;
          result = await gameEngine.playAviator(req.user!.id, betAmount, cashOutMultiplier);
          break;
        
        case 'mines':
          const { mineCount, revealedTiles } = req.body;
          result = await gameEngine.playMines(req.user!.id, betAmount, mineCount || 3, revealedTiles || [0]);
          break;
        
        case 'dice':
          const { prediction, targetNumber } = req.body;
          result = await gameEngine.playDice(req.user!.id, betAmount, prediction || 'over', targetNumber || 50);
          break;
        
        case 'dragon-tiger':
          const { betType: dragonTigerType } = req.body;
          if (!dragonTigerType) {
            return res.status(400).json({ error: 'Dragon Tiger game requires betType' });
          }
          result = await gameEngine.playDragonTiger(req.user!.id, betAmount, dragonTigerType);
          break;
        
        case 'cricket':
          const cricketOutcomes = ['four', 'six', 'wicket', 'dot', 'single'];
          const cricketResult = cricketOutcomes[Math.floor(Math.random() * cricketOutcomes.length)];
          const { betType: cricketBetType, betValue: cricketBetValue } = req.body;
          const cricketMultiplier = cricketBetValue === cricketResult ? (cricketResult === 'six' ? 6 : cricketResult === 'four' ? 4 : 3) : 0;
          result = {
            gameId: Date.now(),
            result: { outcome: cricketResult },
            multiplier: cricketMultiplier,
            winAmount: betAmount * cricketMultiplier,
            isWin: cricketMultiplier > 0
          };
          break;
        
        case 'limbo':
          const { targetMultiplier } = req.body;
          const crashPoint = Math.random() * 100 + 1;
          const limboMultiplier = targetMultiplier <= crashPoint ? targetMultiplier : 0;
          result = {
            gameId: Date.now(),
            result: { crashPoint, targetMultiplier },
            multiplier: limboMultiplier,
            winAmount: betAmount * limboMultiplier,
            isWin: limboMultiplier > 0
          };
          break;
        
        case 'goal':
          const { betType: goalBetType, betValue: goalBetValue, homeScore, awayScore } = req.body;
          const finalHomeScore = homeScore !== undefined ? homeScore : Math.floor(Math.random() * 4);
          const finalAwayScore = awayScore !== undefined ? awayScore : Math.floor(Math.random() * 4);
          let goalResult: 'home' | 'away' | 'draw';
          if (finalHomeScore > finalAwayScore) goalResult = 'home';
          else if (finalAwayScore > finalHomeScore) goalResult = 'away';
          else goalResult = 'draw';
          
          const goalMultiplier = goalBetValue === goalResult ? (goalResult === 'draw' ? 3.5 : 2.2) : 0;
          result = {
            gameId: Date.now(),
            result: { homeScore: finalHomeScore, awayScore: finalAwayScore, result: goalResult },
            multiplier: goalMultiplier,
            winAmount: betAmount * goalMultiplier,
            isWin: goalMultiplier > 0
          };
          break;
        
        case 'wheel':
          const { betValue: selectedSection, winningSection } = req.body;
          const actualWinningSection = winningSection || Math.floor(Math.random() * 8) + 1;
          const sectionMultipliers = [0, 2, 3, 5, 2, 10, 2, 7, 2];
          const wheelMultiplier = selectedSection === actualWinningSection ? sectionMultipliers[actualWinningSection] : 0;
          result = {
            gameId: Date.now(),
            result: { winningSection: actualWinningSection, selectedSection },
            multiplier: wheelMultiplier,
            winAmount: betAmount * wheelMultiplier,
            isWin: wheelMultiplier > 0
          };
          break;
        
        case 'plinko':
          const { riskLevel, multiplier } = req.body;
          const finalPosition = Math.floor(Math.random() * 9);
          const plinkoMultipliers = {
            low: [1.5, 1.2, 1.1, 1.0, 0.5, 1.0, 1.1, 1.2, 1.5],
            medium: [5.6, 2.1, 1.1, 1.0, 0.5, 1.0, 1.1, 2.1, 5.6],
            high: [29, 4, 1.5, 1, 0.2, 1, 1.5, 4, 29]
          };
          const plinkoMultiplier = plinkoMultipliers[riskLevel as keyof typeof plinkoMultipliers][finalPosition];
          result = {
            gameId: Date.now(),
            result: { finalPosition, riskLevel },
            multiplier: plinkoMultiplier,
            winAmount: betAmount * plinkoMultiplier,
            isWin: plinkoMultiplier >= 1
          };
          break;
        
        case 'roulette':
          const { betValue: rouletteBets, winningNumber } = req.body;
          const rouletteWinning = winningNumber !== undefined ? winningNumber : Math.floor(Math.random() * 13);
          const rouletteColors = ['green', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black'];
          let rouletteWinAmount = 0;
          
          if (typeof rouletteBets === 'object') {
            Object.entries(rouletteBets).forEach(([betType, amount]: [string, any]) => {
              let betMultiplier = 0;
              const winningColor = rouletteColors[rouletteWinning];
              
              if (betType === `number-${rouletteWinning}`) {
                betMultiplier = 35;
              } else if (betType === 'red' && winningColor === 'red') {
                betMultiplier = 2;
              } else if (betType === 'black' && winningColor === 'black') {
                betMultiplier = 2;
              } else if (betType === 'green' && winningColor === 'green') {
                betMultiplier = 35;
              } else if (betType === 'even' && rouletteWinning % 2 === 0 && rouletteWinning !== 0) {
                betMultiplier = 2;
              } else if (betType === 'odd' && rouletteWinning % 2 === 1) {
                betMultiplier = 2;
              } else if (betType === 'low' && rouletteWinning >= 1 && rouletteWinning <= 6) {
                betMultiplier = 2;
              } else if (betType === 'high' && rouletteWinning >= 7 && rouletteWinning <= 12) {
                betMultiplier = 2;
              }
              
              rouletteWinAmount += amount * betMultiplier;
            });
          }
          
          result = {
            gameId: Date.now(),
            result: { winningNumber: rouletteWinning, winningColor: rouletteColors[rouletteWinning] },
            multiplier: rouletteWinAmount > 0 ? rouletteWinAmount / betAmount : 0,
            winAmount: rouletteWinAmount,
            isWin: rouletteWinAmount > 0
          };
          break;

        default:
          const isWin = Math.random() > 0.45;
          const defaultMultiplier = isWin ? 1.5 + Math.random() * 2 : 0;
          const winAmount = isWin ? Math.floor(betAmount * defaultMultiplier) : 0;
          
          result = {
            gameId: Date.now(),
            result: Math.floor(Math.random() * 100),
            multiplier: defaultMultiplier,
            winAmount: winAmount,
            isWin: isWin
          };
          break;
      }
      
      res.json(result);
    } catch (error: any) {
      console.error(`Game ${req.params.gameType} error:`, error);
      
      // Handle specific errors with user-friendly messages
      if (error.message === 'Insufficient balance') {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' });
      }
      if (error.message.includes('Invalid bet')) {
        return res.status(400).json({ error: 'Invalid bet amount' });
      }
      
      res.status(500).json({ error: error.message || 'Game play failed' });
    }
  });

  // Game Betting Routes
  app.post('/api/games/bet', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { gameType, betAmount, betType, betValue, gameId } = req.body;
      const userId = req.user!.id;
      
      // Validate bet amount
      if (!betAmount || betAmount <= 0) {
        return res.status(400).json({ error: 'Invalid bet amount' });
      }
      
      // Get user and check balance
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const currentBalance = parseFloat(user.walletBalance || '0');
      if (currentBalance < betAmount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
      
      // Deduct bet amount from user balance
      const newBalance = currentBalance - betAmount;
      await storage.updateUserBalance(userId, newBalance.toString());
      
      // Process the bet
      let result;
      switch (gameType) {
        case 'wingo':
          const wingoResult = Math.floor(Math.random() * 10);
          const wingoColor = [0, 5].includes(wingoResult) ? 'violet' : 
                           [1, 3, 7, 9].includes(wingoResult) ? 'green' : 'red';
          const wingoBigSmall = wingoResult >= 5 ? 'big' : 'small';
          
          let wingoIsWin = false;
          let wingoMultiplier = 0;
          
          if (betType === 'color' && betValue === wingoColor) {
            wingoIsWin = true;
            wingoMultiplier = wingoColor === 'violet' ? 4.5 : 2;
          } else if (betType === 'number' && betValue == wingoResult) {
            wingoIsWin = true;
            wingoMultiplier = 9;
          } else if (betType === 'size' && betValue === wingoBigSmall) {
            wingoIsWin = true;
            wingoMultiplier = 2;
          }
          
          result = {
            success: true,
            isWin: wingoIsWin,
            winAmount: wingoIsWin ? betAmount * wingoMultiplier : 0,
            result: {
              number: wingoResult,
              color: wingoColor,
              bigSmall: wingoBigSmall
            }
          };
          
          // If won, add winnings to balance
          if (wingoIsWin) {
            const finalBalance = newBalance + (betAmount * wingoMultiplier);
            await storage.updateUserBalance(userId, finalBalance.toString());
          }
          break;
          
        case 'aviator':
          // For aviator betting
          if (req.body.won !== undefined) {
            // This is a cash-out or crash result
            if (req.body.won) {
              // Cash out - add winnings to balance
              const winAmount = req.body.winAmount || betAmount * 2;
              const finalBalance = newBalance + winAmount;
              await storage.updateUserBalance(userId, finalBalance.toString());
              
              result = {
                success: true,
                isWin: true,
                winAmount: winAmount,
                message: 'Cash out successful'
              };
            } else {
              // Crashed - no winnings
              result = {
                success: true,
                isWin: false,
                winAmount: 0,
                message: 'Flight crashed'
              };
            }
          } else {
            // Initial bet placement
            result = {
              success: true,
              message: 'Bet placed successfully',
              betAmount: betAmount
            };
          }
          break;
          
        default:
          result = {
            success: true,
            message: 'Bet placed successfully'
          };
      }
      
      res.json(result);
    } catch (error: any) {
      console.error('Bet placement error:', error);
      res.status(500).json({ error: error.message || 'Bet placement failed' });
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
        balance: user.balance || '0.00',
        walletBalance: user.walletBalance || '10814.00',
        bonusBalance: user.bonusBalance || '100.00'
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
      const { amount, paymentMethod } = req.body;
      
      if (!amount || amount < 10) {
        return res.status(400).json({ error: 'Minimum deposit amount is ₹10' });
      }

      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create Razorpay order
      const razorpayOrder = await paymentService.createDepositOrder(req.user!.id, amount);
      
      res.json({ 
        success: true, 
        order: razorpayOrder,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        userInfo: {
          name: user.username || 'User',
          email: user.email || 'user@example.com',
          phone: user.phone || '9999999999'
        }
      });
    } catch (error: any) {
      console.error('Deposit error:', error);
      res.status(500).json({ error: error.message });;
    }
  });

  // Payment verification endpoint
  app.post('/api/wallet/verify-payment', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { orderId, paymentId, signature } = req.body;
      
      // Verify payment with Razorpay and process deposit
      const result = await paymentService.verifyAndProcessDeposit(
        req.user!.id,
        { 
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId, 
          razorpay_signature: signature 
        }
      );

      if (result.success) {
        res.json({ 
          success: true, 
          message: 'Payment verified and wallet credited successfully',
          newBalance: result.newBalance
        });
      } else {
        res.status(400).json({ 
          success: false, 
          error: 'Payment verification failed'
        });
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
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

  // Register real money gaming routes
  registerRealMoneyRoutes(app);
  
  // Create and return HTTP server
  return createServer(app);
}