import { storage } from './storage';

export async function seedDatabase() {
  try {
    console.log('Seeding database with initial data...');

    // Create sample games
    const games = [
      {
        title: 'WIN GO',
        description: 'Predict numbers and colors to win big prizes',
        category: 'lottery',
        imageUrl: '/images/wingo.png',
        rating: '4.8',
        jackpot: '50000.00'
      },
      {
        title: 'K3 Lotre',
        description: 'Three dice lottery game with multiple betting options',
        category: 'lottery',
        imageUrl: '/images/k3.png',
        rating: '4.7',
        jackpot: '100000.00'
      },
      {
        title: 'Aviator',
        description: 'Cash out before the plane flies away',
        category: 'mini',
        imageUrl: '/images/aviator.png',
        rating: '4.9',
        jackpot: '25000.00'
      },
      {
        title: 'Mines',
        description: 'Find diamonds while avoiding mines',
        category: 'mini',
        imageUrl: '/images/mines.png',
        rating: '4.6',
        jackpot: '15000.00'
      },
      {
        title: 'Dice',
        description: 'Predict if the dice roll will be higher or lower',
        category: 'mini',
        imageUrl: '/images/dice.png',
        rating: '4.5',
        jackpot: '10000.00'
      },
      {
        title: 'Dragon Tiger',
        description: 'Simple card game - Dragon vs Tiger',
        category: 'recommended',
        imageUrl: '/images/dragon-tiger.png',
        rating: '4.8',
        jackpot: '30000.00'
      }
    ];

    for (const game of games) {
      try {
        await storage.createGame(game);
      } catch (error) {
        // Game might already exist, continue
      }
    }

    // Create game categories
    const categories = [
      {
        name: 'Lottery',
        slug: 'lottery',
        description: 'Number prediction games',
        icon: '🎰',
        color: '#ff6b6b'
      },
      {
        name: 'Mini Games',
        slug: 'mini',
        description: 'Quick and fun mini games',
        icon: '🎮',
        color: '#4ecdc4'
      },
      {
        name: 'Recommended',
        slug: 'recommended',
        description: 'Staff picks and popular games',
        icon: '⭐',
        color: '#45b7d1'
      },
      {
        name: 'Slots',
        slug: 'slot',
        description: 'Classic slot machine games',
        icon: '🎰',
        color: '#f9ca24'
      }
    ];

    for (const category of categories) {
      try {
        await storage.createGameCategory(category);
      } catch (error) {
        // Category might already exist, continue
      }
    }

    // Create sample promotions
    const promotions = [
      {
        title: 'Welcome Bonus',
        description: 'Get 100% bonus on your first deposit',
        type: 'welcome_bonus',
        value: '100.00',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      {
        title: 'Daily Check-in',
        description: 'Get daily rewards for logging in',
        type: 'daily_bonus',
        value: '50.00',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      }
    ];

    for (const promotion of promotions) {
      try {
        await storage.createPromotion(promotion);
      } catch (error) {
        // Promotion might already exist, continue
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}