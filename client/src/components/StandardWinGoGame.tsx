import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface StandardWinGoGameProps {
  onClose: () => void;
  refreshBalance: () => Promise<void>;
}

export const StandardWinGoGame = ({ onClose, refreshBalance }: StandardWinGoGameProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<string>('green');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(60);

  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 60; // Reset to 60 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const betOptions = [
    { id: 'green', label: 'Green', color: '#10b981', multiplier: '2x' },
    { id: 'red', label: 'Red', color: '#dc2626', multiplier: '2x' },
    { id: 'violet', label: 'Violet', color: '#7c3aed', multiplier: '4.5x' },
    { id: 'small', label: 'Small (0-4)', color: '#3b82f6', multiplier: '2x' },
    { id: 'big', label: 'Big (5-9)', color: '#f59e0b', multiplier: '2x' },
  ];

  const numberOptions = Array.from({ length: 10 }, (_, i) => ({
    id: i.toString(),
    label: i.toString(),
    color: i === 0 || i === 5 ? '#7c3aed' : i % 2 === 0 ? '#dc2626' : '#10b981',
    multiplier: i === 0 || i === 5 ? '4.5x' : '9x'
  }));

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
    try {
      const response = await apiRequest('POST', '/api/games/wingo/play', {
        betAmount,
        betType: isNaN(Number(selectedBet)) ? 'color' : 'number',
        betValue: selectedBet
      });

      const result = await response.json();
      setGameResult(result);
      
      if (result.isWin) {
        toast({
          title: 'Congratulations!',
          description: `You won ₹${result.winAmount}!`,
        });
      } else {
        toast({
          title: 'Better luck next time',
          description: 'Try again in the next round',
          variant: 'destructive',
        });
      }

      await refreshBalance();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to place bet',
        variant: 'destructive',
      });
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="wingo-game">
      <div className="game-header">
        <button onClick={onClose} className="back-button">
          ← Back
        </button>
        <h2>Win Go</h2>
        <div className="timer">
          {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
          {String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      <div className="game-content">
        {/* Last Results */}
        <div className="results-section">
          <h3>Recent Results</h3>
          <div className="results-grid">
            {[3, 7, 1, 9, 5, 2, 8, 0, 4, 6].map((num, index) => (
              <div
                key={index}
                className="result-item"
                style={{
                  backgroundColor: num === 0 || num === 5 ? '#7c3aed' : 
                                 num % 2 === 0 ? '#dc2626' : '#10b981'
                }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Bet Selection */}
        <div className="betting-section">
          <h3>Choose Your Bet</h3>
          
          {/* Color Bets */}
          <div className="bet-grid">
            {betOptions.map(option => (
              <button
                key={option.id}
                className={`bet-option ${selectedBet === option.id ? 'selected' : ''}`}
                style={{ backgroundColor: option.color }}
                onClick={() => setSelectedBet(option.id)}
              >
                <span className="bet-label">{option.label}</span>
                <span className="multiplier">{option.multiplier}</span>
              </button>
            ))}
          </div>

          {/* Number Bets */}
          <div className="numbers-grid">
            {numberOptions.map(option => (
              <button
                key={option.id}
                className={`number-option ${selectedBet === option.id ? 'selected' : ''}`}
                style={{ backgroundColor: option.color }}
                onClick={() => setSelectedBet(option.id)}
              >
                <span className="number">{option.label}</span>
                <span className="multiplier">{option.multiplier}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bet Amount */}
        <div className="bet-amount-section">
          <h3>Bet Amount</h3>
          <div className="amount-controls">
            <div className="quick-amounts">
              {[10, 50, 100, 500, 1000].map(amount => (
                <button
                  key={amount}
                  className={`amount-btn ${betAmount === amount ? 'active' : ''}`}
                  onClick={() => setBetAmount(amount)}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
            <div className="custom-amount">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min="1"
                max="100000"
                className="amount-input"
              />
            </div>
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={playGame}
          disabled={isPlaying || timeLeft < 10}
          className="play-button"
        >
          {isPlaying ? 'Playing...' : timeLeft < 10 ? 'Waiting for next round...' : `Bet ₹${betAmount}`}
        </button>

        {/* Game Result */}
        {gameResult && (
          <div className="result-display">
            <h3>Game Result</h3>
            <div className="result-info">
              <p>Number: {gameResult.result?.number || 'N/A'}</p>
              <p>Period: {gameResult.result?.period || 'N/A'}</p>
              <p className={gameResult.isWin ? 'win' : 'lose'}>
                {gameResult.isWin ? `Won ₹${gameResult.winAmount}` : `Lost ₹${betAmount}`}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .wingo-game {
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
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .back-button {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          padding: 8px;
        }

        .timer {
          background: linear-gradient(45deg, #dc2626, #ef4444);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-family: monospace;
          font-size: 16px;
        }

        .game-content {
          padding: 20px;
        }

        .results-section {
          margin-bottom: 30px;
        }

        .results-section h3 {
          margin-bottom: 15px;
          color: #fbbf24;
        }

        .results-grid {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .result-item {
          min-width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
        }

        .betting-section {
          margin-bottom: 30px;
        }

        .betting-section h3 {
          margin-bottom: 15px;
          color: #fbbf24;
        }

        .bet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .bet-option {
          padding: 16px;
          border: 2px solid transparent;
          border-radius: 12px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.3s ease;
        }

        .bet-option.selected {
          border-color: #fbbf24;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
        }

        .numbers-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .number-option {
          aspect-ratio: 1;
          border: 2px solid transparent;
          border-radius: 12px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          transition: all 0.3s ease;
        }

        .number-option.selected {
          border-color: #fbbf24;
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.5);
        }

        .number {
          font-size: 18px;
        }

        .multiplier {
          font-size: 10px;
          opacity: 0.9;
        }

        .bet-amount-section {
          margin-bottom: 30px;
        }

        .bet-amount-section h3 {
          margin-bottom: 15px;
          color: #fbbf24;
        }

        .quick-amounts {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .amount-btn {
          padding: 10px 20px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .amount-btn.active {
          background: linear-gradient(45deg, #10b981, #059669);
          border-color: #10b981;
        }

        .amount-input {
          width: 100%;
          padding: 12px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: white;
          font-size: 16px;
        }

        .play-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(45deg, #10b981, #059669);
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
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
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
          .bet-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .numbers-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 6px;
          }

          .quick-amounts {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};