import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface ParticleSystemProps {
  isActive: boolean;
  type: 'win' | 'explosion' | 'coins' | 'fire';
  duration?: number;
}

export const ParticleSystem = ({ isActive, type, duration = 3000 }: ParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    initParticles();
    animate();

    const timeout = setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      particlesRef.current = [];
    }, duration);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(timeout);
    };
  }, [isActive, type]);

  const initParticles = () => {
    particlesRef.current = [];
    const particleCount = type === 'win' ? 50 : type === 'explosion' ? 30 : 40;

    for (let i = 0; i < particleCount; i++) {
      const particle: Particle = {
        x: Math.random() * window.innerWidth,
        y: type === 'win' ? window.innerHeight : Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 10,
        vy: type === 'win' ? -Math.random() * 8 - 2 : (Math.random() - 0.5) * 8,
        life: 1,
        maxLife: 1,
        color: getParticleColor(),
        size: Math.random() * 8 + 4
      };
      particlesRef.current.push(particle);
    }
  };

  const getParticleColor = () => {
    switch (type) {
      case 'win':
        return `hsl(${Math.random() * 60 + 45}, 100%, ${Math.random() * 30 + 50}%)`;
      case 'explosion':
        return `hsl(${Math.random() * 60}, 100%, ${Math.random() * 30 + 50}%)`;
      case 'coins':
        return `hsl(45, 100%, ${Math.random() * 20 + 60}%)`;
      case 'fire':
        return `hsl(${Math.random() * 30}, 100%, ${Math.random() * 30 + 50}%)`;
      default:
        return '#FFD700';
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.2;
      particle.life -= 0.02;

      if (particle.life <= 0) {
        particlesRef.current.splice(index, 1);
        return;
      }

      ctx.save();
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      
      if (type === 'coins') {
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};