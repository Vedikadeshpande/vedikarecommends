'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

interface IpodJourneyProps {
  images: HTMLImageElement[];
  onEnterApp: () => void;
}

export default function IpodJourney({ images, onEnterApp }: IpodJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastFrameIndex = useRef<number>(-1);

  // Refs for scroll interpolation (smoothing/inertia)
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  // Refs for direct DOM manipulation to bypass React state updates at 60 FPS (zero lag)
  const indicatorRef = useRef<HTMLDivElement>(null);
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);
  const scene3Ref = useRef<HTMLDivElement>(null);
  const scene4Ref = useRef<HTMLDivElement>(null);
  const scene5Ref = useRef<HTMLDivElement>(null);

  // Background Music Ref & Mute State
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Preload whoosh sound effect on mount
  useEffect(() => {
    const sfx = new Audio('/sound effect.mp3');
    sfx.volume = 0.6;
    sfx.preload = 'auto';
    sfxRef.current = sfx;
  }, []);

  // Initialize Framer Motion Scroll Tracking (Window Scroll)
  const { scrollYProgress } = useScroll();

  // Direct DOM style updates based on progress (Silky smooth 60 FPS)
  const updateOverlayStyles = useCallback((progress: number) => {
    // 1. Scroll Indicator
    if (indicatorRef.current) {
      const indOpacity = progress <= 0.06 ? 0.6 * (1 - progress / 0.06) : 0;
      indicatorRef.current.style.opacity = String(indOpacity);
    }

    // 2. Scene 1 (0% to 15%)
    if (scene1Ref.current) {
      let opacity = 0;
      let y = 0;
      let blur = 'blur(8px)';
      if (progress <= 0.08) {
        opacity = 1;
        y = 0;
        blur = 'blur(0px)';
      } else if (progress >= 0.15) {
        opacity = 0;
        y = -40;
        blur = 'blur(8px)';
      } else {
        const t = (progress - 0.08) / 0.07;
        opacity = 1 - t;
        y = -t * 40;
        blur = `blur(${t * 8}px)`;
      }
      scene1Ref.current.style.opacity = String(opacity);
      scene1Ref.current.style.transform = `translateY(${y}px)`;
      scene1Ref.current.style.filter = blur;
      scene1Ref.current.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    }

    // 3. Scene 2 (15% to 35%)
    if (scene2Ref.current) {
      let opacity = 0;
      let y = 40;
      let blur = 'blur(8px)';
      if (progress >= 0.15 && progress <= 0.35) {
        if (progress <= 0.22) {
          const t = (progress - 0.15) / 0.07;
          opacity = t;
          y = 40 - t * 40;
          blur = `blur(${(1 - t) * 8}px)`;
        } else if (progress <= 0.28) {
          opacity = 1;
          y = 0;
          blur = 'blur(0px)';
        } else {
          const t = (progress - 0.28) / 0.07;
          opacity = 1 - t;
          y = -t * 40;
          blur = `blur(${t * 8}px)`;
        }
      } else if (progress > 0.35) {
        opacity = 0;
        y = -40;
        blur = 'blur(8px)';
      }
      scene2Ref.current.style.opacity = String(opacity);
      scene2Ref.current.style.transform = `translateY(${y}px)`;
      scene2Ref.current.style.filter = blur;
      scene2Ref.current.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    }

    // 4. Scene 3 (40% to 60%)
    if (scene3Ref.current) {
      let opacity = 0;
      let y = 40;
      let blur = 'blur(8px)';
      if (progress >= 0.40 && progress <= 0.60) {
        if (progress <= 0.47) {
          const t = (progress - 0.40) / 0.07;
          opacity = t;
          y = 40 - t * 40;
          blur = `blur(${(1 - t) * 8}px)`;
        } else if (progress <= 0.53) {
          opacity = 1;
          y = 0;
          blur = 'blur(0px)';
        } else {
          const t = (progress - 0.53) / 0.07;
          opacity = 1 - t;
          y = -t * 40;
          blur = `blur(${t * 8}px)`;
        }
      } else if (progress > 0.60) {
        opacity = 0;
        y = -40;
        blur = 'blur(8px)';
      }
      scene3Ref.current.style.opacity = String(opacity);
      scene3Ref.current.style.transform = `translateY(${y}px)`;
      scene3Ref.current.style.filter = blur;
      scene3Ref.current.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    }

    // 5. Scene 4 (65% to 85%)
    if (scene4Ref.current) {
      let opacity = 0;
      let y = 40;
      let blur = 'blur(8px)';
      if (progress >= 0.65 && progress <= 0.85) {
        if (progress <= 0.72) {
          const t = (progress - 0.65) / 0.07;
          opacity = t;
          y = 40 - t * 40;
          blur = `blur(${(1 - t) * 8}px)`;
        } else if (progress <= 0.78) {
          opacity = 1;
          y = 0;
          blur = 'blur(0px)';
        } else {
          const t = (progress - 0.78) / 0.07;
          opacity = 1 - t;
          y = -t * 40;
          blur = `blur(${t * 8}px)`;
        }
      } else if (progress > 0.85) {
        opacity = 0;
        y = -40;
        blur = 'blur(8px)';
      }
      scene4Ref.current.style.opacity = String(opacity);
      scene4Ref.current.style.transform = `translateY(${y}px)`;
      scene4Ref.current.style.filter = blur;
      scene4Ref.current.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    }

    // 6. Scene 5 (85% to 100%)
    if (scene5Ref.current) {
      let opacity = 0;
      let y = 40;
      let blur = 'blur(8px)';
      if (progress >= 0.85) {
        if (progress <= 0.92) {
          const t = (progress - 0.85) / 0.07;
          opacity = t;
          y = 40 - t * 40;
          blur = `blur(${(1 - t) * 8}px)`;
        } else {
          opacity = 1;
          y = 0;
          blur = 'blur(0px)';
        }
      }
      scene5Ref.current.style.opacity = String(opacity);
      scene5Ref.current.style.transform = `translateY(${y}px)`;
      scene5Ref.current.style.filter = blur;
      scene5Ref.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
    }
  }, []);

  // Canvas drawing callback (Contain behavior)
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !images[index]) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = images[index];

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Determine contained aspect ratio fitting
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width;
      const imgHeight = img.height;

      const ratio = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      
      const newWidth = imgWidth * ratio;
      const newHeight = imgHeight * ratio;
      const x = (canvasWidth - newWidth) / 2;
      const y = (canvasHeight - newHeight) / 2;

      ctx.drawImage(img, x, y, newWidth, newHeight);
      lastFrameIndex.current = index;
    },
    [images]
  );

  // Adjust canvas size for screen DPI
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Redraw the current frame
    if (lastFrameIndex.current >= 0) {
      drawFrame(lastFrameIndex.current);
    }
  }, [drawFrame]);

  // Bind scroll progress changes to our target ref
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    targetProgress.current = latest;
  });

  // Smooth Interpolation Loop (Lerping with Momentum)
  useEffect(() => {
    let animationFrameId: number;

    const updateFrame = () => {
      const diff = targetProgress.current - currentProgress.current;

      // Easing factor: 0.05 gives a beautiful, buttery scroll momentum (inertia)
      if (Math.abs(diff) > 0.0001) {
        currentProgress.current += diff * 0.05;
        
        const frameIndex = Math.min(
          Math.floor(currentProgress.current * images.length),
          images.length - 1
        );

        if (frameIndex >= 0 && frameIndex !== lastFrameIndex.current) {
          drawFrame(frameIndex);
        }
        
        // Directly update overlay element styles in DOM at 60fps (no React re-renders)
        updateOverlayStyles(currentProgress.current);
      } else if (currentProgress.current !== targetProgress.current) {
        // Snap directly to the target once close enough to prevent lingering drift
        currentProgress.current = targetProgress.current;
        
        const frameIndex = Math.min(
          Math.floor(currentProgress.current * images.length),
          images.length - 1
        );

        if (frameIndex >= 0 && frameIndex !== lastFrameIndex.current) {
          drawFrame(frameIndex);
        }
        
        updateOverlayStyles(currentProgress.current);
      }

      animationFrameId = requestAnimationFrame(updateFrame);
    };

    animationFrameId = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [images, drawFrame, updateOverlayStyles]);

  // Background Music Manager (Autoplay + Interaction Fallback)
  useEffect(() => {
    const audio = new Audio('/bg music.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    bgMusicRef.current = audio;

    const attemptPlay = () => {
      audio.play().then(() => {
        // Playback succeeded - remove interaction listeners
        window.removeEventListener('scroll', attemptPlay);
        window.removeEventListener('mousedown', attemptPlay);
        window.removeEventListener('click', attemptPlay);
        window.removeEventListener('touchstart', attemptPlay);
        window.removeEventListener('pointerdown', attemptPlay);
        window.removeEventListener('keydown', attemptPlay);
      }).catch((err) => {
        console.log("Autoplay blocked. Interaction listener active:", err);
      });
    };

    // Attempt direct play first
    attemptPlay();

    // Interaction fallback for modern browser autoplay policies
    window.addEventListener('scroll', attemptPlay, { passive: true });
    window.addEventListener('mousedown', attemptPlay);
    window.addEventListener('click', attemptPlay);
    window.addEventListener('touchstart', attemptPlay);
    window.addEventListener('pointerdown', attemptPlay);
    window.addEventListener('keydown', attemptPlay);

    return () => {
      audio.pause();
      window.removeEventListener('scroll', attemptPlay);
      window.removeEventListener('mousedown', attemptPlay);
      window.removeEventListener('click', attemptPlay);
      window.removeEventListener('touchstart', attemptPlay);
      window.removeEventListener('pointerdown', attemptPlay);
      window.removeEventListener('keydown', attemptPlay);
    };
  }, []);

  // Setup event listeners and initial paint
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial frame render synced to current scroll position
    if (images.length > 0) {
      const initialTimer = setTimeout(() => {
        const initialScroll = scrollYProgress.get();
        targetProgress.current = initialScroll;
        currentProgress.current = initialScroll;
        updateOverlayStyles(initialScroll);

        const frameIndex = Math.min(
          Math.floor(initialScroll * images.length),
          images.length - 1
        );
        drawFrame(frameIndex >= 0 ? frameIndex : 0);
      }, 100);

      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(initialTimer);
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [images, handleResize, drawFrame, scrollYProgress, updateOverlayStyles]);

  // Audio mute toggling handler
  const toggleMute = useCallback(() => {
    if (bgMusicRef.current) {
      const newMuted = !isMuted;
      bgMusicRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  // CTA Click handler: play sound effect and proceed to main app
  const handleEnterClick = useCallback(() => {
    // Play the preloaded whoosh sound effect
    if (sfxRef.current) {
      sfxRef.current.play().catch((err) => {
        console.warn("SFX play failed:", err);
      });
    }

    // Fade out the background music smoothly
    const bgMusic = bgMusicRef.current;
    if (bgMusic) {
      const startVolume = bgMusic.volume;
      const fadeDuration = 800; // ms
      const intervalTime = 50; // ms
      const steps = fadeDuration / intervalTime;
      const volumeStep = startVolume / steps;

      let currentStep = 0;
      const fadeInterval = setInterval(() => {
        currentStep++;
        if (bgMusic.volume > volumeStep) {
          bgMusic.volume -= volumeStep;
        } else {
          bgMusic.volume = 0;
          clearInterval(fadeInterval);
        }
      }, intervalTime);
    }

    // Delay the app transition to allow the whoosh SFX and music fadeout to finish
    setTimeout(() => {
      onEnterApp();
    }, 800);
  }, [onEnterApp]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '500vh',
        backgroundColor: '#000000',
        width: '100%',
      }}
    >
      {/* Sleek Minimalist Mute Button */}
      <button
        onClick={toggleMute}
        style={{
          position: 'fixed',
          top: '32px',
          right: '40px',
          zIndex: 101,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255, 255, 255, 0.6)',
          fontFamily: 'var(--font-sans), Inter, sans-serif',
          fontSize: '11px',
          fontWeight: '500',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: '8px 12px',
          transition: 'color 300ms ease, opacity 300ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#FFFFFF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isMuted ? (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          ) : (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </>
          )}
        </svg>
        <span>{isMuted ? 'Muted' : 'Sound'}</span>
      </button>

      {/* Sticky Canvas Container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />

        {/* ========================================================
            STORYTELLING OVERLAYS (Inline Style Architecture - Ref bound for 60fps)
           ======================================================== */}

        {/* Scene 1 (0%): Centered */}
        <div
          ref={scene1Ref}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 24px',
            color: 'rgba(255, 255, 255, 0.9)',
            opacity: 1,
            transform: 'translateY(0px)',
            filter: 'blur(0px)',
            transition: 'opacity 150ms ease-out, transform 150ms ease-out, filter 150ms ease-out',
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '16px',
            }}
          >
            Introduction
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              maxWidth: '720px',
            }}
          >
            Music should feel discovered.<br />
            <span style={{ fontStyle: 'italic', fontWeight: 300, color: 'rgba(255, 255, 255, 0.7)' }}>
              Not searched.
            </span>
          </h2>
        </div>

        {/* Initial Scroll Indicator */}
        <div
          ref={indicatorRef}
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            opacity: 0.6,
            transition: 'opacity 150ms ease-out',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'monospace',
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.4)',
              textTransform: 'uppercase',
            }}
          >
            Scroll to begin
          </span>
          <div
            style={{
              width: '1px',
              height: '48px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
            }}
            className="animate-pulse"
          />
        </div>

        {/* Scene 2 (25%): Left aligned */}
        <div
          ref={scene2Ref}
          style={{
            position: 'absolute',
            left: '8%',
            bottom: '25%',
            maxWidth: '480px',
            textAlign: 'left',
            color: 'rgba(255, 255, 255, 0.95)',
            opacity: 0,
            transform: 'translateY(40px)',
            filter: 'blur(8px)',
            transition: 'opacity 150ms ease-out, transform 150ms ease-out, filter 150ms ease-out',
            pointerEvents: 'none',
            userSelect: 'none',
            padding: '0 16px',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '12px',
              display: 'block',
            }}
          >
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}
          >
            Every song carries a feeling.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans), Inter, sans-serif',
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              letterSpacing: '0.05em',
              lineHeight: 1.5,
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            A memory waiting to return.
          </p>
        </div>

        {/* Scene 3 (50%): Right aligned */}
        <div
          ref={scene3Ref}
          style={{
            position: 'absolute',
            right: '8%',
            bottom: '25%',
            maxWidth: '520px',
            textAlign: 'right',
            color: 'rgba(255, 255, 255, 0.95)',
            opacity: 0,
            transform: 'translateY(40px)',
            filter: 'blur(8px)',
            transition: 'opacity 150ms ease-out, transform 150ms ease-out, filter 150ms ease-out',
            pointerEvents: 'none',
            userSelect: 'none',
            padding: '0 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '12px',
              display: 'block',
            }}
          >
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}
          >
            Most recommendation engines
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans), Inter, sans-serif',
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              letterSpacing: '0.05em',
              lineHeight: 1.5,
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.6)',
              maxWidth: '380px',
            }}
          >
            show you more of the same.
          </p>
        </div>

        {/* Scene 4 (75%): Left aligned */}
        <div
          ref={scene4Ref}
          style={{
            position: 'absolute',
            left: '8%',
            bottom: '25%',
            maxWidth: '480px',
            textAlign: 'left',
            color: 'rgba(255, 255, 255, 0.95)',
            opacity: 0,
            transform: 'translateY(40px)',
            filter: 'blur(8px)',
            transition: 'opacity 150ms ease-out, transform 150ms ease-out, filter 150ms ease-out',
            pointerEvents: 'none',
            userSelect: 'none',
            padding: '0 16px',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '12px',
              display: 'block',
            }}
          >
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}
          >
            Music is a network
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans), Inter, sans-serif',
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              letterSpacing: '0.05em',
              lineHeight: 1.5,
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            Built from emotions,<br />
            moments,<br />
            memories,<br />
            and moods.
          </p>
        </div>

        {/* Scene 5 (95%): Centered CTA */}
        <div
          ref={scene5Ref}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 24px',
            color: 'rgba(255, 255, 255, 0.95)',
            opacity: 0,
            transform: 'translateY(40px)',
            filter: 'blur(8px)',
            transition: 'opacity 150ms ease-out, transform 150ms ease-out, filter 150ms ease-out',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              marginBottom: '16px',
            }}
          >
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              maxWidth: '720px',
              marginBottom: '32px',
            }}
          >
            Find your next obsession.
          </h2>
          
          <button
            onClick={handleEnterClick}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#000000',
              padding: '16px 40px',
              borderRadius: '9999px',
              fontFamily: 'var(--font-sans), Inter, sans-serif',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(255, 255, 255, 0.15), 0 0 40px rgba(255, 255, 255, 0.1)',
              transition: 'transform 300ms ease, background-color 300ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = '#E2E8F0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            Enter vedikarecommends
          </button>
        </div>
      </div>
    </div>
  );
}
