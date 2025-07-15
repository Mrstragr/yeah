import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Sword, Shield, Users, TrendingUp, History, Clock, Crown } from 'lucide-react';

interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  value: string;
  numValue: number;
  color: 'red' | 'black';
}

interface GameResult {
  dragonCard: Card;
  tigerCard: Card;
  winner: 'dragon' | 'tiger' | 'tie';
  roundNumber: number;
  timestamp: Date;
}

interface BetData {
  type: 'dragon' | 'tiger' | 'tie';
  amount: number;
  multiplier: number;
}

interface GameRound {
  roundNumber: number;
  timeLeft: number;
  phase: 'betting' | 'dealing' | 'result';
}

export default function ProductionDragonTiger() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Game state
  const [gameRound, setGameRound] = useState<GameRound>({
    roundNumber: 1,
    timeLeft: 30,
    phase: 'betting'
  });
  
  const [balance, setBalance] = useState(0);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [myBets, setMyBets] = useState<BetData[]>([]);
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Betting state
  const [betAmount, setBetAmount] = useState(100);
  const [currentResult, setCurrentResult] = useState<GameResult | null>(null);
  
  // Animation state
  const [isDealing, setIsDealing] = useState(false);
  const [revealedCards, setRevealedCards] = useState<{ dragon?: Card; tiger?: Card }>({});
  
  // Statistics
  const [totalBets, setTotalBets] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [biggestWin, setBiggestWin] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [streakStats, setStreakStats] = useState({
    dragon: 0,
    tiger: 0,
    tie: 0
  });

  // Initialize game
  useEffect(() => {
    loadUserBalance();
    loadGameHistory();
    loadGameStats();
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setGameRound(prev => {
        if (prev.timeLeft <= 1) {
          if (prev.phase === 'betting') {
            return { ...prev, phase: 'dealing', timeLeft: 5 };
          } else if (prev.phase === 'dealing') {
            return { ...prev, phase: 'result', timeLeft: 8 };
          } else {
            return { 
              roundNumber: prev.roundNumber + 1, 
              phase: 'betting', 
              timeLeft: 30 
            };
          }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle phase changes
  useEffect(() => {
    if (gameRound.phase === 'dealing') {
      dealCards();
    } else if (gameRound.phase === 'result') {
      // Reset for next round
      setTimeout(() => {
        setMyBets([]);
        setTotalBetAmount(0);
        setCurrentResult(null);
        setRevealedCards({});
      }, 7000);
    }
  }, [gameRound.phase]);

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
        {
          dragonCard: { suit: '♠', value: 'K', numValue: 13, color: 'black' },
          tigerCard: { suit: '♥', value: 'Q', numValue: 12, color: 'red' },
          winner: 'dragon',
          roundNumber: 245,
          timestamp: new Date()
        },
        {
          dragonCard: { suit: '♦', value: '7', numValue: 7, color: 'red' },
          tigerCard: { suit: '♣', value: '7', numValue: 7, color: 'black' },
          winner: 'tie',
          roundNumber: 244,
          timestamp: new Date()
        },
        {
          dragonCard: { suit: '♥', value: '9', numValue: 9, color: 'red' },
          tigerCard: { suit: '♠', value: 'J', numValue: 11, color: 'black' },
          winner: 'tiger',
          roundNumber: 243,
          timestamp: new Date()
        },
        {
          dragonCard: { suit: '♣', value: 'A', numValue: 1, color: 'black' },
          tigerCard: { suit: '♦', value: '3', numValue: 3, color: 'red' },
          winner: 'tiger',
          roundNumber: 242,
          timestamp: new Date()
        },
        {
          dragonCard: { suit: '♠', value: '10', numValue: 10, color: 'black' },
          tigerCard: { suit: '♥', value: '8', numValue: 8, color: 'red' },
          winner: 'dragon',
          roundNumber: 241,
          timestamp: new Date()
        },
      ];
      setGameHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load game history:', error);
    }
  }, []);

  const loadGameStats = useCallback(async () => {
    try {
      setTotalBets(156);
      setTotalWins(89);
      setBiggestWin(3450);
      setWinRate(57.1);
      setStreakStats({ dragon: 3, tiger: 1, tie: 0 });
    } catch (error) {
      console.error('Failed to load game stats:', error);
    }
  }, []);

  const generateCard = (): Card => {
    const suits: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const numValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const valueIndex = Math.floor(Math.random() * values.length);
    const value = values[valueIndex];
    const numValue = numValues[valueIndex];
    const color = suit === '♥' || suit === '♦' ? 'red' : 'black';
    
    return { suit, value, numValue, color };
  };

  const dealCards = async () => {
    setIsDealing(true);
    setRevealedCards({});
    
    // Simulate dealing animation
    setTimeout(() => {
      const dragonCard = generateCard();
      setRevealedCards(prev => ({ ...prev, dragon: dragonCard }));
    }, 1000);
    
    setTimeout(() => {
      const tigerCard = generateCard();
      setRevealedCards(prev => ({ ...prev, tiger: tigerCard }));
    }, 2000);
    
    setTimeout(() => {
      processGameResult();
    }, 3000);
  };

  const processGameResult = async () => {
    if (!revealedCards.dragon || !revealedCards.tiger) return;
    
    const dragonCard = revealedCards.dragon;
    const tigerCard = revealedCards.tiger;
    
    let winner: 'dragon' | 'tiger' | 'tie';
    if (dragonCard.numValue > tigerCard.numValue) {
      winner = 'dragon';
    } else if (tigerCard.numValue > dragonCard.numValue) {
      winner = 'tiger';
    } else {
      winner = 'tie';
    }
    
    const result: GameResult = {
      dragonCard,
      tigerCard,
      winner,
      roundNumber: gameRound.roundNumber,
      timestamp: new Date()
    };
    
    setCurrentResult(result);
    setGameHistory(prev => [result, ...prev.slice(0, 9)]);
    
    // Process bets
    let totalWinAmount = 0;
    for (const bet of myBets) {
      try {
        const gameResult = await api.playDragonTiger(bet.amount, bet.type);
        if (gameResult.isWin) {
          totalWinAmount += gameResult.winAmount;
        }
      } catch (error) {
        console.error('Failed to process bet:', error);
      }
    }
    
    if (totalWinAmount > 0) {
      setBalance(prev => prev + totalWinAmount);
      toast({
        title: "🎉 Winner!",
        description: `You won ₹${totalWinAmount} total!`,
        variant: "default",
      });
    } else if (myBets.length > 0) {
      toast({
        title: "Better luck next time",
        description: `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins!`,
        variant: "destructive",
      });
    }
    
    setIsDealing(false);
  };

  const placeBet = async (type: 'dragon' | 'tiger' | 'tie') => {
    if (gameRound.phase !== 'betting') {
      toast({
        title: "Betting Closed",
        description: "Cannot place bet during dealing",
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

    let multiplier = 1;
    if (type === 'dragon' || type === 'tiger') {
      multiplier = 1.95; // 95% return (5% house edge)
    } else if (type === 'tie') {
      multiplier = 8.0; // 8:1 payout for tie
    }

    const newBet: BetData = {
      type,
      amount: betAmount,
      multiplier
    };

    setMyBets(prev => [...prev, newBet]);
    setTotalBetAmount(prev => prev + betAmount);
    setBalance(prev => prev - betAmount);

    toast({
      title: "Bet Placed",
      description: `₹${betAmount} bet placed on ${type}`,
      variant: "default",
    });
  };

  const renderCard = (card: Card | undefined, label: string) => {
    if (!card) {
      return (
        <div className="w-24 h-36 bg-blue-600 rounded-lg flex items-center justify-center">
          <div className="text-white text-xs">CARD</div>
        </div>
      );
    }

    return (
      <div className="w-24 h-36 bg-white rounded-lg border-2 border-gray-300 flex flex-col items-center justify-center shadow-lg">
        <div className={`text-2xl font-bold ${card.color === 'red' ? 'text-red-500' : 'text-black'}`}>
          {card.value}
        </div>
        <div className={`text-3xl ${card.color === 'red' ? 'text-red-500' : 'text-black'}`}>
          {card.suit}
        </div>
      </div>
    );
  };

  const getPhaseColor = () => {
    switch (gameRound.phase) {
      case 'betting': return 'bg-green-500';
      case 'dealing': return 'bg-yellow-500';
      case 'result': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPhaseText = () => {
    switch (gameRound.phase) {
      case 'betting': return 'Betting Time';
      case 'dealing': return 'Dealing Cards';
      case 'result': return 'Round Complete';
      default: return 'Waiting...';
    }
  };

  const getWinnerIcon = (winner: string) => {
    switch (winner) {
      case 'dragon': return <Sword className="w-4 h-4 text-red-500" />;
      case 'tiger': return <Shield className="w-4 h-4 text-orange-500" />;
      case 'tie': return <Users className="w-4 h-4 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Dragon Tiger - Live Card Game
        </h1>
        <p className="text-gray-600">Classic card battle • Simple rules • Instant results</p>
      </div>

      {/* Game Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <CardTitle className="text-lg">Round #{gameRound.roundNumber}</CardTitle>
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
                {String(gameRound.timeLeft).padStart(2, '0')}s
              </div>
            </div>
            <Progress value={(30 - gameRound.timeLeft) / 30 * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Game Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-center">Battle Arena</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8 py-8">
            {/* Dragon Side */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-red-600">
                <Sword className="w-6 h-6" />
                <span className="text-2xl font-bold">DRAGON</span>
              </div>
              {renderCard(revealedCards.dragon, 'Dragon')}
            </div>

            {/* VS */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-400">VS</div>
            </div>

            {/* Tiger Side */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-orange-600">
                <Shield className="w-6 h-6" />
                <span className="text-2xl font-bold">TIGER</span>
              </div>
              {renderCard(revealedCards.tiger, 'Tiger')}
            </div>
          </div>

          {/* Result Display */}
          {currentResult && gameRound.phase === 'result' && (
            <div className="text-center py-4 border-t">
              <div className="text-2xl font-bold text-blue-600">
                {currentResult.winner === 'tie' ? 'TIE!' : 
                 `${currentResult.winner.toUpperCase()} WINS!`}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Dragon: {currentResult.dragonCard.value}{currentResult.dragonCard.suit} • 
                Tiger: {currentResult.tigerCard.value}{currentResult.tigerCard.suit}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Betting Section */}
      {gameRound.phase === 'betting' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dragon Bet */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="text-center py-6" onClick={() => placeBet('dragon')}>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <Sword className="w-8 h-8" />
                  <span className="text-2xl font-bold">DRAGON</span>
                </div>
                <div className="text-lg font-bold">1.95x</div>
                <div className="text-sm text-gray-600">Higher card wins</div>
              </div>
            </CardContent>
          </Card>

          {/* Tie Bet */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="text-center py-6" onClick={() => placeBet('tie')}>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-purple-600">
                  <Users className="w-8 h-8" />
                  <span className="text-2xl font-bold">TIE</span>
                </div>
                <div className="text-lg font-bold">8.0x</div>
                <div className="text-sm text-gray-600">Same card value</div>
              </div>
            </CardContent>
          </Card>

          {/* Tiger Bet */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="text-center py-6" onClick={() => placeBet('tiger')}>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-orange-600">
                  <Shield className="w-8 h-8" />
                  <span className="text-2xl font-bold">TIGER</span>
                </div>
                <div className="text-lg font-bold">1.95x</div>
                <div className="text-sm text-gray-600">Higher card wins</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bet Amount Controls */}
      {gameRound.phase === 'betting' && (
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
                    {getWinnerIcon(bet.type)}
                    <span className="font-medium">{bet.type.toUpperCase()}</span>
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
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">#{result.roundNumber}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{result.dragonCard.value}{result.dragonCard.suit}</span>
                    <span className="text-xs text-gray-500">vs</span>
                    <span className="text-sm">{result.tigerCard.value}{result.tigerCard.suit}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getWinnerIcon(result.winner)}
                    <Badge variant="outline" className="text-xs">
                      {result.winner.toUpperCase()}
                    </Badge>
                  </div>
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