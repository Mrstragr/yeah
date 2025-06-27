import {
  users,
  games,
  gameCategories,
  userGameHistory,
  walletTransactions,
  kycDocuments,
  promotions,
  achievements,
  userAchievements,
  gameAnalytics,
  playerSessions,
  gameEvents,
  type User,
  type InsertUser,
  type Game,
  type InsertGame,
  type GameCategory,
  type InsertGameCategory,
  type UserGameHistory,
  type InsertUserGameHistory,
  type Promotion,
  type InsertPromotion,
  type WalletTransaction,
  type InsertWalletTransaction,
  type KycDocument,
  type InsertKycDocument,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
} from "@shared/schema";
import { tashanwinGames } from "./tashanwin-games";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq, and, gte, lte, desc, sql, like } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, newBalance: string): Promise<User | undefined>;
  updateUserWalletBalance(userId: number, newBalance: string): Promise<User | undefined>;
  updateUserLastLogin(userId: number): Promise<User | undefined>;

  // Game methods
  getAllGames(): Promise<Game[]>;
  getGamesByCategory(category: string): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  getRecommendedGames(limit?: number): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;

  // Game category methods
  getAllGameCategories(): Promise<GameCategory[]>;
  getGameCategory(slug: string): Promise<GameCategory | undefined>;
  createGameCategory(category: InsertGameCategory): Promise<GameCategory>;

  // User game history methods
  getUserGameHistory(userId: number): Promise<UserGameHistory[]>;
  getTodaysTopEarners(limit?: number): Promise<(UserGameHistory & { username: string, gameTitle: string })[]>;
  addGameHistory(history: InsertUserGameHistory): Promise<UserGameHistory>;

  // Promotion methods
  getActivePromotions(): Promise<Promotion[]>;
  getPromotion(id: number): Promise<Promotion | undefined>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;

  // Wallet methods
  getUserWalletTransactions(userId: number, limit?: number): Promise<WalletTransaction[]>;
  createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction>;
  updateWalletTransactionStatus(transactionId: number, status: string, paymentId?: string): Promise<WalletTransaction | undefined>;
  
  // KYC methods
  getUserKycDocuments(userId: number): Promise<KycDocument[]>;
  createKycDocument(document: InsertKycDocument): Promise<KycDocument>;
  updateKycStatus(userId: number, status: string): Promise<User | undefined>;

  // Bonus balance methods
  updateUserBonusBalance(userId: number, newBalance: string): Promise<User | undefined>;

  // Achievement methods
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement>;
  updateAchievementProgress(userId: number, achievementId: number, progress: number): Promise<UserAchievement | undefined>;
  checkAndUnlockAchievements(userId: number, action: string, value?: any): Promise<UserAchievement[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.phone, phone));
      return user;
    } catch (error) {
      console.error('Error getting user by phone:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(insertUser.password, 10);
      const [user] = await db.insert(users).values({
        ...insertUser,
        password: hashedPassword,
        referralCode: insertUser.referralCode || this.generateReferralCode(),
      }).returning();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  private generateReferralCode(): string {
    return 'P91' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async updateUserBalance(userId: number, newBalance: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({ balance: newBalance, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      return user;
    } catch (error) {
      console.error('Error updating user balance:', error);
      return undefined;
    }
  }

  async updateUserWalletBalance(userId: number, newBalance: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({ walletBalance: newBalance, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      return user;
    } catch (error) {
      console.error('Error updating user wallet balance:', error);
      return undefined;
    }
  }

  async updateUserLastLogin(userId: number): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({ lastLoginAt: new Date(), updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      return user;
    } catch (error) {
      console.error('Error updating user last login:', error);
      return undefined;
    }
  }

  async getAllGames(): Promise<Game[]> {
    try {
      return await db.select().from(games).where(eq(games.isActive, true));
    } catch (error) {
      console.error('Error getting all games:', error);
      return [];
    }
  }

  async getGamesByCategory(category: string): Promise<Game[]> {
    try {
      return await db.select().from(games).where(
        and(eq(games.isActive, true), eq(games.category, category))
      );
    } catch (error) {
      console.error('Error getting games by category:', error);
      return [];
    }
  }

  async getGame(id: number): Promise<Game | undefined> {
    try {
      const [game] = await db.select().from(games).where(eq(games.id, id));
      return game;
    } catch (error) {
      console.error('Error getting game:', error);
      return undefined;
    }
  }

  async getRecommendedGames(limit: number = 4): Promise<Game[]> {
    try {
      return await db.select().from(games).where(eq(games.isActive, true)).limit(limit);
    } catch (error) {
      console.error('Error getting recommended games:', error);
      return [];
    }
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    try {
      const [game] = await db.insert(games).values(insertGame).returning();
      return game;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  async getAllGameCategories(): Promise<GameCategory[]> {
    try {
      return await db.select().from(gameCategories).where(eq(gameCategories.isActive, true));
    } catch (error) {
      console.error('Error getting game categories:', error);
      return [];
    }
  }

  async getGameCategory(slug: string): Promise<GameCategory | undefined> {
    try {
      const [category] = await db.select().from(gameCategories).where(eq(gameCategories.slug, slug));
      return category;
    } catch (error) {
      console.error('Error getting game category:', error);
      return undefined;
    }
  }

  async createGameCategory(insertCategory: InsertGameCategory): Promise<GameCategory> {
    try {
      const [category] = await db.insert(gameCategories).values(insertCategory).returning();
      return category;
    } catch (error) {
      console.error('Error creating game category:', error);
      throw error;
    }
  }

  async getUserGameHistory(userId: number): Promise<UserGameHistory[]> {
    try {
      return await db.select().from(userGameHistory)
        .where(eq(userGameHistory.userId, userId))
        .orderBy(desc(userGameHistory.playedAt));
    } catch (error) {
      console.error('Error getting user game history:', error);
      return [];
    }
  }

  async getTodaysTopEarners(limit: number = 3): Promise<(UserGameHistory & { username: string, gameTitle: string })[]> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const results = await db
        .select({
          id: userGameHistory.id,
          userId: userGameHistory.userId,
          gameId: userGameHistory.gameId,
          betAmount: userGameHistory.betAmount,
          winAmount: userGameHistory.winAmount,
          playedAt: userGameHistory.playedAt,
          username: users.username,
          gameTitle: games.title,
        })
        .from(userGameHistory)
        .innerJoin(users, eq(userGameHistory.userId, users.id))
        .innerJoin(games, eq(userGameHistory.gameId, games.id))
        .where(gte(userGameHistory.playedAt, today))
        .orderBy(desc(userGameHistory.winAmount))
        .limit(limit);

      return results;
    } catch (error) {
      console.error('Error getting top earners:', error);
      return [];
    }
  }

  async addGameHistory(history: InsertUserGameHistory): Promise<UserGameHistory> {
    try {
      const [gameHistory] = await db.insert(userGameHistory).values(history).returning();
      return gameHistory;
    } catch (error) {
      console.error('Error adding game history:', error);
      throw error;
    }
  }

  async getActivePromotions(): Promise<Promotion[]> {
    try {
      const now = new Date();
      return await db.select().from(promotions).where(
        and(
          eq(promotions.isActive, true),
          lte(promotions.startDate, now),
          gte(promotions.endDate, now)
        )
      );
    } catch (error) {
      console.error('Error getting active promotions:', error);
      return [];
    }
  }

  async getPromotion(id: number): Promise<Promotion | undefined> {
    try {
      const [promotion] = await db.select().from(promotions).where(eq(promotions.id, id));
      return promotion;
    } catch (error) {
      console.error('Error getting promotion:', error);
      return undefined;
    }
  }

  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    try {
      const [promotion] = await db.insert(promotions).values(insertPromotion).returning();
      return promotion;
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  }

  async getUserWalletTransactions(userId: number, limit: number = 10): Promise<WalletTransaction[]> {
    try {
      return await db.select().from(walletTransactions)
        .where(eq(walletTransactions.userId, userId))
        .orderBy(desc(walletTransactions.createdAt))
        .limit(limit);
    } catch (error) {
      console.error('Error getting wallet transactions:', error);
      return [];
    }
  }

  async createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction> {
    try {
      const [walletTransaction] = await db.insert(walletTransactions).values(transaction).returning();
      return walletTransaction;
    } catch (error) {
      console.error('Error creating wallet transaction:', error);
      throw error;
    }
  }

  async updateWalletTransactionStatus(transactionId: number, status: string, paymentId?: string): Promise<WalletTransaction | undefined> {
    try {
      const updateData: any = { status, updatedAt: new Date() };
      if (paymentId) updateData.razorpayPaymentId = paymentId;
      
      const [transaction] = await db
        .update(walletTransactions)
        .set(updateData)
        .where(eq(walletTransactions.id, transactionId))
        .returning();
      return transaction;
    } catch (error) {
      console.error('Error updating wallet transaction status:', error);
      return undefined;
    }
  }

  async getUserKycDocuments(userId: number): Promise<KycDocument[]> {
    try {
      return await db.select().from(kycDocuments)
        .where(eq(kycDocuments.userId, userId))
        .orderBy(desc(kycDocuments.createdAt));
    } catch (error) {
      console.error('Error getting KYC documents:', error);
      return [];
    }
  }

  async createKycDocument(document: InsertKycDocument): Promise<KycDocument> {
    try {
      const [kycDoc] = await db.insert(kycDocuments).values(document).returning();
      return kycDoc;
    } catch (error) {
      console.error('Error creating KYC document:', error);
      throw error;
    }
  }

  async updateKycStatus(userId: number, status: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({ kycStatus: status, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      return user;
    } catch (error) {
      console.error('Error updating KYC status:', error);
      return undefined;
    }
  }

  async updateUserBonusBalance(userId: number, newBalance: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({ bonusBalance: newBalance, updatedAt: new Date() })
        .where(eq(users.id, userId))
        .returning();
      return user;
    } catch (error) {
      console.error('Error updating user bonus balance:', error);
      return undefined;
    }
  }

  async getAllAchievements(): Promise<Achievement[]> {
    try {
      return await db.select().from(achievements).where(eq(achievements.isActive, true));
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }

  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
    try {
      const results = await db
        .select()
        .from(userAchievements)
        .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
        .where(eq(userAchievements.userId, userId));
      
      return results.map(result => ({
        ...result.user_achievements,
        achievement: result.achievements
      }));
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    try {
      const [newAchievement] = await db.insert(achievements).values(achievement).returning();
      return newAchievement;
    } catch (error) {
      console.error('Error creating achievement:', error);
      throw error;
    }
  }

  async unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    try {
      const [userAchievement] = await db.insert(userAchievements).values({
        userId,
        achievementId,
        isCompleted: true,
        progress: 100
      }).returning();
      return userAchievement;
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  }

  async updateAchievementProgress(userId: number, achievementId: number, progress: number): Promise<UserAchievement | undefined> {
    try {
      const [userAchievement] = await db
        .update(userAchievements)
        .set({ progress, isCompleted: progress >= 100 })
        .where(and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId)
        ))
        .returning();
      return userAchievement;
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      return undefined;
    }
  }

  async checkAndUnlockAchievements(userId: number, action: string, value?: any): Promise<UserAchievement[]> {
    // Implementation for achievement checking logic
    return [];
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private gameCategories: Map<number, GameCategory>;
  private userGameHistory: Map<number, UserGameHistory>;
  private promotions: Map<number, Promotion>;
  private walletTransactions: Map<number, WalletTransaction>;
  private kycDocuments: Map<number, KycDocument>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  private currentUserId: number;
  private currentGameId: number;
  private currentCategoryId: number;
  private currentHistoryId: number;
  private currentPromotionId: number;
  private currentTransactionId: number;
  private currentKycDocumentId: number;
  private currentAchievementId: number;
  private currentUserAchievementId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.gameCategories = new Map();
    this.userGameHistory = new Map();
    this.promotions = new Map();
    this.walletTransactions = new Map();
    this.kycDocuments = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.currentUserId = 1;
    this.currentGameId = 1;
    this.currentCategoryId = 1;
    this.currentHistoryId = 1;
    this.currentPromotionId = 1;
    this.currentTransactionId = 1;
    this.currentKycDocumentId = 1;
    this.currentAchievementId = 1;
    this.currentUserAchievementId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories with TashanWin structure
    const categories: InsertGameCategory[] = [
      { name: "Lobby", slug: "lobby", description: "Main Hub", icon: "fas fa-home", color: "from-gaming-gold to-gaming-amber" },
      { name: "Lottery", slug: "lottery", description: "Lucky Numbers", icon: "fas fa-ticket-alt", color: "from-emerald-500 to-green-600" },
      { name: "Popular", slug: "popular", description: "Trending", icon: "fas fa-fire", color: "from-red-500 to-pink-600" },
      { name: "Mini Games", slug: "minigames", description: "Quick Play", icon: "fas fa-puzzle-piece", color: "from-purple-500 to-indigo-600" },
      { name: "Casino", slug: "casino", description: "Table Games", icon: "fas fa-dice", color: "from-gaming-gold to-yellow-600" },
      { name: "Slots", slug: "slots", description: "Spin & Win", icon: "fas fa-coins", color: "from-blue-500 to-cyan-600" },
      { name: "Sports", slug: "sports", description: "Live Betting", icon: "fas fa-football-ball", color: "from-orange-500 to-red-600" },
      { name: "PVC", slug: "pvc", description: "Premium Live Casino", icon: "fas fa-video", color: "from-pink-500 to-purple-600" },
      { name: "Rummy", slug: "rummy", description: "Card Games", icon: "fas fa-layer-group", color: "from-teal-500 to-green-600" },
      { name: "Fishing", slug: "fishing", description: "Arcade", icon: "fas fa-fish", color: "from-cyan-500 to-blue-600" },
      { name: "Crash", slug: "crash", description: "Multiplier Games", icon: "fas fa-plane", color: "from-red-500 to-orange-600" },
    ];

    categories.forEach(category => this.createGameCategory(category));

    // Initialize authentic TashanWin games
    const initialGames: InsertGame[] = tashanwinGames;
    initialGames.forEach(game => this.createGame(game));
  }

  async getUser(id: number): Promise<User | undefined> {
    // Create demo user if requested
    if (id === 10 && !this.users.has(10)) {
      const demoUser: User = {
        id: 10,
        username: 'demo',
        email: 'demo@91club.com',
        password: 'demo123',
        phone: '9876543210',
        firstName: 'Demo',
        lastName: 'User',
        balance: '0.00',
        walletBalance: '10000.00',
        bonusBalance: '500.00',
        kycStatus: 'verified',
        avatar: null,
        referralCode: 'DEMO91',
        referredBy: null,
        vipLevel: 1,
        totalDeposit: '0.00',
        totalWithdraw: '0.00',
        totalBet: '0.00',
        totalWin: '0.00',
        loginBonus: true,
        lastLoginAt: new Date(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(10, demoUser);
      return demoUser;
    }
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.username === username) return user;
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.phone === phone) return user;
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      phone: insertUser.phone,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      balance: insertUser.balance || "0.00",
      walletBalance: insertUser.walletBalance || "0.00",
      bonusBalance: insertUser.bonusBalance || "0.00",
      kycStatus: insertUser.kycStatus || "pending",
      avatar: insertUser.avatar || null,
      referralCode: insertUser.referralCode || null,
      referredBy: insertUser.referredBy || null,
      vipLevel: insertUser.vipLevel || 0,
      totalDeposit: insertUser.totalDeposit || "0.00",
      totalWithdraw: insertUser.totalWithdraw || "0.00",
      totalBet: insertUser.totalBet || "0.00",
      totalWin: insertUser.totalWin || "0.00",
      loginBonus: insertUser.loginBonus || false,
      lastLoginAt: insertUser.lastLoginAt || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.balance = newBalance;
      user.updatedAt = new Date();
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async updateUserWalletBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.walletBalance = newBalance;
      user.updatedAt = new Date();
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async updateUserLastLogin(userId: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.isActive);
  }

  async getGamesByCategory(category: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      game => game.isActive && game.category === category
    );
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getRecommendedGames(limit: number = 4): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.isActive).slice(0, limit);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const game: Game = {
      id: this.currentGameId++,
      isActive: true,
      jackpot: "0.00",
      ...insertGame,
    };
    this.games.set(game.id, game);
    return game;
  }

  async getAllGameCategories(): Promise<GameCategory[]> {
    return Array.from(this.gameCategories.values()).filter(cat => cat.isActive);
  }

  async getGameCategory(slug: string): Promise<GameCategory | undefined> {
    for (const category of Array.from(this.gameCategories.values())) {
      if (category.slug === slug) return category;
    }
    return undefined;
  }

  async createGameCategory(insertCategory: InsertGameCategory): Promise<GameCategory> {
    const category: GameCategory = {
      id: this.currentCategoryId++,
      isActive: true,
      ...insertCategory,
    };
    this.gameCategories.set(category.id, category);
    return category;
  }

  async getUserGameHistory(userId: number): Promise<UserGameHistory[]> {
    return Array.from(this.userGameHistory.values()).filter(h => h.userId === userId);
  }

  async getTodaysTopEarners(limit: number = 3): Promise<(UserGameHistory & { username: string, gameTitle: string })[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysHistory = Array.from(this.userGameHistory.values())
      .filter(h => h.playedAt >= today && parseFloat(h.winAmount) > 0)
      .sort((a, b) => parseFloat(b.winAmount) - parseFloat(a.winAmount))
      .slice(0, limit);

    return todaysHistory.map(history => {
      const user = this.users.get(history.userId);
      const game = this.games.get(history.gameId);
      return {
        ...history,
        username: user?.username || 'Unknown',
        gameTitle: game?.title || 'Unknown Game'
      };
    });
  }

  async addGameHistory(history: InsertUserGameHistory): Promise<UserGameHistory> {
    const gameHistory: UserGameHistory = {
      id: this.currentHistoryId++,
      playedAt: new Date(),
      ...history,
    };
    this.userGameHistory.set(gameHistory.id, gameHistory);
    return gameHistory;
  }

  async getActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    return Array.from(this.promotions.values()).filter(p => 
      p.isActive && p.startDate <= now && p.endDate >= now
    );
  }

  async getPromotion(id: number): Promise<Promotion | undefined> {
    return this.promotions.get(id);
  }

  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    const promotion: Promotion = {
      id: this.currentPromotionId++,
      ...insertPromotion,
    };
    this.promotions.set(promotion.id, promotion);
    return promotion;
  }

  async getUserWalletTransactions(userId: number, limit: number = 10): Promise<WalletTransaction[]> {
    return Array.from(this.walletTransactions.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction> {
    const walletTransaction: WalletTransaction = {
      id: this.currentTransactionId++,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...transaction,
    };
    this.walletTransactions.set(walletTransaction.id, walletTransaction);
    return walletTransaction;
  }

  async updateWalletTransactionStatus(transactionId: number, status: string, paymentId?: string): Promise<WalletTransaction | undefined> {
    const transaction = this.walletTransactions.get(transactionId);
    if (transaction) {
      transaction.status = status;
      transaction.updatedAt = new Date();
      if (paymentId) transaction.razorpayPaymentId = paymentId;
      this.walletTransactions.set(transactionId, transaction);
      return transaction;
    }
    return undefined;
  }

  async getUserKycDocuments(userId: number): Promise<KycDocument[]> {
    return Array.from(this.kycDocuments.values())
      .filter(doc => doc.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createKycDocument(document: InsertKycDocument): Promise<KycDocument> {
    const kycDoc: KycDocument = {
      id: this.currentKycDocumentId++,
      createdAt: new Date(),
      verifiedAt: null,
      rejectionReason: null,
      ...document,
    };
    this.kycDocuments.set(kycDoc.id, kycDoc);
    return kycDoc;
  }

  async updateKycStatus(userId: number, status: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.kycStatus = status;
      user.updatedAt = new Date();
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async updateUserBonusBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.bonusBalance = newBalance;
      user.updatedAt = new Date();
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: number): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const userAchievements = Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId);
    
    return userAchievements.map(ua => {
      const achievement = this.achievements.get(ua.achievementId);
      return { ...ua, achievement: achievement! };
    });
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const achievement: Achievement = {
      id: this.currentAchievementId++,
      createdAt: new Date(),
      isActive: true,
      ...insertAchievement,
    };
    this.achievements.set(achievement.id, achievement);
    return achievement;
  }

  async unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    const userAchievement: UserAchievement = {
      id: this.currentUserAchievementId++,
      userId,
      achievementId,
      unlockedAt: new Date(),
      progress: 100,
      isCompleted: true,
    };
    this.userAchievements.set(userAchievement.id, userAchievement);
    return userAchievement;
  }

  async updateAchievementProgress(userId: number, achievementId: number, progress: number): Promise<UserAchievement | undefined> {
    const existingUA = Array.from(this.userAchievements.values())
      .find(ua => ua.userId === userId && ua.achievementId === achievementId);
    
    if (existingUA) {
      existingUA.progress = progress;
      if (progress >= 100) {
        existingUA.isCompleted = true;
      }
      this.userAchievements.set(existingUA.id, existingUA);
      return existingUA;
    }
    return undefined;
  }

  async checkAndUnlockAchievements(userId: number, action: string, value?: any): Promise<UserAchievement[]> {
    return [];
  }
}

// Use memory storage for development to avoid database issues
const useMemoryStorage = true; // Always use memory storage for stability
export const storage = new MemStorage();
console.log('Using Memory storage for stability');