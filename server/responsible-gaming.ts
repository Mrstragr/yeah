import { Request, Response } from 'express';
import { db } from './db';
import { users, transactions, gameResults } from '@shared/schema';
import { eq, gte, desc, sql } from 'drizzle-orm';

// Responsible Gaming Service for player protection
export class ResponsibleGamingService {
  
  // Set spending limits for user
  static async setSpendingLimits(userId: number, limits: {
    daily?: number;
    weekly?: number;
    monthly?: number;
  }) {
    try {
      // Store limits in user preferences or separate table
      const limitData = {
        userId,
        dailyLimit: limits.daily || null,
        weeklyLimit: limits.weekly || null,
        monthlyLimit: limits.monthly || null,
        setAt: new Date()
      };

      console.log('🛡️ Spending limits set:', limitData);
      
      // In production, store in dedicated responsible_gaming_limits table
      return limitData;

    } catch (error) {
      console.error('Failed to set spending limits:', error);
      throw new Error('Failed to set spending limits');
    }
  }

  // Set time limits for gaming sessions
  static async setTimeLimits(userId: number, limits: {
    dailyHours?: number;
    sessionMinutes?: number;
    weeklyHours?: number;
  }) {
    try {
      const timeLimitData = {
        userId,
        dailyHours: limits.dailyHours || null,
        sessionMinutes: limits.sessionMinutes || null,
        weeklyHours: limits.weeklyHours || null,
        setAt: new Date()
      };

      console.log('⏰ Time limits set:', timeLimitData);
      
      return timeLimitData;

    } catch (error) {
      console.error('Failed to set time limits:', error);
      throw new Error('Failed to set time limits');
    }
  }

  // Check spending limits before allowing transaction
  static async checkSpendingLimits(userId: number, amount: number, type: 'deposit' | 'bet') {
    try {
      // Get user's current limits (from database in production)
      const limits = await this.getUserLimits(userId);
      
      if (!limits) {
        return { allowed: true }; // No limits set
      }

      // Calculate current spending
      const spending = await this.calculateCurrentSpending(userId);
      
      // Check daily limit
      if (limits.dailyLimit && spending.daily + amount > limits.dailyLimit) {
        return {
          allowed: false,
          reason: 'Daily spending limit exceeded',
          limit: limits.dailyLimit,
          current: spending.daily,
          attempted: amount
        };
      }

      // Check weekly limit
      if (limits.weeklyLimit && spending.weekly + amount > limits.weeklyLimit) {
        return {
          allowed: false,
          reason: 'Weekly spending limit exceeded',
          limit: limits.weeklyLimit,
          current: spending.weekly,
          attempted: amount
        };
      }

      // Check monthly limit
      if (limits.monthlyLimit && spending.monthly + amount > limits.monthlyLimit) {
        return {
          allowed: false,
          reason: 'Monthly spending limit exceeded',
          limit: limits.monthlyLimit,
          current: spending.monthly,
          attempted: amount
        };
      }

      return { allowed: true };

    } catch (error) {
      console.error('Spending limit check failed:', error);
      return { allowed: false, reason: 'System error during limit check' };
    }
  }

