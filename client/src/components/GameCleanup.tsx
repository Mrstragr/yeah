import { useEffect, useRef } from 'react';

interface GameCleanupProps {
  onCleanup: () => void;
}

export const GameCleanup = ({ onCleanup }: GameCleanupProps) => {
  const cleanupRef = useRef(onCleanup);
  
  useEffect(() => {
    cleanupRef.current = onCleanup;
  }, [onCleanup]);
  
  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);
  
  return null;
};

// Memory cleanup utilities
export const cleanupCanvasAnimations = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  if (canvasRef.current) {
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }
};

export const cleanupAnimationFrames = (frameIds: number[]) => {
  frameIds.forEach(id => {
    if (id) {
      cancelAnimationFrame(id);
    }
  });
};

export const cleanupIntervals = (intervalIds: NodeJS.Timeout[]) => {
  intervalIds.forEach(id => {
    if (id) {
      clearInterval(id);
    }
  });
};

export const cleanupTimeouts = (timeoutIds: NodeJS.Timeout[]) => {
  timeoutIds.forEach(id => {
    if (id) {
      clearTimeout(id);
    }
  });
};