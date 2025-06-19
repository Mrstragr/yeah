import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PromotionPage } from './PromotionPage';
import { WalletPage } from './WalletPage';
import { AccountPage } from './AccountPage';
import { AviatorGame } from './AviatorGame';
import { ActivityPage } from './ActivityPage';
import { MinesGame } from './MinesGame';
import { DragonTigerGame } from './DragonTigerGame';
import { TeenPattiGame } from './TeenPattiGame';
import { SpaceDiceGame } from './SpaceDiceGame';

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
}

export const Perfect91Club = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('main');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState(8807);

  // WinGo Game States
  const [betAmount, setBetAmount] = useState(10);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentPeriod, setCurrentPeriod] = useState('20250619125');
  const [recentResults, setRecentResults] = useState([8, 3, 7, 1, 9]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [betHistory, setBetHistory] = useState<any[]>([]);
  const [showPromotion, setShowPromotion] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  // Auto login demo user
  useEffect(() => {
    setUser({
      id: 1,
      username: 'demo_user',
      email: 'demo@91club.com',
      phone: '9876543210'
    });
  }, []);

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 0) {
          const newPeriodNum = parseInt(currentPeriod.slice(-3)) + 1;
          setCurrentPeriod(`20250619${String(newPeriodNum).padStart(3, '0')}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPeriod]);

  const placeBet = async () => {
    if (!selectedColor && selectedNumber === null && !selectedSize) return;
    if (timeLeft < 5) return;

    setIsPlaying(true);
    try {
      const response = await fetch('/api/games/wingo/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo_token_1750315135559'
        },
        body: JSON.stringify({
          betAmount,
          betType: selectedColor ? 'color' : selectedSize ? 'size' : 'number',
          betValue: selectedColor || selectedSize || selectedNumber
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setWalletBalance(prev => data.isWin ? prev + data.winAmount : prev - betAmount);
        setRecentResults(prev => [data.result.number, ...prev.slice(0, 4)]);
        
        setTimeout(() => {
          setResult(null);
          setSelectedColor(null);
          setSelectedNumber(null);
          setSelectedSize(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Bet error:', error);
    }
    setIsPlaying(false);
  };

  const refreshBalance = () => {
    setWalletBalance(prev => prev + Math.random() * 100);
  };

  if (selectedGame === 'aviator') {
    return <AviatorGame onClose={() => setSelectedGame(null)} refreshBalance={refreshBalance} />;
  }

  if (selectedGame === 'mines') {
    return <MinesGame onClose={() => setSelectedGame(null)} refreshBalance={refreshBalance} />;
  }

  if (selectedGame === 'dragon-tiger') {
    return <DragonTigerGame onClose={() => setSelectedGame(null)} refreshBalance={refreshBalance} />;
  }

  if (selectedGame === 'teen-patti') {
    return <TeenPattiGame onClose={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'space-dice') {
    return <SpaceDiceGame onClose={() => setSelectedGame(null)} />;
  }

  if (selectedGame === 'wingo' || selectedGame === 'k3' || selectedGame === '5d' || selectedGame === 'trx') {
    return (
      <div className="wingo-game">
        {/* Header */}
        <div className="game-header">
          <div className="header-left">
            <button onClick={() => setSelectedGame(null)} className="back-btn">←</button>
            <div>
              <h2>
                {selectedGame === 'wingo' && 'Win Go'}
                {selectedGame === 'k3' && 'K3 Lottery'}
                {selectedGame === '5d' && '5D Lottery'}
                {selectedGame === 'trx' && 'TRX WinGo'}
              </h2>
              <span className="game-timing">
                {selectedGame === 'wingo' && '1 Min'}
                {selectedGame === 'k3' && '3 Min'}
                {selectedGame === '5d' && '5 Min'}
                {selectedGame === 'trx' && '1 Min'}
              </span>
            </div>
          </div>
          <div className="header-right">
            <div className="balance">₹{walletBalance.toFixed(2)}</div>
          </div>
        </div>

        {/* Period & Timer */}
        <div className="period-section">
          <div className="period-info">
            <span>Period</span>
            <span className="period-number">{currentPeriod}</span>
          </div>
          <div className="timer-section">
            <span>Count Down</span>
            <div className={`timer ${timeLeft <= 5 ? 'warning' : ''}`}>
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Recent Results */}
        <div className="results-bar">
          <span>Recent</span>
          <div className="results-list">
            {recentResults.map((num, idx) => (
              <div key={idx} className={`result-ball ${
                num === 0 || num === 5 ? 'violet-red' : 
                num % 2 === 0 ? 'red' : 'green'
              }`}>
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Betting Interface */}
        <div className="betting-section">
          {/* Colors */}
          <div className="color-betting">
            <button 
              className={`color-btn green ${selectedColor === 'green' ? 'selected' : ''}`}
              onClick={() => setSelectedColor('green')}
            >
              <span>Green</span>
              <span>1:2</span>
            </button>
            <button 
              className={`color-btn violet ${selectedColor === 'violet' ? 'selected' : ''}`}
              onClick={() => setSelectedColor('violet')}
            >
              <span>Violet</span>
              <span>1:4.5</span>
            </button>
            <button 
              className={`color-btn red ${selectedColor === 'red' ? 'selected' : ''}`}
              onClick={() => setSelectedColor('red')}
            >
              <span>Red</span>
              <span>1:2</span>
            </button>
          </div>

          {/* Numbers */}
          <div className="number-grid">
            {[0,1,2,3,4,5,6,7,8,9].map(num => (
              <button
                key={num}
                className={`number-btn ${selectedNumber === num ? 'selected' : ''} ${
                  num === 0 || num === 5 ? 'violet-red' : 
                  num % 2 === 0 ? 'red' : 'green'
                }`}
                onClick={() => setSelectedNumber(num)}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Sizes */}
          <div className="size-betting">
            <button 
              className={`size-btn ${selectedSize === 'big' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('big')}
            >
              <span>Big</span>
              <span>5,6,7,8,9</span>
            </button>
            <button 
              className={`size-btn ${selectedSize === 'small' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('small')}
            >
              <span>Small</span>
              <span>0,1,2,3,4</span>
            </button>
          </div>

          {/* Amount Selection */}
          <div className="amount-section">
            <div className="amount-buttons">
              {[10, 100, 1000, 10000].map(amount => (
                <button 
                  key={amount}
                  className={`amount-btn ${betAmount === amount ? 'selected' : ''}`}
                  onClick={() => setBetAmount(amount)}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm Button */}
          <button 
            className={`confirm-btn ${timeLeft <= 5 ? 'disabled' : ''}`}
            onClick={placeBet}
            disabled={isPlaying || timeLeft <= 5 || (!selectedColor && selectedNumber === null && !selectedSize)}
          >
            {timeLeft <= 5 ? 'Betting Closed' : isPlaying ? 'Playing...' : `Confirm ₹${betAmount}`}
          </button>
        </div>

        {/* Result Modal */}
        {result && (
          <div className="result-overlay">
            <div className={`result-modal ${result.isWin ? 'win' : 'lose'}`}>
              <div className="result-header">
                <h3>{result.isWin ? 'Congratulations!' : 'Sorry!'}</h3>
              </div>
              <div className="result-content">
                <div className="result-number-display">
                  <div className={`big-result-ball ${
                    result.result.number === 0 || result.result.number === 5 ? 'violet-red' : 
                    result.result.number % 2 === 0 ? 'red' : 'green'
                  }`}>
                    {result.result.number}
                  </div>
                </div>
                <div className="result-details">
                  <p>Period: {currentPeriod}</p>
                  <p>Your bet: {selectedColor || selectedSize || selectedNumber}</p>
                  <p className={result.isWin ? 'win-amount' : 'lose-amount'}>
                    {result.isWin ? `Won: ₹${result.winAmount}` : `Lost: ₹${betAmount}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .wingo-game {
            background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
            color: white;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          }

          .game-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .back-btn {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
          }

          .header-left h2 {
            margin: 0;
            font-size: 20px;
          }

          .game-timing {
            color: #FFD700;
            font-size: 12px;
          }

          .balance {
            background: linear-gradient(45deg, #FFD700, #FFA500);
            padding: 8px 16px;
            border-radius: 20px;
            color: #333;
            font-weight: bold;
          }

          .period-section {
            display: flex;
            justify-content: space-between;
            padding: 20px;
            background: rgba(255,255,255,0.05);
            margin: 10px 20px;
            border-radius: 12px;
          }

          .period-info, .timer-section {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .period-number, .timer {
            font-size: 18px;
            font-weight: bold;
            color: #FFD700;
            margin-top: 5px;
          }

          .timer.warning {
            color: #ff4444;
            animation: pulse 1s infinite;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          .results-bar {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 20px;
          }

          .results-list {
            display: flex;
            gap: 8px;
          }

          .result-ball, .big-result-ball {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 14px;
          }

          .big-result-ball {
            width: 80px;
            height: 80px;
            font-size: 32px;
            margin: 20px auto;
          }

          .result-ball.green, .big-result-ball.green { background: #4CAF50; }
          .result-ball.red, .big-result-ball.red { background: #f44336; }
          .result-ball.violet-red, .big-result-ball.violet-red { 
            background: linear-gradient(45deg, #9C27B0 50%, #f44336 50%);
          }

          .betting-section {
            padding: 20px;
          }

          .color-betting {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }

          .color-btn {
            padding: 20px;
            border: 2px solid transparent;
            border-radius: 12px;
            color: white;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-weight: bold;
            transition: all 0.3s;
          }

          .color-btn.green { background: #4CAF50; }
          .color-btn.red { background: #f44336; }
          .color-btn.violet { background: #9C27B0; }

          .color-btn.selected {
            border-color: #FFD700;
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(255,215,0,0.5);
          }

          .number-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
            margin: 20px 0;
          }

          .number-btn {
            aspect-ratio: 1;
            border: 2px solid transparent;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s;
          }

          .number-btn.green { background: #4CAF50; }
          .number-btn.red { background: #f44336; }
          .number-btn.violet-red { 
            background: linear-gradient(45deg, #9C27B0 50%, #f44336 50%);
          }

          .number-btn.selected {
            border-color: #FFD700;
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(255,215,0,0.5);
          }

          .size-betting {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin: 20px 0;
          }

          .size-btn {
            padding: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            color: white;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: all 0.3s;
          }

          .size-btn.selected {
            border-color: #FFD700;
            background: rgba(255,215,0,0.2);
            transform: scale(1.02);
          }

          .amount-buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin: 20px 0;
          }

          .amount-btn {
            padding: 12px;
            border: 1px solid rgba(255,255,255,0.3);
            background: rgba(255,255,255,0.1);
            color: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
          }

          .amount-btn.selected {
            background: #FFD700;
            color: #333;
            border-color: #FFD700;
          }

          .confirm-btn {
            width: 100%;
            padding: 18px;
            background: linear-gradient(45deg, #4CAF50, #45a049);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
          }

          .confirm-btn:hover {
            background: linear-gradient(45deg, #45a049, #4CAF50);
            transform: translateY(-2px);
          }

          .confirm-btn.disabled {
            background: #666;
            cursor: not-allowed;
            transform: none;
          }

          .result-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
          }

          .result-modal {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 350px;
            width: 90%;
            text-align: center;
            animation: slideUp 0.5s ease;
          }

          @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          .result-modal.win {
            border: 3px solid #4CAF50;
            color: #4CAF50;
          }

          .result-modal.lose {
            border: 3px solid #f44336;
            color: #f44336;
          }

          .result-header h3 {
            margin: 0 0 20px 0;
            font-size: 24px;
          }

          .result-details p {
            margin: 10px 0;
            color: #333;
          }

          .win-amount {
            color: #4CAF50 !important;
            font-weight: bold;
            font-size: 18px;
          }

          .lose-amount {
            color: #f44336 !important;
            font-weight: bold;
            font-size: 18px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="perfect-91club">
      {/* Header */}
      <div className="main-header">
        <div className="header-content">
          <div className="top-bar">
            <div className="logo">
              <div className="logo-circle">100x</div>
              <span className="logo-text">WIN</span>
            </div>
            <div className="notification-icon">🔔</div>
          </div>

          {/* Bonus Banner */}
          <div className="bonus-banner">
            <div className="banner-content">
              <div className="banner-text">
                <div className="bonus-title">SPECIAL ATTENDANCE BONUS</div>
                <div className="bonus-subtitle">PROVIDED BY 100xWIN</div>
                <div className="bonus-amount">up to 558RS</div>
              </div>
              <button className="claim-button">CLAIM IT RIGHT AWAY</button>
            </div>
          </div>

          {/* Wallet */}
          <div className="wallet-section">
            <div className="wallet-header">
              <span>💰 Wallet balance</span>
              <span>↻</span>
            </div>
            <div className="wallet-content">
              <div className="balance-amount">₹{walletBalance.toFixed(2)}</div>
              <div className="wallet-actions">
                <button className="withdraw-btn">Withdraw</button>
                <button className="deposit-btn">Deposit</button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <div className="action-card wheel">
              <span className="action-icon">🎡</span>
              <div className="action-text">
                <div>Wheel</div>
                <div>of fortune</div>
              </div>
            </div>
            <div className="action-card vip">
              <span className="action-icon">👑</span>
              <div className="action-text">
                <div>VIP</div>
                <div>privileges</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button className={`nav-tab ${activeTab === 'lobby' ? 'active' : ''}`} onClick={() => setActiveTab('lobby')}>
          <span>🏠</span> Lobby
        </button>
        <button className={`nav-tab ${activeTab === 'mini' ? 'active' : ''}`} onClick={() => setActiveTab('mini')}>
          <span>🎮</span> Mini game
        </button>
        <button className={`nav-tab ${activeTab === 'slots' ? 'active' : ''}`} onClick={() => setActiveTab('slots')}>
          <span>🎰</span> Slots
        </button>
        <button className={`nav-tab ${activeTab === 'card' ? 'active' : ''}`} onClick={() => setActiveTab('card')}>
          <span>🃏</span> Card
        </button>
        <button className={`nav-tab ${activeTab === 'fishing' ? 'active' : ''}`} onClick={() => setActiveTab('fishing')}>
          <span>🎣</span> Fishing
        </button>
      </div>

        {/* Main Content */}
        <div className="main-content">
          {activeTab === 'lobby' && (
            <div className="lottery-section">
              <div className="section-header">
                <div className="section-icon">8</div>
                <span>Lottery</span>
              </div>
              <div className="section-description">
                The games are independently developed by our team, fun, fair, and safe
              </div>
              
              <div className="games-grid">
                <div className="game-card wingo" onClick={() => setSelectedGame('wingo')}>
                  <div className="game-decoration">
                    <div className="sparkle">✨</div>
                    <div className="sparkle">⭐</div>
                  </div>
                  <div className="game-number">7</div>
                  <div className="game-name">WIN GO</div>
                  <div className="game-period">1 Min</div>
                </div>
                
                <div className="game-card k3" onClick={() => setSelectedGame('k3')}>
                  <div className="game-decoration">
                    <div className="dice">🎲</div>
                  </div>
                  <div className="game-name">K3</div>
                  <div className="game-period">3 Min</div>
                </div>
                
                <div className="game-card fived" onClick={() => setSelectedGame('5d')}>
                  <div className="game-decoration">
                    <div className="numbers">01234</div>
                  </div>
                  <div className="game-name">5D</div>
                  <div className="game-period">5 Min</div>
                </div>
                
                <div className="game-card trx" onClick={() => setSelectedGame('trx')}>
                  <div className="game-decoration">
                    <div className="crypto">₿</div>
                  </div>
                  <div className="game-name">TRX WINGO</div>
                  <div className="game-period">1 Min</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mini' && (
            <div className="mini-games-section">
              <div className="games-grid">
                <div className="game-card space-dice" onClick={() => setSelectedGame('space-dice')}>
                  <div className="game-bg purple">
                    <div className="game-icon">🎲</div>
                  </div>
                  <div className="game-name">SPACE DICE</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card goal-wave">
                  <div className="game-bg blue">
                    <div className="game-icon">⚽</div>
                  </div>
                  <div className="game-name">GOAL WAVE</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card mini-roulette">
                  <div className="game-bg orange">
                    <div className="game-icon">🎯</div>
                  </div>
                  <div className="game-name">MINI ROULETTE</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card dice">
                  <div className="game-bg pink">
                    <div className="game-icon">🎲</div>
                  </div>
                  <div className="game-name">DICE</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card plinko">
                  <div className="game-bg purple">
                    <div className="game-icon">🔴</div>
                  </div>
                  <div className="game-name">PLINKO</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card hilo">
                  <div className="game-bg purple">
                    <div className="game-icon">📊</div>
                  </div>
                  <div className="game-name">HILO</div>
                  <div className="game-period">BT GAME</div>
                </div>
              </div>
              
              <div className="section-header">
                <div className="section-icon">⭐</div>
                <span>Recommended Games</span>
                <div className="nav-arrows">
                  <span>‹</span>
                  <span>›</span>
                </div>
              </div>
              
              <div className="games-grid">
                <div className="game-card dice-game">
                  <div className="game-bg coral">
                    <div className="game-icon">🎲</div>
                  </div>
                  <div className="game-name">DICE</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card plinko-game">
                  <div className="game-bg purple-gradient">
                    <div className="game-icon">🔴</div>
                    <div className="game-multiplier">20X</div>
                  </div>
                  <div className="game-name">PLINKO</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card hilo-game">
                  <div className="game-bg purple-blue">
                    <div className="game-icon">📊</div>
                  </div>
                  <div className="game-name">HILO</div>
                  <div className="game-period">BT GAME</div>
                </div>
              </div>
              
              <div className="games-grid full-grid">
                <div className="game-card king-pauper">
                  <div className="game-bg wine">
                    <div className="game-icon">👑</div>
                  </div>
                  <div className="game-name">KING AND PAUPER</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card hilo-wave">
                  <div className="game-bg olive">
                    <div className="game-icon">🌊</div>
                  </div>
                  <div className="game-name">HILO WAVE</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card clash-hands">
                  <div className="game-bg dark-blue">
                    <div className="game-icon">🤝</div>
                  </div>
                  <div className="game-name">CLASH OF HANDS</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card bomb-wave">
                  <div className="game-bg orange-red">
                    <div className="game-icon">💣</div>
                  </div>
                  <div className="game-name">BOMB WAVE</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card treasure-wave">
                  <div className="game-bg purple-dark">
                    <div className="game-icon">🏴‍☠️</div>
                  </div>
                  <div className="game-name">TREASURE WAVE</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card hotline">
                  <div className="game-bg salmon">
                    <div className="game-icon">🔥</div>
                  </div>
                  <div className="game-name">HOTLINE</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card cryptos">
                  <div className="game-bg blue-gradient">
                    <div className="game-icon">₿</div>
                  </div>
                  <div className="game-name">CRYPTOS</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card horse-racing">
                  <div className="game-bg cyan">
                    <div className="game-icon">🐎</div>
                  </div>
                  <div className="game-name">HORSE RACING</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card keno80">
                  <div className="game-bg purple-pink">
                    <div className="game-icon">80</div>
                  </div>
                  <div className="game-name">KENO 80</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card keno">
                  <div className="game-bg red-orange">
                    <div className="game-icon">🎱</div>
                  </div>
                  <div className="game-name">KENO</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card pharaoh">
                  <div className="game-bg purple-royal">
                    <div className="game-icon">👑</div>
                  </div>
                  <div className="game-name">PHARAOH</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card triple">
                  <div className="game-bg cyan-blue">
                    <div className="game-icon">🎯</div>
                  </div>
                  <div className="game-name">TRIPLE</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card draw-poker">
                  <div className="game-bg peach">
                    <div className="game-icon">🃏</div>
                  </div>
                  <div className="game-name">DRAW POKER</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card aviator" onClick={() => setSelectedGame('aviator')}>
                  <div className="game-bg purple-violet">
                    <div className="game-icon">✈️</div>
                    <div className="game-multiplier">12X</div>
                    <div className="game-multiplier-small">9X</div>
                  </div>
                  <div className="game-name">AVIATOR</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card javelin">
                  <div className="game-bg yellow-gold">
                    <div className="game-icon">🏹</div>
                  </div>
                  <div className="game-name">JAVELIN</div>
                  <div className="game-period">TB GAME</div>
                </div>
                
                <div className="game-card coin-wave">
                  <div className="game-bg orange-yellow">
                    <div className="game-icon">💰</div>
                  </div>
                  <div className="game-name">COIN WAVE</div>
                  <div className="game-period">TB GAME</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'slots' && (
            <div className="slots-section">
              <div className="slots-header">
                <div className="slots-icon">🎰</div>
                <span className="slots-title">Slots</span>
                <div className="slots-nav">
                  <span className="nav-link">Detail</span>
                  <span className="nav-arrow left">‹</span>
                  <span className="nav-arrow right">›</span>
                </div>
              </div>
              
              <div className="slots-games-grid">
                <div className="slot-game-card pharaoh-slot">
                  <div className="slot-image">
                    <div className="slot-character">👑</div>
                  </div>
                </div>
                
                <div className="slot-game-card ocean-slot">
                  <div className="slot-image">
                    <div className="slot-character">🌊</div>
                  </div>
                </div>
                
                <div className="slot-game-card mystical-slot">
                  <div className="slot-image">
                    <div className="slot-character">🧙‍♀️</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="card-games-section">
              <div className="section-header">
                <div className="section-icon">🃏</div>
                <span>Card Games</span>
              </div>
              <div className="section-description">
                Classic card games with modern twists and big wins
              </div>
              
              <div className="games-grid">
                <div className="game-card dragon-tiger" onClick={() => setSelectedGame('dragon-tiger')}>
                  <div className="game-decoration">
                    <div className="dragon">🐉</div>
                  </div>
                  <div className="game-name">DRAGON TIGER</div>
                  <div className="game-period">Live</div>
                </div>
                
                <div className="game-card baccarat">
                  <div className="game-decoration">
                    <div className="cards">🎴</div>
                  </div>
                  <div className="game-name">BACCARAT</div>
                  <div className="game-period">Classic</div>
                </div>
                
                <div className="game-card teen-patti" onClick={() => setSelectedGame('teen-patti')}>
                  <div className="game-decoration">
                    <div className="spade">♠️</div>
                  </div>
                  <div className="game-name">TEEN PATTI</div>
                  <div className="game-period">Indian</div>
                </div>
                
                <div className="game-card blackjack">
                  <div className="game-decoration">
                    <div className="ace">🅰️</div>
                  </div>
                  <div className="game-name">BLACKJACK</div>
                  <div className="game-period">21</div>
                </div>
                
                <div className="game-card draw-poker">
                  <div className="game-decoration">
                    <div className="poker">🃏</div>
                  </div>
                  <div className="game-name">DRAW POKER</div>
                  <div className="game-period">TB Game</div>
                </div>
                
                <div className="game-card pharaoh">
                  <div className="game-decoration">
                    <div className="pharaoh">👑</div>
                  </div>
                  <div className="game-name">PHARAOH</div>
                  <div className="game-period">TB Game</div>
                </div>
                
                <div className="game-card triple">
                  <div className="game-decoration">
                    <div className="triple">🎯</div>
                  </div>
                  <div className="game-name">TRIPLE</div>
                  <div className="game-period">TB Game</div>
                </div>
                
                <div className="game-card coin-flip">
                  <div className="game-decoration">
                    <div className="coin">🪙</div>
                  </div>
                  <div className="game-name">COIN FLIP</div>
                  <div className="game-period">TB Game</div>
                </div>
                
                <div className="game-card coin-wave">
                  <div className="game-decoration">
                    <div className="coin-wave">💰</div>
                  </div>
                  <div className="game-name">COIN WAVE</div>
                  <div className="game-period">TB Game</div>
                </div>
                
                <div className="game-card javelin">
                  <div className="game-decoration">
                    <div className="javelin">🏹</div>
                  </div>
                  <div className="game-name">JAVELIN</div>
                  <div className="game-period">TB Game</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fishing' && (
            <div className="fishing-section">
              <div className="section-header">
                <div className="section-icon">🎣</div>
                <span>Fishing Games</span>
              </div>
              <div className="section-description">
                Catch fish and win amazing prizes in our underwater adventures
              </div>
              
              <div className="games-grid">
                <div className="game-card fishing1">
                  <div className="game-decoration">
                    <div className="fish">🐠</div>
                  </div>
                  <div className="game-name">OCEAN KING</div>
                  <div className="game-period">Multiplayer</div>
                </div>
                
                <div className="game-card fishing2">
                  <div className="game-decoration">
                    <div className="shark">🦈</div>
                  </div>
                  <div className="game-name">SHARK HUNTER</div>
                  <div className="game-period">Action</div>
                </div>
                
                <div className="game-card fishing3">
                  <div className="game-decoration">
                    <div className="whale">🐋</div>
                  </div>
                  <div className="game-name">WHALE CATCHER</div>
                  <div className="game-period">Big Fish</div>
                </div>
                
                <div className="game-card fishing4">
                  <div className="game-decoration">
                    <div className="treasure">💰</div>
                  </div>
                  <div className="game-name">TREASURE HUNT</div>
                  <div className="game-period">Adventure</div>
                </div>
                
                <div className="game-card fishing5">
                  <div className="game-decoration">
                    <div className="deep-sea">🐙</div>
                  </div>
                  <div className="game-name">DEEP SEA FISHING</div>
                  <div className="game-period">Deep Sea</div>
                </div>
                
                <div className="game-card fishing6">
                  <div className="game-decoration">
                    <div className="golden-fish">🐟</div>
                  </div>
                  <div className="game-name">GOLDEN CATCH</div>
                  <div className="game-period">Premium</div>
                </div>
                
                <div className="game-card fishing7">
                  <div className="game-decoration">
                    <div className="sea-dragon">🐲</div>
                  </div>
                  <div className="game-name">SEA DRAGON</div>
                  <div className="game-period">Legendary</div>
                </div>
                
                <div className="game-card fishing8">
                  <div className="game-decoration">
                    <div className="coral-reef">🪸</div>
                  </div>
                  <div className="game-name">CORAL REEF</div>
                  <div className="game-period">Tropical</div>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Bottom Navigation */}
      <div className="bottom-navigation">
        <div className="nav-item" onClick={() => setShowPromotion(true)}>
          <span>🎁</span>
          <span>Promotion</span>
        </div>
        <div className="nav-item" onClick={() => setShowActivity(true)}>
          <span>📊</span>
          <span>Activity</span>
        </div>
        <div className="nav-item active" onClick={() => setActiveTab('main')}>
          <span>🎮</span>
          <span>Main</span>
        </div>
        <div className="nav-item" onClick={() => setShowWallet(true)}>
          <span>💰</span>
          <span>Wallet</span>
        </div>
        <div className="nav-item" onClick={() => setShowAccount(true)}>
          <span>👤</span>
          <span>Account</span>
        </div>
      </div>

      {/* Promotion Modal */}
      {showPromotion && (
        <PromotionPage onClose={() => setShowPromotion(false)} />
      )}

      {/* Wallet Modal */}
      {showWallet && (
        <WalletPage balance={walletBalance} onClose={() => setShowWallet(false)} />
      )}

      {/* Account Modal */}
      {showAccount && (
        <AccountPage user={user} balance={walletBalance} onClose={() => setShowAccount(false)} />
      )}

      {/* Activity Modal */}
      {showActivity && (
        <ActivityPage onClose={() => setShowActivity(false)} />
      )}

      <style jsx>{`
        .perfect-91club {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8f9fa;
          min-height: 100vh;
          padding-bottom: 80px;
        }

        .main-header {
          background: linear-gradient(180deg, #ff6b6b 0%, #ff8e8e 100%);
          color: white;
          padding: 12px 16px 16px;
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-circle {
          background: white;
          color: #ff6b6b;
          width: 40px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
        }

        .logo-text {
          font-weight: bold;
          font-size: 18px;
        }

        .notification-icon {
          font-size: 20px;
        }

        .bonus-banner {
          background: linear-gradient(135deg, #8B4513 0%, #CD853F 100%);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }

        .banner-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bonus-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 2px;
        }

        .bonus-subtitle {
          font-size: 11px;
          opacity: 0.9;
          margin-bottom: 4px;
        }

        .bonus-amount {
          font-size: 20px;
          font-weight: bold;
          color: #FFD700;
        }

        .claim-button {
          background: #FF4444;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
        }

        .wallet-section {
          margin-bottom: 16px;
        }

        .wallet-header {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .wallet-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .balance-amount {
          font-size: 24px;
          font-weight: bold;
        }

        .wallet-actions {
          display: flex;
          gap: 8px;
        }

        .withdraw-btn, .deposit-btn {
          padding: 10px 16px;
          border: none;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
        }

        .withdraw-btn {
          background: #FFA726;
          color: white;
        }

        .deposit-btn {
          background: #EF5350;
          color: white;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .action-card {
          padding: 12px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: white;
        }

        .wheel {
          background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
        }

        .vip {
          background: linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%);
        }

        .action-icon {
          font-size: 24px;
        }

        .action-text {
          font-size: 12px;
          font-weight: bold;
          line-height: 1.2;
        }

        .nav-tabs {
          background: white;
          display: flex;
          padding: 0 16px;
          overflow-x: auto;
          border-bottom: 1px solid #e0e0e0;
        }

        .nav-tab {
          background: none;
          border: none;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 70px;
          cursor: pointer;
          color: #666;
          font-size: 11px;
          border-bottom: 2px solid transparent;
          transition: all 0.3s;
        }

        .nav-tab.active {
          color: #ff6b6b;
          border-bottom-color: #ff6b6b;
        }

        .main-content {
          background: white;
          padding: 20px 16px;
        }

        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .section-icon {
          background: #ff6b6b;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          font-size: 14px;
          font-weight: bold;
        }

        .section-description {
          color: #666;
          font-size: 12px;
          margin-bottom: 20px;
          line-height: 1.4;
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .game-card {
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          color: white;
          cursor: pointer;
          min-height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .game-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        }

        .wingo {
          background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
        }

        .k3 {
          background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
        }

        .fived {
          background: linear-gradient(135deg, #27AE60 0%, #229954 100%);
        }

        .trx {
          background: linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%);
        }

        /* Mini Games */
        .aviator {
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
        }

        .mines {
          background: linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%);
        }

        .limbo {
          background: linear-gradient(135deg, #FD79A8 0%, #E84393 100%);
        }

        .dice {
          background: linear-gradient(135deg, #00B894 0%, #00CEC9 100%);
        }

        /* Slot Games */
        .slot1 {
          background: linear-gradient(135deg, #FF7675 0%, #E17055 100%);
        }

        .slot2 {
          background: linear-gradient(135deg, #74B9FF 0%, #0984E3 100%);
        }

        .slot3 {
          background: linear-gradient(135deg, #FDCB6E 0%, #E17055 100%);
        }

        .slot4 {
          background: linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%);
        }

        /* Card Games */
        .dragon-tiger {
          background: linear-gradient(135deg, #E17055 0%, #D63031 100%);
        }

        .baccarat {
          background: linear-gradient(135deg, #00B894 0%, #00A085 100%);
        }

        .teen-patti {
          background: linear-gradient(135deg, #FDCB6E 0%, #F39C12 100%);
        }

        .blackjack {
          background: linear-gradient(135deg, #2D3436 0%, #636E72 100%);
        }

        /* Fishing Games */
        .fishing1 {
          background: linear-gradient(135deg, #00CEC9 0%, #0984E3 100%);
        }

        .fishing2 {
          background: linear-gradient(135deg, #A29BFE 0%, #74B9FF 100%);
        }

        .fishing3 {
          background: linear-gradient(135deg, #FD79A8 0%, #FDCB6E 100%);
        }

        .fishing4 {
          background: linear-gradient(135deg, #FDCB6E 0%, #E17055 100%);
        }

        .game-decoration {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          gap: 4px;
        }

        .sparkle {
          font-size: 12px;
          animation: sparkle 2s infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .dice, .crypto, .plane, .mine, .rocket, .dice-icon, 
        .cherry, .diamond, .star, .coin, .dragon, .cards, 
        .spade, .ace, .fish, .shark, .whale, .treasure {
          font-size: 16px;
          opacity: 0.8;
        }

        .numbers {
          font-size: 10px;
          opacity: 0.7;
          font-weight: bold;
        }

        .game-number {
          background: rgba(255,255,255,0.2);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .game-name {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 4px;
        }

        .game-period {
          font-size: 11px;
          opacity: 0.8;
          background: rgba(255,255,255,0.2);
          padding: 2px 8px;
          border-radius: 10px;
        }

        .bottom-navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          display: flex;
          padding: 8px 0;
          border-top: 1px solid #e0e0e0;
          z-index: 100;
        }

        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 4px;
          color: #666;
          font-size: 11px;
          cursor: pointer;
          transition: color 0.3s;
        }

        .nav-item.active {
          color: #ff6b6b;
        }

        .nav-item span:first-child {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};