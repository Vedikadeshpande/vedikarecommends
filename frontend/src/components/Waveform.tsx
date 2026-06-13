'use client';

import { useRef, useEffect, useCallback, memo } from 'react';

interface WaveformProps {
  mood?: string;
  className?: string;
  color?: string;
  opacity?: number;
}

const MOOD_WAVE_CONFIGS: Record<string, { speed: number; amplitude: number; frequency: number; layers: number }> = {
  joy: { speed: 0.025, amplitude: 0.35, frequency: 3, layers: 5 },
  sadness: { speed: 0.008, amplitude: 0.2, frequency: 1.5, layers: 3 },
  anger: { speed: 0.04, amplitude: 0.5, frequency: 5, layers: 6 },
  angry: { speed: 0.04, amplitude: 0.5, frequency: 5, layers: 6 },
  romantic: { speed: 0.012, amplitude: 0.3, frequency: 2, layers: 4 },
  love: { speed: 0.012, amplitude: 0.3, frequency: 2, layers: 4 },
  chill: { speed: 0.006, amplitude: 0.15, frequency: 1.2, layers: 3 },
  party: { speed: 0.035, amplitude: 0.45, frequency: 4, layers: 5 },
  default: { speed: 0.015, amplitude: 0.25, frequency: 2, layers: 4 },
};

function Waveform({ mood, className, color = '#1A1A1A', opacity = 0.12 }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const config = MOOD_WAVE_CONFIGS[mood || 'default'] || MOOD_WAVE_CONFIGS.default;
      timeRef.current += config.speed;
      const t = timeRef.current;

      ctx.clearRect(0, 0, width, height);
      const centerY = height / 2;

      for (let layer = 0; layer < config.layers; layer++) {
        const layerOpacity = opacity * (1 - layer / config.layers) * 0.6;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.globalAlpha = layerOpacity;
        ctx.lineWidth = 1.5;

        const phaseOffset = layer * 0.8;
        const ampMultiplier = 1 - layer * 0.12;
        const freqMultiplier = 1 + layer * 0.15;

        for (let x = 0; x <= width; x += 2) {
          const normalX = x / width;
          const amp =
            config.amplitude *
            ampMultiplier *
            height *
            0.3 *
            Math.sin(normalX * Math.PI); // envelope

          const y =
            centerY +
            amp *
              Math.sin(
                normalX * config.frequency * freqMultiplier * Math.PI * 2 +
                  t +
                  phaseOffset
              ) *
              Math.cos(normalX * 1.5 + t * 0.3 + phaseOffset * 0.5);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    },
    [mood, color, opacity]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      draw(ctx, rect.width, rect.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
      aria-hidden="true"
    />
  );
}

export default memo(Waveform);
