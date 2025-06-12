import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, TrendingUp, Star, Zap } from "lucide-react";

interface LuckyNumbersGameProps {
  game: any;
  user: any;
  onBack: () => void;
}

export function LuckyNumbersGame({ game, user, onBack }: LuckyNumbersGameProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<{ matches: number; payout: number } | null>(null);
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  const numbers = Array.from({ length: 80 }, (_, i) => i + 1);

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 10) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const getPayoutMultiplier = (spots: number, matches: number): number => {
    const payoutTable: { [key: number]: { [key: number]: number } } = {
      1: { 1: 3 },
      2: { 2: 12 },
      3: { 2: 2, 3: 46 },
      4: { 2: 1, 3: 5, 4: 91 },
      5: { 3: 2, 4: 12, 5: 810 },
      6: { 3: 1, 4: 3, 5: 95, 6: 1600 },
      7: { 4: 2, 5: 20, 6: 400, 7: 7000 },
      8: { 5: 9, 6: 98, 7: 1652, 8: 10000 },
      9: { 5: 5, 6: 42, 7: 335, 8: 4700, 9: 10000 },
      10: { 5: 2, 6: 18, 7: 180, 8: 1000, 9: 4500, 10: 10000 }
    };
    
    return payoutTable[spots]?.[matches] || 0;
  };

  const drawNumbers = () => {
    if (selectedNumbers.length === 0 || betAmount < 10) return;

    setIsDrawing(true);
    setResult(null);
    setDrawnNumbers([]);

    // Simulate number drawing animation
    let currentDraw: number[] = [];
    const totalNumbers = 20;
    
    const drawInterval = setInterval(() => {
      if (currentDraw.length < totalNumbers) {
        let newNumber;
        do {
          newNumber = Math.floor(Math.random() * 80) + 1;
        } while (currentDraw.includes(newNumber));
        
        currentDraw.push(newNumber);
        setDrawnNumbers([...currentDraw]);
      } else {
        clearInterval(drawInterval);
        
        // Calculate results
        const matches = selectedNumbers.filter(num => currentDraw.includes(num)).length;
        const multiplier = getPayoutMultiplier(selectedNumbers.length, matches);
        const payout = betAmount * multiplier;
        
        setResult({ matches, payout });
        setIsDrawing(false);
        
        const newGame = {
          selectedNumbers: [...selectedNumbers],
          drawnNumbers: [...currentDraw],
          matches,
          spots: selectedNumbers.length,
          bet: betAmount,
          payout,
          timestamp: new Date()
        };
        
        setGameHistory(prev => [newGame, ...prev.slice(0, 9)]);
      }
    }, 200);
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
  };

  const quickPick = () => {
    const numbers = [];
    const spots = Math.floor(Math.random() * 6) + 5; // Pick 5-10 numbers
    
    while (numbers.length < spots) {
      const num = Math.floor(Math.random() * 80) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    
    setSelectedNumbers(numbers.sort((a, b) => a - b));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">🎱 Lucky Numbers</h1>
            <p className="text-gray-300 text-sm">Pick your lucky numbers and win big</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Balance</p>
            <p className="text-lg font-bold text-green-400">₹{parseFloat(user?.walletBalance || '0').toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Number Grid */}
            <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white text-center flex items-center justify-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-400" />
                  Pick Your Numbers (1-80)
                  <span className="ml-4 text-sm font-normal">
                    Selected: {selectedNumbers.length}/10
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1 sm:gap-2 mb-6">
                  {numbers.map(num => {
                    const isSelected = selectedNumbers.includes(num);
                    const isDrawn = drawnNumbers.includes(num);
                    const isMatch = isSelected && isDrawn;
                    
                    return (
                      <motion.button
                        key={num}
                        onClick={() => toggleNumber(num)}
                        disabled={isDrawing}
                        className={`
                          w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-bold transition-all
                          ${isMatch 
                            ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-black shadow-lg scale-110' 
                            : isSelected 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-md' 
                            : isDrawn 
                            ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }
                        `}
                        whileHover={{ scale: isDrawing ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {num}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <Button
                    onClick={quickPick}
                    disabled={isDrawing}
                    variant="outline"
                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Quick Pick
                  </Button>
                  <Button
                    onClick={clearSelection}
                    disabled={isDrawing || selectedNumbers.length === 0}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/20"
                  >
                    Clear All
                  </Button>
                </div>

                {/* Drawn Numbers Display */}
                {drawnNumbers.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-lg font-bold mb-3 text-center">
                      Drawn Numbers ({drawnNumbers.length}/20)
                    </h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {drawnNumbers.map((num, index) => (
                        <motion.div
                          key={num}
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${selectedNumbers.includes(num) 
                              ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-black' 
                              : 'bg-gradient-to-br from-gray-600 to-gray-700 text-white'
                            }
                          `}
                        >
                          {num}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Result Display */}
                {result && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center mb-6"
                  >
                    <div className="text-2xl font-bold text-white mb-2">
                      {result.matches} Match{result.matches !== 1 ? 'es' : ''}!
                    </div>
                    {result.payout > 0 && (
                      <div className="text-3xl font-bold text-yellow-400">
                        Won ₹{result.payout.toLocaleString()}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Betting Controls */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Bet Amount (₹10 - ₹{Math.min(5000, parseFloat(user?.walletBalance || '0'))})
                    </label>
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
                      className="bg-gray-700 border-gray-600 text-white"
                      min={10}
                      max={Math.min(5000, parseFloat(user?.walletBalance || '0'))}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[100, 500, 1000, 2500].map((amount) => (
                      <Button
                        key={amount}
                        onClick={() => setBetAmount(amount)}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs py-2"
                      >
                        ₹{amount}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={drawNumbers}
                    disabled={selectedNumbers.length === 0 || isDrawing || betAmount < 10}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 text-lg font-bold"
                  >
                    {isDrawing ? 'Drawing Numbers...' : `Draw Numbers (₹${betAmount.toLocaleString()})`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payout Table */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Payouts
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                <div className="space-y-1 text-gray-300">
                  <div className="font-bold text-white mb-2">Spots: Matches = Payout</div>
                  <div>1: 1 = 3x</div>
                  <div>2: 2 = 12x</div>
                  <div>3: 2=2x, 3=46x</div>
                  <div>4: 2=1x, 3=5x, 4=91x</div>
                  <div>5: 3=2x, 4=12x, 5=810x</div>
                  <div>6: 3=1x, 4=3x, 5=95x, 6=1600x</div>
                  <div>7: 4=2x, 5=20x, 6=400x, 7=7000x</div>
                  <div>8: 5=9x, 6=98x, 7=1652x, 8=10000x</div>
                  <div>9: 5=5x, 6=42x, 7=335x, 8=4700x, 9=10000x</div>
                  <div>10: 5=2x, 6=18x, 7=180x, 8=1000x, 9=4500x, 10=10000x</div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Games */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                  Recent Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {gameHistory.length > 0 ? (
                    gameHistory.map((game, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                        <div className="text-xs text-gray-400">
                          {game.spots} spots, {game.matches} matches
                        </div>
                        <div className={`text-xs font-bold ${
                          game.payout > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {game.payout > 0 ? `+₹${game.payout}` : `-₹${game.bet}`}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No games played yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}