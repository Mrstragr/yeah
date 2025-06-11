import { Pool } from '@neondatabase/serverless';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const games = [
  // Lobby Games (Featured)
  { title: "Super Jackpot", description: "Get Super Jackpot rewards - Visit the Super Jackpot page to claim", category: "lobby", imageUrl: "/images/superjackpot.png", rating: "4.9", jackpot: "5000000.00" },
  { title: "Daily Check-in", description: "Login daily for increasing bonus rewards", category: "lobby", imageUrl: "/images/checkin.png", rating: "4.8", jackpot: "100000.00" },
  { title: "VIP Bonus", description: "Exclusive VIP member bonuses and privileges", category: "lobby", imageUrl: "/images/vip.png", rating: "4.7", jackpot: "2500000.00" },

  // Lottery Games
  { title: "Win Go 1Min", description: "Predict the next number in 1-minute lottery draws", category: "lottery", imageUrl: "/images/wingo1.png", rating: "4.8", jackpot: "500000.00" },
  { title: "Win Go 3Min", description: "3-minute lottery with higher multipliers and bigger wins", category: "lottery", imageUrl: "/images/wingo3.png", rating: "4.7", jackpot: "750000.00" },
  { title: "Win Go 5Min", description: "5-minute draws with mega jackpots and bonus rounds", category: "lottery", imageUrl: "/images/wingo5.png", rating: "4.9", jackpot: "1000000.00" },
  { title: "Win Go 10Min", description: "10-minute super draws with massive prize pools", category: "lottery", imageUrl: "/images/wingo10.png", rating: "4.6", jackpot: "2000000.00" },
  { title: "K3 Lotre", description: "Traditional K3 lottery with three dice prediction", category: "lottery", imageUrl: "/images/k3.png", rating: "4.5", jackpot: "800000.00" },
  { title: "5D Lotre", description: "5-digit number prediction with massive payouts", category: "lottery", imageUrl: "/images/5d.png", rating: "4.7", jackpot: "10000000.00" },
  { title: "Trx Win Go", description: "Blockchain-based transparent lottery system", category: "lottery", imageUrl: "/images/trx.png", rating: "4.8", jackpot: "1500000.00" },

  // Popular Games
  { title: "Mega Lottery Draw", description: "The biggest lottery draw with life-changing jackpots", category: "popular", imageUrl: "/images/megalottery.png", rating: "4.9", jackpot: "50000000.00" },
  { title: "Lucky Spin", description: "Spin the wheel of fortune for instant wins", category: "popular", imageUrl: "/images/luckyspin.png", rating: "4.8", jackpot: "5000000.00" },
  { title: "Dragon Tiger", description: "Classic Asian card game with simple rules", category: "popular", imageUrl: "/images/dragontiger.png", rating: "4.7", jackpot: "2000000.00" },
  { title: "Color Prediction", description: "Predict colors for quick wins and bonuses", category: "popular", imageUrl: "/images/colorpred.png", rating: "4.6", jackpot: "1000000.00" },
  { title: "Number Guessing", description: "Guess the lucky numbers for instant rewards", category: "popular", imageUrl: "/images/numguess.png", rating: "4.5", jackpot: "3000000.00" },
  { title: "Fast Parity", description: "High-speed parity games with rapid results", category: "popular", imageUrl: "/images/fastparity.png", rating: "4.8", jackpot: "1500000.00" },

  // Mini Games
  { title: "Mines", description: "Navigate through the minefield to find treasures", category: "minigames", imageUrl: "/images/mines.png", rating: "4.7", jackpot: "2000000.00" },
  { title: "Plinko", description: "Drop balls and watch them bounce to big wins", category: "minigames", imageUrl: "/images/plinko.png", rating: "4.8", jackpot: "1500000.00" },
  { title: "Limbo", description: "How low can you go? Test your luck and skills", category: "minigames", imageUrl: "/images/limbo.png", rating: "4.6", jackpot: "3000000.00" },
  { title: "Keno", description: "Pick your lucky numbers and win big prizes", category: "minigames", imageUrl: "/images/keno.png", rating: "4.5", jackpot: "5000000.00" },
  { title: "Wheel of Fortune", description: "Spin the magical wheel for instant rewards", category: "minigames", imageUrl: "/images/wheel.png", rating: "4.9", jackpot: "10000000.00" },
  { title: "Scratch Cards", description: "Scratch and reveal hidden prizes instantly", category: "minigames", imageUrl: "/images/scratch.png", rating: "4.4", jackpot: "1000000.00" },
  { title: "Dice Roll", description: "Roll the dice and predict the perfect combination", category: "minigames", imageUrl: "/images/dice.png", rating: "4.7", jackpot: "2500000.00" },
  { title: "Coin Flip", description: "Simple heads or tails game with big payouts", category: "minigames", imageUrl: "/images/coin.png", rating: "4.6", jackpot: "1500000.00" },

  // Casino Games
  { title: "Blackjack", description: "Beat the dealer in this classic card game", category: "casino", imageUrl: "/images/blackjack.png", rating: "4.8", jackpot: "5000000.00" },
  { title: "Roulette", description: "European roulette with authentic casino experience", category: "casino", imageUrl: "/images/roulette.png", rating: "4.9", jackpot: "10000000.00" },
  { title: "Baccarat", description: "The sophisticated card game of choice", category: "casino", imageUrl: "/images/baccarat.png", rating: "4.7", jackpot: "15000000.00" },
  { title: "Poker", description: "Texas Hold'em poker with professional dealers", category: "casino", imageUrl: "/images/poker.png", rating: "4.8", jackpot: "20000000.00" },
  { title: "Andar Bahar", description: "Traditional Indian card game with live action", category: "casino", imageUrl: "/images/andarbahar.png", rating: "4.6", jackpot: "3000000.00" },
  { title: "Teen Patti", description: "Indian poker variant with cultural authenticity", category: "casino", imageUrl: "/images/teenpatti.png", rating: "4.7", jackpot: "5000000.00" },
  { title: "Sic Bo", description: "Ancient Chinese dice game with modern twists", category: "casino", imageUrl: "/images/sicbo.png", rating: "4.5", jackpot: "2000000.00" },

  // Slots Games
  { title: "Book of Dead", description: "Egyptian adventure slot with expanding symbols", category: "slots", imageUrl: "/images/bookdead.png", rating: "4.9", jackpot: "8000000.00" },
  { title: "Starburst", description: "Cosmic gems slot with expanding wilds", category: "slots", imageUrl: "/images/starburst.png", rating: "4.5", jackpot: "1500000.00" },
  { title: "Mega Moolah", description: "Progressive jackpot slot with African safari theme", category: "slots", imageUrl: "/images/moolah.png", rating: "4.8", jackpot: "10000000.00" },
  { title: "Bonanza", description: "Mining-themed megaways slot with cascading reels", category: "slots", imageUrl: "/images/bonanza2.png", rating: "4.7", jackpot: "4000000.00" },
  { title: "Reactoonz", description: "Alien-themed cluster pays slot with quantum features", category: "slots", imageUrl: "/images/reactoonz.png", rating: "4.6", jackpot: "3500000.00" },

  // Sports Games
  { title: "Cricket Live", description: "Live cricket betting with real-time odds and statistics", category: "sports", imageUrl: "/images/cricket.png", rating: "4.8", jackpot: "1000000.00" },
  { title: "Football Live", description: "Global football leagues with live betting options", category: "sports", imageUrl: "/images/football.png", rating: "4.7", jackpot: "800000.00" },
  { title: "Tennis Live", description: "Professional tennis tournaments with live betting", category: "sports", imageUrl: "/images/tennis.png", rating: "4.6", jackpot: "600000.00" },
  { title: "Basketball Live", description: "NBA and international basketball with live odds", category: "sports", imageUrl: "/images/basketball.png", rating: "4.5", jackpot: "700000.00" },
  { title: "Kabaddi Live", description: "Traditional Indian sport with modern betting", category: "sports", imageUrl: "/images/kabaddi.png", rating: "4.7", jackpot: "500000.00" },

  // PVC Games
  { title: "Live Dealer Studios", description: "Premium live dealer games with HD streaming", category: "pvc", imageUrl: "/images/live.png", rating: "4.9", jackpot: "3000000.00" },
  { title: "VIP Salon Privé", description: "Exclusive high-limit tables for VIP members", category: "pvc", imageUrl: "/images/vipsalon.png", rating: "4.8", jackpot: "5000000.00" },
  { title: "Speed Baccarat", description: "Fast-paced baccarat with 27-second rounds", category: "pvc", imageUrl: "/images/speedbac.png", rating: "4.7", jackpot: "2000000.00" },
  { title: "Lightning Roulette", description: "Electrified roulette with random multipliers up to 500x", category: "pvc", imageUrl: "/images/lightning.png", rating: "4.8", jackpot: "2500000.00" },
  { title: "Dream Catcher", description: "Money wheel game with live host and multipliers", category: "pvc", imageUrl: "/images/dreamcatcher.png", rating: "4.6", jackpot: "1500000.00" },

  // Rummy Games
  { title: "Points Rummy", description: "Fast points-based rummy tournaments with instant results", category: "rummy", imageUrl: "/images/pointsrummy.png", rating: "4.7", jackpot: "500000.00" },
  { title: "Pool Rummy", description: "101 and 201 pool rummy with elimination rounds", category: "rummy", imageUrl: "/images/poolrummy.png", rating: "4.6", jackpot: "750000.00" },
  { title: "Deals Rummy", description: "Fixed deals rummy with predetermined chip distribution", category: "rummy", imageUrl: "/images/dealsrummy.png", rating: "4.5", jackpot: "400000.00" },
  { title: "Gin Rummy", description: "Classic gin rummy with cash prizes and tournaments", category: "rummy", imageUrl: "/images/ginrummy.png", rating: "4.4", jackpot: "300000.00" },
  { title: "Indian Rummy", description: "Traditional 13-card Indian rummy with multiple variants", category: "rummy", imageUrl: "/images/indianrummy.png", rating: "4.8", jackpot: "600000.00" },

  // Fishing Games
  { title: "Ocean King", description: "Underwater fishing adventure with powerful cannons", category: "fishing", imageUrl: "/images/oceanking.png", rating: "4.8", jackpot: "1500000.00" },
  { title: "Fish Hunter", description: "Hunt rare fish species for mega multipliers and bonuses", category: "fishing", imageUrl: "/images/fishhunter.png", rating: "4.7", jackpot: "1200000.00" },
  { title: "Golden Toad", description: "Legendary toad fishing with progressive jackpots", category: "fishing", imageUrl: "/images/goldentoad.png", rating: "4.9", jackpot: "2000000.00" },
  { title: "Fish Shooting", description: "Action-packed fish shooting with special weapons", category: "fishing", imageUrl: "/images/fishshooting.png", rating: "4.5", jackpot: "800000.00" },
  { title: "Deep Sea Treasure", description: "Explore the ocean depths for hidden treasures", category: "fishing", imageUrl: "/images/deepsea.png", rating: "4.4", jackpot: "600000.00" },

  // Crash Games
  { title: "Aviator", description: "Watch the plane fly and cash out before it crashes! Popular crash-style multiplier game.", category: "crash", imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250", rating: "4.9", jackpot: "5000000.00" }
];

async function restoreGames() {
  try {
    console.log('Restoring all games...');
    
    for (const game of games) {
      await pool.query(
        'INSERT INTO games (title, description, category, image_url, rating, jackpot, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [game.title, game.description, game.category, game.imageUrl, game.rating, game.jackpot, true]
      );
    }
    
    console.log(`Successfully restored ${games.length} games!`);
    process.exit(0);
  } catch (error) {
    console.error('Error restoring games:', error);
    process.exit(1);
  }
}

restoreGames();