import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Star, 
  Coins,
  TrendingUp,
  Target,
  Zap,
  Crown
} from "lucide-react";

interface SlotMachine {
  id: number;
  name: string;
  theme: string;
  minBet: number;
  maxBet: number;
  jackpot: string;
  rtp: number;
  paylines: number;
  reels: number;
  volatility: "low" | "medium" | "high";
  bonus: boolean;
  freeSpins: boolean;
  multiplier: number;
  image: string;
  players: number;
}

const slotMachines: SlotMachine[] = [
  {
    id: 1,
    name: "Bollywood Riches",
    theme: "Indian Cinema",
    minBet: 1,
    maxBet: 500,
    jackpot: "₹12,45,000",
    rtp: 96.5,
    paylines: 25,
    reels: 5,
    volatility: "medium",
    bonus: true,
    freeSpins: true,
    multiplier: 10,
    image: "🎬",
    players: 1247
  },
  {
    id: 2,
    name: "Maharaja's Gold",
    theme: "Royal Palace",
    minBet: 2,
    maxBet: 1000,
    jackpot: "₹25,67,890",
    rtp: 97.2,
    paylines: 50,
    reels: 5,
    volatility: "high",
    bonus: true,
    freeSpins: true,
    multiplier: 25,
    image: "👑",
    players: 892
  },
  {
    id: 3,
    name: "Temple Fortune",
    theme: "Ancient Temple",
    minBet: 1,
    maxBet: 250,
    jackpot: "₹8,90,450",
    rtp: 95.8,
    paylines: 15,
    reels: 3,
    volatility: "low",
    bonus: false,
    freeSpins: true,
    multiplier: 5,
    image: "🕉️",
    players: 654
  },
  {
    id: 4,
    name: "Cricket Champions",
    theme: "Sports",
    minBet: 5,
    maxBet: 2000,
    jackpot: "₹45,23,100",
    rtp: 96.8,
    paylines: 40,
    reels: 5,
    volatility: "high",
    bonus: true,
    freeSpins: true,
    multiplier: 50,
    image: "🏏",
    players: 432
  }
];

const symbols = ["🍒", "🍋", "🍊", "🍇", "🔔", "⭐", "💎", "👑"];

interface SpinResult {
  reels: string[][];
  winLines: number[];
  payout: number;
  isJackpot: boolean;
}

