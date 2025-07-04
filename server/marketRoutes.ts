import type { Express } from "express";
import { marketGameEngine } from './marketGameEngine';
import { authenticateToken } from './auth';

// AUTHENTIC MARKET-LEVEL GAME ROUTES
// Matches real Indian gaming platform APIs

export function setupMarketGameRoutes(app: Express) {

  // WINGO GAMES - All time intervals
  app.post('/api/games/wingo/bet', authenticateToken, async (req: any, res) => {
    try {
      const { gameType, betAmount, betType, betValue, quantity = 1 } = req.body;
      const userId = req.user.id;

      // Validate game type
      const validWinGoTypes = ['wingo_30s', 'wingo_1min', 'wingo_3min', 'wingo_5min', 'wingo_10min', 'trx_1min'];
      if (!validWinGoTypes.includes(gameType)) {
        return res.status(400).json({ error: 'Invalid game type' });
      }

      // Validate bet parameters
      if (!betAmount || betAmount <= 0) {
        return res.status(400).json({ error: 'Invalid bet amount' });
      }

      if (!['number', 'color', 'size'].includes(betType)) {
        return res.status(400).json({ error: 'Invalid bet type' });
      }

      // Validate bet value based on type
      if (betType === 'number' && (betValue < 0 || betValue > 9)) {
        return res.status(400).json({ error: 'Number must be between 0-9' });
      }

      if (betType === 'color' && !['red', 'green', 'violet'].includes(betValue)) {
        return res.status(400).json({ error: 'Color must be red, green, or violet' });
      }

      if (betType === 'size' && !['big', 'small'].includes(betValue)) {
        return res.status(400).json({ error: 'Size must be big or small' });
      }

      const result = await marketGameEngine.playWinGo(
        userId, 
        gameType, 
        betAmount, 
        betType, 
        betValue, 
        quantity
      );

      res.json({
        success: true,
        data: {
          period: result.period,
          sessionId: `${gameType}_${result.period}_${userId}_${Date.now()}`,
          betAmount: betAmount * quantity,
          prediction: { betType, betValue, quantity },
          message: 'Bet placed successfully, waiting for result'
        }
      });

    } catch (error: any) {
      console.error('WinGo bet error:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message || 'Failed to place bet' 
      });
    }
  });

  // K3 LOTTERY GAMES
  app.post('/api/games/k3/bet', authenticateToken, async (req: any, res) => {
    try {
      const { gameType, betAmount, betType, betValue, quantity = 1 } = req.body;
      const userId = req.user.id;

      // Validate K3 game type
      const validK3Types = ['k3_1min', 'k3_3min', 'k3_5min', 'k3_10min'];
      if (!validK3Types.includes(gameType)) {
        return res.status(400).json({ error: 'Invalid K3 game type' });
      }

      // Validate K3 bet parameters
      if (!['sum', 'straight', 'combination'].includes(betType)) {
        return res.status(400).json({ error: 'Invalid K3 bet type' });
      }

      const result = await marketGameEngine.playK3(
        userId, 
        gameType, 
        betAmount, 
        betType, 
        betValue, 
        quantity
      );

      res.json({
        success: true,
        data: {
          period: result.period,
          sessionId: `${gameType}_${result.period}_${userId}_${Date.now()}`,
          betAmount: betAmount * quantity,
          prediction: { betType, betValue, quantity },
          message: 'K3 bet placed successfully'
        }
      });

    } catch (error: any) {
      console.error('K3 bet error:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message || 'Failed to place K3 bet' 
      });
    }
  });

  // 5D LOTTERY GAMES
  app.post('/api/games/5d/bet', authenticateToken, async (req: any, res) => {
    try {
      const { betAmount, betType, betValue, quantity = 1 } = req.body;
      const userId = req.user.id;
      const gameType = 'd5_1min';

      // Validate 5D bet parameters
      if (!['sum', 'digit_position', 'property'].includes(betType)) {
        return res.status(400).json({ error: 'Invalid 5D bet type' });
      }

      const result = await marketGameEngine.playK3( // Reuse K3 logic structure
        userId, 
        gameType, 
        betAmount, 
        betType, 
        betValue, 
        quantity
      );

      res.json({
        success: true,
        data: {
          period: result.period,
          sessionId: `${gameType}_${result.period}_${userId}_${Date.now()}`,
          betAmount: betAmount * quantity,
          prediction: { betType, betValue, quantity },
          message: '5D lottery bet placed successfully'
        }
      });

    } catch (error: any) {
      console.error('5D bet error:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message || 'Failed to place 5D bet' 
      });
    }
  });

  // AVIATOR GAME
  app.post('/api/games/aviator/bet', authenticateToken, async (req: any, res) => {
    try {
      const { betAmount, cashoutMultiplier } = req.body;
      const userId = req.user.id;

      if (!betAmount || betAmount <= 0) {
        return res.status(400).json({ error: 'Invalid bet amount' });
      }

      if (!cashoutMultiplier || cashoutMultiplier < 1.01) {
        return res.status(400).json({ error: 'Cashout multiplier must be at least 1.01x' });
      }

      // For Aviator, we need special handling as it's continuous
      const roundId = `aviator_${Date.now()}`;
      
      // Validate user balance first
      const user = await storage.getUser(userId);
      if (!user || user.walletBalance < betAmount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      res.json({
        success: true,
        data: {
          roundId,
          betAmount,
          cashoutMultiplier,
          message: 'Aviator bet placed, waiting for flight'
        }
      });

    } catch (error: any) {
      console.error('Aviator bet error:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message || 'Failed to place Aviator bet' 
      });
    }
  });

  // LIVE GAME DATA ENDPOINTS

  // Get current period for any game
  app.get('/api/games/:gameType/current-period', (req, res) => {
    try {
      const { gameType } = req.params;
      const currentPeriod = marketGameEngine.getCurrentPeriod(gameType);
      
      if (!currentPeriod) {
        return res.status(404).json({ error: 'Game type not found' });
      }

      res.json({
        success: true,
        data: {
          gameType,
          currentPeriod,
          timestamp: new Date()
        }
      });

    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get current period' 
      });
    }
  });

  // Get game results history
  app.get('/api/games/:gameType/results', (req, res) => {
    try {
      const { gameType } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const results = marketGameEngine.getLatestResults(gameType, limit);
      
      res.json({
        success: true,
        data: {
          gameType,
          results,
          count: results.length
        }
      });

    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get game results' 
      });
    }
  });

  // Get specific period result
  app.get('/api/games/:gameType/result/:period', (req, res) => {
    try {
      const { gameType, period } = req.params;
      const result = marketGameEngine.getGameResult(gameType, period);
      
      if (!result) {
        return res.status(404).json({ error: 'Result not found' });
      }

      res.json({
        success: true,
        data: {
          gameType,
          period,
          result
        }
      });

    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get game result' 
      });
    }
  });

  // Live statistics
  app.get('/api/games/live-stats', async (req, res) => {
    try {
      const stats = await marketGameEngine.getLiveStats();
      
      res.json({
        success: true,
        data: stats
      });

    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get live stats' 
      });
    }
  });

  // MARKET-SPECIFIC ENDPOINTS

  // Get all current periods (for dashboard)
  app.get('/api/games/all-periods', (req, res) => {
    try {
      const periods = {
        wingo_30s: marketGameEngine.getCurrentPeriod('wingo_30s'),
        wingo_1min: marketGameEngine.getCurrentPeriod('wingo_1min'),
        wingo_3min: marketGameEngine.getCurrentPeriod('wingo_3min'),
        wingo_5min: marketGameEngine.getCurrentPeriod('wingo_5min'),
        wingo_10min: marketGameEngine.getCurrentPeriod('wingo_10min'),
        k3_1min: marketGameEngine.getCurrentPeriod('k3_1min'),
        k3_3min: marketGameEngine.getCurrentPeriod('k3_3min'),
        k3_5min: marketGameEngine.getCurrentPeriod('k3_5min'),
        k3_10min: marketGameEngine.getCurrentPeriod('k3_10min'),
        trx_1min: marketGameEngine.getCurrentPeriod('trx_1min'),
        d5_1min: marketGameEngine.getCurrentPeriod('d5_1min')
      };

      res.json({
        success: true,
        data: periods
      });

    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get periods' 
      });
    }
  });

  // Real-time countdown for games
  app.get('/api/games/:gameType/countdown', (req, res) => {
    try {
      const { gameType } = req.params;
      
      // Calculate time remaining based on game intervals
      const now = new Date();
      let secondsRemaining = 0;
      
      switch (gameType) {
        case 'wingo_30s':
          secondsRemaining = 30 - (now.getSeconds() % 30);
          break;
        case 'wingo_1min':
        case 'k3_1min':
        case 'trx_1min':
        case 'd5_1min':
          secondsRemaining = 60 - now.getSeconds();
          break;
        case 'wingo_3min':
        case 'k3_3min':
          secondsRemaining = 180 - ((now.getMinutes() % 3) * 60 + now.getSeconds());
          break;
        case 'wingo_5min':
        case 'k3_5min':
          secondsRemaining = 300 - ((now.getMinutes() % 5) * 60 + now.getSeconds());
          break;
        case 'wingo_10min':
        case 'k3_10min':
          secondsRemaining = 600 - ((now.getMinutes() % 10) * 60 + now.getSeconds());
          break;
        default:
          return res.status(404).json({ error: 'Game type not found' });
      }

      res.json({
        success: true,
        data: {
          gameType,
          secondsRemaining,
          currentPeriod: marketGameEngine.getCurrentPeriod(gameType),
          timestamp: now
        }
      });

    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get countdown' 
      });
    }
  });

  // Multiplier info for each game
  app.get('/api/games/multipliers', (req, res) => {
    try {
      const multipliers = {
        wingo: {
          number: 9.0,          // 1:9 for exact number
          color_red: 2.0,       // 1:2 for red
          color_green: 2.0,     // 1:2 for green  
          color_violet: 4.5,    // 1:4.5 for violet
          size_big: 2.0,        // 1:2 for big
          size_small: 2.0       // 1:2 for small
        },
        k3: {
          sum_3_18: 216,        // Extreme sums
          sum_4_17: 108,
          sum_5_16: 72,
          sum_6_15: 54,
          sum_7_14: 36,
          sum_8_13: 24,
          sum_9_12: 18,
          sum_10_11: 14,
          straight: 216,        // Exact 3-dice combination
          big_small: 2,         // Sum range bets
          odd_even: 2
        },
        d5: {
          sum_extreme: 45,      // Very rare sums
          sum_uncommon: 25,
          sum_rare: 15,
          sum_common: 8,
          sum_frequent: 5,
          digit_position: 9,    // Exact digit in position
          property: 2           // Big/Small/Odd/Even
        },
        aviator: {
          min: 1.01,           // Minimum cashout
          max: 1000.0,         // Maximum theoretical
          average: 2.5         // Statistical average
        }
      };

      res.json({
        success: true,
        data: multipliers
      });

    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get multipliers' 
      });
    }
  });

  console.log('✅ Market-level game routes registered');
}