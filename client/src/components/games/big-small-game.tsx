import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, TrendingUp, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

interface BigSmallGameProps {
  game: any;
  user: any;
  onBack: () => void;
}

export function BigSmallGame({ game, user, onBack }: BigSmallGameProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBet, setSelectedBet] = useState<'big' | 'small' | null>(null);
  const [dice, setDice] = useState([1, 1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

  const rollDice = () => {
    if (!selectedBet || betAmount < 10) return;

    setIsRolling(true);
    setResult(null);

    // Animate dice rolling
    const rollInterval = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      
      const finalDice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ];
      setDice(finalDice);
      
      const sum = finalDice.reduce((a, b) => a + b, 0);
      const isBig = sum >= 11 && sum <= 17;
      const isSmall = sum >= 4 && sum <= 10;
      
      const won = (selectedBet === 'big' && isBig) || (selectedBet === 'small' && isSmall);
      setResult(won ? 'win' : 'lose');
      
      const newGame = {
        dice: finalDice,
        sum,
        bet: selectedBet,
        amount: betAmount,
        result: won ? 'win' : 'lose',
        payout: won ? betAmount * 1.95 : 0,
        timestamp: new Date()
      };
      
      setGameHistory(prev => [newGame, ...prev.slice(0, 9)]);
      setIsRolling(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">🎲 Big Small</h1>
            <p className="text-gray-300 text-sm">Classic dice betting game</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Balance</p>
            <p className="text-lg font-bold text-green-400">₹{parseFloat(user?.walletBalance || '0').toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dice Display */}
            <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-white text-center">Roll the Dice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center space-x-4 mb-6">
                  {dice.map((value, index) => {
                    const DiceIcon = diceIcons[value - 1];
                    return (
                      <motion.div
                        key={index}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg flex items-center justify-center shadow-lg"
                        animate={isRolling ? { rotateX: 360, rotateY: 360 } : {}}
                        transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
                      >
                        <DiceIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
                      </motion.div>
                    );
                  })}
                </div>

                <div className="text-center mb-6">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    Sum: {dice.reduce((a, b) => a + b, 0)}
                  </div>
                  {result && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`text-xl font-bold ${result === 'win' ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {result === 'win' ? `You Won ₹${(betAmount * 1.95).toLocaleString()}!` : 'You Lost!'}
                    </motion.div>
                  )}
                </div>

                {/* Betting Options */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    onClick={() => setSelectedBet('small')}
                    variant={selectedBet === 'small' ? 'default' : 'outline'}
                    className={`py-8 text-lg font-bold ${
                      selectedBet === 'small'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'border-blue-500 text-blue-400 hover:bg-blue-500/20'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">SMALL</div>
                      <div className="text-sm opacity-80">4-10</div>
                      <div className="text-xs opacity-60">1.95x payout</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => setSelectedBet('big')}
                    variant={selectedBet === 'big' ? 'default' : 'outline'}
                    className={`py-8 text-lg font-bold ${
                      selectedBet === 'big'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'border-red-500 text-red-400 hover:bg-red-500/20'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">BIG</div>
                      <div className="text-sm opacity-80">11-17</div>
                      <div className="text-xs opacity-60">1.95x payout</div>
                    </div>
                  </Button>
                </div>

                {/* Bet Amount */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Bet Amount (₹10 - ₹{Math.min(50000, parseFloat(user?.walletBalance || '0'))})
                    </label>
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
                      className="bg-gray-700 border-gray-600 text-white"
                      min={10}
                      max={Math.min(50000, parseFloat(user?.walletBalance || '0'))}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[100, 500, 1000, 5000].map((amount) => (
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
                    onClick={rollDice}
                    disabled={!selectedBet || isRolling || betAmount < 10}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-4 text-lg font-bold"
                  >
                    {isRolling ? 'Rolling...' : `Roll Dice (₹${betAmount.toLocaleString()})`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Statistics */}
          <div className="space-y-6">
            {/* Rules */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-300">
                <div>• SMALL: Dice sum 4-10</div>
                <div>• BIG: Dice sum 11-17</div>
                <div>• Triple numbers (1,1,1 to 6,6,6) always lose</div>
                <div>• Winning bets pay 1.95x</div>
                <div>• House edge: 2.78%</div>
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
                        <div className="flex items-center space-x-2">
                          <div className="text-xs text-gray-400">
                            {game.dice.join('-')} = {game.sum}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded ${
                            game.bet === 'big' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {game.bet.toUpperCase()}
                          </div>
                        </div>
                        <div className={`text-xs font-bold ${
                          game.result === 'win' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {game.result === 'win' ? `+₹${game.payout}` : `-₹${game.amount}`}
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