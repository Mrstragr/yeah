import type {
  User,
  InsertUser,
  Game,
  InsertGame,
  GameCategory,
  InsertGameCategory,
  UserGameHistory,
  InsertUserGameHistory,
  Promotion,
  InsertPromotion,
  WalletTransaction,
  InsertWalletTransaction,
  KycDocument,
  InsertKycDocument,
} from "@shared/schema";
import { tashanwinGames } from "./tashanwin-games";

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, newBalance: string): Promise<User | undefined>;
  updateUserWalletBalance(userId: number, newBalance: string): Promise<User | undefined>;

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
    ];

    categories.forEach(category => this.createGameCategory(category));

    // Initialize authentic TashanWin games
    const initialGames: InsertGame[] = tashanwinGames;
    initialGames.forEach(game => this.createGame(game));

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

    // Initialize sample user
    this.createUser({
      username: "player123",
      email: "player@example.com",
      password: "password123",
      balance: "10000.00",
      walletBalance: "10000.00",
      bonusBalance: "0.00",
      firstName: "John",
      lastName: "Player",
      phone: "+919876543210",
      kycStatus: "pending"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) return user;
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...insertUser,
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

export const storage = new MemStorage();