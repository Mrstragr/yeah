import React from 'react';

export const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-container">
      <div className="loading-logo">
        <div className="logo-circle">
          <div className="loading-spinner"></div>
        </div>
        <h2 className="loading-title">91DREAMCLUB</h2>
      </div>
      <div className="loading-text">Loading amazing games...</div>
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  </div>
);

export const GameLoadingOverlay = ({ isVisible }: { isVisible: boolean }) => (
  <div className={`game-loading-overlay ${isVisible ? 'visible' : ''}`}>
    <div className="game-loading-content">
      <div className="game-loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="game-loading-text">Starting Game...</p>
    </div>
  </div>
);

export const PulseLoader = () => (
  <div className="pulse-loader">
    <div className="pulse-dot"></div>
    <div className="pulse-dot"></div>
    <div className="pulse-dot"></div>
  </div>
);