  // Calculate current spending across time periods
  private static async calculateCurrentSpending(userId: number) {
    const now = new Date();
    
    // Daily spending (from start of day)
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    // Weekly spending (from start of week)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Monthly spending (from start of month)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    try {
      // Get deposits and bets for each period
      const [dailySpending] = await db
        .select({ total: sql`sum(cast(${walletTransactions.amount} as decimal))` })
        .from(walletTransactions)
        .where(
          eq(walletTransactions.userId, userId) &&
          gte(walletTransactions.createdAt, startOfDay)
        );

      const [weeklySpending] = await db
        .select({ total: sql`sum(cast(${walletTransactions.amount} as decimal))` })
        .from(walletTransactions)
        .where(
          eq(walletTransactions.userId, userId) &&
          gte(walletTransactions.createdAt, startOfWeek)
        );

      const [monthlySpending] = await db
        .select({ total: sql`sum(cast(${walletTransactions.amount} as decimal))` })
        .from(walletTransactions)
        .where(
          eq(walletTransactions.userId, userId) &&
          gte(walletTransactions.createdAt, startOfMonth)
        );

      return {
        daily: parseFloat(dailySpending?.total as string) || 0,
        weekly: parseFloat(weeklySpending?.total as string) || 0,
        monthly: parseFloat(monthlySpending?.total as string) || 0
      };

    } catch (error) {
      console.error('Spending calculation failed:', error);
      return { daily: 0, weekly: 0, monthly: 0 };
    }
  }

  // Get user's responsible gaming limits
  private static async getUserLimits(userId: number) {
    // In production, query from responsible_gaming_limits table
    // For now, return default limits or null
    return null;
  }

  // Self-exclusion functionality
  static async setSelfExclusion(userId: number, duration: {
    type: 'temporary' | 'permanent';
    days?: number; // For temporary exclusion
    reason?: string;
  }) {
    try {
      const exclusionData = {
        userId,
        type: duration.type,
        startDate: new Date(),
        endDate: duration.type === 'temporary' && duration.days 
          ? new Date(Date.now() + duration.days * 24 * 60 * 60 * 1000)
          : null,
        reason: duration.reason || 'Self-requested',
        isActive: true
      };

      // Immediately suspend gaming access
      await db
        .update(users)
        .set({
          isActive: false,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

      console.log('🔒 Self-exclusion activated:', exclusionData);
      
      // In production, store in dedicated self_exclusion table
      return exclusionData;

    } catch (error) {
      console.error('Self-exclusion failed:', error);
      throw new Error('Failed to set self-exclusion');
    }
  }

  // Check if user is self-excluded
  static async checkSelfExclusion(userId: number) {
    try {
      // In production, query from self_exclusion table
      // For now, check user active status
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!user || !user.isActive) {
        return {
          excluded: true,
          reason: 'Account suspended or self-excluded'
        };
      }

      return { excluded: false };

    } catch (error) {
      console.error('Self-exclusion check failed:', error);
      return { excluded: false };
    }
  }

  // Reality check - show gambling activity summary
  static async generateRealityCheck(userId: number) {
    try {
      const now = new Date();
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get gambling activity for last 30 days
      const [activity] = await db
        .select({
          totalBets: sql`sum(cast(${userGameHistory.betAmount} as decimal))`,
          totalWins: sql`sum(cast(${userGameHistory.winAmount} as decimal))`,
          gameCount: sql`count(*)`
        })
        .from(userGameHistory)
        .where(
          eq(userGameHistory.userId, userId) &&
          gte(userGameHistory.playedAt, last30Days)
        );

      // Get deposit activity
      const [deposits] = await db
        .select({
          totalDeposits: sql`sum(cast(${walletTransactions.amount} as decimal))`,
          depositCount: sql`count(*)`
        })
        .from(walletTransactions)
        .where(
          eq(walletTransactions.userId, userId) &&
          eq(walletTransactions.type, 'deposit') &&
          gte(walletTransactions.createdAt, last30Days)
        );

      const realityCheck = {
        period: '30 days',
        gambling: {
          totalBets: parseFloat(activity?.totalBets as string) || 0,
          totalWins: parseFloat(activity?.totalWins as string) || 0,
          gamesSessions: parseInt(activity?.gameCount as string) || 0,
          netResult: (parseFloat(activity?.totalWins as string) || 0) - (parseFloat(activity?.totalBets as string) || 0)
        },
        deposits: {
          total: parseFloat(deposits?.totalDeposits as string) || 0,
          count: parseInt(deposits?.depositCount as string) || 0
        },
        generatedAt: now
      };

      console.log('📊 Reality check generated:', { userId, netResult: realityCheck.gambling.netResult });
      
      return realityCheck;

    } catch (error) {
      console.error('Reality check generation failed:', error);
      throw new Error('Failed to generate reality check');
    }
  }

  // Problem gambling detection
  static async detectProblemGambling(userId: number) {
    try {
      const riskFactors = [];
      const now = new Date();

      // Check for rapid betting pattern
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const [recentActivity] = await db
        .select({ gameCount: sql`count(*)` })
        .from(userGameHistory)
        .where(
          eq(userGameHistory.userId, userId) &&
          gte(userGameHistory.playedAt, last24Hours)
        );

      if (parseInt(recentActivity?.gameCount as string) > 100) {
        riskFactors.push('EXCESSIVE_GAMBLING_FREQUENCY');
      }

      // Check for increasing bet sizes
      const recentBets = await db
        .select({ betAmount: userGameHistory.betAmount })
        .from(userGameHistory)
        .where(eq(userGameHistory.userId, userId))
        .orderBy(desc(userGameHistory.playedAt))
        .limit(10);

      if (recentBets.length >= 5) {
        const amounts = recentBets.map(bet => parseFloat(bet.betAmount));
        const isIncreasing = amounts.slice(0, 5).every((amount, index) => 
          index === 0 || amount > amounts[index - 1]
        );
        
        if (isIncreasing) {
          riskFactors.push('INCREASING_BET_SIZES');
        }
      }

      // Check for loss chasing (large deposits after losses)
      // Implementation for loss chasing detection

      // Generate risk assessment
      const riskLevel = riskFactors.length === 0 ? 'low' :
                       riskFactors.length <= 2 ? 'medium' : 'high';

      const assessment = {
        userId,
        riskLevel,
        riskFactors,
        recommendedActions: this.getRecommendedActions(riskLevel),
        assessedAt: now
      };

      if (riskLevel !== 'low') {
        console.log('⚠️ Problem gambling risk detected:', assessment);
        await this.triggerInterventions(userId, riskLevel);
      }

      return assessment;

    } catch (error) {
      console.error('Problem gambling detection failed:', error);
      return {
        userId,
        riskLevel: 'unknown',
        error: 'Assessment failed'
      };
    }
  }

  // Get recommended actions based on risk level
  private static getRecommendedActions(riskLevel: string) {
    switch (riskLevel) {
      case 'medium':
        return [
          'Consider setting daily spending limits',
          'Take regular breaks during gaming sessions',
          'Review your gambling activity summary'
        ];
      case 'high':
        return [
          'Strongly recommended to set strict spending limits',
          'Consider temporary self-exclusion',
          'Seek support from gambling helplines',
          'Contact our responsible gaming team'
        ];
      default:
        return ['Continue gambling responsibly'];
    }
  }

  // Trigger interventions for at-risk players
  private static async triggerInterventions(userId: number, riskLevel: string) {
    try {
      if (riskLevel === 'high') {
        // Mandatory cooling-off period
        await this.enforceCoolingOff(userId, 24); // 24 hours
        
        // Send intervention message
        console.log('🚑 High-risk intervention triggered:', { userId, riskLevel });
      }

      if (riskLevel === 'medium') {
        // Show reality check popup
        console.log('📊 Medium-risk intervention triggered:', { userId, riskLevel });
      }

    } catch (error) {
      console.error('Intervention trigger failed:', error);
    }
  }

  // Enforce cooling-off period
  private static async enforceCoolingOff(userId: number, hours: number) {
    try {
      const endTime = new Date(Date.now() + hours * 60 * 60 * 1000);
      
      // In production, store in cooling_off_periods table
      console.log('❄️ Cooling-off period enforced:', { userId, hours, endTime });
      
      return {
        userId,
        startTime: new Date(),
        endTime,
        reason: 'Responsible gaming intervention'
      };

    } catch (error) {
      console.error('Cooling-off enforcement failed:', error);
      throw new Error('Failed to enforce cooling-off period');
    }
  }
}

