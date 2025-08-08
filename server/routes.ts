import { Express } from 'express';
import { Server, createServer } from 'http';
import { storage } from './storage.js';

// Demo balance for simple game testing
let demoBalance = 10000;

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'API is working' });
  });

  // Game endpoint for balance
  app.get('/api/balance', (req, res) => {
    res.json({ balance: demoBalance });
  });

  // Simple demo game endpoint
  app.post('/api/games/demo/:gameType', async (req, res) => {
    try {
      const { gameType } = req.params;
      const { betAmount } = req.body;
      
      // Validate bet amount
      if (!betAmount || betAmount <= 0 || betAmount > demoBalance) {
        return res.status(400).json({ error: 'Invalid bet amount or insufficient balance' });
      }
      
      // Deduct bet amount
      demoBalance -= betAmount;
      
      // Simple demo game logic
      const win = Math.random() > 0.5;
      const multiplier = win ? Math.random() * 3 + 1 : 0;
      const winAmount = Math.floor(betAmount * multiplier);
      
      // Add winnings to balance
      demoBalance += winAmount;
      
      res.json({
        success: true,
        result: {
          gameType,
          outcome: win ? 'win' : 'lose',
          multiplier: parseFloat(multiplier.toFixed(2)),
          winAmount: winAmount
        },
        newBalance: demoBalance
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User management endpoints
  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/users/create', async (req, res) => {
    try {
      const { username, email, password, phone } = req.body;
      if (!username || !email || !password || !phone) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const user = await storage.createUser({
        username,
        email,
        password,
        phone,
        balance: '1000.00' // Starting balance
      });
      
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Game statistics
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

  // Start HTTP server
  const server = createServer(app);
  
  return server;
}