export interface TopEarner {
  id: number;
  userId: number;
  gameId: number;
  betAmount: string;
  winAmount: string;
  playedAt: Date;
  username: string;
  gameTitle: string;
}

export interface JackpotStats {
  totalJackpot: string;
  largestJackpot: string;
  gamesCount: number;
}

export interface GamePlayResult {
  result: "win" | "lose";
  winAmount: string;
  newBalance: string;
  history: any;
}

export interface User {
  id: number;
  username: string;
  phone: string;
  email: string;
  walletBalance: string;
  bonusBalance: string;
  kycStatus: string;
  referralCode: string | null;
  vipLevel: number;
  totalDeposit: string;
  totalWithdraw: string;
  totalBet: string;
  totalWin: string;
}
