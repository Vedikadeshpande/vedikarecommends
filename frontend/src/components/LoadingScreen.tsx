'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: (images: HTMLImageElement[]) => void;
}

// Module-level cache to persist preloaded frames across React StrictMode remounts
let cachedImages: HTMLImageElement[] = [];
let cachedIsLoaded = false;

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(cachedIsLoaded ? 100 : 0);
  const [isLoaded, setIsLoaded] = useState(cachedIsLoaded);

  useEffect(() => {
    if (cachedIsLoaded) {
      return;
    }

    let active = true;
    const totalFrames = 300;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const handleImageLoad = () => {
      if (!active) return;
      loadedCount++;
      const percent = Math.floor((loadedCount / totalFrames) * 100);
      setProgress(percent);

      if (loadedCount === totalFrames) {
        cachedImages = loadedImages;
        cachedIsLoaded = true;
        setIsLoaded(true);
      }
    };

    const handleImageError = (index: number) => {
      console.warn(`Failed to load frame ${index}`);
      handleImageLoad(); // Count to avoid blocking the user
    };

    // Preload loop
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const paddedIndex = i.toString().padStart(4, '0');
      img.onload = handleImageLoad;
      img.onerror = () => handleImageError(i);
      img.src = `/frames/frame_${paddedIndex}.jpg`;
      loadedImages.push(img);
    }

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        onComplete(cachedImages);
      }, 500); // 500ms delay for smooth transition
      return () => clearTimeout(timer);
    }
  }, [isLoaded, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black select-none">
      <div className="flex flex-col items-center max-w-xs w-full px-6 text-center">
        {/* Editorial Subtitle / Brand */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/40 font-sans text-xs tracking-[0.25em] uppercase mb-1"
        >
          vedikarecommends
        </motion.div>

        {/* Cinematic Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/95 font-serif text-3xl italic tracking-wide mb-8"
        >
          A Cinematic Intro
        </motion.h2>

        {/* Minimal Progress Bar Wrapper */}
        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden mb-4">
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-white"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.1 }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="flex justify-between items-center w-full text-[10px] tracking-widest uppercase font-mono text-white/50">
          <span>Loading Experience</span>
          <span className="font-semibold text-white/90 tabular-nums">
            {progress}%
          </span>
        </div>

        {/* Status message */}
        <div className="h-12 mt-6 flex items-center justify-center">
          {isLoaded ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              className="text-[10px] text-white/80 tracking-wider uppercase font-semibold italic animate-pulse"
            >
              Entering Experience...
            </motion.p>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="text-[10px] text-white/40 tracking-wider uppercase italic animate-pulse"
            >
              Caching Silver iPod Void...
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
