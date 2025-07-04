import { storage } from './storage';
import { analyticsService } from './analytics';

// AUTHENTIC MARKET-LEVEL GAME ENGINE
// Matches real Indian gaming platforms like 91Club, TC Lottery, etc.

export interface MarketGameResult {
  gameId: number;
  period: string;
  result: any;
  multiplier: number;
  winAmount: number;
  isWin: boolean;
  timestamp: Date;
  userPrediction: any;
}

export interface LiveGameSession {
  userId: number;
  gameType: string;
  sessionId: string;
  betAmount: number;
  prediction: any;
  startTime: Date;
  period: string;
  status: 'waiting' | 'completed' | 'cancelled';
}

export class MarketGameEngine {
  private liveSessions = new Map<string, LiveGameSession>();
  private gameResults = new Map<string, any>();
  private periodicTimers = new Map<string, NodeJS.Timeout>();
  
  // Market-standard periods with exact timing
  private currentPeriods: Record<string, string> = {
    wingo_30s: '',
    wingo_1min: '',
    wingo_3min: '',
    wingo_5min: '',
    wingo_10min: '',
    k3_1min: '',
    k3_3min: '',
    k3_5min: '',
    k3_10min: '',
    trx_1min: '',
    aviator: '',
    d5_1min: ''
  };

  constructor() {
    this.initializeMarketTimers();
  }

  // REAL MARKET TIMER SYSTEM
  private initializeMarketTimers() {
    // WinGo 30s periods - Exact market timing
    this.startPeriodicGame('wingo_30s', 30000, this.processWinGoResult.bind(this));
    
    // WinGo 1min periods
    this.startPeriodicGame('wingo_1min', 60000, this.processWinGoResult.bind(this));
    
    // WinGo 3min periods  
    this.startPeriodicGame('wingo_3min', 180000, this.processWinGoResult.bind(this));
    
    // WinGo 5min periods
    this.startPeriodicGame('wingo_5min', 300000, this.processWinGoResult.bind(this));
    
    // WinGo 10min periods
    this.startPeriodicGame('wingo_10min', 600000, this.processWinGoResult.bind(this));
    
    // K3 Lottery periods
    this.startPeriodicGame('k3_1min', 60000, this.processK3Result.bind(this));
    this.startPeriodicGame('k3_3min', 180000, this.processK3Result.bind(this));
    this.startPeriodicGame('k3_5min', 300000, this.processK3Result.bind(this));
    this.startPeriodicGame('k3_10min', 600000, this.processK3Result.bind(this));
    
    // TRX WinGo - Blockchain-based timing
    this.startPeriodicGame('trx_1min', 60000, this.processTRXResult.bind(this));
    
    // 5D Lottery
    this.startPeriodicGame('d5_1min', 60000, this.process5DResult.bind(this));
    
    // Aviator - Continuous crashes every 8-45 seconds
    this.startAviatorGame();
  }

  private startPeriodicGame(gameType: string, interval: number, processor: Function) {
    // Generate initial period
    this.currentPeriods[gameType] = this.generateMarketPeriod(gameType);
    
    // Set up periodic timer
    const timer = setInterval(() => {
      processor(gameType);
      this.currentPeriods[gameType] = this.generateMarketPeriod(gameType);
    }, interval);
    
    this.periodicTimers.set(gameType, timer);
  }

