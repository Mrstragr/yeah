import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface StandardLimboGameProps {
  onClose: () => void;
  refreshBalance: () => Promise<void>;
}

export const StandardLimboGame = ({ onClose, refreshBalance }: StandardLimboGameProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [targetMultiplier, setTargetMultiplier] = useState(2.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [finalMultiplier, setFinalMultiplier] = useState<number | null>(null);

  const { toast } = useToast();

  const playGame = async () => {
    if (betAmount < 1) {
      toast({
        title: 'Invalid Bet',
        description: 'Minimum bet amount is ₹1',
        variant: 'destructive',
      });
      return;
    }

    if (targetMultiplier < 1.01) {
      toast({
        title: 'Invalid Multiplier',
        description: 'Minimum target multiplier is 1.01x',
        variant: 'destructive',
      });
      return;
    }

    setIsPlaying(true);
    setGameResult(null);
    setFinalMultiplier(null);

    // Simulate game result
    setTimeout(async () => {
      const randomMultiplier = Math.random() * 10 + 1; // Random between 1 and 11
      setFinalMultiplier(randomMultiplier);

      const isWin = randomMultiplier >= targetMultiplier;
      const winAmount = isWin ? betAmount * targetMultiplier : 0;

      const result = {
        isWin,
        winAmount,
        multiplier: randomMultiplier,
        targetMultiplier
      };

      setGameResult(result);

      if (isWin) {
        toast({
          title: 'Congratulations!',
          description: `You won ₹${winAmount.toFixed(2)}!`,
        });
      } else {
        toast({
          title: 'Better luck next time',
          description: `Target: ${targetMultiplier}x, Result: ${randomMultiplier.toFixed(2)}x`,
          variant: 'destructive',
        });
      }

      try {
        const response = await apiRequest('POST', '/api/games/limbo/play', {
          betAmount,
          targetMultiplier
        });
        await refreshBalance();
      } catch (error: any) {
        console.error('API error:', error);
      }

      setIsPlaying(false);
    }, 2000);
  };

  return (
    <div className="limbo-game">
      <div className="game-header">
        <button onClick={onClose} className="back-button">
          ← Back
        </button>
        <h2>Limbo</h2>
        <div className="target-display">{targetMultiplier.toFixed(2)}x</div>
      </div>

      <div className="game-content">
        <div className="result-section">
          {finalMultiplier !== null ? (
            <div className="multiplier-result">
              <div className="final-multiplier">
                {finalMultiplier.toFixed(2)}x
              </div>
              <div className="result-status">
                {gameResult?.isWin ? '🎉 WIN!' : '💔 BUST!'}
              </div>
            </div>
          ) : isPlaying ? (
            <div className="loading-multiplier">
              <div className="spinner"></div>
              <span>Rolling...</span>
            </div>
          ) : (
            <div className="waiting-state">
              <div className="infinity-symbol">∞</div>
              <p>Set your target and play!</p>
            </div>
          )}
        </div>

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
            <label>Target Multiplier</label>
            <div className="multiplier-controls">
              <input
                type="number"
                value={targetMultiplier}
                onChange={(e) => setTargetMultiplier(Number(e.target.value))}
                min="1.01"
                max="1000"
                step="0.01"
                disabled={isPlaying}
                className="multiplier-input"
              />
              <div className="multiplier-presets">
                {[1.5, 2.0, 5.0, 10.0].map(mult => (
                  <button
                    key={mult}
                    onClick={() => setTargetMultiplier(mult)}
                    disabled={isPlaying}
                    className={`preset-btn ${targetMultiplier === mult ? 'active' : ''}`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="payout-info">
            <div className="payout-row">
              <span>Potential Win:</span>
              <span className="payout-amount">₹{(betAmount * targetMultiplier).toFixed(2)}</span>
            </div>
            <div className="payout-row">
              <span>Win Chance:</span>
              <span className="win-chance">{(100 / targetMultiplier).toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <button 
          onClick={playGame} 
          disabled={isPlaying}
          className="play-button"
        >
          {isPlaying ? 'Rolling...' : `Bet ₹${betAmount} for ${targetMultiplier}x`}
        </button>

        {gameResult && (
          <div className="result-display">
            <h3>Game Result</h3>
            <div className="result-details">
              <p>Target: {gameResult.targetMultiplier}x</p>
              <p>Result: {gameResult.multiplier.toFixed(2)}x</p>
              <p className={gameResult.isWin ? 'win' : 'lose'}>
                {gameResult.isWin ? 
                  `Won ₹${gameResult.winAmount.toFixed(2)}` : 
                  `Lost ₹${betAmount}`
                }
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .limbo-game {
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

        .target-display {
          background: linear-gradient(45deg, #7c3aed, #5b21b6);
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 16px;
        }

        .game-content {
          padding: 20px;
        }

        .result-section {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .multiplier-result {
          text-align: center;
        }

        .final-multiplier {
          font-size: 48px;
          font-weight: bold;
          background: linear-gradient(45deg, #10b981, #3b82f6);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }

        .result-status {
          font-size: 24px;
          font-weight: bold;
        }

        .loading-multiplier {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255,255,255,0.1);
          border-left: 4px solid #7c3aed;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .waiting-state {
          text-align: center;
        }

        .infinity-symbol {
          font-size: 60px;
          color: #7c3aed;
          margin-bottom: 15px;
        }

        .controls-section {
          margin-bottom: 30px;
        }

        .control-group {
          margin-bottom: 25px;
        }

        .control-group label {
          display: block;
          margin-bottom: 10px;
          color: #fbbf24;
          font-weight: 500;
        }

        .bet-controls, .multiplier-controls {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .bet-input, .multiplier-input {
          padding: 12px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: white;
          font-size: 16px;
          width: 200px;
        }

        .quick-bets, .multiplier-presets {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .quick-bet, .preset-btn {
          padding: 8px 16px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .quick-bet.active, .preset-btn.active {
          background: linear-gradient(45deg, #7c3aed, #5b21b6);
          border-color: #7c3aed;
        }

        .payout-info {
          background: rgba(255,255,255,0.1);
          padding: 15px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .payout-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .payout-row:last-child {
          margin-bottom: 0;
        }

        .payout-amount {
          color: #10b981;
          font-weight: bold;
        }

        .win-chance {
          color: #fbbf24;
          font-weight: bold;
        }

        .play-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(45deg, #7c3aed, #5b21b6);
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
          box-shadow: 0 10px 25px rgba(124, 58, 237, 0.3);
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

        .result-details p {
          margin: 8px 0;
          font-size: 16px;
        }

        .result-details p.win {
          color: #10b981;
          font-weight: bold;
        }

        .result-details p.lose {
          color: #dc2626;
          font-weight: bold;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .result-section {
            height: 150px;
          }

          .final-multiplier {
            font-size: 36px;
          }

          .result-status {
            font-size: 18px;
          }

          .infinity-symbol {
            font-size: 40px;
          }

          .bet-input, .multiplier-input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};