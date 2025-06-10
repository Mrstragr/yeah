import { useState, useEffect } from "react";

interface CardGameProps {
  title: string;
  onPlay: (betAmount: number) => void;
  onClose: () => void;
}

export function HighLowCardGame({ title, onPlay, onClose }: CardGameProps) {
  const [gamePhase, setGamePhase] = useState<'betting' | 'revealing' | 'result'>('betting');
  const [currentCard, setCurrentCard] = useState<{suit: string, rank: string, value: number} | null>(null);
  const [nextCard, setNextCard] = useState<{suit: string, rank: string, value: number} | null>(null);
  const [betChoice, setBetChoice] = useState<'higher' | 'lower' | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [winAmount, setWinAmount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);

  const suits = ['♠', '♥', '♦', '♣'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const getCardValue = (rank: string) => {
    if (rank === 'A') return 1;
    if (['J', 'Q', 'K'].includes(rank)) return [11, 12, 13][['J', 'Q', 'K'].indexOf(rank)];
    return parseInt(rank);
  };

  const generateCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return { suit, rank, value: getCardValue(rank) };
  };

  useEffect(() => {
    // Initialize first card
    setCurrentCard(generateCard());
  }, []);

  const playRound = async () => {
    if (!betChoice || !currentCard) return;
    
    setGamePhase('revealing');
    setIsRevealing(true);
    
    // Generate next card after animation
    setTimeout(() => {
      const newCard = generateCard();
      setNextCard(newCard);
      setIsRevealing(false);
      
      // Check win
      const isWin = 
        (betChoice === 'higher' && newCard.value > currentCard.value) ||
        (betChoice === 'lower' && newCard.value < currentCard.value);
      
      if (isWin) {
        const multiplier = 1.8 + (streak * 0.1); // Increasing multiplier with streak
        const prize = betAmount * multiplier;
        setWinAmount(prize);
        setStreak(prev => prev + 1);
        onPlay(prize);
      } else {
        setWinAmount(0);
        setStreak(0);
      }
      
      setGamePhase('result');
      
      setTimeout(() => {
        if (isWin) {
          // Continue with next card
          setCurrentCard(newCard);
          setNextCard(null);
          setBetChoice(null);
          setGamePhase('betting');
        } else {
          resetGame();
        }
      }, 3000);
    }, 2000);
  };

  const resetGame = () => {
    setGamePhase('betting');
    setCurrentCard(generateCard());
    setNextCard(null);
    setBetChoice(null);
    setWinAmount(0);
    setStreak(0);
    setIsRevealing(false);
  };

  const cashOut = () => {
    if (streak > 0) {
      const cashOutAmount = betAmount * Math.pow(1.8, streak);
      onPlay(cashOutAmount);
      setWinAmount(cashOutAmount);
    }
    resetGame();
  };

  const CardComponent = ({ card, isHidden = false, isAnimating = false }: { 
    card: {suit: string, rank: string, value: number} | null; 
    isHidden?: boolean;
    isAnimating?: boolean;
  }) => (
    <div className={`
      w-24 h-36 rounded-lg border-2 flex flex-col items-center justify-center
      transition-all duration-500 transform
      ${isAnimating ? 'animate-pulse scale-110' : 'hover:scale-105'}
      ${isHidden ? 'bg-blue-900 border-blue-700' : 'bg-white border-gray-300'}
      shadow-2xl
    `}>
      {isHidden ? (
        <div className="text-blue-300 text-4xl">🎴</div>
      ) : card ? (
        <>
          <div className={`text-2xl font-bold ${['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-black'}`}>
            {card.rank}
          </div>
          <div className={`text-3xl ${['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-black'}`}>
            {card.suit}
          </div>
        </>
      ) : null}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-[#1e1e1e] p-3 flex items-center justify-between">
        <button onClick={onClose} className="text-white text-lg">←</button>
        <h1 className="text-white font-medium">{title}</h1>
        <div className="text-[#D4AF37] text-sm">Streak: {streak}</div>
      </div>

      <div className="flex-1 bg-gradient-to-b from-green-800 via-green-700 to-green-800 p-4 flex flex-col">
        {/* Game Status */}
        <div className="text-center mb-6">
          {gamePhase === 'betting' && (
            <div className="text-white text-xl font-bold">
              Will the next card be Higher or Lower?
            </div>
          )}
          {gamePhase === 'revealing' && (
            <div className="text-[#D4AF37] text-xl font-bold animate-pulse">
              Revealing...
            </div>
          )}
          {gamePhase === 'result' && (
            <div className={`text-xl font-bold ${winAmount > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {winAmount > 0 ? `🎉 You Won ₹${winAmount.toFixed(2)}!` : 'Game Over!'}
            </div>
          )}
        </div>

        {/* Cards Display */}
        <div className="flex-1 flex items-center justify-center mb-6">
          <div className="flex gap-8 items-center">
            <div className="text-center">
              <div className="text-white text-sm mb-2">Current Card</div>
              <CardComponent card={currentCard} />
              {currentCard && (
                <div className="text-white text-lg mt-2 font-bold">
                  Value: {currentCard.value}
                </div>
              )}
            </div>
            
            <div className="text-white text-4xl">VS</div>
            
            <div className="text-center">
              <div className="text-white text-sm mb-2">Next Card</div>
              <CardComponent 
                card={nextCard} 
                isHidden={!nextCard} 
                isAnimating={isRevealing}
              />
              {nextCard && (
                <div className="text-white text-lg mt-2 font-bold">
                  Value: {nextCard.value}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Betting Interface */}
        {gamePhase === 'betting' && (
          <div className="space-y-4">
            {/* Higher/Lower Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setBetChoice('higher')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  betChoice === 'higher' 
                    ? 'bg-green-600 border-green-500 text-white scale-105' 
                    : 'bg-[#2a2a2a] border-gray-600 text-white hover:border-green-500'
                }`}
              >
                <div className="text-3xl mb-2">📈</div>
                <div className="font-bold">HIGHER</div>
                <div className="text-sm opacity-80">{(1.8 + streak * 0.1).toFixed(1)}x payout</div>
              </button>
              
              <button
                onClick={() => setBetChoice('lower')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  betChoice === 'lower' 
                    ? 'bg-red-600 border-red-500 text-white scale-105' 
                    : 'bg-[#2a2a2a] border-gray-600 text-white hover:border-red-500'
                }`}
              >
                <div className="text-3xl mb-2">📉</div>
                <div className="font-bold">LOWER</div>
                <div className="text-sm opacity-80">{(1.8 + streak * 0.1).toFixed(1)}x payout</div>
              </button>
            </div>

            {/* Bet Amount */}
            <div className="bg-[#1e1e1e] rounded-lg p-4">
              <div className="text-white text-sm mb-3 text-center">Bet Amount</div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[50, 100, 250, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`p-2 rounded text-center transition-all duration-200 ${
                      betAmount === amount 
                        ? 'bg-[#D4AF37] text-black scale-105' 
                        : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={playRound}
                  disabled={!betChoice}
                  className={`py-3 rounded-lg font-bold transition-all duration-300 ${
                    betChoice 
                      ? 'bg-[#D4AF37] text-black hover:bg-yellow-500 transform hover:scale-105' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {betChoice ? `PLAY - ₹${betAmount}` : 'SELECT CHOICE'}
                </button>
                
                {streak > 0 && (
                  <button
                    onClick={cashOut}
                    className="py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all duration-300"
                  >
                    CASH OUT ₹{(betAmount * Math.pow(1.8, streak)).toFixed(0)}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Result Display */}
        {gamePhase === 'result' && (
          <div className="text-center space-y-4">
            <div className="text-white text-lg">
              Your choice: <span className="text-[#D4AF37] font-bold uppercase">{betChoice}</span>
            </div>
            <div className="text-white text-lg">
              Result: {currentCard?.value} → {nextCard?.value}
            </div>
            {winAmount > 0 ? (
              <div className="bg-green-600 p-4 rounded-lg animate-pulse">
                <div className="text-white text-xl font-bold">Correct!</div>
                <div className="text-white text-lg">Streak: {streak}</div>
                <div className="text-white text-sm">Continue playing or cash out!</div>
              </div>
            ) : (
              <div className="bg-red-600 p-4 rounded-lg">
                <div className="text-white text-xl font-bold">Wrong!</div>
                <div className="text-white text-lg">Game Over</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}