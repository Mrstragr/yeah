import type { InsertGame } from "@shared/schema";

// Complete TashanWin game collection with authentic mechanisms
export const tashanwinGames: InsertGame[] = [
  // Lobby Games (Featured)
  {
    title: "Super Jackpot",
    description: "Get Super Jackpot rewards - Visit the Super Jackpot page to claim",
    category: "lobby",
    imageUrl: "/images/superjackpot.png",
    rating: "4.9",
    jackpot: "5000000.00"
  },
  {
    title: "Daily Check-in",
    description: "Login daily for increasing bonus rewards",
    category: "lobby", 
    imageUrl: "/images/checkin.png",
    rating: "4.8",
    jackpot: "100000.00"
  },
  {
    title: "VIP Bonus",
    description: "Exclusive VIP member bonuses and privileges",
    category: "lobby",
    imageUrl: "/images/vip.png", 
    rating: "4.7",
    jackpot: "2500000.00"
  },

  // Lottery Games
  {
    title: "Win Go 1Min",
    description: "Predict the next number in 1-minute lottery draws",
    category: "lottery",
    imageUrl: "/images/wingo1.png",
    rating: "4.8",
    jackpot: "500000.00"
  },
  {
    title: "Win Go 3Min", 
    description: "3-minute lottery with higher multipliers and bigger wins",
    category: "lottery",
    imageUrl: "/images/wingo3.png",
    rating: "4.7",
    jackpot: "750000.00"
  },
  {
    title: "Win Go 5Min",
    description: "5-minute draws with mega jackpots and bonus rounds",
    category: "lottery",
    imageUrl: "/images/wingo5.png",
    rating: "4.9",
    jackpot: "1000000.00"
  },
  {
    title: "Win Go 10Min",
    description: "10-minute lottery with maximum payouts and special features",
    category: "lottery",
    imageUrl: "/images/wingo10.png",
    rating: "4.8",
    jackpot: "1500000.00"
  },
  {
    title: "K3 Lottery",
    description: "3-dice sum prediction game with instant results",
    category: "lottery",
    imageUrl: "/images/k3.png",
    rating: "4.6",
    jackpot: "200000.00"
  },
  {
    title: "5D Lottery",
    description: "5-digit number prediction with massive multipliers",
    category: "lottery",
    imageUrl: "/images/5d.png",
    rating: "4.7",
    jackpot: "2000000.00"
  },
  {
    title: "Trx Win Go",
    description: "TRON-based lottery with cryptocurrency rewards",
    category: "lottery",
    imageUrl: "/images/trx.png",
    rating: "4.5",
    jackpot: "800000.00"
  },

  // Popular Games
  {
    title: "Aviator",
    description: "Fly high and cash out before the plane crashes",
    category: "popular",
    imageUrl: "/images/aviator.png",
    rating: "4.9",
    jackpot: "1000000.00"
  },
  {
    title: "JetX",
    description: "Rocket multiplier game with instant cashouts",
    category: "popular", 
    imageUrl: "/images/jetx.png",
    rating: "4.8",
    jackpot: "800000.00"
  },
  {
    title: "Lucky Jet",
    description: "Lucky character flies with growing multipliers",
    category: "popular",
    imageUrl: "/images/luckyjet.png",
    rating: "4.7",
    jackpot: "600000.00"
  },
  {
    title: "Spaceman",
    description: "Space adventure with astronomical multipliers",
    category: "popular",
    imageUrl: "/images/spaceman.png", 
    rating: "4.8",
    jackpot: "900000.00"
  },
  {
    title: "Crash",
    description: "Classic crash game with multiplying rewards",
    category: "popular",
    imageUrl: "/images/crash.png",
    rating: "4.6",
    jackpot: "700000.00"
  },

  // Mini Games
  {
    title: "Mines",
    description: "Find diamonds while avoiding explosive mines",
    category: "minigames",
    imageUrl: "/images/mines.png",
    rating: "4.6",
    jackpot: "250000.00"
  },
  {
    title: "Plinko",
    description: "Drop balls through pegs for multiplied winnings",
    category: "minigames",
    imageUrl: "/images/plinko.png",
    rating: "4.5",
    jackpot: "300000.00"
  },
  {
    title: "Keno",
    description: "Pick numbers and win based on matches drawn",
    category: "minigames",
    imageUrl: "/images/keno.png",
    rating: "4.4",
    jackpot: "150000.00"
  },
  {
    title: "Wheel",
    description: "Spin the wheel for instant cash prizes",
    category: "minigames",
    imageUrl: "/images/wheel.png",
    rating: "4.7",
    jackpot: "400000.00"
  },
  {
    title: "Dice Roll",
    description: "Roll three dice and bet on big/small or specific numbers", 
    category: "minigames",
    imageUrl: "/images/dice.png",
    rating: "4.6",
    jackpot: "350000.00"
  },
  {
    title: "Coin Flip",
    description: "Classic heads or tails game with instant results",
    category: "minigames", 
    imageUrl: "/images/coinflip.png",
    rating: "4.5",
    jackpot: "250000.00"
  },
  {
    title: "Tower",
    description: "Climb the tower while avoiding falling blocks",
    category: "minigames",
    imageUrl: "/images/tower.png",
    rating: "4.5",
    jackpot: "200000.00"
  },
  {
    title: "Limbo",
    description: "Set your multiplier and beat the house edge",
    category: "minigames",
    imageUrl: "/images/limbo.png",
    rating: "4.4",
    jackpot: "180000.00"
  },

  // Casino Games
  {
    title: "Teen Patti",
    description: "Indian 3-card poker with live dealers and real players",
    category: "casino",
    imageUrl: "/images/teenpatti.png",
    rating: "4.9",
    jackpot: "2000000.00"
  },
  {
    title: "Andar Bahar", 
    description: "Traditional Indian card game with live action",
    category: "casino",
    imageUrl: "/images/andarbahar.png",
    rating: "4.8",
    jackpot: "1500000.00"
  },
  {
    title: "Dragon Tiger",
    description: "Simple card comparison game with high payouts",
    category: "casino",
    imageUrl: "/images/dragontiger.png",
    rating: "4.7",
    jackpot: "1200000.00"
  },
  {
    title: "Baccarat",
    description: "Classic baccarat with professional live dealers",
    category: "casino",
    imageUrl: "/images/baccarat.png",
    rating: "4.8",
    jackpot: "1800000.00"
  },
  {
    title: "Roulette",
    description: "European roulette with live wheel spins",
    category: "casino",
    imageUrl: "/images/roulette.png",
    rating: "4.6",
    jackpot: "1000000.00"
  },
  {
    title: "Blackjack",
    description: "21 card game with perfect strategy payouts",
    category: "casino", 
    imageUrl: "/images/blackjack.png",
    rating: "4.5",
    jackpot: "800000.00"
  },
  {
    title: "Sic Bo",
    description: "Traditional dice game with multiple betting options",
    category: "casino",
    imageUrl: "/images/sicbo.png",
    rating: "4.4",
    jackpot: "600000.00"
  },
  {
    title: "Poker",
    description: "Texas Hold'em poker tournaments and cash games",
    category: "casino",
    imageUrl: "/images/poker.png",
    rating: "4.7",
    jackpot: "1500000.00"
  },

  // Slots Games
  {
    title: "Gates of Olympus",
    description: "Divine slot with tumbling reels and multipliers",
    category: "slots",
    imageUrl: "/images/gates.png",
    rating: "4.9",
    jackpot: "5000000.00"
  },
  {
    title: "Sweet Bonanza",
    description: "Candy-themed slot with explosive wins",
    category: "slots",
    imageUrl: "/images/bonanza.png",
    rating: "4.8", 
    jackpot: "3000000.00"
  },
  {
    title: "Wolf Gold",
    description: "Wildlife slot with money symbol features",
    category: "slots",
    imageUrl: "/images/wolf.png",
    rating: "4.7",
    jackpot: "2500000.00"
  },
  {
    title: "Book of Dead",
    description: "Egyptian adventure with expanding symbols",
    category: "slots",
    imageUrl: "/images/bookdead.png",
    rating: "4.6",
    jackpot: "2000000.00"
  },
  {
    title: "Starburst",
    description: "Classic gem slot with expanding wilds",
    category: "slots",
    imageUrl: "/images/starburst.png",
    rating: "4.5",
    jackpot: "1500000.00"
  },
  {
    title: "Mega Moolah",
    description: "Progressive jackpot slot with African safari theme",
    category: "slots",
    imageUrl: "/images/moolah.png",
    rating: "4.8",
    jackpot: "10000000.00"
  },
  {
    title: "Bonanza",
    description: "Mining-themed megaways slot with cascading reels",
    category: "slots",
    imageUrl: "/images/bonanza2.png", 
    rating: "4.7",
    jackpot: "4000000.00"
  },
  {
    title: "Reactoonz",
    description: "Alien-themed cluster pays slot with quantum features",
    category: "slots",
    imageUrl: "/images/reactoonz.png",
    rating: "4.6",
    jackpot: "3500000.00"
  },

  // Sports Games
  {
    title: "Cricket Live",
    description: "Live cricket betting with real-time odds and statistics",
    category: "sports",
    imageUrl: "/images/cricket.png",
    rating: "4.8",
    jackpot: "1000000.00"
  },
  {
    title: "Football Live",
    description: "Global football leagues with live betting options",
    category: "sports",
    imageUrl: "/images/football.png",
    rating: "4.7",
    jackpot: "800000.00"
  },
  {
    title: "Tennis Live",
    description: "Professional tennis tournaments with live betting",
    category: "sports",
    imageUrl: "/images/tennis.png",
    rating: "4.6",
    jackpot: "600000.00"
  },
  {
    title: "Basketball Live",
    description: "NBA and international basketball with live odds",
    category: "sports",
    imageUrl: "/images/basketball.png",
    rating: "4.5",
    jackpot: "500000.00"
  },
  {
    title: "Virtual Sports",
    description: "24/7 virtual sports with instant results",
    category: "sports",
    imageUrl: "/images/virtual.png",
    rating: "4.4",
    jackpot: "300000.00"
  },
  {
    title: "Kabaddi Live",
    description: "Pro Kabaddi League betting with live updates",
    category: "sports",
    imageUrl: "/images/kabaddi.png",
    rating: "4.3",
    jackpot: "250000.00"
  },

  // PVC Games (Premium Live Casino)
  {
    title: "Live Dealer Studios",
    description: "Premium live dealer games with HD streaming",
    category: "pvc",
    imageUrl: "/images/live.png",
    rating: "4.9",
    jackpot: "3000000.00"
  },
  {
    title: "VIP Salon Privé",
    description: "Exclusive high-limit tables for VIP members",
    category: "pvc",
    imageUrl: "/images/vipsalon.png",
    rating: "4.8",
    jackpot: "5000000.00"
  },
  {
    title: "Speed Baccarat",
    description: "Fast-paced baccarat with 27-second rounds",
    category: "pvc",
    imageUrl: "/images/speedbac.png",
    rating: "4.7",
    jackpot: "2000000.00"
  },
  {
    title: "Lightning Roulette",
    description: "Electrified roulette with random multipliers up to 500x",
    category: "pvc",
    imageUrl: "/images/lightning.png",
    rating: "4.8",
    jackpot: "2500000.00"
  },
  {
    title: "Dream Catcher",
    description: "Money wheel game with live host and multipliers",
    category: "pvc",
    imageUrl: "/images/dreamcatcher.png",
    rating: "4.6",
    jackpot: "1500000.00"
  },
  {
    title: "Monopoly Live",
    description: "Board game-inspired wheel with 3D bonus rounds",
    category: "pvc",
    imageUrl: "/images/monopoly.png",
    rating: "4.7",
    jackpot: "2200000.00"
  },

  // Rummy Games
  {
    title: "Points Rummy",
    description: "Fast points-based rummy tournaments with instant results",
    category: "rummy",
    imageUrl: "/images/pointsrummy.png",
    rating: "4.7",
    jackpot: "500000.00"
  },
  {
    title: "Pool Rummy",
    description: "101 and 201 pool rummy with elimination rounds",
    category: "rummy",
    imageUrl: "/images/poolrummy.png",
    rating: "4.6",
    jackpot: "750000.00"
  },
  {
    title: "Deals Rummy",
    description: "Fixed deals rummy with predetermined chip distribution",
    category: "rummy",
    imageUrl: "/images/dealsrummy.png",
    rating: "4.5",
    jackpot: "400000.00"
  },
  {
    title: "Gin Rummy",
    description: "Classic gin rummy with cash prizes and tournaments",
    category: "rummy",
    imageUrl: "/images/ginrummy.png",
    rating: "4.4",
    jackpot: "300000.00"
  },
  {
    title: "Indian Rummy",
    description: "Traditional 13-card Indian rummy with multiple variants",
    category: "rummy",
    imageUrl: "/images/indianrummy.png",
    rating: "4.8",
    jackpot: "600000.00"
  },

  // Fishing Games
  {
    title: "Ocean King",
    description: "Underwater fishing adventure with powerful cannons",
    category: "fishing",
    imageUrl: "/images/oceanking.png",
    rating: "4.8",
    jackpot: "1500000.00"
  },
  {
    title: "Fish Hunter",
    description: "Hunt rare fish species for mega multipliers and bonuses",
    category: "fishing",
    imageUrl: "/images/fishhunter.png",
    rating: "4.7",
    jackpot: "1200000.00"
  },
  {
    title: "Golden Toad",
    description: "Mythical fishing adventure with special bonus features",
    category: "fishing",
    imageUrl: "/images/goldentoad.png",
    rating: "4.6",
    jackpot: "1000000.00"
  },
  {
    title: "Fish Shooting",
    description: "Arcade-style fish shooting with multiplayer action",
    category: "fishing",
    imageUrl: "/images/fishshooting.png",
    rating: "4.5",
    jackpot: "800000.00"
  },
  {
    title: "Deep Sea Treasure",
    description: "Explore the ocean depths for hidden treasures",
    category: "fishing",
    imageUrl: "/images/deepsea.png",
    rating: "4.4",
    jackpot: "600000.00"
  },

  // Crash Games
  {
    title: "Aviator",
    description: "Watch the plane fly and cash out before it crashes! Popular crash-style multiplier game.",
    category: "crash",
    imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    rating: "4.9",
    jackpot: "5000000.00"
  }
];