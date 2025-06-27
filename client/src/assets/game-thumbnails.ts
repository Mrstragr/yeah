// Professional game thumbnail SVGs for authentic gaming experience
export const gameThumbnails = {
  aviator: `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="aviatorBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="planePath" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="120" height="80" fill="url(#aviatorBg)" rx="8"/>
      <path d="M10 60 Q30 20 50 40 Q70 25 90 35 Q105 30 110 25" stroke="url(#planePath)" stroke-width="3" fill="none"/>
      <circle cx="105" cy="28" r="3" fill="#fbbf24"/>
      <text x="60" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">AVIATOR</text>
      <text x="85" y="20" text-anchor="middle" fill="#10b981" font-family="Arial" font-size="8" font-weight="bold">1.85x</text>
    </svg>
  `)}`,

  mines: `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="minesBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7c2d12;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="120" height="80" fill="url(#minesBg)" rx="8"/>
      <g transform="translate(20, 15)">
        ${Array.from({length: 25}, (_, i) => {
          const x = (i % 5) * 16;
          const y = Math.floor(i / 5) * 12;
          const isMine = [3, 7, 12, 18, 22].includes(i);
          const isRevealed = [0, 1, 5, 6, 10, 14, 19].includes(i);
          return `<rect x="${x}" y="${y}" width="12" height="10" fill="${
            isMine ? '#dc2626' : isRevealed ? '#10b981' : '#374151'
          }" stroke="#6b7280" stroke-width="0.5" rx="1"/>
          ${isMine ? `<circle cx="${x+6}" cy="${y+5}" r="2" fill="#fbbf24"/>` : ''}
          ${isRevealed && !isMine ? `<circle cx="${x+6}" cy="${y+5}" r="1.5" fill="#10b981"/>` : ''}`;
        }).join('')}
      </g>
      <text x="60" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">MINES</text>
    </svg>
  `)}`,

  dragonTiger: `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dragonBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7c2d12;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="120" height="80" fill="url(#dragonBg)" rx="8"/>
      <rect x="15" y="20" width="25" height="35" fill="#dc2626" rx="4" stroke="#fbbf24" stroke-width="2"/>
      <rect x="80" y="20" width="25" height="35" fill="#ea580c" rx="4" stroke="#fbbf24" stroke-width="2"/>
      <text x="27" y="40" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">🐉</text>
      <text x="92" y="40" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">🐅</text>
      <text x="60" y="40" text-anchor="middle" fill="#fbbf24" font-family="Arial" font-size="16" font-weight="bold">VS</text>
      <text x="60" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="bold">DRAGON TIGER</text>
    </svg>
  `)}`,

  wingo: `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wingoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="120" height="80" fill="url(#wingoBg)" rx="8"/>
      <circle cx="60" cy="35" r="20" fill="#ffffff" stroke="#fbbf24" stroke-width="3"/>
      <g transform="translate(60, 35)">
        ${Array.from({length: 10}, (_, i) => {
          const angle = (i * 36) * Math.PI / 180;
          const x1 = Math.cos(angle) * 12;
          const y1 = Math.sin(angle) * 12;
          const x2 = Math.cos(angle) * 17;
          const y2 = Math.sin(angle) * 17;
          const color = i % 2 === 0 ? '#dc2626' : '#059669';
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2"/>
                  <text x="${x2*1.3}" y="${y2*1.3}" text-anchor="middle" fill="white" font-size="6" font-weight="bold">${i}</text>`;
        }).join('')}
      </g>
      <circle cx="60" cy="35" r="3" fill="#fbbf24"/>
      <text x="60" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">WIN GO</text>
    </svg>
  `)}`,

  teenPatti: `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="teenPattiBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7c2d12;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#991b1b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="120" height="80" fill="url(#teenPattiBg)" rx="8"/>
      <rect x="20" y="15" width="20" height="30" fill="#ffffff" rx="3" stroke="#fbbf24" stroke-width="1"/>
      <rect x="50" y="10" width="20" height="30" fill="#ffffff" rx="3" stroke="#fbbf24" stroke-width="1"/>
      <rect x="80" y="15" width="20" height="30" fill="#ffffff" rx="3" stroke="#fbbf24" stroke-width="1"/>
      <text x="30" y="35" text-anchor="middle" fill="#dc2626" font-family="Arial" font-size="16" font-weight="bold">A</text>
      <text x="60" y="30" text-anchor="middle" fill="#000000" font-family="Arial" font-size="16" font-weight="bold">K</text>
      <text x="90" y="35" text-anchor="middle" fill="#dc2626" font-family="Arial" font-size="16" font-weight="bold">Q</text>
      <text x="60" y="65" text-anchor="middle" fill="white" font-family="Arial" font-size="9" font-weight="bold">TEEN PATTI</text>
    </svg>
  `)}`,

  limbo: `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="limboBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#581c87;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="120" height="80" fill="url(#limboBg)" rx="8"/>
      <path d="M20 60 Q40 30 60 45 Q80 25 100 40" stroke="#10b981" stroke-width="4" fill="none"/>
      <circle cx="60" cy="45" r="8" fill="#fbbf24"/>
      <text x="60" y="50" text-anchor="middle" fill="#581c87" font-family="Arial" font-size="10" font-weight="bold">∞</text>
      <text x="85" y="25" text-anchor="middle" fill="#10b981" font-family="Arial" font-size="8" font-weight="bold">2.5x</text>
      <text x="60" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">LIMBO</text>
    </svg>
  `)}`,

  plinko: `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="plinkoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="120" height="80" fill="url(#plinkoBg)" rx="8"/>
      <g transform="translate(20, 10)">
        ${Array.from({length: 6}, (_, row) => 
          Array.from({length: row + 3}, (_, col) => {
            const x = (80 / (row + 2)) * col + 5;
            const y = row * 8 + 5;
            return `<circle cx="${x}" cy="${y}" r="2" fill="#6b7280"/>`;
          }).join('')
        ).join('')}
        <circle cx="40" cy="5" r="3" fill="#fbbf24"/>
        ${Array.from({length: 7}, (_, i) => {
          const x = (80 / 6) * i;
          const multiplier = [0.2, 0.5, 1, 2, 5, 10, 1000][i];
          const color = multiplier >= 10 ? '#dc2626' : multiplier >= 2 ? '#ea580c' : '#10b981';
          return `<rect x="${x}" y="55" width="10" height="8" fill="${color}" rx="1"/>
                  <text x="${x+5}" y="61" text-anchor="middle" fill="white" font-size="4">${multiplier}x</text>`;
        }).join('')}
      </g>
      <text x="60" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">PLINKO</text>
    </svg>
  `)}`,

  dice: `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="diceBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1f2937;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#374151;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="120" height="80" fill="url(#diceBg)" rx="8"/>
      <rect x="35" y="20" width="25" height="25" fill="#ffffff" rx="4" stroke="#6b7280" stroke-width="1"/>
      <rect x="65" y="25" width="25" height="25" fill="#ffffff" rx="4" stroke="#6b7280" stroke-width="1"/>
      <g fill="#1f2937">
        <circle cx="42" cy="27" r="2"/>
        <circle cx="53" cy="38" r="2"/>
        <circle cx="72" cy="32" r="2"/>
        <circle cx="77" cy="37" r="2"/>
        <circle cx="82" cy="42" r="2"/>
        <circle cx="72" cy="42" r="2"/>
        <circle cx="82" cy="32" r="2"/>
        <circle cx="77" cy="47" r="2"/>
      </g>
      <text x="60" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">DICE</text>
    </svg>
  `)}`,

  cricket: `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cricketBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#15803d;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#22c55e;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="120" height="80" fill="url(#cricketBg)" rx="8"/>
      <rect x="55" y="15" width="3" height="35" fill="#8b5cf6"/>
      <rect x="57" y="15" width="3" height="35" fill="#8b5cf6"/>
      <rect x="59" y="15" width="3" height="35" fill="#8b5cf6"/>
      <rect x="45" y="48" width="30" height="3" fill="#a3a3a3"/>
      <circle cx="35" cy="40" r="4" fill="#dc2626"/>
      <path d="M25 45 Q30 35 40 40" stroke="#7c2d12" stroke-width="3" fill="none"/>
      <text x="80" y="25" text-anchor="middle" fill="#fbbf24" font-family="Arial" font-size="12" font-weight="bold">6</text>
      <text x="60" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">CRICKET</text>
    </svg>
  `)}`,

  roulette: `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rouletteBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7c2d12;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#991b1b;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="120" height="80" fill="url(#rouletteBg)" rx="8"/>
      <circle cx="60" cy="35" r="22" fill="#1f2937" stroke="#fbbf24" stroke-width="2"/>
      <g transform="translate(60, 35)">
        ${Array.from({length: 12}, (_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x = Math.cos(angle) * 18;
          const y = Math.sin(angle) * 18;
          const color = i % 2 === 0 ? '#dc2626' : '#000000';
          return `<circle cx="${x}" cy="${y}" r="3" fill="${color}"/>`;
        }).join('')}
      </g>
      <polygon points="60,8 65,18 55,18" fill="#fbbf24"/>
      <circle cx="60" cy="35" r="3" fill="#fbbf24"/>
      <text x="60" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">ROULETTE</text>
    </svg>
  `)}`,
};

export const categoryIcons = {
  lottery: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="18" height="12" x="3" y="6" fill="#10b981" rx="2"/>
      <path d="M7 10h.01M11 10h.01M15 10h.01M7 14h.01M11 14h.01M15 14h.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `)}`,
  
  casino: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="4" height="4" x="4" y="4" fill="#dc2626" rx="1"/>
      <rect width="4" height="4" x="4" y="16" fill="#dc2626" rx="1"/>
      <rect width="4" height="4" x="16" y="4" fill="#dc2626" rx="1"/>
      <rect width="4" height="4" x="16" y="16" fill="#dc2626" rx="1"/>
      <circle cx="12" cy="12" r="2" fill="#dc2626"/>
    </svg>
  `)}`,
  
  crash: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20 L8 16 L12 18 L16 14 L20 16" stroke="#10b981" stroke-width="2" fill="none"/>
      <circle cx="18" cy="6" r="3" fill="#fbbf24"/>
      <path d="M14 8 L18 4 L22 8" stroke="#fbbf24" stroke-width="2" fill="none"/>
    </svg>
  `)}`,
  
  popular: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 L15 8.5 L22 9.5 L17 14 L18.5 21 L12 17.5 L5.5 21 L7 14 L2 9.5 L9 8.5 Z" fill="#fbbf24"/>
    </svg>
  `)}`,
};