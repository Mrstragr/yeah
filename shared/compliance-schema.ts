import { pgTable, serial, text, integer, decimal, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// State restrictions and compliance tracking
export const stateRestrictions = pgTable("state_restrictions", {
  id: serial("id").primaryKey(),
  state: text("state").notNull(),
  isAllowed: boolean("is_allowed").default(false),
  restrictionType: text("restriction_type").notNull(), // banned, restricted, allowed
  legalBasis: text("legal_basis"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Responsible gaming settings per user
export const responsibleGamingSettings = pgTable("responsible_gaming_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  dailyDepositLimit: decimal("daily_deposit_limit", { precision: 10, scale: 2 }).default("50000.00"),
  weeklyDepositLimit: decimal("weekly_deposit_limit", { precision: 10, scale: 2 }).default("200000.00"),
  monthlyDepositLimit: decimal("monthly_deposit_limit", { precision: 10, scale: 2 }).default("500000.00"),
  sessionTimeLimit: integer("session_time_limit").default(360), // minutes
  dailyTimeLimit: integer("daily_time_limit").default(720), // minutes
  selfExclusionUntil: timestamp("self_exclusion_until"),
  isTemporarilyExcluded: boolean("is_temporarily_excluded").default(false),
  isPermanentlyExcluded: boolean("is_permanently_excluded").default(false),
  spendingAlerts: boolean("spending_alerts").default(true),
  timeAlerts: boolean("time_alerts").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User sessions for time tracking
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionStart: timestamp("session_start").defaultNow(),
  sessionEnd: timestamp("session_end"),
  durationMinutes: integer("duration_minutes"),
  gamesPlayed: integer("games_played").default(0),
  totalChallengeAmount: decimal("total_challenge_amount", { precision: 10, scale: 2 }).default("0.00"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"),
});

// Compliance alerts and monitoring
export const complianceAlerts = pgTable("compliance_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  alertType: text("alert_type").notNull(), // spending_limit, time_limit, suspicious_activity
  alertLevel: text("alert_level").notNull(), // warning, critical, violation
  description: text("description").notNull(),
  triggerValue: text("trigger_value"),
  limitValue: text("limit_value"),
  isResolved: boolean("is_resolved").default(false),
  actionTaken: text("action_taken"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Legal disclaimers and acknowledgments
export const userAcknowledgments = pgTable("user_acknowledgments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  acknowledmentType: text("acknowledgment_type").notNull(), // terms, privacy, responsible_gaming, state_restriction
  version: text("version").notNull(),
  ipAddress: text("ip_address"),
  acknowledgedAt: timestamp("acknowledged_at").defaultNow(),
});

// Enhanced KYC with compliance tracking
export const enhancedKyc = pgTable("enhanced_kyc", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  aadhaarNumber: text("aadhaar_number"),
  aadhaarVerified: boolean("aadhaar_verified").default(false),
  panNumber: text("pan_number"),
  panVerified: boolean("pan_verified").default(false),
  bankAccountNumber: text("bank_account_number"),
  bankIfscCode: text("bank_ifsc_code"),
  bankAccountVerified: boolean("bank_account_verified").default(false),
  addressVerified: boolean("address_verified").default(false),
  incomeSource: text("income_source"),
  employmentStatus: text("employment_status"),
  riskProfile: text("risk_profile").default("low"), // low, medium, high
  complianceScore: integer("compliance_score").default(100),
  lastReviewDate: timestamp("last_review_date"),
  nextReviewDate: timestamp("next_review_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const insertStateRestrictionSchema = createInsertSchema(stateRestrictions);
export const selectStateRestrictionSchema = createSelectSchema(stateRestrictions);
export type InsertStateRestriction = z.infer<typeof insertStateRestrictionSchema>;
export type StateRestriction = typeof stateRestrictions.$inferSelect;

export const insertResponsibleGamingSettingsSchema = createInsertSchema(responsibleGamingSettings);
export const selectResponsibleGamingSettingsSchema = createSelectSchema(responsibleGamingSettings);
export type InsertResponsibleGamingSettings = z.infer<typeof insertResponsibleGamingSettingsSchema>;
export type ResponsibleGamingSettings = typeof responsibleGamingSettings.$inferSelect;

export const insertUserSessionSchema = createInsertSchema(userSessions);
export const selectUserSessionSchema = createSelectSchema(userSessions);
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type UserSession = typeof userSessions.$inferSelect;

export const insertComplianceAlertSchema = createInsertSchema(complianceAlerts);
export const selectComplianceAlertSchema = createSelectSchema(complianceAlerts);
export type InsertComplianceAlert = z.infer<typeof insertComplianceAlertSchema>;
export type ComplianceAlert = typeof complianceAlerts.$inferSelect;

export const insertUserAcknowledgmentSchema = createInsertSchema(userAcknowledgments);
export const selectUserAcknowledgmentSchema = createSelectSchema(userAcknowledgments);
export type InsertUserAcknowledgment = z.infer<typeof insertUserAcknowledgmentSchema>;
export type UserAcknowledgment = typeof userAcknowledgments.$inferSelect;

export const insertEnhancedKycSchema = createInsertSchema(enhancedKyc);
export const selectEnhancedKycSchema = createSelectSchema(enhancedKyc);
export type InsertEnhancedKyc = z.infer<typeof insertEnhancedKycSchema>;
export type EnhancedKyc = typeof enhancedKyc.$inferSelect;

// Reference to users table from main schema
declare const users: any;