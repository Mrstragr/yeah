import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Clock,
  Zap,
  Target,
  DollarSign,
  RefreshCw
} from 'lucide-react';

interface GameInterfaceProps {
  gameId: string;
  gameName: string;
  onBack: () => void;
  userBalance: string;
  onBalanceUpdate: () => void;
}

interface GameState {
  isPlaying: boolean;
  isLoading: boolean;
  currentRound: number;
  gameData: any;
  result: any;
  userStats: {
    totalGames: number;
    winRate: number;
    totalWinnings: string;
  };
}

export const EnhancedGameInterface = ({ 
  gameId, 
  gameName, 
  onBack, 
  userBalance,
  onBalanceUpdate 
}: GameInterfaceProps) => {
  const [betAmount, setBetAmount] = useState('10');
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isLoading: false,
    currentRound: 1,
    gameData: null,
    result: null,
    userStats: {
      totalGames: 0,
      winRate: 0,
      totalWinnings: '0'
    }
  });
  
  const { toast } = useToast();

  // Load user game statistics
  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const response = await apiRequest('GET', `/api/user/game-history?gameId=${gameId}`);
      const data = await response.json();
      
      if (data.stats) {
        setGameState(prev => ({
          ...prev,
          userStats: data.stats
        }));
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const playGame = async (gameParams = {}) => {
    const amount = parseFloat(betAmount);
    if (amount < 1 || amount > parseFloat(userBalance)) {
      toast({
        title: "Invalid Bet",
        description: "Check your bet amount and balance",
        variant: "destructive"
      });
      return;
    }

    setGameState(prev => ({ ...prev, isPlaying: true, isLoading: true }));

    try {
      const response = await apiRequest('POST', `/api/games/${gameId}/play`, {
        betAmount: amount,
        ...gameParams
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      setGameState(prev => ({
        ...prev,
        result,
        isLoading: false,
        currentRound: prev.currentRound + 1
      }));

      // Update balance
      onBalanceUpdate();

      // Show result toast
      if (result.isWin) {
        toast({
          title: "🎉 You Won!",
          description: `You won ₹${result.winAmount}`,
          className: "bg-green-600 text-white"
        });
      } else {
        toast({
          title: "Better luck next time!",
          description: `You lost ₹${amount}`,
          variant: "destructive"
        });
      }

      // Update stats
      loadUserStats();

    } catch (error: any) {
      toast({
        title: "Game Error",
        description: error.message || "Failed to play game",
        variant: "destructive"
      });
    } finally {
      setGameState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isLoading: false 
      }));
    }
  };

  const renderGameSpecificContent = () => {
    switch (gameId) {
      case 'aviator':
        return <AviatorGame onPlay={playGame} gameState={gameState} />;
      case 'mines':
        return <MinesGame onPlay={playGame} gameState={gameState} />;
      case 'dragon-tiger':
        return <DragonTigerGame onPlay={playGame} gameState={gameState} />;
      case 'wingo':
        return <WinGoGame onPlay={playGame} gameState={gameState} />;
      case 'teen-patti':
        return <TeenPattiGame onPlay={playGame} gameState={gameState} />;
      case 'limbo':
        return <LimboGame onPlay={playGame} gameState={gameState} />;
      case 'plinko':
        return <PlinkoGame onPlay={playGame} gameState={gameState} />;
      default:
        return <DefaultGame onPlay={playGame} gameState={gameState} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onBack}
                className="text-white hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-white font-bold text-lg">{gameName}</h1>
                <p className="text-gray-400 text-xs">Round #{gameState.currentRound}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">Balance</p>
              <p className="text-white font-bold">₹{parseFloat(userBalance).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="max-w-md mx-auto p-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Target className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xs text-gray-400">Games</p>
              <p className="text-sm font-bold text-white">{gameState.userStats.totalGames}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-xs text-gray-400">Win Rate</p>
              <p className="text-sm font-bold text-white">{gameState.userStats.winRate}%</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <DollarSign className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-xs text-gray-400">Winnings</p>
              <p className="text-sm font-bold text-white">₹{parseFloat(gameState.userStats.totalWinnings).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Bet Controls */}
        <Card className="bg-slate-800/50 border-slate-700 mb-4">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Bet Amount</label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                    placeholder="Enter amount"
                    min="1"
                    max={userBalance}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount((parseFloat(betAmount) * 2).toString())}
                    className="border-slate-600 text-gray-300 hover:bg-slate-600"
                  >
                    2x
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {['10', '50', '100', '500'].map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(amount)}
                    className="border-slate-600 text-gray-300 hover:bg-slate-600"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Area */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            {renderGameSpecificContent()}
          </CardContent>
        </Card>

        {/* Result Display */}
        {gameState.result && (
          <Card className={`mt-4 border-2 ${gameState.result.isWin ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
            <CardContent className="p-4 text-center">
              <div className="mb-2">
                {gameState.result.isWin ? (
                  <div className="text-green-400 text-lg font-bold">🎉 YOU WON!</div>
                ) : (
                  <div className="text-red-400 text-lg font-bold">💔 TRY AGAIN</div>
                )}
              </div>
              <div className="text-white">
                <p>Multiplier: {gameState.result.multiplier}x</p>
                <p className={gameState.result.isWin ? 'text-green-400' : 'text-red-400'}>
                  {gameState.result.isWin ? '+' : '-'}₹{Math.abs(gameState.result.winAmount || parseFloat(betAmount))}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Game-specific components
const AviatorGame = ({ onPlay, gameState }: any) => {
  const [cashOutAt, setCashOutAt] = useState('2.0');
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="bg-slate-700 rounded-lg p-6 mb-4">
          <div className="text-white text-3xl font-bold mb-2">
            {gameState.isLoading ? '🛫' : '✈️'}
          </div>
          <p className="text-gray-300">Current Multiplier</p>
          <p className="text-xl font-bold text-blue-400">
            {gameState.result?.result?.crashMultiplier || '1.00'}x
          </p>
        </div>
      </div>
      
      <div>
        <label className="text-white text-sm mb-2 block">Cash Out At</label>
        <Input
          type="number"
          value={cashOutAt}
          onChange={(e) => setCashOutAt(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white mb-3"
          step="0.1"
          min="1.1"
        />
      </div>
      
      <Button 
        onClick={() => onPlay({ cashOutMultiplier: parseFloat(cashOutAt) })}
        disabled={gameState.isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {gameState.isLoading ? (
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Flying...</span>
          </div>
        ) : (
          'Take Flight'
        )}
      </Button>
    </div>
  );
};

const MinesGame = ({ onPlay, gameState }: any) => {
  const [mineCount, setMineCount] = useState(3);
  const [revealedTiles, setRevealedTiles] = useState<number[]>([]);
  
  const toggleTile = (index: number) => {
    if (gameState.isLoading) return;
    
    setRevealedTiles(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="text-white text-sm mb-2 block">Mines: {mineCount}</label>
        <input
          type="range"
          min="1"
          max="5"
          value={mineCount}
          onChange={(e) => setMineCount(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 25 }).map((_, index) => (
          <button
            key={index}
            onClick={() => toggleTile(index)}
            className={`aspect-square rounded border-2 ${
              revealedTiles.includes(index)
                ? 'bg-blue-600 border-blue-400'
                : 'bg-slate-700 border-slate-600'
            } hover:bg-slate-600 transition-colors`}
            disabled={gameState.isLoading}
          >
            {revealedTiles.includes(index) && '💎'}
          </button>
        ))}
      </div>
      
      <Button 
        onClick={() => onPlay({ mineCount, revealedTiles })}
        disabled={gameState.isLoading || revealedTiles.length === 0}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {gameState.isLoading ? 'Revealing...' : `Reveal (${revealedTiles.length} tiles)`}
      </Button>
    </div>
  );
};

const DragonTigerGame = ({ onPlay, gameState }: any) => {
  const [selectedBet, setSelectedBet] = useState<'dragon' | 'tiger' | 'tie'>('dragon');
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-white text-lg font-bold mb-4">Choose Your Side</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'dragon', label: '🐲 Dragon', color: 'bg-red-600' },
            { value: 'tie', label: '🤝 Tie', color: 'bg-yellow-600' },
            { value: 'tiger', label: '🐅 Tiger', color: 'bg-orange-600' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedBet(option.value as any)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedBet === option.value
                  ? `${option.color} border-white`
                  : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
              }`}
            >
              <div className="text-white text-sm font-medium">{option.label}</div>
            </button>
          ))}
        </div>
      </div>
      
      {gameState.result && (
        <div className="text-center bg-slate-700 rounded-lg p-4">
          <p className="text-gray-300 text-sm">Last Result</p>
          <div className="flex justify-center space-x-4 mt-2">
            <div className="text-white">
              Dragon: {gameState.result.result?.dragonCard || 'K'}
            </div>
            <div className="text-white">
              Tiger: {gameState.result.result?.tigerCard || 'A'}
            </div>
          </div>
        </div>
      )}
      
      <Button 
        onClick={() => onPlay({ betType: selectedBet })}
        disabled={gameState.isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {gameState.isLoading ? 'Drawing Cards...' : `Bet on ${selectedBet.toUpperCase()}`}
      </Button>
    </div>
  );
};

