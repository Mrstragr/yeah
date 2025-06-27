import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface StandardPlinkoGameProps {
  onClose: () => void;
  refreshBalance: () => Promise<void>;
}

export const StandardPlinkoGame = ({ onClose, refreshBalance }: StandardPlinkoGameProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [ballPosition, setBallPosition] = useState<number | null>(null);

  const { toast } = useToast();

  const multipliers = {
    low: [1.5, 1.2, 1.1, 1.0, 0.5, 0.3, 0.5, 1.0, 1.1, 1.2, 1.5],
    medium: [5.6, 2.1, 1.1, 1.0, 0.5, 0.2, 0.5, 1.0, 1.1, 2.1, 5.6],
    high: [29, 8.1, 3.0, 1.5, 1.0, 0.2, 1.0, 1.5, 3.0, 8.1, 29]
  };

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 10) return '#dc2626'; // Red for high
    if (multiplier >= 2) return '#ea580c'; // Orange for medium
    if (multiplier >= 1) return '#10b981'; // Green for win
    return '#6b7280'; // Gray for loss
  };

  const playGame = async () => {
    if (betAmount < 1) {
      toast({
        title: 'Invalid Bet',
        description: 'Minimum bet amount is ₹1',
        variant: 'destructive',
      });
      return;
    }

    setIsPlaying(true);
    setGameResult(null);
    setBallPosition(null);

    // Simulate ball drop
    setTimeout(() => {
      const randomSlot = Math.floor(Math.random() * multipliers[riskLevel].length);
      const multiplier = multipliers[riskLevel][randomSlot];
      const winAmount = betAmount * multiplier;
      const isWin = multiplier >= 1;

      setBallPosition(randomSlot);

      const result = {
        isWin,
        winAmount,
        multiplier,
        slot: randomSlot
      };

      setGameResult(result);

      if (isWin && multiplier > 1) {
        toast({
          title: 'Congratulations!',
          description: `You won ₹${winAmount.toFixed(2)} with ${multiplier}x!`,
        });
      } else if (multiplier === 1) {
        toast({
          title: 'Break Even',
          description: 'You got your bet back!',
        });
      } else {
        toast({
          title: 'Try Again',
          description: `${multiplier}x - Better luck next time!`,
          variant: 'destructive',
        });
      }

      // Call API
      apiRequest('POST', '/api/games/plinko/play', {
        betAmount,
        riskLevel
      }).then(async () => {
        await refreshBalance();
      }).catch((error) => {
        console.error('API error:', error);
      });

      setIsPlaying(false);
    }, 3000);
  };

  return (
    <div className="plinko-game">
      <div className="game-header">
        <button onClick={onClose} className="back-button">
          ← Back
        </button>
        <h2>Plinko</h2>
        <div className="risk-display">{riskLevel.toUpperCase()}</div>
      </div>

      <div className="game-content">
        {/* Plinko Board */}
        <div className="plinko-board">
          <div className="board-container">
            {/* Pegs */}
            <div className="pegs">
              {Array.from({ length: 8 }, (_, row) => (
                <div key={row} className="peg-row" style={{ left: `${50 - (row * 12.5)}%` }}>
                  {Array.from({ length: row + 3 }, (_, col) => (
                    <div key={col} className="peg"></div>
                  ))}
                </div>
              ))}
            </div>

            {/* Ball */}
            {isPlaying && (
              <div className="ball-container">
                <div className="ball dropping"></div>
              </div>
            )}

            {/* Drop zone indicator */}
            <div className="drop-zone">
              <div className="drop-arrow">⬇</div>
              <span>DROP</span>
            </div>

            {/* Multiplier slots */}
            <div className="multiplier-slots">
              {multipliers[riskLevel].map((multiplier, index) => (
                <div
                  key={index}
                  className={`slot ${ballPosition === index ? 'active' : ''}`}
                  style={{ backgroundColor: getMultiplierColor(multiplier) }}
                >
                  <span className="multiplier-value">{multiplier}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="control-group">
            <label>Bet Amount</label>
            <div className="bet-controls">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min="1"
                max="100000"
                disabled={isPlaying}
                className="bet-input"
              />
              <div className="quick-bets">
                {[10, 50, 100, 500].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    disabled={isPlaying}
                    className={`quick-bet ${betAmount === amount ? 'active' : ''}`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="control-group">
            <label>Risk Level</label>
            <div className="risk-controls">
              {(['low', 'medium', 'high'] as const).map(risk => (
                <button
                  key={risk}
                  onClick={() => setRiskLevel(risk)}
                  disabled={isPlaying}
                  className={`risk-btn ${riskLevel === risk ? 'active' : ''}`}
                >
                  {risk.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="multiplier-info">
            <h4>Multipliers ({riskLevel})</h4>
            <div className="multiplier-preview">
              {multipliers[riskLevel].map((mult, index) => (
                <span
                  key={index}
                  className="mult-chip"
                  style={{ backgroundColor: getMultiplierColor(mult) }}
                >
                  {mult}x
                </span>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={playGame} 
          disabled={isPlaying}
          className="play-button"
        >
          {isPlaying ? 'Dropping Ball...' : `Drop Ball - ₹${betAmount}`}
        </button>

        {gameResult && (
          <div className="result-display">
            <h3>Result</h3>
            <div className="result-info">
              <p>Slot: {gameResult.slot + 1}</p>
              <p>Multiplier: {gameResult.multiplier}x</p>
              <p className={gameResult.multiplier >= 1 ? 'win' : 'lose'}>
                {gameResult.multiplier >= 1 ? 
                  `Won ₹${gameResult.winAmount.toFixed(2)}` : 
                  `Lost ₹${betAmount}`
                }
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .plinko-game {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          z-index: 1000;
          overflow-y: auto;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .back-button {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }

        .risk-display {
          background: linear-gradient(45deg, #1e40af, #3b82f6);
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
        }

        .game-content {
          padding: 20px;
        }

        .plinko-board {
          margin-bottom: 30px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .board-container {
          position: relative;
          height: 300px;
          max-width: 400px;
          margin: 0 auto;
        }

        .pegs {
          position: relative;
          height: 240px;
        }

        .peg-row {
          position: absolute;
          display: flex;
          gap: 25px;
          top: calc(var(--row) * 30px);
        }

        .peg-row:nth-child(1) { --row: 0; }
        .peg-row:nth-child(2) { --row: 1; }
        .peg-row:nth-child(3) { --row: 2; }
        .peg-row:nth-child(4) { --row: 3; }
        .peg-row:nth-child(5) { --row: 4; }
        .peg-row:nth-child(6) { --row: 5; }
        .peg-row:nth-child(7) { --row: 6; }
        .peg-row:nth-child(8) { --row: 7; }

        .peg {
          width: 8px;
          height: 8px;
          background: #6b7280;
          border-radius: 50%;
          box-shadow: 0 0 5px rgba(107, 114, 128, 0.5);
        }

        .ball-container {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
        }

        .ball {
          width: 12px;
          height: 12px;
          background: linear-gradient(45deg, #fbbf24, #f59e0b);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
        }

        .ball.dropping {
          animation: ballDrop 3s ease-in-out forwards;
        }

        @keyframes ballDrop {
          0% { transform: translateY(0) translateX(0); }
          10% { transform: translateY(30px) translateX(-5px); }
          20% { transform: translateY(60px) translateX(8px); }
          30% { transform: translateY(90px) translateX(-12px); }
          40% { transform: translateY(120px) translateX(15px); }
          50% { transform: translateY(150px) translateX(-8px); }
          60% { transform: translateY(180px) translateX(10px); }
          70% { transform: translateY(210px) translateX(-6px); }
          80% { transform: translateY(240px) translateX(4px); }
          90% { transform: translateY(270px) translateX(-2px); }
          100% { transform: translateY(300px) translateX(0); }
        }

        .drop-zone {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: #fbbf24;
          font-size: 12px;
          font-weight: bold;
        }

        .drop-arrow {
          font-size: 16px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
          60% { transform: translateY(-3px); }
        }

        .multiplier-slots {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          gap: 2px;
        }

        .slot {
          flex: 1;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .slot.active {
          border-color: #fbbf24;
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.5);
          animation: slotPulse 0.5s ease-out;
        }

        @keyframes slotPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .multiplier-value {
          color: white;
          font-size: 10px;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .controls-section {
          margin-bottom: 30px;
        }

        .control-group {
          margin-bottom: 20px;
        }

        .control-group label {
          display: block;
          margin-bottom: 10px;
          color: #fbbf24;
          font-weight: 500;
        }

        .bet-controls {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .bet-input {
          padding: 12px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: white;
          font-size: 16px;
          width: 200px;
        }

        .quick-bets, .risk-controls {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .quick-bet, .risk-btn {
          padding: 8px 16px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .quick-bet.active {
          background: linear-gradient(45deg, #1e40af, #3b82f6);
          border-color: #1e40af;
        }

        .risk-btn.active {
          background: linear-gradient(45deg, #1e40af, #3b82f6);
          border-color: #1e40af;
        }

        .multiplier-info {
          background: rgba(255,255,255,0.1);
          padding: 15px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .multiplier-info h4 {
          margin-bottom: 10px;
          color: #fbbf24;
          font-size: 14px;
        }

        .multiplier-preview {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .mult-chip {
          padding: 4px 8px;
          border-radius: 8px;
          color: white;
          font-size: 10px;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .play-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(45deg, #1e40af, #3b82f6);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        .play-button:disabled {
          background: #374151;
          cursor: not-allowed;
        }

        .play-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(30, 64, 175, 0.3);
        }

        .result-display {
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .result-display h3 {
          margin-bottom: 15px;
          color: #fbbf24;
        }

        .result-info p {
          margin: 8px 0;
          font-size: 16px;
        }

        .result-info p.win {
          color: #10b981;
          font-weight: bold;
        }

        .result-info p.lose {
          color: #dc2626;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .board-container {
            height: 250px;
            max-width: 350px;
          }

          .pegs {
            height: 190px;
          }

          .peg-row {
            gap: 20px;
          }

          .bet-input {
            width: 100%;
          }

          .multiplier-preview {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};