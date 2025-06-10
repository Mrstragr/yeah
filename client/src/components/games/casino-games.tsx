import { useState, useEffect } from "react";

interface CasinoGameProps {
  title: string;
  onPlay: (betAmount: number) => void;
  onClose: () => void;
}

const Card3D = ({ card, isRevealed, isDealing, dealDelay = 0 }: { 
  card: string; 
  isRevealed: boolean; 
  isDealing: boolean; 
  dealDelay?: number;
}) => {
  const suit = card.slice(-1);
  const rank = card.slice(0, -1);
  const isRed = ['♥', '♦'].includes(suit);
  
  return (
    <div className="relative perspective-1000">
      <div 
        className={`
          w-16 h-24 md:w-20 md:h-28 rounded-xl transition-all duration-700 transform-gpu preserve-3d
          ${isDealing ? 'animate-card-flip' : isRevealed ? '' : 'rotateY-180'}
          ${isRevealed ? 'hover:scale-110 hover:rotate-3' : ''}
        `}
        style={{ 
          animationDelay: `${dealDelay}ms`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Card Front */}
        <div className={`
          absolute inset-0 w-full h-full bg-gradient-to-br from-white via-gray-50 to-gray-100 
          rounded-xl border-2 border-gray-300 backface-hidden shadow-2xl
          flex flex-col justify-between p-2
          ${isRevealed ? 'rotateY-0' : 'rotateY-180'}
        `}>
          <div className={`text-sm font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
            <div>{rank}</div>
            <div className="text-lg leading-none">{suit}</div>
          </div>
          <div className={`text-3xl self-center ${isRed ? 'text-red-600' : 'text-black'}`}>
            {suit}
          </div>
          <div className={`text-sm font-bold transform rotate-180 self-end ${isRed ? 'text-red-600' : 'text-black'}`}>
            <div>{rank}</div>
            <div className="text-lg leading-none">{suit}</div>
          </div>
        </div>
        
        {/* Card Back */}
        <div className={`
          absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 
          rounded-xl border-2 border-blue-700 backface-hidden shadow-2xl
          flex items-center justify-center
          ${isRevealed ? 'rotateY-180' : 'rotateY-0'}
        `}>
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 m-1 rounded-lg flex items-center justify-center">
            <div className="text-white text-xs font-bold opacity-50">🎰</div>
          </div>
        </div>
      </div>
      
      {isDealing && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60 animate-particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const WinCelebration = ({ winner, betType, winAmount }: { 
  winner: string | null; 
  betType: string | null; 
  winAmount: number;
}) => {
  if (!winner || winAmount <= 0) return null;
  
  const isWin = betType === winner;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-none">
      <div className="text-center">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-particle-float"
            style={{
              left: `${50 + (Math.random() - 0.5) * 100}%`,
              top: `${50 + (Math.random() - 0.5) * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        
        <div className="relative z-10">
          <div className="text-8xl mb-4 animate-bounce">
            {isWin ? '🏆' : '🎲'}
          </div>
          <div className={`text-6xl font-bold animate-pulse mb-4 ${isWin ? 'text-green-400' : 'text-red-400'}`}>
            {isWin ? 'YOU WIN!' : 'GAME OVER'}
          </div>
          {isWin && (
            <div className="text-4xl font-bold text-yellow-400">
              ₹{winAmount.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function AndarBaharGame({ title, onPlay, onClose }: CasinoGameProps) {
  const [gamePhase, setGamePhase] = useState<'betting' | 'dealing' | 'result'>('betting');
  const [betSide, setBetSide] = useState<'andar' | 'bahar' | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [jokerCard, setJokerCard] = useState<string>("");
  const [andarCards, setAndarCards] = useState<string[]>([]);
  const [baharCards, setBaharCards] = useState<string[]>([]);
  const [winner, setWinner] = useState<'andar' | 'bahar' | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const generateCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return `${rank}${suit}`;
  };

  const getCardValue = (card: string) => {
    const rank = card.slice(0, -1);
    return ['J', 'Q', 'K'].includes(rank) ? 10 : rank === 'A' ? 1 : parseInt(rank);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gamePhase === 'betting') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            startGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gamePhase]);

  const startGame = () => {
    setGamePhase('dealing');
    const joker = generateCard();
    setJokerCard(joker);
    const jokerValue = getCardValue(joker);
    
    const newAndarCards: string[] = [];
    const newBaharCards: string[] = [];
    let isAndarTurn = true;
    let gameEnded = false;

    const dealingInterval = setInterval(() => {
      const newCard = generateCard();
      const cardValue = getCardValue(newCard);

      if (isAndarTurn) {
        newAndarCards.push(newCard);
        setAndarCards([...newAndarCards]);
        if (cardValue === jokerValue) {
          setWinner('andar');
          gameEnded = true;
        }
      } else {
        newBaharCards.push(newCard);
        setBaharCards([...newBaharCards]);
        if (cardValue === jokerValue) {
          setWinner('bahar');
          gameEnded = true;
        }
      }

      if (gameEnded) {
        clearInterval(dealingInterval);
        setGamePhase('result');
        if (betSide && betSide === (isAndarTurn ? 'andar' : 'bahar')) {
          onPlay(betAmount * 2);
        }
        setTimeout(() => {
          resetGame();
        }, 5000);
      }

      isAndarTurn = !isAndarTurn;
    }, 1000);
  };

  const resetGame = () => {
    setGamePhase('betting');
    setBetSide(null);
    setJokerCard("");
    setAndarCards([]);
    setBaharCards([]);
    setWinner(null);
    setTimeLeft(30);
  };

  const placeBet = (side: 'andar' | 'bahar') => {
    if (gamePhase === 'betting') {
      setBetSide(side);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-[#1e1e1e] p-3 flex items-center justify-between">
        <button onClick={onClose} className="text-white text-lg">←</button>
        <h1 className="text-white font-medium">{title}</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-green-800 p-4">
        {gamePhase === 'betting' && (
          <div className="text-center text-white mb-4">
            <div className="text-2xl font-bold mb-2">Place Your Bet</div>
            <div className="text-xl">Time: {timeLeft}s</div>
          </div>
        )}

        {jokerCard && (
          <div className="text-center mb-4">
            <div className="text-white text-sm mb-2">Joker Card</div>
            <div className="bg-white text-black p-3 rounded mx-auto w-16 h-20 flex items-center justify-center text-xl font-bold">
              {jokerCard}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className={`p-4 rounded-lg mb-2 ${betSide === 'andar' ? 'bg-[#D4AF37]' : 'bg-[#2a2a2a]'}`}>
              <div className="text-white font-bold text-lg mb-2">ANDAR</div>
              <div className="text-white text-sm">1:1 Payout</div>
              {gamePhase === 'betting' && (
                <button
                  onClick={() => placeBet('andar')}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Bet Andar
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {andarCards.map((card, index) => (
                <div key={index} className="bg-white text-black p-1 rounded text-xs w-10 h-12 flex items-center justify-center">
                  {card}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className={`p-4 rounded-lg mb-2 ${betSide === 'bahar' ? 'bg-[#D4AF37]' : 'bg-[#2a2a2a]'}`}>
              <div className="text-white font-bold text-lg mb-2">BAHAR</div>
              <div className="text-white text-sm">1:1 Payout</div>
              {gamePhase === 'betting' && (
                <button
                  onClick={() => placeBet('bahar')}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Bet Bahar
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {baharCards.map((card, index) => (
                <div key={index} className="bg-white text-black p-1 rounded text-xs w-10 h-12 flex items-center justify-center">
                  {card}
                </div>
              ))}
            </div>
          </div>
        </div>

        {winner && (
          <div className="text-center">
            <div className="text-2xl font-bold text-[#D4AF37] mb-2">
              {winner.toUpperCase()} WINS!
            </div>
            {betSide === winner && (
              <div className="text-green-400 text-lg">You Won! ₹{betAmount * 2}</div>
            )}
          </div>
        )}

        <div className="bg-[#1e1e1e] rounded-lg p-3 mt-4">
          <div className="text-white text-sm mb-3">Bet Amount</div>
          <div className="grid grid-cols-4 gap-2">
            {[10, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`p-2 rounded text-center ${
                  betAmount === amount ? 'bg-[#D4AF37] text-black' : 'bg-[#2a2a2a] text-white'
                }`}
                disabled={gamePhase !== 'betting'}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeenPattiGame({ title, onPlay, onClose }: CasinoGameProps) {
  const [gamePhase, setGamePhase] = useState<'betting' | 'dealing' | 'result'>('betting');
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState<'player' | 'dealer' | null>(null);
  const [winner, setWinner] = useState<'player' | 'dealer' | 'tie' | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const generateCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return `${rank}${suit}`;
  };

  const getHandValue = (cards: string[]) => {
    const values = cards.map(card => {
      const rank = card.slice(0, -1);
      return ['J', 'Q', 'K'].includes(rank) ? 10 : rank === 'A' ? 14 : parseInt(rank);
    }).sort((a, b) => b - a);

    // Check for sequence
    const isSequence = values.every((val, i) => i === 0 || values[i-1] - val === 1);
    
    // Check for same suit
    const suits = cards.map(card => card.slice(-1));
    const isFlush = suits.every(suit => suit === suits[0]);
    
    // Check for pairs/trips
    const ranks = cards.map(card => card.slice(0, -1));
    const rankCounts = ranks.reduce((acc: {[key: string]: number}, rank) => {
      acc[rank] = (acc[rank] || 0) + 1;
      return acc;
    }, {});
    
    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    
    if (counts[0] === 3) return 1000 + values[0]; // Trail (three of a kind)
    if (isSequence && isFlush) return 900 + values[0]; // Pure sequence
    if (isFlush) return 800 + values[0]; // Flush
    if (isSequence) return 700 + values[0]; // Sequence
    if (counts[0] === 2) return 600 + values[0]; // Pair
    
    return values[0]; // High card
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gamePhase === 'betting') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            dealCards();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gamePhase]);

  const dealCards = () => {
    setGamePhase('dealing');
    
    const newPlayerCards = [generateCard(), generateCard(), generateCard()];
    const newDealerCards = [generateCard(), generateCard(), generateCard()];
    
    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    
    setTimeout(() => {
      const playerValue = getHandValue(newPlayerCards);
      const dealerValue = getHandValue(newDealerCards);
      
      let gameWinner: 'player' | 'dealer' | 'tie';
      if (playerValue > dealerValue) gameWinner = 'player';
      else if (dealerValue > playerValue) gameWinner = 'dealer';
      else gameWinner = 'tie';
      
      setWinner(gameWinner);
      setGamePhase('result');
      
      if (betType === gameWinner) {
        onPlay(betAmount * 2);
      } else if (gameWinner === 'tie' && betType) {
        onPlay(betAmount);
      }
      
      setTimeout(() => {
        resetGame();
      }, 5000);
    }, 2000);
  };

  const resetGame = () => {
    setGamePhase('betting');
    setPlayerCards([]);
    setDealerCards([]);
    setBetType(null);
    setWinner(null);
    setTimeLeft(20);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-[#1e1e1e] p-3 flex items-center justify-between">
        <button onClick={onClose} className="text-white text-lg">←</button>
        <h1 className="text-white font-medium">{title}</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-green-800 p-4">
        {gamePhase === 'betting' && (
          <div className="text-center text-white mb-4">
            <div className="text-2xl font-bold mb-2">Place Your Bet</div>
            <div className="text-xl">Time: {timeLeft}s</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className={`p-4 rounded-lg mb-2 ${betType === 'player' ? 'bg-[#D4AF37]' : 'bg-[#2a2a2a]'}`}>
              <div className="text-white font-bold text-lg mb-2">PLAYER</div>
              {gamePhase === 'betting' && (
                <button
                  onClick={() => setBetType('player')}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Bet Player
                </button>
              )}
            </div>
            <div className="flex gap-1 justify-center">
              {playerCards.map((card, index) => (
                <div key={index} className="bg-white text-black p-2 rounded w-12 h-16 flex items-center justify-center text-sm font-bold">
                  {card}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className={`p-4 rounded-lg mb-2 ${betType === 'dealer' ? 'bg-[#D4AF37]' : 'bg-[#2a2a2a]'}`}>
              <div className="text-white font-bold text-lg mb-2">DEALER</div>
              {gamePhase === 'betting' && (
                <button
                  onClick={() => setBetType('dealer')}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Bet Dealer
                </button>
              )}
            </div>
            <div className="flex gap-1 justify-center">
              {dealerCards.map((card, index) => (
                <div key={index} className="bg-white text-black p-2 rounded w-12 h-16 flex items-center justify-center text-sm font-bold">
                  {card}
                </div>
              ))}
            </div>
          </div>
        </div>

        {winner && (
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-[#D4AF37]">
              {winner === 'tie' ? 'TIE!' : `${winner.toUpperCase()} WINS!`}
            </div>
            {betType === winner && (
              <div className="text-green-400 text-lg">You Won! ₹{betAmount * 2}</div>
            )}
            {winner === 'tie' && betType && (
              <div className="text-yellow-400 text-lg">Push! ₹{betAmount}</div>
            )}
          </div>
        )}

        <div className="bg-[#1e1e1e] rounded-lg p-3">
          <div className="text-white text-sm mb-3">Bet Amount</div>
          <div className="grid grid-cols-4 gap-2">
            {[10, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`p-2 rounded text-center ${
                  betAmount === amount ? 'bg-[#D4AF37] text-black' : 'bg-[#2a2a2a] text-white'
                }`}
                disabled={gamePhase !== 'betting'}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DragonTigerGame({ title, onPlay, onClose }: CasinoGameProps) {
  const [gamePhase, setGamePhase] = useState<'betting' | 'dealing' | 'result'>('betting');
  const [dragonCard, setDragonCard] = useState<string>("");
  const [tigerCard, setTigerCard] = useState<string>("");
  const [betType, setBetType] = useState<'dragon' | 'tiger' | 'tie' | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [winner, setWinner] = useState<'dragon' | 'tiger' | 'tie' | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const generateCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return `${rank}${suit}`;
  };

  const getCardValue = (card: string) => {
    const rank = card.slice(0, -1);
    if (rank === 'A') return 1;
    if (['J', 'Q', 'K'].includes(rank)) {
      return rank === 'J' ? 11 : rank === 'Q' ? 12 : 13;
    }
    return parseInt(rank);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gamePhase === 'betting') {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            dealCards();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gamePhase]);

  const dealCards = () => {
    setGamePhase('dealing');
    
    const dragon = generateCard();
    const tiger = generateCard();
    
    setDragonCard(dragon);
    setTigerCard(tiger);
    
    setTimeout(() => {
      const dragonValue = getCardValue(dragon);
      const tigerValue = getCardValue(tiger);
      
      let gameWinner: 'dragon' | 'tiger' | 'tie';
      if (dragonValue > tigerValue) gameWinner = 'dragon';
      else if (tigerValue > dragonValue) gameWinner = 'tiger';
      else gameWinner = 'tie';
      
      setWinner(gameWinner);
      setGamePhase('result');
      
      if (betType === gameWinner) {
        const payout = gameWinner === 'tie' ? betAmount * 8 : betAmount * 2;
        onPlay(payout);
      }
      
      setTimeout(() => {
        resetGame();
      }, 4000);
    }, 1500);
  };

  const resetGame = () => {
    setGamePhase('betting');
    setDragonCard("");
    setTigerCard("");
    setBetType(null);
    setWinner(null);
    setTimeLeft(15);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-[#1e1e1e] p-3 flex items-center justify-between">
        <button onClick={onClose} className="text-white text-lg">←</button>
        <h1 className="text-white font-medium">{title}</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 bg-green-800 p-4">
        {gamePhase === 'betting' && (
          <div className="text-center text-white mb-6">
            <div className="text-2xl font-bold mb-2">Place Your Bet</div>
            <div className="text-xl">Time: {timeLeft}s</div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className={`p-4 rounded-lg mb-4 ${betType === 'dragon' ? 'bg-[#D4AF37]' : 'bg-red-600'}`}>
              <div className="text-white font-bold text-lg mb-2">🐉</div>
              <div className="text-white font-bold">DRAGON</div>
              <div className="text-white text-xs">1:1</div>
              {gamePhase === 'betting' && (
                <button
                  onClick={() => setBetType('dragon')}
                  className="mt-2 bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Bet Dragon
                </button>
              )}
            </div>
            {dragonCard && (
              <div className="bg-white text-black p-3 rounded mx-auto w-16 h-20 flex items-center justify-center text-lg font-bold">
                {dragonCard}
              </div>
            )}
          </div>

          <div className="text-center">
            <div className={`p-4 rounded-lg mb-4 ${betType === 'tie' ? 'bg-[#D4AF37]' : 'bg-green-600'}`}>
              <div className="text-white font-bold text-lg mb-2">🤝</div>
              <div className="text-white font-bold">TIE</div>
              <div className="text-white text-xs">1:8</div>
              {gamePhase === 'betting' && (
                <button
                  onClick={() => setBetType('tie')}
                  className="mt-2 bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  Bet Tie
                </button>
              )}
            </div>
            <div className="text-white text-center text-sm mt-8">VS</div>
          </div>

          <div className="text-center">
            <div className={`p-4 rounded-lg mb-4 ${betType === 'tiger' ? 'bg-[#D4AF37]' : 'bg-orange-600'}`}>
              <div className="text-white font-bold text-lg mb-2">🐅</div>
              <div className="text-white font-bold">TIGER</div>
              <div className="text-white text-xs">1:1</div>
              {gamePhase === 'betting' && (
                <button
                  onClick={() => setBetType('tiger')}
                  className="mt-2 bg-orange-700 text-white px-3 py-1 rounded text-sm"
                >
                  Bet Tiger
                </button>
              )}
            </div>
            {tigerCard && (
              <div className="bg-white text-black p-3 rounded mx-auto w-16 h-20 flex items-center justify-center text-lg font-bold">
                {tigerCard}
              </div>
            )}
          </div>
        </div>

        {winner && (
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-[#D4AF37] mb-2">
              {winner.toUpperCase()} WINS!
            </div>
            {betType === winner && (
              <div className="text-green-400 text-lg">
                You Won! ₹{winner === 'tie' ? betAmount * 8 : betAmount * 2}
              </div>
            )}
          </div>
        )}

        <div className="bg-[#1e1e1e] rounded-lg p-3">
          <div className="text-white text-sm mb-3">Bet Amount</div>
          <div className="grid grid-cols-4 gap-2">
            {[10, 50, 100, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className={`p-2 rounded text-center ${
                  betAmount === amount ? 'bg-[#D4AF37] text-black' : 'bg-[#2a2a2a] text-white'
                }`}
                disabled={gamePhase !== 'betting'}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}