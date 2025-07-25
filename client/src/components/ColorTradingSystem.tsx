import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Timer, BarChart3, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onBack: () => void;
}

interface Trade {
  id: string;
  color: 'green' | 'red' | 'blue' | 'yellow';
  amount: number;
  multiplier: number;
  timestamp: Date;
  status: 'pending' | 'won' | 'lost';
}

interface ColorPrice {
  color: 'green' | 'red' | 'blue' | 'yellow';
  price: number;
  change: number;
  volume: number;
}

export default function ColorTradingSystem({ onBack }: Props) {
  const [balance, setBalance] = useState(12580.45);
  const [tradeAmount, setTradeAmount] = useState(500);
  const [activeTab, setActiveTab] = useState<'trade' | 'portfolio' | 'history'>('trade');
  const [timeLeft, setTimeLeft] = useState(60);
  const [roundNumber, setRoundNumber] = useState(1);
  const [activeTrades, setActiveTrades] = useState<Trade[]>([]);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const { toast } = useToast();

  const [colorPrices, setColorPrices] = useState<ColorPrice[]>([
    { color: 'green', price: 1.85, change: 0.12, volume: 45000 },
    { color: 'red', price: 2.34, change: -0.08, volume: 38000 },
    { color: 'blue', price: 3.21, change: 0.25, volume: 29000 },
    { color: 'yellow', price: 4.67, change: -0.15, volume: 22000 }
  ]);

  // Update prices every few seconds
  useEffect(() => {
    const priceInterval = setInterval(() => {
      setColorPrices(prev => prev.map(color => ({
        ...color,
        price: Math.max(0.1, color.price + (Math.random() - 0.5) * 0.5),
        change: (Math.random() - 0.5) * 0.3,
        volume: Math.floor(Math.random() * 20000) + 20000
      })));
    }, 3000);

    return () => clearInterval(priceInterval);
  }, []);

  // Trading countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      processTradeResults();
    }
  }, [timeLeft]);

  const placeTrade = (color: 'green' | 'red' | 'blue' | 'yellow') => {
    if (tradeAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "Not enough funds for this trade",
        variant: "destructive",
      });
      return;
    }

    const colorData = colorPrices.find(c => c.color === color);
    if (!colorData) return;

    const newTrade: Trade = {
      id: Math.random().toString(36).substr(2, 9),
      color,
      amount: tradeAmount,
      multiplier: colorData.price,
      timestamp: new Date(),
      status: 'pending'
    };

    setActiveTrades(prev => [...prev, newTrade]);
    setBalance(prev => prev - tradeAmount);
    
    toast({
      title: "Trade Placed",
      description: `₹${tradeAmount} on ${color.toUpperCase()} at ${colorData.price.toFixed(2)}x`,
    });
  };

  const processTradeResults = () => {
    // Determine winning color based on random selection with weighted probability
    const weights = colorPrices.map(c => c.volume);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * totalWeight;
    
    let currentWeight = 0;
    let winningColor: string = 'green';
    
    for (let i = 0; i < colorPrices.length; i++) {
      currentWeight += weights[i];
      if (random <= currentWeight) {
        winningColor = colorPrices[i].color;
        break;
      }
    }

    let totalWinnings = 0;
    const updatedTrades = activeTrades.map(trade => {
      if (trade.color === winningColor) {
        const winAmount = trade.amount * trade.multiplier;
        totalWinnings += winAmount;
        return { ...trade, status: 'won' as const };
      } else {
        return { ...trade, status: 'lost' as const };
      }
    });

    setBalance(prev => prev + totalWinnings);
    setTradeHistory(prev => [...prev, ...updatedTrades]);
    setActiveTrades([]);

    if (totalWinnings > 0) {
      toast({
        title: "🎉 Trades Won!",
        description: `${winningColor.toUpperCase()} color won! You earned ₹${totalWinnings.toFixed(2)}`,
      });
    } else if (activeTrades.length > 0) {
      toast({
        title: "Round Complete",
        description: `${winningColor.toUpperCase()} color won this round`,
        variant: "destructive",
      });
    }

    // Reset for next round
    setTimeLeft(60);
    setRoundNumber(prev => prev + 1);
  };

  const getColorStyle = (color: string) => {
    const styles = {
      green: 'from-green-500 to-emerald-600',
      red: 'from-red-500 to-rose-600',
      blue: 'from-blue-500 to-indigo-600',
      yellow: 'from-yellow-500 to-orange-600'
    };
    return styles[color as keyof typeof styles];
  };

  const getColorIcon = (color: string) => {
    const icons = {
      green: '🟢',
      red: '🔴',
      blue: '🔵',
      yellow: '🟡'
    };
    return icons[color as keyof typeof icons];
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 min-h-screen text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold">Color Trading</h1>
          <div className="text-sm opacity-90">Balance: ₹{balance.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs">Round</div>
          <div className="font-bold">{roundNumber}</div>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-black/30 p-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Timer className="w-4 h-4" />
          <div className="font-bold">Next Round: {timeLeft}s</div>
        </div>
        <div className="text-xs text-gray-300 mt-1">
          Place your trades before time runs out
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-black/30">
        {[
          { key: 'trade', label: 'Trade', icon: Target },
          { key: 'portfolio', label: 'Portfolio', icon: BarChart3 },
          { key: 'history', label: 'History', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-3 px-2 text-center transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-500 text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4 mx-auto mb-1" />
            <div className="text-xs font-bold">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'trade' && (
            <motion.div
              key="trade"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Trade Amount Selection */}
              <div className="bg-black/30 rounded-xl p-4">
                <div className="text-sm mb-3">Trade Amount:</div>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 2500].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setTradeAmount(amount)}
                      className={`py-2 rounded-lg font-bold text-sm ${
                        tradeAmount === amount 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Trading Options */}
              <div className="space-y-3">
                {colorPrices.map(colorData => (
                  <motion.div
                    key={colorData.color}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-gradient-to-r ${getColorStyle(colorData.color)} rounded-xl p-4 relative overflow-hidden`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-4 translate-x-4"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-4 -translate-x-4"></div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-3xl mr-3">{getColorIcon(colorData.color)}</div>
                        <div>
                          <div className="text-xl font-bold capitalize">{colorData.color}</div>
                          <div className="text-sm opacity-90">
                            Volume: {(colorData.volume / 1000).toFixed(1)}K
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {colorData.price.toFixed(2)}x
                        </div>
                        <div className={`text-sm flex items-center ${
                          colorData.change >= 0 ? 'text-green-200' : 'text-red-200'
                        }`}>
                          {colorData.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          {colorData.change >= 0 ? '+' : ''}{colorData.change.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => placeTrade(colorData.color)}
                      disabled={timeLeft < 5}
                      className="w-full mt-3 bg-white/20 hover:bg-white/30 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                    >
                      Trade ₹{tradeAmount}
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Active Trades */}
              {activeTrades.length > 0 && (
                <div className="bg-black/30 rounded-xl p-4">
                  <h3 className="font-bold mb-3">Active Trades</h3>
                  {activeTrades.map(trade => (
                    <div key={trade.id} className="flex items-center justify-between py-2 border-b border-gray-600 last:border-0">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">{getColorIcon(trade.color)}</div>
                        <div>
                          <div className="font-bold capitalize">{trade.color}</div>
                          <div className="text-xs text-gray-300">₹{trade.amount}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{trade.multiplier.toFixed(2)}x</div>
                        <div className="text-xs text-yellow-300">Pending</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Trading Portfolio</h2>
                <div className="text-gray-300">Track your trading performance</div>
              </div>

              {/* Portfolio Stats */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold mb-2">₹{balance.toFixed(2)}</div>
                <div className="text-green-200 mb-4">Current Balance</div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{activeTrades.length}</div>
                    <div className="text-xs text-gray-200">Active Trades</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{tradeHistory.length}</div>
                    <div className="text-xs text-gray-200">Total Trades</div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-bold mb-3">Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Win Rate</span>
                    <span className="text-green-400 font-bold">
                      {tradeHistory.length > 0 
                        ? `${((tradeHistory.filter(t => t.status === 'won').length / tradeHistory.length) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Invested</span>
                    <span className="font-bold">
                      ₹{tradeHistory.reduce((sum, trade) => sum + trade.amount, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Winnings</span>
                    <span className="text-green-400 font-bold">
                      ₹{tradeHistory
                        .filter(t => t.status === 'won')
                        .reduce((sum, trade) => sum + (trade.amount * trade.multiplier), 0)
                        .toFixed(2)
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Color Performance */}
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-bold mb-3">Color Performance</h3>
                {['green', 'red', 'blue', 'yellow'].map(color => {
                  const colorTrades = tradeHistory.filter(t => t.color === color);
                  const wins = colorTrades.filter(t => t.status === 'won').length;
                  const winRate = colorTrades.length > 0 ? (wins / colorTrades.length) * 100 : 0;
                  
                  return (
                    <div key={color} className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <div className="text-lg mr-2">{getColorIcon(color)}</div>
                        <div className="capitalize">{color}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{colorTrades.length} trades</div>
                        <div className="text-xs text-gray-300">{winRate.toFixed(1)}% win rate</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Trade History</h2>
                <div className="text-gray-300">Review your recent trades</div>
              </div>

              {tradeHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No trades yet. Start trading to see your history!
                </div>
              ) : (
                <div className="space-y-3">
                  {tradeHistory.slice(-10).reverse().map(trade => (
                    <div key={trade.id} className="bg-black/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="text-lg mr-2">{getColorIcon(trade.color)}</div>
                          <div>
                            <div className="font-bold capitalize">{trade.color}</div>
                            <div className="text-xs text-gray-300">
                              {trade.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            trade.status === 'won' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {trade.status === 'won' ? 'WON' : 'LOST'}
                          </div>
                          <div className="text-xs text-gray-300">
                            {trade.multiplier.toFixed(2)}x
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Invested: ₹{trade.amount}</span>
                        <span className={trade.status === 'won' ? 'text-green-400' : 'text-red-400'}>
                          {trade.status === 'won' 
                            ? `+₹${(trade.amount * trade.multiplier - trade.amount).toFixed(2)}`
                            : `-₹${trade.amount}`
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}