import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { users, transactions, gameResults, userBets, gamePeriods } from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Real Money Gaming Routes with Indian Payment Integration
export async function registerRealMoneyRoutes(app: Express): Promise<Server> {
  const JWT_SECRET = process.env.JWT_SECRET || "tashanwin-secret-key";

  // Authentication middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.user = user;
      next();
    });
  };

  // ===================
  // AUTHENTICATION ROUTES
  // ===================

  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, phone, password, email, referredBy } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this phone number" });
      }

      // Create new user with starting balance
      const newUser = await storage.createUser({
        username,
        phone,
        email,
        password,
        referredBy,
        balance: "1000.00", // Starting bonus balance
        isVerified: false,
        kycStatus: "pending",
        vipLevel: 1,
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, username: newUser.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          phone: newUser.phone,
          balance: newUser.balance,
          vipLevel: newUser.vipLevel,
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { phone, password } = req.body;

      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          balance: user.balance,
          vipLevel: user.vipLevel,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // ===================
  // WALLET ROUTES
  // ===================

  // Get user balance
  app.get("/api/wallet/balance", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        balance: user.balance,
        totalWagered: user.totalWagered,
        totalWon: user.totalWon,
        winRate: user.winRate,
        gamesPlayed: user.gamesPlayed,
      });
    } catch (error) {
      console.error("Balance fetch error:", error);
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  });

  // Create deposit transaction
  app.post("/api/wallet/deposit", authenticateToken, async (req, res) => {
    try {
      const { amount, paymentMethod } = req.body;
      const userId = req.user.userId;

      if (!amount || amount < 10) {
        return res.status(400).json({ error: "Minimum deposit amount is ₹10" });
      }

      // Create transaction record
      const transaction = await storage.createTransaction({
        userId,
        type: "deposit",
        amount: amount.toString(),
        status: "pending",
        paymentMethod,
        description: `Deposit ₹${amount} via ${paymentMethod}`,
      });

      // In real implementation, integrate with Razorpay
      // For demo, auto-approve small amounts
      if (amount <= 1000) {
        await storage.updateUserBalance(userId, amount.toString(), 'add');
        await storage.updateTransactionStatus(transaction.transactionId!, "completed");

        res.json({
          success: true,
          message: "Deposit completed successfully",
          transactionId: transaction.transactionId,
          amount: amount,
        });
      } else {
        res.json({
          success: true,
          message: "Deposit initiated, please complete payment",
          transactionId: transaction.transactionId,
          amount: amount,
          paymentUrl: `https://checkout.razorpay.com/...`, // Demo URL
        });
      }
    } catch (error) {
      console.error("Deposit error:", error);
      res.status(500).json({ error: "Deposit failed" });
    }
  });

  // Process withdrawal request
  app.post("/api/wallet/withdraw", authenticateToken, async (req, res) => {
    try {
      const { amount } = req.body;
      const userId = req.user.userId;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.kycStatus !== "approved") {
        return res.status(403).json({ error: "KYC verification required for withdrawals" });
      }

      const currentBalance = parseFloat(user.balance || "0");
      if (currentBalance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      if (amount < 100) {
        return res.status(400).json({ error: "Minimum withdrawal amount is ₹100" });
      }

      // Deduct balance and create withdrawal transaction
      await storage.updateUserBalance(userId, amount.toString(), 'subtract');
      
      const transaction = await storage.createTransaction({
        userId,
        type: "withdrawal",
        amount: amount.toString(),
        status: "processing",
        description: `Withdrawal of ₹${amount}`,
      });

      res.json({
        success: true,
        message: "Withdrawal request submitted successfully",
        transactionId: transaction.transactionId,
        amount: amount,
        processingTime: "24-48 hours",
      });
    } catch (error) {
      console.error("Withdrawal error:", error);
      res.status(500).json({ error: "Withdrawal failed" });
    }
  });

  // Get transaction history
  app.get("/api/wallet/transactions", authenticateToken, async (req, res) => {
    try {
      const transactions = await storage.getUserTransactions(req.user.userId, 20);
      res.json({ transactions });
    } catch (error) {
      console.error("Transaction history error:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // ===================
  // GAME ROUTES
  // ===================

  // Get current game period for a game type
  app.get("/api/games/:gameType/current-period", async (req, res) => {
    try {
      const { gameType } = req.params;
      let period = await storage.getCurrentGamePeriod(gameType);
      
      if (!period) {
        // Create new period if none exists
        const periodNumber = Date.now().toString();
        period = await storage.createGamePeriod(gameType, periodNumber);
      }

      res.json({ period });
    } catch (error) {
      console.error("Current period error:", error);
      res.status(500).json({ error: "Failed to get current period" });
    }
  });

  // Place bet
  app.post("/api/games/bet", authenticateToken, async (req, res) => {
    try {
      const { gameType, betType, betValue, betAmount, multiplier } = req.body;
      const userId = req.user.userId;

      // Validate bet amount
      if (!betAmount || betAmount < 1) {
        return res.status(400).json({ error: "Minimum bet amount is ₹1" });
      }

      // Check user balance
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentBalance = parseFloat(user.balance || "0");
      if (currentBalance < betAmount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      // Get current period
      let period = await storage.getCurrentGamePeriod(gameType);
      if (!period) {
        const periodNumber = Date.now().toString();
        period = await storage.createGamePeriod(gameType, periodNumber);
      }

      // Deduct bet amount from balance
      await storage.updateUserBalance(userId, betAmount.toString(), 'subtract');

      // Create bet record
      const bet = await storage.createUserBet({
        userId,
        periodId: period.id,
        gameType,
        betType,
        betValue,
        betAmount: betAmount.toString(),
        multiplier: multiplier.toString(),
        status: "active",
      });

      // Update user statistics
      await db.update(users)
        .set({
          totalWagered: sql`${users.totalWagered} + ${betAmount}`,
          gamesPlayed: sql`${users.gamesPlayed} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      res.json({
        success: true,
        message: "Bet placed successfully",
        betId: bet.id,
        remainingBalance: (currentBalance - betAmount).toFixed(2),
      });
    } catch (error) {
      console.error("Bet placement error:", error);
      res.status(500).json({ error: "Failed to place bet" });
    }
  });

  // Get user's active bets
  app.get("/api/games/:gameType/my-bets", authenticateToken, async (req, res) => {
    try {
      const { gameType } = req.params;
      const bets = await storage.getUserActiveBets(req.user.userId, gameType);
      res.json({ bets });
    } catch (error) {
      console.error("User bets error:", error);
      res.status(500).json({ error: "Failed to fetch bets" });
    }
  });

  // Get game history
  app.get("/api/games/history", authenticateToken, async (req, res) => {
    try {
      const { gameType, limit = 20 } = req.query;
      const history = await storage.getUserGameHistory(
        req.user.userId,
        gameType as string,
        parseInt(limit as string)
      );
      res.json({ history });
    } catch (error) {
      console.error("Game history error:", error);
      res.status(500).json({ error: "Failed to fetch game history" });
    }
  });

  // ===================
  // DEMO GAME RESULTS (For Testing)
  // ===================

  // Simulate WinGo result
  app.post("/api/games/wingo/result", async (req, res) => {
    try {
      const { period } = req.body;
      
      // Generate random result (0-9)
      const number = Math.floor(Math.random() * 10);
      const colors = [];
      
      if (number === 0 || number === 5) colors.push('violet');
      if ([1, 3, 7, 9].includes(number)) colors.push('green');
      if ([2, 4, 6, 8].includes(number)) colors.push('red');
      
      const size = number >= 5 ? 'big' : 'small';
      
      const result = {
        number,
        colors,
        size,
        period,
        timestamp: new Date(),
      };

      // Process all bets for this period and distribute winnings
      // This would be done automatically by a background job in production
      
      res.json({
        success: true,
        result,
        message: "Game result generated successfully",
      });
    } catch (error) {
      console.error("Game result error:", error);
      res.status(500).json({ error: "Failed to generate result" });
    }
  });

  // ===================
  // USER PROFILE ROUTES
  // ===================

  // Get user profile
  app.get("/api/user/profile", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        balance: user.balance,
        totalWagered: user.totalWagered,
        totalWon: user.totalWon,
        gamesPlayed: user.gamesPlayed,
        winRate: user.winRate,
        vipLevel: user.vipLevel,
        kycStatus: user.kycStatus,
        referralCode: user.referralCode,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}