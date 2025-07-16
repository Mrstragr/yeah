import React from 'react';

export default function TestAviator() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-black/50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-400">🛩️ AVIATOR</h1>
            <div className="text-green-400 font-mono">Balance: ₹10,000</div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-black/80 rounded-xl p-6 mb-6">
          {/* Multiplier Display */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-red-400 animate-pulse">
              2.45x
            </div>
            <div className="text-gray-400">Current Multiplier</div>
          </div>

          {/* Game Canvas Area */}
          <div className="bg-slate-900 rounded-lg h-64 flex items-center justify-center mb-6">
            <div className="text-red-400 text-xl">
              🛩️ AUTHENTIC SPRIBE AVIATOR GAME AREA 🛩️
            </div>
          </div>

          {/* Betting Interface */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bet 1 */}
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-white font-bold mb-3">BET 1</div>
              <div className="space-y-3">
                <div className="bg-slate-700 rounded p-3 flex justify-between items-center">
                  <span>Bet Amount:</span>
                  <span className="text-yellow-400 font-bold">₹100</span>
                </div>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg">
                  PLACE BET
                </button>
              </div>
            </div>

            {/* Bet 2 */}
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-white font-bold mb-3">BET 2</div>
              <div className="space-y-3">
                <div className="bg-slate-700 rounded p-3 flex justify-between items-center">
                  <span>Bet Amount:</span>
                  <span className="text-yellow-400 font-bold">₹200</span>
                </div>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg">
                  PLACE BET
                </button>
              </div>
            </div>
          </div>

          {/* Game History */}
          <div className="mt-6 bg-slate-800 rounded-lg p-4">
            <div className="text-white font-bold mb-3">Recent Multipliers</div>
            <div className="flex gap-2 flex-wrap">
              {[3.45, 1.23, 7.89, 2.10, 4.56].map((mult, idx) => (
                <div 
                  key={idx}
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    mult > 2 ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {mult}x
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center text-green-400 font-bold">
          ✅ AUTHENTIC AVIATOR GAME LOADED SUCCESSFULLY
        </div>
      </div>
    </div>
  );
}