import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bomb, Gem, ArrowLeft, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';

interface Props {
  onBack?: () => void;
}

interface GameState {
  grid: ('hidden' | 'gem' | 'mine')[];
  revealed: boolean[];
  gameActive: boolean;
  currentMultiplier: number;
  betAmount: number;
  gems: number;
  mines: number;
}

export default function RealMoneyMines({ onBack }: Props) {
  const [gameState, setGameState] = useState<GameState>({
    grid: Array(25).fill('hidden'),
    revealed: Array(25).fill(false),
    gameActive: false,
    currentMultiplier: 1.0,
    betAmount: 10,
    gems: 0,
    mines: 5
  });
  
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch balance
  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await apiRequest('GET', '/api/wallet/balance');
      const data = await response.json();
      setBalance(data.balance || 0);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const startGame = async () => {
    if (gameState.betAmount > balance) {
      alert('Insufficient balance!');
      return;
    }

    setIsLoading(true);
    try {
      // Place bet
      const betResponse = await apiRequest('POST', '/api/games/mines/bet', {
        amount: gameState.betAmount,
        mines: gameState.mines
      });
      
      if (betResponse.ok) {
        const betData = await betResponse.json();
        
        // Generate game grid
        const newGrid = Array(25).fill('gem');
        const minePositions = generateMinePositions(gameState.mines);
        minePositions.forEach(pos => newGrid[pos] = 'mine');

        setGameState(prev => ({
          ...prev,
          grid: newGrid,
          revealed: Array(25).fill(false),
          gameActive: true,
          currentMultiplier: 1.0,
          gems: 0
        }));

        await fetchBalance();
      }
    } catch (error) {
      console.error('Failed to start game:', error);
    }
    setIsLoading(false);
  };

  const generateMinePositions = (count: number): number[] => {
    const positions: number[] = [];
    while (positions.length < count) {
      const pos = Math.floor(Math.random() * 25);
      if (!positions.includes(pos)) {
        positions.push(pos);
      }
    }
    return positions;
  };

  const revealTile = async (index: number) => {
    if (!gameState.gameActive || gameState.revealed[index]) return;

    const newRevealed = [...gameState.revealed];
    newRevealed[index] = true;

    if (gameState.grid[index] === 'mine') {
      // Hit mine - game over
      setGameState(prev => ({
        ...prev,
        revealed: newRevealed,
        gameActive: false
      }));
      
      // Show all mines
      setTimeout(() => {
        const allRevealed = gameState.grid.map((_, i) => 
          gameState.grid[i] === 'mine' || gameState.revealed[i]
        );
        setGameState(prev => ({ ...prev, revealed: allRevealed }));
      }, 1000);
      
    } else {
      // Found gem
      const newGems = gameState.gems + 1;
      const newMultiplier = calculateMultiplier(newGems, gameState.mines);
      
      setGameState(prev => ({
        ...prev,
        revealed: newRevealed,
        gems: newGems,
        currentMultiplier: newMultiplier
      }));
    }
  };

  const calculateMultiplier = (gems: number, mines: number): number => {
    const totalTiles = 25;
    const safeTiles = totalTiles - mines;
    if (gems === 0) return 1.0;
    
    let multiplier = 1.0;
    for (let i = 0; i < gems; i++) {
      multiplier *= (safeTiles - i) / (totalTiles - mines - i);
    }
    return Math.round(multiplier * 100) / 100;
  };

  const cashOut = async () => {
    if (!gameState.gameActive || gameState.gems === 0) return;

    setIsLoading(true);
    try {
      const winAmount = gameState.betAmount * gameState.currentMultiplier;
      
      const response = await apiRequest('POST', '/api/games/mines/cashout', {
        amount: winAmount,
        gems: gameState.gems,
        multiplier: gameState.currentMultiplier
      });

      if (response.ok) {
        setGameState(prev => ({
          ...prev,
          gameActive: false
        }));
        await fetchBalance();
      }
    } catch (error) {
      console.error('Failed to cash out:', error);
    }
    setIsLoading(false);
  };

  const resetGame = () => {
    setGameState({
      grid: Array(25).fill('hidden'),
      revealed: Array(25).fill(false),
      gameActive: false,
      currentMultiplier: 1.0,
      betAmount: gameState.betAmount,
      gems: 0,
      mines: gameState.mines
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button onClick={onBack} className="text-white/80 hover:text-white">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <div>
                <h1 className="text-white text-2xl font-bold">MINES</h1>
                <p className="text-purple-100 text-sm">Real Money Mining Game</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-purple-100 text-sm">Balance</div>
              <div className="text-white text-xl font-bold">₹{balance.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bet Amount</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={gameState.betAmount}
                  onChange={(e) => setGameState(prev => ({ ...prev, betAmount: Number(e.target.value) }))}
                  disabled={gameState.gameActive}
                  className="flex-1 p-2 border rounded-lg"
                  min="1"
                />
                <span className="text-gray-600">₹</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mines</label>
              <select
                value={gameState.mines}
                onChange={(e) => setGameState(prev => ({ ...prev, mines: Number(e.target.value) }))}
                disabled={gameState.gameActive}
                className="w-full p-2 border rounded-lg"
              >
                {[3, 5, 7, 10, 15].map(num => (
                  <option key={num} value={num}>{num} Mines</option>
                ))}
              </select>
            </div>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-bold text-lg">{gameState.gems}</div>
              <div className="text-blue-600 text-xs">Gems Found</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-green-600 font-bold text-lg">{gameState.currentMultiplier.toFixed(2)}x</div>
              <div className="text-green-600 text-xs">Multiplier</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-yellow-600 font-bold text-lg">{(gameState.betAmount * gameState.currentMultiplier).toFixed(2)}</div>
              <div className="text-yellow-600 text-xs">Potential Win</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!gameState.gameActive ? (
              <Button 
                onClick={startGame} 
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Starting...' : 'Start Game'}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={cashOut} 
                  disabled={gameState.gems === 0 || isLoading}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                >
                  Cash Out ₹{(gameState.betAmount * gameState.currentMultiplier).toFixed(2)}
                </Button>
                <Button 
                  onClick={resetGame}
                  variant="outline"
                  className="px-6"
                >
                  Reset
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Game Grid */}
        <div className="p-4">
          <div className="grid grid-cols-5 gap-2 mb-4">
            {gameState.grid.map((tile, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: gameState.gameActive && !gameState.revealed[index] ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => revealTile(index)}
                disabled={!gameState.gameActive || gameState.revealed[index]}
                className={`
                  aspect-square rounded-lg border-2 flex items-center justify-center text-2xl font-bold
                  ${gameState.revealed[index] 
                    ? tile === 'mine' 
                      ? 'bg-red-500 border-red-600 text-white' 
                      : 'bg-green-500 border-green-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 border-gray-300'
                  }
                  ${!gameState.gameActive ? 'opacity-50' : ''}
                `}
              >
                {gameState.revealed[index] ? (
                  tile === 'mine' ? (
                    <Bomb className="w-6 h-6" />
                  ) : (
                    <Gem className="w-6 h-6" />
                  )
                ) : (
                  '?'
                )}
              </motion.button>
            ))}
          </div>

          {/* Game Instructions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">How to Play:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Choose bet amount and number of mines</li>
              <li>• Click tiles to reveal gems and avoid mines</li>
              <li>• Each gem increases your multiplier</li>
              <li>• Cash out anytime to collect winnings</li>
              <li>• Hit a mine and lose everything!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}