import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface AviatorGameProps {
  game: any;
  user: any;
  onBack: () => void;
}

export function AviatorGame({ game, user, onBack }: AviatorGameProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [isFlying, setIsFlying] = useState(false);
  const [multiplier, setMultiplier] = useState(1.00);
  const [cashedOut, setCashedOut] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const [autoCashOut, setAutoCashOut] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const quickBets = [50, 100, 500, 1000, 5000];
  const autoCashouts = [1.5, 2.0, 3.0, 5.0, 10.0];

  const startFlight = () => {
    if (!user || parseFloat(user.walletBalance) < betAmount) {
      setResult("Insufficient balance!");
      return;
    }

    setIsFlying(true);
    setMultiplier(1.00);
    setCashedOut(false);
    setCrashed(false);
    setResult(null);

    // Random crash point between 1.01x and 50x
    const crashPoint = Math.random() * 49 + 1.01;
    
    intervalRef.current = setInterval(() => {
      setMultiplier(prev => {
        const newMultiplier = prev + (Math.random() * 0.1 + 0.01);
        
        // Auto cash out check
        if (autoCashOut > 0 && newMultiplier >= autoCashOut && !cashedOut) {
          cashOut(newMultiplier);
          return newMultiplier;
        }
        
        // Crash check
        if (newMultiplier >= crashPoint) {
          if (!cashedOut) {
            setCrashed(true);
            setResult(`Crashed at ${newMultiplier.toFixed(2)}x! Better luck next time.`);
          }
          setIsFlying(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return newMultiplier;
        }
        
        return newMultiplier;
      });
    }, 100);
  };

  const cashOut = (currentMultiplier?: number) => {
    if (!isFlying || cashedOut || crashed) return;
    
    const finalMultiplier = currentMultiplier || multiplier;
    setCashedOut(true);
    setIsFlying(false);
    
    const winAmount = Math.floor(betAmount * finalMultiplier);
    setResult(`Cashed out at ${finalMultiplier.toFixed(2)}x! Won ₹${winAmount}`);
    
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="w-full max-w-2xl bg-gradient-to-br from-blue-900 via-purple-900 to-black border-2 border-blue-500">
      <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-400">✈️ Aviator</h2>
            <Button variant="outline" onClick={onBack} className="border-blue-500 text-blue-400">
              ← Back
            </Button>
          </div>

          {/* Flight Display */}
          <div className="relative bg-gradient-to-b from-blue-800/30 to-black/30 rounded-2xl p-8 mb-6 h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>
            
            {/* Plane Animation */}
            <motion.div
              className="absolute text-6xl"
              initial={{ x: -100, y: 200 }}
              animate={isFlying ? { 
                x: [0, 300, 600], 
                y: [150, 100, 50] 
              } : { x: 0, y: 150 }}
              transition={{ 
                duration: isFlying ? 20 : 0,
                ease: "easeOut"
              }}
            >
              ✈️
            </motion.div>

            {/* Multiplier Display */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <motion.div 
                className={`text-6xl font-bold ${crashed ? 'text-red-500' : cashedOut ? 'text-green-500' : 'text-blue-400'}`}
                animate={{ scale: isFlying ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5, repeat: isFlying ? Infinity : 0 }}
              >
                {multiplier.toFixed(2)}x
              </motion.div>
            </div>

            {/* Status */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              {crashed && (
                <motion.div 
                  className="text-2xl text-red-500 font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  💥 CRASHED!
                </motion.div>
              )}
              {cashedOut && (
                <motion.div 
                  className="text-2xl text-green-500 font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  💰 CASHED OUT!
                </motion.div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bet Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-blue-300 text-sm font-medium mb-2">
                  Bet Amount: ₹{betAmount}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {quickBets.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      disabled={isFlying}
                      className={`py-2 px-2 rounded text-sm font-medium transition-colors ${
                        betAmount === amount
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-blue-300 hover:bg-gray-600'
                      } disabled:opacity-50`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-blue-300 text-sm font-medium mb-2">
                  Auto Cash Out: {autoCashOut > 0 ? `${autoCashOut}x` : 'Off'}
                </label>
                <div className="grid grid-cols-6 gap-2">
                  <button
                    onClick={() => setAutoCashOut(0)}
                    disabled={isFlying}
                    className={`py-2 px-2 rounded text-sm font-medium transition-colors ${
                      autoCashOut === 0
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-700 text-blue-300 hover:bg-gray-600'
                    } disabled:opacity-50`}
                  >
                    Off
                  </button>
                  {autoCashouts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setAutoCashOut(amount)}
                      disabled={isFlying}
                      className={`py-2 px-2 rounded text-sm font-medium transition-colors ${
                        autoCashOut === amount
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-blue-300 hover:bg-gray-600'
                      } disabled:opacity-50`}
                    >
                      {amount}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-center space-y-4">
              {!isFlying && !result && (
                <Button
                  onClick={startFlight}
                  className="bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-bold"
                  disabled={!user || parseFloat(user.walletBalance) < betAmount}
                >
                  🚀 Start Flight
                </Button>
              )}
              
              {isFlying && !cashedOut && !crashed && (
                <Button
                  onClick={() => cashOut()}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white py-4 text-lg font-bold animate-pulse"
                >
                  💰 Cash Out Now!
                </Button>
              )}

              {result && (
                <div className="space-y-4">
                  <div className={`text-center p-4 rounded-lg ${
                    result.includes('Won') ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                  }`}>
                    {result}
                  </div>
                  <Button
                    onClick={() => {
                      setResult(null);
                      setMultiplier(1.00);
                      setCashedOut(false);
                      setCrashed(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Play Again
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* User Balance */}
          <div className="mt-6 text-center">
            <p className="text-blue-300">
              Balance: <span className="text-white font-bold">₹{parseFloat(user?.walletBalance || '0').toLocaleString()}</span>
            </p>
          </div>
        </CardContent>
      </Card>
  );
}