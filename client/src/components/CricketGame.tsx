import React, { useState, useEffect } from 'react';

interface CricketGameProps {
  onClose: () => void;
}

export const CricketGame: React.FC<CricketGameProps> = ({ onClose }) => {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedTeam, setSelectedTeam] = useState<'team1' | 'team2' | null>(null);
  const [gameResult, setGameResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const teams = [
    { id: 'team1', name: 'Mumbai Indians', color: '#004BA0', logo: '🏏' },
    { id: 'team2', name: 'Chennai Super Kings', color: '#F9CD05', logo: '🦁' }
  ];

  const playCricket = async () => {
    if (!selectedTeam) return;
    
    setIsPlaying(true);
    
    // Simulate game play
    setTimeout(() => {
      const winner = Math.random() > 0.5 ? 'team1' : 'team2';
      const isWin = winner === selectedTeam;
      const winAmount = isWin ? betAmount * 1.8 : 0;
      
      setGameResult({
        winner,
        isWin,
        winAmount,
        team1Score: Math.floor(Math.random() * 200) + 100,
        team2Score: Math.floor(Math.random() * 200) + 100
      });
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <div className="cricket-game">
      <div className="game-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Cricket Match</h2>
        <div className="balance">₹1000.00</div>
      </div>

      <div className="cricket-field">
        <div className="match-info">
          <div className="match-title">T20 Championship</div>
          <div className="match-status">{isPlaying ? 'Match in Progress' : 'Ready to Bet'}</div>
        </div>

        <div className="teams-container">
          {teams.map(team => (
            <div 
              key={team.id}
              className={`team-card ${selectedTeam === team.id ? 'selected' : ''}`}
              onClick={() => !isPlaying && setSelectedTeam(team.id as 'team1' | 'team2')}
              style={{ borderColor: team.color }}
            >
              <div className="team-logo" style={{ backgroundColor: team.color }}>
                {team.logo}
              </div>
              <div className="team-name">{team.name}</div>
              <div className="team-odds">1.8x</div>
              {gameResult && (
                <div className="team-score">
                  {team.id === 'team1' ? gameResult.team1Score : gameResult.team2Score}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bet-controls">
          <div className="bet-amount-section">
            <label>Bet Amount</label>
            <div className="amount-input">
              <button onClick={() => setBetAmount(Math.max(10, betAmount - 10))}>-</button>
              <span>₹{betAmount}</span>
              <button onClick={() => setBetAmount(betAmount + 10)}>+</button>
            </div>
          </div>

          <button 
            className="place-bet-btn"
            onClick={playCricket}
            disabled={!selectedTeam || isPlaying}
          >
            {isPlaying ? 'Match in Progress...' : 'Place Bet'}
          </button>
        </div>

        {gameResult && (
          <div className={`result-modal ${gameResult.isWin ? 'win' : 'lose'}`}>
            <h3>{gameResult.isWin ? '🏆 You Won!' : '😞 You Lost!'}</h3>
            <div className="match-result">
              <div>Final Score:</div>
              <div>Mumbai Indians: {gameResult.team1Score}</div>
              <div>Chennai Super Kings: {gameResult.team2Score}</div>
              <div>Winner: {gameResult.winner === 'team1' ? 'Mumbai Indians' : 'Chennai Super Kings'}</div>
            </div>
            {gameResult.isWin && (
              <div className="win-amount">Won: ₹{gameResult.winAmount}</div>
            )}
            <button onClick={() => setGameResult(null)}>Play Again</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .cricket-game {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #2E7D32, #4CAF50);
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0,0,0,0.3);
          color: white;
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .cricket-field {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .match-info {
          text-align: center;
          color: white;
        }

        .match-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .match-status {
          font-size: 16px;
          opacity: 0.9;
        }

        .teams-container {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .team-card {
          background: white;
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.3s;
          min-width: 150px;
        }

        .team-card.selected {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .team-logo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin: 0 auto 10px;
        }

        .team-name {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .team-odds {
          color: #4CAF50;
          font-weight: bold;
        }

        .team-score {
          font-size: 20px;
          font-weight: bold;
          color: #FF6B35;
          margin-top: 10px;
        }

        .bet-controls {
          background: rgba(255,255,255,0.9);
          padding: 20px;
          border-radius: 15px;
          text-align: center;
        }

        .bet-amount-section {
          margin-bottom: 20px;
        }

        .bet-amount-section label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .amount-input {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .amount-input button {
          width: 40px;
          height: 40px;
          border: none;
          background: #4CAF50;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
        }

        .amount-input span {
          font-size: 18px;
          font-weight: bold;
          min-width: 80px;
        }

        .place-bet-btn {
          background: #FF6B35;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          max-width: 300px;
        }

        .place-bet-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .result-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 30px;
          border-radius: 20px;
          text-align: center;
          border: 3px solid #4CAF50;
          min-width: 300px;
        }

        .result-modal.lose {
          border-color: #f44336;
        }

        .match-result {
          margin: 20px 0;
          line-height: 1.6;
        }

        .win-amount {
          color: #4CAF50;
          font-size: 20px;
          font-weight: bold;
          margin: 15px 0;
        }

        .result-modal button {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};