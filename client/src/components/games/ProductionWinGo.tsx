import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Bell, History, TrendingUp, Clock, Star, Trophy, Zap } from 'lucide-react';

interface GameResult {
  period: string;
  number: number;
  color: string;
  size: string;
  timestamp: Date;
}

interface BetData {
  type: 'number' | 'color' | 'size';
  value: any;
  amount: number;
  multiplier: number;
}

export default function ProductionWinGo() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Game state
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [gamePhase, setGamePhase] = useState<'betting' | 'drawing' | 'result'>('betting');
  const [balance, setBalance] = useState(0);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [myBets, setMyBets] = useState<BetData[]>([]);
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  
  // Betting state
  const [selectedBetType, setSelectedBetType] = useState<'number' | 'color' | 'size'>('color');
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [betQuantity, setBetQuantity] = useState(1);
  const [showBetModal, setShowBetModal] = useState(false);
  
  // Statistics
  const [winRate, setWinRate] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [popularNumbers, setPopularNumbers] = useState<number[]>([]);

  // Initialize game
  useEffect(() => {
    loadUserBalance();
    loadGameHistory();
    loadGameStats();
    generateNewPeriod();
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'betting') {
            setGamePhase('drawing');
            setTimeout(() => {
              processGameResult();
            }, 3000);
            return 3;
          } else if (gamePhase === 'drawing') {
            setGamePhase('result');
            setTimeout(() => {
              startNewRound();
            }, 5000);
            return 5;
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase]);

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
      const mockHistory: GameResult[] = [
        { period: '2024071500001', number: 7, color: 'green', size: 'big', timestamp: new Date() },
        { period: '2024071500002', number: 3, color: 'green', size: 'small', timestamp: new Date() },
        { period: '2024071500003', number: 8, color: 'red', size: 'big', timestamp: new Date() },
        { period: '2024071500004', number: 0, color: 'red-violet', size: 'small', timestamp: new Date() },
        { period: '2024071500005', number: 5, color: 'green-violet', size: 'big', timestamp: new Date() },
      ];
      setGameHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load game history:', error);
    }
  }, []);

  const loadGameStats = useCallback(async () => {
    try {
      // Simulate loading game statistics
      setWinRate(65);
      setTotalWins(127);
      setPopularNumbers([7, 3, 8, 1, 9]);
    } catch (error) {
      console.error('Failed to load game stats:', error);
    }
  }, []);

  const generateNewPeriod = () => {
    const now = new Date();
    const period = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(Math.floor(now.getMinutes() / 5)).padStart(3, '0')}`;
    setCurrentPeriod(period);
  };

  const processGameResult = async () => {
    try {
      // Process all user bets
      for (const bet of myBets) {
        const result = await api.playWinGo(bet.amount * betQuantity, bet.type, bet.value);
        
        if (result.isWin) {
          toast({
            title: "🎉 Winner!",
            description: `You won ₹${result.winAmount} with ${bet.type} bet!`,
            variant: "default",
          });
        }
      }
      
      // Generate result for display
      const resultNumber = Math.floor(Math.random() * 10);
      const resultColor = getNumberColor(resultNumber);
      const resultSize = resultNumber < 5 ? 'small' : 'big';
      
      const newResult: GameResult = {
        period: currentPeriod,
        number: resultNumber,
        color: resultColor,
        size: resultSize,
        timestamp: new Date()
      };
      
      setGameHistory(prev => [newResult, ...prev.slice(0, 9)]);
      await loadUserBalance();
      
    } catch (error) {
      console.error('Failed to process game result:', error);
      toast({
        title: "Error",
        description: "Failed to process game result",
        variant: "destructive",
      });
    }
  };

  const startNewRound = () => {
    setGamePhase('betting');
    setTimeLeft(30);
    setMyBets([]);
    setTotalBetAmount(0);
    generateNewPeriod();
  };

  const getNumberColor = (num: number): string => {
    if (num === 0) return 'red-violet';
    if (num === 5) return 'green-violet';
    if ([1, 3, 7, 9].includes(num)) return 'green';
    if ([2, 4, 6, 8].includes(num)) return 'red';
    return 'red';
  };

  const placeBet = async (type: 'number' | 'color' | 'size', value: any, multiplier: number) => {
    if (gamePhase !== 'betting') {
      toast({
        title: "Betting Closed",
        description: "Betting is not available during this phase",
        variant: "destructive",
      });
      return;
    }

    if (balance < betAmount) {
      toast({
        title: "Insufficient Balance",
        description: "Please add funds to your account",
        variant: "destructive",
      });
      return;
    }

    const newBet: BetData = {
      type,
      value,
      amount: betAmount,
      multiplier
    };

    setMyBets(prev => [...prev, newBet]);
    setTotalBetAmount(prev => prev + betAmount);
    setBalance(prev => prev - betAmount);

    toast({
      title: "Bet Placed",
      description: `₹${betAmount} bet placed on ${type}: ${value}`,
      variant: "default",
    });
  };

  const getPhaseColor = () => {
    switch (gamePhase) {
      case 'betting': return 'bg-green-500';
      case 'drawing': return 'bg-yellow-500';
      case 'result': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPhaseText = () => {
    switch (gamePhase) {
      case 'betting': return 'Betting Time';
      case 'drawing': return 'Drawing...';
      case 'result': return 'Result Time';
      default: return 'Waiting...';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          WinGo - Color Prediction
        </h1>
        <p className="text-gray-600">Official lottery game • Real-time results • Instant payouts</p>
      </div>

      {/* Game Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Period: {currentPeriod}</CardTitle>
            </div>
            <Badge variant="secondary" className="text-sm">
              Balance: ₹{balance.toFixed(2)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className={`px-4 py-2 rounded-lg text-white font-medium ${getPhaseColor()}`}>
                {getPhaseText()}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {String(timeLeft).padStart(2, '0')}s
              </div>
            </div>
            <Progress value={(30 - timeLeft) / 30 * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Betting Section */}
      {gamePhase === 'betting' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Color Betting */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Color Betting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="h-20 bg-gradient-to-b from-green-400 to-green-600 text-white border-0 hover:from-green-500 hover:to-green-700"
                  onClick={() => placeBet('color', 'green', 2)}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">Green</div>
                    <div className="text-sm opacity-90">2x</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 bg-gradient-to-b from-purple-400 to-purple-600 text-white border-0 hover:from-purple-500 hover:to-purple-700"
                  onClick={() => placeBet('color', 'violet', 4.5)}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">Violet</div>
                    <div className="text-sm opacity-90">4.5x</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 bg-gradient-to-b from-red-400 to-red-600 text-white border-0 hover:from-red-500 hover:to-red-700"
                  onClick={() => placeBet('color', 'red', 2)}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">Red</div>
                    <div className="text-sm opacity-90">2x</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Number Betting */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-500" />
                Number Betting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <Button
                    key={num}
                    variant="outline"
                    className={`h-16 font-bold text-lg border-2 ${
                      getNumberColor(num) === 'green' ? 'border-green-500 bg-green-50 hover:bg-green-100' :
                      getNumberColor(num) === 'red' ? 'border-red-500 bg-red-50 hover:bg-red-100' :
                      getNumberColor(num) === 'red-violet' ? 'border-purple-500 bg-purple-50 hover:bg-purple-100' :
                      'border-purple-500 bg-purple-50 hover:bg-purple-100'
                    }`}
                    onClick={() => placeBet('number', num, 9)}
                  >
                    <div className="text-center">
                      <div>{num}</div>
                      <div className="text-xs">9x</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Size Betting */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Size Betting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 bg-gradient-to-b from-orange-400 to-orange-600 text-white border-0 hover:from-orange-500 hover:to-orange-700"
                  onClick={() => placeBet('size', 'small', 2)}
                >
                  <div className="text-center">
                    <div className="text-xl font-bold">Small</div>
                    <div className="text-sm opacity-90">0,1,2,3,4 • 2x</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 bg-gradient-to-b from-orange-400 to-orange-600 text-white border-0 hover:from-orange-500 hover:to-orange-700"
                  onClick={() => placeBet('size', 'big', 2)}
                >
                  <div className="text-center">
                    <div className="text-xl font-bold">Big</div>
                    <div className="text-sm opacity-90">5,6,7,8,9 • 2x</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bet Amount Controls */}
      {gamePhase === 'betting' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bet Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                >
                  -
                </Button>
                <div className="px-4 py-2 bg-gray-100 rounded min-w-[80px] text-center">
                  ₹{betAmount}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setBetAmount(betAmount + 10)}
                >
                  +
                </Button>
              </div>
              <div className="flex gap-2">
                {[100, 500, 1000, 5000].map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(amount)}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Bets */}
      {myBets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Bets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {myBets.map((bet, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{bet.type}</Badge>
                    <span className="font-medium">{bet.value}</span>
                    <span className="text-sm text-gray-600">{bet.multiplier}x</span>
                  </div>
                  <div className="font-bold">₹{bet.amount}</div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Total Bet:</span>
                <span className="font-bold text-lg">₹{totalBetAmount}</span>
              </div>
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
            {gameHistory.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{result.period}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    result.color === 'green' ? 'bg-green-500' :
                    result.color === 'red' ? 'bg-red-500' :
                    result.color === 'red-violet' ? 'bg-gradient-to-r from-red-500 to-purple-500' :
                    'bg-gradient-to-r from-green-500 to-purple-500'
                  }`}>
                    {result.number}
                  </div>
                  <Badge variant="outline">{result.size}</Badge>
                </div>
                <span className="text-sm text-gray-600">
                  {result.timestamp.toLocaleTimeString()}
                </span>
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
              <div className="text-2xl font-bold text-green-600">{winRate}%</div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalWins}</div>
              <div className="text-sm text-gray-600">Total Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{popularNumbers.length}</div>
              <div className="text-sm text-gray-600">Hot Numbers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">₹{balance.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Balance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}