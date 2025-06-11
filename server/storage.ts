import {
  users,
  games,
  gameCategories,
  userGameHistory,
  walletTransactions,
  kycDocuments,
  promotions,
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
} from "@shared/schema";
import { tashanwinGames } from "./tashanwin-games";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private gameCategories: Map<number, GameCategory>;
  private userGameHistory: Map<number, UserGameHistory>;
  private promotions: Map<number, Promotion>;
  private walletTransactions: Map<number, WalletTransaction>;
  private kycDocuments: Map<number, KycDocument>;
  private currentUserId: number;
  private currentGameId: number;
  private currentCategoryId: number;
  private currentHistoryId: number;
  private currentPromotionId: number;
  private currentTransactionId: number;
  private currentKycDocumentId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.gameCategories = new Map();
    this.userGameHistory = new Map();
    this.promotions = new Map();
    this.walletTransactions = new Map();
    this.kycDocuments = new Map();
    this.currentUserId = 1;
    this.currentGameId = 1;
    this.currentCategoryId = 1;
    this.currentHistoryId = 1;
    this.currentPromotionId = 1;
    this.currentTransactionId = 1;
    this.currentKycDocumentId = 1;
    
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

    // Add popular casino games
    const popularCasinoGames: InsertGame[] = [
      {
        title: "Aviator",
        description: "Watch the plane fly and cash out before it crashes! Multipliers can reach up to 100x.",
        category: "Crash",
        imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.8",
        jackpot: "₹2,50,000"
      },
      {
        title: "Coin Flip",
        description: "Classic heads or tails with 1.95x payout. Simple and exciting!",
        category: "Casino",
        imageUrl: "https://images.unsplash.com/photo-1640119435830-8b00942cd072?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.6",
        jackpot: "₹1,00,000"
      },
      {
        title: "Dice Roll",
        description: "Predict under or over with customizable odds. High risk, high reward!",
        category: "Casino",
        imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.7",
        jackpot: "₹5,00,000"
      },
      {
        title: "Big Small",
        description: "Roll three dice and bet on the total. Big (11-17) or Small (4-10) with 1.95x payout!",
        category: "Casino",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        jackpot: "₹3,00,000"
      },
      {
        title: "Card Master",
        description: "Draw a card and bet on red/black or high/low. Classic casino action!",
        category: "Casino",
        imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.4",
        jackpot: "₹2,00,000"
      },
      {
        title: "Ball Number",
        description: "Pick your lucky numbers from 1-36. Single number pays 35x!",
        category: "Casino",
        imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.6",
        jackpot: "₹10,00,000"
      }
    ];
    
    popularCasinoGames.forEach(game => this.createGame(game));

    // Initialize promotions
    const initialPromotions: InsertPromotion[] = [
      {
        title: "Welcome Bonus: 100% Match + 50 Free Spins",
        description: "Double your first deposit up to ₹100,000, plus get 50 free spins on our most popular slots!",
        type: "welcome_bonus",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        terms: "Min deposit ₹1,000. Wagering requirement 35x. Valid for 30 days.",
        bonusAmount: "100000.00"
      },
      {
        title: "Daily Cashback: Get 10% Back",
        description: "Get 10% cashback on all losses every day, up to ₹25,000!",
        type: "cashback",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        terms: "Min loss ₹500. Cashback credited within 24 hours.",
        bonusAmount: "25000.00"
      },
      {
        title: "Weekly Reload: 50% Bonus",
        description: "Get 50% bonus on deposits every Friday, up to ₹50,000!",
        type: "reload_bonus",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 52 * 7 * 24 * 60 * 60 * 1000),
        imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        terms: "Available every Friday. Min deposit ₹2,000. Wagering 25x.",
        bonusAmount: "50000.00"
      }
    ];

    initialPromotions.forEach(promotion => this.createPromotion(promotion));

  }

  async getUser(id: number): Promise<User | undefined> {
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
    const allGames = Array.from(this.games.values()).filter(game => game.isActive);
    return allGames.sort(() => 0.5 - Math.random()).slice(0, limit);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const game: Game = {
      id: this.currentGameId++,
      isActive: true,
      ...insertGame,
    };
    this.games.set(game.id, game);
    return game;
  }

  async getAllGameCategories(): Promise<GameCategory[]> {
    return Array.from(this.gameCategories.values());
  }

  async getGameCategory(slug: string): Promise<GameCategory | undefined> {
    for (const category of this.gameCategories.values()) {
      if (category.slug === slug) return category;
    }
    return undefined;
  }

  async createGameCategory(insertCategory: InsertGameCategory): Promise<GameCategory> {
    const category: GameCategory = {
      id: this.currentCategoryId++,
      ...insertCategory,
    };
    this.gameCategories.set(category.id, category);
    return category;
  }

  async getUserGameHistory(userId: number): Promise<UserGameHistory[]> {
    return Array.from(this.userGameHistory.values()).filter(
      history => history.userId === userId
    );
  }

  async getTodaysTopEarners(limit: number = 3): Promise<(UserGameHistory & { username: string, gameTitle: string })[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysHistory = Array.from(this.userGameHistory.values())
      .filter(history => history.playedAt >= today)
      .sort((a, b) => parseFloat(b.winAmount) - parseFloat(a.winAmount))
      .slice(0, limit);

    return todaysHistory.map(history => {
      const user = this.users.get(history.userId);
      const game = this.games.get(history.gameId);
      return {
        ...history,
        username: user?.username || "Unknown",
        gameTitle: game?.title || "Unknown Game"
      };
    });
  }

  async addGameHistory(insertHistory: InsertUserGameHistory): Promise<UserGameHistory> {
    const history: UserGameHistory = {
      id: this.currentHistoryId++,
      playedAt: new Date(),
      ...insertHistory,
    };
    this.userGameHistory.set(history.id, history);
    return history;
  }

  async getActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    return Array.from(this.promotions.values()).filter(
      promo => promo.isActive && promo.startDate <= now && promo.endDate >= now
    );
  }

  async getPromotion(id: number): Promise<Promotion | undefined> {
    return this.promotions.get(id);
  }

  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    const promotion: Promotion = {
      id: this.currentPromotionId++,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...insertPromotion,
    };
    this.promotions.set(promotion.id, promotion);
    return promotion;
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

  async getUserWalletTransactions(userId: number, limit: number = 20): Promise<WalletTransaction[]> {
    return Array.from(this.walletTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction> {
    const walletTransaction: WalletTransaction = {
      id: this.currentTransactionId++,
      createdAt: new Date(),
      updatedAt: new Date(),
      gameId: null,
      description: null,
      status: "pending",
      currency: "INR",
      paymentMethod: null,
      razorpayPaymentId: null,
      razorpayOrderId: null,
      balanceBefore: null,
      balanceAfter: null,
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
      if (paymentId) {
        transaction.razorpayPaymentId = paymentId;
      }
      this.walletTransactions.set(transactionId, transaction);
      return transaction;
    }
    return undefined;
  }

  async getUserKycDocuments(userId: number): Promise<KycDocument[]> {
    return Array.from(this.kycDocuments.values()).filter(
      doc => doc.userId === userId
    );
  }

  async createKycDocument(document: InsertKycDocument): Promise<KycDocument> {
    const kycDocument: KycDocument = {
      id: this.currentKycDocumentId++,
      status: "pending",
      createdAt: new Date(),
      rejectionReason: null,
      verifiedAt: null,
      ...document,
    };
    this.kycDocuments.set(kycDocument.id, kycDocument);
    return kycDocument;
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
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ walletBalance: newBalance, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async updateUserWalletBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ walletBalance: newBalance, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async updateUserLastLogin(userId: number): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async getAllGames(): Promise<Game[]> {
    return await db.select().from(games).where(eq(games.isActive, true));
  }

  async getGamesByCategory(category: string): Promise<Game[]> {
    return await db.select().from(games).where(eq(games.category, category));
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game || undefined;
  }

  async getRecommendedGames(limit: number = 4): Promise<Game[]> {
    return await db.select().from(games).where(eq(games.isActive, true)).limit(limit);
  }

  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db.insert(games).values(game).returning();
    return newGame;
  }

  async getAllGameCategories(): Promise<GameCategory[]> {
    return await db.select().from(gameCategories).where(eq(gameCategories.isActive, true));
  }

  async getGameCategory(slug: string): Promise<GameCategory | undefined> {
    const [category] = await db.select().from(gameCategories).where(eq(gameCategories.slug, slug));
    return category || undefined;
  }

  async createGameCategory(category: InsertGameCategory): Promise<GameCategory> {
    const [newCategory] = await db.insert(gameCategories).values(category).returning();
    return newCategory;
  }

  async getUserGameHistory(userId: number): Promise<UserGameHistory[]> {
    return await db.select().from(userGameHistory).where(eq(userGameHistory.userId, userId));
  }

  async getTodaysTopEarners(limit: number = 3): Promise<(UserGameHistory & { username: string, gameTitle: string })[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await db.select({
      id: userGameHistory.id,
      userId: userGameHistory.userId,
      gameId: userGameHistory.gameId,
      betAmount: userGameHistory.betAmount,
      winAmount: userGameHistory.winAmount,
      playedAt: userGameHistory.playedAt,
      username: users.username,
      gameTitle: games.title
    })
    .from(userGameHistory)
    .innerJoin(users, eq(userGameHistory.userId, users.id))
    .innerJoin(games, eq(userGameHistory.gameId, games.id))
    .where(gte(userGameHistory.playedAt, today))
    .orderBy(desc(userGameHistory.winAmount))
    .limit(limit);
  }

  async addGameHistory(history: InsertUserGameHistory): Promise<UserGameHistory> {
    const [newHistory] = await db.insert(userGameHistory).values(history).returning();
    return newHistory;
  }

  async getActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    return await db.select().from(promotions)
      .where(and(
        eq(promotions.isActive, true),
        lte(promotions.startDate, now),
        gte(promotions.endDate, now)
      ));
  }

  async getPromotion(id: number): Promise<Promotion | undefined> {
    const [promotion] = await db.select().from(promotions).where(eq(promotions.id, id));
    return promotion || undefined;
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const [newPromotion] = await db.insert(promotions).values(promotion).returning();
    return newPromotion;
  }

  async getUserWalletTransactions(userId: number, limit: number = 20): Promise<WalletTransaction[]> {
    return await db.select().from(walletTransactions)
      .where(eq(walletTransactions.userId, userId))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(limit);
  }

  async createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction> {
    const [newTransaction] = await db.insert(walletTransactions).values(transaction).returning();
    return newTransaction;
  }

  async updateWalletTransactionStatus(transactionId: number, status: string, paymentId?: string): Promise<WalletTransaction | undefined> {
    const updateData: any = { 
      status, 
      updatedAt: new Date() 
    };
    if (paymentId) {
      updateData.paymentId = paymentId;
    }
    
    const [transaction] = await db.update(walletTransactions)
      .set(updateData)
      .where(eq(walletTransactions.id, transactionId))
      .returning();
    return transaction || undefined;
  }

  async getUserKycDocuments(userId: number): Promise<KycDocument[]> {
    return await db.select().from(kycDocuments).where(eq(kycDocuments.userId, userId));
  }

  async createKycDocument(document: InsertKycDocument): Promise<KycDocument> {
    const [newDocument] = await db.insert(kycDocuments).values(document).returning();
    return newDocument;
  }

  async updateKycStatus(userId: number, status: string): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ kycStatus: status, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async updateUserBonusBalance(userId: number, amount: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (user) {
      const currentBonus = parseFloat(user.bonusBalance || "0");
      const newBonus = currentBonus + parseFloat(amount);
      
      const [updatedUser] = await db.update(users)
        .set({ 
          bonusBalance: newBonus.toFixed(2),
          updatedAt: new Date() 
        })
        .where(eq(users.id, userId))
        .returning();
      return updatedUser || undefined;
    }
    return undefined;
  }
}

export const storage = new DatabaseStorage();