  // AUTHENTIC PERIOD GENERATION
  private generateMarketPeriod(gameType: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    let sequence: string;
    
    switch (gameType) {
      case 'wingo_30s':
        // 30-second periods: 2880 periods per day
        const periods30s = Math.floor((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 30);
        sequence = String(periods30s).padStart(4, '0');
        break;
        
      case 'wingo_1min':
        // 1-minute periods: 1440 periods per day
        const periods1min = now.getHours() * 60 + now.getMinutes();
        sequence = String(periods1min).padStart(4, '0');
        break;
        
      case 'wingo_3min':
        // 3-minute periods: 480 periods per day
        const periods3min = Math.floor((now.getHours() * 60 + now.getMinutes()) / 3);
        sequence = String(periods3min).padStart(3, '0');
        break;
        
      case 'wingo_5min':
        // 5-minute periods: 288 periods per day
        const periods5min = Math.floor((now.getHours() * 60 + now.getMinutes()) / 5);
        sequence = String(periods5min).padStart(3, '0');
        break;
        
      case 'wingo_10min':
        // 10-minute periods: 144 periods per day
        const periods10min = Math.floor((now.getHours() * 60 + now.getMinutes()) / 10);
        sequence = String(periods10min).padStart(3, '0');
        break;
        
      default:
        // Default sequence
        sequence = String(Date.now()).slice(-6);
    }
    
    return `${year}${month}${day}${sequence}`;
  }

  // AUTHENTIC WINGO GAME LOGIC
  async playWinGo(
    userId: number, 
    gameType: string, 
    betAmount: number, 
    betType: 'number' | 'color' | 'size', 
    betValue: any,
    quantity: number = 1
  ): Promise<MarketGameResult> {
    
    const currentPeriod = this.currentPeriods[gameType];
    const sessionId = `${gameType}_${currentPeriod}_${userId}_${Date.now()}`;
    
    // Validate user balance
    const user = await storage.getUser(userId);
    if (!user || user.walletBalance < (betAmount * quantity)) {
      throw new Error('Insufficient balance');
    }
    
    // Deduct bet amount immediately (market standard)
    const totalBet = betAmount * quantity;
    await storage.updateUserBalance(userId, user.walletBalance - totalBet);
    
    // Create live session
    const session: LiveGameSession = {
      userId,
      gameType,
      sessionId,
      betAmount: totalBet,
      prediction: { betType, betValue, quantity },
      startTime: new Date(),
      period: currentPeriod,
      status: 'waiting'
    };
    
    this.liveSessions.set(sessionId, session);
    
    // Record bet transaction
    await storage.recordTransaction({
      userId,
      type: 'bet',
      amount: totalBet,
      gameType,
      period: currentPeriod,
      details: { betType, betValue, quantity }
    });
    
    // Return pending result (will be settled at period end)
    return {
      gameId: this.getGameId(gameType),
      period: currentPeriod,
      result: null,
      multiplier: 0,
      winAmount: 0,
      isWin: false,
      timestamp: new Date(),
      userPrediction: { betType, betValue, quantity }
    };
  }

  // AUTHENTIC WINGO RESULT PROCESSING
  private async processWinGoResult(gameType: string) {
    const period = this.currentPeriods[gameType];
    
    // Generate authentic random result using market algorithms
    const result = this.generateWinGoResult();
    
    // Store result
    this.gameResults.set(`${gameType}_${period}`, {
      period,
      number: result.number,
      color: result.color,
      size: result.size,
      timestamp: new Date()
    });
    
    // Process all waiting sessions for this period
    const waitingSessions = Array.from(this.liveSessions.values())
      .filter(session => session.gameType === gameType && session.period === period && session.status === 'waiting');
    
    for (const session of waitingSessions) {
      await this.settleWinGoSession(session, result);
    }
    
    // Broadcast result to all connected clients
    this.broadcastGameResult(gameType, period, result);
  }

  private generateWinGoResult() {
    // Authentic market randomization with proper distribution
    const number = Math.floor(Math.random() * 10);
    
    let color: string;
    if (number === 0 || number === 5) {
      color = 'violet'; // 0 and 5 are violet
    } else if (number % 2 === 0) {
      color = 'red'; // 2, 4, 6, 8 are red
    } else {
      color = 'green'; // 1, 3, 7, 9 are green
    }
    
    const size = number >= 5 ? 'big' : 'small';
    
    return { number, color, size };
  }

  private async settleWinGoSession(session: LiveGameSession, result: any) {
    const { betType, betValue, quantity } = session.prediction;
    let isWin = false;
    let multiplier = 0;
    
    // Market-standard multipliers
    switch (betType) {
      case 'number':
        isWin = result.number === betValue;
        multiplier = isWin ? 9.0 : 0; // Number bet: 1:9 payout
        break;
        
      case 'color':
        isWin = result.color === betValue;
        if (betValue === 'violet') {
          multiplier = isWin ? 4.5 : 0; // Violet: 1:4.5 payout (lower probability)
        } else {
          multiplier = isWin ? 2.0 : 0; // Red/Green: 1:2 payout
        }
        break;
        
      case 'size':
        isWin = result.size === betValue;
        multiplier = isWin ? 2.0 : 0; // Big/Small: 1:2 payout
        break;
    }
    
    const winAmount = isWin ? Math.floor(session.betAmount * multiplier) : 0;
    
    // Process winnings
    if (isWin && winAmount > 0) {
      const user = await storage.getUser(session.userId);
      if (user) {
        await storage.updateUserBalance(session.userId, user.walletBalance + winAmount);
        
        // Record win transaction
        await storage.recordTransaction({
          userId: session.userId,
          type: 'win',
          amount: winAmount,
          gameType: session.gameType,
          period: session.period,
          details: { result, prediction: session.prediction, multiplier }
        });
      }
    }
    
    // Update session status
    session.status = 'completed';
    
    // Update analytics
    await analyticsService.trackGameEvent(
      session.userId,
      this.getGameId(session.gameType),
      session.sessionId,
      'game_result',
      {
        period: session.period,
        betAmount: session.betAmount,
        winAmount,
        isWin,
        multiplier,
        result,
        prediction: session.prediction
      }
    );
  }

  // K3 LOTTERY AUTHENTIC LOGIC
  async playK3(
    userId: number, 
    gameType: string, 
    betAmount: number, 
    betType: 'sum' | 'straight' | 'combination',
    betValue: any,
    quantity: number = 1
  ): Promise<MarketGameResult> {
    
    const currentPeriod = this.currentPeriods[gameType];
    const sessionId = `${gameType}_${currentPeriod}_${userId}_${Date.now()}`;
    
    // Validate and deduct balance
    const user = await storage.getUser(userId);
    const totalBet = betAmount * quantity;
    if (!user || user.walletBalance < totalBet) {
      throw new Error('Insufficient balance');
    }
    
    await storage.updateUserBalance(userId, user.walletBalance - totalBet);
    
    // Create session
    const session: LiveGameSession = {
      userId,
      gameType,
      sessionId,
      betAmount: totalBet,
      prediction: { betType, betValue, quantity },
      startTime: new Date(),
      period: currentPeriod,
      status: 'waiting'
    };
    
    this.liveSessions.set(sessionId, session);
    
    return {
      gameId: this.getGameId(gameType),
      period: currentPeriod,
      result: null,
      multiplier: 0,
      winAmount: 0,
      isWin: false,
      timestamp: new Date(),
      userPrediction: { betType, betValue, quantity }
    };
  }

  private async processK3Result(gameType: string) {
    const period = this.currentPeriods[gameType];
    
    // Generate K3 result: 3 dice (1-6 each)
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const dice3 = Math.floor(Math.random() * 6) + 1;
    const sum = dice1 + dice2 + dice3;
    
    const result = {
      dice: [dice1, dice2, dice3],
      sum,
      isSmall: sum >= 3 && sum <= 10,
      isBig: sum >= 11 && sum <= 18,
      isOdd: sum % 2 === 1,
      isEven: sum % 2 === 0
    };
    
    this.gameResults.set(`${gameType}_${period}`, {
      period,
      ...result,
      timestamp: new Date()
    });
    
    // Process waiting sessions
    const waitingSessions = Array.from(this.liveSessions.values())
      .filter(session => session.gameType === gameType && session.period === period && session.status === 'waiting');
    
    for (const session of waitingSessions) {
      await this.settleK3Session(session, result);
    }
    
    this.broadcastGameResult(gameType, period, result);
  }

  private async settleK3Session(session: LiveGameSession, result: any) {
    const { betType, betValue } = session.prediction;
    let isWin = false;
    let multiplier = 0;
    
    switch (betType) {
      case 'sum':
        isWin = result.sum === betValue;
        multiplier = this.getK3SumMultiplier(betValue);
        break;
        
      case 'straight':
        // Exact combination match
        isWin = JSON.stringify(result.dice.sort()) === JSON.stringify(betValue.sort());
        multiplier = isWin ? 216 : 0; // 1:216 for exact match
        break;
        
      case 'combination':
        if (betValue === 'small') {
          isWin = result.isSmall;
          multiplier = 2;
        } else if (betValue === 'big') {
          isWin = result.isBig;
          multiplier = 2;
        } else if (betValue === 'odd') {
          isWin = result.isOdd;
          multiplier = 2;
        } else if (betValue === 'even') {
          isWin = result.isEven;
          multiplier = 2;
        }
        break;
    }
    
    const winAmount = isWin ? Math.floor(session.betAmount * multiplier) : 0;
    
    if (isWin && winAmount > 0) {
      const user = await storage.getUser(session.userId);
      if (user) {
        await storage.updateUserBalance(session.userId, user.walletBalance + winAmount);
        await storage.recordTransaction({
          userId: session.userId,
          type: 'win',
          amount: winAmount,
          gameType: session.gameType,
          period: session.period,
          details: { result, prediction: session.prediction, multiplier }
        });
      }
    }
    
    session.status = 'completed';
  }

  private getK3SumMultiplier(sum: number): number {
    // Authentic K3 sum multipliers based on probability
    const multipliers = {
      3: 216, 4: 108, 5: 72, 6: 54, 7: 36, 8: 24, 9: 18,
      10: 14, 11: 14, 12: 18, 13: 24, 14: 36, 15: 54, 16: 72, 17: 108, 18: 216
    };
    return multipliers[sum] || 0;
  }

  // AVIATOR AUTHENTIC IMPLEMENTATION
  private startAviatorGame() {
    this.runAviatorRound();
  }

  private async runAviatorRound() {
    const roundId = `aviator_${Date.now()}`;
    const crashMultiplier = this.generateAviatorCrash();
    
    // Betting phase: 5 seconds
    const bettingEndTime = Date.now() + 5000;
    
    // Flight phase: multiplier increases until crash
    setTimeout(() => {
      this.processAviatorRound(roundId, crashMultiplier);
    }, 5000);
    
    // Schedule next round
    setTimeout(() => {
      this.runAviatorRound();
    }, Math.random() * 10000 + 8000); // 8-18 seconds between rounds
  }

  private generateAviatorCrash(): number {
    // Authentic Aviator crash distribution
    const random = Math.random();
    
    if (random < 0.33) return 1.0 + Math.random() * 0.99; // 33% crash below 2x
    if (random < 0.66) return 2.0 + Math.random() * 3.0;  // 33% crash 2x-5x
    if (random < 0.90) return 5.0 + Math.random() * 15.0; // 24% crash 5x-20x
    if (random < 0.99) return 20.0 + Math.random() * 80.0; // 9% crash 20x-100x
    return 100.0 + Math.random() * 900.0; // 1% crash above 100x
  }

  private async processAviatorRound(roundId: string, crashMultiplier: number) {
    // Process all aviator bets for this round
    const aviatorSessions = Array.from(this.liveSessions.values())
      .filter(session => session.gameType === 'aviator' && session.sessionId.includes(roundId));
    
    for (const session of aviatorSessions) {
      await this.settleAviatorSession(session, crashMultiplier);
    }
    
    this.broadcastGameResult('aviator', roundId, { crashMultiplier });
  }

  private async settleAviatorSession(session: LiveGameSession, crashMultiplier: number) {
    const { cashoutMultiplier } = session.prediction;
    const isWin = cashoutMultiplier <= crashMultiplier;
    const winAmount = isWin ? Math.floor(session.betAmount * cashoutMultiplier) : 0;
    
    if (isWin && winAmount > 0) {
      const user = await storage.getUser(session.userId);
      if (user) {
        await storage.updateUserBalance(session.userId, user.walletBalance + winAmount);
        await storage.recordTransaction({
          userId: session.userId,
          type: 'win',
          amount: winAmount,
          gameType: 'aviator',
          period: session.sessionId,
          details: { crashMultiplier, cashoutMultiplier, isWin }
        });
      }
    }
    
    session.status = 'completed';
  }

  // 5D LOTTERY IMPLEMENTATION
  private async process5DResult(gameType: string) {
    const period = this.currentPeriods[gameType];
    
    // Generate 5D result: 5 digits (0-9 each)
    const digits = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
    const sum = digits.reduce((a, b) => a + b, 0);
    
    const result = {
      digits,
      sum,
      isOdd: sum % 2 === 1,
      isEven: sum % 2 === 0,
      isBig: sum >= 23,
      isSmall: sum <= 22
    };
    
    this.gameResults.set(`${gameType}_${period}`, {
      period,
      ...result,
      timestamp: new Date()
    });
    
    // Process waiting sessions
    const waitingSessions = Array.from(this.liveSessions.values())
      .filter(session => session.gameType === gameType && session.period === period && session.status === 'waiting');
    
    for (const session of waitingSessions) {
      await this.settle5DSession(session, result);
    }
    
    this.broadcastGameResult(gameType, period, result);
  }

  private async settle5DSession(session: LiveGameSession, result: any) {
    const { betType, betValue } = session.prediction;
    let isWin = false;
    let multiplier = 0;
    
    switch (betType) {
      case 'sum':
        isWin = result.sum === betValue;
        multiplier = this.get5DSumMultiplier(betValue);
        break;
        
      case 'digit_position':
        const { position, digit } = betValue;
        isWin = result.digits[position] === digit;
        multiplier = isWin ? 9.0 : 0;
        break;
        
      case 'property':
        if (betValue === 'big') isWin = result.isBig;
        else if (betValue === 'small') isWin = result.isSmall;
        else if (betValue === 'odd') isWin = result.isOdd;
        else if (betValue === 'even') isWin = result.isEven;
        multiplier = isWin ? 2.0 : 0;
        break;
    }
    
    const winAmount = isWin ? Math.floor(session.betAmount * multiplier) : 0;
    
    if (isWin && winAmount > 0) {
      const user = await storage.getUser(session.userId);
      if (user) {
        await storage.updateUserBalance(session.userId, user.walletBalance + winAmount);
        await storage.recordTransaction({
          userId: session.userId,
          type: 'win',
          amount: winAmount,
          gameType: session.gameType,
          period: session.period,
          details: { result, prediction: session.prediction, multiplier }
        });
      }
    }
    
    session.status = 'completed';
  }

  private get5DSumMultiplier(sum: number): number {
    // 5D sum multipliers (0-45 possible sums)
    if (sum <= 5 || sum >= 40) return 45;
    if (sum <= 10 || sum >= 35) return 25;
    if (sum <= 15 || sum >= 30) return 15;
    if (sum <= 20 || sum >= 25) return 8;
    return 5;
  }

  // TRX WINGO IMPLEMENTATION
  private async processTRXResult(gameType: string) {
    const period = this.currentPeriods[gameType];
    
    // Simulate TRX price-based result (in real implementation, fetch from Tron network)
    const mockTrxPrice = 0.1 + Math.random() * 0.05; // Mock TRX price
    const lastDigit = Math.floor((mockTrxPrice * 10000) % 10);
    
    let color: string;
    if (lastDigit === 0 || lastDigit === 5) {
      color = 'violet';
    } else if (lastDigit % 2 === 0) {
      color = 'red';
    } else {
      color = 'green';
    }
    
    const size = lastDigit >= 5 ? 'big' : 'small';
    
    const result = {
      number: lastDigit,
      color,
      size,
      trxPrice: mockTrxPrice
    };
    
    this.gameResults.set(`${gameType}_${period}`, {
      period,
      ...result,
      timestamp: new Date()
    });
    
    // Process sessions (same as WinGo)
    const waitingSessions = Array.from(this.liveSessions.values())
      .filter(session => session.gameType === gameType && session.period === period && session.status === 'waiting');
    
    for (const session of waitingSessions) {
      await this.settleWinGoSession(session, result);
    }
    
    this.broadcastGameResult(gameType, period, result);
  }

  // UTILITY METHODS
  private getGameId(gameType: string): number {
    const gameIds = {
      'wingo_30s': 1,
      'wingo_1min': 2,
      'wingo_3min': 3,
      'wingo_5min': 4,
      'wingo_10min': 5,
      'k3_1min': 6,
      'k3_3min': 7,
      'k3_5min': 8,
      'k3_10min': 9,
      'trx_1min': 10,
      'd5_1min': 11,
      'aviator': 12
    };
    return gameIds[gameType] || 0;
  }

  private broadcastGameResult(gameType: string, period: string, result: any) {
    // In a real implementation, broadcast to WebSocket clients
    console.log(`🎲 ${gameType.toUpperCase()} Result - Period ${period}:`, result);
  }

  // PUBLIC API METHODS
  getCurrentPeriod(gameType: string): string {
    return this.currentPeriods[gameType] || '';
  }

  getGameResult(gameType: string, period: string): any {
    return this.gameResults.get(`${gameType}_${period}`);
  }

  getLatestResults(gameType: string, limit: number = 10): any[] {
    const results = Array.from(this.gameResults.entries())
      .filter(([key]) => key.startsWith(gameType))
      .sort(([, a], [, b]) => b.timestamp - a.timestamp)
      .slice(0, limit)
      .map(([, result]) => result);
    
    return results;
  }

  // Get live statistics
  async getLiveStats(): Promise<any> {
    const activeUsers = new Set(Array.from(this.liveSessions.values()).map(s => s.userId)).size;
    const totalBets = Array.from(this.liveSessions.values()).length;
    
    return {
      activeUsers,
      totalBets,
      currentPeriods: this.currentPeriods,
      gamesRunning: Object.keys(this.currentPeriods).length
    };
  }

  // Cleanup
  destroy() {
    for (const timer of this.periodicTimers.values()) {
      clearInterval(timer);
    }
    this.periodicTimers.clear();
    this.liveSessions.clear();
    this.gameResults.clear();
  }
}

export const marketGameEngine = new MarketGameEngine();