import { db } from "./db";
import { users, gameResults } from "@shared/schema";
import { eq, sql, desc, and, gte, lte } from "drizzle-orm";

export class AnalyticsService {
  // Track game event
  async trackGameEvent(userId: number, gameId: number, sessionId: string, eventType: string, data: any) {
    try {
      // Insert game event
      await db.insert(gameEvents).values({
        userId,
        gameId,
        sessionId,
        eventType,
        betAmount: data.betAmount?.toString(),
        winAmount: data.winAmount?.toString(),
        multiplier: data.multiplier?.toString(),
      });

      // Update game analytics
      await this.updateGameAnalytics(gameId, data);
      
      // Update session analytics
      await this.updateSessionAnalytics(sessionId, data);

    } catch (error) {
      console.error("Error tracking game event:", error);
    }
  }

  // Update game analytics
  async updateGameAnalytics(gameId: number, data: any) {
    try {
      const game = await db.select().from(games).where(eq(games.id, gameId)).limit(1);
      if (!game.length) return;

      const gameData = game[0];
      
      // Get or create analytics record
      let analytics = await db.select().from(gameAnalytics)
        .where(eq(gameAnalytics.gameId, gameId)).limit(1);

      if (!analytics.length) {
        // Create new analytics record
        await db.insert(gameAnalytics).values({
          gameId,
          gameTitle: gameData.title,
          category: gameData.category,
          totalPlays: 1,
          totalBets: data.betAmount?.toString() || "0",
          totalWins: data.winAmount?.toString() || "0",
          totalLosses: data.winAmount > 0 ? "0" : (data.betAmount?.toString() || "0"),
          averageBetAmount: data.betAmount?.toString() || "0",
          winRate: data.winAmount > 0 ? "100" : "0",
          popularityScore: 1,
          lastPlayed: new Date(),
        });
      } else {
        // Update existing analytics
        const current = analytics[0];
        const newTotalPlays = (current.totalPlays || 0) + 1;
        const newTotalBets = parseFloat(current.totalBets || "0") + (data.betAmount || 0);
        const newTotalWins = parseFloat(current.totalWins || "0") + (data.winAmount || 0);
        const newTotalLosses = parseFloat(current.totalLosses || "0") + (data.winAmount > 0 ? 0 : (data.betAmount || 0));
        const newWinRate = newTotalPlays > 0 ? ((newTotalWins / newTotalBets) * 100) : 0;

        await db.update(gameAnalytics)
          .set({
            totalPlays: newTotalPlays,
            totalBets: newTotalBets.toString(),
            totalWins: newTotalWins.toString(),
            totalLosses: newTotalLosses.toString(),
            averageBetAmount: (newTotalBets / newTotalPlays).toString(),
            winRate: newWinRate.toString(),
            popularityScore: newTotalPlays,
            lastPlayed: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(gameAnalytics.gameId, gameId));
      }
    } catch (error) {
      console.error("Error updating game analytics:", error);
    }
  }

  // Update session analytics
  async updateSessionAnalytics(sessionId: string, data: any) {
    try {
      const session = await db.select().from(playerSessions)
        .where(eq(playerSessions.sessionId, sessionId)).limit(1);

      if (session.length) {
        const current = session[0];
        const newGamesPlayed = (current.gamesPlayed || 0) + 1;
        const newTotalBets = parseFloat(current.totalBets || "0") + (data.betAmount || 0);
        const newTotalWins = parseFloat(current.totalWins || "0") + (data.winAmount || 0);
        const newNetResult = newTotalWins - newTotalBets;

        await db.update(playerSessions)
          .set({
            gamesPlayed: newGamesPlayed,
            totalBets: newTotalBets.toString(),
            totalWins: newTotalWins.toString(),
            netResult: newNetResult.toString(),
          })
          .where(eq(playerSessions.sessionId, sessionId));
      }
    } catch (error) {
      console.error("Error updating session analytics:", error);
    }
  }

  // Start new session
  async startSession(userId: number, sessionId: string) {
    try {
      await db.insert(playerSessions).values({
        userId,
        sessionId,
        startTime: new Date(),
        isActive: true,
      });
    } catch (error) {
      console.error("Error starting session:", error);
    }
  }

  // End session
  async endSession(sessionId: string) {
    try {
      const session = await db.select().from(playerSessions)
        .where(eq(playerSessions.sessionId, sessionId)).limit(1);

      if (session.length) {
        const startTime = session[0].startTime;
        const duration = startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0;

        await db.update(playerSessions)
          .set({
            endTime: new Date(),
            duration,
            isActive: false,
          })
          .where(eq(playerSessions.sessionId, sessionId));
      }
    } catch (error) {
      console.error("Error ending session:", error);
    }
  }

  // Get game analytics
  async getGameAnalytics(limit: number = 10) {
    try {
      return await db.select().from(gameAnalytics)
        .orderBy(desc(gameAnalytics.popularityScore))
        .limit(limit);
    } catch (error) {
      console.error("Error getting game analytics:", error);
      return [];
    }
  }

  // Get player performance
  async getPlayerPerformance(userId: number) {
    try {
      const sessions = await db.select().from(playerSessions)
        .where(eq(playerSessions.userId, userId))
        .orderBy(desc(playerSessions.startTime))
        .limit(10);

      const events = await db.select().from(gameEvents)
        .where(eq(gameEvents.userId, userId))
        .orderBy(desc(gameEvents.timestamp))
        .limit(50);

      return { sessions, events };
    } catch (error) {
      console.error("Error getting player performance:", error);
      return { sessions: [], events: [] };
    }
  }

  // Get real-time statistics
  async getRealTimeStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Active sessions count
      const activeSessions = await db.select({ count: sql<number>`count(*)` })
        .from(playerSessions)
        .where(eq(playerSessions.isActive, true));

      // Today's games played
      const todayGames = await db.select({ count: sql<number>`count(*)` })
        .from(gameEvents)
        .where(gte(gameEvents.timestamp, today));

      // Today's total bets
      const todayBets = await db.select({ 
        total: sql<number>`sum(CAST(bet_amount as DECIMAL))` 
      }).from(gameEvents)
        .where(and(
          gte(gameEvents.timestamp, today),
          eq(gameEvents.eventType, 'bet')
        ));

      // Today's total wins
      const todayWins = await db.select({ 
        total: sql<number>`sum(CAST(win_amount as DECIMAL))` 
      }).from(gameEvents)
        .where(and(
          gte(gameEvents.timestamp, today),
          eq(gameEvents.eventType, 'win')
        ));

      // Most popular games today
      const popularGames = await db.select({
        gameId: gameEvents.gameId,
        gameTitle: gameAnalytics.gameTitle,
        plays: sql<number>`count(*)`,
      })
        .from(gameEvents)
        .leftJoin(gameAnalytics, eq(gameEvents.gameId, gameAnalytics.gameId))
        .where(gte(gameEvents.timestamp, today))
        .groupBy(gameEvents.gameId, gameAnalytics.gameTitle)
        .orderBy(desc(sql`count(*)`))
        .limit(5);

      return {
        activeSessions: activeSessions[0]?.count || 0,
        todayGames: todayGames[0]?.count || 0,
        todayBets: todayBets[0]?.total || 0,
        todayWins: todayWins[0]?.total || 0,
        popularGames: popularGames || [],
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Error getting real-time stats:", error);
      return {
        activeSessions: 0,
        todayGames: 0,
        todayBets: 0,
        todayWins: 0,
        popularGames: [],
        timestamp: new Date(),
      };
    }
  }
}

export const analyticsService = new AnalyticsService();