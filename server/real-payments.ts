import express from 'express';
import crypto from 'crypto';
import { storage } from './storage';
import { authenticateToken } from './real-auth';

const router = express.Router();

// Initialize Razorpay (fallback to demo mode if keys not provided)
let razorpayInstance: any = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    const Razorpay = require('razorpay');
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (error) {
  console.log('Razorpay not available, using demo mode');
}

// Create payment order
router.post('/create-order', authenticateToken, async (req: any, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }

    if (amount < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Minimum deposit amount is ₹10' 
      });
    }

    if (amount > 50000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum deposit amount is ₹50,000' 
      });
    }

    let orderId: string;

    if (razorpayInstance) {
      // Real Razorpay integration
      const options = {
        amount: amount * 100, // Amount in paise
        currency,
        receipt: `order_${userId}_${Date.now()}`,
      };

      const order = await razorpayInstance.orders.create(options);
      orderId = order.id;
    } else {
      // Demo mode
      orderId = `order_demo_${Date.now()}`;
    }

    // Store pending transaction
    const transaction = await storage.createTransaction({
      userId,
      type: 'deposit',
      amount: amount.toString(),
      status: 'pending',
      orderId,
      paymentMethod: 'razorpay',
      metadata: JSON.stringify({ currency })
    });

    res.json({
      success: true,
      orderId,
      amount,
      currency,
      transactionId: transaction.id
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create payment order' 
    });
  }
});

// Verify payment
router.post('/verify', authenticateToken, async (req: any, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing payment verification data' 
      });
    }

    let isValidSignature = false;

    if (razorpayInstance && process.env.RAZORPAY_KEY_SECRET) {
      // Real signature verification
      const sign = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex');

      isValidSignature = expectedSign === razorpay_signature;
    } else {
      // Demo mode - always valid
      isValidSignature = true;
    }

    if (!isValidSignature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment signature' 
      });
    }

    // Find pending transaction
    const transaction = await storage.getTransactionByOrderId(razorpay_order_id);
    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }

    if (transaction.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized transaction access' 
      });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Transaction already processed' 
      });
    }

    // Update transaction status
    await storage.updateTransactionStatus(transaction.id, 'completed', razorpay_payment_id);

    // Add money to user wallet
    const currentBalance = parseFloat(req.user.walletBalance || '0');
    const depositAmount = parseFloat(transaction.amount);
    const newBalance = currentBalance + depositAmount;

    await storage.updateUserBalance(userId, newBalance.toString());

    // Log wallet transaction
    await storage.createWalletTransaction({
      userId,
      type: 'credit',
      amount: transaction.amount,
      description: `Deposit via Razorpay - ${razorpay_payment_id}`,
      transactionId: transaction.id
    });

    res.json({
      success: true,
      message: 'Payment verified and wallet updated',
      newBalance: newBalance.toString(),
      transactionId: transaction.id
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification failed' 
    });
  }
});

// Initiate withdrawal
router.post('/withdraw', authenticateToken, async (req: any, res) => {
  try {
    const { amount, method, details } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }

    if (amount < 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'Minimum withdrawal amount is ₹100' 
      });
    }

    const currentBalance = parseFloat(req.user.walletBalance || '0');
    if (amount > currentBalance) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient balance' 
      });
    }

    if (!method || !details) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment method and details are required' 
      });
    }

    // Validate payment details based on method
    if (method === 'upi' && !details.upiId) {
      return res.status(400).json({ 
        success: false, 
        message: 'UPI ID is required' 
      });
    }

    if (method === 'netbanking' && (!details.accountNumber || !details.ifsc || !details.accountHolderName)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Complete bank details are required' 
      });
    }

    // Deduct amount from wallet
    const newBalance = currentBalance - amount;
    await storage.updateUserBalance(userId, newBalance.toString());

    // Create withdrawal transaction
    const transaction = await storage.createTransaction({
      userId,
      type: 'withdrawal',
      amount: amount.toString(),
      status: 'pending',
      paymentMethod: method,
      metadata: JSON.stringify(details)
    });

    // Log wallet transaction
    await storage.createWalletTransaction({
      userId,
      type: 'debit',
      amount: amount.toString(),
      description: `Withdrawal request - ${method.toUpperCase()}`,
      transactionId: transaction.id
    });

    // In real implementation, integrate with bank transfer APIs
    // For now, we'll simulate processing
    setTimeout(async () => {
      try {
        // Simulate processing delay
        await storage.updateTransactionStatus(transaction.id, 'completed');
      } catch (error) {
        console.error('Withdrawal processing error:', error);
      }
    }, 5000);

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      transactionId: transaction.id,
      newBalance: newBalance.toString(),
      estimatedTime: '1-2 business days'
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Withdrawal request failed' 
    });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, type } = req.query;

    const transactions = await storage.getUserTransactions(
      userId, 
      parseInt(page), 
      parseInt(limit), 
      type
    );

    res.json({
      success: true,
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: transactions.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch transactions' 
    });
  }
});

// Get wallet balance
router.get('/balance', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const user = await storage.getUser(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      balance: user.walletBalance,
      userId: user.id
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch balance' 
    });
  }
});

// Wallet transaction history
router.get('/wallet-history', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    const transactions = await storage.getWalletTransactions(
      userId, 
      parseInt(page), 
      parseInt(limit)
    );

    res.json({
      success: true,
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: transactions.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get wallet history error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch wallet history' 
    });
  }
});

export default router;