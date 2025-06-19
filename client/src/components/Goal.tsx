import { useState, useEffect } from 'react';

interface GoalProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const Goal = ({ onClose, refreshBalance }: GoalProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedGoal, setSelectedGoal] = useState<'home' | 'away' | 'draw' | null>(null);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'result'>('betting');
  const [matchTime, setMatchTime] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastEvent, setLastEvent] = useState('');

  const teams = {
    home: { name: 'Team A', color: '#4CAF50', emoji: '🟢' },
    away: { name: 'Team B', color: '#2196F3', emoji: '🔵' }
  };

  const matchEvents = [
    'Corner kick', 'Free kick', 'Yellow card', 'Shot on target',
    'Shot wide', 'Offside', 'Throw-in', 'Substitution'
  ];

  const placeBet = async () => {
    if (!selectedGoal || betAmount <= 0) {
      alert('Please select a team and bet amount');
      return;
    }

    setIsLoading(true);
    setGameState('playing');
    setMatchTime(0);
    setHomeScore(0);
    setAwayScore(0);

    // Simulate 90-second match (represents 90 minutes)
    const matchInterval = setInterval(() => {
      setMatchTime(prev => {
        const newTime = prev + 1;
        
        // Random events during match
        if (Math.random() < 0.3) {
          setLastEvent(matchEvents[Math.floor(Math.random() * matchEvents.length)]);
        }

        // Goal scoring probability (higher in later stages)
        const goalChance = newTime > 45 ? 0.15 : 0.1;
        
        if (Math.random() < goalChance) {
          if (Math.random() < 0.5) {
            setHomeScore(prev => prev + 1);
            setLastEvent('⚽ GOAL! Team A scores!');
          } else {
            setAwayScore(prev => prev + 1);
            setLastEvent('⚽ GOAL! Team B scores!');
          }
        }

        if (newTime >= 90) {
          clearInterval(matchInterval);
          finishMatch();
        }

        return newTime;
      });
    }, 100); // 100ms = 1 match minute
  };

  const finishMatch = async () => {
    let finalResult: 'home' | 'away' | 'draw';
    
    if (homeScore > awayScore) {
      finalResult = 'home';
    } else if (awayScore > homeScore) {
      finalResult = 'away';
    } else {
      finalResult = 'draw';
    }

    const isWin = selectedGoal === finalResult;
    const multiplier = getMultiplier(selectedGoal!);
    const winAmount = isWin ? betAmount * multiplier : 0;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/games/goal/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          betAmount,
          betType: selectedGoal,
          betValue: selectedGoal,
          homeScore,
          awayScore,
          result: finalResult
        })
      });

      if (response.ok) {
        const result = await response.json();
        setGameResult({
          ...result,
          isWin,
          winAmount,
          finalResult,
          homeScore,
          awayScore
        });
        setGameState('result');
        refreshBalance();
      }
    } catch (error) {
      console.error('Goal game error:', error);
    }

    setIsLoading(false);
  };

  const getMultiplier = (betType: string) => {
    switch (betType) {
      case 'home': return 2.1;
      case 'away': return 2.3;
      case 'draw': return 3.5;
      default: return 2;
    }
  };

  const resetGame = () => {
    setGameState('betting');
    setMatchTime(0);
    setHomeScore(0);
    setAwayScore(0);
    setGameResult(null);
    setSelectedGoal(null);
    setLastEvent('');
  };

  return (
    <div className="goal-game">
      <div className="goal-header">
        <h2>⚽ Goal</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="soccer-field">
        <div className="field-lines">
          <div className="center-circle"></div>
          <div className="goal home-goal">🥅</div>
          <div className="goal away-goal">🥅</div>
          <div className="soccer-ball">⚽</div>
        </div>
        
        <div className="scoreboard">
          <div className="team home-team">
            <span className="team-emoji">{teams.home.emoji}</span>
            <span className="team-name">{teams.home.name}</span>
            <span className="score">{homeScore}</span>
          </div>
          <div className="match-info">
            <div className="time">{matchTime}'</div>
            {gameState === 'playing' && <div className="status">LIVE</div>}
          </div>
          <div className="team away-team">
            <span className="score">{awayScore}</span>
            <span className="team-name">{teams.away.name}</span>
            <span className="team-emoji">{teams.away.emoji}</span>
          </div>
        </div>
      </div>

      {lastEvent && gameState === 'playing' && (
        <div className="match-event">
          📢 {lastEvent}
        </div>
      )}

      {gameState === 'betting' && (
        <div className="betting-section">
          <div className="bet-options">
            <h3>Who will win?</h3>
            <div className="team-buttons">
              <button 
                className={`team-btn home ${selectedGoal === 'home' ? 'selected' : ''}`}
                onClick={() => setSelectedGoal('home')}
              >
                <div className="team-info">
                  <span>{teams.home.emoji}</span>
                  <span>{teams.home.name}</span>
                </div>
                <div className="odds">{getMultiplier('home')}x</div>
              </button>
              
              <button 
                className={`team-btn draw ${selectedGoal === 'draw' ? 'selected' : ''}`}
                onClick={() => setSelectedGoal('draw')}
              >
                <div className="team-info">
                  <span>🤝</span>
                  <span>Draw</span>
                </div>
                <div className="odds">{getMultiplier('draw')}x</div>
              </button>
              
              <button 
                className={`team-btn away ${selectedGoal === 'away' ? 'selected' : ''}`}
                onClick={() => setSelectedGoal('away')}
              >
                <div className="team-info">
                  <span>{teams.away.emoji}</span>
                  <span>{teams.away.name}</span>
                </div>
                <div className="odds">{getMultiplier('away')}x</div>
              </button>
            </div>
          </div>

          <div className="bet-amount-section">
            <label>Bet Amount: ₹{betAmount}</label>
            <div className="amount-buttons">
              <button onClick={() => setBetAmount(10)}>₹10</button>
              <button onClick={() => setBetAmount(50)}>₹50</button>
              <button onClick={() => setBetAmount(100)}>₹100</button>
              <button onClick={() => setBetAmount(500)}>₹500</button>
            </div>
            {selectedGoal && (
              <div className="potential-win">
                Potential Win: ₹{(betAmount * getMultiplier(selectedGoal)).toFixed(2)}
              </div>
            )}
          </div>

          <button 
            onClick={placeBet} 
            disabled={!selectedGoal || isLoading}
            className="start-match-btn"
          >
            {isLoading ? 'Starting Match...' : 'Start Match'}
          </button>
        </div>
      )}

      {gameState === 'result' && gameResult && (
        <div className="result-section">
          <div className={`result-card ${gameResult.isWin ? 'win' : 'lose'}`}>
            <h3>{gameResult.isWin ? '🎉 You Won!' : '😔 You Lost'}</h3>
            <div className="final-score">
              <div>Final Score: {homeScore} - {awayScore}</div>
              <div>Result: {
                gameResult.finalResult === 'home' ? teams.home.name + ' Won' :
                gameResult.finalResult === 'away' ? teams.away.name + ' Won' : 'Draw'
              }</div>
              <div>Your Bet: {
                selectedGoal === 'home' ? teams.home.name :
                selectedGoal === 'away' ? teams.away.name : 'Draw'
              }</div>
              {gameResult.isWin && <div className="win-amount">Won: ₹{gameResult.winAmount}</div>}
            </div>
          </div>
          
          <div className="result-actions">
            <button onClick={resetGame} className="play-again-btn">
              Play Again
            </button>
            <button onClick={onClose} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .goal-game {
          background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
          color: white;
          padding: 20px;
          border-radius: 15px;
          max-width: 400px;
          margin: 0 auto;
        }

        .goal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .soccer-field {
          background: #2E7D32;
          border: 2px solid white;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 15px;
          position: relative;
          min-height: 150px;
        }

        .field-lines {
          position: relative;
          height: 100px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 5px;
        }

        .center-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
        }

        .goal {
          position: absolute;
          top: 30%;
          font-size: 20px;
        }

        .home-goal {
          left: -15px;
        }

        .away-goal {
          right: -15px;
        }

        .soccer-ball {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
          animation: ${gameState === 'playing' ? 'ball-move 2s infinite' : 'none'};
        }

        .scoreboard {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          padding: 10px;
          background: rgba(0,0,0,0.3);
          border-radius: 5px;
        }

        .team {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
        }

        .score {
          font-size: 24px;
          font-weight: bold;
          margin: 0 5px;
        }

        .match-info {
          text-align: center;
        }

        .time {
          font-size: 18px;
          font-weight: bold;
        }

        .status {
          background: #ff4444;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          animation: blink 1s infinite;
        }

        .match-event {
          background: rgba(255,255,255,0.1);
          padding: 8px;
          border-radius: 5px;
          text-align: center;
          margin-bottom: 15px;
          font-size: 12px;
        }

        .betting-section {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 15px;
        }

        .team-buttons {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin: 15px 0;
        }

        .team-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .team-btn.selected {
          border-color: #FFD700;
          background: rgba(255,215,0,0.2);
        }

        .team-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .odds {
          font-weight: bold;
          background: rgba(255,255,255,0.2);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .amount-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin: 10px 0;
        }

        .amount-buttons button {
          padding: 8px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }

        .potential-win {
          text-align: center;
          font-weight: bold;
          color: #FFD700;
          margin-top: 10px;
        }

        .start-match-btn, .play-again-btn {
          width: 100%;
          padding: 15px;
          background: #FFD700;
          color: #333;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 15px;
        }

        .result-card {
          text-align: center;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .result-card.win {
          background: rgba(76, 175, 80, 0.3);
          border: 2px solid #4CAF50;
        }

        .result-card.lose {
          background: rgba(244, 67, 54, 0.3);
          border: 2px solid #f44336;
        }

        .final-score div {
          margin: 5px 0;
        }

        .win-amount {
          color: #4CAF50;
          font-weight: bold;
          font-size: 18px;
        }

        .result-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @keyframes ball-move {
          0% { transform: translate(-50%, -50%) translateX(0); }
          25% { transform: translate(-50%, -50%) translateX(-20px); }
          50% { transform: translate(-50%, -50%) translateX(0); }
          75% { transform: translate(-50%, -50%) translateX(20px); }
          100% { transform: translate(-50%, -50%) translateX(0); }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};