import { 
  users, games, gameCategories, userGameHistory, promotions, walletTransactions, kycDocuments,
  type User, type InsertUser, type Game, type InsertGame, 
  type GameCategory, type InsertGameCategory, type UserGameHistory, 
  type InsertUserGameHistory, type Promotion, type InsertPromotion,
  type WalletTransaction, type InsertWalletTransaction, type KycDocument, type InsertKycDocument
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc } from "drizzle-orm";

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
    // Initialize game categories
    const categories: InsertGameCategory[] = [
      { name: "Lobby", slug: "lobby", description: "Main Hub", icon: "fas fa-home", color: "from-gaming-gold to-gaming-amber" },
      { name: "Lottery", slug: "lottery", description: "Lucky Numbers", icon: "fas fa-ticket-alt", color: "from-emerald-500 to-green-600" },
      { name: "Popular", slug: "popular", description: "Trending", icon: "fas fa-fire", color: "from-red-500 to-pink-600" },
      { name: "Mini Games", slug: "minigames", description: "Quick Play", icon: "fas fa-puzzle-piece", color: "from-purple-500 to-indigo-600" },
      { name: "Casino", slug: "casino", description: "Table Games", icon: "fas fa-dice", color: "from-gaming-gold to-yellow-600" },
      { name: "Slots", slug: "slots", description: "Spin & Win", icon: "fas fa-coins", color: "from-blue-500 to-cyan-600" },
      { name: "Sports", slug: "sports", description: "Live Betting", icon: "fas fa-football-ball", color: "from-orange-500 to-red-600" },
      { name: "Rummy", slug: "rummy", description: "Card Games", icon: "fas fa-layer-group", color: "from-teal-500 to-green-600" },
      { name: "Fishing", slug: "fishing", description: "Arcade", icon: "fas fa-fish", color: "from-cyan-500 to-blue-600" },
    ];

    categories.forEach(category => this.createGameCategory(category));

    // Initialize games
    const initialGames: InsertGame[] = [
      // Lottery Games
      {
        title: "Mega Lottery Draw",
        description: "Weekly lottery with massive prizes",
        category: "lottery",
        imageUrl: "https://images.unsplash.com/photo-1434873740857-1bc5653afda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        jackpot: "2847392.00"
      },
      {
        title: "Daily Lucky Numbers",
        description: "Quick pick lottery with daily draws",
        category: "lottery",
        imageUrl: "https://images.unsplash.com/photo-1611095564141-d8f2c3eb8f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.3",
        jackpot: "150000.00"
      },
      {
        title: "Power Ball Jackpot",
        description: "Multi-state lottery with record payouts",
        category: "lottery",
        imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.6",
        jackpot: "1890000.00"
      },
      {
        title: "Scratch Card Bonanza",
        description: "Instant win scratch cards with big prizes",
        category: "lottery",
        imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.2",
        jackpot: "75000.00"
      },

      // Popular Games
      {
        title: "Golden Fortune Slots",
        description: "Classic slot machine with massive jackpots",
        category: "popular",
        imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.8",
        jackpot: "125000.00"
      },
      {
        title: "Texas Hold'em Poker",
        description: "Most popular poker variant with tournaments",
        category: "popular",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.9",
        jackpot: "95000.00"
      },
      {
        title: "Lightning Roulette",
        description: "Enhanced roulette with multiplied payouts",
        category: "popular",
        imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.7",
        jackpot: "180000.00"
      },
      {
        title: "Dragon Tiger",
        description: "Fast-paced card game with simple rules",
        category: "popular",
        imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        jackpot: "65000.00"
      },

      // Mini Games
      {
        title: "Crash Rocket",
        description: "Multiplier game - cash out before the crash",
        category: "minigames",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.4",
        jackpot: "50000.00"
      },
      {
        title: "Plinko Drop",
        description: "Drop balls and watch them bounce to prizes",
        category: "minigames",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.3",
        jackpot: "25000.00"
      },
      {
        title: "Mines Sweeper",
        description: "Reveal gems while avoiding mines",
        category: "minigames",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        jackpot: "40000.00"
      },
      {
        title: "Coin Flip Pro",
        description: "Double or nothing coin flipping game",
        category: "minigames",
        imageUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.2",
        jackpot: "15000.00"
      },
      {
        title: "Wheel of Fortune",
        description: "Spin the wheel for instant prizes",
        category: "minigames",
        imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.6",
        jackpot: "35000.00"
      },

      // Casino Games
      {
        title: "Royal Poker Championship",
        description: "High-stakes poker with professional dealers",
        category: "casino",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.9",
        jackpot: "85000.00"
      },
      {
        title: "European Roulette Pro",
        description: "Premium roulette with live dealers",
        category: "casino",
        imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.7",
        jackpot: "65000.00"
      },
      {
        title: "Blackjack Master",
        description: "Classic blackjack with perfect strategy guide",
        category: "casino",
        imageUrl: "https://images.unsplash.com/photo-1541278107931-e006523892df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.6",
        jackpot: "45000.00"
      },
      {
        title: "Baccarat Elite",
        description: "High-end baccarat with VIP tables",
        category: "casino",
        imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.8",
        jackpot: "120000.00"
      },
      {
        title: "Live Casino Hold'em",
        description: "Play against the dealer in this poker variant",
        category: "casino",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        jackpot: "55000.00"
      },
      {
        title: "Three Card Poker",
        description: "Fast-paced poker with ante and play bets",
        category: "casino",
        imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.4",
        jackpot: "38000.00"
      },

      // Slots Games
      {
        title: "Diamond Dynasty",
        description: "Luxury themed slot with progressive jackpot",
        category: "slots",
        imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.8",
        jackpot: "285000.00"
      },
      {
        title: "Pharaoh's Gold",
        description: "Ancient Egypt themed adventure slot",
        category: "slots",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.7",
        jackpot: "195000.00"
      },
      {
        title: "Mega Fruit Machine",
        description: "Classic fruit slot with modern features",
        category: "slots",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        jackpot: "145000.00"
      },
      {
        title: "Dragon's Fire",
        description: "Fantasy themed slot with expanding wilds",
        category: "slots",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.6",
        jackpot: "165000.00"
      },
      {
        title: "Lucky 777 Classic",
        description: "Traditional slot machine experience",
        category: "slots",
        imageUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.4",
        jackpot: "95000.00"
      },
      {
        title: "Wild West Gold",
        description: "Western themed slot with bonus rounds",
        category: "slots",
        imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.7",
        jackpot: "175000.00"
      },

      // Sports Games
      {
        title: "Football Champions League",
        description: "Bet on live football matches worldwide",
        category: "sports",
        imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.6",
        jackpot: "75000.00"
      },
      {
        title: "Basketball Pro League",
        description: "Live basketball betting with real-time odds",
        category: "sports",
        imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        jackpot: "65000.00"
      },
      {
        title: "Tennis Grand Slam",
        description: "Bet on major tennis tournaments",
        category: "sports",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.4",
        jackpot: "45000.00"
      },
      {
        title: "Horse Racing Derby",
        description: "Track betting on live horse races",
        category: "sports",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.3",
        jackpot: "85000.00"
      },
      {
        title: "Virtual Sports Arena",
        description: "24/7 virtual sports betting action",
        category: "sports",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.2",
        jackpot: "35000.00"
      },

      // Rummy Games
      {
        title: "Indian Rummy Classic",
        description: "Traditional 13-card rummy with tournaments",
        category: "rummy",
        imageUrl: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.7",
        jackpot: "55000.00"
      },
      {
        title: "Gin Rummy Masters",
        description: "Fast-paced gin rummy with cash prizes",
        category: "rummy",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        jackpot: "42000.00"
      },
      {
        title: "Rummy 500 Championship",
        description: "Multi-player rummy with big tournaments",
        category: "rummy",
        imageUrl: "https://images.unsplash.com/photo-1541278107931-e006523892df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.6",
        jackpot: "68000.00"
      },
      {
        title: "Points Rummy Rush",
        description: "Quick rummy games with instant payouts",
        category: "rummy",
        imageUrl: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.4",
        jackpot: "28000.00"
      },

      // Fishing Games
      {
        title: "Ocean Treasure Hunt",
        description: "Underwater adventure fishing game",
        category: "fishing",
        imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.4",
        jackpot: "35000.00"
      },
      {
        title: "Deep Sea Fortune",
        description: "Hunt for rare fish and underwater treasures",
        category: "fishing",
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        jackpot: "48000.00"
      },
      {
        title: "Golden Fish Casino",
        description: "Arcade fishing with multiplayer action",
        category: "fishing",
        imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.3",
        jackpot: "32000.00"
      },
      {
        title: "Mega Fish Shooter",
        description: "Shoot fish for coins and special rewards",
        category: "fishing",
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.6",
        jackpot: "58000.00"
      }
    ];

    initialGames.forEach(game => this.createGame(game));

    // Initialize promotions
    const initialPromotions: InsertPromotion[] = [
      {
        title: "Welcome Bonus: 100% Match + 50 Free Spins",
        description: "Double your first deposit up to $1000, plus get 50 free spins on our most popular slots!",
        type: "welcome_bonus",
        value: "1000.00",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    ];

    initialPromotions.forEach(promotion => this.createPromotion(promotion));

    // Initialize demo users and game history
    const demoUsers: InsertUser[] = [
      { username: "Player_7849", email: "player7849@example.com", password: "hashed_password" },
      { username: "LuckyWinner23", email: "lucky@example.com", password: "hashed_password" },
      { username: "GamerQueen", email: "gamerqueen@example.com", password: "hashed_password" }
    ];

    demoUsers.forEach(user => this.createUser(user));

    // Add some game history for leaderboard
    const gameHistory: InsertUserGameHistory[] = [
      { userId: 1, gameId: 1, betAmount: "1000.00", winAmount: "42850.00" },
      { userId: 2, gameId: 2, betAmount: "500.00", winAmount: "28320.00" },
      { userId: 3, gameId: 3, betAmount: "750.00", winAmount: "19450.00" }
    ];

    gameHistory.forEach(history => this.addGameHistory(history));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      phoneNumber: null,
      balance: "1000.00",
      walletBalance: "5000.00",
      bonusBalance: "500.00",
      kycStatus: "verified",
      razorpayCustomerId: null,
      panNumber: null,
      aadharNumber: null,
      bankAccountNumber: null,
      bankIfscCode: null,
      bankAccountHolderName: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (user) {
      user.balance = newBalance;
      this.users.set(userId, user);
      return user;
    }
    return undefined;
  }

  // Game methods
  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => game.isActive);
  }

  async getGamesByCategory(category: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(game => 
      game.isActive && game.category === category
    );
  }

  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getRecommendedGames(limit: number = 4): Promise<Game[]> {
    const allGames = Array.from(this.games.values()).filter(game => game.isActive);
    return allGames.slice(0, limit);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.currentGameId++;
    const game: Game = {
      ...insertGame,
      id,
      isActive: true
    };
    this.games.set(id, game);
    return game;
  }

  // Game category methods
  async getAllGameCategories(): Promise<GameCategory[]> {
    return Array.from(this.gameCategories.values()).filter(category => category.isActive);
  }

  async getGameCategory(slug: string): Promise<GameCategory | undefined> {
    return Array.from(this.gameCategories.values()).find(category => 
      category.slug === slug && category.isActive
    );
  }

  async createGameCategory(insertCategory: InsertGameCategory): Promise<GameCategory> {
    const id = this.currentCategoryId++;
    const category: GameCategory = {
      ...insertCategory,
      id,
      isActive: true
    };
    this.gameCategories.set(id, category);
    return category;
  }

  // User game history methods
  async getUserGameHistory(userId: number): Promise<UserGameHistory[]> {
    return Array.from(this.userGameHistory.values()).filter(history => 
      history.userId === userId
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
    const id = this.currentHistoryId++;
    const history: UserGameHistory = {
      ...insertHistory,
      id,
      playedAt: new Date()
    };
    this.userGameHistory.set(id, history);
    return history;
  }

  // Promotion methods
  async getActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    return Array.from(this.promotions.values()).filter(promotion => 
      promotion.isActive && 
      promotion.startDate <= now && 
      promotion.endDate >= now
    );
  }

  async getPromotion(id: number): Promise<Promotion | undefined> {
    return this.promotions.get(id);
  }

  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    const id = this.currentPromotionId++;
    const promotion: Promotion = {
      ...insertPromotion,
      id,
      isActive: true
    };
    this.promotions.set(id, promotion);
    return promotion;
  }

  // Wallet transaction methods
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
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction> {
    const id = this.currentTransactionId++;
    const walletTransaction: WalletTransaction = {
      ...transaction,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.walletTransactions.set(id, walletTransaction);
    return walletTransaction;
  }

  async updateWalletTransactionStatus(transactionId: number, status: string, paymentId?: string): Promise<WalletTransaction | undefined> {
    const transaction = this.walletTransactions.get(transactionId);
    if (transaction) {
      transaction.status = status;
      transaction.updatedAt = new Date();
      if (paymentId) {
        transaction.paymentId = paymentId;
      }
      this.walletTransactions.set(transactionId, transaction);
      return transaction;
    }
    return undefined;
  }

  // KYC methods
  async getUserKycDocuments(userId: number): Promise<KycDocument[]> {
    return Array.from(this.kycDocuments.values())
      .filter(doc => doc.userId === userId);
  }

  async createKycDocument(document: InsertKycDocument): Promise<KycDocument> {
    const id = this.currentKycDocumentId++;
    const kycDocument: KycDocument = {
      ...document,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.kycDocuments.set(id, kycDocument);
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ balance: newBalance })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async getAllGames(): Promise<Game[]> {
    return await db.select().from(games).where(eq(games.isActive, true));
  }

  async getGamesByCategory(category: string): Promise<Game[]> {
    return await db
      .select()
      .from(games)
      .where(and(eq(games.category, category), eq(games.isActive, true)));
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game || undefined;
  }

  async getRecommendedGames(limit: number = 4): Promise<Game[]> {
    return await db
      .select()
      .from(games)
      .where(eq(games.isActive, true))
      .limit(limit);
  }

  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db
      .insert(games)
      .values(game)
      .returning();
    return newGame;
  }

  async getAllGameCategories(): Promise<GameCategory[]> {
    return await db.select().from(gameCategories).where(eq(gameCategories.isActive, true));
  }

  async getGameCategory(slug: string): Promise<GameCategory | undefined> {
    const [category] = await db
      .select()
      .from(gameCategories)
      .where(and(eq(gameCategories.slug, slug), eq(gameCategories.isActive, true)));
    return category || undefined;
  }

  async createGameCategory(category: InsertGameCategory): Promise<GameCategory> {
    const [newCategory] = await db
      .insert(gameCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getUserGameHistory(userId: number): Promise<UserGameHistory[]> {
    return await db
      .select()
      .from(userGameHistory)
      .where(eq(userGameHistory.userId, userId));
  }

  async getTodaysTopEarners(limit: number = 3): Promise<(UserGameHistory & { username: string, gameTitle: string })[]> {
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
      .leftJoin(users, eq(userGameHistory.userId, users.id))
      .leftJoin(games, eq(userGameHistory.gameId, games.id))
      .where(gte(userGameHistory.playedAt, today))
      .orderBy(desc(userGameHistory.winAmount))
      .limit(limit);

    return results.map(result => ({
      ...result,
      username: result.username || "Unknown",
      gameTitle: result.gameTitle || "Unknown Game"
    }));
  }

  async addGameHistory(history: InsertUserGameHistory): Promise<UserGameHistory> {
    const [newHistory] = await db
      .insert(userGameHistory)
      .values(history)
      .returning();
    return newHistory;
  }

  async getActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    return await db
      .select()
      .from(promotions)
      .where(
        and(
          eq(promotions.isActive, true),
          gte(promotions.endDate, now)
        )
      );
  }

  async getPromotion(id: number): Promise<Promotion | undefined> {
    const [promotion] = await db.select().from(promotions).where(eq(promotions.id, id));
    return promotion || undefined;
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const [newPromotion] = await db
      .insert(promotions)
      .values(promotion)
      .returning();
    return newPromotion;
  }

  async updateUserWalletBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ walletBalance: newBalance, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser || undefined;
  }

  async getUserWalletTransactions(userId: number, limit: number = 20): Promise<WalletTransaction[]> {
    return await db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.userId, userId))
      .orderBy(desc(walletTransactions.createdAt))
      .limit(limit);
  }

  async createWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction> {
    const [newTransaction] = await db
      .insert(walletTransactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async updateWalletTransactionStatus(transactionId: number, status: string, paymentId?: string): Promise<WalletTransaction | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (paymentId) {
      updateData.razorpayPaymentId = paymentId;
    }
    
    const [updatedTransaction] = await db
      .update(walletTransactions)
      .set(updateData)
      .where(eq(walletTransactions.id, transactionId))
      .returning();
    return updatedTransaction || undefined;
  }

  async getUserKycDocuments(userId: number): Promise<KycDocument[]> {
    return await db
      .select()
      .from(kycDocuments)
      .where(eq(kycDocuments.userId, userId))
      .orderBy(desc(kycDocuments.createdAt));
  }

  async createKycDocument(document: InsertKycDocument): Promise<KycDocument> {
    const [newDocument] = await db
      .insert(kycDocuments)
      .values(document)
      .returning();
    return newDocument;
  }

  async updateKycStatus(userId: number, status: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ kycStatus: status, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser || undefined;
  }
}

export const storage = new MemStorage();
