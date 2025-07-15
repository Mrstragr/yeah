import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Target, TrendingUp, History, Zap } from 'lucide-react';

interface DiceResult {
  result: number;
  prediction: 'over' | 'under';
  targetNumber: number;
  multiplier: number;
  winAmount: number;
  timestamp: Date;
}

interface BetData {
  amount: number;
  prediction: 'over' | 'under';
  targetNumber: number;
  multiplier: number;
}

export default function ProductionDice() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Game state
  const [gamePhase, setGamePhase] = useState<'betting' | 'rolling' | 'result'>('betting');
  const [balance, setBalance] = useState(0);
  const [diceHistory, setDiceHistory] = useState<DiceResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Betting state
  const [betAmount, setBetAmount] = useState(100);
  const [prediction, setPrediction] = useState<'over' | 'under'>('over');
  const [targetNumber, setTargetNumber] = useState([50]);
  const [multiplier, setMultiplier] = useState(1.98);
  const [currentBet, setCurrentBet] = useState<BetData | null>(null);
  
  // Animation state
  const [currentRoll, setCurrentRoll] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [finalResult, setFinalResult] = useState<DiceResult | null>(null);
  
  // Statistics
  const [totalBets, setTotalBets] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [biggestWin, setBiggestWin] = useState(0);
  const [winRate, setWinRate] = useState(0);

  // Initialize game
  useEffect(() => {
    loadUserBalance();
    loadDiceHistory();
    loadGameStats();
  }, []);

  // Update multiplier when target number changes
  useEffect(() => {
    const target = targetNumber[0];
    let newMultiplier = 1.0;
    
    if (prediction === 'over') {
      newMultiplier = 100 / (100 - target);
    } else {
      newMultiplier = 100 / target;
    }
    
    // House edge (3% house edge)
    newMultiplier *= 0.97;
    
    setMultiplier(Math.max(1.01, newMultiplier));
  }, [targetNumber, prediction]);

  const loadUserBalance = useCallback(async () => {
    try {
      const response = await api.getBalance();
      setBalance(response.balance);
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  }, []);

  const loadDiceHistory = useCallback(async () => {
    try {
      // Simulate loading dice history
      const mockHistory: DiceResult[] = [
        { result: 67, prediction: 'over', targetNumber: 50, multiplier: 1.92, winAmount: 192, timestamp: new Date() },
        { result: 23, prediction: 'under', targetNumber: 40, multiplier: 2.43, winAmount: 0, timestamp: new Date() },
        { result: 89, prediction: 'over', targetNumber: 75, multiplier: 3.88, winAmount: 388, timestamp: new Date() },
        { result: 45, prediction: 'under', targetNumber: 60, multiplier: 1.62, winAmount: 162, timestamp: new Date() },
        { result: 12, prediction: 'under', targetNumber: 20, multiplier: 4.85, winAmount: 485, timestamp: new Date() },
        { result: 78, prediction: 'over', targetNumber: 80, multiplier: 4.85, winAmount: 0, timestamp: new Date() },
        { result: 34, prediction: 'under', targetNumber: 50, multiplier: 1.94, winAmount: 194, timestamp: new Date() },
        { result: 91, prediction: 'over', targetNumber: 70, multiplier: 3.23, winAmount: 323, timestamp: new Date() },
      ];
      setDiceHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load dice history:', error);
    }
  }, []);

  const loadGameStats = useCallback(async () => {
    try {
      setTotalBets(134);
      setTotalWins(78);
      setBiggestWin(1240);
      setWinRate(58.2);
    } catch (error) {
      console.error('Failed to load game stats:', error);
    }
  }, []);

  const placeBet = async () => {
    if (gamePhase !== 'betting') {
      toast({
        title: "Betting Closed",
        description: "Cannot place bet during roll",
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

    setIsProcessing(true);
    
    try {
      // Deduct bet amount
      setBalance(prev => prev - betAmount);
      
      const bet: BetData = {
        amount: betAmount,
        prediction,
        targetNumber: targetNumber[0],
        multiplier
      };
      
      setCurrentBet(bet);
      setGamePhase('rolling');
      
      // Start rolling animation
      rollDice();
      
      toast({
        title: "Bet Placed",
        description: `₹${betAmount} bet placed on ${prediction} ${targetNumber[0]}`,
        variant: "default",
      });
      
    } catch (error) {
      console.error('Failed to place bet:', error);
      toast({
        title: "Error",
        description: "Failed to place bet",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const rollDice = async () => {
    setIsRolling(true);
    
    // Animation: rapid number changes
    const animationDuration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      if (progress < 1) {
        setCurrentRoll(Math.floor(Math.random() * 100) + 1);
        requestAnimationFrame(animate);
      } else {
        // Animation complete, get final result
        getFinalResult();
      }
    };
    
    requestAnimationFrame(animate);
  };

  const getFinalResult = async () => {
    if (!currentBet) return;
    
    try {
      const result = await api.playDice(currentBet.amount, currentBet.prediction, currentBet.targetNumber);
      
      const diceResult: DiceResult = {
        result: result.result.diceResult,
        prediction: currentBet.prediction,
        targetNumber: currentBet.targetNumber,
        multiplier: result.isWin ? currentBet.multiplier : 0,
        winAmount: result.winAmount,
        timestamp: new Date()
      };
      
      setCurrentRoll(diceResult.result);
      setFinalResult(diceResult);
      setIsRolling(false);
      setGamePhase('result');
      
      // Add to history
      setDiceHistory(prev => [diceResult, ...prev.slice(0, 9)]);
      
      if (result.isWin) {
        setBalance(prev => prev + result.winAmount);
        toast({
          title: "🎉 Winner!",
          description: `You won ₹${result.winAmount} with ${currentBet.multiplier.toFixed(2)}x multiplier!`,
          variant: "default",
        });
      } else {
        toast({
          title: "Better luck next time",
          description: `Roll: ${diceResult.result} • Target: ${currentBet.prediction} ${currentBet.targetNumber}`,
          variant: "destructive",
        });
      }
      
      // Reset for next round after 3 seconds
      setTimeout(() => {
        setGamePhase('betting');
        setCurrentBet(null);
        setFinalResult(null);
        setCurrentRoll(0);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to get dice result:', error);
      setIsRolling(false);
      setGamePhase('betting');
      toast({
        title: "Error",
        description: "Failed to roll dice",
        variant: "destructive",
      });
    }
  };

  const getDiceIcon = (number: number) => {
    const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const IconComponent = diceIcons[Math.floor(number / 17)] || Dice6;
    return <IconComponent className="w-16 h-16 text-blue-500" />;
  };

  const getWinChance = () => {
    const target = targetNumber[0];
    if (prediction === 'over') {
      return 100 - target;
    } else {
      return target;
    }
  };

  const getResultClass = () => {
    if (!finalResult) return 'text-gray-600';
    
    const isWin = finalResult.prediction === 'over' 
      ? finalResult.result > finalResult.targetNumber
      : finalResult.result < finalResult.targetNumber;
    
    return isWin ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-500 bg-clip-text text-transparent">
          Dice - Number Prediction
        </h1>
        <p className="text-gray-600">Roll the dice • Predict over/under • Win with multipliers</p>
      </div>

      {/* Game Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">
                {gamePhase === 'betting' ? 'Place Your Bet' : 
                 gamePhase === 'rolling' ? 'Rolling...' : 'Result'}
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
              <div className="text-2xl font-bold text-blue-600">{targetNumber[0]}</div>
              <div className="text-sm text-gray-600">Target Number</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{prediction.toUpperCase()}</div>
              <div className="text-sm text-gray-600">Prediction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{multiplier.toFixed(2)}x</div>
              <div className="text-sm text-gray-600">Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{getWinChance()}%</div>
              <div className="text-sm text-gray-600">Win Chance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dice Display */}
      <Card>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            {gamePhase === 'betting' && (
              <div className="text-6xl font-bold text-gray-400">?</div>
            )}
            
            {gamePhase === 'rolling' && (
              <div className="space-y-2">
                <div className="text-8xl font-bold text-blue-600 animate-pulse">
                  {currentRoll}
                </div>
                <div className="text-lg text-gray-600">Rolling...</div>
              </div>
            )}
            
            {gamePhase === 'result' && finalResult && (
              <div className="space-y-2">
                <div className={`text-8xl font-bold ${getResultClass()}`}>
                  {finalResult.result}
                </div>
                <div className="text-lg">
                  {finalResult.winAmount > 0 ? (
                    <span className="text-green-600 font-bold">
                      You Won ₹{finalResult.winAmount}!
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold">
                      You Lost ₹{currentBet?.amount}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Target: {finalResult.prediction} {finalResult.targetNumber}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Betting Controls */}
      {gamePhase === 'betting' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bet Amount */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bet Amount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                >
                  -
                </Button>
                <div className="flex-1 text-center px-4 py-2 bg-gray-100 rounded">
                  ₹{betAmount}
                </div>
                <Button
                  variant="outline"
                  size="sm"
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
            </CardContent>
          </Card>

          {/* Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prediction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={prediction === 'over' ? 'default' : 'outline'}
                  onClick={() => setPrediction('over')}
                  className="h-16"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">Over</div>
                    <div className="text-sm opacity-75">{100 - targetNumber[0]}% chance</div>
                  </div>
                </Button>
                <Button
                  variant={prediction === 'under' ? 'default' : 'outline'}
                  onClick={() => setPrediction('under')}
                  className="h-16"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">Under</div>
                    <div className="text-sm opacity-75">{targetNumber[0]}% chance</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Target Number */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Target Number: {targetNumber[0]}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Slider
                  value={targetNumber}
                  onValueChange={setTargetNumber}
                  max={99}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>1</span>
                  <span>50</span>
                  <span>99</span>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <div className="text-center space-y-2">
                    <div className="text-lg font-bold">
                      Potential Win: ₹{Math.floor(betAmount * multiplier)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getWinChance()}% chance to win {multiplier.toFixed(2)}x
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bet Button */}
      {gamePhase === 'betting' && (
        <Card>
          <CardContent className="text-center py-6">
            <Button
              className="w-full md:w-auto px-12 py-4 text-lg bg-blue-600 hover:bg-blue-700"
              onClick={placeBet}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Roll Dice - ₹${betAmount}`}
            </Button>
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
            {diceHistory.map((game, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {game.result}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {game.prediction} {game.targetNumber}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {game.multiplier > 0 ? `${game.multiplier.toFixed(2)}x` : 'LOST'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${game.winAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {game.winAmount > 0 ? '+' : '-'}₹{game.winAmount || 100}
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