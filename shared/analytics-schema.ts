import { pgTable, serial, text, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Game Analytics Table
export const gameAnalytics = pgTable("game_analytics", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull(),
  gameTitle: text("game_title").notNull(),
  category: text("category").notNull(),
  totalPlays: integer("total_plays").default(0),
  totalBets: decimal("total_bets", { precision: 15, scale: 2 }).default("0.00"),
  totalWins: decimal("total_wins", { precision: 15, scale: 2 }).default("0.00"),
  totalLosses: decimal("total_losses", { precision: 15, scale: 2 }).default("0.00"),
  averageBetAmount: decimal("average_bet_amount", { precision: 10, scale: 2 }).default("0.00"),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0.00"), // Percentage
  popularityScore: integer("popularity_score").default(0),
  lastPlayed: timestamp("last_played"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Player Session Analytics
export const playerSessions = pgTable("player_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionId: text("session_id").notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  gamesPlayed: integer("games_played").default(0),
  totalBets: decimal("total_bets", { precision: 15, scale: 2 }).default("0.00"),
  totalWins: decimal("total_wins", { precision: 15, scale: 2 }).default("0.00"),
  netResult: decimal("net_result", { precision: 15, scale: 2 }).default("0.00"),
  deviceInfo: jsonb("device_info"),
  isActive: boolean("is_active").default(true),
});

// Real-time Game Events
export const gameEvents = pgTable("game_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gameId: integer("game_id").notNull(),
  sessionId: text("session_id").notNull(),
  eventType: text("event_type").notNull(), // 'bet', 'win', 'loss', 'jackpot'
  betAmount: decimal("bet_amount", { precision: 10, scale: 2 }),
  winAmount: decimal("win_amount", { precision: 10, scale: 2 }),
  multiplier: decimal("multiplier", { precision: 10, scale: 2 }),
  gameData: jsonb("game_data"), // Additional game-specific data
  timestamp: timestamp("timestamp").defaultNow(),
});

// Performance Metrics
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  metricType: text("metric_type").notNull(), // 'daily', 'hourly', 'weekly'
  date: timestamp("date").notNull(),
  totalUsers: integer("total_users").default(0),
  activeUsers: integer("active_users").default(0),
  totalGames: integer("total_games").default(0),
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).default("0.00"),
  totalPayouts: decimal("total_payouts", { precision: 15, scale: 2 }).default("0.00"),
  netRevenue: decimal("net_revenue", { precision: 15, scale: 2 }).default("0.00"),
  averageSessionDuration: integer("average_session_duration").default(0),
  topGameCategory: text("top_game_category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGameAnalyticsSchema = createInsertSchema(gameAnalytics);
export const insertPlayerSessionSchema = createInsertSchema(playerSessions);
export const insertGameEventSchema = createInsertSchema(gameEvents);
export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics);

export type GameAnalytics = typeof gameAnalytics.$inferSelect;
export type PlayerSession = typeof playerSessions.$inferSelect;
export type GameEvent = typeof gameEvents.$inferSelect;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;

export type InsertGameAnalytics = z.infer<typeof insertGameAnalyticsSchema>;
export type InsertPlayerSession = z.infer<typeof insertPlayerSessionSchema>;
export type InsertGameEvent = z.infer<typeof insertGameEventSchema>;
export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;