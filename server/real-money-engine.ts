import Razorpay from 'razorpay';
import { db } from './db';
import { users, gameTransactions, walletTransactions } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Initialize Razorpay with production keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface GameBet {
  userId: number;
  gameId: string;
  betAmount: number;
  betType: string;
  betDetails: any;
  multiplier?: number;
}

export interface GameResult {
  gameId: string;
  result: any;
  winningMultiplier?: number;
}

export class RealMoneyGameEngine {
  
  // Place a real money bet
  async placeBet(bet: GameBet): Promise<{ success: boolean; transactionId?: string; balance?: number; error?: string }> {
    try {
      // Get user's current balance
      const [user] = await db.select().from(users).where(eq(users.id, bet.userId));
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const currentBalance = parseFloat(user.walletBalance);
      if (currentBalance < bet.betAmount) {
        return { success: false, error: 'Insufficient balance' };
      }

      // Deduct bet amount from user balance
      const newBalance = currentBalance - bet.betAmount;
      await db.update(users)
        .set({ walletBalance: newBalance.toString() })
        .where(eq(users.id, bet.userId));

      // Record game transaction
      const [transaction] = await db.insert(gameTransactions).values({
        userId: bet.userId,
        gameId: bet.gameId,
        type: 'bet',
        amount: bet.betAmount,
        betType: bet.betType,
        betDetails: JSON.stringify(bet.betDetails),
        status: 'completed',
        createdAt: new Date(),
      }).returning();

      // Record wallet transaction
      await db.insert(walletTransactions).values({
        userId: bet.userId,
        type: 'game_bet',
        amount: bet.betAmount,
        status: 'completed',
        description: `${bet.gameId} - ${bet.betType}`,
        transactionId: `BET_${transaction.id}`,
        createdAt: new Date(),
      });

      return { 
        success: true, 
        transactionId: transaction.id.toString(), 
        balance: newBalance 
      };

    } catch (error) {
      console.error('Error placing bet:', error);
      return { success: false, error: 'Transaction failed' };
    }
  }

  // Process game win and credit amount
  async processWin(userId: number, gameId: string, betTransactionId: string, winAmount: number, multiplier: number): Promise<{ success: boolean; balance?: number; error?: string }> {
    try {
      // Get user's current balance
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const currentBalance = parseFloat(user.walletBalance);
      const newBalance = currentBalance + winAmount;

      // Update user balance
      await db.update(users)
        .set({ walletBalance: newBalance.toString() })
        .where(eq(users.id, userId));

      // Record win transaction
      const [winTransaction] = await db.insert(gameTransactions).values({
        userId: userId,
        gameId: gameId,
        type: 'win',
        amount: winAmount,
        betType: 'win',
        betDetails: JSON.stringify({ betTransactionId, multiplier }),
        status: 'completed',
        createdAt: new Date(),
      }).returning();

      // Record wallet transaction for win
      await db.insert(walletTransactions).values({
        userId: userId,
        type: 'game_win',
        amount: winAmount,
        status: 'completed',
        description: `${gameId} Win - ${multiplier}x`,
        transactionId: `WIN_${winTransaction.id}`,
        createdAt: new Date(),
      });

      return { success: true, balance: newBalance };

    } catch (error) {
      console.error('Error processing win:', error);
      return { success: false, error: 'Win processing failed' };
    }
  }

  // Create Razorpay order for deposit
  async createDepositOrder(userId: number, amount: number): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `deposit_${userId}_${Date.now()}`,
        notes: {
          userId: userId.toString(),
          type: 'wallet_deposit'
        }
      });

      return { success: true, orderId: order.id };

    } catch (error) {
      console.error('Error creating deposit order:', error);
      return { success: false, error: 'Failed to create payment order' };
    }
  }

  // Verify and process deposit
  async verifyAndProcessDeposit(orderId: string, paymentId: string, signature: string, userId: number, amount: number): Promise<{ success: boolean; balance?: number; error?: string }> {
    try {
      // Verify payment signature
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      if (expectedSignature !== signature) {
        return { success: false, error: 'Payment verification failed' };
      }

      // Get user's current balance
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const currentBalance = parseFloat(user.walletBalance);
      const newBalance = currentBalance + amount;

      // Update user balance
      await db.update(users)
        .set({ walletBalance: newBalance.toString() })
        .where(eq(users.id, userId));

      // Record wallet transaction
      await db.insert(walletTransactions).values({
        userId: userId,
        type: 'deposit',
        amount: amount,
        status: 'completed',
        description: 'Razorpay Deposit',
        transactionId: paymentId,
        razorpayOrderId: orderId,
        createdAt: new Date(),
      });

      return { success: true, balance: newBalance };

    } catch (error) {
      console.error('Error verifying deposit:', error);
      return { success: false, error: 'Deposit verification failed' };
    }
  }

  // Process withdrawal request
  async processWithdrawal(userId: number, amount: number, accountDetails: any): Promise<{ success: boolean; withdrawalId?: string; error?: string }> {
    try {
      // Get user's current balance
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const currentBalance = parseFloat(user.walletBalance);
      if (currentBalance < amount) {
        return { success: false, error: 'Insufficient balance' };
      }

      // Check KYC verification
      if (!user.isVerified) {
        return { success: false, error: 'KYC verification required for withdrawal' };
      }

      // Create withdrawal transaction (pending)
      const [withdrawal] = await db.insert(walletTransactions).values({
        userId: userId,
        type: 'withdrawal',
        amount: amount,
        status: 'pending',
        description: 'Bank Transfer Withdrawal',
        transactionId: `WD_${Date.now()}`,
        accountDetails: JSON.stringify(accountDetails),
        createdAt: new Date(),
      }).returning();

      // For now, we'll mark as processing - in production, integrate with bank APIs
      // Deduct amount from balance
      const newBalance = currentBalance - amount;
      await db.update(users)
        .set({ walletBalance: newBalance.toString() })
        .where(eq(users.id, userId));

      // Update withdrawal status to processing
      await db.update(walletTransactions)
        .set({ status: 'processing' })
        .where(eq(walletTransactions.id, withdrawal.id));

      return { success: true, withdrawalId: withdrawal.id.toString() };

    } catch (error) {
      console.error('Error processing withdrawal:', error);
      return { success: false, error: 'Withdrawal processing failed' };
    }
  }

  // Get user's balance
  async getUserBalance(userId: number): Promise<{ success: boolean; balance?: number; error?: string }> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      return { success: true, balance: parseFloat(user.walletBalance) };

    } catch (error) {
      console.error('Error getting balance:', error);
      return { success: false, error: 'Failed to get balance' };
    }
  }

  // Get transaction history
  async getTransactionHistory(userId: number, limit: number = 50): Promise<{ success: boolean; transactions?: any[]; error?: string }> {
    try {
      const transactions = await db.select()
        .from(walletTransactions)
        .where(eq(walletTransactions.userId, userId))
        .orderBy(walletTransactions.createdAt)
        .limit(limit);

      return { success: true, transactions };

    } catch (error) {
      console.error('Error getting transaction history:', error);
      return { success: false, error: 'Failed to get transaction history' };
    }
  }
}

export const realMoneyEngine = new RealMoneyGameEngine();