import { db } from "./db";
import { 
  users, 
  transactions, 
  gameResults, 
  userChallenges, 
  gamePeriods, 
  kycDocuments,
  type User, 
  type InsertUser,
  type Transaction,
  type InsertTransaction,
  type GameResult,
  type InsertGameResult,
  type UserChallenge,
  type InsertUserChallenge,
  type GamePeriod,
  type KycDocument,
  type InsertKycDocument
} from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, amount: string, operation: 'add' | 'subtract'): Promise<User>;
  updateUserLastLogin(userId: number): Promise<void>;
  
  // Transaction management
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number, limit?: number): Promise<Transaction[]>;
  updateTransactionStatus(transactionId: string, status: string): Promise<Transaction | undefined>;
  
  // Game management
  createGameResult(gameResult: InsertGameResult): Promise<GameResult>;
  getUserGameHistory(userId: number, gameType?: string, limit?: number): Promise<GameResult[]>;
  
  // Challenge system (skill-based gaming)
  createUserChallenge(challenge: InsertUserChallenge): Promise<UserChallenge>;
  getUserActiveChallenges(userId: number, gameType: string): Promise<UserChallenge[]>;
  getCurrentGamePeriod(gameType: string): Promise<GamePeriod | undefined>;
  createGamePeriod(gameType: string, period: string): Promise<GamePeriod>;
  
  // KYC management
  createKycDocument(document: InsertKycDocument): Promise<KycDocument>;
  getUserKycStatus(userId: number): Promise<string>;
}

class DatabaseStorage implements IStorage {
  
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
        referralCode: this.generateReferralCode(),
      })
      .returning();
    return user;
  }

  async updateUserBalance(userId: number, amount: string, operation: 'add' | 'subtract'): Promise<User> {
    const query = operation === 'add' 
      ? sql`${users.balance} + ${amount}`
      : sql`${users.balance} - ${amount}`;
      
    const [user] = await db
      .update(users)
      .set({ 
        balance: query,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserLastLogin(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  // Transaction management
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values({
        ...transaction,
        transactionId: this.generateTransactionId(),
      })
      .returning();
    return newTransaction;
  }

  async getUserTransactions(userId: number, limit: number = 50): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  async updateTransactionStatus(transactionId: string, status: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(transactions.transactionId, transactionId))
      .returning();
    return transaction || undefined;
  }

  // Game management
  async createGameResult(gameResult: InsertGameResult): Promise<GameResult> {
    const [result] = await db
      .insert(gameResults)
      .values(gameResult)
      .returning();
    return result;
  }

  async getUserGameHistory(userId: number, gameType?: string, limit: number = 50): Promise<GameResult[]> {
    if (gameType) {
      return await db
        .select()
        .from(gameResults)
        .where(and(
          eq(gameResults.userId, userId),
          eq(gameResults.gameType, gameType)
        ))
        .orderBy(desc(gameResults.createdAt))
        .limit(limit);
    }

    return await db
      .select()
      .from(gameResults)
      .where(eq(gameResults.userId, userId))
      .orderBy(desc(gameResults.createdAt))
      .limit(limit);
  }

  // Challenge system (skill-based gaming)
  async createUserChallenge(challenge: InsertUserChallenge): Promise<UserChallenge> {
    const [newChallenge] = await db
      .insert(userChallenges)
      .values(challenge)
      .returning();
    return newChallenge;
  }

  async getUserActiveChallenges(userId: number, gameType: string): Promise<UserChallenge[]> {
    return await db
      .select()
      .from(userChallenges)
      .where(and(
        eq(userChallenges.userId, userId),
        eq(userChallenges.gameType, gameType),
        eq(userChallenges.status, 'active')
      ));
  }

  async getCurrentGamePeriod(gameType: string): Promise<GamePeriod | undefined> {
    const [period] = await db
      .select()
      .from(gamePeriods)
      .where(and(
        eq(gamePeriods.gameType, gameType),
        eq(gamePeriods.status, 'active')
      ))
      .orderBy(desc(gamePeriods.startTime))
      .limit(1);
    return period || undefined;
  }

  async createGamePeriod(gameType: string, period: string): Promise<GamePeriod> {
    const [newPeriod] = await db
      .insert(gamePeriods)
      .values({
        gameType,
        period,
        status: 'active',
      })
      .returning();
    return newPeriod;
  }

  // KYC management
  async createKycDocument(document: InsertKycDocument): Promise<KycDocument> {
    const [newDocument] = await db
      .insert(kycDocuments)
      .values(document)
      .returning();
    return newDocument;
  }

  async getUserKycStatus(userId: number): Promise<string> {
    const documents = await db
      .select()
      .from(kycDocuments)
      .where(eq(kycDocuments.userId, userId));
    
    if (documents.length === 0) return 'pending';
    
    const hasApproved = documents.some(doc => doc.status === 'approved');
    const hasRejected = documents.some(doc => doc.status === 'rejected');
    
    if (hasApproved) return 'approved';
    if (hasRejected) return 'rejected';
    return 'pending';
  }

  // Helper methods
  private generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private generateTransactionId(): string {
    return 'TXN' + Date.now() + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

export const storage = new DatabaseStorage();