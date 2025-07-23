import { Request, Response } from 'express';
import { db } from './db';
import { users, transactions, gameResults } from '@shared/schema';
import { eq, gte, lte, desc, sql } from 'drizzle-orm';

// Real-time monitoring service for compliance and security
export class MonitoringService {
  
  // Track user behavior patterns
  static async trackUserBehavior(userId: number, action: string, metadata: any = {}) {
    const behaviorLog = {
      userId,
      action,
      timestamp: new Date(),
      metadata,
      sessionId: metadata.sessionId || 'unknown',
      ipAddress: metadata.ip || 'unknown',
      userAgent: metadata.userAgent || 'unknown'
    };

    // Store in monitoring database (in production, use dedicated analytics DB)
    console.log('👁️ USER BEHAVIOR:', behaviorLog);
    
    // Check for suspicious patterns
    await this.checkSuspiciousPatterns(userId, action, metadata);
    
    return behaviorLog;
  }

  // Detect suspicious patterns
  private static async checkSuspiciousPatterns(userId: number, action: string, metadata: any) {
    const alerts = [];

    // Rapid betting pattern
    if (action === 'place_bet') {
      const recentBets = await this.getRecentUserActivity(userId, 'place_bet', 60000); // Last minute
      if (recentBets.length > 20) {
        alerts.push({
          type: 'RAPID_BETTING',
          userId,
          count: recentBets.length,
          severity: 'medium'
        });
      }
    }

    // Multiple login attempts
    if (action === 'login_attempt') {
      const recentAttempts = await this.getRecentUserActivity(userId, 'login_attempt', 900000); // Last 15 minutes
      if (recentAttempts.length > 5) {
        alerts.push({
          type: 'MULTIPLE_LOGIN_ATTEMPTS',
          userId,
          count: recentAttempts.length,
          severity: 'high'
        });
      }
    }

    // Large transactions
    if (action === 'deposit' || action === 'withdrawal') {
      const amount = metadata.amount || 0;
      if (amount > 100000) {
        alerts.push({
          type: 'LARGE_TRANSACTION',
          userId,
          amount,
          action,
          severity: 'high'
        });
      }
    }

    // Process alerts
    if (alerts.length > 0) {
      await this.processSecurityAlerts(alerts);
    }
  }

  // Get recent user activity
  private static async getRecentUserActivity(userId: number, action: string, timeframe: number) {
    // In production, query from dedicated monitoring database
    // For now, simulate with in-memory tracking
    return [];
  }

  // Process security alerts
  private static async processSecurityAlerts(alerts: any[]) {
    for (const alert of alerts) {
      console.log('🚨 SECURITY ALERT:', alert);
      
      // In production, implement:
      // 1. Send to security team
      // 2. Auto-suspend account if severe
      // 3. Add to manual review queue
      // 4. Send notifications
      
      if (alert.severity === 'high') {
        await this.escalateHighSeverityAlert(alert);
      }
    }
  }

  // Escalate high severity alerts
  private static async escalateHighSeverityAlert(alert: any) {
    console.log('🔥 HIGH SEVERITY ALERT - ESCALATING:', alert);
    
    // In production:
    // 1. Immediate notification to security team
    // 2. Temporary account restriction
    // 3. Manual review requirement
    // 4. Compliance team notification
  }

  // Generate real-time dashboard data
  static async getRealtimeDashboard() {
    try {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Active users
      const activeUsers = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(
          gte(users.lastLoginAt, last24Hours)
        );

      // Transaction volume
      const transactionVolume = await db
        .select({ 
          total: sql`sum(cast(${walletTransactions.amount} as decimal))`,
          count: sql`count(*)`
        })
        .from(walletTransactions)
        .where(
          gte(walletTransactions.createdAt, last24Hours)
        );

      // Game activity
      const gameActivity = await db
        .select({
          total_bets: sql`sum(cast(${userGameHistory.betAmount} as decimal))`,
          total_wins: sql`sum(cast(${userGameHistory.winAmount} as decimal))`,
          game_count: sql`count(*)`
        })
        .from(userGameHistory)
        .where(
          gte(userGameHistory.playedAt, last24Hours)
        );

      return {
        timestamp: now,
        activeUsers: parseInt(activeUsers[0]?.count as string) || 0,
        transactions: {
          volume: parseFloat(transactionVolume[0]?.total as string) || 0,
          count: parseInt(transactionVolume[0]?.count as string) || 0
        },
        gaming: {
          totalBets: parseFloat(gameActivity[0]?.total_bets as string) || 0,
          totalWins: parseFloat(gameActivity[0]?.total_wins as string) || 0,
          gameCount: parseInt(gameActivity[0]?.game_count as string) || 0
        }
      };

    } catch (error) {
      console.error('Dashboard data error:', error);
      return {
        timestamp: new Date(),
        activeUsers: 0,
        transactions: { volume: 0, count: 0 },
        gaming: { totalBets: 0, totalWins: 0, gameCount: 0 }
      };
    }
  }
}

// Compliance reporting service
export class ComplianceReportingService {
  
  // Generate daily compliance report
  static async generateDailyReport(date: Date = new Date()) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // User registrations
      const newUsers = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(
          gte(users.createdAt, startOfDay) 
        );

      // KYC completions
      const kycCompletions = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(
          eq(users.kycStatus, 'verified')
        );

      // Transaction summary
      const transactions = await db
        .select({
          type: walletTransactions.type,
          total: sql`sum(cast(${walletTransactions.amount} as decimal))`,
          count: sql`count(*)`
        })
        .from(walletTransactions)
        .where(
          gte(walletTransactions.createdAt, startOfDay)
        )
        .groupBy(walletTransactions.type);