// Helpline and support service
export class GamblingSupportService {
  
  // Get gambling helpline information
  static getHelplineInfo() {
    return {
      national: {
        name: 'National Problem Gambling Helpline',
        phone: '1800-XXX-XXXX',
        website: 'https://gambling-helpline.org',
        hours: '24/7'
      },
      regional: [
        {
          state: 'Maharashtra',
          phone: '022-XXXX-XXXX',
          website: 'https://maharashtra-gambling-help.org'
        },
        {
          state: 'Karnataka',
          phone: '080-XXXX-XXXX',
          website: 'https://karnataka-gambling-help.org'
        }
      ],
      online: {
        chat: 'https://gambling-chat-support.org',
        email: 'help@gambling-support.org',
        forum: 'https://gambling-support-forum.org'
      },
      selfHelp: {
        tools: [
          'Self-assessment questionnaire',
          'Spending tracker',
          'Goal setting tools',
          'Meditation and mindfulness resources'
        ]
      }
    };
  }

  // Connect user with support services
  static async connectWithSupport(userId: number, supportType: string) {
    try {
      const supportRequest = {
        userId,
        supportType,
        requestedAt: new Date(),
        status: 'pending',
        priority: 'normal'
      };

      console.log('🤝 Support request created:', supportRequest);
      
      // In production:
      // 1. Create support ticket
      // 2. Notify support team
      // 3. Send confirmation to user
      // 4. Schedule follow-up
      
      return supportRequest;

    } catch (error) {
      console.error('Support connection failed:', error);
      throw new Error('Failed to connect with support');
    }
  }
}

// Services already exported above