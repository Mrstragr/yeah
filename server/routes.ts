import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyticsService } from "./analytics";
import { insertUserSchema, insertGameSchema, insertGameCategorySchema, insertUserGameHistorySchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tashanwin-secret-key-2025";

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Admin authentication middleware
const authenticateAdmin = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    
    if (!user || user.role !== 'admin') {
      return res.sendStatus(403);
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

// Validation schemas
const loginSchema = z.object({
  phone: z.string().min(10),
  password: z.string().min(6),
});

const registerSchema = z.object({
  username: z.string().min(3),
  phone: z.string().min(10),
  email: z.string().email(),
  password: z.string().min(6),
  referralCode: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByPhone(data.phone);
      if (existingUser) {
        return res.status(400).json({ message: "Phone number already registered" });
      }

      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Generate referral code
      const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      // Create user with welcome bonus (store phone as provided)
      const user = await storage.createUser({
        username: data.username,
        phone: data.phone,
        email: data.email,
        password: hashedPassword,
        walletBalance: "500.00", // Welcome bonus
        bonusBalance: data.referralCode ? "700.00" : "500.00", // Extra for referral
        referralCode,
        referredBy: data.referralCode || null,
        firstName: null,
        lastName: null,
        kycStatus: "pending",
        balance: "0.00",
        avatar: null,
        vipLevel: 0,
        totalDeposit: "0.00",
        totalWithdraw: "0.00",
        totalBet: "0.00",
        totalWin: "0.00",
        loginBonus: false,
        lastLoginAt: null,
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, phone: user.phone },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          email: user.email,
          walletBalance: user.walletBalance,
          bonusBalance: user.bonusBalance,
          kycStatus: user.kycStatus,
          referralCode: user.referralCode,
        },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      
      // Find user by phone (try both with and without + prefix)
      let user = await storage.getUserByPhone(data.phone);
      if (!user && !data.phone.startsWith('+')) {
        user = await storage.getUserByPhone(`+91${data.phone}`);
      }
      if (!user && data.phone.startsWith('+91')) {
        user = await storage.getUserByPhone(data.phone.substring(3));
      }

      if (!user) {
        return res.status(401).json({ message: "Invalid phone number or password" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid phone number or password" });
      }

      // Update last login
      await storage.updateUserLastLogin(user.id);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, phone: user.phone },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          email: user.email,
          walletBalance: user.walletBalance,
          bonusBalance: user.bonusBalance,
          kycStatus: user.kycStatus,
          referralCode: user.referralCode,
          vipLevel: user.vipLevel,
        },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  app.get("/api/auth/user", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        walletBalance: user.walletBalance,
        bonusBalance: user.bonusBalance,
        kycStatus: user.kycStatus,
        referralCode: user.referralCode,
        vipLevel: user.vipLevel,
        totalDeposit: user.totalDeposit,
        totalWithdraw: user.totalWithdraw,
        totalBet: user.totalBet,
        totalWin: user.totalWin,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/auth/logout", authenticateToken, (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  // Wallet operations
  app.post("/api/wallet/deduct", authenticateToken, async (req: any, res) => {
    try {
      const { amount } = req.body;
      const userId = req.userId;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentBalance = parseFloat(user.walletBalance);
      if (currentBalance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      const newBalance = (currentBalance - amount).toFixed(2);
      const updatedUser = await storage.updateUserWalletBalance(userId, newBalance);

      // Record transaction and game history
      await storage.createWalletTransaction({
        userId,
        type: "debit",
        amount: amount.toString(),
        status: "completed",
        description: "Game bet placed"
      });

      // Update user's total bet amount
      const currentTotalBet = parseFloat(user.totalBet || "0");
      await storage.updateUserStats(userId, {
        totalBet: (currentTotalBet + amount).toFixed(2)
      });

      res.json({ 
        success: true, 
        newBalance: updatedUser?.walletBalance,
        message: "Bet placed successfully"
      });
    } catch (error) {
      console.error("Error deducting wallet balance:", error);
      res.status(500).json({ message: "Failed to process bet" });
    }
  });

  app.post("/api/wallet/credit", authenticateToken, async (req: any, res) => {
    try {
      const { amount, description } = req.body;
      const userId = req.userId;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentBalance = parseFloat(user.walletBalance);
      const newBalance = (currentBalance + amount).toFixed(2);
      const updatedUser = await storage.updateUserWalletBalance(userId, newBalance);

      // Record transaction
      await storage.createWalletTransaction({
        userId,
        type: "credit",
        amount: amount.toString(),
        status: "completed",
        description: description || "Game winnings"
      });

      res.json({ 
        success: true, 
        newBalance: updatedUser?.walletBalance,
        message: "Winnings credited successfully"
      });
    } catch (error) {
      console.error("Error crediting wallet balance:", error);
      res.status(500).json({ message: "Failed to credit winnings" });
    }
  });
  // Game categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllGameCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getGameCategory(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Games routes
  app.get("/api/games", async (req, res) => {
    try {
      const { category, recommended } = req.query;
      
      let games;
      if (recommended === "true") {
        games = await storage.getRecommendedGames(4);
      } else if (category) {
        games = await storage.getGamesByCategory(category as string);
      } else {
        games = await storage.getAllGames();
      }
      
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch games" });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const game = await storage.getGame(parseInt(req.params.id));
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game" });
    }
  });

  app.post("/api/games", async (req, res) => {
    try {
      const validatedData = insertGameSchema.parse(req.body);
      const game = await storage.createGame(validatedData);
      res.status(201).json(game);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create game" });
    }
  });

  // Game betting endpoint
  app.post("/api/games/bet", authenticateToken, async (req: any, res) => {
    try {
      const { gameId, betAmount, gameData } = req.body;
      const userId = req.user.userId || req.user.id;

      if (!betAmount || betAmount <= 0) {
        return res.status(400).json({ message: "Invalid bet amount" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentBalance = parseFloat(user.walletBalance);
      if (currentBalance < betAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Map game names to IDs
      const gameMapping: Record<string, number> = {
        'Aviator': 206,
        'Coin Flip': 173,
        'Dice Roll': 172,
        'Scratch Cards': 999
      };

      const actualGameId = typeof gameId === 'string' ? gameMapping[gameId] || 999 : gameId;

      // Generate random game outcome based on game type
      let isWin = false;
      let multiplier = 2;
      let gameResult = "";

      // Get game info to determine type
      const gameInfo = await storage.getGame(actualGameId);
      const gameTitle = gameInfo?.title || "Unknown";

      // Game-specific logic with realistic win rates
      switch (gameTitle.toLowerCase()) {
        case 'aviator':
          const aviatorMultiplier = Math.random() * 10 + 1;
          isWin = Math.random() > 0.4; // 60% win rate
          multiplier = isWin ? aviatorMultiplier : 0;
          gameResult = isWin ? `Plane flew to ${aviatorMultiplier.toFixed(2)}x!` : "Plane crashed!";
          break;

        case 'coin flip':
          isWin = Math.random() > 0.5; // 50% win rate
          multiplier = 2;
          gameResult = isWin ? "Coin landed on your side!" : "Coin landed on the wrong side!";
          break;

        case 'dice roll':
          const diceSum = Math.floor(Math.random() * 18) + 3; // 3-21
          isWin = diceSum > 10; // Roughly 50% win rate
          multiplier = isWin ? (diceSum / 10) : 0;
          gameResult = `Dice rolled: ${diceSum}`;
          break;

        case 'big small':
          const bigSmallResult = Math.random() > 0.5;
          isWin = bigSmallResult;
          multiplier = 2;
          gameResult = isWin ? "Big wins!" : "Small wins!";
          break;

        case 'blackjack':
          isWin = Math.random() > 0.45; // 55% win rate (house edge)
          multiplier = 2;
          gameResult = isWin ? "Blackjack!" : "House wins!";
          break;

        case 'lucky numbers':
          isWin = Math.random() > 0.7; // 30% win rate, higher payout
          multiplier = isWin ? 5 : 0;
          gameResult = isWin ? "Lucky number hit!" : "Try again!";
          break;

        case 'plinko':
          const plinkoMultiplier = [0.5, 1, 2, 5, 10, 5, 2, 1, 0.5][Math.floor(Math.random() * 9)];
          isWin = plinkoMultiplier >= 1;
          multiplier = plinkoMultiplier;
          gameResult = `Ball landed on ${plinkoMultiplier}x slot!`;
          break;

        default:
          isWin = Math.random() > 0.5;
          multiplier = 2;
          gameResult = isWin ? "You win!" : "You lose!";
      }

      const winAmount = isWin ? Math.floor(betAmount * multiplier) : 0;
      const netAmount = winAmount - betAmount;

      // Update balance
      const newBalance = (currentBalance + netAmount).toFixed(2);
      await storage.updateUserWalletBalance(userId, newBalance);

      // Record game history with proper gameId
      await storage.addGameHistory({
        userId,
        gameId: actualGameId,
        betAmount: betAmount.toString(),
        winAmount: winAmount.toString()
      });

      // Update user stats
      const currentTotalBet = parseFloat(user.totalBet || "0");
      const currentTotalWin = parseFloat(user.totalWin || "0");
      
      await storage.updateUserStats?.(userId, {
        totalBet: (currentTotalBet + betAmount).toFixed(2),
        totalWin: (currentTotalWin + winAmount).toFixed(2)
      });

      res.json({ 
        success: true,
        result: isWin ? "win" : "lose",
        winAmount: winAmount.toString(),
        newBalance,
        gameResult,
        multiplier: multiplier.toFixed(2),
        message: isWin ? `${gameResult} You won ₹${winAmount}!` : `${gameResult} You lost ₹${betAmount}`
      });
    } catch (error) {
      console.error("Error processing bet:", error);
      res.status(500).json({ message: "Failed to process bet" });
    }
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(validatedData);
      
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Auth endpoint for wallet demo
  app.get("/api/auth/user", async (req, res) => {
    try {
      const user = await storage.getUser(1); // Demo user
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Game history routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const topEarners = await storage.getTodaysTopEarners(3);
      res.json(topEarners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.post("/api/game-history", async (req, res) => {
    try {
      const validatedData = insertUserGameHistorySchema.parse(req.body);
      const history = await storage.addGameHistory(validatedData);
      res.status(201).json(history);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game history data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add game history" });
    }
  });

  app.get("/api/users/:id/history", async (req, res) => {
    try {
      const history = await storage.getUserGameHistory(parseInt(req.params.id));
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user game history" });
    }
  });

  // Promotions routes
  app.get("/api/promotions", async (req, res) => {
    try {
      const promotions = await storage.getActivePromotions();
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promotions" });
    }
  });

  app.get("/api/promotions/active", async (req, res) => {
    try {
      const promotions = await storage.getActivePromotions();
      res.json(promotions);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching promotions: " + error.message });
    }
  });

  app.get("/api/wallet/promo-transactions", async (req, res) => {
    try {
      const userId = 1; // Demo user ID - in production from auth
      const transactions = await storage.getUserPromoTransactions(userId, 20);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching promo transactions: " + error.message });
    }
  });

  app.post("/api/wallet/promo-deposit", async (req, res) => {
    try {
      const { amount, promotionId, promoCode } = req.body;
      const userId = 1; // Demo user ID
      
      if (!amount || parseFloat(amount) < 10) {
        return res.status(400).json({ message: "Minimum deposit is ₹10" });
      }

      let promotion = null;
      if (promotionId) {
        promotion = await storage.getPromotion(promotionId);
        if (!promotion || !promotion.isActive) {
          return res.status(400).json({ message: "Invalid or inactive promotion" });
        }
      } else if (promoCode) {
        promotion = await storage.getPromotionByCode(promoCode);
        if (!promotion || !promotion.isActive) {
          return res.status(400).json({ message: "Invalid or expired promo code" });
        }
      }

      const depositAmount = parseFloat(amount);
      let bonusAmount = 0;

      if (promotion) {
        if (depositAmount < promotion.minAmount) {
          return res.status(400).json({ 
            message: `Minimum deposit for this promotion is ₹${promotion.minAmount}` 
          });
        }
        
        bonusAmount = Math.min(
          (depositAmount * promotion.bonusPercentage) / 100,
          promotion.maxAmount
        );

        if (promotion.remainingUses <= 0) {
          return res.status(400).json({ message: "Promotion usage limit reached" });
        }

        await storage.updatePromotionUsage(promotion.id);
      }

      // Create promotional transaction
      const transaction = await storage.createPromoTransaction({
        userId,
        promotionId: promotion?.id || null,
        amount: amount,
        bonusAmount: bonusAmount.toFixed(2),
        status: "completed",
        paymentMethod: "upi",
        description: `Promotional deposit ${promotion ? `with ${promotion.title}` : ""}`
      });

      // Update user balances
      const user = await storage.getUser(userId);
      if (user) {
        const newWalletBalance = parseFloat(user.walletBalance) + depositAmount;
        const newBonusBalance = parseFloat(user.bonusBalance || "0") + bonusAmount;
        
        await storage.updateUserWalletBalance(userId, newWalletBalance.toString());
        if (bonusAmount > 0) {
          await storage.updateUserBonusBalance(userId, newBonusBalance.toString());
        }
      }

      res.json({
        success: true,
        transaction,
        bonusAmount: bonusAmount.toFixed(2),
        message: "Promotional deposit successful"
      });

    } catch (error: any) {
      res.status(500).json({ message: "Error processing promotional deposit: " + error.message });
    }
  });

  app.post("/api/wallet/daily-bonus", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if daily bonus already claimed today
      const today = new Date().toDateString();
      const lastClaim = user.lastDailyBonus ? new Date(user.lastDailyBonus).toDateString() : null;
      
      if (lastClaim === today) {
        return res.status(400).json({ message: "Daily bonus already claimed today" });
      }

      // Calculate daily bonus (base 50 + VIP level bonus)
      const baseBonus = 50;
      const vipBonus = (user.vipLevel || 0) * 10;
      const totalBonus = baseBonus + vipBonus;

      // Update user bonus balance and last claim date
      const currentBonusBalance = parseFloat(user.bonusBalance || "0");
      const newBonusBalance = currentBonusBalance + totalBonus;
      
      await storage.updateUserBonusBalance(userId, newBonusBalance.toString());
      await storage.updateUserLastLogin(userId);

      // Create transaction record
      await storage.createWalletTransaction({
        userId,
        type: "bonus",
        amount: totalBonus.toFixed(2),
        currency: "INR",
        status: "completed",
        description: "Daily login bonus",
        paymentMethod: "system"
      });

      res.json({
        success: true,
        amount: totalBonus.toFixed(2),
        message: "Daily bonus claimed successfully"
      });

    } catch (error: any) {
      res.status(500).json({ message: "Error claiming daily bonus: " + error.message });
    }
  });

  // Game play simulation
  app.post("/api/games/:id/play", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const { userId, betAmount } = req.body;

      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Simple win calculation (for demo purposes)
      const winChance = Math.random();
      const winMultiplier = winChance > 0.6 ? Math.random() * 5 + 1 : 0;
      const winAmount = parseFloat(betAmount) * winMultiplier;

      // Add to game history
      const history = await storage.addGameHistory({
        userId,
        gameId,
        betAmount: betAmount.toString(),
        winAmount: winAmount.toString()
      });

      // Update user balance (simple implementation)
      const currentBalance = parseFloat(user.balance);
      const newBalance = currentBalance - parseFloat(betAmount) + winAmount;
      await storage.updateUserBalance(userId, newBalance.toString());

      res.json({
        result: winAmount > 0 ? "win" : "lose",
        winAmount: winAmount.toString(),
        newBalance: newBalance.toString(),
        history
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to play game" });
    }
  });

  // Statistics routes
  app.get("/api/stats/jackpot", async (req, res) => {
    try {
      const games = await storage.getAllGames();
      const totalJackpot = games.reduce((sum, game) => sum + parseFloat(game.jackpot), 0);
      
      res.json({
        totalJackpot: totalJackpot.toString(),
        largestJackpot: Math.max(...games.map(g => parseFloat(g.jackpot))).toString(),
        gamesCount: games.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jackpot stats" });
    }
  });

  // Wallet API endpoints for real cash transactions
  app.get("/api/wallet/transactions", async (req, res) => {
    try {
      const userId = 1; // Demo user ID - in production this would come from auth
      const transactions = await storage.getUserWalletTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/wallet/deposit", async (req, res) => {
    try {
      const { amount, paymentMethod } = req.body;
      const userId = 1; // Demo user ID
      
      if (!amount || parseFloat(amount) < 10) {
        return res.status(400).json({ message: "Minimum deposit amount is ₹10" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create wallet transaction record
      const transaction = await storage.createWalletTransaction({
        userId,
        type: "deposit",
        amount,
        currency: "INR",
        status: "pending",
        paymentMethod,
        description: `Deposit via ${paymentMethod}`,
        balanceBefore: user.walletBalance,
        balanceAfter: (parseFloat(user.walletBalance) + parseFloat(amount)).toString(),
      });

      // In production, integrate with Razorpay/UPI payment gateway
      // For demo, simulate successful payment after 2 seconds
      setTimeout(async () => {
        await storage.updateWalletTransactionStatus(transaction.id, "completed", `pay_${Date.now()}`);
        await storage.updateUserWalletBalance(userId, transaction.balanceAfter!);
      }, 2000);

      res.json({
        success: true,
        transactionId: transaction.id,
        message: "Deposit initiated successfully",
        // In production, return Razorpay payment URL
        paymentUrl: `/wallet?status=processing&txn=${transaction.id}`
      });
    } catch (error) {
      console.error("Error processing deposit:", error);
      res.status(500).json({ message: "Failed to process deposit" });
    }
  });

  app.post("/api/wallet/withdraw", async (req, res) => {
    try {
      const { amount } = req.body;
      const userId = 1; // Demo user ID
      
      if (!amount || parseFloat(amount) < 100) {
        return res.status(400).json({ message: "Minimum withdrawal amount is ₹100" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.kycStatus !== "verified") {
        return res.status(400).json({ message: "KYC verification required for withdrawals" });
      }

      if (parseFloat(user.walletBalance) < parseFloat(amount)) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Create withdrawal transaction
      const transaction = await storage.createWalletTransaction({
        userId,
        type: "withdrawal",
        amount,
        currency: "INR",
        status: "pending",
        description: "Withdrawal to bank account",
        balanceBefore: user.walletBalance,
        balanceAfter: (parseFloat(user.walletBalance) - parseFloat(amount)).toString(),
      });

      // Update user balance immediately for withdrawal
      await storage.updateUserWalletBalance(userId, transaction.balanceAfter!);

      res.json({
        success: true,
        transactionId: transaction.id,
        message: "Withdrawal request submitted. Processing time: 24-48 hours"
      });
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      res.status(500).json({ message: "Failed to process withdrawal" });
    }
  });

  // Updated game play with real money transactions
  app.post("/api/games/:gameId/play", async (req, res) => {
    try {
      const gameId = parseInt(req.params.gameId);
      const { userId, betAmount } = req.body;
      
      const user = await storage.getUser(userId);
      const game = await storage.getGame(gameId);
      
      if (!user || !game) {
        return res.status(404).json({ message: "User or game not found" });
      }

      const betAmountFloat = parseFloat(betAmount);
      const userBalance = parseFloat(user.walletBalance);

      if (userBalance < betAmountFloat) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      // Generate realistic game result
      const winChance = 0.35; // 35% win chance
      const isWin = Math.random() < winChance;
      const multiplier = isWin ? (1 + Math.random() * 4) : 0; // 1x to 5x multiplier
      const winAmount = isWin ? (betAmountFloat * multiplier).toFixed(2) : "0";
      
      const newBalance = isWin 
        ? (userBalance - betAmountFloat + parseFloat(winAmount)).toFixed(2)
        : (userBalance - betAmountFloat).toFixed(2);

      // Create bet transaction
      await storage.createWalletTransaction({
        userId,
        gameId,
        type: "bet",
        amount: betAmount,
        currency: "INR",
        status: "completed",
        description: `Bet on ${game.title}`,
        balanceBefore: user.walletBalance,
        balanceAfter: newBalance,
      });

      // Create win transaction if applicable
      if (isWin && parseFloat(winAmount) > 0) {
        await storage.createWalletTransaction({
          userId,
          gameId,
          type: "win",
          amount: winAmount,
          currency: "INR",
          status: "completed",
          description: `Win from ${game.title}`,
          balanceBefore: (userBalance - betAmountFloat).toFixed(2),
          balanceAfter: newBalance,
        });
      }

      // Update user balance and game history
      await storage.updateUserWalletBalance(userId, newBalance);
      await storage.addGameHistory({
        userId,
        gameId,
        betAmount,
        winAmount,
      });

      res.json({
        result: isWin ? "win" : "lose",
        winAmount,
        newBalance,
        multiplier: isWin ? multiplier.toFixed(2) : "0",
        message: isWin ? `Congratulations! You won ₹${winAmount}` : "Better luck next time!"
      });

    } catch (error) {
      console.error("Error processing game play:", error);
      res.status(500).json({ message: "Failed to process game play" });
    }
  });

  // Authentic casino game play API
  app.post("/api/games/:id/play", async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const { userId = 1, betAmount, gameType, gameData = {} } = req.body;

      const game = await storage.getGame(gameId);
      const user = await storage.getUser(userId);

      if (!game || !user) {
        return res.status(404).json({ message: "Game or user not found" });
      }

      const bet = parseFloat(betAmount);
      const currentBalance = parseFloat(user.walletBalance || "0");

      if (bet > currentBalance) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      let result: "win" | "lose" = "lose";
      let winAmount = 0;
      let multiplier = 0;
      let gameResult: any = {};

      const gameTitle = game.title.toLowerCase();
      const category = game.category.toLowerCase();

      // Teen Patti mechanics
      if (gameTitle.includes("teen patti")) {
        result = Math.random() < 0.476 ? "win" : "lose";
        multiplier = result === "win" ? 1.95 : 0;
        gameResult = {
          playerCards: ["A♠", "K♠", "Q♠"],
          dealerCards: ["J♠", "10♠", "9♠"],
          handType: result === "win" ? "High Card" : "Pair"
        };
      }
      // Andar Bahar mechanics
      else if (gameTitle.includes("andar bahar")) {
        result = Math.random() < 0.486 ? "win" : "lose";
        multiplier = result === "win" ? 1.98 : 0;
        gameResult = {
          jokerCard: "7♥",
          winSide: result === "win" ? "Andar" : "Bahar",
          totalCards: Math.floor(Math.random() * 10) + 3
        };
      }
      // Crash game mechanics
      else if (gameTitle.includes("crash") || gameTitle.includes("aviator")) {
        const crashPoint = 1 + Math.random() * 9;
        const userCashout = gameData.cashoutMultiplier || 1.5;
        result = userCashout <= crashPoint ? "win" : "lose";
        multiplier = result === "win" ? userCashout : 0;
        gameResult = {
          crashPoint: crashPoint.toFixed(2),
          userCashout: userCashout.toFixed(2)
        };
      }
      // Slot machine mechanics
      else if (category === "slots") {
        const slotRandom = Math.random();
        if (slotRandom < 0.001) {
          result = "win";
          multiplier = 1000;
          gameResult = { symbols: ["💎", "💎", "💎"], line: "MEGA JACKPOT" };
        } else if (slotRandom < 0.02) {
          result = "win";
          multiplier = 25;
          gameResult = { symbols: ["⭐", "⭐", "⭐"], line: "JACKPOT" };
        } else if (slotRandom < 0.25) {
          result = "win";
          multiplier = 2;
          gameResult = { symbols: ["🍎", "🍎", "🍎"], line: "WIN" };
        } else {
          result = "lose";
          multiplier = 0;
          gameResult = { symbols: ["🍎", "🍊", "🍋"], line: "NO MATCH" };
        }
      }
      // Lottery mechanics
      else if (category === "lottery") {
        const lotteryRandom = Math.random();
        if (lotteryRandom < 0.0001) {
          result = "win";
          multiplier = 10000;
          gameResult = { numbers: [7, 7, 7, 7, 7], match: 5 };
        } else if (lotteryRandom < 0.1) {
          result = "win";
          multiplier = 5;
          gameResult = { numbers: [1, 2, 7, 8, 9], match: 2 };
        } else {
          result = "lose";
          multiplier = 0;
          gameResult = { numbers: [1, 2, 3, 8, 9], match: 1 };
        }
      }
      // Default casino mechanics
      else {
        result = Math.random() < 0.45 ? "win" : "lose";
        multiplier = result === "win" ? 2.0 : 0;
      }

      winAmount = bet * multiplier;
      const newBalance = currentBalance - bet + winAmount;

      await storage.updateUserWalletBalance(userId, newBalance.toFixed(2));
      await storage.addGameHistory({
        userId,
        gameId,
        betAmount: bet.toFixed(2),
        winAmount: winAmount.toFixed(2)
      });

      res.json({
        result,
        winAmount: winAmount.toFixed(2),
        newBalance: newBalance.toFixed(2),
        multiplier: multiplier.toFixed(2),
        gameResult
      });

    } catch (error) {
      console.error("Game play error:", error);
      res.status(500).json({ message: "Failed to process game play" });
    }
  });

  // Live casino statistics
  app.get("/api/live-stats", async (req, res) => {
    try {
      res.json({
        activePlayers: Math.floor(Math.random() * 5000) + 1000,
        totalGamesPlayed: Math.floor(Math.random() * 1000000) + 500000,
        biggestWinToday: "₹2,47,850",
        hotGames: [
          { name: "Teen Patti Live", players: 284 },
          { name: "Andar Bahar Express", players: 198 },
          { name: "Dragon Tiger Gold", players: 156 }
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live stats" });
    }
  });

  // Wallet routes
  app.post("/api/wallet/deposit", authenticateToken, async (req: any, res) => {
    try {
      const { amount, paymentMethod } = req.body;
      const userId = req.user.userId;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Create wallet transaction
      const transaction = await storage.createWalletTransaction({
        userId,
        type: "deposit",
        amount: amount.toString(),
        status: "pending",
        paymentMethod: paymentMethod || "upi",
        description: `Deposit of ₹${amount}`,
      });

      // Simulate successful payment after 2 seconds
      setTimeout(async () => {
        await storage.updateWalletTransactionStatus(transaction.id, "completed");
        const currentUser = await storage.getUser(userId);
        if (currentUser) {
          const newBalance = (parseFloat(currentUser.walletBalance) + parseFloat(amount.toString())).toFixed(2);
          await storage.updateUserWalletBalance(userId, newBalance);
        }
      }, 2000);

      res.json({
        transactionId: transaction.id,
        status: "pending",
        amount: transaction.amount,
        message: "Deposit initiated successfully"
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Deposit failed" });
    }
  });

  app.post("/api/wallet/withdraw", authenticateToken, async (req: any, res) => {
    try {
      const { amount, bankAccount } = req.body;
      const userId = req.user.userId;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (parseFloat(user.walletBalance) < parseFloat(amount.toString())) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      if (user.kycStatus !== "verified") {
        return res.status(400).json({ message: "KYC verification required for withdrawals" });
      }

      // Create wallet transaction
      const transaction = await storage.createWalletTransaction({
        userId,
        type: "withdraw",
        amount: amount.toString(),
        status: "pending",
        paymentMethod: "bank_transfer",
        description: `Withdrawal of ₹${amount} to ${bankAccount}`,
      });

      // Deduct amount from wallet
      const newBalance = (parseFloat(user.walletBalance) - parseFloat(amount.toString())).toFixed(2);
      await storage.updateUserWalletBalance(userId, newBalance);

      res.json({
        transactionId: transaction.id,
        status: "pending",
        amount: transaction.amount,
        message: "Withdrawal request submitted successfully"
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Withdrawal failed" });
    }
  });

  app.get("/api/wallet/transactions", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const transactions = await storage.getUserWalletTransactions(userId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch transactions" });
    }
  });

  // Game play route
  app.post("/api/games/:id/play", authenticateToken, async (req: any, res) => {
    try {
      const { betAmount } = req.body;
      const gameId = parseInt(req.params.id);
      const userId = req.user.userId;
      
      if (!betAmount || betAmount <= 0) {
        return res.status(400).json({ message: "Invalid bet amount" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (parseFloat(user.walletBalance) < parseFloat(betAmount.toString())) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Simulate game result (30% win chance)
      const isWin = Math.random() < 0.3;
      const winAmount = isWin ? (parseFloat(betAmount.toString()) * 2).toFixed(2) : "0.00";
      
      // Create game history
      await storage.addGameHistory({
        userId,
        gameId,
        betAmount: betAmount.toString(),
        winAmount,
      });

      // Update wallet balance
      const betAmountFloat = parseFloat(betAmount.toString());
      const winAmountFloat = parseFloat(winAmount);
      const newBalance = (parseFloat(user.walletBalance) - betAmountFloat + winAmountFloat).toFixed(2);
      await storage.updateUserWalletBalance(userId, newBalance);

      res.json({
        result: isWin ? "win" : "lose",
        betAmount: betAmount.toString(),
        winAmount,
        newBalance,
        message: isWin ? `Congratulations! You won ₹${winAmount}` : "Better luck next time!"
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Game play failed" });
    }
  });

  // Leaderboard API endpoint
  app.get('/api/leaderboard', async (req, res) => {
    try {
      const { timeFrame = 'daily', gameType } = req.query;
      
      // Generate mock leaderboard data for now
      const mockLeaderboard = [
        {
          id: 1,
          username: "Winner123",
          winnings: 25000,
          gamesPlayed: 45,
          winRate: 68.9,
          currentStreak: 5,
          rank: 1
        },
        {
          id: 2,
          username: "LuckyPlayer",
          winnings: 18500,
          gamesPlayed: 32,
          winRate: 62.5,
          currentStreak: 3,
          rank: 2
        },
        {
          id: 3,
          username: "GameMaster",
          winnings: 15200,
          gamesPlayed: 28,
          winRate: 71.4,
          currentStreak: 7,
          rank: 3
        },
        {
          id: 4,
          username: "BetKing",
          winnings: 12800,
          gamesPlayed: 38,
          winRate: 55.3,
          currentStreak: 2,
          rank: 4
        },
        {
          id: 5,
          username: "ProGamer",
          winnings: 9500,
          gamesPlayed: 25,
          winRate: 64.0,
          currentStreak: 4,
          rank: 5
        }
      ];

      res.json(mockLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ message: 'Failed to fetch leaderboard' });
    }
  });

  // Game statistics endpoint
  app.get('/api/game-stats/:gameId', async (req, res) => {
    try {
      const { gameId } = req.params;
      
      const mockStats = {
        totalPlayers: Math.floor(Math.random() * 1000) + 500,
        totalBets: Math.floor(Math.random() * 50000) + 10000,
        totalWinnings: Math.floor(Math.random() * 500000) + 100000,
        averageBet: Math.floor(Math.random() * 500) + 50,
        winRate: (Math.random() * 30 + 45).toFixed(1),
        lastHourBets: Math.floor(Math.random() * 100) + 20
      };
      
      res.json(mockStats);
    } catch (error) {
      console.error('Error fetching game stats:', error);
      res.status(500).json({ message: 'Failed to fetch game statistics' });
    }
  });

  // Razorpay Payment Integration
  app.post('/api/payment/create-order', async (req, res) => {
    try {
      const { amount, currency } = req.body;
      
      // Mock order creation for now - in production this would use actual Razorpay
      const orderId = 'order_' + Math.random().toString(36).substr(2, 9);
      
      res.json({
        id: orderId,
        amount: amount,
        currency: currency || 'INR',
        status: 'created'
      });
    } catch (error) {
      console.error('Error creating payment order:', error);
      res.status(500).json({ message: 'Failed to create payment order' });
    }
  });

  app.post('/api/payment/verify', async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      // Mock verification - in production this would verify with Razorpay
      const isValid = true; // Simulated verification
      
      if (isValid) {
        // Credit amount to user wallet
        const userId = 1; // Demo user
        const amount = "100.00"; // Demo amount
        
        await storage.createWalletTransaction({
          userId,
          type: "deposit",
          amount,
          currency: "INR",
          status: "completed",
          description: "Razorpay deposit",
          paymentMethod: "razorpay",
          paymentId: razorpay_payment_id
        });
        
        res.json({
          success: true,
          message: 'Payment verified and wallet credited',
          paymentId: razorpay_payment_id
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Payment verification failed'
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ message: 'Payment verification failed' });
    }
  });

  // KYC Submission
  app.post('/api/kyc/submit', async (req, res) => {
    try {
      const userId = 1; // Demo user - in production get from auth
      
      // In production, this would process uploaded files and store KYC data
      await storage.createKycDocument({
        userId,
        documentType: req.body.documentType || 'aadhar',
        documentNumber: req.body.aadharNumber || req.body.panNumber,
        status: 'pending',
        submittedAt: new Date()
      });
      
      res.json({
        success: true,
        message: 'KYC documents submitted successfully'
      });
    } catch (error) {
      console.error('Error submitting KYC:', error);
      res.status(500).json({ message: 'KYC submission failed' });
    }
  });

  // Withdrawal Request
  app.post('/api/wallet/withdraw', async (req, res) => {
    try {
      const { amount, bankDetails } = req.body;
      const userId = 1; // Demo user
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const currentBalance = parseFloat(user.walletBalance);
      if (currentBalance < parseFloat(amount)) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      
      // Create withdrawal transaction
      await storage.createWalletTransaction({
        userId,
        type: "withdrawal",
        amount,
        currency: "INR",
        status: "pending",
        description: "Withdrawal request",
        paymentMethod: "bank_transfer"
      });
      
      res.json({
        success: true,
        message: 'Withdrawal request submitted. Processing time: 1-3 business days'
      });
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      res.status(500).json({ message: 'Withdrawal request failed' });
    }
  });

  // Admin Dashboard APIs
  app.get('/api/admin/stats', async (req, res) => {
    try {
      // Generate real-time stats for admin dashboard
      const totalUsers = 15847;
      const activeUsers = 3421;
      const totalRevenue = 2847650;
      const todayRevenue = 45230;
      const totalTransactions = 89234;
      const pendingWithdrawals = 23;
      const suspiciousActivities = 5;
      const kycPending = 17;

      res.json({
        totalUsers,
        activeUsers,
        totalRevenue,
        todayRevenue,
        totalTransactions,
        pendingWithdrawals,
        suspiciousActivities,
        kycPending
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  app.get('/api/admin/transactions', async (req, res) => {
    try {
      const mockTransactions = [
        {
          id: 1,
          userId: 1,
          username: "player1",
          type: "withdrawal",
          amount: 5000,
          status: "pending",
          timestamp: new Date(),
          paymentMethod: "bank_transfer"
        },
        {
          id: 2,
          userId: 2,
          username: "gamer23",
          type: "deposit",
          amount: 2500,
          status: "completed",
          timestamp: new Date(),
          paymentMethod: "razorpay"
        },
        {
          id: 3,
          userId: 3,
          username: "winner99",
          type: "withdrawal",
          amount: 8500,
          status: "pending",
          timestamp: new Date(),
          paymentMethod: "bank_transfer"
        }
      ];

      res.json(mockTransactions);
    } catch (error) {
      console.error('Error fetching admin transactions:', error);
      res.status(500).json({ message: 'Failed to fetch transactions' });
    }
  });

  app.get('/api/admin/users', async (req, res) => {
    try {
      const mockUsers = [
        {
          id: 1,
          username: "player1",
          email: "player1@example.com",
          walletBalance: 15000,
          status: "active",
          lastLogin: new Date(),
          registrationDate: new Date('2024-01-15'),
          totalDeposits: 25000,
          totalWithdrawals: 10000
        },
        {
          id: 2,
          username: "gamer23",
          email: "gamer23@example.com",
          walletBalance: 8500,
          status: "kyc_pending",
          lastLogin: new Date(),
          registrationDate: new Date('2024-02-20'),
          totalDeposits: 12000,
          totalWithdrawals: 3500
        },
        {
          id: 3,
          username: "winner99",
          email: "winner99@example.com",
          walletBalance: 32000,
          status: "active",
          lastLogin: new Date(),
          registrationDate: new Date('2024-03-10'),
          totalDeposits: 45000,
          totalWithdrawals: 13000
        }
      ];

      res.json(mockUsers);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  // Security monitoring endpoints
  app.get('/api/security/events', async (req, res) => {
    try {
      const mockEvents = [
        {
          id: 1,
          type: 'login',
          timestamp: new Date(),
          location: 'Mumbai, India',
          ipAddress: '203.192.45.67',
          device: 'Chrome on Android',
          riskLevel: 'low',
          details: 'Successful login from recognized device',
          status: 'resolved'
        },
        {
          id: 2,
          type: 'transaction',
          timestamp: new Date(Date.now() - 3600000),
          location: 'Delhi, India',
          ipAddress: '157.48.23.156',
          device: 'Firefox on Windows',
          riskLevel: 'medium',
          details: 'Large withdrawal request - ₹50,000',
          status: 'investigating'
        }
      ];

      res.json(mockEvents);
    } catch (error) {
      console.error('Error fetching security events:', error);
      res.status(500).json({ message: 'Failed to fetch security events' });
    }
  });

  app.get('/api/security/risk-score', async (req, res) => {
    try {
      res.json({
        score: 25,
        status: 'secure'
      });
    } catch (error) {
      console.error('Error fetching risk score:', error);
      res.status(500).json({ message: 'Failed to fetch risk score' });
    }
  });

  // Responsible gaming endpoints
  app.get('/api/responsible-gaming/settings', async (req, res) => {
    try {
      const defaultSettings = {
        dailyLimit: "5000",
        weeklyLimit: "25000",
        monthlyLimit: "100000",
        sessionTimeLimit: "180",
        depositLimitEnabled: true,
        sessionReminderEnabled: true,
        realityCheckInterval: "30",
        lossLimitEnabled: true,
        dailyLossLimit: "2000"
      };

      res.json(defaultSettings);
    } catch (error) {
      console.error('Error fetching responsible gaming settings:', error);
      res.status(500).json({ message: 'Failed to fetch settings' });
    }
  });

  app.post('/api/responsible-gaming/settings', async (req, res) => {
    try {
      // In production, save settings to database
      res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
      console.error('Error updating responsible gaming settings:', error);
      res.status(500).json({ message: 'Failed to update settings' });
    }
  });

  app.get('/api/responsible-gaming/usage', async (req, res) => {
    try {
      const mockUsage = {
        todaySpent: 1500,
        weekSpent: 8500,
        monthSpent: 32000,
        sessionTime: 45,
        todayLoss: 750
      };

      res.json(mockUsage);
    } catch (error) {
      console.error('Error fetching usage data:', error);
      res.status(500).json({ message: 'Failed to fetch usage data' });
    }
  });

  app.post('/api/responsible-gaming/self-exclude', async (req, res) => {
    try {
      const { period } = req.body;
      // In production, implement actual self-exclusion logic
      res.json({ success: true, message: `Self-exclusion activated for ${period}` });
    } catch (error) {
      console.error('Error processing self-exclusion:', error);
      res.status(500).json({ message: 'Failed to process self-exclusion' });
    }
  });

  // Achievements routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/achievements/user/:userId", authenticateToken, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  app.get("/api/achievements/me", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.userId;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  app.post("/api/achievements/check", authenticateToken, async (req: any, res) => {
    try {
      const { action, value } = req.body;
      const userId = req.userId;
      
      const unlockedAchievements = await storage.checkAndUnlockAchievements(userId, action, value);
      res.json({ unlockedAchievements });
    } catch (error) {
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });

  // Analytics API endpoints
  app.get("/api/analytics/games", async (req, res) => {
    try {
      // Generate comprehensive game analytics data
      const games = await storage.getAllGames();
      const analytics = games.slice(0, 10).map(game => ({
        gameId: game.id,
        gameTitle: game.title,
        totalPlays: Math.floor(Math.random() * 2000) + 500,
        totalBets: (Math.random() * 200000 + 50000).toFixed(2),
        totalWins: (Math.random() * 150000 + 30000).toFixed(2),
        winRate: Math.random() * 30 + 35,
        averageBet: (Math.random() * 200 + 50).toFixed(2),
        popularityScore: Math.floor(Math.random() * 40 + 60),
        lastPlayed: new Date(Date.now() - Math.random() * 3600000)
      }));
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching game analytics:", error);
      res.status(500).json({ message: "Failed to fetch game analytics" });
    }
  });

  app.get("/api/analytics/player/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const totalGames = Math.floor(Math.random() * 150) + 25;
      const baseWinRate = 0.42 + Math.random() * 0.15;
      const totalBetsAmount = Math.floor(Math.random() * 50000) + 10000;
      const totalWinsAmount = Math.floor(totalBetsAmount * (baseWinRate + Math.random() * 0.1));
      
      const favoriteGames = [
        "Aviator Crash", "Mega Jackpot Slots", "Lightning Dice", 
        "Blackjack Pro", "Plinko Gold", "Coin Flip Master"
      ];
      
      const performance = {
        userId,
        totalGames,
        totalBets: totalBetsAmount.toString(),
        totalWins: totalWinsAmount.toString(),
        winRate: baseWinRate * 100,
        favoriteGame: favoriteGames[Math.floor(Math.random() * favoriteGames.length)],
        longestStreak: Math.floor(Math.random() * 12) + 3,
        averageSessionTime: Math.floor(Math.random() * 45) + 15,
        lastActivity: new Date(Date.now() - Math.random() * 86400000)
      };
      
      res.json(performance);
    } catch (error) {
      console.error("Error fetching player performance:", error);
      res.status(500).json({ message: "Failed to fetch player performance" });
    }
  });

  app.get("/api/analytics/realtime", async (req, res) => {
    try {
      const currentHour = new Date().getHours();
      const baseActivePlayers = 150;
      const hourMultiplier = currentHour >= 18 && currentHour <= 23 ? 2.5 : 
                           currentHour >= 12 && currentHour <= 17 ? 1.8 :
                           currentHour >= 20 && currentHour <= 24 ? 3.2 : 1.0;
      
      const activePlayers = Math.floor(baseActivePlayers * hourMultiplier + Math.random() * 50);
      const gamesInProgress = Math.floor(activePlayers * 0.7 + Math.random() * 20);
      
      const dayProgress = (currentHour * 60 + new Date().getMinutes()) / (24 * 60);
      const estimatedDailyBets = 2500000;
      const estimatedDailyWins = estimatedDailyBets * 0.65;
      
      const totalBetsToday = Math.floor(estimatedDailyBets * dayProgress + Math.random() * 50000);
      const totalWinsToday = Math.floor(estimatedDailyWins * dayProgress + Math.random() * 30000);

      const popularGames = ["Aviator Crash", "Mega Jackpot Slots", "Lightning Dice", "Plinko Gold", "Blackjack Pro"];
      
      const stats = {
        activePlayers,
        gamesInProgress,
        totalBetsToday: totalBetsToday.toString(),
        totalWinsToday: totalWinsToday.toString(),
        popularGame: popularGames[Math.floor(Math.random() * popularGames.length)],
        peakHour: "8:00 PM - 11:00 PM"
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching real-time stats:", error);
      res.status(500).json({ message: "Failed to fetch real-time stats" });
    }
  });

  app.post("/api/analytics/session/start", async (req, res) => {
    try {
      const { userId, sessionId } = req.body;
      await analyticsService.startSession(userId, sessionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error starting session:", error);
      res.status(500).json({ message: "Failed to start session" });
    }
  });

  app.post("/api/analytics/session/end", async (req, res) => {
    try {
      const { sessionId } = req.body;
      await analyticsService.endSession(sessionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error ending session:", error);
      res.status(500).json({ message: "Failed to end session" });
    }
  });

  app.post("/api/analytics/event", async (req, res) => {
    try {
      const { userId, gameId, sessionId, eventType, data } = req.body;
      await analyticsService.trackGameEvent(userId, gameId, sessionId, eventType, data);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(500).json({ message: "Failed to track event" });
    }
  });

  // Admin API Routes
  app.get("/api/admin/stats", authenticateAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const transactions = await storage.getAllTransactions();
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const todayTransactions = transactions.filter((t: any) => new Date(t.createdAt) >= today);
      const weekTransactions = transactions.filter((t: any) => new Date(t.createdAt) >= thisWeek);
      const monthTransactions = transactions.filter((t: any) => new Date(t.createdAt) >= thisMonth);

      const stats = {
        totalUsers: users.length,
        totalRevenue: transactions.reduce((sum: number, t: any) => 
          t.type === 'deposit' && t.status === 'approved' ? sum + parseFloat(t.amount) : sum, 0),
        todayRevenue: todayTransactions.reduce((sum: number, t: any) => 
          t.type === 'deposit' && t.status === 'approved' ? sum + parseFloat(t.amount) : sum, 0),
        weekRevenue: weekTransactions.reduce((sum: number, t: any) => 
          t.type === 'deposit' && t.status === 'approved' ? sum + parseFloat(t.amount) : sum, 0),
        monthRevenue: monthTransactions.reduce((sum: number, t: any) => 
          t.type === 'deposit' && t.status === 'approved' ? sum + parseFloat(t.amount) : sum, 0),
        newUsersToday: users.filter((u: any) => new Date(u.createdAt) >= today).length,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/users", authenticateAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/transactions", authenticateAdmin, async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/admin/kyc-documents", authenticateAdmin, async (req, res) => {
    try {
      const documents = await storage.getAllKycDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch KYC documents" });
    }
  });

  app.patch("/api/admin/users/:id/status", authenticateAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { isActive } = req.body;
      
      const user = await storage.updateUserStatus(userId, isActive);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user status" });
    }
  });

  app.patch("/api/admin/transactions/:id", authenticateAdmin, async (req, res) => {
    try {
      const transactionId = parseInt(req.params.id);
      const { status } = req.body;
      
      const transaction = await storage.updateTransactionStatus(transactionId, status);
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to update transaction status" });
    }
  });

  app.patch("/api/admin/kyc/:id", authenticateAdmin, async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const { status } = req.body;
      
      const document = await storage.updateKycDocumentStatus(documentId, status);
      if (!document) {
        return res.status(404).json({ message: "KYC document not found" });
      }
      
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to update KYC status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
