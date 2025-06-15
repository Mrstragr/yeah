import { apiRequest } from './queryClient';

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    phone: string;
    balance: string;
    walletBalance: string;
    bonusBalance: string;
    vipLevel: number;
    kycStatus: string;
  };
  token: string;
}

export interface GameResult {
  gameId: number;
  result: any;
  multiplier?: number;
  winAmount: number;
  isWin: boolean;
}

export class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Authentication
  async login(credentials: { phone?: string; email?: string; password: string }): Promise<AuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  async register(userData: {
    phone: string;
    email?: string;
    password: string;
    username?: string;
    referralCode?: string;
  }): Promise<AuthResponse> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    const data = await response.json();
    this.setToken(data.token);
    return data;
  }

  async getProfile() {
    const response = await fetch('/api/auth/profile', {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get profile');
    }
    
    return response.json();
  }

  // Games
  async getGames() {
    const response = await fetch('/api/games', {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getGameCategories() {
    const response = await fetch('/api/games/categories');
    return response.json();
  }

  async getRecommendedGames() {
    const response = await fetch('/api/games/recommended', {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Game Play
  async playWinGo(betAmount: number, betType: string, betValue: any): Promise<GameResult> {
    const response = await fetch('/api/games/wingo/play', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ betAmount, betType, betValue }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Game play failed');
    }
    
    return response.json();
  }

  async playK3Lottery(betAmount: number, betType: string, betValue: any): Promise<GameResult> {
    const response = await fetch('/api/games/k3/play', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ betAmount, betType, betValue }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Game play failed');
    }
    
    return response.json();
  }

  async playAviator(betAmount: number, cashOutMultiplier?: number): Promise<GameResult> {
    const response = await fetch('/api/games/aviator/play', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ betAmount, cashOutMultiplier }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Game play failed');
    }
    
    return response.json();
  }

  async playMines(betAmount: number, mineCount: number, revealedTiles: number[]): Promise<GameResult> {
    const response = await fetch('/api/games/mines/play', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ betAmount, mineCount, revealedTiles }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Game play failed');
    }
    
    return response.json();
  }

  async playDice(betAmount: number, prediction: 'over' | 'under', targetNumber: number): Promise<GameResult> {
    const response = await fetch('/api/games/dice/play', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ betAmount, prediction, targetNumber }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Game play failed');
    }
    
    return response.json();
  }

  async playDragonTiger(betAmount: number, betType: 'dragon' | 'tiger' | 'tie'): Promise<GameResult> {
    const response = await fetch('/api/games/dragon-tiger/play', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ betAmount, betType }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Game play failed');
    }
    
    return response.json();
  }

  // Wallet
  async getWalletBalance() {
    const response = await fetch('/api/wallet/balance', {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get balance');
    }
    
    return response.json();
  }

  async getTransactions(limit = 20) {
    const response = await fetch(`/api/wallet/transactions?limit=${limit}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async deposit(amount: number, paymentMethod: string) {
    const response = await fetch('/api/wallet/deposit', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount, paymentMethod }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Deposit failed');
    }
    
    return response.json();
  }

  async withdraw(amount: number, paymentMethod: string) {
    const response = await fetch('/api/wallet/withdraw', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount, paymentMethod }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Withdrawal failed');
    }
    
    return response.json();
  }

  // User Data
  async getGameHistory() {
    const response = await fetch('/api/user/game-history', {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Analytics
  async getLiveStats() {
    const response = await fetch('/api/live-stats');
    return response.json();
  }

  async getTopEarners(limit = 5) {
    const response = await fetch(`/api/analytics/top-earners?limit=${limit}`);
    return response.json();
  }

  // Promotions
  async getPromotions() {
    const response = await fetch('/api/promotions');
    return response.json();
  }
}

export const apiService = new ApiService();