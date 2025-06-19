import { useState, useEffect } from 'react';

interface AviatorGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const AviatorGame = ({ onClose, refreshBalance }: AviatorGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [multiplier, setMultiplier] = useState(1.00);
  const [isFlying, setIsFlying] = useState(false);
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [autoCashOut, setAutoCashOut] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState([2.45, 1.23, 15.67, 1.05, 3.28]);

  useEffect(() => {
    let interval: any;
    
    if (gameState === 'flying') {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const newMultiplier = prev + 0.01 + (Math.random() * 0.02);
          
          // Random crash logic
          if (Math.random() < 0.001 * prev) {
            setGameState('crashed');
            setIsFlying(false);
            
            if (currentBet) {
              // Check if player cashed out
              setResult({
                crashed: true,
                finalMultiplier: newMultiplier,
                isWin: false,
                winAmount: 0
              });
            }
            
            setTimeout(() => {
              setGameState('waiting');
              setMultiplier(1.00);
              setCurrentBet(null);
              setResult(null);
            }, 3000);
            
            return newMultiplier;
          }
          
          // Auto cash out
          if (autoCashOut && newMultiplier >= autoCashOut && currentBet) {
            cashOut(newMultiplier);
          }
          
          return newMultiplier;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [gameState, currentBet, autoCashOut]);

  const startGame = () => {
    if (gameState === 'waiting') {
      setGameState('flying');
      setIsFlying(true);
      setMultiplier(1.00);
    }
  };

  const placeBet = async () => {
    if (gameState !== 'waiting') return;
    
    setCurrentBet(betAmount);
    startGame();
  };

  const cashOut = async (cashOutMultiplier?: number) => {
    if (!currentBet || gameState !== 'flying') return;
    
    const finalMultiplier = cashOutMultiplier || multiplier;
    
    try {
      const response = await fetch('/api/games/aviator/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo_token_1750315135559'
        },
        body: JSON.stringify({
          betAmount: currentBet,
          cashOutMultiplier: finalMultiplier
        })
      });

      if (response.ok) {
        const data = await response.json();
        const winAmount = Math.floor(currentBet * finalMultiplier);
        
        setResult({
          crashed: false,
          finalMultiplier,
          isWin: true,
          winAmount
        });
        
        setHistory(prev => [finalMultiplier, ...prev.slice(0, 4)]);
        refreshBalance();
        
        setTimeout(() => {
          setGameState('waiting');
          setMultiplier(1.00);
          setCurrentBet(null);
          setResult(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Aviator error:', error);
    }
    
    setGameState('crashed');
    setIsFlying(false);
  };

  return (
    <div className="aviator-game">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Aviator</h2>
        <div className="game-status">
          {gameState === 'waiting' && '✈️ Ready to Fly'}
          {gameState === 'flying' && '🚀 Flying'}
          {gameState === 'crashed' && '💥 Crashed'}
        </div>
      </div>

      <div className="game-area">
        <div className="sky-background">
          <div className={`plane ${isFlying ? 'flying' : ''}`}>✈️</div>
          <div className="multiplier-display">
            <span className={`multiplier ${gameState === 'flying' ? 'active' : ''}`}>
              {multiplier.toFixed(2)}x
            </span>
          </div>
        </div>
      </div>

      <div className="history-bar">
        <span>Recent: </span>
        {history.map((mult, idx) => (
          <span key={idx} className={`history-multiplier ${mult >= 2 ? 'good' : 'normal'}`}>
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
              <span>₹{betAmount}</span>
              <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
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
              Bet ₹{betAmount}
            </button>
          )}
          
          {currentBet && gameState === 'flying' && (
            <button className="cashout-btn" onClick={() => cashOut()}>
              Cash Out {multiplier.toFixed(2)}x
            </button>
          )}
          
          {gameState === 'crashed' && (
            <div className="game-over">
              {result?.isWin ? `Won ₹${result.winAmount}!` : 'Crashed!'}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .aviator-game {
          background: linear-gradient(180deg, #87CEEB 0%, #4169E1 100%);
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(0,0,0,0.2);
          color: white;
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .game-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .game-status {
          font-size: 14px;
          background: rgba(255,255,255,0.2);
          padding: 5px 10px;
          border-radius: 15px;
        }

        .game-area {
          height: 400px;
          position: relative;
          overflow: hidden;
        }

        .sky-background {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%);
          position: relative;
        }

        .plane {
          position: absolute;
          bottom: 50px;
          left: 50px;
          font-size: 32px;
          transition: all 0.1s ease;
          z-index: 2;
        }

        .plane.flying {
          animation: fly 0.1s ease infinite;
        }

        @keyframes fly {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        .multiplier-display {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
        }

        .multiplier {
          font-size: 48px;
          font-weight: bold;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          transition: all 0.1s ease;
        }

        .multiplier.active {
          animation: pulse 0.5s ease infinite;
          color: #FFD700;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .history-bar {
          padding: 15px 20px;
          background: rgba(0,0,0,0.1);
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .history-multiplier {
          background: rgba(255,255,255,0.2);
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: bold;
        }

        .history-multiplier.good {
          background: #4CAF50;
        }

        .betting-panel {
          padding: 20px;
          background: white;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }

        .bet-controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .bet-input label, .auto-cashout label {
          display: block;
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .amount-selector {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 8px;
          padding: 5px;
        }

        .amount-selector button {
          background: #ddd;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        .amount-selector span {
          flex: 1;
          text-align: center;
          font-weight: bold;
        }

        .auto-cashout input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
        }

        .action-buttons {
          text-align: center;
        }

        .bet-btn, .cashout-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .bet-btn {
          background: #4CAF50;
          color: white;
        }

        .bet-btn:hover {
          background: #45a049;
        }

        .cashout-btn {
          background: #FF6B6B;
          color: white;
          animation: pulse-red 1s ease infinite;
        }

        @keyframes pulse-red {
          0% { background: #FF6B6B; }
          50% { background: #ff5252; }
          100% { background: #FF6B6B; }
        }

        .game-over {
          font-size: 18px;
          font-weight: bold;
          padding: 15px;
          border-radius: 10px;
          background: #f5f5f5;
          color: #333;
        }
      `}</style>
    </div>
  );
};