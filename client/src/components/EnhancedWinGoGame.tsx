import { useState, useEffect } from 'react';

interface EnhancedWinGoGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const EnhancedWinGoGame = ({ onClose, refreshBalance }: EnhancedWinGoGameProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentPeriod, setCurrentPeriod] = useState('20250619125');
  const [recentResults, setRecentResults] = useState([8, 3, 7, 1, 9]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [gamePhase, setGamePhase] = useState<'betting' | 'drawing' | 'result'>('betting');
  const [drawingNumber, setDrawingNumber] = useState<number | null>(null);
  const [animatingResult, setAnimatingResult] = useState(false);

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          startDrawing();
          return 0;
        } else if (prev === 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const startDrawing = () => {
    setGamePhase('drawing');
    setAnimatingResult(true);
    
    // Simulate number drawing animation
    let counter = 0;
    const drawingInterval = setInterval(() => {
      setDrawingNumber(Math.floor(Math.random() * 10));
      counter++;
      
      if (counter > 20) {
        clearInterval(drawingInterval);
        const finalNumber = Math.floor(Math.random() * 10);
        setDrawingNumber(finalNumber);
        showResult(finalNumber);
      }
    }, 100);
  };

  const showResult = async (number: number) => {
    setGamePhase('result');
    setAnimatingResult(false);
    
    // Determine result
    const color = getNumberColor(number);
    const size = number >= 5 ? 'big' : 'small';
    
    let isWin = false;
    let multiplier = 0;
    let winAmount = 0;
    
    if (selectedColor && selectedColor === color) {
      isWin = true;
      multiplier = color === 'violet' ? 4.5 : 2;
    } else if (selectedNumber !== null && selectedNumber === number) {
      isWin = true;
      multiplier = number === 0 || number === 5 ? 4.5 : 9;
    } else if (selectedSize && selectedSize === size) {
      isWin = true;
      multiplier = 2;
    }
    
    winAmount = isWin ? betAmount * multiplier : 0;
    
    if (selectedColor || selectedNumber !== null || selectedSize) {
      try {
        const response = await fetch('/api/games/wingo/play', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer demo_token_' + Date.now()
          },
          body: JSON.stringify({
            betAmount,
            betType: selectedColor ? 'color' : selectedSize ? 'size' : 'number',
            betValue: selectedColor || selectedSize || selectedNumber
          })
        });

        if (response.ok) {
          refreshBalance();
        }
      } catch (error) {
        console.error('Game error:', error);
      }
    }
    
    setResult({
      number,
      color,
      size,
      isWin,
      winAmount,
      multiplier
    });
    
    setRecentResults(prev => [number, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      startNewRound();
    }, 5000);
  };

  const startNewRound = () => {
    const newPeriodNum = parseInt(currentPeriod.slice(-3)) + 1;
    setCurrentPeriod(`20250619${String(newPeriodNum).padStart(3, '0')}`);
    setTimeLeft(30);
    setGamePhase('betting');
    setSelectedColor(null);
    setSelectedNumber(null);
    setSelectedSize(null);
    setResult(null);
    setDrawingNumber(null);
    setIsPlaying(false);
  };

  const placeBet = async () => {
    if (!selectedColor && selectedNumber === null && !selectedSize) return;
    if (timeLeft < 5) return;
    setIsPlaying(true);
  };

  const getNumberColor = (num: number) => {
    if (num === 0 || num === 5) return 'violet';
    return num % 2 === 0 ? 'red' : 'green';
  };

  const getColorClass = (num: number) => {
    const color = getNumberColor(num);
    if (color === 'violet') return 'violet-red';
    return color;
  };

  return (
    <div className="enhanced-wingo-game">
      <div className="game-header">
        <button onClick={onClose} className="close-btn">← Back</button>
        <div className="game-info">
          <h2>Win Go</h2>
          <span className="game-timing">1 Min</span>
        </div>
        <div className="balance">₹8,807</div>
      </div>

      <div className="game-container">
        <div className="main-game-area">
          {/* Period & Timer */}
          <div className="period-section">
            <div className="period-info">
              <span>Period</span>
              <span className="period-number">{currentPeriod}</span>
            </div>
            <div className="timer-section">
              <span>Count Down</span>
              <div className={`timer ${timeLeft <= 5 ? 'warning' : ''}`}>
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Drawing Area */}
          <div className="drawing-area">
            {gamePhase === 'betting' && (
              <div className="waiting-message">
                <div className="roulette-wheel">
                  <div className="wheel-numbers">
                    {[0,1,2,3,4,5,6,7,8,9].map(num => (
                      <div key={num} className={`wheel-number ${getColorClass(num)}`}>
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="message">Place your bets!</div>
              </div>
            )}
            
            {gamePhase === 'drawing' && (
              <div className="drawing-animation">
                <div className="spinning-wheel">
                  <div className={`drawing-number ${animatingResult ? 'spinning' : ''}`}>
                    {drawingNumber}
                  </div>
                </div>
                <div className="drawing-message">Drawing...</div>
              </div>
            )}
            
            {gamePhase === 'result' && result && (
              <div className="result-display">
                <div className={`result-number ${getColorClass(result.number)}`}>
                  {result.number}
                </div>
                <div className="result-details">
                  <div className="result-color">Color: {result.color.toUpperCase()}</div>
                  <div className="result-size">Size: {result.size.toUpperCase()}</div>
                </div>
                {result.isWin && (
                  <div className="win-announcement">
                    <div className="win-text">YOU WON!</div>
                    <div className="win-amount">₹{result.winAmount}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Results */}
          <div className="results-bar">
            <span>Recent Results:</span>
            <div className="results-list">
              {recentResults.map((num, idx) => (
                <div key={idx} className={`result-ball ${getColorClass(num)}`}>
                  {num}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="betting-panel">
          {/* Colors */}
          <div className="betting-section">
            <div className="section-title">Colors</div>
            <div className="color-betting">
              <button 
                className={`color-btn green ${selectedColor === 'green' ? 'selected' : ''}`}
                onClick={() => setSelectedColor('green')}
                disabled={gamePhase !== 'betting'}
              >
                <span>Green</span>
                <span className="payout">1:2</span>
              </button>
              <button 
                className={`color-btn violet ${selectedColor === 'violet' ? 'selected' : ''}`}
                onClick={() => setSelectedColor('violet')}
                disabled={gamePhase !== 'betting'}
              >
                <span>Violet</span>
                <span className="payout">1:4.5</span>
              </button>
              <button 
                className={`color-btn red ${selectedColor === 'red' ? 'selected' : ''}`}
                onClick={() => setSelectedColor('red')}
                disabled={gamePhase !== 'betting'}
              >
                <span>Red</span>
                <span className="payout">1:2</span>
              </button>
            </div>
          </div>

          {/* Numbers */}
          <div className="betting-section">
            <div className="section-title">Numbers</div>
            <div className="number-grid">
              {[0,1,2,3,4,5,6,7,8,9].map(num => (
                <button
                  key={num}
                  className={`number-btn ${selectedNumber === num ? 'selected' : ''} ${getColorClass(num)}`}
                  onClick={() => setSelectedNumber(num)}
                  disabled={gamePhase !== 'betting'}
                >
                  <span className="number">{num}</span>
                  <span className="payout">1:{num === 0 || num === 5 ? '4.5' : '9'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="betting-section">
            <div className="section-title">Size</div>
            <div className="size-betting">
              <button 
                className={`size-btn ${selectedSize === 'big' ? 'selected' : ''}`}
                onClick={() => setSelectedSize('big')}
                disabled={gamePhase !== 'betting'}
              >
                <span>Big</span>
                <span className="range">5,6,7,8,9</span>
                <span className="payout">1:2</span>
              </button>
              <button 
                className={`size-btn ${selectedSize === 'small' ? 'selected' : ''}`}
                onClick={() => setSelectedSize('small')}
                disabled={gamePhase !== 'betting'}
              >
                <span>Small</span>
                <span className="range">0,1,2,3,4</span>
                <span className="payout">1:2</span>
              </button>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="betting-section">
            <div className="section-title">Bet Amount</div>
            <div className="amount-buttons">
              {[10, 100, 1000, 10000].map(amount => (
                <button 
                  key={amount}
                  className={`amount-btn ${betAmount === amount ? 'selected' : ''}`}
                  onClick={() => setBetAmount(amount)}
                >
                  ₹{amount}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <button 
            className={`confirm-btn ${timeLeft <= 5 || gamePhase !== 'betting' ? 'disabled' : ''}`}
            onClick={placeBet}
            disabled={isPlaying || timeLeft <= 5 || gamePhase !== 'betting' || (!selectedColor && selectedNumber === null && !selectedSize)}
          >
            {timeLeft <= 5 ? 'Betting Closed' : isPlaying ? 'Bet Placed' : `Confirm ₹${betAmount}`}
          </button>
        </div>
      </div>

      <style>{`
        .enhanced-wingo-game {
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(255,255,255,0.05);
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

        .game-info h2 {
          margin: 0;
          font-size: 24px;
        }

        .game-timing {
          color: #FFD700;
          font-size: 14px;
        }

        .balance {
          background: linear-gradient(45deg, #FFD700, #FFA500);
          padding: 10px 20px;
          border-radius: 25px;
          color: #333;
          font-weight: bold;
          font-size: 18px;
        }

        .game-container {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 20px;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .main-game-area {
          background: rgba(255,255,255,0.05);
          border-radius: 15px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .period-section {
          display: flex;
          justify-content: space-between;
          padding: 20px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .period-info, .timer-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .period-number, .timer {
          font-size: 20px;
          font-weight: bold;
          color: #FFD700;
          margin-top: 5px;
        }

        .timer.warning {
          color: #ff4444;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .drawing-area {
          background: rgba(0,0,0,0.3);
          border-radius: 15px;
          padding: 40px;
          margin: 20px 0;
          text-align: center;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .roulette-wheel {
          width: 150px;
          height: 150px;
          border: 3px solid #FFD700;
          border-radius: 50%;
          position: relative;
          margin-bottom: 20px;
          animation: rotate 10s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .wheel-numbers {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .wheel-number {
          position: absolute;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          color: white;
        }

        .wheel-number:nth-child(1) { top: 10px; left: 50%; transform: translateX(-50%); }
        .wheel-number:nth-child(2) { top: 20px; right: 20px; }
        .wheel-number:nth-child(3) { top: 50%; right: 10px; transform: translateY(-50%); }
        .wheel-number:nth-child(4) { bottom: 20px; right: 20px; }
        .wheel-number:nth-child(5) { bottom: 10px; right: 50%; transform: translateX(50%); }
        .wheel-number:nth-child(6) { bottom: 10px; left: 50%; transform: translateX(-50%); }
        .wheel-number:nth-child(7) { bottom: 20px; left: 20px; }
        .wheel-number:nth-child(8) { top: 50%; left: 10px; transform: translateY(-50%); }
        .wheel-number:nth-child(9) { top: 20px; left: 20px; }
        .wheel-number:nth-child(10) { top: 50%; left: 50%; transform: translate(-50%, -50%); }

        .spinning-wheel {
          margin-bottom: 20px;
        }

        .drawing-number {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(45deg, #FFD700, #FFA500);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: bold;
          color: #333;
          margin: 0 auto;
        }

        .drawing-number.spinning {
          animation: spin 0.1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .result-display {
          animation: resultAppear 0.5s ease-out;
        }

        @keyframes resultAppear {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        .result-number {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: bold;
          color: white;
          margin: 0 auto 20px;
        }

        .result-number.green { background: #4CAF50; }
        .result-number.red { background: #f44336; }
        .result-number.violet-red { 
          background: linear-gradient(45deg, #9C27B0 50%, #f44336 50%);
        }

        .result-details {
          margin-bottom: 20px;
        }

        .result-color, .result-size {
          font-size: 18px;
          margin: 5px 0;
        }

        .win-announcement {
          background: rgba(76,175,80,0.2);
          border: 2px solid #4CAF50;
          border-radius: 15px;
          padding: 20px;
          animation: celebrate 0.6s ease-out;
        }

        @keyframes celebrate {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.05); }
          50% { transform: scale(1.1); }
          75% { transform: scale(1.05); }
        }

        .win-text {
          font-size: 24px;
          font-weight: bold;
          color: #4CAF50;
        }

        .win-amount {
          font-size: 32px;
          font-weight: bold;
          color: #FFD700;
        }

        .results-bar {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px 0;
        }

        .results-list {
          display: flex;
          gap: 8px;
        }

        .result-ball {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 16px;
        }

        .result-ball.green { background: #4CAF50; }
        .result-ball.red { background: #f44336; }
        .result-ball.violet-red { 
          background: linear-gradient(45deg, #9C27B0 50%, #f44336 50%);
        }

        .betting-panel {
          background: rgba(255,255,255,0.05);
          border-radius: 15px;
          padding: 20px;
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .betting-section {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
          padding: 15px;
        }

        .section-title {
          font-weight: bold;
          margin-bottom: 15px;
          color: #FFD700;
          text-align: center;
        }

        .color-betting {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .color-btn {
          padding: 15px 10px;
          border: 2px solid transparent;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: bold;
          transition: all 0.3s;
          font-size: 14px;
        }

        .color-btn.green { background: #4CAF50; }
        .color-btn.red { background: #f44336; }
        .color-btn.violet { background: #9C27B0; }

        .color-btn.selected {
          border-color: #FFD700;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(255,215,0,0.5);
        }

        .color-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .payout {
          font-size: 12px;
          margin-top: 5px;
          opacity: 0.8;
        }

        .number-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .number-btn {
          aspect-ratio: 1;
          border: 2px solid transparent;
          border-radius: 8px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .number-btn.green { background: #4CAF50; }
        .number-btn.red { background: #f44336; }
        .number-btn.violet-red { 
          background: linear-gradient(45deg, #9C27B0 50%, #f44336 50%);
        }

        .number-btn.selected {
          border-color: #FFD700;
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(255,215,0,0.5);
        }

        .number-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .number {
          font-size: 16px;
        }

        .size-betting {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .size-btn {
          padding: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          color: white;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: all 0.3s;
          font-size: 14px;
        }

        .size-btn.selected {
          border-color: #FFD700;
          background: rgba(255,215,0,0.2);
          box-shadow: 0 0 15px rgba(255,215,0,0.5);
        }

        .size-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .range {
          font-size: 12px;
          margin: 5px 0;
          opacity: 0.8;
        }

        .amount-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .amount-btn {
          padding: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          color: white;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        }

        .amount-btn.selected {
          border-color: #FFD700;
          background: rgba(255,215,0,0.2);
          transform: scale(1.05);
        }

        .confirm-btn {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          border: none;
          color: white;
          padding: 20px;
          border-radius: 15px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(76,175,80,0.4);
        }

        .confirm-btn:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(76,175,80,0.6);
        }

        .confirm-btn.disabled {
          background: #666;
          cursor: not-allowed;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .game-container {
            grid-template-columns: 1fr;
          }
          
          .number-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .amount-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};