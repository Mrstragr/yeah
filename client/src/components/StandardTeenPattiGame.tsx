import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface StandardTeenPattiGameProps {
  onClose: () => void;
  refreshBalance: () => Promise<void>;
}

export const StandardTeenPattiGame = ({ onClose, refreshBalance }: StandardTeenPattiGameProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBet, setSelectedBet] = useState<string>('player');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [cards, setCards] = useState<{player: string[], dealer: string[]} | null>(null);

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

    setIsPlaying(true);
    setCards(null);
    setGameResult(null);

    // Simulate card dealing
    setTimeout(async () => {
      const playerCards = ['A♠', 'K♥', 'Q♦'];
      const dealerCards = ['J♣', '10♠', '9♥'];
      setCards({ player: playerCards, dealer: dealerCards });

      try {
        const response = await apiRequest('POST', '/api/games/teen-patti/play', {
          betAmount,
          betType: selectedBet
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
    }, 2000);
  };

  return (
    <div className="teen-patti-game">
      <div className="game-header">
        <button onClick={onClose} className="back-button">
          ← Back
        </button>
        <h2>Teen Patti</h2>
        <div className="bet-display">₹{betAmount}</div>
      </div>

      <div className="game-content">
        <div className="cards-section">
          <div className="hand player-hand">
            <h3>Your Hand</h3>
            <div className="cards">
              {cards ? (
                cards.player.map((card, index) => (
                  <div key={index} className="card">{card}</div>
                ))
              ) : (
                [1, 2, 3].map(i => (
                  <div key={i} className="card-back">?</div>
                ))
              )}
            </div>
          </div>

          <div className="hand dealer-hand">
            <h3>Dealer Hand</h3>
            <div className="cards">
              {cards ? (
                cards.dealer.map((card, index) => (
                  <div key={index} className="card">{card}</div>
                ))
              ) : (
                [1, 2, 3].map(i => (
                  <div key={i} className="card-back">?</div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="betting-section">
          <div className="bet-amount">
            <label>Bet Amount</label>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              min="1"
              disabled={isPlaying}
            />
          </div>

          <div className="bet-options">
            {['player', 'dealer'].map(option => (
              <button
                key={option}
                className={`bet-option ${selectedBet === option ? 'selected' : ''}`}
                onClick={() => setSelectedBet(option)}
                disabled={isPlaying}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={playGame} 
          disabled={isPlaying}
          className="play-button"
        >
          {isPlaying ? 'Playing...' : 'Play Teen Patti'}
        </button>

        {gameResult && (
          <div className="result-display">
            <h3>Result: {gameResult.isWin ? 'You Win!' : 'You Lose'}</h3>
            <p>{gameResult.isWin ? `Won ₹${gameResult.winAmount}` : `Lost ₹${betAmount}`}</p>
          </div>
        )}
      </div>

      <style>{`
        .teen-patti-game {
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

        .bet-display {
          background: #10b981;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
        }

        .game-content {
          padding: 20px;
        }

        .cards-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .hand {
          text-align: center;
        }

        .hand h3 {
          margin-bottom: 15px;
          color: #fbbf24;
        }

        .cards {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .card, .card-back {
          width: 50px;
          height: 70px;
          background: white;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: black;
        }

        .card-back {
          background: #1e40af;
          color: white;
        }

        .betting-section {
          margin-bottom: 30px;
        }

        .bet-amount {
          margin-bottom: 20px;
        }

        .bet-amount label {
          display: block;
          margin-bottom: 8px;
          color: #fbbf24;
        }

        .bet-amount input {
          padding: 10px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: white;
          width: 150px;
        }

        .bet-options {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .bet-option {
          padding: 12px 24px;
          background: rgba(255,255,255,0.1);
          border: 2px solid transparent;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .bet-option.selected {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.2);
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
          margin-bottom: 20px;
        }

        .play-button:disabled {
          background: #374151;
          cursor: not-allowed;
        }

        .result-display {
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .cards-section {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};