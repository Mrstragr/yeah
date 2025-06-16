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

  const drawTrajectory = (canvas: HTMLCanvasElement, crashMultiplier: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(139, 69, 19, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 71, 87, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const x = (canvas.width / 10) * i;
      const y = (canvas.height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw trajectory curve
    ctx.strokeStyle = '#FF4757';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#FF4757';
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    
    const maxHeight = Math.min(crashMultiplier * 20, canvas.height - 20);
    const points = 50;
    
    for (let i = 0; i <= points; i++) {
      const x = (canvas.width / points) * i;
      const progress = i / points;
      const multiplier = 1 + (crashMultiplier - 1) * progress;
      const y = canvas.height - (multiplier - 1) * 30;
      
      if (progress < 0.8) {
        ctx.lineTo(x, y);
      } else {
        // Crash effect - sharp drop
        ctx.lineTo(x, canvas.height - 10);
        break;
      }
    }
    
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Fill area under curve
    ctx.fillStyle = 'rgba(255, 71, 87, 0.2)';
    ctx.fill();
  };

  const handleBetChange = (amount: number) => {
    const balance = Number(walletBalance || 0);
    setBetAmount(Math.max(10, Math.min(amount, balance)));
  };

  const handleTileClick = (tileIndex: number) => {
    // Simulate tile reveal animation
    console.log(`Tile ${tileIndex} clicked`);
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
        
        // Fetch updated balance from server (backend already handled the transaction)
        const balanceResponse = await fetch('/api/wallet/balance', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        let newBalance = walletBalance;
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          newBalance = balanceData.walletBalance;
          onBalanceUpdate(newBalance);
        }
        
        // Show detailed win/loss notification
        setTimeout(() => {
          if (result.isWin) {
            alert(`🎉 Congratulations! You won ₹${result.winAmount}! (${result.multiplier}x multiplier)\nNew balance: ₹${Number(newBalance || 0).toFixed(2)}`);
          } else {
            alert(`💥 Game over! You lost ₹${betAmount}.\nBetter luck next time!\nBalance: ₹${Number(newBalance || 0).toFixed(2)}`);
          }
        }, 800);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Game play failed. Please try again.');
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
            <div className="aviator-game-area">
              <div className="multiplier-history">
                <div className="history-item">1.94x</div>
                <div className="history-item">1.02x</div>
                <div className="history-item">1.00x</div>
                <div className="history-item">1.72x</div>
                <div className="history-item">1.19x</div>
                <div className="history-item">1.54x</div>
                <div className="history-item">1.00x</div>
              </div>
              
              <div className="aviator-main-display">
                <div className="trajectory-container">
                  <canvas 
                    className="trajectory-canvas" 
                    width="300" 
                    height="200"
                    ref={(canvas) => {
                      if (canvas && (isPlaying || gameResult)) {
                        drawTrajectory(canvas, gameResult?.result?.crashMultiplier || 1);
                      }
                    }}
                  />
                  
                  <div className={`plane-container ${isPlaying ? 'flying' : ''}`}>
                    <div className="plane">✈️</div>
                    <div className="plane-trail"></div>
                  </div>
                </div>
                
                <div className="current-multiplier">
                  <div className={`multiplier-text ${isPlaying ? 'climbing' : ''}`}>
                    {gameResult ? 
                      `${parseFloat(gameResult.result?.crashMultiplier || gameResult.multiplier).toFixed(2)}x` : 
                      isPlaying ? '1.00x' : '1.00x'
                    }
                  </div>
                </div>
                
                {gameResult && (
                  <div className="crash-indicator">
                    {gameResult.isWin ? 
                      <div className="cash-out-success">✓ Cashed Out!</div> : 
                      <div className="crashed">💥 CRASHED!</div>
                    }
                  </div>
                )}
              </div>
              
              <div className="betting-dots">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className={`betting-dot ${i < 5 ? 'active' : ''}`}></div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'dice':
        return (
          <div className="dice-interface">
            <div className="dice-display">
              <div className="dice-icon">🎲</div>
              {gameResult && (
                <div className="dice-result">
                  <div className="dice-number">
                    {typeof gameResult.result === 'object' ? gameResult.result.diceResult : gameResult.result}
                  </div>
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
            <div className="mines-stats">
              <div className="mines-info">
                <span className="mines-count">💣 Mines: 3</span>
                <span className="gems-found">💎 Gems: 0</span>
                <span className="multiplier">x1.00</span>
              </div>
            </div>
            
            <div className="mines-grid">
              {Array.from({ length: 25 }, (_, i) => (
                <div 
                  key={i} 
                  className={`mine-tile ${gameResult && i < 5 ? 'revealed' : ''} ${gameResult && gameResult.isWin && i < 3 ? 'gem' : ''} ${gameResult && !gameResult.isWin && i === 2 ? 'bomb exploded' : ''}`}
                  onClick={() => !gameResult && handleTileClick(i)}
                >
                  {gameResult && i < 5 ? (
                    gameResult.isWin && i < 3 ? '💎' : 
                    !gameResult.isWin && i === 2 ? '💥' : '💎'
                  ) : ''}
                  <div className="tile-glow"></div>
                  {gameResult && !gameResult.isWin && i === 2 && (
                    <div className="explosion-effect">
                      <div className="explosion-ring"></div>
                      <div className="explosion-particles"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {gameResult && (
              <div className="result-display">
                <div className={`result ${gameResult.isWin ? 'win' : 'lose'}`}>
                  {gameResult.isWin ? 
                    <div className="win-celebration">
                      <div className="celebration-text">💎 SAFE! 💎</div>
                      <div className="win-amount">+₹{gameResult.winAmount}</div>
                      <div className="confetti"></div>
                    </div> : 
                    <div className="lose-animation">
                      <div className="explosion-text">💥 BOOM! 💥</div>
                      <div className="lose-amount">-₹{betAmount}</div>
                    </div>
                  }
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