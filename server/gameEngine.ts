import { storage } from './storage';
import { analyticsService } from './analytics';
import WebSocket from 'ws';

export interface GameResult {
  gameId: number;
  result: any;
  multiplier?: number;
  winAmount: number;
  isWin: boolean;
}

export interface GameSession {
  userId: number;
  gameId: number;
  sessionId: string;
  betAmount: number;
  startTime: Date;
  endTime?: Date;
  result?: GameResult;
}

export class GameEngine {
  private activeSessions = new Map<string, GameSession>();
  private winGoResults = new Map<string, { period: string; result: number }>();
  private k3Results = new Map<string, { period: string; result: number[] }>();
  private aviatorMultipliers = new Map<string, { multiplier: number; crashed: boolean }>();

  // WIN GO Game Logic
  async playWinGo(userId: number, betAmount: number, betType: string, betValue: any): Promise<GameResult> {
    const sessionId = `wingo_${Date.now()}_${userId}`;
    const gameId = 1; // WIN GO game ID
    
    // Generate random result (0-9)
    const result = Math.floor(Math.random() * 10);
    const period = this.generatePeriod();
    
    // Store result for real-time updates
    this.winGoResults.set(period, { period, result });
    
    // Calculate win based on bet type
    let isWin = false;
    let multiplier = 0;
    
    switch (betType) {
      case 'number':
        isWin = result === betValue;
        multiplier = isWin ? 9 : 0;
        break;
      case 'color':
        const colorMap = { 0: 'red', 1: 'green', 2: 'red', 3: 'green', 4: 'red', 5: 'violet', 6: 'red', 7: 'green', 8: 'red', 9: 'green' };
        isWin = colorMap[result] === betValue;
        multiplier = isWin ? (betValue === 'violet' ? 4.5 : 2) : 0;
        break;
      case 'size':
        const size = result < 5 ? 'small' : 'big';
        isWin = size === betValue;
        multiplier = isWin ? 2 : 0;
        break;
    }
    
    const winAmount = isWin ? betAmount * multiplier : 0;
    
    // Update user balance and record transaction
    if (isWin) {
      await storage.updateUserWalletBalance(userId, ((await storage.getUser(userId))?.walletBalance || '0'));
    }
    
    // Record game history
    await storage.addGameHistory({
      userId,
      gameId,
      betAmount: betAmount.toString(),
      winAmount: winAmount.toString()
    });
    
    // Track analytics
    await analyticsService.trackGameEvent(userId, gameId, sessionId, 'game_complete', {
      betAmount,
      winAmount,
      multiplier,
      result
    });
    
    return {
      gameId,
      result: { number: result, period },
      multiplier,
      winAmount,
      isWin
    };
  }

  // K3 Lottery Game Logic
  async playK3Lottery(userId: number, betAmount: number, betType: string, betValue: any): Promise<GameResult> {
    const sessionId = `k3_${Date.now()}_${userId}`;
    const gameId = 2; // K3 game ID
    
    // Generate random dice results (3 dice, 1-6 each)
    const dice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    const sum = dice.reduce((a, b) => a + b, 0);
    const period = this.generatePeriod();
    
    // Store result for real-time updates
    this.k3Results.set(period, { period, result: dice });
    
    // Calculate win based on bet type
    let isWin = false;
    let multiplier = 0;
    
    switch (betType) {
      case 'sum':
        isWin = sum === betValue;
        multiplier = isWin ? this.getK3SumMultiplier(betValue) : 0;
        break;
      case 'size':
        const size = sum <= 10 ? 'small' : 'big';
        isWin = size === betValue;
        multiplier = isWin ? 2 : 0;
        break;
      case 'parity':
        const parity = sum % 2 === 0 ? 'even' : 'odd';
        isWin = parity === betValue;
        multiplier = isWin ? 2 : 0;
        break;
    }
    
    const winAmount = isWin ? betAmount * multiplier : 0;
    
    // Record game history
    await storage.addGameHistory({
      userId,
      gameId,
      betAmount: betAmount.toString(),
      winAmount: winAmount.toString()
    });
    
    return {
      gameId,
      result: { dice, sum, period },
      multiplier,
      winAmount,
      isWin
    };
  }

  // Aviator Game Logic
  async playAviator(userId: number, betAmount: number, cashOutMultiplier?: number): Promise<GameResult> {
    const sessionId = `aviator_${Date.now()}_${userId}`;
    const gameId = 3; // Aviator game ID
    
    // Generate crash multiplier (realistic distribution)
    const crashMultiplier = this.generateAviatorMultiplier();
    
    // Determine if player wins
    const playerCashOut = cashOutMultiplier || 1;
    const isWin = playerCashOut <= crashMultiplier;
    const winAmount = isWin ? betAmount * playerCashOut : 0;
    
    // Record game history
    await storage.addGameHistory({
      userId,
      gameId,
      betAmount: betAmount.toString(),
      winAmount: winAmount.toString()
    });
    
    return {
      gameId,
      result: { crashMultiplier, playerCashOut },
      multiplier: playerCashOut,
      winAmount,
      isWin
    };
  }