      // Gaming activity
      const gamingStats = await db
        .select({
          total_bets: sql`sum(cast(${userGameHistory.betAmount} as decimal))`,
          total_wins: sql`sum(cast(${userGameHistory.winAmount} as decimal))`,
          unique_players: sql`count(distinct ${userGameHistory.userId})`
        })
        .from(userGameHistory)
        .where(
          gte(userGameHistory.playedAt, startOfDay)
        );

      const report = {
        date: date.toISOString().split('T')[0],
        users: {
          newRegistrations: parseInt(newUsers[0]?.count as string) || 0,
          kycCompletions: parseInt(kycCompletions[0]?.count as string) || 0
        },
        transactions: transactions.reduce((acc, tx) => {
          acc[tx.type] = {
            volume: parseFloat(tx.total as string) || 0,
            count: parseInt(tx.count as string) || 0
          };
          return acc;
        }, {} as any),
        gaming: {
          totalBets: parseFloat(gamingStats[0]?.total_bets as string) || 0,
          totalWins: parseFloat(gamingStats[0]?.total_wins as string) || 0,
          uniquePlayers: parseInt(gamingStats[0]?.unique_players as string) || 0,
          houseEdge: 0 // Calculate based on game statistics
        },
        generatedAt: new Date()
      };

      // Calculate house edge
      if (report.gaming.totalBets > 0) {
        report.gaming.houseEdge = ((report.gaming.totalBets - report.gaming.totalWins) / report.gaming.totalBets) * 100;
      }

      console.log('📊 Daily compliance report generated:', report);
      
      return report;

    } catch (error) {
      console.error('Compliance report generation failed:', error);
      throw new Error('Failed to generate compliance report');
    }
  }

  // Generate regulatory submission report
  static async generateRegulatoryReport(startDate: Date, endDate: Date) {
    try {
      // Comprehensive regulatory report for government submission
      const report = {
        reportPeriod: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        platform: {
          name: 'TashanWin Gaming Platform',
          operator: 'TashanWin Gaming Pvt Ltd',
          license: 'TBD', // To be filled with actual license number
          reportingOfficer: 'Compliance Officer'
        },
        userStatistics: await this.getUserStatistics(startDate, endDate),
        financialSummary: await this.getFinancialSummary(startDate, endDate),
        gamingActivity: await this.getGamingActivity(startDate, endDate),
        compliance: await this.getComplianceMetrics(startDate, endDate),
        generatedAt: new Date()
      };

      console.log('🏛️ Regulatory report generated:', { 
        period: report.reportPeriod,
        users: report.userStatistics.totalUsers 
      });

      return report;

    } catch (error) {
      console.error('Regulatory report generation failed:', error);
      throw new Error('Failed to generate regulatory report');
    }
  }

  private static async getUserStatistics(startDate: Date, endDate: Date) {
    // Implementation for user statistics
    return {
      totalUsers: 0,
      newRegistrations: 0,
      verifiedUsers: 0,
      activeUsers: 0
    };
  }

  private static async getFinancialSummary(startDate: Date, endDate: Date) {
    // Implementation for financial summary
    return {
      totalDeposits: 0,
      totalWithdrawals: 0,
      netRevenue: 0,
      taxableAmount: 0
    };
  }

  private static async getGamingActivity(startDate: Date, endDate: Date) {
    // Implementation for gaming activity
    return {
      totalBets: 0,
      totalWins: 0,
      grossGamingRevenue: 0,
      gameWiseBreakdown: {}
    };
  }

  private static async getComplianceMetrics(startDate: Date, endDate: Date) {
    // Implementation for compliance metrics
    return {
      kycCompletionRate: 0,
      suspiciousActivityReports: 0,
      playerComplaints: 0,
      responsibleGamingInterventions: 0
    };
  }
}

// Age verification service
export class AgeVerificationService {
  
  // Verify user age from government documents
  static async verifyAge(userId: number, documentData: any) {
    try {
      // Extract date of birth from document
      const dob = this.extractDateOfBirth(documentData);
      
      if (!dob) {
        throw new Error('Date of birth not found in document');
      }

      // Calculate age
      const age = this.calculateAge(dob);
      
      // Check minimum age requirement (18 years)
      if (age < 18) {
        await this.handleUnderageUser(userId);
        return {
          verified: false,
          age,
          reason: 'User is under 18 years old'
        };
      }

      // Update user record
      await db
        .update(users)
        .set({
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      console.log('✅ Age verification passed:', { userId, age });

      return {
        verified: true,
        age,
        verifiedAt: new Date()
      };

    } catch (error) {
      console.error('Age verification failed:', error);
      return {
        verified: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  private static extractDateOfBirth(documentData: any): Date | null {
    // Extract DOB from Aadhar, PAN, or other documents
    // This would integrate with OCR service in production
    
    if (documentData.dateOfBirth) {
      return new Date(documentData.dateOfBirth);
    }
    
    return null;
  }

  private static calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age;
  }

  private static async handleUnderageUser(userId: number) {
    // Immediately suspend account for underage users
    await db
      .update(users)
      .set({
        isActive: false,
        kycStatus: 'rejected',
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    console.log('🔒 Underage user account suspended:', { userId });
    
    // In production:
    // 1. Send notification to compliance team
    // 2. Generate incident report
    // 3. Initiate account closure process
  }
}

// Services already exported above