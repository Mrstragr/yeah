import { useEffect, useState } from 'react';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'Loading games...' },
      { progress: 40, text: 'Connecting to servers...' },
      { progress: 60, text: 'Securing connection...' },
      { progress: 80, text: 'Preparing your experience...' },
      { progress: 100, text: 'Ready to play!' },
    ];

    let currentStep = 0;
    
    const timer = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress);
        setLoadingText(loadingSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(timer);
      }
    }, 400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-container">
        {/* Animated Logo */}
        <div className="logo-section">
          <div className="logo-wrapper">
            <div className="logo-ring outer"></div>
            <div className="logo-ring middle"></div>
            <div className="logo-ring inner"></div>
            <div className="logo-center">
              <span className="logo-icon">🎮</span>
            </div>
          </div>
          
          <h1 className="brand-title">Perfect91Club</h1>
          <p className="brand-subtitle">Premium Gaming Experience</p>
        </div>

        {/* Loading Progress */}
        <div className="progress-section">
          <div className="progress-bar-container">
            <div 
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
            <div className="progress-glow"></div>
          </div>
          
          <div className="progress-text">
            <span className="loading-percentage">{progress}%</span>
            <span className="loading-description">{loadingText}</span>
          </div>
        </div>

        {/* Feature Icons */}
        <div className="features-showcase">
          <div className="feature-item">
            <div className="feature-icon">🏆</div>
            <span>Premium Games</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💰</div>
            <span>Real Money</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <span>Secure</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <span>Instant Play</span>
          </div>
        </div>
      </div>

      <style>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, 
            #0f172a 0%, 
            #1e293b 25%, 
            #0f172a 50%, 
            #1e293b 75%, 
            #0f172a 100%);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .loading-container {
          text-align: center;
          color: white;
          max-width: 400px;
          width: 90%;
        }

        .logo-section {
          margin-bottom: 60px;
        }

        .logo-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 30px auto;
        }

        .logo-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid transparent;
        }

        .logo-ring.outer {
          width: 120px;
          height: 120px;
          border-color: rgba(16, 185, 129, 0.3);
          animation: rotateClockwise 4s linear infinite;
        }

        .logo-ring.middle {
          width: 90px;
          height: 90px;
          top: 15px;
          left: 15px;
          border-color: rgba(59, 130, 246, 0.5);
          animation: rotateCounterClockwise 3s linear infinite;
        }

        .logo-ring.inner {
          width: 60px;
          height: 60px;
          top: 30px;
          left: 30px;
          border-color: rgba(251, 191, 36, 0.7);
          animation: rotateClockwise 2s linear infinite;
        }

        .logo-center {
          position: absolute;
          top: 35px;
          left: 35px;
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, #10b981, #3b82f6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
          animation: pulse 2s ease-in-out infinite;
        }

        .logo-icon {
          font-size: 24px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes rotateClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes rotateCounterClockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.8);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        .brand-title {
          font-size: 32px;
          font-weight: bold;
          margin: 0 0 10px 0;
          background: linear-gradient(45deg, #10b981, #3b82f6, #fbbf24);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 200%;
          animation: textShine 3s ease-in-out infinite;
        }

        @keyframes textShine {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .brand-subtitle {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
          letter-spacing: 1px;
        }

        .progress-section {
          margin-bottom: 50px;
        }

        .progress-bar-container {
          position: relative;
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #3b82f6, #fbbf24);
          background-size: 200% 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
          animation: shimmer 2s ease-in-out infinite;
          position: relative;
        }

        .progress-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent);
          border-radius: 6px;
          opacity: 0;
          animation: progressGlow 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes progressGlow {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .progress-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .loading-percentage {
          font-size: 18px;
          font-weight: bold;
          color: #10b981;
        }

        .loading-description {
          font-size: 14px;
          opacity: 0.8;
          animation: fadeInOut 2s ease-in-out infinite;
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .features-showcase {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: featureSlideIn 0.6s ease-out forwards;
        }

        .feature-item:nth-child(1) { animation-delay: 0.2s; }
        .feature-item:nth-child(2) { animation-delay: 0.4s; }
        .feature-item:nth-child(3) { animation-delay: 0.6s; }
        .feature-item:nth-child(4) { animation-delay: 0.8s; }

        @keyframes featureSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: iconFloat 3s ease-in-out infinite;
        }

        .feature-icon:nth-child(odd) {
          animation-delay: 0.5s;
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        .feature-item span {
          font-size: 12px;
          font-weight: 500;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .loading-container {
            width: 95%;
          }

          .brand-title {
            font-size: 28px;
          }

          .features-showcase {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }

          .logo-wrapper {
            width: 100px;
            height: 100px;
          }

          .logo-ring.outer {
            width: 100px;
            height: 100px;
          }

          .logo-ring.middle {
            width: 75px;
            height: 75px;
            top: 12.5px;
            left: 12.5px;
          }

          .logo-ring.inner {
            width: 50px;
            height: 50px;
            top: 25px;
            left: 25px;
          }

          .logo-center {
            top: 30px;
            left: 30px;
            width: 40px;
            height: 40px;
          }

          .logo-icon {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};