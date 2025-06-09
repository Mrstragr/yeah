import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Trophy, 
  Clock, 
  Star, 
  Users, 
  DollarSign,
  Timer,
  Zap,
  Target,
  CheckCircle
} from "lucide-react";

interface LotteryGame {
  id: number;
  name: string;
  type: "fast" | "daily" | "weekly" | "mega";
  drawTime: string;
  nextDraw: Date;
  jackpot: string;
  ticketPrice: string;
  maxNumbers: number;
  drawRange: number;
  participants: number;
  status: "open" | "drawing" | "closed";
  winningNumbers?: number[];
  lastDraw?: Date;
}

const lotteryGames: LotteryGame[] = [
  {
    id: 1,
    name: "Fast Win 5",
    type: "fast",
    drawTime: "Every 5 minutes",
    nextDraw: new Date(Date.now() + 3 * 60 * 1000),
    jackpot: "₹2,50,000",
    ticketPrice: "₹20",
    maxNumbers: 5,
    drawRange: 36,
    participants: 1247,
    status: "open",
    winningNumbers: [7, 14, 21, 28, 35],
    lastDraw: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    id: 2,
    name: "Daily Jackpot",
    type: "daily",
    drawTime: "Daily at 9:00 PM",
    nextDraw: new Date(Date.now() + 6 * 60 * 60 * 1000),
    jackpot: "₹15,75,000",
    ticketPrice: "₹50",
    maxNumbers: 6,
    drawRange: 49,
    participants: 8932,
    status: "open",
    winningNumbers: [3, 17, 22, 31, 44, 49],
    lastDraw: new Date(Date.now() - 20 * 60 * 60 * 1000)
  },
  {
    id: 3,
    name: "Lucky 7 Draw",
    type: "fast",
    drawTime: "Every 10 minutes",
    nextDraw: new Date(Date.now() + 1 * 60 * 1000),
    jackpot: "₹5,00,000",
    ticketPrice: "₹30",
    maxNumbers: 7,
    drawRange: 42,
    participants: 2156,
    status: "drawing",
    winningNumbers: [5, 12, 19, 26, 33, 40, 41],
    lastDraw: new Date(Date.now() - 9 * 60 * 1000)
  },
  {
    id: 4,
    name: "Mega Millions",
    type: "weekly",
    drawTime: "Sunday at 8:00 PM",
    nextDraw: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    jackpot: "₹5,25,00,000",
    ticketPrice: "₹100",
    maxNumbers: 6,
    drawRange: 59,
    participants: 45632,
    status: "open"
  }
];

interface TicketSelection {
  gameId: number;
  numbers: number[];
  quantity: number;
}

