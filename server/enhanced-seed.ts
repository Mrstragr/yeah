import { db } from "./db";
import { games, gameCategories, achievements, promotions, gameMetrics, users } from "@shared/schema";
import { eq } from "drizzle-orm";

const allGames = [
  {
    title: "Aviator",
    description: "Watch the plane fly higher! Cash out before it crashes for multiplied winnings.",
    category: "crash",
    imageUrl: "/api/placeholder/300/200",
    rating: "4.8",
    jackpot: "50000",
    isActive: true
  },
  {
    title: "Coin Flip",
    description: "Classic heads or tails game with instant results and fair odds.",
    category: "quick",
    imageUrl: "/api/placeholder/300/200",
    rating: "4.7",
    jackpot: "10000",
    isActive: true
  },
  {
    title: "Dice Roll",
    description: "Roll the dice and predict the outcome. Multiple betting options available.",
    category: "dice",
    imageUrl: "/api/placeholder/300/200",
    rating: "4.6",
    jackpot: "25000",
    isActive: true
  },
  {
    title: "Big Small",
    description: "Predict if the dice sum will be big (11-17) or small (4-10).",
    category: "dice",
    imageUrl: "/api/placeholder/300/200",
    rating: "4.5",
    jackpot: "15000",
    isActive: true
  },
  {
    title: "Blackjack",
    description: "Beat the dealer with cards totaling 21 or closest without going over.",
    category: "cards",
    imageUrl: "/api/placeholder/300/200",
    rating: "4.9",
    jackpot: "100000",
    isActive: true
  },
  {
    title: "Lucky Numbers",
    description: "Pick your lucky numbers and watch the balls drop for massive wins.",
    category: "lottery",
    imageUrl: "/api/placeholder/300/200",
    rating: "4.4",
    jackpot: "75000",
    isActive: true
  },
  {
    title: "Plinko",
    description: "Drop the ball and watch it bounce through pegs to win prizes.",
    category: "arcade",
    imageUrl: "/api/placeholder/300/200",
    rating: "4.8",
    jackpot: "40000",
    isActive: true
  }
];

const gameCategories_data = [
  {
    name: "Crash Games",
    slug: "crash", 
    description: "High-risk, high-reward games with multiplier mechanics",
    icon: "🚀",
    color: "#ff6b35",
    isActive: true
  },
  {
    name: "Quick Games",
    slug: "quick",
    description: "Fast-paced games with instant results",
    icon: "⚡",
    color: "#ffd43b",
    isActive: true
  },
  {
    name: "Dice Games", 
    slug: "dice",
    description: "Traditional dice games with modern twists",
    icon: "🎲",
    color: "#69db7c",
    isActive: true
  },
  {
    name: "Card Games",
    slug: "cards",
    description: "Classic card games with strategic gameplay",
    icon: "🃏",
    color: "#4dabf7",
    isActive: true
  },
  {
    name: "Lottery",
    slug: "lottery",
    description: "Number-based games with massive jackpots",
    icon: "🎱",
    color: "#da77f2",
    isActive: true
  },
  {
    name: "Arcade",
    slug: "arcade",
    description: "Fun arcade-style games with unique mechanics",
    icon: "🎮",
    color: "#f06292",
    isActive: true
  }
];

