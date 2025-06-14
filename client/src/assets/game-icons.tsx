import React from 'react';

export const WinGoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="url(#wingoGradient)"/>
    <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="wingoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2196f3"/>
        <stop offset="100%" stopColor="#1976d2"/>
      </linearGradient>
    </defs>
  </svg>
);

export const K3LotreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="6" height="6" rx="1" fill="url(#k3Gradient1)"/>
    <rect x="14" y="4" width="6" height="6" rx="1" fill="url(#k3Gradient2)"/>
    <rect x="9" y="14" width="6" height="6" rx="1" fill="url(#k3Gradient3)"/>
    <circle cx="7" cy="7" r="1" fill="white"/>
    <circle cx="17" cy="7" r="1" fill="white"/>
    <circle cx="12" cy="17" r="1" fill="white"/>
    <defs>
      <linearGradient id="k3Gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e91e63"/>
        <stop offset="100%" stopColor="#c2185b"/>
      </linearGradient>
      <linearGradient id="k3Gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4caf50"/>
        <stop offset="100%" stopColor="#388e3c"/>
      </linearGradient>
      <linearGradient id="k3Gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9c27b0"/>
        <stop offset="100%" stopColor="#7b1fa2"/>
      </linearGradient>
    </defs>
  </svg>
);

export const AviatorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l8 6-8 2-8-2 8-6z" fill="url(#aviatorGradient)"/>
    <path d="M4 8l8 2v10l-8-2V8z" fill="url(#aviatorGradient2)"/>
    <path d="M20 8l-8 2v10l8-2V8z" fill="url(#aviatorGradient3)"/>
    <defs>
      <linearGradient id="aviatorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff9500"/>
        <stop offset="100%" stopColor="#ff5722"/>
      </linearGradient>
      <linearGradient id="aviatorGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff7043"/>
        <stop offset="100%" stopColor="#d84315"/>
      </linearGradient>
      <linearGradient id="aviatorGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff8a65"/>
        <stop offset="100%" stopColor="#e64a19"/>
      </linearGradient>
    </defs>
  </svg>
);

export const MinesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="2" fill="url(#minesGradient)"/>
    <rect x="4" y="4" width="4" height="4" rx="1" fill="#388e3c" opacity="0.8"/>
    <rect x="10" y="4" width="4" height="4" rx="1" fill="#388e3c" opacity="0.8"/>
    <rect x="16" y="4" width="4" height="4" rx="1" fill="#388e3c" opacity="0.8"/>
    <rect x="4" y="10" width="4" height="4" rx="1" fill="#d32f2f" opacity="0.8"/>
    <rect x="10" y="10" width="4" height="4" rx="1" fill="#388e3c" opacity="0.8"/>
    <rect x="16" y="10" width="4" height="4" rx="1" fill="#388e3c" opacity="0.8"/>
    <rect x="4" y="16" width="4" height="4" rx="1" fill="#388e3c" opacity="0.8"/>
    <rect x="10" y="16" width="4" height="4" rx="1" fill="#388e3c" opacity="0.8"/>
    <rect x="16" y="16" width="4" height="4" rx="1" fill="#d32f2f" opacity="0.8"/>
    <defs>
      <linearGradient id="minesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00bcd4"/>
        <stop offset="100%" stopColor="#0097a7"/>
      </linearGradient>
    </defs>
  </svg>
);

export const DiceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#diceGradient)"/>
    <circle cx="8" cy="8" r="1.5" fill="white"/>
    <circle cx="16" cy="8" r="1.5" fill="white"/>
    <circle cx="8" cy="16" r="1.5" fill="white"/>
    <circle cx="16" cy="16" r="1.5" fill="white"/>
    <circle cx="12" cy="12" r="1.5" fill="white"/>
    <defs>
      <linearGradient id="diceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4caf50"/>
        <stop offset="100%" stopColor="#388e3c"/>
      </linearGradient>
    </defs>
  </svg>
);

export const DragonTigerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S2 17.5 2 12z" fill="url(#dragonGradient)"/>
    <path d="M8 10c0-2 1-3 2-3s2 1 2 3-1 3-2 3-2-1-2-3z" fill="#ff6b35"/>
    <path d="M14 10c0-2 1-3 2-3s2 1 2 3-1 3-2 3-2-1-2-3z" fill="#ff1493"/>
    <path d="M9 15c1 1 2 1 3 0 1 1 2 1 3 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <defs>
      <linearGradient id="dragonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9c27b0"/>
        <stop offset="100%" stopColor="#7b1fa2"/>
      </linearGradient>
    </defs>
  </svg>
);

export const SlotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#slotGradient)"/>
    <rect x="5" y="6" width="3" height="12" rx="1" fill="white" opacity="0.9"/>
    <rect x="10.5" y="6" width="3" height="12" rx="1" fill="white" opacity="0.9"/>
    <rect x="16" y="6" width="3" height="12" rx="1" fill="white" opacity="0.9"/>
    <circle cx="6.5" cy="10" r="1" fill="#ff4444"/>
    <circle cx="12" cy="12" r="1" fill="#ffb800"/>
    <circle cx="17.5" cy="14" r="1" fill="#4caf50"/>
    <defs>
      <linearGradient id="slotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2196f3"/>
        <stop offset="100%" stopColor="#3f51b5"/>
      </linearGradient>
    </defs>
  </svg>
);

export const RummyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="8" height="12" rx="2" fill="url(#rummyGradient1)" transform="rotate(-5 7 10)"/>
    <rect x="8" y="4" width="8" height="12" rx="2" fill="url(#rummyGradient2)" transform="rotate(5 12 10)"/>
    <rect x="13" y="4" width="8" height="12" rx="2" fill="url(#rummyGradient3)" transform="rotate(10 17 10)"/>
    <text x="7" y="12" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">A</text>
    <text x="12" y="12" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">K</text>
    <text x="17" y="12" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">Q</text>
    <defs>
      <linearGradient id="rummyGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff4444"/>
        <stop offset="100%" stopColor="#e91e63"/>
      </linearGradient>
      <linearGradient id="rummyGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2196f3"/>
        <stop offset="100%" stopColor="#1976d2"/>
      </linearGradient>
      <linearGradient id="rummyGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4caf50"/>
        <stop offset="100%" stopColor="#388e3c"/>
      </linearGradient>
    </defs>
  </svg>
);