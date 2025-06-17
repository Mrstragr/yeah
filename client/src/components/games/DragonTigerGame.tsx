import { useState, useEffect, useRef } from 'react';
import { Crown, Zap } from 'lucide-react';

interface DragonTigerGameProps {
  betAmount: number;
  onGameResult: (result: any) => void;
  isPlaying: boolean;
}

export const DragonTigerGame = ({ betAmount, onGameResult, isPlaying }: DragonTigerGameProps) => {
  const [selectedBet, setSelectedBet] = useState<'dragon' | 'tiger' | 'tie' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [dragonCard, setDragonCard] = useState<{ suit: string; value: string; color: string } | null>(null);
  const [tigerCard, setTigerCard] = useState<{ suit: string; value: string; color: string } | null>(null);
  const [winner, setWinner] = useState<'dragon' | 'tiger' | 'tie' | null>(null);
  const [animating, setAnimating] = useState(false);

  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  useEffect(() => {
    if (isPlaying && !gameStarted) {
      startGame();
    }
  }, [isPlaying, gameStarted]);

  const generateCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    const color = suit === '♥' || suit === '♦' ? 'red' : 'black';
    return { suit, value, color };
  };

  const getCardValue = (card: { value: string }) => {
    if (card.value === 'A') return 1;
    if (['J', 'Q', 'K'].includes(card.value)) return card.value === 'J' ? 11 : card.value === 'Q' ? 12 : 13;
    return parseInt(card.value) || 10;
  };

  const startGame = () => {
    if (!selectedBet) {
      alert('Please select Dragon, Tiger, or Tie first!');
      onGameResult({ isWin: false, winAmount: 0 });
      return;
    }

    setGameStarted(true);
    setAnimating(true);
    setShowCards(false);
    setWinner(null);

    // Deal cards with animation delay
    setTimeout(() => {
      const dragon = generateCard();
      const tiger = generateCard();
      
      setDragonCard(dragon);
      setTigerCard(tiger);
      setShowCards(true);

      // Determine winner
      const dragonValue = getCardValue(dragon);
      const tigerValue = getCardValue(tiger);
      
      let gameWinner: 'dragon' | 'tiger' | 'tie';
      if (dragonValue > tigerValue) {
        gameWinner = 'dragon';
      } else if (tigerValue > dragonValue) {
        gameWinner = 'tiger';
      } else {
        gameWinner = 'tie';
      }

      setTimeout(() => {
        setWinner(gameWinner);
        setAnimating(false);

        // Calculate result
        const isWin = selectedBet === gameWinner;
        let multiplier = 0;
        
        if (isWin) {
          if (selectedBet === 'tie') {
            multiplier = 8; // 8:1 for tie
          } else {
            multiplier = 1.95; // 0.95:1 for dragon/tiger
          }
        }

        onGameResult({
          betType: selectedBet,
          betValue: selectedBet,
          gameResult: {
            dragonCard: dragon,
            tigerCard: tiger,
            winner: gameWinner
          },
          isWin,
          multiplier,
          winAmount: isWin ? betAmount * multiplier : 0
        });
      }, 1500);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-red-900 to-yellow-900 rounded-lg p-4 text-center">
        <div className="text-white text-xl font-bold">Dragon vs Tiger</div>
        <div className="text-yellow-300 text-sm">Choose your side and win!</div>
      </div>

      {/* Betting Options */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedBet(selectedBet === 'dragon' ? null : 'dragon')}
          disabled={gameStarted}
          className={`p-4 rounded-lg transition-all ${
            selectedBet === 'dragon'
              ? 'bg-red-600 text-white scale-105 shadow-lg'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          <div className="text-2xl mb-2">🐲</div>
          <div className="font-bold">DRAGON</div>
          <div className="text-sm opacity-80">1.95x</div>
        </button>

        <button
          onClick={() => setSelectedBet(selectedBet === 'tie' ? null : 'tie')}
          disabled={gameStarted}
          className={`p-4 rounded-lg transition-all ${
            selectedBet === 'tie'
              ? 'bg-purple-600 text-white scale-105 shadow-lg'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          <div className="text-2xl mb-2">⚡</div>
          <div className="font-bold">TIE</div>
          <div className="text-sm opacity-80">8x</div>
        </button>

        <button
          onClick={() => setSelectedBet(selectedBet === 'tiger' ? null : 'tiger')}
          disabled={gameStarted}
          className={`p-4 rounded-lg transition-all ${
            selectedBet === 'tiger'
              ? 'bg-orange-600 text-white scale-105 shadow-lg'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          <div className="text-2xl mb-2">🐅</div>
          <div className="font-bold">TIGER</div>
          <div className="text-sm opacity-80">1.95x</div>
        </button>
      </div>

      {/* Game Arena */}
      <div className="bg-gradient-to-b from-green-900 to-green-800 rounded-lg p-6 min-h-64">
        <div className="grid grid-cols-2 gap-8 items-center">
          {/* Dragon Side */}
          <div className="text-center">
            <div className="text-red-400 text-lg font-bold mb-4">DRAGON</div>
            <div className="card-container">
              {showCards && dragonCard ? (
                <div className={`w-20 h-28 bg-white rounded-lg flex flex-col items-center justify-center mx-auto shadow-lg ${winner === 'dragon' ? 'ring-2 ring-yellow-500' : ''}`}>
                  <div className={`text-2xl font-bold ${dragonCard.color === 'red' ? 'text-red-600' : 'text-gray-800'}`}>
                    {dragonCard.value}
                  </div>
                  <div className={`text-xl ${dragonCard.color === 'red' ? 'text-red-600' : 'text-gray-800'}`}>
                    {dragonCard.suit}
                  </div>
                </div>
              ) : (
                <div className="w-20 h-28 bg-blue-800 rounded-lg flex items-center justify-center mx-auto shadow-lg">
                  <div className="text-white text-sm">🂠</div>
                </div>
              )}
            </div>
          </div>

          {/* VS Indicator */}
          <div className="text-center">
            <div className="text-yellow-500 text-4xl font-bold animate-pulse">VS</div>
          </div>

          {/* Tiger Side */}
          <div className="text-center">
            <div className="text-orange-400 text-lg font-bold mb-4">TIGER</div>
            <div className="card-container">
              {showCards && tigerCard ? (
                <div className={`w-20 h-28 bg-white rounded-lg flex flex-col items-center justify-center mx-auto shadow-lg ${winner === 'tiger' ? 'ring-2 ring-yellow-500' : ''}`}>
                  <div className={`text-2xl font-bold ${tigerCard.color === 'red' ? 'text-red-600' : 'text-gray-800'}`}>
                    {tigerCard.value}
                  </div>
                  <div className={`text-xl ${tigerCard.color === 'red' ? 'text-red-600' : 'text-gray-800'}`}>
                    {tigerCard.suit}
                  </div>
                </div>
              ) : (
                <div className="w-20 h-28 bg-blue-800 rounded-lg flex items-center justify-center mx-auto shadow-lg">
                  <div className="text-white text-sm">🂠</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Winner Announcement */}
        {winner && (
          <div className="text-center mt-6">
            <div className={`text-3xl font-bold animate-bounce ${
              winner === 'dragon' ? 'text-red-500' :
              winner === 'tiger' ? 'text-orange-500' :
              'text-purple-500'
            }`}>
              {winner === 'dragon' ? '🐲 DRAGON WINS!' :
               winner === 'tiger' ? '🐅 TIGER WINS!' :
               '⚡ TIE!'}
            </div>
            <div className="text-white mt-2">
              {selectedBet === winner ? 
                `You won ₹${(betAmount * (winner === 'tie' ? 8 : 1.95)).toFixed(0)}!` :
                `You lost ₹${betAmount}`
              }
            </div>
          </div>
        )}
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400">Your Bet</div>
          <div className="text-white font-bold">₹{betAmount}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400">Selection</div>
          <div className="text-yellow-500 font-bold">{selectedBet?.toUpperCase() || 'None'}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400">Potential</div>
          <div className="text-green-500 font-bold">
            ₹{selectedBet ? (betAmount * (selectedBet === 'tie' ? 8 : 1.95)).toFixed(0) : '0'}
          </div>
        </div>
      </div>


    </div>
  );
};