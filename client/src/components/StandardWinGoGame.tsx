import { useState, useEffect } from 'react';

interface StandardWinGoGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const StandardWinGoGame = ({ onClose, refreshBalance }: StandardWinGoGameProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBets, setSelectedBets] = useState<{[key: string]: number}>({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [gamePhase, setGamePhase] = useState<'betting' | 'drawing' | 'result'>('betting');
  const [currentPeriod, setCurrentPeriod] = useState('20240619235');
  const [drawResult, setDrawResult] = useState<number | null>(null);
  const [history, setHistory] = useState([
    { period: '20240619234', number: 8, color: 'red', size: 'big' },
    { period: '20240619233', number: 3, color: 'green', size: 'small' },
    { period: '20240619232', number: 7, color: 'red', size: 'big' },
    { period: '20240619231', number: 1, color: 'green', size: 'small' },
    { period: '20240619230', number: 9, color: 'red', size: 'big' }
  ]);
  const [myBets, setMyBets] = useState([
    { period: '20240619234', bet: 'Green', amount: 100, result: -100 },
    { period: '20240619233', bet: 'Small', amount: 50, result: 100 },
    { period: '20240619232', bet: 'Number 7', amount: 200, result: 1800 }
  ]);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayRounds, setAutoPlayRounds] = useState(0);

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
    
    // Drawing animation
    let drawCount = 0;
    const drawInterval = setInterval(() => {
      setDrawResult(Math.floor(Math.random() * 10));
      drawCount++;
      
      if (drawCount > 30) {
        clearInterval(drawInterval);
        const finalNumber = Math.floor(Math.random() * 10);
        setDrawResult(finalNumber);
        showResult(finalNumber);
      }
    }, 100);
  };

  const showResult = async (number: number) => {
    setGamePhase('result');
    
    const color = getNumberColor(number);
    const size = number >= 5 ? 'big' : 'small';
    
    // Calculate winnings
    let totalWin = 0;
    let totalBet = 0;
    
    Object.entries(selectedBets).forEach(([bet, amount]) => {
      totalBet += amount;
      
      if (bet === color) {
        totalWin += amount * (color === 'violet' ? 4.5 : 2);
      } else if (bet === size) {
        totalWin += amount * 2;
      } else if (bet === `number-${number}`) {
        totalWin += amount * (number === 0 || number === 5 ? 4.5 : 9);
      }
    });
    
    if (totalBet > 0) {
      try {
        const response = await fetch('/api/games/wingo/play', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer demo_token_' + Date.now()
          },
          body: JSON.stringify({
            betAmount: totalBet,
            betType: 'multiple',
            betValue: selectedBets
          })
        });

        if (response.ok) {
          refreshBalance();
        }
      } catch (error) {
        console.error('Game error:', error);
      }
      
      // Add to my bets history
      const betString = Object.keys(selectedBets).join(', ');
      setMyBets(prev => [
        { period: currentPeriod, bet: betString, amount: totalBet, result: totalWin - totalBet },
        ...prev.slice(0, 19)
      ]);
    }
    
    // Update history
    setHistory(prev => [
      { period: currentPeriod, number, color, size },
      ...prev.slice(0, 19)
    ]);
    
    setTimeout(() => {
      startNewRound();
    }, 5000);
  };

  const startNewRound = () => {
    const newPeriodNum = parseInt(currentPeriod.slice(-3)) + 1;
    setCurrentPeriod(`20240619${String(newPeriodNum).padStart(3, '0')}`);
    setTimeLeft(30);
    setGamePhase('betting');
    setSelectedBets({});
    setDrawResult(null);
    
    if (isAutoPlay && autoPlayRounds > 0) {
      setAutoPlayRounds(prev => prev - 1);
      // Auto bet logic here
    }
  };

  const placeBet = (betType: string, amount: number) => {
    if (gamePhase !== 'betting' || timeLeft < 5) return;
    
    setSelectedBets(prev => ({
      ...prev,
      [betType]: (prev[betType] || 0) + amount
    }));
  };

  const getNumberColor = (num: number) => {
    if (num === 0 || num === 5) return 'violet';
    return num % 2 === 0 ? 'red' : 'green';
  };

  const getTotalBet = () => {
    return Object.values(selectedBets).reduce((sum, amount) => sum + amount, 0);
  };

  return (
    <div className="standard-wingo">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <div className="game-title">
          <span>Win Go 1Min</span>
          <span className="game-type">Fast Parity</span>
        </div>
        <div className="balance-display">₹8,807.50</div>
      </div>

      <div className="game-layout">
        <div className="main-game">
          <div className="period-timer">
            <div className="period-info">
              <span className="period-label">Period</span>
              <span className="period-number">{currentPeriod}</span>
            </div>
            <div className="timer-info">
              <span className="timer-label">Time Remaining</span>
              <div className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
            </div>
          </div>

          <div className="game-area">
            {gamePhase === 'betting' && (
              <div className="betting-display">
                <div className="lottery-ball">
                  <div className="ball-placeholder">?</div>
                </div>
                <div className="instruction">Select your numbers!</div>
              </div>
            )}
            
            {gamePhase === 'drawing' && (
              <div className="drawing-display">
                <div className="lottery-ball drawing">
                  <div className="ball-number">{drawResult}</div>
                </div>
                <div className="drawing-text">Drawing...</div>
              </div>
            )}
            
            {gamePhase === 'result' && drawResult !== null && (
              <div className="result-display">
                <div className={`lottery-ball result ${getNumberColor(drawResult)}`}>
                  <div className="ball-number">{drawResult}</div>
                </div>
                <div className="result-info">
                  <div className="result-details">
                    <span>Number: {drawResult}</span>
                    <span>Color: {getNumberColor(drawResult).toUpperCase()}</span>
                    <span>Size: {drawResult >= 5 ? 'BIG' : 'SMALL'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="betting-panel">
            <div className="bet-section colors">
              <div className="section-title">Select Color</div>
              <div className="color-options">
                <button 
                  className={`color-btn green ${selectedBets.green ? 'selected' : ''}`}
                  onClick={() => placeBet('green', betAmount)}
                  disabled={gamePhase !== 'betting' || timeLeft < 5}
                >
                  <span>Green</span>
                  <span className="odds">x2</span>
                  {selectedBets.green && <span className="bet-amount">₹{selectedBets.green}</span>}
                </button>
                
                <button 
                  className={`color-btn violet ${selectedBets.violet ? 'selected' : ''}`}
                  onClick={() => placeBet('violet', betAmount)}
                  disabled={gamePhase !== 'betting' || timeLeft < 5}
                >
                  <span>Violet</span>
                  <span className="odds">x4.5</span>
                  {selectedBets.violet && <span className="bet-amount">₹{selectedBets.violet}</span>}
                </button>
                
                <button 
                  className={`color-btn red ${selectedBets.red ? 'selected' : ''}`}
                  onClick={() => placeBet('red', betAmount)}
                  disabled={gamePhase !== 'betting' || timeLeft < 5}
                >
                  <span>Red</span>
                  <span className="odds">x2</span>
                  {selectedBets.red && <span className="bet-amount">₹{selectedBets.red}</span>}
                </button>
              </div>
            </div>

            <div className="bet-section numbers">
              <div className="section-title">Select Number</div>
              <div className="number-grid">
                {[0,1,2,3,4,5,6,7,8,9].map(num => (
                  <button
                    key={num}
                    className={`number-btn ${getNumberColor(num)} ${selectedBets[`number-${num}`] ? 'selected' : ''}`}
                    onClick={() => placeBet(`number-${num}`, betAmount)}
                    disabled={gamePhase !== 'betting' || timeLeft < 5}
                  >
                    <span className="number">{num}</span>
                    <span className="odds">x{num === 0 || num === 5 ? '4.5' : '9'}</span>
                    {selectedBets[`number-${num}`] && <span className="bet-amount">₹{selectedBets[`number-${num}`]}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="bet-section sizes">
              <div className="section-title">Select Size</div>
              <div className="size-options">
                <button 
                  className={`size-btn small ${selectedBets.small ? 'selected' : ''}`}
                  onClick={() => placeBet('small', betAmount)}
                  disabled={gamePhase !== 'betting' || timeLeft < 5}
                >
                  <span>Small</span>
                  <span className="range">0,1,2,3,4</span>
                  <span className="odds">x2</span>
                  {selectedBets.small && <span className="bet-amount">₹{selectedBets.small}</span>}
                </button>
                
                <button 
                  className={`size-btn big ${selectedBets.big ? 'selected' : ''}`}
                  onClick={() => placeBet('big', betAmount)}
                  disabled={gamePhase !== 'betting' || timeLeft < 5}
                >
                  <span>Big</span>
                  <span className="range">5,6,7,8,9</span>
                  <span className="odds">x2</span>
                  {selectedBets.big && <span className="bet-amount">₹{selectedBets.big}</span>}
                </button>
              </div>
            </div>
          </div>

          <div className="control-panel">
            <div className="bet-amount-section">
              <span>Bet Amount</span>
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

            <div className="auto-play-section">
              <label>
                <input 
                  type="checkbox" 
                  checked={isAutoPlay} 
                  onChange={(e) => setIsAutoPlay(e.target.checked)}
                />
                Auto Play
              </label>
              {isAutoPlay && (
                <input 
                  type="number" 
                  placeholder="Rounds"
                  value={autoPlayRounds || ''}
                  onChange={(e) => setAutoPlayRounds(parseInt(e.target.value) || 0)}
                />
              )}
            </div>

            <div className="bet-summary">
              <div className="total-bet">Total Bet: ₹{getTotalBet()}</div>
              <button 
                className="clear-btn"
                onClick={() => setSelectedBets({})}
                disabled={Object.keys(selectedBets).length === 0}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="tabs">
            <button className="tab active">Chart</button>
            <button className="tab">My Bets</button>
            <button className="tab">Trend</button>
          </div>

          <div className="tab-content">
            <div className="chart-section">
              <div className="chart-header">Recent Results</div>
              <div className="results-chart">
                {history.map((result, idx) => (
                  <div key={idx} className="result-item">
                    <div className="period-id">#{result.period.slice(-3)}</div>
                    <div className={`result-ball ${result.color}`}>
                      {result.number}
                    </div>
                    <div className="result-attrs">
                      <span className={result.color}>{result.color.charAt(0).toUpperCase()}</span>
                      <span className={result.size}>{result.size.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="my-bets-section">
              <div className="bets-header">My Betting History</div>
              <div className="bets-list">
                {myBets.map((bet, idx) => (
                  <div key={idx} className="bet-item">
                    <div className="bet-period">#{bet.period.slice(-3)}</div>
                    <div className="bet-details">
                      <div className="bet-desc">{bet.bet}</div>
                      <div className="bet-amount">₹{bet.amount}</div>
                    </div>
                    <div className={`bet-result ${bet.result > 0 ? 'win' : 'lose'}`}>
                      {bet.result > 0 ? '+' : ''}₹{bet.result}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="trend-section">
              <div className="trend-header">Number Frequency</div>
              <div className="frequency-chart">
                {[0,1,2,3,4,5,6,7,8,9].map(num => (
                  <div key={num} className="freq-item">
                    <span className={`freq-number ${getNumberColor(num)}`}>{num}</span>
                    <div className="freq-bar">
                      <div 
                        className="freq-fill" 
                        style={{ width: `${Math.random() * 80 + 20}%` }}
                      ></div>
                    </div>
                    <span className="freq-count">{Math.floor(Math.random() * 50) + 10}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .standard-wingo {
          background: #1a1d29;
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #252834;
          border-bottom: 1px solid #3a3d4a;
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
        }

        .game-title {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .game-title span:first-child {
          font-size: 18px;
          font-weight: bold;
        }

        .game-type {
          font-size: 12px;
          color: #8892b0;
        }

        .balance-display {
          background: #f6ad55;
          padding: 8px 16px;
          border-radius: 6px;
          color: #1a202c;
          font-weight: bold;
        }

        .game-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          height: calc(100vh - 70px);
        }

        .main-game {
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .period-timer {
          display: flex;
          justify-content: space-between;
          background: #252834;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .period-info, .timer-info {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .period-label, .timer-label {
          color: #8892b0;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .period-number, .timer {
          font-size: 20px;
          font-weight: bold;
          color: #f6ad55;
        }

        .timer.warning {
          color: #fc8181;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .game-area {
          background: #252834;
          border-radius: 12px;
          padding: 40px;
          margin-bottom: 20px;
          text-align: center;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .lottery-ball {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 20px;
          border: 4px solid #f6ad55;
          background: #1a1d29;
          color: white;
        }

        .lottery-ball.drawing {
          animation: spin 0.1s linear infinite;
        }

        .lottery-ball.result.green {
          background: #48bb78;
          border-color: #48bb78;
          color: white;
        }

        .lottery-ball.result.red {
          background: #f56565;
          border-color: #f56565;
          color: white;
        }

        .lottery-ball.result.violet {
          background: linear-gradient(45deg, #9f7aea 50%, #f56565 50%);
          border-color: #9f7aea;
          color: white;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .instruction, .drawing-text {
          font-size: 18px;
          color: #8892b0;
        }

        .result-details {
          display: flex;
          gap: 20px;
          font-size: 16px;
          font-weight: bold;
        }

        .betting-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 20px;
        }

        .bet-section {
          background: #252834;
          border-radius: 12px;
          padding: 20px;
        }

        .section-title {
          font-weight: bold;
          margin-bottom: 15px;
          color: #f6ad55;
          text-align: center;
        }

        .color-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .color-btn {
          background: none;
          border: 2px solid;
          border-radius: 10px;
          padding: 20px 10px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          transition: all 0.3s;
          position: relative;
          font-weight: bold;
        }

        .color-btn.green { border-color: #48bb78; color: #48bb78; }
        .color-btn.red { border-color: #f56565; color: #f56565; }
        .color-btn.violet { border-color: #9f7aea; color: #9f7aea; }

        .color-btn.selected {
          background: rgba(255,255,255,0.1);
          transform: scale(1.05);
        }

        .color-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .number-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }

        .number-btn {
          aspect-ratio: 1;
          border: 2px solid;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          position: relative;
          font-weight: bold;
          font-size: 14px;
          background: none;
        }

        .number-btn.green { border-color: #48bb78; color: #48bb78; }
        .number-btn.red { border-color: #f56565; color: #f56565; }
        .number-btn.violet { border-color: #9f7aea; color: #9f7aea; }

        .number-btn.selected {
          background: rgba(255,255,255,0.1);
          transform: scale(1.1);
        }

        .number-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .number {
          font-size: 18px;
          margin-bottom: 2px;
        }

        .odds {
          font-size: 10px;
          opacity: 0.8;
        }

        .bet-amount {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #f6ad55;
          color: #1a202c;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: bold;
        }

        .size-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .size-btn {
          background: none;
          border: 2px solid #8892b0;
          color: #8892b0;
          border-radius: 10px;
          padding: 20px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          transition: all 0.3s;
          position: relative;
        }

        .size-btn.selected {
          border-color: #f6ad55;
          color: #f6ad55;
          background: rgba(246,173,85,0.1);
        }

        .size-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .range {
          font-size: 12px;
          opacity: 0.8;
        }

        .control-panel {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 20px;
          align-items: center;
          background: #252834;
          border-radius: 12px;
          padding: 20px;
        }

        .bet-amount-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .amount-buttons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .amount-btn {
          background: #3a3d4a;
          border: 1px solid #8892b0;
          color: white;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .amount-btn.selected {
          background: #f6ad55;
          color: #1a202c;
          border-color: #f6ad55;
        }

        .auto-play-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: center;
        }

        .auto-play-section label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #8892b0;
        }

        .auto-play-section input[type="checkbox"] {
          accent-color: #f6ad55;
        }

        .auto-play-section input[type="number"] {
          background: #3a3d4a;
          border: 1px solid #8892b0;
          color: white;
          padding: 8px;
          border-radius: 4px;
          width: 80px;
        }

        .bet-summary {
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-align: center;
        }

        .total-bet {
          font-weight: bold;
          color: #f6ad55;
        }

        .clear-btn {
          background: #fc8181;
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        .clear-btn:disabled {
          background: #4a5568;
          cursor: not-allowed;
        }

        .side-panel {
          background: #252834;
          border-left: 1px solid #3a3d4a;
          display: flex;
          flex-direction: column;
        }

        .tabs {
          display: flex;
          background: #3a3d4a;
        }

        .tab {
          flex: 1;
          background: none;
          border: none;
          color: #8892b0;
          padding: 15px 10px;
          cursor: pointer;
          font-size: 14px;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          color: white;
          border-bottom-color: #f6ad55;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
        }

        .chart-header, .bets-header, .trend-header {
          font-weight: bold;
          margin-bottom: 15px;
          color: #f6ad55;
        }

        .results-chart {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .result-item {
          display: grid;
          grid-template-columns: 50px 40px 1fr;
          gap: 10px;
          align-items: center;
          background: #1a1d29;
          padding: 10px;
          border-radius: 8px;
        }

        .period-id {
          color: #8892b0;
          font-size: 12px;
        }

        .result-ball {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .result-ball.green { background: #48bb78; color: white; }
        .result-ball.red { background: #f56565; color: white; }
        .result-ball.violet { background: linear-gradient(45deg, #9f7aea 50%, #f56565 50%); color: white; }

        .result-attrs {
          display: flex;
          gap: 10px;
          font-size: 12px;
        }

        .result-attrs span.green { color: #48bb78; }
        .result-attrs span.red { color: #f56565; }
        .result-attrs span.violet { color: #9f7aea; }
        .result-attrs span.big { color: #f6ad55; }
        .result-attrs span.small { color: #8892b0; }

        .bets-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bet-item {
          background: #1a1d29;
          padding: 12px;
          border-radius: 8px;
          display: grid;
          grid-template-columns: 50px 1fr auto;
          gap: 10px;
          align-items: center;
        }

        .bet-period {
          color: #8892b0;
          font-size: 12px;
        }

        .bet-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .bet-desc {
          font-size: 12px;
          color: white;
        }

        .bet-amount {
          font-size: 11px;
          color: #8892b0;
        }

        .bet-result.win {
          color: #48bb78;
          font-weight: bold;
        }

        .bet-result.lose {
          color: #f56565;
        }

        .frequency-chart {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .freq-item {
          display: grid;
          grid-template-columns: 30px 1fr 30px;
          gap: 10px;
          align-items: center;
        }

        .freq-number {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
        }

        .freq-number.green { background: #48bb78; color: white; }
        .freq-number.red { background: #f56565; color: white; }
        .freq-number.violet { background: linear-gradient(45deg, #9f7aea 50%, #f56565 50%); color: white; }

        .freq-bar {
          background: #3a3d4a;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
        }

        .freq-fill {
          background: #f6ad55;
          height: 100%;
          transition: width 0.3s;
        }

        .freq-count {
          color: #8892b0;
          font-size: 12px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .game-layout {
            grid-template-columns: 1fr;
          }
          
          .number-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .control-panel {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .amount-buttons {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
};