const achievements_data = [
  {
    title: "First Win",
    description: "Win your first game",
    icon: "🏆",
    category: "gaming",
    color: "#ffd700",
    condition: JSON.stringify({ type: "win_count", value: 1 }),
    reward: "100",
    xpValue: 50,
    rarity: "common"
  },
  {
    title: "High Roller",
    description: "Place a bet of ₹5000 or more",
    icon: "💎",
    category: "milestone",
    color: "#00bcd4",
    condition: JSON.stringify({ type: "single_bet", value: 5000 }),
    reward: "500",
    xpValue: 200,
    rarity: "rare"
  },
  {
    title: "Lucky Streak",
    description: "Win 5 games in a row",
    icon: "🍀",
    category: "streak",
    color: "#4caf50",
    condition: JSON.stringify({ type: "win_streak", value: 5 }),
    reward: "1000",
    xpValue: 300,
    rarity: "epic"
  },
  {
    title: "Jackpot Hunter",
    description: "Win a jackpot prize",
    icon: "🎯",
    category: "jackpot",
    color: "#ff5722",
    condition: JSON.stringify({ type: "jackpot_win", value: 1 }),
    reward: "2500",
    xpValue: 500,
    rarity: "legendary"
  },
  {
    title: "Daily Player",
    description: "Play games for 7 consecutive days",
    icon: "📅",
    category: "gameplay",
    color: "#9c27b0",
    condition: JSON.stringify({ type: "daily_streak", value: 7 }),
    reward: "750",
    xpValue: 150,
    rarity: "rare"
  }
];

const promotions_data = [
  {
    title: "Welcome Bonus",
    description: "100% match bonus on your first deposit up to ₹10,000",
    type: "deposit_match",
    value: "100",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: "Daily Cashback",
    description: "Get 10% cashback on all losses every day",
    type: "cashback",
    value: "10",
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: "VIP Rewards",
    description: "Exclusive bonuses for VIP members",
    type: "vip_bonus",
    value: "25",
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    isActive: true
  }
];

export async function enhancedSeed() {
  console.log("🚀 Starting enhanced database seeding...");

  try {
    // Clear existing data
    await db.delete(gameMetrics);
    await db.delete(games);
    await db.delete(gameCategories);
    await db.delete(achievements);
    await db.delete(promotions);

    // Insert game categories
    console.log("📂 Seeding game categories...");
    const insertedCategories = await db.insert(gameCategories).values(gameCategories_data).returning();
    console.log(`✅ Inserted ${insertedCategories.length} game categories`);

    // Insert games
    console.log("🎮 Seeding games...");
    const insertedGames = await db.insert(games).values(allGames).returning();
    console.log(`✅ Inserted ${insertedGames.length} games`);

    // Insert achievements
    console.log("🏆 Seeding achievements...");
    const insertedAchievements = await db.insert(achievements).values(achievements_data).returning();
    console.log(`✅ Inserted ${insertedAchievements.length} achievements`);

    // Insert promotions
    console.log("🎁 Seeding promotions...");
    const insertedPromotions = await db.insert(promotions).values(promotions_data).returning();
    console.log(`✅ Inserted ${insertedPromotions.length} promotions`);

    // Initialize game metrics for each game
    console.log("📊 Initializing game metrics...");
    const gameMetricsData = insertedGames.map(game => ({
      gameId: game.id,
      totalPlayers: Math.floor(Math.random() * 1000) + 100,
      activePlayers: Math.floor(Math.random() * 50) + 10,
      totalBets: (Math.random() * 1000000).toFixed(2),
      totalWins: (Math.random() * 800000).toFixed(2),
      jackpotAmount: game.jackpot,
      lastUpdated: new Date()
    }));

    await db.insert(gameMetrics).values(gameMetricsData);
    console.log(`✅ Initialized metrics for ${gameMetricsData.length} games`);

    // Update user balance for existing users
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) {
      console.log("👤 Updating existing user balances...");
      for (const user of existingUsers) {
        await db.update(users)
          .set({ 
            walletBalance: "25000.00",
            bonusBalance: "5000.00" 
          })
          .where(eq(users.id, user.id));
      }
      console.log(`✅ Updated ${existingUsers.length} user balances`);
    }

    console.log("🎉 Enhanced database seeding completed successfully!");
    
    return {
      games: insertedGames.length,
      categories: insertedCategories.length,
      achievements: insertedAchievements.length,
      promotions: insertedPromotions.length,
      metrics: gameMetricsData.length
    };

  } catch (error) {
    console.error("❌ Error during enhanced seeding:", error);
    throw error;
  }
}

// Run seed if called directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  enhancedSeed()
    .then((result) => {
      console.log("📈 Seeding results:", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}