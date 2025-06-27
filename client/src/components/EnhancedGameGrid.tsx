import { useState } from 'react';
import { gameThumbnails } from '../assets/game-thumbnails';
import { MaintenanceDialog } from './MaintenanceDialog';

interface Game {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  isHot?: boolean;
  isNew?: boolean;
  jackpot?: string;
  players?: number;
  isPriority?: boolean;
}

interface EnhancedGameGridProps {
  onGameSelect: (gameId: string) => void;
  selectedCategory: string;
}

export const EnhancedGameGrid = ({ onGameSelect, selectedCategory }: EnhancedGameGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [maintenanceDialog, setMaintenanceDialog] = useState<{isOpen: boolean, gameName: string}>({
    isOpen: false,
    gameName: ''
  });

  // Priority games that are fully functional
  const priorityGames = ['aviator', 'mines', 'dragon-tiger', 'wingo'];
  
  const allGames: Game[] = [
    {
      id: 'aviator',
      title: 'Aviator',
      category: 'crash',
      thumbnail: gameThumbnails.aviator,
      isHot: true,
      jackpot: '₹2,45,678',
      players: 1247,
      isPriority: true
    },
    {
      id: 'mines',
      title: 'Mines',
      category: 'casino',
      thumbnail: gameThumbnails.mines,
      isHot: true,
      players: 892,
      isPriority: true
    },
    {
      id: 'dragon-tiger',
      title: 'Dragon Tiger',
      category: 'casino',
      thumbnail: gameThumbnails.dragonTiger,
      players: 567,
      isPriority: true
    },
    {
      id: 'wingo',
      title: 'Win Go 1Min',
      category: 'lottery',
      thumbnail: gameThumbnails.wingo,
      isNew: true,
      players: 2156,
      isPriority: true
    },
    {
      id: 'k3',
      title: 'K3 Lotre',
      category: 'lottery',
      thumbnail: gameThumbnails.wingo,
      players: 434
    },
    {
      id: 'teen-patti',
      title: 'Teen Patti',
      category: 'casino',
      thumbnail: gameThumbnails.teenPatti,
      players: 789
    },
    {
      id: 'limbo',
      title: 'Limbo',
      category: 'crash',
      thumbnail: gameThumbnails.limbo,
      players: 345
    },
    {
      id: 'plinko',
      title: 'Plinko',
      category: 'casino',
      thumbnail: gameThumbnails.plinko,
      isNew: true,
      players: 623
    },
    {
      id: 'dice',
      title: 'Dice',
      category: 'casino',
      thumbnail: gameThumbnails.limbo, // Use limbo as placeholder
      players: 456
    },
    {
      id: 'cricket',
      title: 'Cricket',
      category: 'sports',
      thumbnail: gameThumbnails.plinko, // Use plinko as placeholder
      isHot: true,
      players: 1890
    },
    {
      id: 'roulette',
      title: 'Roulette',
      category: 'casino',
      thumbnail: gameThumbnails.dragonTiger, // Use dragon tiger as placeholder
      players: 234
    },
    {
      id: '5d',
      title: '5D Lotre',
      category: 'lottery',
      thumbnail: gameThumbnails.wingo,
      players: 567
    },
  ];

  const categories = [
    { id: 'lobby', name: 'Lobby', icon: '🏠' },
    { id: 'popular', name: 'Popular', icon: '🔥' },
    { id: 'crash', name: 'Crash', icon: '✈️' },
    { id: 'casino', name: 'Casino', icon: '🎰' },
    { id: 'lottery', name: 'Lottery', icon: '🎫' },
    { id: 'sports', name: 'Sports', icon: '🏏' },
  ];

  const filteredGames = allGames.filter(game => {
    const matchesCategory = selectedCategory === 'lobby' || 
                           selectedCategory === 'popular' && (game.isHot || game.isNew) ||
                           game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPlayerCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="enhanced-game-grid">
      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Hot Games Carousel */}
      {selectedCategory === 'lobby' && (
        <div className="hot-games-section">
          <h3 className="section-title">🔥 Hot Games</h3>
          <div className="hot-games-carousel">
            {allGames.filter(game => game.isHot).map(game => (
              <div
                key={game.id}
                className="hot-game-card"
                onClick={() => onGameSelect(game.id)}
              >
                <div className="hot-game-thumbnail">
                  <img src={game.thumbnail} alt={game.title} />
                  <div className="hot-badge">HOT</div>
                  {game.jackpot && (
                    <div className="jackpot-badge">
                      💰 {game.jackpot}
                    </div>
                  )}
                </div>
                <div className="hot-game-info">
                  <h4>{game.title}</h4>
                  <p>{formatPlayerCount(game.players!)} playing</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Games Grid */}
      <div className="games-section">
        <h3 className="section-title">
          {categories.find(cat => cat.id === selectedCategory)?.icon} {' '}
          {categories.find(cat => cat.id === selectedCategory)?.name || 'All Games'}
        </h3>
        
        <div className="games-grid">
          {filteredGames.map(game => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => onGameSelect(game.id)}
            >
              <div className="game-thumbnail">
                <img src={game.thumbnail} alt={game.title} />
                
                {/* Badges */}
                <div className="game-badges">
                  {game.isHot && <span className="badge hot-badge">HOT</span>}
                  {game.isNew && <span className="badge new-badge">NEW</span>}
                </div>

                {/* Player Count */}
                <div className="player-count">
                  <span className="player-icon">👥</span>
                  <span>{formatPlayerCount(game.players!)}</span>
                </div>

                {/* Play Button Overlay */}
                <div className="play-overlay">
                  <button className="play-button">
                    <span className="play-icon">▶</span>
                    PLAY
                  </button>
                </div>
              </div>

              <div className="game-info">
                <h4 className="game-title">{game.title}</h4>
                {game.jackpot && (
                  <p className="game-jackpot">💰 {game.jackpot}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .enhanced-game-grid {
          padding: 20px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          min-height: 100vh;
          color: white;
        }

        .search-section {
          margin-bottom: 30px;
        }

        .search-bar {
          position: relative;
          max-width: 400px;
          margin: 0 auto;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          opacity: 0.7;
        }

        .search-input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 25px;
          color: white;
          font-size: 16px;
          backdrop-filter: blur(10px);
        }

        .search-input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .hot-games-section {
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #fbbf24;
        }

        .hot-games-carousel {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 10px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.3) transparent;
        }

        .hot-games-carousel::-webkit-scrollbar {
          height: 6px;
        }

        .hot-games-carousel::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }

        .hot-games-carousel::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 3px;
        }

        .hot-game-card {
          min-width: 200px;
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .hot-game-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .hot-game-thumbnail {
          position: relative;
          height: 120px;
          overflow: hidden;
        }

        .hot-game-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hot-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: linear-gradient(45deg, #dc2626, #ef4444);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          animation: pulse 2s infinite;
        }

        .jackpot-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0,0,0,0.8);
          color: #fbbf24;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: bold;
        }

        .hot-game-info {
          padding: 15px;
          text-align: center;
        }

        .hot-game-info h4 {
          margin: 0 0 5px 0;
          font-size: 14px;
          font-weight: bold;
        }

        .hot-game-info p {
          margin: 0;
          font-size: 12px;
          opacity: 0.8;
          color: #10b981;
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 20px;
        }

        .game-card {
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(5px);
        }

        .game-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.4);
          border-color: rgba(255,255,255,0.3);
        }

        .game-thumbnail {
          position: relative;
          aspect-ratio: 3/2;
          overflow: hidden;
        }

        .game-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .game-card:hover .game-thumbnail img {
          transform: scale(1.1);
        }

        .game-badges {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 5px;
        }

        .badge {
          padding: 3px 6px;
          border-radius: 8px;
          font-size: 9px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .hot-badge {
          background: linear-gradient(45deg, #dc2626, #ef4444);
          color: white;
          animation: pulse 2s infinite;
        }

        .new-badge {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
        }

        .player-count {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .player-icon {
          font-size: 8px;
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .game-card:hover .play-overlay {
          opacity: 1;
        }

        .play-button {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .play-button:hover {
          background: linear-gradient(45deg, #059669, #047857);
          transform: scale(1.05);
        }

        .play-icon {
          font-size: 10px;
        }

        .game-info {
          padding: 12px;
        }

        .game-title {
          margin: 0 0 5px 0;
          font-size: 13px;
          font-weight: 600;
          color: white;
        }

        .game-jackpot {
          margin: 0;
          font-size: 11px;
          color: #fbbf24;
          font-weight: 500;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @media (max-width: 768px) {
          .enhanced-game-grid {
            padding: 15px;
          }

          .games-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 15px;
          }

          .hot-games-carousel {
            gap: 15px;
          }

          .hot-game-card {
            min-width: 180px;
          }

          .section-title {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};