  // Mines Game Logic
  async playMines(userId: number, betAmount: number, mineCount: number, revealedTiles: number[]): Promise<GameResult> {
    const sessionId = `mines_${Date.now()}_${userId}`;
    const gameId = 4; // Mines game ID
    
    // Generate mine positions
    const totalTiles = 25;
    const minePositions = this.generateMinePositions(totalTiles, mineCount);
    
    // Check if player hit a mine
    const hitMine = revealedTiles.some(tile => minePositions.includes(tile));
    const multiplier = hitMine ? 0 : this.calculateMinesMultiplier(revealedTiles.length, mineCount);
    const winAmount = hitMine ? 0 : betAmount * multiplier;
    
    // Record game history
    await storage.addGameHistory({
      userId,
      gameId,
      betAmount: betAmount.toString(),
      winAmount: winAmount.toString()
    });
    
    return {
      gameId,
      result: { minePositions, revealedTiles, hitMine },
      multiplier,
      winAmount,
      isWin: !hitMine
    };
  }

  // Dice Game Logic
  async playDice(userId: number, betAmount: number, prediction: 'over' | 'under', targetNumber: number): Promise<GameResult> {
    const sessionId = `dice_${Date.now()}_${userId}`;
    const gameId = 5; // Dice game ID
    
    // Generate random number (1-100)
    const result = Math.floor(Math.random() * 100) + 1;
    
    // Check win condition
    const isWin = prediction === 'over' ? result > targetNumber : result < targetNumber;
    const multiplier = isWin ? this.calculateDiceMultiplier(prediction, targetNumber) : 0;
    const winAmount = isWin ? betAmount * multiplier : 0;
    
    // Record game history
    await storage.addGameHistory({
      userId,
      gameId,
      betAmount: betAmount.toString(),
      winAmount: winAmount.toString()
    });
    
    return {
      gameId,
      result: { diceResult: result, prediction, targetNumber },
      multiplier,
      winAmount,
      isWin
    };
  }

  // Dragon Tiger Game Logic
  async playDragonTiger(userId: number, betAmount: number, betType: 'dragon' | 'tiger' | 'tie'): Promise<GameResult> {
    const sessionId = `dt_${Date.now()}_${userId}`;
    const gameId = 6; // Dragon Tiger game ID
    
    // Generate random cards
    const dragonCard = Math.floor(Math.random() * 13) + 1; // 1-13 (A-K)
    const tigerCard = Math.floor(Math.random() * 13) + 1;
    
    // Determine winner
    let result: 'dragon' | 'tiger' | 'tie';
    if (dragonCard > tigerCard) result = 'dragon';
    else if (tigerCard > dragonCard) result = 'tiger';
    else result = 'tie';
    
    const isWin = result === betType;
    const multiplier = isWin ? (betType === 'tie' ? 8 : 2) : 0;
    const winAmount = isWin ? betAmount * multiplier : 0;
    
    // Record game history
    await storage.addGameHistory({
      userId,
      gameId,
      betAmount: betAmount.toString(),
      winAmount: winAmount.toString()
    });
    
    return {
      gameId,
      result: { dragonCard, tigerCard, winner: result },
      multiplier,
      winAmount,
      isWin
    };
  }

  // Helper methods
  private generatePeriod(): string {
    const now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${Math.floor(now.getMinutes() / 3).toString().padStart(2, '0')}`;
  }

  private getK3SumMultiplier(sum: number): number {
    const multipliers = {
      3: 180, 4: 60, 5: 30, 6: 18, 7: 12, 8: 8, 9: 7, 10: 6,
      11: 6, 12: 7, 13: 8, 14: 12, 15: 18, 16: 30, 17: 60, 18: 180
    };
    return multipliers[sum as keyof typeof multipliers] || 0;
  }

  private generateAviatorMultiplier(): number {
    // Realistic Aviator crash distribution
    const rand = Math.random();
    if (rand < 0.33) return 1 + Math.random() * 1; // 1.0x - 2.0x (33%)
    if (rand < 0.65) return 2 + Math.random() * 3; // 2.0x - 5.0x (32%)
    if (rand < 0.85) return 5 + Math.random() * 10; // 5.0x - 15.0x (20%)
    if (rand < 0.95) return 15 + Math.random() * 35; // 15.0x - 50.0x (10%)
    return 50 + Math.random() * 950; // 50.0x - 1000.0x (5%)
  }

  private generateMinePositions(totalTiles: number, mineCount: number): number[] {
    const positions: number[] = [];
    while (positions.length < mineCount) {
      const pos = Math.floor(Math.random() * totalTiles);
      if (!positions.includes(pos)) {
        positions.push(pos);
      }
    }
    return positions;
  }

  private calculateMinesMultiplier(revealedCount: number, mineCount: number): number {
    const safeTiles = 25 - mineCount;
    if (revealedCount === 0) return 1;
    
    // Calculate multiplier based on risk
    let multiplier = 1;
    for (let i = 0; i < revealedCount; i++) {
      multiplier *= (safeTiles) / (safeTiles - i);
    }
    return Math.round(multiplier * 100) / 100;
  }

  private calculateDiceMultiplier(prediction: 'over' | 'under', targetNumber: number): number {
    const winChance = prediction === 'over' ? (100 - targetNumber) / 100 : targetNumber / 100;
    return Math.round((0.99 / winChance) * 100) / 100; // 1% house edge
  }

  // Real-time game data for live updates
  getLatestWinGoResult(): any {
    const latest = Array.from(this.winGoResults.values()).pop();
    return latest || null;
  }

  getLatestK3Result(): any {
    const latest = Array.from(this.k3Results.values()).pop();
    return latest || null;
  }

  // Get live game statistics
  async getLiveStats(): Promise<any> {
    const stats = await analyticsService.getRealTimeStats();
    return {
      totalPlayers: stats.activePlayers,
      totalBets: stats.totalBetsToday,
      totalWins: stats.totalWinsToday,
      biggestWin: stats.biggestWinToday,
      activeGames: 6
    };
  }
}

export const gameEngine = new GameEngine();