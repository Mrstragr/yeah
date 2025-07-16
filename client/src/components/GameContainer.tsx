import React, { useState, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from 'lucide-react';
import GameLobby from './GameLobby';

// Lazy load game components
const ProductionWinGo = React.lazy(() => import('./games/ProductionWinGo'));
const AuthenticAviator = React.lazy(() => import('./games/AuthenticAviator'));
const ProductionMines = React.lazy(() => import('./games/ProductionMines'));
const ProductionDice = React.lazy(() => import('./games/ProductionDice'));
const ProductionDragonTiger = React.lazy(() => import('./games/ProductionDragonTiger'));

const gameComponents = {
  'wingo': ProductionWinGo,
  'aviator': AuthenticAviator,
  'mines': ProductionMines,
  'dice': ProductionDice,
  'dragon-tiger': ProductionDragonTiger,
};

const gameNames = {
  'wingo': 'WinGo',
  'aviator': 'Aviator',
  'mines': 'Mines',
  'dice': 'Dice',
  'dragon-tiger': 'Dragon Tiger',
};

export default function GameContainer() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleSelectGame = (gameId: string) => {
    setSelectedGame(gameId);
  };

  const handleBackToLobby = () => {
    setSelectedGame(null);
  };

  const GameLoadingSpinner = () => (
    <Card className="min-h-[400px]">
      <CardContent className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <div className="text-lg font-medium">Loading game...</div>
          <div className="text-sm text-gray-600">
            Preparing {gameNames[selectedGame as keyof typeof gameNames] || 'game'} for you
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (selectedGame) {
    const GameComponent = gameComponents[selectedGame as keyof typeof gameComponents];
    
    if (!GameComponent) {
      return (
        <div className="max-w-4xl mx-auto p-4">
          <Card>
            <CardContent className="text-center py-20">
              <div className="text-lg font-bold text-red-600 mb-2">Game Not Found</div>
              <div className="text-sm text-gray-600 mb-4">
                The selected game is not available
              </div>
              <Button onClick={handleBackToLobby}>
                Back to Lobby
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Game Header with Back Button */}
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToLobby}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lobby
          </Button>
          <div className="text-lg font-bold text-gray-800">
            {gameNames[selectedGame as keyof typeof gameNames]}
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Game Content */}
        <Suspense fallback={<GameLoadingSpinner />}>
          <GameComponent />
        </Suspense>
      </div>
    );
  }

  return <GameLobby onSelectGame={handleSelectGame} />;
}