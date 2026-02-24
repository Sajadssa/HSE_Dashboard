import { useEffect, useRef } from 'react';
import { useDashboard } from '../context/DashboardContext';

interface Flake {
  x: number; y: number; r: number; speed: number; wind: number; opacity: number;
}

export function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { snowEffectEnabled } = useDashboard();

  // Only render in winter: Dec (11), Jan (0), Feb (1)
  const month = new Date().getMonth();
  const isWinter = month === 11 || month === 0 || month === 1;

  useEffect(() => {
    if (!isWinter || !snowEffectEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth, H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const flakes: Flake[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.6,
      speed: Math.random() * 1.2 + 0.3,
      wind: Math.random() * 0.6 - 0.3,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      flakes.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,230,255,${f.opacity})`;
        ctx.fill();
        f.y += f.speed;
        f.x += f.wind;
        if (f.y > H) { f.y = -6; f.x = Math.random() * W; }
        if (f.x > W)  f.x = 0;
        if (f.x < 0)  f.x = W;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [isWinter, snowEffectEnabled]);

  if (!isWinter) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 9999,
      }}
    />
  );
}