const WinGoGame = ({ onPlay, gameState }: any) => {
  const [selectedNumber, setSelectedNumber] = useState<number>(5);
  const [selectedColor, setSelectedColor] = useState<'red' | 'green' | 'violet'>('green');
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-white text-sm font-medium mb-2">Select Number (0-9)</h3>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedNumber(i)}
              className={`p-2 rounded border ${
                selectedNumber === i
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-white text-sm font-medium mb-2">Select Color</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'red', label: 'Red', bg: 'bg-red-600' },
            { value: 'green', label: 'Green', bg: 'bg-green-600' },
            { value: 'violet', label: 'Violet', bg: 'bg-purple-600' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedColor(option.value as any)}
              className={`p-3 rounded border ${
                selectedColor === option.value
                  ? `${option.bg} border-white`
                  : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
              }`}
            >
              <span className="text-white text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={() => onPlay({ 
          betType: 'number_color', 
          betValue: { number: selectedNumber, color: selectedColor } 
        })}
        disabled={gameState.isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        {gameState.isLoading ? 'Drawing...' : 'Place Bet'}
      </Button>
    </div>
  );
};

const TeenPattiGame = ({ onPlay, gameState }: any) => (
  <div className="space-y-4 text-center">
    <div className="bg-slate-700 rounded-lg p-6">
      <div className="text-4xl mb-2">🃏</div>
      <p className="text-white">Play against the dealer</p>
      <p className="text-gray-300 text-sm">Get the best 3-card hand</p>
    </div>
    
    <Button 
      onClick={() => onPlay({})}
      disabled={gameState.isLoading}
      className="w-full bg-amber-600 hover:bg-amber-700"
    >
      {gameState.isLoading ? 'Dealing...' : 'Deal Cards'}
    </Button>
  </div>
);

const LimboGame = ({ onPlay, gameState }: any) => {
  const [target, setTarget] = useState('2.0');
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="bg-slate-700 rounded-lg p-6 mb-4">
          <div className="text-white text-3xl font-bold mb-2">🎯</div>
          <p className="text-gray-300">Target Multiplier</p>
          <p className="text-xl font-bold text-green-400">{target}x</p>
        </div>
      </div>
      
      <div>
        <label className="text-white text-sm mb-2 block">Set Target</label>
        <Input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
          step="0.1"
          min="1.01"
        />
      </div>
      
      <Button 
        onClick={() => onPlay({ targetMultiplier: parseFloat(target) })}
        disabled={gameState.isLoading}
        className="w-full bg-pink-600 hover:bg-pink-700"
      >
        {gameState.isLoading ? 'Rolling...' : 'Roll Dice'}
      </Button>
    </div>
  );
};

const PlinkoGame = ({ onPlay, gameState }: any) => {
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="bg-slate-700 rounded-lg p-6 mb-4">
          <div className="text-white text-3xl font-bold mb-2">⚪</div>
          <p className="text-gray-300">Drop the ball</p>
          <p className="text-sm text-gray-400">Risk: {riskLevel}</p>
        </div>
      </div>
      
      <div>
        <label className="text-white text-sm mb-2 block">Risk Level</label>
        <div className="grid grid-cols-3 gap-2">
          {['low', 'medium', 'high'].map(level => (
            <button
              key={level}
              onClick={() => setRiskLevel(level as any)}
              className={`p-2 rounded border capitalize ${
                riskLevel === level
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={() => onPlay({ riskLevel })}
        disabled={gameState.isLoading}
        className="w-full bg-cyan-600 hover:bg-cyan-700"
      >
        {gameState.isLoading ? 'Dropping...' : 'Drop Ball'}
      </Button>
    </div>
  );
};

const DefaultGame = ({ onPlay, gameState }: any) => (
  <div className="space-y-4 text-center">
    <div className="bg-slate-700 rounded-lg p-6">
      <div className="text-4xl mb-2">🎮</div>
      <p className="text-white">Ready to play?</p>
      <p className="text-gray-300 text-sm">Test your luck!</p>
    </div>
    
    <Button 
      onClick={() => onPlay({})}
      disabled={gameState.isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700"
    >
      {gameState.isLoading ? 'Playing...' : 'Play Game'}
    </Button>
  </div>
);