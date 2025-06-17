import { useState, useEffect, useRef } from 'react';
import { ParticleSystem } from './ParticleSystem';

interface AnimatedDragonTigerGameProps {
  betAmount: number;
  onGameResult: (result: any) => void;
  isPlaying: boolean;
}

interface Card {
  value: number;
  suit: string;
  displayValue: string;
}

export const AnimatedDragonTigerGame = ({ betAmount, onGameResult, isPlaying }: AnimatedDragonTigerGameProps) => {
  const [selectedBet, setSelectedBet] = useState<'dragon' | 'tiger' | 'tie' | null>(null);
  const [gamePhase, setGamePhase] = useState<'betting' | 'dealing' | 'revealing' | 'result'>('betting');
  const [dragonCard, setDragonCard] = useState<Card | null>(null);
  const [tigerCard, setTigerCard] = useState<Card | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [dealingAnimation, setDealingAnimation] = useState(false);
  const [gameHistory, setGameHistory] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const suits = ['♠', '♥', '♦', '♣'];
  const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  useEffect(() => {
    if (isPlaying && gamePhase === 'betting') {
      startCountdown();
    }
  }, [isPlaying, gamePhase]);

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (selectedBet) {
            startGame();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateCard = (): Card => {
    const value = Math.floor(Math.random() * 13) + 1;
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const displayValue = cardValues[value - 1];
    return { value, suit, displayValue };
  };

  const startGame = () => {
    if (!selectedBet) return;
    
    setGamePhase('dealing');
    setDealingAnimation(true);
    
    // Deal cards with animation
    setTimeout(() => {
      const dragon = generateCard();
      const tiger = generateCard();
      
      setDragonCard(dragon);
      setTigerCard(tiger);
      setDealingAnimation(false);
      setGamePhase('revealing');
      
      // Reveal result
      setTimeout(() => {
        let gameWinner: string;
        let isWin = false;
        let multiplier = 0;
        
        if (dragon.value > tiger.value) {
          gameWinner = 'dragon';
        } else if (tiger.value > dragon.value) {
          gameWinner = 'tiger';
        } else {
          gameWinner = 'tie';
        }
        
        setWinner(gameWinner);
        setGameHistory(prev => [gameWinner, ...prev.slice(0, 9)]);
        
        // Check win condition
        if (selectedBet === gameWinner) {
          isWin = true;
          if (gameWinner === 'tie') {
            multiplier = 11;
          } else {
            multiplier = 1.95;
          }
          setShowParticles(true);
          setTimeout(() => setShowParticles(false), 3000);
        }
        
        setGamePhase('result');
        
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
        
        // Reset for next round
        setTimeout(() => {
          setGamePhase('betting');
          setSelectedBet(null);
          setDragonCard(null);
          setTigerCard(null);
          setWinner(null);
          setCountdown(30);
        }, 4000);
      }, 2000);
    }, 1500);
  };

  const drawCard = (ctx: CanvasRenderingContext2D, card: Card | null, x: number, y: number, isRevealed: boolean) => {
    const cardWidth = 100;
    const cardHeight = 140;
    
    // Card shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(x + 5, y + 5, cardWidth, cardHeight);
    
    // Card background
    ctx.fillStyle = isRevealed ? 'white' : '#1a365d';
    ctx.fillRect(x, y, cardWidth, cardHeight);
    
    // Card border
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, cardWidth, cardHeight);
    
    if (isRevealed && card) {
      // Card value and suit
      ctx.fillStyle = card.suit === '♥' || card.suit === '♦' ? '#e53e3e' : '#2d3748';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(card.displayValue, x + cardWidth / 2, y + 40);
      
      ctx.font = '36px Arial';
      ctx.fillText(card.suit, x + cardWidth / 2, y + 90);
      
      // Corner values
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(card.displayValue, x + 8, y + 20);
      ctx.fillText(card.suit, x + 8, y + 40);
    } else if (!isRevealed) {
      // Card back pattern
      ctx.fillStyle = '#4299e1';
      ctx.fillRect(x + 10, y + 10, cardWidth - 20, cardHeight - 20);
      
      // Pattern
      ctx.fillStyle = '#2b6cb0';
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 7; j++) {
          if ((i + j) % 2 === 0) {
            ctx.fillRect(x + 10 + i * 16, y + 10 + j * 16, 16, 16);
          }
        }
      }
    }
  };

  const drawArena = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a202c');
    gradient.addColorStop(0.5, '#2d3748');
    gradient.addColorStop(1, '#4a5568');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Arena decorations
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    ctx.setLineDash([]);
    
    // Dragon side
    ctx.fillStyle = '#e53e3e';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🐉 DRAGON', 150, 50);
    
    // Tiger side
    ctx.fillStyle = '#f56500';
    ctx.fillText('🐅 TIGER', 450, 50);
    
    // VS text
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('VS', canvas.width / 2, canvas.height / 2);
    
    // Draw cards
    drawCard(ctx, dragonCard, 100, 80, gamePhase === 'revealing' || gamePhase === 'result');
    drawCard(ctx, tigerCard, 400, 80, gamePhase === 'revealing' || gamePhase === 'result');
    
    // Animation effects
    if (dealingAnimation) {
      // Flying cards animation
      ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 100, 30, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#1a202c';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Dealing...', canvas.width / 2, 110);
    }
    
    // Winner highlight
    if (winner && gamePhase === 'result') {
      if (winner === 'dragon') {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 5;
        ctx.strokeRect(95, 75, 110, 150);
      } else if (winner === 'tiger') {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 5;
        ctx.strokeRect(395, 75, 110, 150);
      } else {
        // Tie - highlight both
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 5;
        ctx.strokeRect(95, 75, 110, 150);
        ctx.strokeRect(395, 75, 110, 150);
      }
    }
  };

  useEffect(() => {
    drawArena();
  }, [gamePhase, dragonCard, tigerCard, winner, dealingAnimation]);

  const getBetButtonClass = (betType: 'dragon' | 'tiger' | 'tie') => {
    let baseClass = "px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ";
    
    if (selectedBet === betType) {
      baseClass += "scale-110 shadow-2xl ring-4 ring-white ";
    } else {
      baseClass += "hover:scale-105 shadow-lg opacity-80 hover:opacity-100 ";
    }
    
    switch (betType) {
      case 'dragon':
        return baseClass + "bg-gradient-to-br from-red-500 to-red-700 text-white shadow-red-500/50";
      case 'tiger':
        return baseClass + "bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-orange-500/50";
      case 'tie':
        return baseClass + "bg-gradient-to-br from-yellow-500 to-yellow-700 text-white shadow-yellow-500/50";
      default:
        return baseClass;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 p-4">
      <ParticleSystem isActive={showParticles} type="win" />
      
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-4 animate-pulse">
          🐉 DRAGON VS TIGER 🐅
        </h1>
        
        {/* Game History */}
        <div className="bg-black/40 p-4 rounded-lg mb-4">
          <h3 className="text-white text-sm mb-2">Recent Results:</h3>
          <div className="flex justify-center gap-2 flex-wrap">
            {gameHistory.map((result, index) => (
              <div 
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-bold capitalize
                  ${result === 'dragon' ? 'bg-red-500 text-white' : 
                    result === 'tiger' ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-black'}
                  ${index === 0 ? 'ring-2 ring-white scale-110 animate-bounce' : ''}
                `}
              >
                {result === 'dragon' ? '🐉' : result === 'tiger' ? '🐅' : '🤝'}
              </div>
            ))}
          </div>
        </div>
        
        {/* Countdown */}
        {gamePhase === 'betting' && (
          <div className="bg-black/60 p-3 rounded-lg inline-block">
            <div className="text-white">
              <span className="text-yellow-400 font-bold text-2xl">{countdown}s</span> to place bets
            </div>
          </div>
        )}
      </div>

      {/* Game Arena */}
      <div className="flex justify-center mb-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl">
          <canvas
            ref={canvasRef}
            width={600}
            height={250}
            className="rounded-lg"
          />
          
          {/* Game Status */}
          <div className="text-center mt-4">
            <div className="text-white text-lg font-bold">
              {gamePhase === 'betting' && 'Place Your Bet!'}
              {gamePhase === 'dealing' && 'Dealing Cards...'}
              {gamePhase === 'revealing' && 'Revealing Cards...'}
              {gamePhase === 'result' && (
                <div>
                  {winner === 'dragon' && '🐉 Dragon Wins!'}
                  {winner === 'tiger' && '🐅 Tiger Wins!'}
                  {winner === 'tie' && '🤝 It\'s a Tie!'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Betting Options */}
      {gamePhase === 'betting' && (
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-black/40 p-6 rounded-lg">
            <h3 className="text-white text-xl font-bold text-center mb-6">Choose Your Side</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedBet('dragon')}
                className={getBetButtonClass('dragon')}
              >
                🐉 Dragon
                <div className="text-sm opacity-80">Pays 1.95x</div>
              </button>
              
              <button
                onClick={() => setSelectedBet('tie')}
                className={getBetButtonClass('tie')}
              >
                🤝 Tie
                <div className="text-sm opacity-80">Pays 11x</div>
              </button>
              
              <button
                onClick={() => setSelectedBet('tiger')}
                className={getBetButtonClass('tiger')}
              >
                🐅 Tiger
                <div className="text-sm opacity-80">Pays 1.95x</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Stats */}
      <div className="max-w-md mx-auto">
        <div className="bg-black/40 p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-gray-400 text-sm">Your Bet</div>
              <div className="text-white text-xl font-bold">
                {selectedBet ? (
                  <span className="capitalize">
                    {selectedBet === 'dragon' && '🐉 Dragon'}
                    {selectedBet === 'tiger' && '🐅 Tiger'}
                    {selectedBet === 'tie' && '🤝 Tie'}
                  </span>
                ) : 'None'}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Bet Amount</div>
              <div className="text-yellow-400 text-xl font-bold">₹{betAmount}</div>
            </div>
          </div>
          
          {selectedBet && (
            <div className="text-center mt-4">
              <div className="text-gray-400 text-sm">Potential Win</div>
              <div className="text-green-400 text-2xl font-bold">
                ₹{(betAmount * (selectedBet === 'tie' ? 11 : 1.95)).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};