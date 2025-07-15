import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Bomb, Gem, Target, TrendingUp, History, Zap, Shield } from 'lucide-react';

interface GameState {
  phase: 'setup' | 'playing' | 'ended';
  mineCount: number;
  revealedTiles: number[];
  minePositions: number[];
  currentMultiplier: number;
  hitMine: boolean;
  betAmount: number;
  potentialWin: number;
}

interface GameHistory {
  betAmount: number;
  mineCount: number;
  tilesRevealed: number;
  multiplier: number;
  winAmount: number;
  timestamp: Date;
}

export default function ProductionMines() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    phase: 'setup',
    mineCount: 3,
    revealedTiles: [],
    minePositions: [],
    currentMultiplier: 1.0,
    hitMine: false,
    betAmount: 100,
    potentialWin: 0
  });
  
  const [balance, setBalance] = useState(0);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Statistics
  const [totalBets, setTotalBets] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [biggestWin, setBiggestWin] = useState(0);
  const [winRate, setWinRate] = useState(0);

  // Initialize game
  useEffect(() => {
    loadUserBalance();
    loadGameHistory();
    loadGameStats();
  }, []);

  const loadUserBalance = useCallback(async () => {
    try {
      const response = await api.getBalance();
      setBalance(response.balance);
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  }, []);

  const loadGameHistory = useCallback(async () => {
    try {
      // Simulate loading game history
      const mockHistory: GameHistory[] = [
        { betAmount: 100, mineCount: 3, tilesRevealed: 5, multiplier: 2.40, winAmount: 240, timestamp: new Date() },
        { betAmount: 200, mineCount: 5, tilesRevealed: 3, multiplier: 1.85, winAmount: 370, timestamp: new Date() },
        { betAmount: 500, mineCount: 1, tilesRevealed: 8, multiplier: 3.20, winAmount: 1600, timestamp: new Date() },
        { betAmount: 150, mineCount: 2, tilesRevealed: 0, multiplier: 0, winAmount: 0, timestamp: new Date() },
        { betAmount: 300, mineCount: 4, tilesRevealed: 2, multiplier: 1.50, winAmount: 450, timestamp: new Date() },
      ];
      setGameHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load game history:', error);
    }
  }, []);

  const loadGameStats = useCallback(async () => {
    try {
      setTotalBets(87);
      setTotalWins(52);
      setBiggestWin(2340);
      setWinRate(59.8);
    } catch (error) {
      console.error('Failed to load game stats:', error);
    }
  }, []);

  const calculateMultiplier = (tilesRevealed: number, mineCount: number) => {
    const totalTiles = 25;
    const safeTiles = totalTiles - mineCount;
    
    if (tilesRevealed === 0) return 1.0;
    
    let multiplier = 1.0;
    for (let i = 0; i < tilesRevealed; i++) {
      multiplier *= (safeTiles - i) / (totalTiles - mineCount - i);
    }
    
    // House edge adjustment
    multiplier *= 0.97;
    
    return Math.max(1.0, multiplier);
  };

  const startGame = async () => {
    if (balance < gameState.betAmount) {
      toast({
        title: "Insufficient Balance",
        description: "Please add funds to your account",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Deduct bet amount
      setBalance(prev => prev - gameState.betAmount);
      
      // Generate mine positions (but don't reveal them yet)
      const minePositions = generateMinePositions(gameState.mineCount);
      
      setGameState(prev => ({
        ...prev,
        phase: 'playing',
        minePositions,
        revealedTiles: [],
        currentMultiplier: 1.0,
        hitMine: false,
        potentialWin: gameState.betAmount
      }));
      
      toast({
        title: "Game Started",
        description: `₹${gameState.betAmount} bet placed with ${gameState.mineCount} mines`,
        variant: "default",
      });
      
    } catch (error) {
      console.error('Failed to start game:', error);
      toast({
        title: "Error",
        description: "Failed to start game",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateMinePositions = (mineCount: number): number[] => {
    const positions: number[] = [];
    while (positions.length < mineCount) {
      const pos = Math.floor(Math.random() * 25);
      if (!positions.includes(pos)) {
        positions.push(pos);
      }
    }
    return positions;
  };

  const revealTile = async (tileIndex: number) => {
    if (gameState.phase !== 'playing' || gameState.revealedTiles.includes(tileIndex) || isProcessing) {
      return;
    }

    setIsProcessing(true);
    
    try {
      const newRevealedTiles = [...gameState.revealedTiles, tileIndex];
      const hitMine = gameState.minePositions.includes(tileIndex);
      
      if (hitMine) {
        // Hit a mine - game over
        setGameState(prev => ({
          ...prev,
          phase: 'ended',
          revealedTiles: newRevealedTiles,
          hitMine: true,
          potentialWin: 0
        }));
        
        // Process the loss
        await api.playMines(gameState.betAmount, gameState.mineCount, newRevealedTiles);
        
        // Add to history
        const newHistoryItem: GameHistory = {
          betAmount: gameState.betAmount,
          mineCount: gameState.mineCount,
          tilesRevealed: newRevealedTiles.length,
          multiplier: 0,
          winAmount: 0,
          timestamp: new Date()
        };
        setGameHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
        
        toast({
          title: "💥 Boom!",
          description: "You hit a mine and lost your bet",
          variant: "destructive",
        });
        
      } else {
        // Safe tile - continue playing
        const newMultiplier = calculateMultiplier(newRevealedTiles.length, gameState.mineCount);
        const potentialWin = Math.floor(gameState.betAmount * newMultiplier);
        
        setGameState(prev => ({
          ...prev,
          revealedTiles: newRevealedTiles,
          currentMultiplier: newMultiplier,
          potentialWin
        }));
        
        toast({
          title: "💎 Safe!",
          description: `Multiplier: ${newMultiplier.toFixed(2)}x | Potential Win: ₹${potentialWin}`,
          variant: "default",
        });
      }
      
    } catch (error) {
      console.error('Failed to reveal tile:', error);
      toast({
        title: "Error",
        description: "Failed to reveal tile",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const cashOut = async () => {
    if (gameState.phase !== 'playing' || gameState.revealedTiles.length === 0 || isProcessing) {
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await api.playMines(gameState.betAmount, gameState.mineCount, gameState.revealedTiles);
      
      if (result.isWin) {
        const winAmount = Math.floor(gameState.betAmount * gameState.currentMultiplier);
        setBalance(prev => prev + winAmount);
        
        setGameState(prev => ({
          ...prev,
          phase: 'ended',
          potentialWin: winAmount
        }));
        
        // Add to history
        const newHistoryItem: GameHistory = {
          betAmount: gameState.betAmount,
          mineCount: gameState.mineCount,
          tilesRevealed: gameState.revealedTiles.length,
          multiplier: gameState.currentMultiplier,
          winAmount,
          timestamp: new Date()
        };
        setGameHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
        
        toast({
          title: "🎉 Cashed Out!",
          description: `You won ₹${winAmount} with ${gameState.currentMultiplier.toFixed(2)}x multiplier`,
          variant: "default",
        });
      }
      
    } catch (error) {
      console.error('Failed to cash out:', error);
      toast({
        title: "Error",
        description: "Failed to cash out",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetGame = () => {
    setGameState({
      phase: 'setup',
      mineCount: gameState.mineCount,
      revealedTiles: [],
      minePositions: [],
      currentMultiplier: 1.0,
      hitMine: false,
      betAmount: gameState.betAmount,
      potentialWin: 0
    });
  };

  const getTileContent = (index: number) => {
    if (gameState.phase === 'ended' && gameState.minePositions.includes(index)) {
      return <Bomb className="w-6 h-6 text-red-500" />;
    }
    if (gameState.revealedTiles.includes(index)) {
      return <Gem className="w-6 h-6 text-green-500" />;
    }
    return null;
  };

  const getTileClass = (index: number) => {
    const baseClass = "w-16 h-16 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105";
    
    if (gameState.phase === 'ended' && gameState.minePositions.includes(index)) {
      return `${baseClass} bg-red-500 border-red-600`;
    }
    if (gameState.revealedTiles.includes(index)) {
      return `${baseClass} bg-green-500 border-green-600`;
    }
    if (gameState.phase === 'playing') {
      return `${baseClass} bg-gray-200 border-gray-300 hover:bg-gray-300`;
    }
    return `${baseClass} bg-gray-100 border-gray-200 cursor-not-allowed`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Mines - Strategic Gambling
        </h1>
        <p className="text-gray-600">Find gems • Avoid mines • Cash out anytime • Progressive multipliers</p>
      </div>

      {/* Game Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              <CardTitle className="text-lg">
                {gameState.phase === 'setup' ? 'Setup Game' : 
                 gameState.phase === 'playing' ? 'Playing...' : 'Game Ended'}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm">
              Balance: ₹{balance.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{gameState.mineCount}</div>
              <div className="text-sm text-gray-600">Mines</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{gameState.revealedTiles.length}</div>
              <div className="text-sm text-gray-600">Tiles Revealed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{gameState.currentMultiplier.toFixed(2)}x</div>
              <div className="text-sm text-gray-600">Current Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">₹{gameState.potentialWin}</div>
              <div className="text-sm text-gray-600">Potential Win</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Setup */}
      {gameState.phase === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Game Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bet Amount</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGameState(prev => ({ ...prev, betAmount: Math.max(10, prev.betAmount - 10) }))}
                  >
                    -
                  </Button>
                  <div className="flex-1 text-center px-4 py-2 bg-gray-100 rounded">
                    ₹{gameState.betAmount}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGameState(prev => ({ ...prev, betAmount: prev.betAmount + 10 }))}
                  >
                    +
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  {[100, 500, 1000, 5000].map(amount => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setGameState(prev => ({ ...prev, betAmount: amount }))}
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Mine Count</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGameState(prev => ({ ...prev, mineCount: Math.max(1, prev.mineCount - 1) }))}
                  >
                    -
                  </Button>
                  <div className="flex-1 text-center px-4 py-2 bg-gray-100 rounded">
                    {gameState.mineCount} mines
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGameState(prev => ({ ...prev, mineCount: Math.min(20, prev.mineCount + 1) }))}
                  >
                    +
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  {[1, 3, 5, 10].map(count => (
                    <Button
                      key={count}
                      variant="outline"
                      size="sm"
                      onClick={() => setGameState(prev => ({ ...prev, mineCount: count }))}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={startGame}
              disabled={isProcessing}
            >
              {isProcessing ? 'Starting...' : 'Start Game'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Game Board */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Mine Field</CardTitle>
            {gameState.phase === 'playing' && (
              <Button
                variant="outline"
                onClick={cashOut}
                disabled={gameState.revealedTiles.length === 0 || isProcessing}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Cash Out ₹{gameState.potentialWin}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
            {Array.from({ length: 25 }, (_, index) => (
              <div
                key={index}
                className={getTileClass(index)}
                onClick={() => revealTile(index)}
              >
                {getTileContent(index)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Game Controls */}
      {gameState.phase === 'ended' && (
        <Card>
          <CardContent className="text-center py-6">
            <div className="space-y-4">
              {gameState.hitMine ? (
                <div className="text-red-600">
                  <Bomb className="w-12 h-12 mx-auto mb-2" />
                  <div className="text-2xl font-bold">Game Over!</div>
                  <div>You hit a mine and lost ₹{gameState.betAmount}</div>
                </div>
              ) : (
                <div className="text-green-600">
                  <Gem className="w-12 h-12 mx-auto mb-2" />
                  <div className="text-2xl font-bold">Well Done!</div>
                  <div>You won ₹{gameState.potentialWin} with {gameState.currentMultiplier.toFixed(2)}x multiplier</div>
                </div>
              )}
              
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={resetGame}
              >
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            Game History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {gameHistory.map((game, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Bomb className="w-4 h-4 text-red-500" />
                    <span className="text-sm">{game.mineCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gem className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{game.tilesRevealed}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {game.multiplier > 0 ? `${game.multiplier.toFixed(2)}x` : 'BOOM'}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${game.winAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {game.winAmount > 0 ? '+' : '-'}₹{game.winAmount || game.betAmount}
                  </div>
                  <div className="text-xs text-gray-500">
                    {game.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalBets}</div>
              <div className="text-sm text-gray-600">Total Bets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalWins}</div>
              <div className="text-sm text-gray-600">Total Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{winRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">₹{biggestWin}</div>
              <div className="text-sm text-gray-600">Biggest Win</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}