export function SlotMachines() {
  const [selectedSlot, setSelectedSlot] = useState<SlotMachine | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(5000);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState<string[][]>([]);
  const [lastWin, setLastWin] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [spinCount, setSpinCount] = useState(0);

  useEffect(() => {
    if (selectedSlot) {
      initializeReels();
    }
  }, [selectedSlot]);

  const initializeReels = () => {
    if (!selectedSlot) return;
    const newReels = Array(selectedSlot.reels).fill(null).map(() =>
      Array(3).fill(null).map(() => symbols[Math.floor(Math.random() * symbols.length)])
    );
    setReels(newReels);
  };

  const spin = async () => {
    if (!selectedSlot || isSpinning || balance < betAmount) return;

    setIsSpinning(true);
    setBalance(prev => prev - betAmount);
    setSpinCount(prev => prev + 1);

    // Animate spinning
    const spinDuration = 2000;
    const intervals: NodeJS.Timeout[] = [];

    // Spin each reel with different timings
    for (let i = 0; i < selectedSlot.reels; i++) {
      const interval = setInterval(() => {
        setReels(prev => {
          const newReels = [...prev];
          newReels[i] = Array(3).fill(null).map(() => 
            symbols[Math.floor(Math.random() * symbols.length)]
          );
          return newReels;
        });
      }, 100);
      intervals.push(interval);
    }

    // Stop reels one by one
    setTimeout(() => {
      intervals.forEach((interval, index) => {
        setTimeout(() => {
          clearInterval(interval);
          if (index === intervals.length - 1) {
            // Final result
            const result = calculateWin();
            setLastWin(result.payout);
            setBalance(prev => prev + result.payout);
            setIsSpinning(false);
            
            if (result.payout > 0 && soundEnabled) {
              // Play win sound effect
              console.log("Win sound!");
            }
          }
        }, index * 300);
      });
    }, spinDuration - 1000);
  };

  const calculateWin = (): SpinResult => {
    if (!selectedSlot || reels.length === 0) {
      return { reels: [], winLines: [], payout: 0, isJackpot: false };
    }

    let payout = 0;
    const winLines: number[] = [];

    // Simple win calculation - 3 in a row horizontally
    for (let row = 0; row < 3; row++) {
      const line = reels.map(reel => reel[row]);
      if (line.every(symbol => symbol === line[0])) {
        winLines.push(row);
        const multiplier = getSymbolMultiplier(line[0]);
        payout += betAmount * multiplier;
      }
    }

    // Jackpot check (all reels same symbol)
    const isJackpot = reels.every(reel => 
      reel.every(symbol => symbol === reels[0][0])
    );

    if (isJackpot) {
      payout = parseInt(selectedSlot.jackpot.replace('₹', '').replace(',', ''));
    }

    return { reels, winLines, payout, isJackpot };
  };

  const getSymbolMultiplier = (symbol: string): number => {
    const multipliers: { [key: string]: number } = {
      "🍒": 2,
      "🍋": 3,
      "🍊": 5,
      "🍇": 8,
      "🔔": 10,
      "⭐": 15,
      "💎": 25,
      "👑": 50
    };
    return multipliers[symbol] || 1;
  };

  const maxBet = () => {
    if (selectedSlot) {
      setBetAmount(Math.min(selectedSlot.maxBet, balance));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-casino font-bold text-casino-gold">
            🎰 Slot Machines
          </h2>
          <p className="text-sm text-casino-text-muted">
            Spin the reels and win big jackpots
          </p>
        </div>
        <Badge className="bg-casino-purple text-white">
          {slotMachines.length} Games Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slot Games List */}
        <div className="lg:col-span-2">
          {!selectedSlot ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slotMachines.map((slot) => (
                <Card key={slot.id} className="game-card cursor-pointer" onClick={() => setSelectedSlot(slot)}>
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{slot.image}</div>
                      <h3 className="font-casino font-bold text-white text-lg">{slot.name}</h3>
                      <p className="text-sm text-casino-text-muted">{slot.theme}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-casino-text-muted">Jackpot:</span>
                        <span className="text-casino-gold font-semibold">{slot.jackpot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-casino-text-muted">RTP:</span>
                        <span className="text-casino-green">{slot.rtp}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-casino-text-muted">Bet Range:</span>
                        <span className="text-white">₹{slot.minBet} - ₹{slot.maxBet}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-casino-text-muted">Paylines:</span>
                        <span className="text-casino-blue">{slot.paylines}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      <Badge variant="outline" className={`text-xs ${
                        slot.volatility === 'low' ? 'border-casino-green text-casino-green' :
                        slot.volatility === 'medium' ? 'border-casino-orange text-casino-orange' :
                        'border-casino-red text-casino-red'
                      }`}>
                        {slot.volatility.toUpperCase()}
                      </Badge>
                      {slot.bonus && (
                        <Badge variant="outline" className="text-xs border-casino-purple text-casino-purple">
                          BONUS
                        </Badge>
                      )}
                      {slot.freeSpins && (
                        <Badge variant="outline" className="text-xs border-casino-blue text-casino-blue">
                          FREE SPINS
                        </Badge>
                      )}
                    </div>

                    <Button className="btn-casino-primary w-full mt-4">
                      <Play className="w-4 h-4 mr-2" />
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Slot Machine Game Interface */
            <Card className="casino-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-casino font-bold text-casino-gold text-xl">
                      {selectedSlot.image} {selectedSlot.name}
                    </h3>
                    <p className="text-casino-text-muted">{selectedSlot.theme}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedSlot(null)}
                    className="text-casino-text-muted hover:text-casino-gold"
                  >
                    ← Back
                  </Button>
                </div>

                {/* Slot Machine Reels */}
                <div className="bg-casino-secondary rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {reels.map((reel, reelIndex) => (
                      <div key={reelIndex} className="space-y-2">
                        {reel.map((symbol, symbolIndex) => (
                          <div 
                            key={symbolIndex}
                            className={`w-16 h-16 bg-casino-accent rounded-lg flex items-center justify-center text-2xl transition-all duration-200 ${
                              isSpinning ? 'animate-pulse' : ''
                            }`}
                          >
                            {symbol}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Win Display */}
                  {lastWin > 0 && (
                    <div className="text-center py-4">
                      <div className="text-2xl font-casino font-bold text-casino-gold animate-pulse">
                        YOU WIN ₹{lastWin.toLocaleString()}!
                      </div>
                    </div>
                  )}
                </div>

                {/* Game Controls */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="text-xs text-casino-text-muted block mb-1">Bet Amount</label>
                    <Input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(selectedSlot.minBet, Math.min(selectedSlot.maxBet, parseInt(e.target.value) || selectedSlot.minBet)))}
                      min={selectedSlot.minBet}
                      max={selectedSlot.maxBet}
                      className="text-center"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-casino-text-muted block mb-1">Balance</label>
                    <div className="h-10 bg-casino-accent rounded flex items-center justify-center font-semibold text-casino-gold">
                      ₹{balance.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-casino-text-muted block mb-1">Last Win</label>
                    <div className="h-10 bg-casino-accent rounded flex items-center justify-center font-semibold text-casino-green">
                      ₹{lastWin.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-casino-text-muted block mb-1">Spins</label>
                    <div className="h-10 bg-casino-accent rounded flex items-center justify-center font-semibold text-white">
                      {spinCount}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button 
                    className="btn-casino-primary flex-1"
                    onClick={spin}
                    disabled={isSpinning || balance < betAmount}
                  >
                    {isSpinning ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Spinning...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        SPIN (₹{betAmount})
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={maxBet}
                    className="border-casino-border hover:bg-casino-gold hover:text-casino-primary"
                  >
                    Max Bet
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="text-casino-text-muted hover:text-casino-gold"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Game Info & Stats */}
        <div className="lg:col-span-1">
          {selectedSlot ? (
            <div className="space-y-4">
              {/* Game Stats */}
              <Card className="casino-card">
                <CardContent className="p-4">
                  <h3 className="font-casino font-bold text-casino-gold mb-4">Game Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-casino-text-muted">Jackpot:</span>
                      <span className="text-casino-gold font-semibold">{selectedSlot.jackpot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-casino-text-muted">RTP:</span>
                      <span className="text-casino-green">{selectedSlot.rtp}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-casino-text-muted">Paylines:</span>
                      <span className="text-casino-blue">{selectedSlot.paylines}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-casino-text-muted">Max Multiplier:</span>
                      <span className="text-casino-purple">{selectedSlot.multiplier}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-casino-text-muted">Players:</span>
                      <span className="text-white">{selectedSlot.players}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paytable */}
              <Card className="casino-card">
                <CardContent className="p-4">
                  <h3 className="font-casino font-bold text-casino-gold mb-4">Paytable</h3>
                  <div className="space-y-2">
                    {symbols.map((symbol, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{symbol}</span>
                          <span className="text-casino-text-muted">x3</span>
                        </div>
                        <span className="text-casino-gold font-semibold">
                          {getSymbolMultiplier(symbol)}x
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="casino-card">
              <CardContent className="p-8 text-center">
                <Crown className="w-12 h-12 mx-auto mb-4 text-casino-text-muted opacity-50" />
                <p className="text-casino-text-muted">Select a slot machine to start playing</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}