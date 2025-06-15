import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull().default("0.00"),
  walletBalance: decimal("wallet_balance", { precision: 15, scale: 2 }).notNull().default("0.00"),
  bonusBalance: decimal("bonus_balance", { precision: 15, scale: 2 }).notNull().default("0.00"),
  kycStatus: text("kyc_status").notNull().default("pending"),
  avatar: text("avatar"),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  vipLevel: integer("vip_level").notNull().default(0),
  totalDeposit: decimal("total_deposit", { precision: 15, scale: 2 }).notNull().default("0.00"),
  totalWithdraw: decimal("total_withdraw", { precision: 15, scale: 2 }).notNull().default("0.00"),
  totalBet: decimal("total_bet", { precision: 15, scale: 2 }).notNull().default("0.00"),
  totalWin: decimal("total_win", { precision: 15, scale: 2 }).notNull().default("0.00"),
  loginBonus: boolean("login_bonus").notNull().default(false),
  lastLoginAt: timestamp("last_login_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull().default("0.0"),
  isActive: boolean("is_active").notNull().default(true),
  jackpot: decimal("jackpot", { precision: 12, scale: 2 }).notNull().default("0.00"),
});

export const gameCategories = pgTable("game_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const userGameHistory = pgTable("user_game_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  gameId: integer("game_id").notNull().references(() => games.id),
  betAmount: decimal("bet_amount", { precision: 10, scale: 2 }).notNull(),
  winAmount: decimal("win_amount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  playedAt: timestamp("played_at").notNull().defaultNow(),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpayOrderId: text("razorpay_order_id"),
  gameId: integer("game_id").references(() => games.id),
  description: text("description"),
  balanceBefore: decimal("balance_before", { precision: 10, scale: 2 }),
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const kycDocuments = pgTable("kyc_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  documentType: text("document_type").notNull(),
  documentUrl: text("document_url").notNull(),
  status: text("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  condition: text("condition").notNull(),
  reward: decimal("reward", { precision: 10, scale: 2 }).notNull().default("0.00"),
  xpValue: integer("xp_value").notNull().default(0),
  rarity: text("rarity").notNull().default("common"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
  progress: integer("progress").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
});

export const gameMetrics = pgTable("game_metrics", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull().references(() => games.id),
  totalPlayers: integer("total_players").default(0),
  activePlayers: integer("active_players").default(0),
  totalBets: decimal("total_bets", { precision: 15, scale: 2 }).default("0"),
  totalWins: decimal("total_wins", { precision: 15, scale: 2 }).default("0"),
  jackpotAmount: decimal("jackpot_amount", { precision: 15, scale: 2 }).default("0"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const dailyBonuses = pgTable("daily_bonuses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  day: integer("day").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  claimedAt: timestamp("claimed_at").defaultNow().notNull(),
  streakCount: integer("streak_count").default(1),
});

export const liveSessions = pgTable("live_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  gameId: integer("game_id").references(() => games.id),
  sessionId: text("session_id").notNull().unique(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  totalBets: decimal("total_bets", { precision: 10, scale: 2 }).default("0"),
  totalWins: decimal("total_wins", { precision: 10, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true),
});

export const leaderboards = pgTable("leaderboards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  gameId: integer("game_id").references(() => games.id),
  score: decimal("score", { precision: 15, scale: 2 }).notNull(),
  rank: integer("rank"),
  period: text("period").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

// Analytics Tables
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
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0.00"),
  popularityScore: integer("popularity_score").default(0),
  lastPlayed: timestamp("last_played"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const playerSessions = pgTable("player_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionId: text("session_id").notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  duration: integer("duration"),
  gamesPlayed: integer("games_played").default(0),
  totalBets: decimal("total_bets", { precision: 15, scale: 2 }).default("0.00"),
  totalWins: decimal("total_wins", { precision: 15, scale: 2 }).default("0.00"),
  netResult: decimal("net_result", { precision: 15, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
});

export const gameEvents = pgTable("game_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gameId: integer("game_id").notNull(),
  sessionId: text("session_id").notNull(),
  eventType: text("event_type").notNull(),
  betAmount: decimal("bet_amount", { precision: 10, scale: 2 }),
  winAmount: decimal("win_amount", { precision: 10, scale: 2 }),
  multiplier: decimal("multiplier", { precision: 10, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGameSchema = createInsertSchema(games).pick({
  title: true,
  description: true,
  category: true,
  imageUrl: true,
  rating: true,
  jackpot: true,
});

export const insertGameCategorySchema = createInsertSchema(gameCategories).pick({
  name: true,
  slug: true,
  description: true,
  icon: true,
  color: true,
});

export const insertUserGameHistorySchema = createInsertSchema(userGameHistory).pick({
  userId: true,
  gameId: true,
  betAmount: true,
  winAmount: true,
});

export const insertPromotionSchema = createInsertSchema(promotions).pick({
  title: true,
  description: true,
  type: true,
  value: true,
  startDate: true,
  endDate: true,
});

export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).pick({
  userId: true,
  type: true,
  amount: true,
  currency: true,
  status: true,
  paymentMethod: true,
  gameId: true,
  description: true,
  balanceBefore: true,
  balanceAfter: true,
});

export const insertKycDocumentSchema = createInsertSchema(kycDocuments).pick({
  userId: true,
  documentType: true,
  documentUrl: true,
  status: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  title: true,
  description: true,
  category: true,
  icon: true,
  color: true,
  condition: true,
  reward: true,
  xpValue: true,
  rarity: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).pick({
  userId: true,
  achievementId: true,
  progress: true,
  isCompleted: true,
});

export const insertGameMetricsSchema = createInsertSchema(gameMetrics);
export const insertDailyBonusSchema = createInsertSchema(dailyBonuses);
export const insertLiveSessionSchema = createInsertSchema(liveSessions);
export const insertLeaderboardSchema = createInsertSchema(leaderboards);
export const insertGameAnalyticsSchema = createInsertSchema(gameAnalytics);
export const insertPlayerSessionSchema = createInsertSchema(playerSessions);
export const insertGameEventSchema = createInsertSchema(gameEvents);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  gameHistory: many(userGameHistory),
  walletTransactions: many(walletTransactions),
  kycDocuments: many(kycDocuments),
  userAchievements: many(userAchievements),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const gamesRelations = relations(games, ({ many }) => ({
  gameHistory: many(userGameHistory),
  walletTransactions: many(walletTransactions),
}));

export const userGameHistoryRelations = relations(userGameHistory, ({ one }) => ({
  user: one(users, {
    fields: [userGameHistory.userId],
    references: [users.id],
  }),
  game: one(games, {
    fields: [userGameHistory.gameId],
    references: [games.id],
  }),
}));

export const walletTransactionsRelations = relations(walletTransactions, ({ one }) => ({
  user: one(users, {
    fields: [walletTransactions.userId],
    references: [users.id],
  }),
  game: one(games, {
    fields: [walletTransactions.gameId],
    references: [games.id],
  }),
}));

export const kycDocumentsRelations = relations(kycDocuments, ({ one }) => ({
  user: one(users, {
    fields: [kycDocuments.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type GameCategory = typeof gameCategories.$inferSelect;
export type InsertGameCategory = z.infer<typeof insertGameCategorySchema>;
export type UserGameHistory = typeof userGameHistory.$inferSelect;
export type InsertUserGameHistory = z.infer<typeof insertUserGameHistorySchema>;
export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;
export type KycDocument = typeof kycDocuments.$inferSelect;
export type InsertKycDocument = z.infer<typeof insertKycDocumentSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type GameMetrics = typeof gameMetrics.$inferSelect;
export type InsertGameMetrics = z.infer<typeof insertGameMetricsSchema>;
export type DailyBonus = typeof dailyBonuses.$inferSelect;
export type InsertDailyBonus = z.infer<typeof insertDailyBonusSchema>;
export type LiveSession = typeof liveSessions.$inferSelect;
export type InsertLiveSession = z.infer<typeof insertLiveSessionSchema>;
export type Leaderboard = typeof leaderboards.$inferSelect;
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type GameAnalytics = typeof gameAnalytics.$inferSelect;
export type InsertGameAnalytics = z.infer<typeof insertGameAnalyticsSchema>;
export type PlayerSession = typeof playerSessions.$inferSelect;
export type InsertPlayerSession = z.infer<typeof insertPlayerSessionSchema>;
export type GameEvent = typeof gameEvents.$inferSelect;
export type InsertGameEvent = z.infer<typeof insertGameEventSchema>;