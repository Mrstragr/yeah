import { db } from "./db";
import { users } from "@shared/schema";

const gameData = [
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

const categoryData = [
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

async function populateGames() {
  try {
    console.log("Populating games and categories...");
    
    await db.insert(gameCategories).values(categoryData);
    console.log(`Added ${categoryData.length} game categories`);
    
    await db.insert(games).values(gameData);
    console.log(`Added ${gameData.length} games`);
    
    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

populateGames();