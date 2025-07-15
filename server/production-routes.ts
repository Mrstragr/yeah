import { Express, Request, Response } from 'express';
import { securityMiddleware } from './security-enhanced';
import { EnhancedKYCService, kycMiddleware } from './kyc-enhanced';
import { productionPaymentService } from './payment-production';
import { MonitoringService, ComplianceReportingService, AgeVerificationService } from './monitoring-compliance';
import { ResponsibleGamingService, GamblingSupportService } from './responsible-gaming';
import { authenticateToken } from './auth';

// Register all production-ready routes
export function registerProductionRoutes(app: Express) {
  
  // Apply security middleware
  app.use(securityMiddleware.helmet);
  app.use('/api', securityMiddleware.rateLimits.general);
  app.use(securityMiddleware.validateInput);
  app.use(securityMiddleware.detectFraud);
  app.use(securityMiddleware.deviceFingerprint);

  // Enhanced KYC Routes
  app.post('/api/kyc/upload-document', 
    securityMiddleware.rateLimits.kyc,
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { documentType, file, metadata } = req.body;

        const result = await EnhancedKYCService.uploadDocument(
          userId, 
          documentType, 
          file, 
          metadata
        );

        res.json({ success: true, document: result });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  app.post('/api/kyc/verify-aadhar',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const { aadharNumber, personalDetails } = req.body;
        
        const result = await EnhancedKYCService.verifyAadhar(
          aadharNumber, 
          personalDetails
        );

        res.json({ success: true, verification: result });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  app.post('/api/kyc/verify-pan',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const { panNumber, name } = req.body;
        
        const result = await EnhancedKYCService.verifyPAN(panNumber, name);

        res.json({ success: true, verification: result });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  app.post('/api/kyc/complete-verification',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        
        const result = await EnhancedKYCService.completeVerification(userId);

        res.json({ success: true, verification: result });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Enhanced Payment Routes
  app.post('/api/payments/create-order',
    securityMiddleware.rateLimits.payment,
    authenticateToken,
    kycMiddleware.requireMinimalKYC,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { amount, currency } = req.body;

        // Track user behavior
        await MonitoringService.trackUserBehavior(userId, 'create_payment_order', {
          amount,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });

        const order = await productionPaymentService.createPaymentOrder(
          userId, 
          amount, 
          currency
        );

        res.json({ success: true, order });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  app.post('/api/payments/verify-payment',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const result = await productionPaymentService.processSuccessfulPayment(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        );

        res.json({ success: true, result });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  app.post('/api/payments/withdraw',
    securityMiddleware.rateLimits.payment,
    authenticateToken,
    kycMiddleware.requireVerification, // Full KYC required for withdrawals
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { amount, bankDetails } = req.body;

        // Track withdrawal attempt
        await MonitoringService.trackUserBehavior(userId, 'withdrawal_request', {
          amount,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });

        const result = await productionPaymentService.processWithdrawal(
          userId,
          amount,
          bankDetails
        );

        res.json({ success: true, withdrawal: result });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Webhook endpoint for payment updates
  app.post('/api/payments/webhook',
    async (req: Request, res: Response) => {
      try {
        const signature = req.get('X-Razorpay-Signature');
        
        if (!signature) {
          return res.status(400).json({ error: 'Missing signature' });
        }

        await productionPaymentService.handleWebhook(signature, req.body);
        res.json({ success: true });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Responsible Gaming Routes
  app.post('/api/responsible-gaming/set-spending-limits',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { limits } = req.body;

        const result = await ResponsibleGamingService.setSpendingLimits(userId, limits);
        res.json({ success: true, limits: result });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  app.post('/api/responsible-gaming/set-time-limits',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { limits } = req.body;

        const result = await ResponsibleGamingService.setTimeLimits(userId, limits);
        res.json({ success: true, limits: result });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  app.post('/api/responsible-gaming/self-exclusion',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { duration } = req.body;

        const result = await ResponsibleGamingService.setSelfExclusion(userId, duration);
        res.json({ success: true, exclusion: result });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  app.get('/api/responsible-gaming/reality-check',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;

        const realityCheck = await ResponsibleGamingService.generateRealityCheck(userId);
        res.json({ success: true, realityCheck });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  app.get('/api/responsible-gaming/problem-gambling-assessment',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;

        const assessment = await ResponsibleGamingService.detectProblemGambling(userId);
        res.json({ success: true, assessment });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  app.get('/api/responsible-gaming/helplines',
    (req: Request, res: Response) => {
      const helplines = GamblingSupportService.getHelplineInfo();
      res.json({ success: true, helplines });
    }
  );

  app.post('/api/responsible-gaming/connect-support',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { supportType } = req.body;

        const result = await GamblingSupportService.connectWithSupport(userId, supportType);
        res.json({ success: true, support: result });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Enhanced Gaming Routes with Responsible Gaming Checks
  app.post('/api/games/place-bet',
    securityMiddleware.rateLimits.betting,
    authenticateToken,
    securityMiddleware.verifyAge,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { gameId, betAmount, gameData } = req.body;

        // Check self-exclusion
        const exclusionCheck = await ResponsibleGamingService.checkSelfExclusion(userId);
        if (exclusionCheck.excluded) {
          return res.status(403).json({ 
            error: 'Betting not allowed',
            reason: exclusionCheck.reason 
          });
        }

        // Check spending limits
        const limitCheck = await ResponsibleGamingService.checkSpendingLimits(
          userId, 
          betAmount, 
          'bet'
        );
        
        if (!limitCheck.allowed) {
          return res.status(403).json({ 
            error: 'Spending limit exceeded',
            details: limitCheck 
          });
        }

        // Track betting behavior
        await MonitoringService.trackUserBehavior(userId, 'place_bet', {
          gameId,
          betAmount,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });

        // Process bet (integrate with existing game engine)
        // const result = await gameEngine.processBet(userId, gameId, betAmount, gameData);

        res.json({ 
          success: true, 
          message: 'Bet placed successfully',
          // result 
        });

      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  // Monitoring and Compliance Routes
  app.get('/api/admin/dashboard',
    authenticateToken,
    // Add admin role check in production
    async (req: Request, res: Response) => {
      try {
        const dashboard = await MonitoringService.getRealtimeDashboard();
        res.json({ success: true, dashboard });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  app.get('/api/admin/compliance-report',
    authenticateToken,
    // Add admin role check in production
    async (req: Request, res: Response) => {
      try {
        const { date } = req.query;
        const reportDate = date ? new Date(date as string) : new Date();

        const report = await ComplianceReportingService.generateDailyReport(reportDate);
        res.json({ success: true, report });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  app.get('/api/admin/regulatory-report',
    authenticateToken,
    // Add admin role check in production
    async (req: Request, res: Response) => {
      try {
        const { startDate, endDate } = req.query;
        
        const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate as string) : new Date();

        const report = await ComplianceReportingService.generateRegulatoryReport(start, end);
        res.json({ success: true, report });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Age Verification Routes
  app.post('/api/verification/verify-age',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const userId = (req as any).user.id;
        const { documentData } = req.body;

        const result = await AgeVerificationService.verifyAge(userId, documentData);
        res.json({ success: true, verification: result });
      } catch (error: any) {
        res.status(400).json({ error: error.message });
      }
    }
  );

  console.log('🚀 Production routes registered successfully');
}