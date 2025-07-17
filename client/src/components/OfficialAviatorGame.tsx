import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus, TrendingUp, Users } from 'lucide-react';

interface User {
  id: string;
  username: string;
  phone: string;
  walletBalance: string;
}

interface Props {
  user: User;
  onBack: () => void;
  onBalanceUpdate: (newBalance: number) => void;
}

interface GameRound {
  id: string;
  multiplier: number;
  time: number;
}

export default function OfficialAviatorGame({ user, onBack, onBalanceUpdate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isFlying, setIsFlying] = useState(false);
  
  // Betting states
  const [bet1Amount, setBet1Amount] = useState(100);
  const [bet2Amount, setBet2Amount] = useState(100);
  const [bet1Placed, setBet1Placed] = useState(false);
  const [bet2Placed, setBet2Placed] = useState(false);
  const [bet1CashedOut, setBet1CashedOut] = useState(false);
  const [bet2CashedOut, setBet2CashedOut] = useState(false);
  const [bet1Multiplier, setBet1Multiplier] = useState(0);
  const [bet2Multiplier, setBet2Multiplier] = useState(0);

  // Auto betting
  const [autoBet1, setAutoBet1] = useState(false);
  const [autoBet2, setAutoBet2] = useState(false);
  const [autoCashOut1, setAutoCashOut1] = useState(false);
  const [autoCashOut2, setAutoCashOut2] = useState(false);
  const [autoCashOut1Value, setAutoCashOut1Value] = useState(2.0);
  const [autoCashOut2Value, setAutoCashOut2Value] = useState(2.0);

  // History and players
  const [recentMultipliers, setRecentMultipliers] = useState<number[]>([
    1.23, 2.45, 1.89, 3.67, 1.45, 2.11, 4.23, 1.67, 2.89, 1.34
  ]);
  const [activePlayers, setActivePlayers] = useState(1247);

  // Game animation
  const [planePosition, setPlanePosition] = useState({ x: 50, y: 350 });
  const [curvePoints, setCurvePoints] = useState<{x: number, y: number}[]>([]);

  // Generate crash point (random between 1.01 and 50.00)
  const generateCrashPoint = () => {
    const random = Math.random();
    if (random < 0.5) return 1.01 + Math.random() * 1.99; // 1.01-3.00 (50% chance)
    if (random < 0.8) return 3.00 + Math.random() * 7.00; // 3.00-10.00 (30% chance)
    if (random < 0.95) return 10.00 + Math.random() * 40.00; // 10.00-50.00 (15% chance)
    return 50.00 + Math.random() * 450.00; // 50.00-500.00 (5% chance)
  };

  // Start new round
  const startNewRound = () => {
    const newCrashPoint = generateCrashPoint();
    setCrashPoint(newCrashPoint);
    setCurrentMultiplier(1.00);
    setGameState('flying');
    setIsFlying(true);
    setBet1CashedOut(false);
    setBet2CashedOut(false);
    setBet1Multiplier(0);
    setBet2Multiplier(0);
    setCurvePoints([{ x: 50, y: 350 }]);
    setPlanePosition({ x: 50, y: 350 });

    // Auto place bets if enabled
    if (autoBet1 && !bet1Placed) {
      placeBet(1);
    }
    if (autoBet2 && !bet2Placed) {
      placeBet(2);
    }
  };

  // Game loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState === 'waiting') {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            startNewRound();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === 'flying') {
      interval = setInterval(() => {
        setCurrentMultiplier(prev => {
          const newMultiplier = prev + 0.01;
          
          // Update plane position
          const progress = Math.min((newMultiplier - 1) / (crashPoint - 1), 1);
          const x = 50 + progress * 300;
          const y = 350 - progress * 200;
          
          setPlanePosition({ x, y });
          setCurvePoints(points => [...points, { x, y }]);

          // Auto cash out check
          if (autoCashOut1 && bet1Placed && !bet1CashedOut && newMultiplier >= autoCashOut1Value) {
            cashOut(1, newMultiplier);
          }
          if (autoCashOut2 && bet2Placed && !bet2CashedOut && newMultiplier >= autoCashOut2Value) {
            cashOut(2, newMultiplier);
          }

          // Check crash
          if (newMultiplier >= crashPoint) {
            setGameState('crashed');
            setIsFlying(false);
            setTimeLeft(5);
            
            // Add to history
            setRecentMultipliers(prev => [newMultiplier, ...prev.slice(0, 9)]);
            
            // Reset bets for next round
            setTimeout(() => {
              setBet1Placed(false);
              setBet2Placed(false);
              setGameState('waiting');
            }, 3000);
            
            return newMultiplier;
          }
          
          return newMultiplier;
        });
      }, 50);
    }

    return () => clearInterval(interval);
  }, [gameState, crashPoint, autoBet1, autoBet2, autoCashOut1, autoCashOut2, autoCashOut1Value, autoCashOut2Value, bet1Placed, bet2Placed, bet1CashedOut, bet2CashedOut]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw curve
    if (curvePoints.length > 1) {
      ctx.strokeStyle = gameState === 'crashed' ? '#ef4444' : '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(curvePoints[0].x, curvePoints[0].y);
      
      for (let i = 1; i < curvePoints.length; i++) {
        ctx.lineTo(curvePoints[i].x, curvePoints[i].y);
      }
      ctx.stroke();
    }

    // Draw plane
    if (isFlying || gameState === 'crashed') {
      ctx.fillStyle = gameState === 'crashed' ? '#ef4444' : '#ffffff';
      ctx.font = '20px Arial';
      ctx.fillText('✈️', planePosition.x - 10, planePosition.y);
    }

  }, [curvePoints, planePosition, isFlying, gameState]);

  // Place bet
  const placeBet = (betNumber: 1 | 2) => {
    const amount = betNumber === 1 ? bet1Amount : bet2Amount;
    const currentBalance = parseFloat(user.walletBalance);
    
    if (currentBalance < amount) {
      alert('Insufficient balance!');
      return;
    }

    if (betNumber === 1) {
      setBet1Placed(true);
    } else {
      setBet2Placed(true);
    }

    // Deduct from balance
    onBalanceUpdate(currentBalance - amount);
  };

  // Cash out
  const cashOut = (betNumber: 1 | 2, multiplier?: number) => {
    const mult = multiplier || currentMultiplier;
    const amount = betNumber === 1 ? bet1Amount : bet2Amount;
    const winAmount = amount * mult;
    const currentBalance = parseFloat(user.walletBalance);

    if (betNumber === 1) {
      setBet1CashedOut(true);
      setBet1Multiplier(mult);
    } else {
      setBet2CashedOut(true);
      setBet2Multiplier(mult);
    }

    // Add winnings to balance
    onBalanceUpdate(currentBalance + winAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-white hover:text-blue-400"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              Back
            </button>
            <div className="text-white font-bold text-lg">Aviator</div>
            <div className="text-green-400 font-bold">₹{parseFloat(user.walletBalance).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-white">
            <Users className="w-4 h-4" />
            <span className="text-sm">{activePlayers} players</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">RTP: 97%</span>
          </div>
        </div>

        {/* Recent Multipliers */}
        <div className="mb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {recentMultipliers.map((mult, index) => (
              <div
                key={index}
                className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                  mult >= 2 ? 'bg-green-600 text-white' : 
                  mult >= 1.5 ? 'bg-yellow-600 text-white' : 
                  'bg-red-600 text-white'
                }`}
              >
                {mult.toFixed(2)}x
              </div>
            ))}
          </div>
        </div>

        {/* Game Canvas */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4 relative">
          <canvas
            ref={canvasRef}
            width={350}
            height={200}
            className="w-full h-32 bg-gray-900 rounded-lg"
          />
          
          {/* Game Status Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            {gameState === 'waiting' && (
              <div className="text-center">
                <div className="text-white text-2xl font-bold mb-2">
                  Next Round In: {timeLeft}s
                </div>
                <div className="text-gray-400">Place your bets!</div>
              </div>
            )}
            {gameState === 'flying' && (
              <div className="text-center">
                <div className="text-green-400 text-4xl font-bold mb-2">
                  {currentMultiplier.toFixed(2)}x
                </div>
                <div className="text-white">FLYING...</div>
              </div>
            )}
            {gameState === 'crashed' && (
              <div className="text-center">
                <div className="text-red-400 text-4xl font-bold mb-2">
                  {currentMultiplier.toFixed(2)}x
                </div>
                <div className="text-red-400 font-bold">FLEW AWAY!</div>
              </div>
            )}
          </div>
        </div>

        {/* Betting Panel */}
        <div className="grid grid-cols-1 gap-4">
          {/* Bet 1 */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-bold">Bet 1</div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoBet1(!autoBet1)}
                  className={`px-2 py-1 rounded text-xs ${autoBet1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Auto
                </button>
                <button
                  onClick={() => setAutoCashOut1(!autoCashOut1)}
                  className={`px-2 py-1 rounded text-xs ${autoCashOut1 ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Auto Cash Out
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <button
                onClick={() => setBet1Amount(Math.max(10, bet1Amount - 10))}
                className="bg-gray-700 p-2 rounded"
              >
                <Minus className="w-4 h-4 text-white" />
              </button>
              <div className="flex-1 text-center bg-gray-700 py-2 rounded text-white font-bold">
                ₹{bet1Amount}
              </div>
              <button
                onClick={() => setBet1Amount(bet1Amount + 10)}
                className="bg-gray-700 p-2 rounded"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>

            {autoCashOut1 && (
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-white text-sm">Cash Out At:</span>
                <input
                  type="number"
                  value={autoCashOut1Value}
                  onChange={(e) => setAutoCashOut1Value(parseFloat(e.target.value) || 2.0)}
                  step="0.1"
                  min="1.1"
                  className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-20"
                />
                <span className="text-white text-sm">x</span>
              </div>
            )}

            <button
              onClick={() => gameState === 'waiting' ? placeBet(1) : cashOut(1)}
              disabled={gameState === 'crashed' || (gameState === 'flying' && (!bet1Placed || bet1CashedOut))}
              className={`w-full py-3 rounded-xl font-bold ${
                gameState === 'waiting' ? 
                  (bet1Placed ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700') :
                gameState === 'flying' ? 
                  (bet1Placed && !bet1CashedOut ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-600 text-gray-400') :
                'bg-gray-600 text-gray-400'
              } disabled:opacity-50`}
            >
              {gameState === 'waiting' ? 
                (bet1Placed ? '✓ Bet Placed' : 'Place Bet') :
                gameState === 'flying' ? 
                  (bet1CashedOut ? `Won ₹${(bet1Amount * bet1Multiplier).toFixed(2)}` : 
                   bet1Placed ? `Cash Out ₹${(bet1Amount * currentMultiplier).toFixed(2)}` : 'Not Betting') :
                'Round Ended'
              }
            </button>
          </div>

          {/* Bet 2 */}
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-white font-bold">Bet 2</div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoBet2(!autoBet2)}
                  className={`px-2 py-1 rounded text-xs ${autoBet2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Auto
                </button>
                <button
                  onClick={() => setAutoCashOut2(!autoCashOut2)}
                  className={`px-2 py-1 rounded text-xs ${autoCashOut2 ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  Auto Cash Out
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <button
                onClick={() => setBet2Amount(Math.max(10, bet2Amount - 10))}
                className="bg-gray-700 p-2 rounded"
              >
                <Minus className="w-4 h-4 text-white" />
              </button>
              <div className="flex-1 text-center bg-gray-700 py-2 rounded text-white font-bold">
                ₹{bet2Amount}
              </div>
              <button
                onClick={() => setBet2Amount(bet2Amount + 10)}
                className="bg-gray-700 p-2 rounded"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>

            {autoCashOut2 && (
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-white text-sm">Cash Out At:</span>
                <input
                  type="number"
                  value={autoCashOut2Value}
                  onChange={(e) => setAutoCashOut2Value(parseFloat(e.target.value) || 2.0)}
                  step="0.1"
                  min="1.1"
                  className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-20"
                />
                <span className="text-white text-sm">x</span>
              </div>
            )}

            <button
              onClick={() => gameState === 'waiting' ? placeBet(2) : cashOut(2)}
              disabled={gameState === 'crashed' || (gameState === 'flying' && (!bet2Placed || bet2CashedOut))}
              className={`w-full py-3 rounded-xl font-bold ${
                gameState === 'waiting' ? 
                  (bet2Placed ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700') :
                gameState === 'flying' ? 
                  (bet2Placed && !bet2CashedOut ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-600 text-gray-400') :
                'bg-gray-600 text-gray-400'
              } disabled:opacity-50`}
            >
              {gameState === 'waiting' ? 
                (bet2Placed ? '✓ Bet Placed' : 'Place Bet') :
                gameState === 'flying' ? 
                  (bet2CashedOut ? `Won ₹${(bet2Amount * bet2Multiplier).toFixed(2)}` : 
                   bet2Placed ? `Cash Out ₹${(bet2Amount * currentMultiplier).toFixed(2)}` : 'Not Betting') :
                'Round Ended'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}