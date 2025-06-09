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

// Wallet transactions table for tracking all money movements
export const walletTransactions = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // deposit, withdrawal, bet, win, bonus, refund
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, cancelled
  paymentMethod: text("payment_method"), // upi, netbanking, card, wallet
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpayOrderId: text("razorpay_order_id"),
  gameId: integer("game_id").references(() => games.id),
  description: text("description"),
  balanceBefore: decimal("balance_before", { precision: 10, scale: 2 }),
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// KYC documents table
export const kycDocuments = pgTable("kyc_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  documentType: text("document_type").notNull(), // pan, aadhar, bank_statement
  documentUrl: text("document_url").notNull(),
  status: text("status").notNull().default("pending"), // pending, verified, rejected
  rejectionReason: text("rejection_reason"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // welcome_bonus, free_spins, cashback
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
});

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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  gameHistory: many(userGameHistory),
  walletTransactions: many(walletTransactions),
  kycDocuments: many(kycDocuments),
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
