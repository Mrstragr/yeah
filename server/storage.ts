import { 
  users, games, gameCategories, userGameHistory, promotions,
  type User, type InsertUser, type Game, type InsertGame, 
  type GameCategory, type InsertGameCategory, type UserGameHistory, 
  type InsertUserGameHistory, type Promotion, type InsertPromotion 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, newBalance: string): Promise<User | undefined>;

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private gameCategories: Map<number, GameCategory>;
  private userGameHistory: Map<number, UserGameHistory>;
  private promotions: Map<number, Promotion>;
  private currentUserId: number;
  private currentGameId: number;
  private currentCategoryId: number;
  private currentHistoryId: number;
  private currentPromotionId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.gameCategories = new Map();
    this.userGameHistory = new Map();
    this.promotions = new Map();
    this.currentUserId = 1;
    this.currentGameId = 1;
    this.currentCategoryId = 1;
    this.currentHistoryId = 1;
    this.currentPromotionId = 1;

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
      {
        title: "Golden Fortune Slots",
        description: "Classic slot machine with massive jackpots",
        category: "slots",
        imageUrl: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.8",
        jackpot: "125000.00"
      },
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
        title: "Mega Lottery Draw",
        description: "Weekly lottery with massive prizes",
        category: "lottery",
        imageUrl: "https://images.unsplash.com/photo-1434873740857-1bc5653afda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.5",
        jackpot: "2847392.00"
      },
      {
        title: "Ocean Treasure Hunt",
        description: "Underwater adventure fishing game",
        category: "fishing",
        imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        rating: "4.4",
        jackpot: "35000.00"
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
      balance: "0.00",
      isActive: true,
      createdAt: new Date()
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
}

export const storage = new MemStorage();
