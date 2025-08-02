import { pgTable, serial, text, integer, decimal, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with comprehensive gaming profile
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique(),
  phone: text("phone").unique().notNull(),
  password: text("password").notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  walletBalance: text("wallet_balance").default("0.00"),
  isVerified: boolean("is_verified").default(false),
  kycStatus: text("kyc_status").default("pending"), // pending, approved, rejected
  vipLevel: integer("vip_level").default(1),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Additional gaming fields
  totalWagered: decimal("total_wagered", { precision: 12, scale: 2 }).default("0.00"),
  totalWon: decimal("total_won", { precision: 12, scale: 2 }).default("0.00"),
  gamesPlayed: integer("games_played").default(0),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }).default("0.00"),
});

// Game transactions for real money betting
export const gameTransactions = pgTable("game_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gameId: text("game_id").notNull(),
  type: text("type").notNull(), // bet, win, loss
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  challengeType: text("challenge_type").notNull(),
  challengeDetails: text("challenge_details"),
  status: text("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wallet transactions for deposits/withdrawals
export const walletTransactions = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // deposit, withdrawal, skill_challenge, challenge_win
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"),
  description: text("description"),
  transactionId: text("transaction_id"),
  razorpayOrderId: text("razorpay_order_id"),
  accountDetails: text("account_details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Game sessions and results
export const gameResults = pgTable("game_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gameType: text("game_type").notNull(), // wingo, aviator, k3, 5d
  challengeAmount: decimal("challenge_amount", { precision: 10, scale: 2 }).notNull(),
  winAmount: decimal("win_amount", { precision: 10, scale: 2 }).default("0.00"),
  multiplier: decimal("multiplier", { precision: 8, scale: 2 }).default("0.00"),
  gameData: json("game_data"), // Store game-specific data
  result: text("result").notNull(), // win, loss
  period: text("period").notNull(), // Game period/round
  createdAt: timestamp("created_at").defaultNow(),
});

// Transactions for deposits and withdrawals
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // deposit, withdrawal, game_win, game_loss
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"), // pending, completed, failed, cancelled
  paymentMethod: text("payment_method"), // upi, card, bank_transfer, paytm, phonepe
  transactionId: text("transaction_id").unique(),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Game periods for each game type
export const gamePeriods = pgTable("game_periods", {
  id: serial("id").primaryKey(),
  gameType: text("game_type").notNull(),
  period: text("period").notNull(),
  result: json("result"), // Store the actual game result
  status: text("status").default("active"), // active, completed
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  totalChallenges: integer("total_challenges").default(0),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).default("0.00"),
});

// User bets for current periods
export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  periodId: integer("period_id").references(() => gamePeriods.id),
  gameType: text("game_type").notNull(),
  challengeType: text("challenge_type").notNull(), // color, number, size, etc.
  challengeValue: text("challenge_value").notNull(), // green, red, violet, 0-9, big, small
  challengeAmount: decimal("challenge_amount", { precision: 10, scale: 2 }).notNull(),
  multiplier: decimal("multiplier", { precision: 8, scale: 2 }).notNull(),
  status: text("status").default("active"), // active, won, lost
  winAmount: decimal("win_amount", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

// KYC documents
export const kycDocuments = pgTable("kyc_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  documentType: text("document_type").notNull(), // aadhar, pan, bank_account
  documentNumber: text("document_number").notNull(),
  documentImage: text("document_image"), // File path/URL
  status: text("status").default("pending"), // pending, approved, rejected
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Referral system
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").references(() => users.id),
  referredId: integer("referred_id").references(() => users.id),
  commissionEarned: decimal("commission_earned", { precision: 10, scale: 2 }).default("0.00"),
  level: integer("level").default(1), // Commission tier level
  createdAt: timestamp("created_at").defaultNow(),
});

// VIP benefits and progress
export const vipProgress = pgTable("vip_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  currentLevel: integer("current_level").default(1),
  totalWagered: decimal("total_wagered", { precision: 12, scale: 2 }).default("0.00"),
  nextLevelRequired: decimal("next_level_required", { precision: 12, scale: 2 }).default("10000.00"),
  benefits: json("benefits"), // VIP level benefits
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGameResultSchema = createInsertSchema(gameResults).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserChallengeSchema = createInsertSchema(userChallenges).omit({
  id: true,
  createdAt: true,
});

export const insertKycDocumentSchema = createInsertSchema(kycDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type GameResult = typeof gameResults.$inferSelect;
export type InsertGameResult = z.infer<typeof insertGameResultSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;
export type KycDocument = typeof kycDocuments.$inferSelect;
export type InsertKycDocument = z.infer<typeof insertKycDocumentSchema>;
export type GamePeriod = typeof gamePeriods.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type VipProgress = typeof vipProgress.$inferSelect;