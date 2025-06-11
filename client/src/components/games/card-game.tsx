import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Spade, Heart, Diamond, Club } from "lucide-react";

interface CardGameProps {
  userBalance: string;
  onBet: (amount: number, gameData: any) => Promise<void>;
}

interface PlayingCard {
  suit: 'spades' | 'hearts' | 'diamonds' | 'clubs';
  value: string;
  numValue: number;
}

export function CardGame({ userBalance, onBet }: CardGameProps) {
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBet, setSelectedBet] = useState<'red' | 'black' | 'high' | 'low'>('red');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCard, setDrawnCard] = useState<PlayingCard | null>(null);
  const [lastResult, setLastResult] = useState<{won: boolean, payout: number, card: PlayingCard} | null>(null);
  const [gameHistory, setGameHistory] = useState<{bet: string, card: PlayingCard, won: boolean}[]>([
    {bet: 'red', card: {suit: 'hearts', value: 'K', numValue: 13}, won: true},
    {bet: 'black', card: {suit: 'clubs', value: '7', numValue: 7}, won: true},
    {bet: 'high', card: {suit: 'diamonds', value: '4', numValue: 4}, won: false},
    {bet: 'low', card: {suit: 'spades', value: 'A', numValue: 1}, won: true},
    {bet: 'red', card: {suit: 'spades', value: 'Q', numValue: 12}, won: false}
  ]);

  const quickAmounts = [50, 100, 250, 500, 1000, 2500];

  const suits = ['spades', 'hearts', 'diamonds', 'clubs'] as const;
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const getSuitIcon = (suit: string) => {
    switch (suit) {
      case 'spades': return <Spade className="w-8 h-8 text-black" />;
      case 'hearts': return <Heart className="w-8 h-8 text-red-500" />;
      case 'diamonds': return <Diamond className="w-8 h-8 text-red-500" />;
      case 'clubs': return <Club className="w-8 h-8 text-black" />;
      default: return <Spade className="w-8 h-8" />;
    }
  };

  const isRed = (suit: string) => suit === 'hearts' || suit === 'diamonds';
  const isBlack = (suit: string) => suit === 'spades' || suit === 'clubs';

  const drawCard = async () => {
    if (isDrawing || betAmount > parseFloat(userBalance)) return;

    setIsDrawing(true);
    setLastResult(null);

    // Animate card drawing
    const drawDuration = 2000;
    let animationCard: PlayingCard;
    
    const animationInterval = setInterval(() => {
      const randomSuit = suits[Math.floor(Math.random() * suits.length)];
      const randomValue = values[Math.floor(Math.random() * values.length)];
      animationCard = {
        suit: randomSuit,
        value: randomValue,
        numValue: randomValue === 'A' ? 1 : 
                 randomValue === 'J' ? 11 : 
                 randomValue === 'Q' ? 12 : 
                 randomValue === 'K' ? 13 : 
                 parseInt(randomValue)
      };
      setDrawnCard(animationCard);
    }, 100);

    setTimeout(() => {
      clearInterval(animationInterval);
      
      // Generate final card
      const finalSuit = suits[Math.floor(Math.random() * suits.length)];
      const finalValue = values[Math.floor(Math.random() * values.length)];
      const finalCard: PlayingCard = {
        suit: finalSuit,
        value: finalValue,
        numValue: finalValue === 'A' ? 1 : 
                 finalValue === 'J' ? 11 : 
                 finalValue === 'Q' ? 12 : 
                 finalValue === 'K' ? 13 : 
                 parseInt(finalValue)
      };
      
      setDrawnCard(finalCard);
      setIsDrawing(false);

      // Check win condition
      let won = false;
      if (selectedBet === 'red' && isRed(finalCard.suit)) {
        won = true;
      } else if (selectedBet === 'black' && isBlack(finalCard.suit)) {
        won = true;
      } else if (selectedBet === 'high' && finalCard.numValue >= 8) {
        won = true;
      } else if (selectedBet === 'low' && finalCard.numValue <= 6) {
        won = true;
      }

      const multiplier = 1.95; // 5% house edge for color bets
      const payout = won ? betAmount * multiplier : 0;

      setLastResult({
        won: won,
        payout: payout,
        card: finalCard
      });

      // Add to history
      setGameHistory(prev => [{
        bet: selectedBet,
        card: finalCard,
        won: won
      }, ...prev.slice(0, 4)]);

      // Place bet
      onBet(betAmount, {
        type: 'card-game',
        betAmount,
        selectedBet,
        drawnCard: finalCard,
        won: won,
        payout: payout,
        multiplier: multiplier
      });
    }, drawDuration);
  };

  return (
    <div className="space-y-6">
      {/* Game Display */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Card Display */}
            <div className="flex justify-center">
              <div className={`w-32 h-44 bg-white rounded-lg shadow-2xl border-2 flex flex-col items-center justify-center transition-transform duration-200 ${
                isDrawing ? 'animate-pulse scale-110' : ''
              }`}>
                {drawnCard ? (
                  <>
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {drawnCard.value}
                    </div>
                    {getSuitIcon(drawnCard.suit)}
                    <div className="text-2xl font-bold text-gray-800 mt-2 rotate-180">
                      {drawnCard.value}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400 text-lg">?</div>
                )}
              </div>
            </div>

            {/* Result Display */}
            {!isDrawing && drawnCard && (
              <div className="space-y-4">
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant={isRed(drawnCard.suit) ? 'default' : 'secondary'}>
                    RED {isRed(drawnCard.suit) ? '✓' : '✗'}
                  </Badge>
                  <Badge variant={isBlack(drawnCard.suit) ? 'default' : 'secondary'}>
                    BLACK {isBlack(drawnCard.suit) ? '✓' : '✗'}
                  </Badge>
                  <Badge variant={drawnCard.numValue >= 8 ? 'default' : 'secondary'}>
                    HIGH {drawnCard.numValue >= 8 ? '✓' : '✗'}
                  </Badge>
                  <Badge variant={drawnCard.numValue <= 6 ? 'default' : 'secondary'}>
                    LOW {drawnCard.numValue <= 6 ? '✓' : '✗'}
                  </Badge>
                </div>
                
                {lastResult && (
                  <div className={`text-lg font-semibold ${
                    lastResult.won ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {lastResult.won ? 
                      `Won $${lastResult.payout.toFixed(2)}!` : 
                      `Lost $${betAmount}`
                    }
                  </div>
                )}
              </div>
            )}

            {isDrawing && (
              <div className="text-xl font-semibold text-yellow-200 animate-pulse">
                Drawing card...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Betting Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Place Your Bet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bet Type Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Choose Bet Type</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedBet === 'red' ? 'default' : 'outline'}
                  onClick={() => setSelectedBet('red')}
                  disabled={isDrawing}
                  className="flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-red-500" />
                  Red
                </Button>
                <Button
                  variant={selectedBet === 'black' ? 'default' : 'outline'}
                  onClick={() => setSelectedBet('black')}
                  disabled={isDrawing}
                  className="flex items-center gap-2"
                >
                  <Spade className="w-4 h-4" />
                  Black
                </Button>
                <Button
                  variant={selectedBet === 'high' ? 'default' : 'outline'}
                  onClick={() => setSelectedBet('high')}
                  disabled={isDrawing}
                >
                  High (8-K)
                </Button>
                <Button
                  variant={selectedBet === 'low' ? 'default' : 'outline'}
                  onClick={() => setSelectedBet('low')}
                  disabled={isDrawing}
                >
                  Low (A-6)
                </Button>
              </div>
            </div>

            {/* Bet Amount */}
            <div>
              <label className="text-sm font-medium mb-2 block">Bet Amount</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min="10"
                max={parseFloat(userBalance)}
                disabled={isDrawing}
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount)}
                  disabled={isDrawing || amount > parseFloat(userBalance)}
                >
                  ${amount}
                </Button>
              ))}
            </div>

            {/* Payout Information */}
            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Selected Bet:</span>
                <span className="font-semibold uppercase">{selectedBet}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Win Chance:</span>
                <span className="font-semibold">
                  {selectedBet === 'red' || selectedBet === 'black' ? '48.1%' : '46.2%'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Multiplier:</span>
                <span className="font-semibold">1.95x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Potential Payout:</span>
                <span className="font-semibold">${(betAmount * 1.95).toFixed(2)}</span>
              </div>
            </div>

            {/* Draw Button */}
            <Button 
              onClick={drawCard}
              disabled={isDrawing || betAmount > parseFloat(userBalance)}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              {isDrawing ? 'Drawing...' : `Draw Card - $${betAmount}`}
            </Button>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Game History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gameHistory.map((game, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">#{gameHistory.length - index}</span>
                    <Badge variant={game.won ? 'default' : 'destructive'}>
                      {game.won ? 'Won' : 'Lost'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 uppercase">{game.bet}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{game.card.value}</span>
                      {getSuitIcon(game.card.suit)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistics Summary */}
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-600">
                    {gameHistory.filter(g => g.won).length}
                  </div>
                  <div className="text-gray-500">Wins</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-red-600">
                    {gameHistory.filter(g => !g.won).length}
                  </div>
                  <div className="text-gray-500">Losses</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}