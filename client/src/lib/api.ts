// API client for the gaming platform
export const api = {
  // User balance
  getBalance: async () => {
    const response = await fetch('/api/balance', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }
    return response.json();
  },

  // WinGo game
  playWinGo: async (betAmount: number, betType: string, betValue: any) => {
    const response = await fetch('/api/games/wingo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        betAmount,
        betType,
        betValue,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to play WinGo');
    }
    return response.json();
  },

  // Aviator game
  playAviator: async (betAmount: number, cashOutMultiplier?: number, crashed?: boolean, finalMultiplier?: number) => {
    const response = await fetch('/api/games/aviator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        betAmount,
        cashOutMultiplier,
        crashed,
        finalMultiplier,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to play Aviator');
    }
    return response.json();
  },

  // Mines game
  playMines: async (betAmount: number, mineCount: number, revealedTiles: number[]) => {
    const response = await fetch('/api/games/mines', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        betAmount,
        mineCount,
        revealedTiles,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to play Mines');
    }
    return response.json();
  },

  // Dice game
  playDice: async (betAmount: number, prediction: 'over' | 'under', targetNumber: number) => {
    const response = await fetch('/api/games/dice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        betAmount,
        prediction,
        targetNumber,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to play Dice');
    }
    return response.json();
  },

  // Dragon Tiger game
  playDragonTiger: async (betAmount: number, betType: 'dragon' | 'tiger' | 'tie') => {
    const response = await fetch('/api/games/dragon-tiger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        betAmount,
        betType,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to play Dragon Tiger');
    }
    return response.json();
  },

  // General game stats
  getGameStats: async (gameId: string) => {
    const response = await fetch(`/api/games/${gameId}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch game stats');
    }
    return response.json();
  },

  // Game history
  getGameHistory: async (gameId: string) => {
    const response = await fetch(`/api/games/${gameId}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch game history');
    }
    return response.json();
  },
};