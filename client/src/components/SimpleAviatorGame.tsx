import { useState, useEffect } from 'react';

interface SimpleAviatorGameProps {
  betAmount: number;
  onGameResult: (result: any) => Promise<any>;
  isPlaying: boolean;
}

export const SimpleAviatorGame = ({ betAmount, onGameResult, isPlaying }: SimpleAviatorGameProps) => {
  const [gamePhase, setGamePhase] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [cashOutMultiplier, setCashOutMultiplier] = useState(2.0);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [gameHistory, setGameHistory] = useState<number[]>([1.23, 2.45, 8.90, 1.67, 3.21]);

  useEffect(() => {
    if (isPlaying && gamePhase === 'waiting') {
      startGame();
    }
  }, [isPlaying]);

  const startGame = () => {
    setGamePhase('flying');
    setCurrentMultiplier(1.0);
    setHasCashedOut(false);
    
    // Send bet to backend immediately
    const gameData = {
      betType: 'aviator',
      cashOutMultiplier: cashOutMultiplier
    };
    
    // Start multiplier animation
    const startTime = Date.now();
    const animate = () => {
      if (gamePhase !== 'flying') return;
      
      const elapsed = (Date.now() - startTime) / 1000;
      const newMultiplier = 1 + (elapsed * 0.5); // Increase by 0.5x per second
      
      setCurrentMultiplier(newMultiplier);
      
      // Simulate crash at random point (1.0x - 10.0x range)
      const crashPoint = 1 + Math.random() * 9;
      
      if (newMultiplier >= crashPoint) {
        handleCrash(crashPoint);
        return;
      }
      
      if (gamePhase === 'flying') {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
    
    // Send to backend and handle result
    onGameResult(gameData).then(result => {
      console.log('Aviator game result:', result);
    }).catch(error => {
      console.error('Aviator game error:', error);
    });
  };

  const handleCrash = (crashPoint: number) => {
    setGamePhase('crashed');
    setCurrentMultiplier(crashPoint);
    setGameHistory(prev => [crashPoint, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      setGamePhase('waiting');
    }, 3000);
  };

  const cashOut = () => {
    if (gamePhase === 'flying' && !hasCashedOut) {
      setHasCashedOut(true);
      setGamePhase('crashed');
      
      // Send cash out to backend
      const gameData = {
        betType: 'aviator',
        cashOutMultiplier: currentMultiplier
      };
      onGameResult(gameData);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-900 to-black rounded-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Aviator</h2>
        <div className="text-lg text-yellow-400">
          {gamePhase === 'waiting' && 'Waiting for next round...'}
          {gamePhase === 'flying' && 'Flying...'}
          {gamePhase === 'crashed' && 'Crashed!'}
        </div>
      </div>

      {/* Game Display */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
        
        {/* Multiplier Display */}
        <div className="text-center">
          <div className={`text-6xl font-bold mb-4 ${gamePhase === 'crashed' ? 'text-red-500' : 'text-green-400'}`}>
            {currentMultiplier.toFixed(2)}x
          </div>
          
          {gamePhase === 'flying' && (
            <div className="text-white text-lg">
              🛩️ Flying High!
            </div>
          )}
          
          {gamePhase === 'crashed' && (
            <div className="text-red-500 text-lg">
              💥 Crashed at {currentMultiplier.toFixed(2)}x
            </div>
          )}
        </div>
      </div>

      {/* Game History */}
      <div className="mb-6">
        <h3 className="text-white text-lg mb-3">Recent Results</h3>
        <div className="flex gap-2 overflow-x-auto">
          {gameHistory.map((result, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded-lg text-sm font-bold min-w-fit ${
                result >= 2 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {result.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>

      {/* Cash Out Settings */}
      <div className="mb-6">
        <h3 className="text-white text-lg mb-3">Auto Cash Out</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1.01"
            max="100"
            step="0.01"
            value={cashOutMultiplier}
            onChange={(e) => setCashOutMultiplier(parseFloat(e.target.value) || 2.0)}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg"
            disabled={gamePhase === 'flying'}
          />
          <span className="text-white">x</span>
        </div>
      </div>

      {/* Bet Amount Display */}
      <div className="mb-6 p-3 bg-gray-800 rounded-lg">
        <div className="text-white text-center">
          Bet Amount: <span className="text-yellow-400 font-bold">₹{betAmount}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-3">
        {gamePhase === 'flying' && !hasCashedOut && (
          <button
            onClick={cashOut}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xl rounded-lg hover:scale-105 transition-all shadow-lg"
          >
            Cash Out at {currentMultiplier.toFixed(2)}x
          </button>
        )}
        
        {gamePhase === 'waiting' && (
          <button
            onClick={startGame}
            disabled={isPlaying}
            className={`w-full py-3 rounded-lg font-bold text-xl transition-all ${
              isPlaying
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 shadow-lg'
            }`}
          >
            Start Flight
          </button>
        )}
        
        {gamePhase === 'crashed' && (
          <div className="text-center text-gray-400">
            Next round starting soon...
          </div>
        )}
      </div>
    </div>
  );
};