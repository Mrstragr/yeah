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

  const httpServer = createServer(app);
  return httpServer;
}
