import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, MessageCircle, Users, History, TrendingUp } from 'lucide-react';
import { apiRequest } from '../../lib/queryClient';

interface AviatorProps {
  onBack?: () => void;
}

interface BetData {
  id: string;
  amount: number;
  multiplier: number;
  status: 'active' | 'cashed_out' | 'crashed';
  cashOutAt?: number;
  winAmount?: number;
}

interface GameRound {
  id: string;
  multiplier: number;
  timestamp: Date;
}

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

export default function OfficialAviatorReplica({ onBack }: AviatorProps) {
  // Game state
  const [gamePhase, setGamePhase] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [countdown, setCountdown] = useState(5);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  
  // User balance and settings
  const [balance, setBalance] = useState(25000);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showStats, setShowStats] = useState(true);
  
  // Betting state
  const [bet1Amount, setBet1Amount] = useState(100);
  const [bet2Amount, setBet2Amount] = useState(100);
  const [bet1Active, setBet1Active] = useState(false);
  const [bet2Active, setBet2Active] = useState(false);
  const [autoCashOut1, setAutoCashOut1] = useState<number | null>(null);
  const [autoCashOut2, setAutoCashOut2] = useState<number | null>(null);
  const [autoPlay1, setAutoPlay1] = useState(false);
  const [autoPlay2, setAutoPlay2] = useState(false);
  
  // Game history and statistics
  const [gameHistory, setGameHistory] = useState<GameRound[]>([
    { id: '1', multiplier: 2.34, timestamp: new Date() },
    { id: '2', multiplier: 1.05, timestamp: new Date() },
    { id: '3', multiplier: 8.67, timestamp: new Date() },
    { id: '4', multiplier: 3.21, timestamp: new Date() },
    { id: '5', multiplier: 1.23, timestamp: new Date() },
  ]);
  
  const [allBets, setAllBets] = useState<BetData[]>([]);
  const [myBets, setMyBets] = useState<BetData[]>([]);
  const [topWins, setTopWins] = useState<BetData[]>([]);
  
  // Chat system
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', username: 'Player123', message: 'Good luck everyone!', timestamp: new Date() },
    { id: '2', username: 'Winner786', message: 'Just won 5.67x!', timestamp: new Date() },
    { id: '3', username: 'AviatorPro', message: 'Flying high today 🚀', timestamp: new Date() },
  ]);
  const [chatInput, setChatInput] = useState('');
  
  // Canvas and animation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const [planePosition, setPlanePosition] = useState({ x: 0, y: 0 });
  const [curvePath, setCurvePath] = useState<{x: number, y: number}[]>([]);
  
  // Online players simulation
  const [onlinePlayers] = useState(Math.floor(Math.random() * 5000) + 2000);
  
  // Preset bet amounts
  const presetAmounts = [10, 50, 100, 500, 1000, 5000];
  
  // Initialize game
  useEffect(() => {
    startWaitingPhase();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Canvas drawing
  useEffect(() => {
    drawGame();
  }, [currentMultiplier, gamePhase, curvePath, planePosition]);
  
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas with dark background
    ctx.fillStyle = '#1a1625';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    
    for (let i = 0; i <= canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    
    for (let i = 0; i <= canvas.height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    
    // Draw the curve if flying
    if (curvePath.length > 1) {
      // Main red curve with glow
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.moveTo(curvePath[0].x, curvePath[0].y);
      
      for (let i = 1; i < curvePath.length; i++) {
        ctx.lineTo(curvePath[i].x, curvePath[i].y);
      }
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Draw plane at current position
      if (gamePhase === 'flying') {
        const planeX = planePosition.x;
        const planeY = planePosition.y;
        
        // Plane body (simplified)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(planeX, planeY, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Plane trail effect
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(planeX - 15, planeY + 3);
        ctx.lineTo(planeX - 25, planeY + 8);
        ctx.stroke();
      }
    }
    
    // Draw crash effect if crashed
    if (gamePhase === 'crashed') {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      ctx.fillStyle = 'rgba(220, 38, 38, 0.8)';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('FLEW AWAY!', centerX, centerY);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`${crashPoint?.toFixed(2)}x`, centerX, centerY + 40);
    }
  }, [currentMultiplier, gamePhase, curvePath, planePosition, crashPoint]);
  
  const startWaitingPhase = () => {
    setGamePhase('waiting');
    setCurrentMultiplier(1.00);
    setCountdown(5);
    setCurvePath([]);
    setPlanePosition({ x: 0, y: 0 });
    
    // Generate random crash point
    const randomCrash = Math.random() < 0.04 ? // 4% chance for very early crash
      1.01 + Math.random() * 0.04 : // 1.01 - 1.05
      1.05 + Math.random() * 15; // 1.05 - 16.05
    setCrashPoint(randomCrash);
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startFlying();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const startFlying = () => {
    setGamePhase('flying');
    setCurrentMultiplier(1.00);
    startTimeRef.current = Date.now();
    
    // Auto-place bets if auto-play is enabled
    if (autoPlay1 && balance >= bet1Amount) {
      placeBet(1);
    }
    if (autoPlay2 && balance >= bet2Amount) {
      placeBet(2);
    }
    
    animateFlight();
  };
  
  const animateFlight = () => {
    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000; // seconds
      
      // Calculate multiplier based on time with exponential growth
      const newMultiplier = 1 + Math.pow(elapsed * 0.5, 1.5);
      setCurrentMultiplier(newMultiplier);
      
      // Update plane position and curve
      const canvas = canvasRef.current;
      if (canvas) {
        const progress = Math.min(elapsed / 10, 1); // 10 seconds to cross screen
        const x = 50 + (canvas.offsetWidth - 100) * progress;
        const y = canvas.offsetHeight - 50 - (newMultiplier - 1) * 20;
        
        setPlanePosition({ x, y });
        setCurvePath(prev => [...prev, { x, y }].slice(-100)); // Keep last 100 points
      }
      
      // Check for crash
      if (crashPoint && newMultiplier >= crashPoint) {
        crash();
        return;
      }
      
      // Check auto cash-out
      if (bet1Active && autoCashOut1 && newMultiplier >= autoCashOut1) {
        cashOut(1);
      }
      if (bet2Active && autoCashOut2 && newMultiplier >= autoCashOut2) {
        cashOut(2);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const crash = () => {
    setGamePhase('crashed');
    setCurrentMultiplier(crashPoint || 1.00);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // Process losing bets
    if (bet1Active) {
      setBet1Active(false);
      setMyBets(prev => [...prev, {
        id: Date.now().toString(),
        amount: bet1Amount,
        multiplier: crashPoint || 1.00,
        status: 'crashed'
      }]);
    }
    
    if (bet2Active) {
      setBet2Active(false);
      setMyBets(prev => [...prev, {
        id: Date.now().toString(),
        amount: bet2Amount,
        multiplier: crashPoint || 1.00,
        status: 'crashed'
      }]);
    }
    
    // Add to game history
    setGameHistory(prev => [{
      id: Date.now().toString(),
      multiplier: crashPoint || 1.00,
      timestamp: new Date()
    }, ...prev.slice(0, 9)]);
    
    // Start next round after 3 seconds
    setTimeout(() => {
      startWaitingPhase();
    }, 3000);
  };
  
  const placeBet = (betNumber: 1 | 2) => {
    const amount = betNumber === 1 ? bet1Amount : bet2Amount;
    
    if (gamePhase !== 'waiting' || balance < amount) return;
    
    setBalance(prev => prev - amount);
    
    if (betNumber === 1) {
      setBet1Active(true);
    } else {
      setBet2Active(true);
    }
  };
  
  const cashOut = (betNumber: 1 | 2) => {
    const amount = betNumber === 1 ? bet1Amount : bet2Amount;
    const winAmount = amount * currentMultiplier;
    
    setBalance(prev => prev + winAmount);
    
    if (betNumber === 1) {
      setBet1Active(false);
      setMyBets(prev => [...prev, {
        id: Date.now().toString(),
        amount,
        multiplier: currentMultiplier,
        status: 'cashed_out',
        cashOutAt: currentMultiplier,
        winAmount
      }]);
    } else {
      setBet2Active(false);
      setMyBets(prev => [...prev, {
        id: Date.now().toString(),
        amount,
        multiplier: currentMultiplier,
        status: 'cashed_out',
        cashOutAt: currentMultiplier,
        winAmount
      }]);
    }
  };
  
  const adjustBetAmount = (betNumber: 1 | 2, delta: number) => {
    if (betNumber === 1) {
      setBet1Amount(prev => Math.max(10, prev + delta));
    } else {
      setBet2Amount(prev => Math.max(10, prev + delta));
    }
  };
  
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'You',
      message: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [newMessage, ...prev.slice(0, 49)]);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-[#1a1625] text-white overflow-hidden">
      {/* Header */}
      <div className="bg-[#2a1f3d] border-b border-purple-800/30 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-red-400">✈️ AVIATOR</h1>
          <div className="text-sm text-gray-400">
            <span className="text-green-400">●</span> {onlinePlayers.toLocaleString()} players online
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs text-gray-400">Balance</div>
            <div className="text-lg font-bold text-yellow-400">₹{balance.toLocaleString()}</div>
          </div>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Main game area */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left sidebar - Chat and Stats */}
        <div className="w-80 bg-[#231833] border-r border-purple-800/30 flex flex-col">
          {/* Tab switcher */}
          <div className="flex border-b border-purple-800/30">
            <button
              onClick={() => setShowChat(true)}
              className={`flex-1 p-3 text-sm font-medium ${showChat ? 'bg-purple-700 text-white' : 'text-gray-400'}`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Chat
            </button>
            <button
              onClick={() => setShowChat(false)}
              className={`flex-1 p-3 text-sm font-medium ${!showChat ? 'bg-purple-700 text-white' : 'text-gray-400'}`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Stats
            </button>
          </div>
          
          {showChat ? (
            /* Chat section */
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="text-sm">
                    <span className="text-blue-400">{msg.username}:</span>{' '}
                    <span className="text-gray-300">{msg.message}</span>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-purple-800/30">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 rounded px-3 py-2 text-sm"
                  />
                  <button
                    onClick={sendChatMessage}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Stats section */
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Game history */}
              <div>
                <h3 className="text-sm font-bold mb-2 text-gray-400">Game History</h3>
                <div className="flex flex-wrap gap-1">
                  {gameHistory.map(round => (
                    <div
                      key={round.id}
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        round.multiplier >= 2 ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    >
                      {round.multiplier.toFixed(2)}x
                    </div>
                  ))}
                </div>
              </div>
              
              {/* My bets */}
              <div>
                <h3 className="text-sm font-bold mb-2 text-gray-400">My Bets</h3>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {myBets.slice(0, 10).map(bet => (
                    <div key={bet.id} className="text-xs flex justify-between items-center bg-gray-800 rounded p-2">
                      <span>₹{bet.amount}</span>
                      <span className={bet.status === 'cashed_out' ? 'text-green-400' : 'text-red-400'}>
                        {bet.status === 'cashed_out' ? `+₹${bet.winAmount?.toFixed(0)}` : '-₹' + bet.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main game canvas */}
        <div className="flex-1 relative">
          {/* Multiplier display */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="text-center">
              {gamePhase === 'waiting' ? (
                <div className="text-4xl font-bold text-yellow-400">
                  Starting in {countdown}s
                </div>
              ) : (
                <motion.div
                  animate={{ scale: gamePhase === 'flying' ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: gamePhase === 'flying' ? Infinity : 0 }}
                  className={`text-6xl font-bold ${
                    gamePhase === 'crashed' ? 'text-red-400' : 'text-white'
                  }`}
                >
                  {currentMultiplier.toFixed(2)}x
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Game canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ background: '#1a1625' }}
          />
        </div>
        
        {/* Right sidebar - Betting interface */}
        <div className="w-96 bg-[#231833] border-l border-purple-800/30 p-4 space-y-4">
          {/* Bet 1 */}
          <div className="bg-[#2a1f3d] rounded-lg p-4 border border-purple-800/30">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold">BET 1</span>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={autoPlay1}
                  onChange={(e) => setAutoPlay1(e.target.checked)}
                  className="rounded"
                />
                <span>Auto</span>
              </label>
            </div>
            
            {/* Bet amount */}
            <div className="flex items-center space-x-2 mb-3">
              <button
                onClick={() => adjustBetAmount(1, -10)}
                className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <input
                  type="number"
                  value={bet1Amount}
                  onChange={(e) => setBet1Amount(Number(e.target.value))}
                  className="w-full bg-gray-700 rounded px-2 py-1 text-center"
                  min="10"
                />
              </div>
              <button
                onClick={() => adjustBetAmount(1, 10)}
                className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm"
              >
                +
              </button>
            </div>
            
            {/* Preset amounts */}
            <div className="grid grid-cols-3 gap-1 mb-3">
              {presetAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setBet1Amount(amount)}
                  className="bg-gray-700 hover:bg-gray-600 rounded text-xs py-1"
                >
                  {amount}
                </button>
              ))}
            </div>
            
            {/* Auto cash out */}
            <div className="mb-3">
              <label className="text-xs text-gray-400 mb-1 block">Auto Cash Out</label>
              <input
                type="number"
                value={autoCashOut1 || ''}
                onChange={(e) => setAutoCashOut1(e.target.value ? Number(e.target.value) : null)}
                placeholder="e.g. 2.00"
                step="0.01"
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              />
            </div>
            
            {/* Bet/Cash out button */}
            {bet1Active ? (
              <button
                onClick={() => cashOut(1)}
                disabled={gamePhase !== 'flying'}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 rounded-lg disabled:opacity-50"
              >
                Cash Out ₹{(bet1Amount * currentMultiplier).toFixed(0)}
              </button>
            ) : (
              <button
                onClick={() => placeBet(1)}
                disabled={gamePhase !== 'waiting' || balance < bet1Amount}
                className="w-full bg-green-600 hover:bg-green-700 font-bold py-3 rounded-lg disabled:opacity-50"
              >
                Bet ₹{bet1Amount}
              </button>
            )}
          </div>
          
          {/* Bet 2 */}
          <div className="bg-[#2a1f3d] rounded-lg p-4 border border-purple-800/30">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold">BET 2</span>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={autoPlay2}
                  onChange={(e) => setAutoPlay2(e.target.checked)}
                  className="rounded"
                />
                <span>Auto</span>
              </label>
            </div>
            
            {/* Bet amount */}
            <div className="flex items-center space-x-2 mb-3">
              <button
                onClick={() => adjustBetAmount(2, -10)}
                className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm"
              >
                -
              </button>
              <div className="flex-1 text-center">
                <input
                  type="number"
                  value={bet2Amount}
                  onChange={(e) => setBet2Amount(Number(e.target.value))}
                  className="w-full bg-gray-700 rounded px-2 py-1 text-center"
                  min="10"
                />
              </div>
              <button
                onClick={() => adjustBetAmount(2, 10)}
                className="bg-gray-700 hover:bg-gray-600 rounded px-3 py-1 text-sm"
              >
                +
              </button>
            </div>
            
            {/* Preset amounts */}
            <div className="grid grid-cols-3 gap-1 mb-3">
              {presetAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setBet2Amount(amount)}
                  className="bg-gray-700 hover:bg-gray-600 rounded text-xs py-1"
                >
                  {amount}
                </button>
              ))}
            </div>
            
            {/* Auto cash out */}
            <div className="mb-3">
              <label className="text-xs text-gray-400 mb-1 block">Auto Cash Out</label>
              <input
                type="number"
                value={autoCashOut2 || ''}
                onChange={(e) => setAutoCashOut2(e.target.value ? Number(e.target.value) : null)}
                placeholder="e.g. 2.00"
                step="0.01"
                className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              />
            </div>
            
            {/* Bet/Cash out button */}
            {bet2Active ? (
              <button
                onClick={() => cashOut(2)}
                disabled={gamePhase !== 'flying'}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 rounded-lg disabled:opacity-50"
              >
                Cash Out ₹{(bet2Amount * currentMultiplier).toFixed(0)}
              </button>
            ) : (
              <button
                onClick={() => placeBet(2)}
                disabled={gamePhase !== 'waiting' || balance < bet2Amount}
                className="w-full bg-green-600 hover:bg-green-700 font-bold py-3 rounded-lg disabled:opacity-50"
              >
                Bet ₹{bet2Amount}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}