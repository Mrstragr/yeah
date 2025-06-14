import React, { useEffect, useState } from 'react';

export const ParticleEffect = ({ isActive }: { isActive: boolean }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export const WinAnimation = ({ isVisible, amount }: { isVisible: boolean; amount?: number }) => (
  <div className={`win-animation ${isVisible ? 'visible' : ''}`}>
    <div className="win-content">
      <div className="win-burst">
        <div className="burst-ring"></div>
        <div className="burst-ring"></div>
        <div className="burst-ring"></div>
      </div>
      <div className="win-text">🎉 YOU WIN! 🎉</div>
      {amount && <div className="win-amount">+₹{amount.toFixed(2)}</div>}
      <div className="win-sparkles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="sparkle" style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>
    </div>
  </div>
);

export const CoinAnimation = ({ isVisible }: { isVisible: boolean }) => (
  <div className={`coin-animation ${isVisible ? 'visible' : ''}`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="floating-coin" style={{ '--delay': `${i * 0.2}s` } as React.CSSProperties}>
        💰
      </div>
    ))}
  </div>
);

export const RippleEffect = ({ x, y, isActive }: { x: number; y: number; isActive: boolean }) => (
  <div 
    className={`ripple-effect ${isActive ? 'active' : ''}`}
    style={{ left: x, top: y }}
  >
    <div className="ripple-circle"></div>
  </div>
);

export const CountdownTimer = ({ seconds, onComplete }: { seconds: number; onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [timeLeft, onComplete]);

  return (
    <div className="countdown-timer">
      <div className="countdown-circle">
        <svg className="countdown-svg" viewBox="0 0 100 100">
          <circle
            className="countdown-track"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
          />
          <circle
            className="countdown-progress"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#ff4444"
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              strokeDasharray: `${2 * Math.PI * 45}`,
              strokeDashoffset: `${2 * Math.PI * 45 * (1 - timeLeft / seconds)}`,
            }}
          />
        </svg>
        <div className="countdown-number">{timeLeft}</div>
      </div>
    </div>
  );
};