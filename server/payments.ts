import Razorpay from 'razorpay';
import crypto from 'crypto';
import { storage } from './storage';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay credentials not found. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export class PaymentService {
  /**
   * Create a new payment order for deposit
   */
  async createDepositOrder(userId: number, amount: number): Promise<PaymentOrder> {
    try {
      const receipt = `deposit_${userId}_${Date.now()}`;
      const order = await razorpay.orders.create({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt,
        payment_capture: true,
      });

      // Store transaction in database
      await storage.createWalletTransaction({
        userId,
        type: 'deposit',
        amount: amount.toString(),
        currency: 'INR',
        status: 'pending',
        paymentMethod: 'razorpay',
        description: `Deposit of ₹${amount}`,
        balanceBefore: null,
        balanceAfter: null,
      });

      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status
      };
    } catch (error) {
      console.error('Error creating deposit order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  /**
   * Verify payment signature and process deposit
   */
  async verifyAndProcessDeposit(
    userId: number,
    verification: PaymentVerification
  ): Promise<{ success: boolean; message: string; newBalance?: string }> {
    try {
      // Verify signature
      const isValid = this.verifyPaymentSignature(verification);
      if (!isValid) {
        return { success: false, message: 'Invalid payment signature' };
      }

      // Get payment details from Razorpay
      const payment = await razorpay.payments.fetch(verification.razorpay_payment_id);
      
      if (payment.status !== 'captured') {
        return { success: false, message: 'Payment not captured' };
      }

      const amount = Number(payment.amount) / 100; // Convert from paise to rupees
      const user = await storage.getUser(userId);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Update user wallet balance
      const currentBalance = parseFloat(user.walletBalance);
      const newBalance = (currentBalance + amount).toFixed(2);
      
      await storage.updateUserWalletBalance(userId, newBalance);

      // Update transaction status
      const transactions = await storage.getUserWalletTransactions(userId, 10);
      const pendingTransaction = transactions.find(t => 
        t.status === 'pending' && t.type === 'deposit'
      );

      if (pendingTransaction) {
        await storage.updateWalletTransactionStatus(
          pendingTransaction.id,
          'completed',
          verification.razorpay_payment_id
        );
      }

      // Update user totals
      const totalDeposit = (parseFloat(user.totalDeposit) + amount).toFixed(2);
      await storage.updateUserBalance(userId, user.balance); // This will update totalDeposit in real implementation

      return {
        success: true,
        message: `Deposit of ₹${amount} successful`,
        newBalance
      };
    } catch (error) {
      console.error('Error verifying deposit:', error);
      return { success: false, message: 'Payment verification failed' };
    }
  }

  /**
   * Process withdrawal request
   */
  async processWithdrawal(
    userId: number,
    amount: number,
    upiId?: string,
    bankAccount?: {
      accountNumber: string;
      ifscCode: string;
      accountHolderName: string;
    }
  ): Promise<{ success: boolean; message: string; withdrawalId?: string }> {
    try {
      const user = await storage.getUser(userId);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Check KYC status
      if (user.kycStatus !== 'verified') {
        return { success: false, message: 'KYC verification required for withdrawal' };
      }

      // Check minimum withdrawal amount
      if (amount < 100) {
        return { success: false, message: 'Minimum withdrawal amount is ₹100' };
      }

      // Check available balance
      const availableBalance = parseFloat(user.walletBalance);
      if (amount > availableBalance) {
        return { success: false, message: 'Insufficient balance' };
      }

      // Create withdrawal transaction
      const withdrawalTransaction = await storage.createWalletTransaction({
        userId,
        type: 'withdrawal',
        amount: amount.toString(),
        currency: 'INR',
        status: 'pending',
        paymentMethod: upiId ? 'upi' : 'bank_transfer',
        description: `Withdrawal of ₹${amount}${upiId ? ` to ${upiId}` : ' to bank account'}`,
        balanceBefore: availableBalance.toString(),
        balanceAfter: (availableBalance - amount).toString(),
      });

      // Update user balance
      const newBalance = (availableBalance - amount).toFixed(2);
      await storage.updateUserWalletBalance(userId, newBalance);

      // In production, you would integrate with Razorpay's payout API
      // For now, we'll simulate the withdrawal process
      setTimeout(async () => {
        await storage.updateWalletTransactionStatus(
          withdrawalTransaction.id,
          'completed'
        );
      }, 5000); // Simulate 5-second processing time

      return {
        success: true,
        message: 'Withdrawal request submitted successfully',
        withdrawalId: withdrawalTransaction.id.toString()
      };
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      return { success: false, message: 'Withdrawal processing failed' };
    }
  }

  /**
   * Verify Razorpay payment signature
   */
  private verifyPaymentSignature(verification: PaymentVerification): boolean {
    try {
      const body = verification.razorpay_order_id + '|' + verification.razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest('hex');

      return expectedSignature === verification.razorpay_signature;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  /**
   * Get payment history for user
   */
  async getPaymentHistory(userId: number, limit: number = 20) {
    try {
      return await storage.getUserWalletTransactions(userId, limit);
    } catch (error) {
      console.error('Error getting payment history:', error);
      return [];
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(paymentId: string) {
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return {
        id: payment.id,
        status: payment.status,
        amount: payment.amount / 100,
        currency: payment.currency,
        method: payment.method,
        created_at: payment.created_at
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw new Error('Failed to check payment status');
    }
  }
}

export const paymentService = new PaymentService();