export function LotteryGames() {
  const [selectedGame, setSelectedGame] = useState<LotteryGame | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [tickets, setTickets] = useState<TicketSelection[]>([]);
  const [quickPick, setQuickPick] = useState(false);

  const formatTimeToNext = (nextDraw: Date) => {
    const now = new Date();
    const diff = nextDraw.getTime() - now.getTime();
    
    if (diff <= 0) return "Drawing now...";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const generateQuickPick = (game: LotteryGame) => {
    const numbers = [];
    while (numbers.length < game.maxNumbers) {
      const num = Math.floor(Math.random() * game.drawRange) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers.sort((a, b) => a - b);
  };

  const selectNumber = (number: number) => {
    if (!selectedGame) return;
    
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    } else if (selectedNumbers.length < selectedGame.maxNumbers) {
      setSelectedNumbers(prev => [...prev, number].sort((a, b) => a - b));
    }
  };

  const addTicket = () => {
    if (!selectedGame || selectedNumbers.length !== selectedGame.maxNumbers) return;
    
    const newTicket: TicketSelection = {
      gameId: selectedGame.id,
      numbers: [...selectedNumbers],
      quantity: 1
    };
    
    setTickets(prev => [...prev, newTicket]);
    setSelectedNumbers([]);
  };

  const handleQuickPick = () => {
    if (!selectedGame) return;
    const numbers = generateQuickPick(selectedGame);
    setSelectedNumbers(numbers);
    setQuickPick(true);
  };

  const getTotalCost = () => {
    return tickets.reduce((total, ticket) => {
      const game = lotteryGames.find(g => g.id === ticket.gameId);
      return total + (game ? parseInt(game.ticketPrice.replace('₹', '').replace(',', '')) * ticket.quantity : 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-casino font-bold text-casino-gold">
            🎰 Lottery Games
          </h2>
          <p className="text-sm text-casino-text-muted">
            Win big with our exciting lottery draws
          </p>
        </div>
        <Badge className="bg-casino-purple text-white">
          {lotteryGames.filter(g => g.status === "open").length} Games Open
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Games List */}
        <div className="lg:col-span-2 space-y-4">
          {lotteryGames.map((game) => (
            <Card 
              key={game.id} 
              className={`game-card cursor-pointer ${selectedGame?.id === game.id ? 'ring-2 ring-casino-gold' : ''}`}
              onClick={() => setSelectedGame(game)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        game.type === 'fast' ? 'border-casino-red text-casino-red' :
                        game.type === 'daily' ? 'border-casino-blue text-casino-blue' :
                        game.type === 'weekly' ? 'border-casino-green text-casino-green' :
                        'border-casino-purple text-casino-purple'
                      }`}
                    >
                      {game.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-casino-text-muted">
                      {game.drawTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {game.status === "drawing" && (
                      <Badge className="bg-casino-orange text-white text-xs animate-pulse">
                        🎲 DRAWING
                      </Badge>
                    )}
                    <div className="flex items-center text-xs text-casino-text-muted">
                      <Users className="w-3 h-3 mr-1" />
                      {game.participants.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-casino font-bold text-white text-lg mb-1">
                    {game.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-casino-text-muted">Jackpot</div>
                      <div className="text-xl font-casino font-bold text-casino-gold">
                        {game.jackpot}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-casino-text-muted">Next Draw</div>
                      <div className="text-lg font-casino font-bold text-casino-blue">
                        {formatTimeToNext(game.nextDraw)}
                      </div>
                    </div>
                  </div>
                </div>

                {game.winningNumbers && (
                  <div className="mb-4">
                    <div className="text-xs text-casino-text-muted mb-2">Last Winning Numbers:</div>
                    <div className="flex flex-wrap gap-2">
                      {game.winningNumbers.map((num, index) => (
                        <div 
                          key={index}
                          className="w-8 h-8 bg-casino-gold text-casino-primary rounded-full flex items-center justify-center text-sm font-bold"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-casino-text-muted">Ticket: </span>
                    <span className="text-casino-green font-semibold">{game.ticketPrice}</span>
                    <span className="text-casino-text-muted"> • Pick {game.maxNumbers} from {game.drawRange}</span>
                  </div>
                  <Button 
                    size="sm"
                    className="btn-casino-secondary"
                    disabled={game.status !== "open"}
                  >
                    {game.status === "open" ? "Play Now" : "Closed"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Number Selection & Ticket Cart */}
        <div className="lg:col-span-1">
          {selectedGame ? (
            <Card className="casino-card sticky top-4">
              <CardContent className="p-4">
                <h3 className="font-casino font-bold text-casino-gold mb-4 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  {selectedGame.name}
                </h3>

                <div className="space-y-4">
                  {/* Quick Pick Button */}
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleQuickPick}
                      className="flex-1 border-casino-border hover:bg-casino-gold hover:text-casino-primary"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Quick Pick
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedNumbers([])}
                      className="border-casino-border hover:bg-casino-red hover:text-white"
                    >
                      Clear
                    </Button>
                  </div>

                  {/* Selected Numbers */}
                  <div>
                    <div className="text-sm text-casino-text-muted mb-2">
                      Selected: {selectedNumbers.length}/{selectedGame.maxNumbers}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedNumbers.map((num, index) => (
                        <div 
                          key={index}
                          className="w-8 h-8 bg-casino-gold text-casino-primary rounded-full flex items-center justify-center text-sm font-bold cursor-pointer"
                          onClick={() => selectNumber(num)}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Number Grid */}
                  <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                    {Array.from({ length: selectedGame.drawRange }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => selectNumber(num)}
                        className={`w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                          selectedNumbers.includes(num)
                            ? 'bg-casino-gold text-casino-primary'
                            : 'bg-casino-accent text-white hover:bg-casino-border'
                        }`}
                        disabled={!selectedNumbers.includes(num) && selectedNumbers.length >= selectedGame.maxNumbers}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  {/* Add Ticket Button */}
                  <Button 
                    className="btn-casino-primary w-full"
                    onClick={addTicket}
                    disabled={selectedNumbers.length !== selectedGame.maxNumbers}
                  >
                    Add Ticket ({selectedGame.ticketPrice})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="casino-card">
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-casino-text-muted opacity-50" />
                <p className="text-casino-text-muted">Select a lottery game to start playing</p>
              </CardContent>
            </Card>
          )}

          {/* Ticket Cart */}
          {tickets.length > 0 && (
            <Card className="casino-card mt-4">
              <CardContent className="p-4">
                <h3 className="font-casino font-bold text-casino-gold mb-4">
                  Your Tickets ({tickets.length})
                </h3>
                
                <div className="space-y-3 mb-4">
                  {tickets.map((ticket, index) => {
                    const game = lotteryGames.find(g => g.id === ticket.gameId);
                    return (
                      <div key={index} className="bg-casino-accent/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-white">
                            {game?.name}
                          </div>
                          <div className="text-sm text-casino-green">
                            {game?.ticketPrice}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {ticket.numbers.map((num, i) => (
                            <div key={i} className="w-6 h-6 bg-casino-gold text-casino-primary rounded text-xs flex items-center justify-center font-bold">
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-casino-border pt-4">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-casino-text-muted">Total Cost:</span>
                    <span className="text-casino-gold font-semibold">
                      ₹{getTotalCost().toLocaleString()}
                    </span>
                  </div>
                  <Button className="btn-casino-primary w-full">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Buy Tickets
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}