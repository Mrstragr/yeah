import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { db } from './db';
import { users, walletTransactions } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { ComplianceService } from './security-enhanced';

// Production Payment Service
export class ProductionPaymentService {
  private razorpay: Razorpay;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    
    // Initialize Razorpay with production credentials
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'demo_secret'
    });

    console.log('💳 Payment Service Initialized:', { 
      mode: this.isProduction ? 'PRODUCTION' : 'TEST',
      keyId: process.env.RAZORPAY_KEY_ID ? 'SET' : 'MISSING'
    });
  }

  // Create payment order with compliance checks
  async createPaymentOrder(userId: number, amount: number, currency: string = 'INR') {
    try {
      // Compliance checks
      await ComplianceService.amlCheck(userId, amount, 'deposit');
      
      // Validate amount
      if (amount < 100) {
        throw new Error('Minimum deposit amount is ₹100');
      }
      
      if (amount > 500000) {
        throw new Error('Maximum deposit amount is ₹5,00,000');
      }

      // Create Razorpay order
      const orderOptions = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt: `receipt_${userId}_${Date.now()}`,
        payment_capture: 1,
        notes: {
          userId: userId.toString(),
          type: 'wallet_deposit',
          platform: 'gaming_platform'
        }
      };

      const order = await this.razorpay.orders.create(orderOptions);

      // Store transaction record
      const [transaction] = await db.insert(walletTransactions).values({
        userId,
        type: 'deposit',
        amount: amount.toString(),
        currency,
        status: 'created',
        razorpayOrderId: order.id,
        description: 'Wallet deposit',
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      console.log('📦 Payment order created:', { 
        orderId: order.id, 
        amount, 
        userId 
      });

      return {
        orderId: order.id,
        amount,
        currency,
        key: process.env.RAZORPAY_KEY_ID,
        transactionId: transaction.id,
        receipt: order.receipt
      };

    } catch (error: any) {
      console.error('Payment order creation failed:', error);
      throw new Error(`Payment order failed: ${error.message}`);
    }
  }

  // Verify payment signature
  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    try {
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'demo_secret')
        .update(body.toString())
        .digest('hex');

      return expectedSignature === razorpaySignature;
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  // Process successful payment
  async processSuccessfulPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    try {
      // Verify signature
      if (!this.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
        throw new Error('Invalid payment signature');
      }

      // Get transaction details
      const [transaction] = await db
        .select()
        .from(walletTransactions)
        .where(eq(walletTransactions.razorpayOrderId, razorpayOrderId));

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status === 'completed') {
        throw new Error('Transaction already processed');
      }

      // Update transaction status
      await db
        .update(walletTransactions)
        .set({
          status: 'completed',
          razorpayPaymentId,
          updatedAt: new Date()
        })
        .where(eq(walletTransactions.id, transaction.id));

      // Update user balance
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, transaction.userId));

      if (!user) {
        throw new Error('User not found');
      }

      const currentBalance = parseFloat(user.walletBalance);
      const newBalance = currentBalance + parseFloat(transaction.amount);

      await db
        .update(users)
        .set({
          walletBalance: newBalance.toFixed(2),
          totalDeposit: (parseFloat(user.totalDeposit) + parseFloat(transaction.amount)).toFixed(2),
          updatedAt: new Date()
        })
        .where(eq(users.id, transaction.userId));

      console.log('✅ Payment processed successfully:', {
        userId: transaction.userId,
        amount: transaction.amount,
        newBalance,
        paymentId: razorpayPaymentId
      });

      return {
        success: true,
        transaction,
        newBalance,
        paymentId: razorpayPaymentId
      };

    } catch (error: any) {
      console.error('Payment processing failed:', error);
      throw new Error(`Payment processing failed: ${error.message}`);
    }
  }

  // Process withdrawal with enhanced verification
  async processWithdrawal(userId: number, amount: number, bankDetails: any) {
    try {
      // Get user details
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!user) {
        throw new Error('User not found');
      }

      // Verify KYC status
      if (user.kycStatus !== 'verified') {
        throw new Error('KYC verification required for withdrawals');
      }

      // Validate withdrawal amount
      if (amount < 500) {
        throw new Error('Minimum withdrawal amount is ₹500');
      }

      const currentBalance = parseFloat(user.walletBalance);
      if (amount > currentBalance) {
        throw new Error('Insufficient balance');
      }

      // Daily withdrawal limit check
      const dailyLimit = 100000; // ₹1 lakh per day
      const todayWithdrawals = await this.getTodayWithdrawals(userId);
      
      if (todayWithdrawals + amount > dailyLimit) {
        throw new Error('Daily withdrawal limit exceeded');
      }

      // Compliance checks
      await ComplianceService.amlCheck(userId, amount, 'withdrawal');

      // Create withdrawal transaction
      const [transaction] = await db.insert(walletTransactions).values({
        userId,
        type: 'withdrawal',
        amount: amount.toString(),
        currency: 'INR',
        status: 'pending',
        description: 'Wallet withdrawal',
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Deduct amount from user balance (hold until processed)
      const newBalance = currentBalance - amount;
      await db
        .update(users)
        .set({
          walletBalance: newBalance.toFixed(2),
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      console.log('💸 Withdrawal initiated:', {
        userId,
        amount,
        transactionId: transaction.id,
        newBalance
      });

      // In production, integrate with bank transfer API
      setTimeout(async () => {
        await this.processWithdrawalPayout(transaction.id);
      }, 5000); // Simulate processing delay

      return {
        success: true,
        transactionId: transaction.id,
        amount,
        status: 'pending',
        estimatedTime: '24-48 hours'
      };

    } catch (error: any) {
      console.error('Withdrawal processing failed:', error);
      throw new Error(`Withdrawal failed: ${error.message}`);
    }
  }

  // Process withdrawal payout (simulate bank transfer)
  private async processWithdrawalPayout(transactionId: number) {
    try {
      // In production, integrate with bank transfer API
      const success = Math.random() > 0.1; // 90% success rate

      const status = success ? 'completed' : 'failed';
      
      await db
        .update(walletTransactions)
        .set({
          status,
          updatedAt: new Date()
        })
        .where(eq(walletTransactions.id, transactionId));

      if (!success) {
        // Refund the amount if transfer failed
        const [transaction] = await db
          .select()
          .from(walletTransactions)
          .where(eq(walletTransactions.id, transactionId));

        if (transaction) {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, transaction.userId));

          if (user) {
            const refundBalance = parseFloat(user.walletBalance) + parseFloat(transaction.amount);
            await db
              .update(users)
              .set({
                walletBalance: refundBalance.toFixed(2),
                updatedAt: new Date()
              })
              .where(eq(users.id, transaction.userId));
          }
        }
      }

      console.log('🏦 Withdrawal payout processed:', { 
        transactionId, 
        status,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Withdrawal payout error:', error);
    }
  }

  // Get today's withdrawals for limit checking
  private async getTodayWithdrawals(userId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const transactions = await db
      .select()
      .from(walletTransactions)
      .where(
        eq(walletTransactions.userId, userId)
      );

    const todayTransactions = transactions.filter(tx => 
      tx.type === 'withdrawal' && 
      tx.status === 'completed' &&
      tx.createdAt >= today && 
      tx.createdAt < tomorrow
    );

    return todayTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  }

  // Webhook handler for payment updates
  async handleWebhook(signature: string, body: any) {
    try {
      // Verify webhook signature
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret')
        .update(JSON.stringify(body))
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new Error('Invalid webhook signature');
      }

      const event = body.event;
      const payment = body.payload.payment.entity;

      console.log('🪝 Webhook received:', { event, paymentId: payment.id });

      switch (event) {
        case 'payment.captured':
          await this.handlePaymentCaptured(payment);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(payment);
          break;
        default:
          console.log('Unhandled webhook event:', event);
      }

      return { success: true };

    } catch (error: any) {
      console.error('Webhook processing failed:', error);
      throw new Error(`Webhook failed: ${error.message}`);
    }
  }

  private async handlePaymentCaptured(payment: any) {
    // Handle successful payment capture
    console.log('✅ Payment captured:', payment.id);
  }

  private async handlePaymentFailed(payment: any) {
    // Handle failed payment
    console.log('❌ Payment failed:', payment.id);
  }
}

export const productionPaymentService = new ProductionPaymentService();