import { useState } from 'react';

interface PromotionPageProps {
  onClose: () => void;
}

export const PromotionPage = ({ onClose }: PromotionPageProps) => {
  const [activePromo, setActivePromo] = useState('daily');

  const promotions = {
    daily: [
      {
        id: 1,
        title: 'Daily Check-in Bonus',
        description: 'Login daily to get increasing rewards',
        reward: '₹10 - ₹558',
        claimed: false,
        image: '🎁'
      },
      {
        id: 2,
        title: 'First Deposit Bonus',
        description: '100% bonus on your first deposit',
        reward: 'Up to ₹10,000',
        claimed: false,
        image: '💰'
      },
      {
        id: 3,
        title: 'Weekend Special',
        description: 'Extra rewards on weekends',
        reward: '50% Bonus',
        claimed: true,
        image: '🎉'
      }
    ],
    vip: [
      {
        id: 4,
        title: 'VIP Level 1',
        description: 'Unlock exclusive benefits',
        reward: '2% Cashback',
        claimed: false,
        image: '👑'
      },
      {
        id: 5,
        title: 'VIP Level 2',
        description: 'Higher limits and better rewards',
        reward: '5% Cashback',
        claimed: false,
        image: '💎'
      }
    ],
    referral: [
      {
        id: 6,
        title: 'Refer Friends',
        description: 'Earn when your friends join and play',
        reward: '₹100 per friend',
        claimed: false,
        image: '👥'
      },
      {
        id: 7,
        title: 'Team Building',
        description: 'Build your team and earn together',
        reward: 'Up to 15% Commission',
        claimed: false,
        image: '🏆'
      }
    ]
  };

  return (
    <div className="promotion-page">
      <div className="promo-header">
        <button onClick={onClose} className="back-btn">←</button>
        <h2>Promotions</h2>
        <div></div>
      </div>

      <div className="promo-banner">
        <div className="banner-content">
          <h3>🎊 MEGA BONUS EVENT 🎊</h3>
          <p>Join now and get up to ₹50,000 in bonuses!</p>
          <button className="join-btn">Join Now</button>
        </div>
      </div>

      <div className="promo-tabs">
        <button 
          className={`promo-tab ${activePromo === 'daily' ? 'active' : ''}`}
          onClick={() => setActivePromo('daily')}
        >
          Daily Bonus
        </button>
        <button 
          className={`promo-tab ${activePromo === 'vip' ? 'active' : ''}`}
          onClick={() => setActivePromo('vip')}
        >
          VIP Club
        </button>
        <button 
          className={`promo-tab ${activePromo === 'referral' ? 'active' : ''}`}
          onClick={() => setActivePromo('referral')}
        >
          Referral
        </button>
      </div>

      <div className="promo-content">
        {promotions[activePromo as keyof typeof promotions].map(promo => (
          <div key={promo.id} className="promo-card">
            <div className="promo-icon">{promo.image}</div>
            <div className="promo-info">
              <h4>{promo.title}</h4>
              <p>{promo.description}</p>
              <div className="promo-reward">{promo.reward}</div>
            </div>
            <button 
              className={`claim-btn ${promo.claimed ? 'claimed' : ''}`}
              disabled={promo.claimed}
            >
              {promo.claimed ? 'Claimed' : 'Claim'}
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .promotion-page {
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          color: white;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .promo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(255,255,255,0.05);
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .promo-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .promo-banner {
          background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
          margin: 20px;
          border-radius: 15px;
          padding: 25px;
          text-align: center;
        }

        .banner-content h3 {
          margin: 0 0 10px 0;
          font-size: 18px;
        }

        .banner-content p {
          margin: 0 0 15px 0;
          opacity: 0.9;
        }

        .join-btn {
          background: white;
          color: #FF6B6B;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
        }

        .promo-tabs {
          display: flex;
          padding: 0 20px;
          margin-bottom: 20px;
        }

        .promo-tab {
          flex: 1;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          padding: 12px;
          border-radius: 8px;
          margin: 0 5px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .promo-tab.active {
          background: #FF6B6B;
        }

        .promo-content {
          padding: 0 20px;
        }

        .promo-card {
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .promo-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
        }

        .promo-info {
          flex: 1;
        }

        .promo-info h4 {
          margin: 0 0 5px 0;
          font-size: 16px;
        }

        .promo-info p {
          margin: 0 0 8px 0;
          font-size: 13px;
          opacity: 0.8;
        }

        .promo-reward {
          color: #FFD700;
          font-weight: bold;
        }

        .claim-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
        }

        .claim-btn.claimed {
          background: #666;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};