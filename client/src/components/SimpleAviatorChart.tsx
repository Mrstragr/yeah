import { useEffect, useRef } from 'react';

interface SimpleAviatorChartProps {
  multiplier: number;
  gameState: 'betting' | 'flying' | 'crashed';
  chartPoints: Array<{x: number, y: number}>;
}

export const SimpleAviatorChart = ({ multiplier, gameState, chartPoints }: SimpleAviatorChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background grid
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    if (chartPoints.length < 2) return;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0.05)');
    
    // Draw area under curve
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    chartPoints.forEach((point, index) => {
      const x = Math.min((point.x / 50) * width, width);
      const y = Math.max(height - ((point.y - 1) / 9) * height, 20);
      
      if (index === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.lineTo(chartPoints[chartPoints.length - 1] ? Math.min((chartPoints[chartPoints.length - 1].x / 50) * width, width) : 0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw the line
    ctx.beginPath();
    chartPoints.forEach((point, index) => {
      const x = Math.min((point.x / 50) * width, width);
      const y = Math.max(height - ((point.y - 1) / 9) * height, 20);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.strokeStyle = gameState === 'crashed' ? '#dc2626' : '#22c55e';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw crash point
    if (gameState === 'crashed' && chartPoints.length > 0) {
      const lastPoint = chartPoints[chartPoints.length - 1];
      const x = Math.min((lastPoint.x / 50) * width, width);
      const y = Math.max(height - ((lastPoint.y - 1) / 9) * height, 20);
      
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();
      
      // Explosion effect
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
  }, [chartPoints, gameState, multiplier]);

  return (
    <div className="aviator-chart">
      <canvas 
        ref={canvasRef}
        width={800}
        height={300}
        className="chart-canvas"
      />
      
      <div className="multiplier-labels">
        {[1, 2, 3, 5, 8, 10].map(mult => (
          <div 
            key={mult} 
            className="mult-label" 
            style={{ bottom: `${((mult - 1) / 9) * 300}px` }}
          >
            {mult}x
          </div>
        ))}
      </div>
      
      <style>{`
        .aviator-chart {
          position: relative;
          width: 100%;
          height: 300px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(34,197,94,0.05));
          border-radius: 8px;
          overflow: hidden;
        }
        
        .chart-canvas {
          width: 100%;
          height: 100%;
        }
        
        .multiplier-labels {
          position: absolute;
          left: 10px;
          top: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        .mult-label {
          position: absolute;
          color: rgba(255,255,255,0.7);
          font-size: 12px;
          font-weight: bold;
          background: rgba(0,0,0,0.5);
          padding: 2px 6px;
          border-radius: 4px;
          transform: translateY(-50%);
        }
      `}</style>
    </div>
  );
};