import { useState, useEffect, useRef } from 'react';

interface EnhancedAviatorGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const EnhancedAviatorGame = ({ onClose, refreshBalance }: EnhancedAviatorGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [autoCashOut, setAutoCashOut] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState([2.45, 1.23, 15.67, 1.05, 3.28]);
  const [countdown, setCountdown] = useState(5);
  const [planePosition, setPlanePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Enhanced plane animation
  useEffect(() => {
    if (gameState === 'flying') {
      const animate = () => {
        setPlanePosition(prev => ({
          x: prev.x + 2 + (multiplier * 0.5),
          y: prev.y - 1 - (multiplier * 0.1)
        }));
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, multiplier]);

  // Game countdown and multiplier logic
  useEffect(() => {
    let interval: any;
    
    if (gameState === 'waiting' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            startGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === 'flying') {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const increment = 0.01 + (Math.random() * 0.02);
          const newMultiplier = prev + increment;
          
          // Progressive crash probability
          const crashChance = Math.min(0.001 * Math.pow(prev, 1.5), 0.1);
          
          if (Math.random() < crashChance) {
            crashGame(newMultiplier);
            return newMultiplier;
          }
          
          // Auto cash out check
          if (autoCashOut && newMultiplier >= autoCashOut && currentBet) {
            cashOut(autoCashOut);
          }
          
          return newMultiplier;
        });
      }, 50); // Faster updates for smoother animation
    }

    return () => clearInterval(interval);
  }, [gameState, countdown, autoCashOut, currentBet]);

  const startGame = () => {
    setGameState('flying');
    setIsFlying(true);
    setMultiplier(1.00);
    setPlanePosition({ x: 0, y: 100 });
  };

  const crashGame = (finalMultiplier: number) => {
    setGameState('crashed');
    setIsFlying(false);
    
    if (currentBet) {
      setResult({
        crashed: true,
        finalMultiplier,
        isWin: false,
        winAmount: 0
      });
    }
    
    setTimeout(() => {
      setGameState('waiting');
      setCountdown(5);
      setMultiplier(1.00);
      setCurrentBet(null);
      setResult(null);
      setPlanePosition({ x: 0, y: 0 });
    }, 3000);
  };

  const placeBet = async () => {
    if (gameState !== 'waiting') return;
    setCurrentBet(betAmount);
  };

  const cashOut = async (cashOutMultiplier?: number) => {
    if (!currentBet || gameState !== 'flying') return;
    
    const finalMultiplier = cashOutMultiplier || multiplier;
    
    try {
      const response = await fetch('/api/games/aviator/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo_token_' + Date.now()
        },
        body: JSON.stringify({
          betAmount: currentBet,
          cashOutMultiplier: finalMultiplier
        })
      });

      if (response.ok) {
        const winAmount = Math.floor(currentBet * finalMultiplier);
        
        setResult({
          crashed: false,
          finalMultiplier,
          isWin: true,
          winAmount
        });
        
        setHistory(prev => [finalMultiplier, ...prev.slice(0, 4)]);
        setCurrentBet(null);
        refreshBalance();
      }
    } catch (error) {
      console.error('Cash out error:', error);
    }
  };

  return (
    <div className="enhanced-aviator-game">
      <div className="game-header">
        <button onClick={onClose} className="close-btn">← Back</button>
        <h2>Aviator</h2>
        <div className="balance">₹8,807</div>
      </div>

      <div className="game-canvas-container">
        <canvas ref={canvasRef} className="game-canvas" width={800} height={400}></canvas>
        
        {/* Enhanced visual elements */}
        <div className="sky-background">
          <div className="clouds"></div>
          <div className="mountains"></div>
        </div>
        
        <div 
          className={`plane ${isFlying ? 'flying' : ''} ${gameState === 'crashed' ? 'crashed' : ''}`}
          style={{
            transform: `translate(${planePosition.x}px, ${planePosition.y}px)`,
            transition: gameState === 'crashed' ? 'all 0.5s ease-out' : 'none'
          }}
        >
          ✈️
        </div>
        
        <div className="multiplier-display">
          <div className={`multiplier ${gameState === 'crashed' ? 'crashed' : ''}`}>
            {multiplier.toFixed(2)}x
          </div>
          {gameState === 'waiting' && (
            <div className="countdown">
              Starting in {countdown}s
            </div>
          )}
        </div>
        
        <div className="trajectory-line"></div>
      </div>

      <div className="game-stats">
        <div className="stat">
          <span>Max Win:</span>
          <span className="highlight">₹2,50,000</span>
        </div>
        <div className="stat">
          <span>Players Online:</span>
          <span className="highlight">1,247</span>
        </div>
        <div className="stat">
          <span>Round:</span>
          <span className="highlight">#12847</span>
        </div>
      </div>

      <div className="history-bar">
        <span>Recent: </span>
        {history.map((mult, idx) => (
          <span key={idx} className={`history-multiplier ${mult >= 2 ? 'good' : mult >= 1.5 ? 'normal' : 'low'}`}>
            {mult.toFixed(2)}x
          </span>
        ))}
      </div>

      <div className="betting-panel">
        <div className="bet-controls">
          <div className="bet-input">
            <label>Bet Amount</label>
            <div className="amount-selector">
              <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))}>-</button>
              <input 
                type="number" 
                value={betAmount} 
                onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
                min="10"
              />
              <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
            </div>
            <div className="quick-amounts">
              {[100, 500, 1000, 5000].map(amount => (
                <button 
                  key={amount}
                  className={betAmount === amount ? 'active' : ''}
                  onClick={() => setBetAmount(amount)}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>
          
          <div className="auto-cashout">
            <label>Auto Cash Out</label>
            <input 
              type="number" 
              step="0.01" 
              min="1.01"
              placeholder="2.00x"
              value={autoCashOut || ''}
              onChange={(e) => setAutoCashOut(parseFloat(e.target.value) || null)}
            />
          </div>
        </div>

        <div className="action-buttons">
          {!currentBet && gameState === 'waiting' && (
            <button className="bet-btn" onClick={placeBet}>
              Place Bet ₹{betAmount}
            </button>
          )}
          
          {currentBet && gameState === 'flying' && (
            <button className="cashout-btn" onClick={() => cashOut()}>
              Cash Out {multiplier.toFixed(2)}x
              <div className="potential-win">₹{Math.floor(currentBet * multiplier)}</div>
            </button>
          )}
          
          {gameState === 'crashed' && result && (
            <div className={`game-result ${result.isWin ? 'win' : 'lose'}`}>
              {result.isWin ? (
                <>
                  <div className="result-title">You Won!</div>
                  <div className="result-amount">₹{result.winAmount}</div>
                </>
              ) : (
                <>
                  <div className="result-title">Crashed at {result.finalMultiplier.toFixed(2)}x</div>
                  <div className="result-amount">Try again!</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .enhanced-aviator-game {
          background: linear-gradient(135deg, #0f4c75 0%, #3282b8 50%, #bbe1fa 100%);
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 10px;
          border-radius: 8px;
          transition: background 0.3s;
        }

        .close-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .balance {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          padding: 10px 20px;
          border-radius: 25px;
          color: #333;
          font-weight: bold;
          font-size: 18px;
        }

        .game-canvas-container {
          position: relative;
          height: 400px;
          margin: 20px;
          border-radius: 15px;
          overflow: hidden;
          background: linear-gradient(to bottom, #87CEEB 0%, #98FB98 100%);
          box-shadow: inset 0 0 50px rgba(0,0,0,0.1);
        }

        .sky-background {
          position: absolute;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="3" fill="white" opacity="0.6"/><circle cx="80" cy="30" r="5" fill="white" opacity="0.4"/><circle cx="60" cy="15" r="2" fill="white" opacity="0.7"/></svg>');
        }

        .clouds::before {
          content: '☁️☁️☁️☁️☁️';
          position: absolute;
          top: 10%;
          left: 0;
          width: 200%;
          font-size: 24px;
          animation: drift 20s linear infinite;
          opacity: 0.7;
        }

        .mountains {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(to top, #2F4F4F 0%, #708090 50%, #87CEEB 100%);
          clip-path: polygon(0 100%, 20% 60%, 40% 80%, 60% 40%, 80% 70%, 100% 50%, 100% 100%);
        }

        @keyframes drift {
          from { transform: translateX(-100%); }
          to { transform: translateX(0%); }
        }

        .plane {
          position: absolute;
          font-size: 32px;
          transform-origin: center;
          transition: all 0.1s ease-out;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
          z-index: 10;
        }

        .plane.flying {
          animation: fly 0.2s ease-in-out infinite alternate;
        }

        .plane.crashed {
          animation: crash 0.5s ease-out forwards;
          filter: drop-shadow(2px 2px 8px rgba(255,0,0,0.8));
        }

        @keyframes fly {
          0% { transform: rotate(-5deg) scale(1); }
          100% { transform: rotate(5deg) scale(1.1); }
        }

        @keyframes crash {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(0.5) translateY(50px); }
        }

        .multiplier-display {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 5;
        }

        .multiplier {
          font-size: 48px;
          font-weight: bold;
          color: #FFD700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
          animation: pulse 1s ease-in-out infinite;
        }

        .multiplier.crashed {
          color: #ff4444;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .countdown {
          font-size: 24px;
          color: white;
          margin-top: 10px;
          background: rgba(0,0,0,0.5);
          padding: 10px 20px;
          border-radius: 25px;
        }

        .trajectory-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, transparent, #FFD700, transparent);
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .game-stats {
          display: flex;
          justify-content: space-around;
          padding: 15px 20px;
          background: rgba(0,0,0,0.2);
          margin: 0 20px;
          border-radius: 10px;
        }

        .stat {
          text-align: center;
        }

        .stat .highlight {
          color: #FFD700;
          font-weight: bold;
          font-size: 18px;
        }

        .history-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 20px;
          overflow-x: auto;
        }

        .history-multiplier {
          padding: 8px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          white-space: nowrap;
        }

        .history-multiplier.good {
          background: #4CAF50;
          color: white;
        }

        .history-multiplier.normal {
          background: #FF9800;
          color: white;
        }

        .history-multiplier.low {
          background: #f44336;
          color: white;
        }

        .betting-panel {
          padding: 20px;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
          margin: 20px;
          border-radius: 15px;
        }

        .bet-controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .bet-input label,
        .auto-cashout label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .amount-selector {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .amount-selector button {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 15px 20px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
        }

        .amount-selector input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          padding: 15px;
        }

        .quick-amounts {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .quick-amounts button {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .quick-amounts button.active,
        .quick-amounts button:hover {
          background: #FFD700;
          color: #333;
          transform: scale(1.05);
        }

        .auto-cashout input {
          width: 100%;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 15px;
          border-radius: 10px;
          font-size: 16px;
        }

        .action-buttons {
          text-align: center;
        }

        .bet-btn,
        .cashout-btn {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          border: none;
          color: white;
          padding: 20px 40px;
          border-radius: 50px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(76,175,80,0.4);
        }

        .cashout-btn {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          color: #333;
          box-shadow: 0 4px 15px rgba(255,215,0,0.4);
          position: relative;
        }

        .bet-btn:hover,
        .cashout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(76,175,80,0.6);
        }

        .cashout-btn:hover {
          box-shadow: 0 6px 20px rgba(255,215,0,0.6);
        }

        .potential-win {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.8);
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          white-space: nowrap;
        }

        .game-result {
          background: rgba(0,0,0,0.8);
          padding: 30px;
          border-radius: 15px;
          text-align: center;
        }

        .game-result.win {
          border: 2px solid #4CAF50;
          box-shadow: 0 0 20px rgba(76,175,80,0.5);
        }

        .game-result.lose {
          border: 2px solid #f44336;
          box-shadow: 0 0 20px rgba(244,67,54,0.5);
        }

        .result-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .result-amount {
          font-size: 32px;
          font-weight: bold;
          color: #FFD700;
        }

        @media (max-width: 768px) {
          .bet-controls {
            grid-template-columns: 1fr;
          }
          
          .game-canvas-container {
            height: 300px;
            margin: 10px;
          }
          
          .multiplier {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  );
};