import type { Express } from 'express';
import { realMoneyEngine } from './real-money-engine';
import { AuthRequest } from './auth';

export function registerRealMoneyRoutes(app: Express) {
  
  // Place a bet in any game
  app.post('/api/games/place-bet', async (req: AuthRequest, res) => {
    try {
      const { gameId, betAmount, betType, betDetails, multiplier } = req.body;
      const userId = req.user.id;

      // Validate bet amount
      if (!betAmount || betAmount <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid bet amount' });
      }

      // Minimum bet validation (₹1)
      if (betAmount < 1) {
        return res.status(400).json({ success: false, error: 'Minimum bet amount is ₹1' });
      }

      // Maximum bet validation (₹50,000)
      if (betAmount > 50000) {
        return res.status(400).json({ success: false, error: 'Maximum bet amount is ₹50,000' });
      }

      const result = await realMoneyEngine.placeBet({
        userId,
        gameId,
        betAmount,
        betType,
        betDetails,
        multiplier
      });

      if (result.success) {
        res.json({
          success: true,
          transactionId: result.transactionId,
          balance: result.balance,
          message: 'Bet placed successfully'
        });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }

    } catch (error) {
      console.error('Error placing bet:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Process game win
  app.post('/api/games/process-win', authenticateToken, async (req, res) => {
    try {
      const { gameId, betTransactionId, winAmount, multiplier } = req.body;
      const userId = req.user.id;

      if (!winAmount || winAmount <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid win amount' });
      }

      const result = await realMoneyEngine.processWin(userId, gameId, betTransactionId, winAmount, multiplier);

      if (result.success) {
        res.json({
          success: true,
          balance: result.balance,
          message: 'Winnings credited successfully'
        });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }

    } catch (error) {
      console.error('Error processing win:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Create deposit order
  app.post('/api/wallet/create-deposit-order', authenticateToken, async (req, res) => {
    try {
      const { amount } = req.body;
      const userId = req.user.id;

      // Validate amount
      if (!amount || amount < 100) {
        return res.status(400).json({ success: false, error: 'Minimum deposit amount is ₹100' });
      }

      if (amount > 100000) {
        return res.status(400).json({ success: false, error: 'Maximum deposit amount is ₹1,00,000' });
      }

      const result = await realMoneyEngine.createDepositOrder(userId, amount);

      if (result.success) {
        res.json({
          success: true,
          orderId: result.orderId,
          amount: amount,
          currency: 'INR',
          key: process.env.RAZORPAY_KEY_ID
        });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }

    } catch (error) {
      console.error('Error creating deposit order:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Verify and process deposit
  app.post('/api/wallet/verify-deposit', authenticateToken, async (req, res) => {
    try {
      const { orderId, paymentId, signature, amount } = req.body;
      const userId = req.user.id;

      const result = await realMoneyEngine.verifyAndProcessDeposit(orderId, paymentId, signature, userId, amount);

      if (result.success) {
        res.json({
          success: true,
          balance: result.balance,
          message: 'Deposit successful'
        });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }

    } catch (error) {
      console.error('Error verifying deposit:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Process withdrawal
  app.post('/api/wallet/withdraw', authenticateToken, async (req, res) => {
    try {
      const { amount, accountDetails } = req.body;
      const userId = req.user.id;

      // Validate amount
      if (!amount || amount < 500) {
        return res.status(400).json({ success: false, error: 'Minimum withdrawal amount is ₹500' });
      }

      if (amount > 50000) {
        return res.status(400).json({ success: false, error: 'Maximum withdrawal amount is ₹50,000' });
      }

      // Validate account details
      if (!accountDetails || !accountDetails.accountNumber || !accountDetails.ifscCode) {
        return res.status(400).json({ success: false, error: 'Bank account details required' });
      }

      const result = await realMoneyEngine.processWithdrawal(userId, amount, accountDetails);

      if (result.success) {
        res.json({
          success: true,
          withdrawalId: result.withdrawalId,
          message: 'Withdrawal request submitted successfully'
        });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }

    } catch (error) {
      console.error('Error processing withdrawal:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Get user balance
  app.get('/api/wallet/balance', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await realMoneyEngine.getUserBalance(userId);

      if (result.success) {
        res.json({
          success: true,
          balance: result.balance
        });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }

    } catch (error) {
      console.error('Error getting balance:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Get transaction history
  app.get('/api/wallet/transactions', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await realMoneyEngine.getTransactionHistory(userId, limit);

      if (result.success) {
        res.json({
          success: true,
          transactions: result.transactions
        });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }

    } catch (error) {
      console.error('Error getting transactions:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // UPI payment verification (for UPI direct payments)
  app.post('/api/wallet/verify-upi', authenticateToken, async (req, res) => {
    try {
      const { upiId, amount, transactionRef } = req.body;
      const userId = req.user.id;

      // In production, integrate with UPI gateway for verification
      // For now, we'll simulate verification
      
      if (!upiId || !amount || !transactionRef) {
        return res.status(400).json({ success: false, error: 'UPI details required' });
      }

      // Simulate UPI verification (in production, call UPI gateway)
      const isValid = true; // Replace with actual UPI verification

      if (isValid) {
        const result = await realMoneyEngine.verifyAndProcessDeposit(
          `UPI_${transactionRef}`, 
          transactionRef, 
          'upi_verified', 
          userId, 
          amount
        );

        if (result.success) {
          res.json({
            success: true,
            balance: result.balance,
            message: 'UPI payment verified and credited'
          });
        } else {
          res.status(400).json({ success: false, error: result.error });
        }
      } else {
        res.status(400).json({ success: false, error: 'UPI verification failed' });
      }

    } catch (error) {
      console.error('Error verifying UPI:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

  // Get game statistics
  app.get('/api/games/stats', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      
      // In production, calculate real statistics from database
      const stats = {
        totalBets: 156,
        totalWins: 89,
        totalProfit: 12450.75,
        winRate: 57.1,
        favoriteGame: 'WIN GO',
        biggestWin: 25600.00,
        gamesPlayed: 8
      };

      res.json({
        success: true,
        stats
      });

    } catch (error) {
      console.error('Error getting game stats:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
}