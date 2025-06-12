interface CasinoSlidersProps {
  onPlayPlinko: () => void;
}

export function CasinoSliders({ onPlayPlinko }: CasinoSlidersProps) {
  return (
    <div className="space-y-6">
      {/* Classic Casino Games Slider */}
      <div className="bg-red-900 p-6 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold text-white">🎰 CLASSIC CASINO GAMES</h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4" style={{minWidth: 'max-content'}}>
            <div className="bg-yellow-600 p-6 rounded-lg text-center min-w-[200px] hover:bg-yellow-500 transition-colors cursor-pointer">
              <div className="text-5xl mb-3">✈️</div>
              <h3 className="font-bold text-white text-lg mb-2">Aviator</h3>
              <p className="text-yellow-100 text-sm mb-3">Watch the plane fly and cash out</p>
              <button className="bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-100 transition-colors">
                PLAY NOW
              </button>
            </div>
            <div className="bg-yellow-600 p-6 rounded-lg text-center min-w-[200px] hover:bg-yellow-500 transition-colors cursor-pointer">
              <div className="text-5xl mb-3">🪙</div>
              <h3 className="font-bold text-white text-lg mb-2">Coin Flip</h3>
              <p className="text-yellow-100 text-sm mb-3">Simple heads or tails betting</p>
              <button className="bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-100 transition-colors">
                PLAY NOW
              </button>
            </div>
            <div className="bg-yellow-600 p-6 rounded-lg text-center min-w-[200px] hover:bg-yellow-500 transition-colors cursor-pointer">
              <div className="text-5xl mb-3">🎲</div>
              <h3 className="font-bold text-white text-lg mb-2">Dice Roll</h3>
              <p className="text-yellow-100 text-sm mb-3">Roll dice and predict combinations</p>
              <button className="bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-100 transition-colors">
                PLAY NOW
              </button>
            </div>
            <div className="bg-yellow-600 p-6 rounded-lg text-center min-w-[200px] hover:bg-yellow-500 transition-colors cursor-pointer">
              <div className="text-5xl mb-3">🎫</div>
              <h3 className="font-bold text-white text-lg mb-2">Scratch Cards</h3>
              <p className="text-yellow-100 text-sm mb-3">Instant win scratch cards</p>
              <button className="bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-100 transition-colors">
                PLAY NOW
              </button>
            </div>
            <div className="bg-yellow-600 p-6 rounded-lg text-center min-w-[200px] hover:bg-yellow-500 transition-colors cursor-pointer">
              <div className="text-5xl mb-3">🎡</div>
              <h3 className="font-bold text-white text-lg mb-2">Roulette</h3>
              <p className="text-yellow-100 text-sm mb-3">Classic casino roulette wheel</p>
              <button className="bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-100 transition-colors">
                PLAY NOW
              </button>
            </div>
            <div className="bg-yellow-600 p-6 rounded-lg text-center min-w-[200px] hover:bg-yellow-500 transition-colors cursor-pointer">
              <div className="text-5xl mb-3">🃏</div>
              <h3 className="font-bold text-white text-lg mb-2">Blackjack</h3>
              <p className="text-yellow-100 text-sm mb-3">Beat the dealer with 21</p>
              <button className="bg-white text-yellow-600 px-4 py-2 rounded font-bold hover:bg-yellow-100 transition-colors">
                PLAY NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Games Slider */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 rounded-lg space-y-4 border-2 border-purple-400">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">🚀 NEW GAMES</h2>
          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            JUST LAUNCHED
          </span>
        </div>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4" style={{minWidth: 'max-content'}}>
            <div className="bg-green-600 p-8 rounded-lg text-center min-w-[250px] hover:scale-105 transition-all cursor-pointer border-2 border-white" onClick={onPlayPlinko}>
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="font-bold text-white text-xl mb-3">PLINKO</h3>
              <p className="text-white text-sm mb-4 opacity-90">Drop balls and win big multipliers!</p>
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-colors">
                PLAY NOW
              </button>
            </div>
            <div className="bg-purple-600 p-8 rounded-lg text-center min-w-[250px] hover:scale-105 transition-all cursor-pointer border-2 border-white">
              <div className="text-6xl mb-4">🌈</div>
              <h3 className="font-bold text-white text-xl mb-3">COLOR PREDICTION</h3>
              <p className="text-white text-sm mb-4 opacity-90">Predict colors and multiply winnings!</p>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-colors">
                COMING SOON
              </button>
            </div>
            <div className="bg-blue-600 p-8 rounded-lg text-center min-w-[250px] hover:scale-105 transition-all cursor-pointer border-2 border-white">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="font-bold text-white text-xl mb-3">CRASH GAME</h3>
              <p className="text-white text-sm mb-4 opacity-90">Watch the multiplier grow and cash out!</p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-colors">
                COMING SOON
              </button>
            </div>
            <div className="bg-indigo-600 p-8 rounded-lg text-center min-w-[250px] hover:scale-105 transition-all cursor-pointer border-2 border-white">
              <div className="text-6xl mb-4">💎</div>
              <h3 className="font-bold text-white text-xl mb-3">MINES</h3>
              <p className="text-white text-sm mb-4 opacity-90">Find gems while avoiding mines!</p>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-colors">
                COMING SOON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}