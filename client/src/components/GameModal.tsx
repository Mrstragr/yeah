import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface GameModalProps {
  game: {
    name: string;
    type: string;
    icon: string;
    multiplier?: string;
  };
  onClose: () => void;
  walletBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

export const GameModal = ({ game, onClose, walletBalance, onBalanceUpdate }: GameModalProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);

  const quickBetAmounts = [50, 100, 500, 1000, 5000];

  const handleBetChange = (amount: number) => {
    const balance = Number(walletBalance || 0);
    setBetAmount(Math.max(10, Math.min(amount, balance)));
  };

  const handlePlay = async () => {
    const balance = Number(walletBalance || 0);
    if (betAmount > balance) return;
    
    setIsPlaying(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/games/${game.type}/play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          betAmount,
          gameType: game.type,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setGameResult(result);
        const balance = Number(walletBalance || 0);
        onBalanceUpdate(balance + result.winAmount - betAmount);
      }
    } catch (error) {
      console.error('Game play error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const renderGameInterface = () => {
    switch (game.type) {
      case 'aviator':
        return (
          <div className="aviator-interface">
            <div className="aviator-display">
              <div className="plane-icon">✈️</div>
              <div className="multiplier-display">
                {gameResult ? `${gameResult.multiplier}x` : '1.00x'}
              </div>
            </div>
            {gameResult && (
              <div className="result-display">
                <div className={`result ${gameResult.isWin ? 'win' : 'lose'}`}>
                  {gameResult.isWin ? `Won ₹${gameResult.winAmount}` : 'Crashed!'}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'dice':
        return (
          <div className="dice-interface">
            <div className="dice-display">
              <div className="dice-icon">🎲</div>
              {gameResult && (
                <div className="dice-result">
                  <div className="dice-number">{gameResult.result}</div>
                </div>
              )}
            </div>
            {gameResult && (
              <div className="result-display">
                <div className={`result ${gameResult.isWin ? 'win' : 'lose'}`}>
                  {gameResult.isWin ? `Won ₹${gameResult.winAmount}` : `Lost ₹${betAmount}`}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'mines':
        return (
          <div className="mines-interface">
            <div className="mines-grid">
              {Array.from({ length: 25 }, (_, i) => (
                <div key={i} className="mine-tile">
                  💎
                </div>
              ))}
            </div>
            {gameResult && (
              <div className="result-display">
                <div className={`result ${gameResult.isWin ? 'win' : 'lose'}`}>
                  {gameResult.isWin ? `Won ₹${gameResult.winAmount}` : 'Hit a mine!'}
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="default-game-interface">
            <div className="game-icon-large">{game.icon}</div>
            <div className="game-status">
              {gameResult ? (
                <div className={`result ${gameResult.isWin ? 'win' : 'lose'}`}>
                  {gameResult.isWin ? `Won ₹${gameResult.winAmount}` : `Lost ₹${betAmount}`}
                </div>
              ) : (
                <div className="ready-to-play">Ready to play!</div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="game-modal">
        <div className="modal-header">
          <div className="game-title">
            <span className="game-icon">{game.icon}</span>
            <h2>{game.name}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="game-interface">
          {renderGameInterface()}
        </div>

        <div className="betting-panel">
          <div className="balance-display">
            <span>Balance: ₹{Number(walletBalance || 0).toFixed(2)}</span>
          </div>
          
          <div className="bet-controls">
            <div className="bet-amount-control">
              <button 
                className="bet-btn minus"
                onClick={() => handleBetChange(betAmount - 50)}
                disabled={betAmount <= 50}
              >
                <Minus size={16} />
              </button>
              <div className="bet-amount">₹{betAmount}</div>
              <button 
                className="bet-btn plus"
                onClick={() => handleBetChange(betAmount + 50)}
                disabled={betAmount >= Number(walletBalance || 0)}
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="quick-bets">
              {quickBetAmounts.map(amount => (
                <button
                  key={amount}
                  className={`quick-bet ${betAmount === amount ? 'active' : ''}`}
                  onClick={() => setBetAmount(amount)}
                  disabled={amount > Number(walletBalance || 0)}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>

          <button 
            className={`play-btn ${isPlaying ? 'playing' : ''}`}
            onClick={handlePlay}
            disabled={isPlaying || betAmount > Number(walletBalance || 0) || betAmount < 10}
          >
            {isPlaying ? 'Playing...' : `Bet ₹${betAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
};