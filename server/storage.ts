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

    // Add PVC category for TashanWin games
    this.createGameCategory({
      name: "PVC",
      slug: "pvc", 
      description: "Premium Live Casino",
      icon: "fas fa-video",
      color: "from-pink-500 to-purple-600"
    });

    // Initialize authentic TashanWin games
    const tashanwinGames = [
      // Lobby Games (Featured)
      {
        title: "Super Jackpot",
        description: "Get Super Jackpot rewards - Visit the Super Jackpot page to claim",
        category: "lobby",
        imageUrl: "/images/superjackpot.png",
        rating: "4.9",
        jackpot: "5000000.00"
      },
      {
        title: "Daily Check-in",
        description: "Login daily for increasing bonus rewards",
        category: "lobby", 
        imageUrl: "/images/checkin.png",
        rating: "4.8",
        jackpot: "100000.00"
      },
      {
        title: "VIP Bonus",
        description: "Exclusive VIP member bonuses and privileges",
        category: "lobby",
        imageUrl: "/images/vip.png", 
        rating: "4.7",
        jackpot: "2500000.00"
      },

      // Lottery Games
      {
        title: "Win Go 1Min",
        description: "Predict the next number in 1-minute lottery draws",
        category: "lottery",
        imageUrl: "/images/wingo1.png",
        rating: "4.8",
        jackpot: "500000.00"
      },
      {
        title: "Win Go 3Min", 
        description: "3-minute lottery with higher multipliers and bigger wins",
        category: "lottery",
        imageUrl: "/images/wingo3.png",
        rating: "4.7",
        jackpot: "750000.00"
      },
      {
        title: "Win Go 5Min",
        description: "5-minute draws with mega jackpots and bonus rounds",
        category: "lottery",
        imageUrl: "/images/wingo5.png",
        rating: "4.9",
        jackpot: "1000000.00"
      },
      {
        title: "Win Go 10Min",
        description: "10-minute lottery with maximum payouts and special features",
        category: "lottery",
        imageUrl: "/images/wingo10.png",
        rating: "4.8",
        jackpot: "1500000.00"
      },
      {
        title: "K3 Lottery",
        description: "3-dice sum prediction game with instant results",
        category: "lottery",
        imageUrl: "/images/k3.png",
        rating: "4.6",
        jackpot: "200000.00"
      },
      {
        title: "5D Lottery",
        description: "5-digit number prediction with massive multipliers",
        category: "lottery",
        imageUrl: "/images/5d.png",
        rating: "4.7",
        jackpot: "2000000.00"
      },
      {
        title: "Trx Win Go",
        description: "TRON-based lottery with cryptocurrency rewards",
        category: "lottery",
        imageUrl: "/images/trx.png",
        rating: "4.5",
        jackpot: "800000.00"
      },

      // Popular Games
      {
        title: "Aviator",
        description: "Fly high and cash out before the plane crashes",
        category: "popular",
        imageUrl: "/images/aviator.png",
        rating: "4.9",
        jackpot: "1000000.00"
      },
      {
        title: "JetX",
        description: "Rocket multiplier game with instant cashouts",
        category: "popular", 
        imageUrl: "/images/jetx.png",
        rating: "4.8",
        jackpot: "800000.00"
      },
      {
        title: "Lucky Jet",
        description: "Lucky character flies with growing multipliers",
        category: "popular",
        imageUrl: "/images/luckyjet.png",
        rating: "4.7",
        jackpot: "600000.00"
      },
      {
        title: "Spaceman",
        description: "Space adventure with astronomical multipliers",
        category: "popular",
        imageUrl: "/images/spaceman.png", 
        rating: "4.8",
        jackpot: "900000.00"
      },
      {
        title: "Crash",
        description: "Classic crash game with multiplying rewards",
        category: "popular",
        imageUrl: "/images/crash.png",
        rating: "4.6",
        jackpot: "700000.00"
      },

      // Mini Games
      {
        title: "Mines",
        description: "Find diamonds while avoiding explosive mines",
        category: "minigames",
        imageUrl: "/images/mines.png",
        rating: "4.6",
        jackpot: "250000.00"
      },
      {
        title: "Plinko",
        description: "Drop balls through pegs for multiplied winnings",
        category: "minigames",
        imageUrl: "/images/plinko.png",
        rating: "4.5",
        jackpot: "300000.00"
      },
      {
        title: "Keno",
        description: "Pick numbers and win based on matches drawn",
        category: "minigames",
        imageUrl: "/images/keno.png",
        rating: "4.4",
        jackpot: "150000.00"
      },
      {
        title: "Wheel",
        description: "Spin the wheel for instant cash prizes",
        category: "minigames",
        imageUrl: "/images/wheel.png",
        rating: "4.7",
        jackpot: "400000.00"
      },
      {
        title: "Dice",
        description: "Roll dice and predict high/low outcomes", 
        category: "minigames",
        imageUrl: "/images/dice.png",
        rating: "4.3",
        jackpot: "100000.00"
      },
      {
        title: "Tower",
        description: "Climb the tower while avoiding falling blocks",
        category: "minigames",
        imageUrl: "/images/tower.png",
        rating: "4.5",
        jackpot: "200000.00"
      },
      {
        title: "Limbo",
        description: "Set your multiplier and beat the house edge",
        category: "minigames",
        imageUrl: "/images/limbo.png",
        rating: "4.4",
        jackpot: "180000.00"
      },

      // Casino Games
      {
        title: "Teen Patti",
        description: "Indian 3-card poker with live dealers and real players",
        category: "casino",
        imageUrl: "/images/teenpatti.png",
        rating: "4.9",
        jackpot: "2000000.00"
      },
      {
        title: "Andar Bahar", 
        description: "Traditional Indian card game with live action",
        category: "casino",
        imageUrl: "/images/andarbahar.png",
        rating: "4.8",
        jackpot: "1500000.00"
      },
      {
        title: "Dragon Tiger",
        description: "Simple card comparison game with high payouts",
        category: "casino",
        imageUrl: "/images/dragontiger.png",
        rating: "4.7",
        jackpot: "1200000.00"
      },
      {
        title: "Baccarat",
        description: "Classic baccarat with professional live dealers",
        category: "casino",
        imageUrl: "/images/baccarat.png",
        rating: "4.8",
        jackpot: "1800000.00"
      },
      {
        title: "Roulette",
        description: "European roulette with live wheel spins",
        category: "casino",
        imageUrl: "/images/roulette.png",
        rating: "4.6",
        jackpot: "1000000.00"
      },
      {
        title: "Blackjack",
        description: "21 card game with perfect strategy payouts",
        category: "casino", 
        imageUrl: "/images/blackjack.png",
        rating: "4.5",
        jackpot: "800000.00"
      },
      {
        title: "Sic Bo",
        description: "Traditional dice game with multiple betting options",
        category: "casino",
        imageUrl: "/images/sicbo.png",
        rating: "4.4",
        jackpot: "600000.00"
      },
      {
        title: "Poker",
        description: "Texas Hold'em poker tournaments and cash games",
        category: "casino",
        imageUrl: "/images/poker.png",
        rating: "4.7",
        jackpot: "1500000.00"
      },

      // Slots Games
      {
        title: "Gates of Olympus",
        description: "Divine slot with tumbling reels and multipliers",
        category: "slots",
        imageUrl: "/images/gates.png",
        rating: "4.9",
        jackpot: "5000000.00"
      },
      {
        title: "Sweet Bonanza",
        description: "Candy-themed slot with explosive wins",
        category: "slots",
        imageUrl: "/images/bonanza.png",
        rating: "4.8", 
        jackpot: "3000000.00"
      },
      {
        title: "Wolf Gold",
        description: "Wildlife slot with money symbol features",
        category: "slots",
        imageUrl: "/images/wolf.png",
        rating: "4.7",
        jackpot: "2500000.00"
      },
      {
        title: "Book of Dead",
        description: "Egyptian adventure with expanding symbols",
        category: "slots",
        imageUrl: "/images/bookdead.png",
        rating: "4.6",
        jackpot: "2000000.00"
      },
      {
        title: "Starburst",
        description: "Classic gem slot with expanding wilds",
        category: "slots",
        imageUrl: "/images/starburst.png",
        rating: "4.5",
        jackpot: "1500000.00"
      },
      {
        title: "Mega Moolah",
        description: "Progressive jackpot slot with African safari theme",
        category: "slots",
        imageUrl: "/images/moolah.png",
        rating: "4.8",
        jackpot: "10000000.00"
      },
      {
        title: "Bonanza",
        description: "Mining-themed megaways slot with cascading reels",
        category: "slots",
        imageUrl: "/images/bonanza2.png", 
        rating: "4.7",
        jackpot: "4000000.00"
      },
      {
        title: "Reactoonz",
        description: "Alien-themed cluster pays slot with quantum features",
        category: "slots",
        imageUrl: "/images/reactoonz.png",
        rating: "4.6",
        jackpot: "3500000.00"
      },

      // Sports Games
      {
        title: "Cricket Live",
        description: "Live cricket betting with real-time odds and statistics",
        category: "sports",
        imageUrl: "/images/cricket.png",
        rating: "4.8",
        jackpot: "1000000.00"
      },
      {
        title: "Football Live",
        description: "Global football leagues with live betting options",
        category: "sports",
        imageUrl: "/images/football.png",
        rating: "4.7",
        jackpot: "800000.00"
      },
      {
        title: "Tennis Live",
        description: "Professional tennis tournaments with live betting",
        category: "sports",
        imageUrl: "/images/tennis.png",
        rating: "4.6",
        jackpot: "600000.00"
      },
      {
        title: "Basketball Live",
        description: "NBA and international basketball with live odds",
        category: "sports",
        imageUrl: "/images/basketball.png",
        rating: "4.5",
        jackpot: "500000.00"
      },
      {
        title: "Virtual Sports",
        description: "24/7 virtual sports with instant results",
        category: "sports",
        imageUrl: "/images/virtual.png",
        rating: "4.4",
        jackpot: "300000.00"
      },
      {
        title: "Kabaddi Live",
        description: "Pro Kabaddi League betting with live updates",
        category: "sports",
        imageUrl: "/images/kabaddi.png",
        rating: "4.3",
        jackpot: "250000.00"
      },

      // PVC Games (Premium Live Casino)
      {
        title: "Live Dealer Studios",
        description: "Premium live dealer games with HD streaming",
        category: "pvc",
        imageUrl: "/images/live.png",
        rating: "4.9",
        jackpot: "3000000.00"
      },
      {
        title: "VIP Salon Privé",
        description: "Exclusive high-limit tables for VIP members",
        category: "pvc",
        imageUrl: "/images/vipsalon.png",
        rating: "4.8",
        jackpot: "5000000.00"
      },
      {
        title: "Speed Baccarat",
        description: "Fast-paced baccarat with 27-second rounds",
        category: "pvc",
        imageUrl: "/images/speedbac.png",
        rating: "4.7",
        jackpot: "2000000.00"
      },
      {
        title: "Lightning Roulette",
        description: "Electrified roulette with random multipliers up to 500x",
        category: "pvc",
        imageUrl: "/images/lightning.png",
        rating: "4.8",
        jackpot: "2500000.00"
      },
      {
        title: "Dream Catcher",
        description: "Money wheel game with live host and multipliers",
        category: "pvc",
        imageUrl: "/images/dreamcatcher.png",
        rating: "4.6",
        jackpot: "1500000.00"
      },
      {
        title: "Monopoly Live",
        description: "Board game-inspired wheel with 3D bonus rounds",
        category: "pvc",
        imageUrl: "/images/monopoly.png",
        rating: "4.7",
        jackpot: "2200000.00"
      },

      // Rummy Games
      {
        title: "Points Rummy",
        description: "Fast points-based rummy tournaments with instant results",
        category: "rummy",
        imageUrl: "/images/pointsrummy.png",
        rating: "4.7",
        jackpot: "500000.00"
      },
      {
        title: "Pool Rummy",
        description: "101 and 201 pool rummy with elimination rounds",
        category: "rummy",
        imageUrl: "/images/poolrummy.png",
        rating: "4.6",
        jackpot: "750000.00"
      },
      {
        title: "Deals Rummy",
        description: "Fixed deals rummy with predetermined chip distribution",
        category: "rummy",
        imageUrl: "/images/dealsrummy.png",
        rating: "4.5",
        jackpot: "400000.00"
      },
      {
        title: "Gin Rummy",
        description: "Classic gin rummy with cash prizes and tournaments",
        category: "rummy",
        imageUrl: "/images/ginrummy.png",
        rating: "4.4",
        jackpot: "300000.00"
      },
      {
        title: "Indian Rummy",
        description: "Traditional 13-card Indian rummy with multiple variants",
        category: "rummy",
        imageUrl: "/images/indianrummy.png",
        rating: "4.8",
        jackpot: "600000.00"
      },

      // Fishing Games
      {
        title: "Ocean King",
        description: "Underwater fishing adventure with powerful cannons",
        category: "fishing",
        imageUrl: "/images/oceanking.png",
        rating: "4.8",
        jackpot: "1500000.00"
      },
      {
        title: "Fish Hunter",
        description: "Hunt rare fish species for mega multipliers and bonuses",
        category: "fishing",
        imageUrl: "/images/fishhunter.png",
        rating: "4.7",
        jackpot: "1200000.00"
      },
      {
        title: "Golden Toad",
        description: "Mythical fishing adventure with special bonus features",
        category: "fishing",
        imageUrl: "/images/goldentoad.png",
        rating: "4.6",
        jackpot: "1000000.00"
      },
      {
        title: "Fish Shooting",
        description: "Arcade-style fish shooting with multiplayer action",
        category: "fishing",
        imageUrl: "/images/fishshooting.png",
        rating: "4.5",
        jackpot: "800000.00"
      },
      {
        title: "Deep Sea Treasure",
        description: "Explore the ocean depths for hidden treasures",
        category: "fishing",
        imageUrl: "/images/deepsea.png",
        rating: "4.4",
        jackpot: "600000.00"
      }
    ];

    const initialGames: InsertGame[] = tashanwinGames;

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
