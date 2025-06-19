import { useState, useEffect } from 'react';

interface WheelOfFortuneProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const WheelOfFortune = ({ onClose, refreshBalance }: WheelOfFortuneProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [gameResult, setGameResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const wheelSections = [
    { number: 1, color: '#ff4444', multiplier: 2 },
    { number: 2, color: '#4CAF50', multiplier: 3 },
    { number: 3, color: '#2196F3', multiplier: 5 },
    { number: 4, color: '#FF9800', multiplier: 2 },
    { number: 5, color: '#9C27B0', multiplier: 10 },
    { number: 6, color: '#607D8B', multiplier: 2 },
    { number: 7, color: '#795548', multiplier: 7 },
    { number: 8, color: '#E91E63', multiplier: 2 }
  ];

  const spinWheel = async () => {
    if (!selectedSection || betAmount <= 0) {
      alert('Please select a section and bet amount');
      return;
    }

    setIsSpinning(true);
    setShowResult(false);

    // Generate winning section
    const winningSection = Math.floor(Math.random() * 8) + 1;
    const sectionAngle = 360 / 8;
    const targetAngle = (winningSection - 1) * sectionAngle + (sectionAngle / 2);
    const spinRotation = 1440 + targetAngle; // 4 full rotations + target

    setRotation(spinRotation);

    setTimeout(async () => {
      const isWin = selectedSection === winningSection;
      const section = wheelSections.find(s => s.number === winningSection);
      const winAmount = isWin ? betAmount * (section?.multiplier || 1) : 0;

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/games/wheel/play', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            betAmount,
            betType: 'section',
            betValue: selectedSection,
            winningSection
          })
        });

        if (response.ok) {
          const result = await response.json();
          setGameResult({
            ...result,
            isWin,
            winAmount,
            winningSection,
            selectedSection
          });
          setShowResult(true);
          refreshBalance();
        }
      } catch (error) {
        console.error('Wheel game error:', error);
      }

      setIsSpinning(false);
    }, 3000);
  };

  const resetGame = () => {
    setShowResult(false);
    setGameResult(null);
    setSelectedSection(null);
    setRotation(0);
  };

  return (
    <div className="wheel-game">
      <div className="wheel-header">
        <h2>🎡 Wheel of Fortune</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="wheel-container">
        <div className="wheel-pointer">▼</div>
        <div 
          className="wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
          }}
        >
          {wheelSections.map((section, index) => (
            <div
              key={section.number}
              className="wheel-section"
              style={{
                background: section.color,
                transform: `rotate(${index * 45}deg)`
              }}
            >
              <div className="section-content">
                <div className="section-number">{section.number}</div>
                <div className="section-multiplier">{section.multiplier}x</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!showResult && (
        <div className="betting-section">
          <div className="section-selector">
            <h3>Choose a section:</h3>
            <div className="section-buttons">
              {wheelSections.map(section => (
                <button
                  key={section.number}
                  className={`section-btn ${selectedSection === section.number ? 'selected' : ''}`}
                  style={{ backgroundColor: section.color }}
                  onClick={() => setSelectedSection(section.number)}
                >
                  {section.number} ({section.multiplier}x)
                </button>
              ))}
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
            {selectedSection && (
              <div className="potential-win">
                Potential Win: ₹{(betAmount * (wheelSections.find(s => s.number === selectedSection)?.multiplier || 1)).toFixed(2)}
              </div>
            )}
          </div>

          <button 
            onClick={spinWheel} 
            disabled={!selectedSection || isSpinning}
            className="spin-btn"
          >
            {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
          </button>
        </div>
      )}

      {showResult && gameResult && (
        <div className="result-section">
          <div className={`result-card ${gameResult.isWin ? 'win' : 'lose'}`}>
            <h3>{gameResult.isWin ? '🎉 You Won!' : '😔 You Lost'}</h3>
            <div className="result-details">
              <p>Landed on: Section {gameResult.winningSection}</p>
              <p>Your choice: Section {gameResult.selectedSection}</p>
              <p>Bet Amount: ₹{betAmount}</p>
              {gameResult.isWin && <p className="win-amount">Won: ₹{gameResult.winAmount}</p>}
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
        .wheel-game {
          background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
          color: white;
          padding: 20px;
          border-radius: 15px;
          max-width: 400px;
          margin: 0 auto;
        }

        .wheel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .wheel-container {
          position: relative;
          width: 250px;
          height: 250px;
          margin: 20px auto;
        }

        .wheel-pointer {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 24px;
          color: #333;
          z-index: 10;
        }

        .wheel {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
          border: 4px solid #333;
          overflow: hidden;
        }

        .wheel-section {
          position: absolute;
          width: 50%;
          height: 50%;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .section-content {
          transform: rotate(22.5deg);
          text-align: center;
          color: white;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
          margin-top: 30px;
        }

        .section-number {
          font-size: 18px;
          margin-bottom: 2px;
        }

        .section-multiplier {
          font-size: 12px;
        }

        .betting-section {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 15px;
          margin-top: 20px;
        }

        .section-buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin: 15px 0;
        }

        .section-btn {
          padding: 8px 4px;
          border: 2px solid rgba(255,255,255,0.3);
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 10px;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
          transition: all 0.2s;
        }

        .section-btn.selected {
          border-color: #FFD700;
          box-shadow: 0 0 10px rgba(255,215,0,0.5);
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

        .spin-btn, .play-again-btn {
          width: 100%;
          padding: 15px;
          background: #FFD700;
          color: #333;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 15px;
          font-size: 16px;
        }

        .spin-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
      `}</style>
    </div>
  );
};