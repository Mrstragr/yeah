import { useState, useEffect } from 'react';

interface StandardAviatorGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const StandardAviatorGame = ({ onClose, refreshBalance }: StandardAviatorGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [autoBetCount, setAutoBetCount] = useState(0);
  const [autoCashOut, setAutoCashOut] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState<'betting' | 'flying' | 'crashed'>('betting');
  const [currentBet, setCurrentBet] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(7);
  const [history, setHistory] = useState([
    { round: 12847, multiplier: 2.45, players: 147 },
    { round: 12846, multiplier: 1.23, players: 152 },
    { round: 12845, multiplier: 15.67, players: 134 },
    { round: 12844, multiplier: 1.05, players: 189 },
    { round: 12843, multiplier: 3.28, players: 166 }
  ]);
  const [activePlayers, setActivePlayers] = useState([
    { name: 'Player123', bet: 500, cashOut: 2.34 },
    { name: 'Winner99', bet: 1200, cashOut: 3.45 },
    { name: 'Lucky777', bet: 250, cashOut: 1.89 }
  ]);
  const [chatMessages, setChatMessages] = useState([
    { user: 'System', message: 'Game starting in 10 seconds', time: '16:45:30' },
    { user: 'Player123', message: 'Going for 5x today!', time: '16:45:25' },
    { user: 'Winner99', message: 'Good luck everyone!', time: '16:45:20' }
  ]);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [myBetHistory, setMyBetHistory] = useState([
    { round: 12846, bet: 100, cashOut: 1.23, result: 123 },
    { round: 12845, bet: 200, cashOut: 15.67, result: 3134 },
    { round: 12844, bet: 150, cashOut: null, result: -150 }
  ]);

  // Game timer
  useEffect(() => {
    let interval: any;
    
    if (gameState === 'betting' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            startFlight();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === 'flying') {
      interval = setInterval(() => {
        setMultiplier(prev => {
          // Dynamic increment that feels more natural
          let increment = 0.01;
          if (prev < 1.5) increment = 0.01;
          else if (prev < 2) increment = 0.02;
          else if (prev < 3) increment = 0.03;
          else if (prev < 5) increment = 0.04;
          else if (prev < 10) increment = 0.06;
          else increment = 0.08;
          
          const newMultiplier = parseFloat((prev + increment).toFixed(2));
          
          // Realistic crash probability that increases smoothly
          const baseCrashChance = 0.005;
          const multiplierFactor = Math.pow(newMultiplier - 1, 1.5);
          const crashChance = Math.min(baseCrashChance + (multiplierFactor * 0.002), 0.12);
          
          if (Math.random() < crashChance) {
            crashPlane(newMultiplier);
            return newMultiplier;
          }
          
          // Auto cash out check
          if (autoCashOut && newMultiplier >= autoCashOut && currentBet) {
            setTimeout(() => cashOut(autoCashOut), 50);
          }
          
          return newMultiplier;
        });
      }, 150); // Slightly slower for better UX
    }

    return () => clearInterval(interval);
  }, [gameState, countdown, autoCashOut, currentBet]);

  const startFlight = () => {
    setGameState('flying');
    setMultiplier(1.00);
  };

  const crashPlane = async (finalMultiplier: number) => {
    setGameState('crashed');
    
    // Update history
    const newRound = { round: history[0].round + 1, multiplier: finalMultiplier, players: 150 + Math.floor(Math.random() * 50) };
    setHistory(prev => [newRound, ...prev.slice(0, 4)]);
    
    // Process lost bet if any
    if (currentBet) {
      try {
        const response = await fetch('/api/games/aviator/play', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer demo_token_' + Date.now()
          },
          body: JSON.stringify({
            betAmount: currentBet,
            cashOutMultiplier: null,
            crashed: true,
            finalMultiplier
          })
        });

        if (response.ok) {
          const data = await response.json();
          setMyBetHistory(prev => [
            { round: newRound.round, bet: currentBet, cashOut: null, result: -currentBet },
            ...prev.slice(0, 9)
          ]);
          refreshBalance();
        }
      } catch (error) {
        console.error('Crash processing error:', error);
        // Still add to history for UI feedback
        setMyBetHistory(prev => [
          { round: newRound.round, bet: currentBet, cashOut: null, result: -currentBet },
          ...prev.slice(0, 9)
        ]);
      }
    }
    
    setTimeout(() => {
      setGameState('betting');
      setCountdown(7);
      setCurrentBet(null);
      setMultiplier(1.00);
      
      if (isAutoPlay && autoBetCount > 0) {
        setAutoBetCount(prev => prev - 1);
        setTimeout(() => placeBet(), 1000);
      }
    }, 3000);
  };

  const placeBet = () => {
    if (gameState !== 'betting' || countdown < 2) return;
    setCurrentBet(betAmount);
  };

  const cashOut = async (cashOutMultiplier?: number) => {
    if (!currentBet || gameState !== 'flying') return;
    
    const finalMultiplier = cashOutMultiplier || multiplier;
    const winAmount = Math.floor(currentBet * finalMultiplier);
    
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
        // Add to my bet history
        setMyBetHistory(prev => [
          { round: history[0].round + 1, bet: currentBet, cashOut: finalMultiplier, result: winAmount - currentBet },
          ...prev.slice(0, 9)
        ]);
        
        setCurrentBet(null);
        refreshBalance();
      }
    } catch (error) {
      console.error('Cash out error:', error);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
    if (!isAutoPlay && autoBetCount > 0) {
      setTimeout(() => placeBet(), 1000);
    }
  };

  return (
    <div className="standard-aviator">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <div className="game-title">
          <span>Aviator</span>
          <span className="live-indicator">● LIVE</span>
        </div>
        <div className="balance-display">₹8,807.50</div>
      </div>

      <div className="game-layout">
        <div className="main-game">
          <div className="game-area">
            <div className="multiplier-display">
              <div className={`multiplier ${gameState === 'crashed' ? 'crashed' : ''}`}>
                {multiplier.toFixed(2)}x
              </div>
              {gameState === 'betting' && (
                <div className="next-round">Next round in {countdown}s</div>
              )}
              {gameState === 'crashed' && (
                <div className="crashed-text">FLEW AWAY!</div>
              )}
            </div>
            
            <div className="graph-area">
              <div className="multiplier-chart">
                <svg className="chart-svg" viewBox="0 0 400 200">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38a169" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#68d391" stopOpacity="0.3"/>
                    </linearGradient>
                  </defs>
                  <path 
                    className={`chart-line ${gameState === 'flying' ? 'drawing' : ''}`}
                    d={`M 0 200 Q ${Math.min(multiplier * 50, 350)} ${200 - (multiplier * 15)} ${Math.min(multiplier * 60, 400)} ${200 - (multiplier * 20)}`}
                    fill="none"
                    stroke="url(#chartGradient)"
                    strokeWidth="3"
                  />
                  {gameState === 'crashed' && (
                    <circle 
                      cx={Math.min(multiplier * 60, 400)} 
                      cy={200 - (multiplier * 20)} 
                      r="8" 
                      fill="#e53e3e"
                      className="crash-point"
                    />
                  )}
                </svg>
              </div>
              <div className={`plane ${gameState === 'flying' ? 'flying' : ''} ${gameState === 'crashed' ? 'crashed' : ''}`}>
                ✈️
              </div>
              {gameState === 'flying' && (
                <div className="multiplier-trail">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="trail-dot" style={{ animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="betting-panel">
            <div className="bet-section">
              <div className="bet-amount">
                <label>Bet</label>
                <div className="amount-input">
                  <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))}>-</button>
                  <input 
                    type="number" 
                    value={betAmount} 
                    onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
                  />
                  <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
                </div>
                <div className="quick-bets">
                  {[100, 500, 1000].map(amount => (
                    <button 
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      className={betAmount === amount ? 'active' : ''}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="auto-settings">
                <div className="auto-cashout">
                  <label>Auto Cash Out</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="2.00"
                    value={autoCashOut || ''}
                    onChange={(e) => setAutoCashOut(parseFloat(e.target.value) || null)}
                  />
                </div>
                
                <div className="auto-bet">
                  <label>Auto Bet</label>
                  <div className="auto-controls">
                    <input 
                      type="number" 
                      placeholder="0"
                      value={autoBetCount || ''}
                      onChange={(e) => setAutoBetCount(parseInt(e.target.value) || 0)}
                    />
                    <button 
                      onClick={toggleAutoPlay}
                      className={isAutoPlay ? 'active' : ''}
                    >
                      {isAutoPlay ? 'Stop' : 'Start'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                {!currentBet && gameState === 'betting' && countdown >= 2 && (
                  <button className="bet-btn" onClick={placeBet}>
                    BET ₹{betAmount}
                  </button>
                )}
                
                {currentBet && gameState === 'flying' && (
                  <button className="cashout-btn" onClick={() => cashOut()}>
                    CASH OUT {multiplier.toFixed(2)}x
                  </button>
                )}
                
                {gameState === 'betting' && countdown < 2 && (
                  <button className="bet-btn disabled" disabled>
                    BETTING CLOSED
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="side-panel">
          <div className="tabs">
            <button className="tab active">Live Bets</button>
            <button className="tab">My Bets</button>
            <button className="tab">Statistics</button>
          </div>

          <div className="tab-content">
            <div className="live-bets">
              <div className="bets-header">
                <span>Player</span>
                <span>Bet</span>
                <span>Cash Out</span>
              </div>
              {activePlayers.map((player, idx) => (
                <div key={idx} className="bet-row">
                  <span className="player-name">{player.name}</span>
                  <span className="bet-amount">₹{player.bet}</span>
                  <span className="cashout-mult">{player.cashOut}x</span>
                </div>
              ))}
            </div>
          </div>

          <div className="history-section">
            <div className="history-header">Round History</div>
            <div className="history-list">
              {history.map((round, idx) => (
                <div key={idx} className="history-item">
                  <span className="round-number">#{round.round}</span>
                  <span className={`round-multiplier ${round.multiplier >= 2 ? 'good' : 'normal'}`}>
                    {round.multiplier.toFixed(2)}x
                  </span>
                  <span className="player-count">{round.players}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chat-section">
            <div className="chat-header">Live Chat</div>
            <div className="chat-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="chat-message">
                  <span className="chat-time">{msg.time}</span>
                  <span className="chat-user">{msg.user}:</span>
                  <span className="chat-text">{msg.message}</span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Type message..." />
              <button>Send</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .standard-aviator {
          background: #0f212e;
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #1a2c38;
          border-bottom: 1px solid #2f4553;
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
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: bold;
        }

        .live-indicator {
          background: #dc2626;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 12px;
        }

        .balance-display {
          background: #16a34a;
          padding: 8px 16px;
          border-radius: 6px;
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
        }

        .game-area {
          flex: 1;
          background: #1a2c38;
          position: relative;
          overflow: hidden;
        }

        .multiplier-display {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 10;
        }

        .multiplier {
          font-size: 64px;
          font-weight: bold;
          color: #16a34a;
          text-shadow: 0 0 20px rgba(22,163,74,0.5);
          transition: all 0.2s ease;
          animation: ${gameState === 'flying' ? 'glow 1.5s ease-in-out infinite alternate' : 'none'};
        }

        .multiplier.crashed {
          color: #dc2626;
          text-shadow: 0 0 20px rgba(220,38,38,0.5);
          animation: crashFlash 0.5s ease-out;
        }

        @keyframes glow {
          0% { 
            transform: scale(1);
            text-shadow: 0 0 20px rgba(22,163,74,0.5);
          }
          100% { 
            transform: scale(1.05);
            text-shadow: 0 0 30px rgba(22,163,74,0.8), 0 0 40px rgba(104,211,145,0.4);
          }
        }

        @keyframes crashFlash {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); color: #ff0000; }
          100% { transform: scale(1); }
        }

        .next-round {
          font-size: 18px;
          color: #64748b;
          margin-top: 10px;
        }

        .crashed-text {
          font-size: 24px;
          color: #dc2626;
          font-weight: bold;
          margin-top: 10px;
        }

        .graph-area {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(to top, rgba(22,163,74,0.05), transparent);
          overflow: hidden;
        }

        .multiplier-chart {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100%;
        }

        .chart-svg {
          width: 100%;
          height: 100%;
        }

        .chart-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          transition: stroke-dashoffset 0.1s linear;
        }

        .chart-line.drawing {
          stroke-dashoffset: 0;
        }

        .crash-point {
          animation: explode 0.5s ease-out;
        }

        @keyframes explode {
          0% { r: 8; fill-opacity: 1; }
          100% { r: 25; fill-opacity: 0; }
        }

        .plane {
          position: absolute;
          bottom: 20px;
          left: 50px;
          font-size: 28px;
          z-index: 10;
          transition: all 0.15s ease-out;
          transform: rotate(-20deg);
          filter: drop-shadow(0 0 10px rgba(56,161,105,0.6));
        }

        .plane.flying {
          animation: fly 2s ease-in-out infinite;
          left: calc(50px + ${multiplier * 15}px);
          bottom: calc(20px + ${multiplier * 6}px);
        }

        .plane.crashed {
          color: #dc2626;
          animation: crash 0.8s ease-out;
          filter: drop-shadow(0 0 15px rgba(220,38,38,0.8));
        }

        .multiplier-trail {
          position: absolute;
          bottom: 25px;
          left: 55px;
          display: flex;
          gap: 10px;
        }

        .trail-dot {
          width: 6px;
          height: 6px;
          background: #38a169;
          border-radius: 50%;
          animation: trail 1s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(56,161,105,0.8);
        }

        @keyframes fly {
          0% { 
            transform: rotate(-20deg) translateY(0px) scale(1);
            filter: drop-shadow(0 0 10px rgba(56,161,105,0.6));
          }
          50% { 
            transform: rotate(-18deg) translateY(-3px) scale(1.05);
            filter: drop-shadow(0 0 15px rgba(56,161,105,0.8));
          }
          100% { 
            transform: rotate(-22deg) translateY(0px) scale(1);
            filter: drop-shadow(0 0 10px rgba(56,161,105,0.6));
          }
        }

        @keyframes crash {
          0% { 
            transform: rotate(-20deg) scale(1);
          }
          25% { 
            transform: rotate(0deg) scale(1.2);
          }
          50% { 
            transform: rotate(45deg) scale(0.8);
          }
          75% { 
            transform: rotate(90deg) scale(1.3);
          }
          100% { 
            transform: rotate(180deg) scale(0.5);
            opacity: 0.3;
          }
        }

        @keyframes trail {
          0% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.2);
          }
          100% { 
            opacity: 0.2; 
            transform: scale(0.8);
          }
        }

        .betting-panel {
          background: #2f4553;
          padding: 20px;
          border-top: 1px solid #475569;
        }

        .bet-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          align-items: end;
        }

        .bet-amount label {
          display: block;
          margin-bottom: 8px;
          color: #94a3b8;
          font-size: 14px;
        }

        .amount-input {
          display: flex;
          background: #1a2c38;
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .amount-input button {
          background: #374151;
          border: none;
          color: white;
          padding: 12px 16px;
          cursor: pointer;
          font-size: 16px;
        }

        .amount-input input {
          flex: 1;
          background: none;
          border: none;
          color: white;
          text-align: center;
          font-size: 16px;
          padding: 12px;
        }

        .quick-bets {
          display: flex;
          gap: 8px;
        }

        .quick-bets button {
          background: #1a2c38;
          border: 1px solid #475569;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .quick-bets button.active {
          background: #16a34a;
          border-color: #16a34a;
        }

        .auto-settings {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .auto-cashout label,
        .auto-bet label {
          display: block;
          margin-bottom: 8px;
          color: #94a3b8;
          font-size: 14px;
        }

        .auto-cashout input {
          width: 100%;
          background: #1a2c38;
          border: 1px solid #475569;
          color: white;
          padding: 12px;
          border-radius: 6px;
        }

        .auto-controls {
          display: flex;
          gap: 8px;
        }

        .auto-controls input {
          flex: 1;
          background: #1a2c38;
          border: 1px solid #475569;
          color: white;
          padding: 12px;
          border-radius: 6px;
        }

        .auto-controls button {
          background: #1a2c38;
          border: 1px solid #475569;
          color: white;
          padding: 12px 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .auto-controls button.active {
          background: #dc2626;
          border-color: #dc2626;
        }

        .action-buttons {
          grid-column: 1 / -1;
          margin-top: 20px;
        }

        .bet-btn,
        .cashout-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .bet-btn {
          background: #16a34a;
          color: white;
        }

        .bet-btn:hover {
          background: #15803d;
        }

        .bet-btn.disabled {
          background: #6b7280;
          cursor: not-allowed;
        }

        .cashout-btn {
          background: #dc2626;
          color: white;
          animation: pulse-button 1s infinite;
        }

        @keyframes pulse-button {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .side-panel {
          background: #1a2c38;
          border-left: 1px solid #2f4553;
          display: flex;
          flex-direction: column;
        }

        .tabs {
          display: flex;
          background: #2f4553;
        }

        .tab {
          flex: 1;
          background: none;
          border: none;
          color: #94a3b8;
          padding: 15px 10px;
          cursor: pointer;
          font-size: 14px;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          color: white;
          border-bottom-color: #16a34a;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
        }

        .live-bets {
          padding: 15px;
        }

        .bets-header {
          display: grid;
          grid-template-columns: 1fr 80px 80px;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #2f4553;
          font-size: 12px;
          color: #94a3b8;
          font-weight: bold;
        }

        .bet-row {
          display: grid;
          grid-template-columns: 1fr 80px 80px;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #2f4553;
          font-size: 14px;
        }

        .player-name {
          color: #64748b;
        }

        .bet-amount {
          color: white;
        }

        .cashout-mult {
          color: #16a34a;
          font-weight: bold;
        }

        .history-section {
          border-top: 1px solid #2f4553;
          padding: 15px;
        }

        .history-header {
          font-weight: bold;
          margin-bottom: 10px;
          color: #94a3b8;
        }

        .history-item {
          display: grid;
          grid-template-columns: 80px 80px 1fr;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #2f4553;
          font-size: 14px;
        }

        .round-number {
          color: #64748b;
        }

        .round-multiplier.good {
          color: #16a34a;
          font-weight: bold;
        }

        .round-multiplier.normal {
          color: #dc2626;
        }

        .player-count {
          color: #94a3b8;
          font-size: 12px;
        }

        .chat-section {
          border-top: 1px solid #2f4553;
          display: flex;
          flex-direction: column;
          height: 200px;
        }

        .chat-header {
          padding: 15px;
          font-weight: bold;
          color: #94a3b8;
          border-bottom: 1px solid #2f4553;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 10px 15px;
        }

        .chat-message {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          line-height: 1.4;
        }

        .chat-time {
          color: #64748b;
          margin-right: 5px;
        }

        .chat-user {
          color: #16a34a;
          font-weight: bold;
          margin-right: 5px;
        }

        .chat-text {
          color: #e2e8f0;
        }

        .chat-input {
          display: flex;
          padding: 10px 15px;
          border-top: 1px solid #2f4553;
        }

        .chat-input input {
          flex: 1;
          background: #2f4553;
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
        }

        .chat-input button {
          background: #16a34a;
          border: none;
          color: white;
          padding: 8px 12px;
          margin-left: 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .game-layout {
            grid-template-columns: 1fr;
          }
          
          .bet-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};