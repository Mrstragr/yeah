import { useState, useEffect } from 'react';
import { Sword, Shield, Zap, RotateCcw } from 'lucide-react';

interface ImprovedDragonTigerGameProps {
  onClose: () => void;
  refreshBalance: () => void;
}

export const ImprovedDragonTigerGame = ({ onClose, refreshBalance }: ImprovedDragonTigerGameProps) => {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'betting' | 'dealing' | 'finished'>('betting');
  const [cards, setCards] = useState<{ dragon?: string; tiger?: string }>({});
  const [gameResult, setGameResult] = useState<any>(null);
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(10);
  const [dealingAnimation, setDealingAnimation] = useState(false);

  const cardSuits = ['♠', '♥', '♦', '♣'];
  const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  useEffect(() => {
    if (gameState === 'betting') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (selectedBet) {
              startGame();
            }
            return 10;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState, selectedBet]);

  const generateCard = (): { value: string; suit: string; numValue: number } => {
    const suit = cardSuits[Math.floor(Math.random() * cardSuits.length)];
    const value = cardValues[Math.floor(Math.random() * cardValues.length)];
    
    let numValue = 0;
    if (value === 'A') numValue = 1;
    else if (['J', 'Q', 'K'].includes(value)) {
      numValue = { 'J': 11, 'Q': 12, 'K': 13 }[value] || 0;
    } else {
      numValue = parseInt(value);
    }

    return { value, suit, numValue };
  };

  const startGame = async () => {
    if (!selectedBet) return;

    setGameState('dealing');
    setDealingAnimation(true);

    // Simulate dealing animation
    setTimeout(() => {
      const dragonCard = generateCard();
      const tigerCard = generateCard();

      setCards({
        dragon: `${dragonCard.value}${dragonCard.suit}`,
        tiger: `${tigerCard.value}${tigerCard.suit}`
      });

      // Determine winner
      let winner = '';
      if (dragonCard.numValue > tigerCard.numValue) {
        winner = 'dragon';
      } else if (tigerCard.numValue > dragonCard.numValue) {
        winner = 'tiger';
      } else {
        winner = 'tie';
      }

      // Update history
      setGameHistory(prev => [winner, ...prev.slice(0, 9)]);

      // Submit to backend
      submitGame(winner, dragonCard, tigerCard);
    }, 2000);
  };

  const submitGame = async (winner: string, dragonCard: any, tigerCard: any) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/games/dragon-tiger/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          betAmount,
          betType: selectedBet
        })
      });

      if (response.ok) {
        const result = await response.json();
        setGameResult({
          ...result,
          winner,
          dragonCard,
          tigerCard
        });
        refreshBalance();
      }
    } catch (error) {
      console.error('Game error:', error);
    }

    setDealingAnimation(false);
    setGameState('finished');
  };

  const resetGame = () => {
    setGameState('betting');
    setCards({});
    setGameResult(null);
    setSelectedBet(null);
    setCountdown(10);
    setDealingAnimation(false);
  };

  const getCardColor = (card: string) => {
    return card.includes('♥') || card.includes('♦') ? 'text-red-500' : 'text-black';
  };

  const getBetStyle = (betType: string) => {
    const isSelected = selectedBet === betType;
    const baseStyle = "p-6 rounded-xl font-bold text-xl transition-all transform hover:scale-105 cursor-pointer";
    
    switch (betType) {
      case 'dragon':
        return `${baseStyle} ${isSelected ? 'bg-gradient-to-br from-red-600 to-red-800 ring-2 ring-yellow-400' : 'bg-gradient-to-br from-red-500 to-red-700'} text-white`;
      case 'tiger':
        return `${baseStyle} ${isSelected ? 'bg-gradient-to-br from-orange-600 to-orange-800 ring-2 ring-yellow-400' : 'bg-gradient-to-br from-orange-500 to-orange-700'} text-white`;
      case 'tie':
        return `${baseStyle} ${isSelected ? 'bg-gradient-to-br from-purple-600 to-purple-800 ring-2 ring-yellow-400' : 'bg-gradient-to-br from-purple-500 to-purple-700'} text-white`;
      default:
        return baseStyle;
    }
  };

  const getHistoryIcon = (result: string) => {
    switch (result) {
      case 'dragon': return '🐉';
      case 'tiger': return '🐅';
      case 'tie': return '🤝';
      default: return '?';
    }
  };

  const getMultiplier = (betType: string) => {
    switch (betType) {
      case 'dragon':
      case 'tiger':
        return '1.95x';
      case 'tie':
        return '8x';
      default:
        return '1x';
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Dragon Tiger</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        {/* Game Timer */}
        {gameState === 'betting' && (
          <div className="text-center mb-6">
            <div className="text-white text-lg mb-2">Betting closes in</div>
            <div className="text-4xl font-bold text-yellow-400 mb-2">
              {countdown}s
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((10 - countdown) / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cards Display */}
        <div className="flex justify-center items-center gap-8 mb-6 h-40">
          {/* Dragon Side */}
          <div className="text-center">
            <div className="text-red-400 text-lg font-bold mb-2 flex items-center gap-2">
              <Sword size={20} />
              DRAGON
            </div>
            <div className={`w-24 h-32 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
              dealingAnimation ? 'animate-pulse bg-red-600 border-red-400' : 
              cards.dragon ? 'bg-white border-gray-400' : 'bg-gray-700 border-gray-600'
            }`}>
              {dealingAnimation ? '?' : (
                cards.dragon ? (
                  <span className={getCardColor(cards.dragon)}>{cards.dragon}</span>
                ) : '?'
              )}
            </div>
          </div>

          {/* VS */}
          <div className="text-yellow-400 text-4xl font-bold">VS</div>

          {/* Tiger Side */}
          <div className="text-center">
            <div className="text-orange-400 text-lg font-bold mb-2 flex items-center gap-2">
              <Shield size={20} />
              TIGER
            </div>
            <div className={`w-24 h-32 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
              dealingAnimation ? 'animate-pulse bg-orange-600 border-orange-400' : 
              cards.tiger ? 'bg-white border-gray-400' : 'bg-gray-700 border-gray-600'
            }`}>
              {dealingAnimation ? '?' : (
                cards.tiger ? (
                  <span className={getCardColor(cards.tiger)}>{cards.tiger}</span>
                ) : '?'
              )}
            </div>
          </div>
        </div>

        {/* Game History */}
        <div className="mb-6">
          <h3 className="text-white text-lg mb-3 font-bold">Recent Results</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {gameHistory.map((result, index) => (
              <div
                key={index}
                className="min-w-[40px] h-10 rounded-lg flex items-center justify-center bg-gray-700 text-xl"
              >
                {getHistoryIcon(result)}
              </div>
            ))}
          </div>
        </div>

        {/* Betting Interface */}
        {gameState === 'betting' && (
          <div className="space-y-4 mb-6">
            {/* Bet Amount */}
            <div>
              <h3 className="text-white text-lg mb-3 font-bold">Bet Amount</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[100, 500, 1000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`py-3 rounded-lg font-bold transition-all ${
                      betAmount === amount
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg text-center text-xl font-bold"
                min="10"
                max="50000"
              />
            </div>

            {/* Bet Selection */}
            <div>
              <h3 className="text-white text-lg mb-3 font-bold">Choose Your Bet</h3>
              <div className="space-y-3">
                <div
                  onClick={() => setSelectedBet('dragon')}
                  className={getBetStyle('dragon')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sword size={24} />
                      <span>DRAGON</span>
                    </div>
                    <span>{getMultiplier('dragon')}</span>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedBet('tie')}
                  className={getBetStyle('tie')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap size={24} />
                      <span>TIE</span>
                    </div>
                    <span>{getMultiplier('tie')}</span>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedBet('tiger')}
                  className={getBetStyle('tiger')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield size={24} />
                      <span>TIGER</span>
                    </div>
                    <span>{getMultiplier('tiger')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dealing State */}
        {gameState === 'dealing' && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🃏</div>
            <div className="text-white text-xl font-bold animate-pulse">
              Dealing Cards...
            </div>
          </div>
        )}

        {/* Reset Button */}
        {gameState === 'finished' && (
          <button
            onClick={resetGame}
            className="w-full py-4 rounded-xl font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transition-all transform shadow-lg flex items-center justify-center gap-2 mb-6"
          >
            <RotateCcw size={20} />
            PLAY AGAIN
          </button>
        )}

        {/* Game Result */}
        {gameResult && (
          <div className={`p-6 rounded-xl ${
            gameResult.isWin 
              ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500' 
              : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 border border-red-500'
          }`}>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-3 ${
                gameResult.isWin ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameResult.isWin ? '🎉 YOU WON!' : '😞 YOU LOST'}
              </div>
              <div className="text-white text-xl mb-2">
                Winner: <span className="font-bold capitalize">
                  {gameResult.winner} {getHistoryIcon(gameResult.winner)}
                </span>
              </div>
              <div className="text-white text-lg mb-2">
                {gameResult.isWin ? `+₹${gameResult.winAmount}` : `-₹${betAmount}`}
              </div>
              {gameResult.multiplier && (
                <div className="text-gray-300 text-sm">
                  Multiplier: {gameResult.multiplier}x
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game Rules */}
        <div className="mt-6 p-4 bg-yellow-900/30 rounded-lg">
          <h4 className="text-white font-bold mb-2">Game Rules</h4>
          <ul className="text-yellow-200 text-sm space-y-1">
            <li>• Highest card wins (A=1, J=11, Q=12, K=13)</li>
            <li>• Dragon/Tiger pays 1.95x</li>
            <li>• Tie pays 8x but is rare</li>
            <li>• Simple and fast-paced gameplay</li>
          </ul>
        </div>
      </div>
    </div>
  );
};