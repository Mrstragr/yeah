import { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, TrendingUp, Gift, Star } from 'lucide-react';
import { ImprovedWinGoGame } from './ImprovedWinGoGame';
import { ImprovedAviatorGame } from './ImprovedAviatorGame';
import { ImprovedMinesGame } from './ImprovedMinesGame';
import { ImprovedDragonTigerGame } from './ImprovedDragonTigerGame';
import { ImprovedDiceGame } from './ImprovedDiceGame';
import { Cricket } from './Cricket';
import { Limbo } from './Limbo';
import { Goal } from './Goal';
import { WheelOfFortune } from './WheelOfFortune';
import { Plinko } from './Plinko';
import { MiniRoulette } from './MiniRoulette';

interface EnhancedGameInterfaceProps {
  gameType: string;
  onClose: () => void;
  refreshBalance: () => void;
}

export const EnhancedGameInterface = ({ gameType, onClose, refreshBalance }: EnhancedGameInterfaceProps) => {
  const renderGame = () => {
    switch (gameType) {
      case 'wingo':
      case 'trx':
      case '5d':
        return <ImprovedWinGoGame onClose={onClose} refreshBalance={refreshBalance} gameType={gameType} />;
      case 'aviator':
        return <ImprovedAviatorGame onClose={onClose} refreshBalance={refreshBalance} />;
      case 'mines':
        return <ImprovedMinesGame onClose={onClose} refreshBalance={refreshBalance} />;
      case 'dragon-tiger':
        return <ImprovedDragonTigerGame onClose={onClose} refreshBalance={refreshBalance} />;
      case 'dice':
        return <ImprovedDiceGame onClose={onClose} refreshBalance={refreshBalance} />;
      case 'cricket':
        return <Cricket onClose={onClose} refreshBalance={refreshBalance} />;
      case 'limbo':
        return <Limbo onClose={onClose} refreshBalance={refreshBalance} />;
      case 'goal':
        return <Goal onClose={onClose} refreshBalance={refreshBalance} />;
      case 'k3':
        return <ImprovedWinGoGame onClose={onClose} refreshBalance={refreshBalance} gameType="k3" />;
      case 'wheel':
        return <WheelOfFortune onClose={onClose} refreshBalance={refreshBalance} />;
      case 'plinko':
        return <Plinko onClose={onClose} refreshBalance={refreshBalance} />;
      case 'roulette':
        return <MiniRoulette onClose={onClose} refreshBalance={refreshBalance} />;
      default:
        return (
          <div className="game-placeholder">
            <div className="placeholder-content">
              <h2>{gameType.toUpperCase()}</h2>
              <p>Coming Soon!</p>
              <button onClick={onClose} className="close-btn">Close</button>
            </div>
            <style jsx>{`
              .game-placeholder {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 400px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                color: white;
              }
              .placeholder-content {
                text-align: center;
                padding: 40px;
              }
              .close-btn {
                padding: 10px 20px;
                background: white;
                color: #333;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
              }
            `}</style>
          </div>
        );
    }
  };

  return (
    <div className="enhanced-game-modal">
      <div className="game-overlay" onClick={onClose}></div>
      <div className="game-content">
        {renderGame()}
      </div>
      <style jsx>{`
        .enhanced-game-modal {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .game-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
        }
        .game-content {
          position: relative;
          z-index: 1001;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};