import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertGameSchema, insertGameCategorySchema, insertUserGameHistorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
