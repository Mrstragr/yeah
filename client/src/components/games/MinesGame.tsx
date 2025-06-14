import React, { useState, useEffect } from 'react';
import { X, Bomb, Gem, RotateCcw, TrendingUp, Shield } from 'lucide-react';

interface MinesGameProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onTransaction: (amount: number, type: 'deposit' | 'withdraw') => void;
}

interface Cell {
  id: number;
  isMine: boolean;
  isRevealed: boolean;
  isGem: boolean;
}

interface GameHistory {
  id: string;
  bet: number;
  mines: number;
  gemsFound: number;
  multiplier: number;
  result: 'win' | 'loss';
  profit: number;
  time: string;
}

export function MinesGame({ isOpen, onClose, walletBalance, onTransaction }: MinesGameProps) {
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'finished'>('betting');
  const [betAmount, setBetAmount] = useState(10);
  const [mineCount, setMineCount] = useState(3);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [gemsFound, setGemsFound] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([
    { id: '1', bet: 100, mines: 3, gemsFound: 5, multiplier: 2.4, result: 'win', profit: 140, time: '15:29' },
    { id: '2', bet: 50, mines: 5, gemsFound: 2, multiplier: 1.8, result: 'loss', profit: -50, time: '15:28' },
    { id: '3', bet: 200, mines: 1, gemsFound: 8, multiplier: 3.2, result: 'win', profit: 440, time: '15:27' },
    { id: '4', bet: 75, mines: 7, gemsFound: 1, multiplier: 0, result: 'loss', profit: -75, time: '15:26' }
  ]);
  const [autoMode, setAutoMode] = useState(false);
  const [autoCashOut, setAutoCashOut] = useState<number | null>(null);

  const quickAmounts = [10, 50, 100, 500, 1000];
  const mineOptions = [1, 3, 5, 7, 10, 15, 20, 24];

  useEffect(() => {
    if (gameState === 'playing') {
      const multiplier = calculateMultiplier(gemsFound, mineCount);
      setCurrentMultiplier(multiplier);

      if (autoCashOut && multiplier >= autoCashOut) {
        handleCashOut();
      }
    }
  }, [gemsFound, mineCount, gameState, autoCashOut]);

  const initializeGrid = () => {
    const newGrid: Cell[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      isMine: false,
      isRevealed: false,
      isGem: false
    }));

    // Place mines randomly
    const minePositions = new Set<number>();
    while (minePositions.size < mineCount) {
      const randomPos = Math.floor(Math.random() * 25);
      minePositions.add(randomPos);
    }

    minePositions.forEach(pos => {
      newGrid[pos].isMine = true;
    });

    // Mark non-mine cells as gems
    newGrid.forEach(cell => {
      if (!cell.isMine) {
        cell.isGem = true;
      }
    });

    setGrid(newGrid);
  };

  const calculateMultiplier = (gems: number, mines: number) => {
    if (gems === 0) return 1.0;
    const totalCells = 25;
    const safeCells = totalCells - mines;
    
    let multiplier = 1.0;
    for (let i = 0; i < gems; i++) {
      const remaining = safeCells - i;
      const totalRemaining = totalCells - i;
      multiplier *= totalRemaining / remaining;
    }
    
    return Math.round(multiplier * 100) / 100;
  };

  const startGame = () => {
    if (betAmount > walletBalance) {
      alert('Insufficient balance');
      return;
    }

    setGameState('playing');
    setGemsFound(0);
    setCurrentMultiplier(1.0);
    onTransaction(betAmount, 'withdraw');
    initializeGrid();
  };

  const handleCellClick = (cellId: number) => {
    if (gameState !== 'playing') return;

    const cell = grid[cellId];
    if (cell.isRevealed) return;

    const newGrid = [...grid];
    newGrid[cellId].isRevealed = true;
    setGrid(newGrid);

    if (cell.isMine) {
      // Game over - hit a mine
      setGameState('finished');
      revealAllMines();
      
      const newHistory: GameHistory = {
        id: Date.now().toString(),
        bet: betAmount,
        mines: mineCount,
        gemsFound,
        multiplier: 0,
        result: 'loss',
        profit: -betAmount,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      };
      setGameHistory(prev => [newHistory, ...prev.slice(0, 9)]);
    } else {
      // Found a gem
      const newGemsFound = gemsFound + 1;
      setGemsFound(newGemsFound);
      
      // Check if all gems are found
      const totalGems = 25 - mineCount;
      if (newGemsFound === totalGems) {
        handleCashOut();
      }
    }
  };

  const handleCashOut = () => {
    if (gameState !== 'playing') return;

    const winnings = betAmount * currentMultiplier;
    const profit = winnings - betAmount;
    
    setGameState('finished');
    onTransaction(winnings, 'deposit');

    const newHistory: GameHistory = {
      id: Date.now().toString(),
      bet: betAmount,
      mines: mineCount,
      gemsFound,
      multiplier: currentMultiplier,
      result: 'win',
      profit,
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };
    setGameHistory(prev => [newHistory, ...prev.slice(0, 9)]);
  };

  const revealAllMines = () => {
    setGrid(prev => prev.map(cell => ({
      ...cell,
      isRevealed: cell.isMine ? true : cell.isRevealed
    })));
  };

  const resetGame = () => {
    setGameState('betting');
    setGrid([]);
    setGemsFound(0);
    setCurrentMultiplier(1.0);
  };

  const getCellContent = (cell: Cell) => {
    if (!cell.isRevealed) {
      return <div className="w-full h-full bg-gray-600 hover:bg-gray-500 transition-colors rounded"></div>;
    }

    if (cell.isMine) {
      return (
        <div className="w-full h-full bg-red-500 flex items-center justify-center rounded animate-pulse">
          <Bomb className="w-5 h-5 text-white" />
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-green-500 flex items-center justify-center rounded animate-bounce">
        <Gem className="w-5 h-5 text-white" />
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Bomb className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Mines</h2>
                <p className="text-sm opacity-90">Find gems, avoid mines</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* Game Controls */}
          <div className="space-y-4">
            {/* Betting Section */}
            {gameState === 'betting' && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold mb-3">Game Settings</h3>
                
                {/* Bet Amount */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Bet Amount</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {quickAmounts.map(amount => (
                      <button
                        key={amount}
                        onClick={() => setBetAmount(amount)}
                        className={`py-2 px-3 rounded text-sm font-medium transition-all ${
                          betAmount === amount 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    placeholder="Enter bet amount"
                  />
                </div>

                {/* Mine Count */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Number of Mines</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {mineOptions.map(count => (
                      <button
                        key={count}
                        onClick={() => setMineCount(count)}
                        className={`py-2 px-2 rounded text-sm font-medium transition-all ${
                          mineCount === count 
                            ? 'bg-red-500 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto Cash Out */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Auto Cash Out (Optional)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={autoCashOut || ''}
                    onChange={(e) => setAutoCashOut(parseFloat(e.target.value) || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-yellow-500"
                    placeholder="Auto cash out at multiplier"
                  />
                </div>

                <button
                  onClick={startGame}
                  disabled={betAmount <= 0 || betAmount > walletBalance}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition-all"
                >
                  Start Game (₹{betAmount})
                </button>
                
                <div className="text-sm text-gray-600 text-center mt-2">
                  Balance: ₹{walletBalance.toFixed(2)}
                </div>
              </div>
            )}

            {/* Game Status */}
            {gameState === 'playing' && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold mb-3">Game Status</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Bet Amount:</span>
                    <span className="font-bold">₹{betAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mines:</span>
                    <span className="font-bold text-red-500">{mineCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gems Found:</span>
                    <span className="font-bold text-green-500">{gemsFound}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Multiplier:</span>
                    <span className="font-bold text-blue-500">{currentMultiplier.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Potential Win:</span>
                    <span className="font-bold text-purple-500">₹{(betAmount * currentMultiplier).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCashOut}
                  disabled={gemsFound === 0}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition-all"
                >
                  Cash Out (₹{(betAmount * currentMultiplier).toFixed(2)})
                </button>
              </div>
            )}

            {/* Game Result */}
            {gameState === 'finished' && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold mb-3">Game Result</h3>
                
                <div className="text-center mb-4">
                  {gemsFound > 0 ? (
                    <div>
                      <div className="text-green-500 text-2xl font-bold mb-2">WIN!</div>
                      <div className="text-lg">₹{(betAmount * currentMultiplier).toFixed(2)}</div>
                      <div className="text-sm text-gray-600">
                        Profit: ₹{(betAmount * currentMultiplier - betAmount).toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-red-500 text-2xl font-bold mb-2">BOOM!</div>
                      <div className="text-lg">₹0</div>
                      <div className="text-sm text-gray-600">Loss: ₹{betAmount}</div>
                    </div>
                  )}
                </div>

                <button
                  onClick={resetGame}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition-all flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </div>
            )}

            {/* Statistics */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Statistics
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Games:</span>
                  <span>{gameHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wins:</span>
                  <span className="text-green-500">
                    {gameHistory.filter(g => g.result === 'win').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Win Rate:</span>
                  <span>
                    {gameHistory.length > 0 
                      ? ((gameHistory.filter(g => g.result === 'win').length / gameHistory.length) * 100).toFixed(1)
                      : 0
                    }%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Profit:</span>
                  <span className={gameHistory.reduce((sum, g) => sum + g.profit, 0) >= 0 ? 'text-green-500' : 'text-red-500'}>
                    ₹{gameHistory.reduce((sum, g) => sum + g.profit, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Grid */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="grid grid-cols-5 gap-2 aspect-square max-w-md mx-auto">
                {grid.map((cell) => (
                  <button
                    key={cell.id}
                    onClick={() => handleCellClick(cell.id)}
                    disabled={gameState !== 'playing' || cell.isRevealed}
                    className="aspect-square border-2 border-gray-300 rounded-lg transition-all hover:border-gray-400 disabled:cursor-not-allowed"
                  >
                    {getCellContent(cell)}
                  </button>
                ))}
              </div>
              
              {gameState === 'betting' && (
                <div className="text-center mt-4 text-gray-500">
                  Click "Start Game" to begin playing
                </div>
              )}
            </div>

            {/* Game History */}
            <div className="bg-gray-50 rounded-xl p-4 mt-4">
              <h3 className="font-bold mb-3">Recent Games</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {gameHistory.slice(0, 5).map((game) => (
                  <div key={game.id} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg">
                    <div className="text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">₹{game.bet}</span>
                        <span className="text-gray-500">({game.mines} mines)</span>
                      </div>
                      <div className="text-gray-500">{game.time}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${game.result === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                        {game.result === 'win' ? `${game.multiplier.toFixed(2)}x` : 'BOOM'}
                      </div>
                      <div className={`text-sm ${game.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {game.profit >= 0 ? '+' : ''}₹{game.profit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}