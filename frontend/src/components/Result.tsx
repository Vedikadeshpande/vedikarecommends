'use client';

import { motion } from 'framer-motion';
import SpotifyEmbed from './SpotifyEmbed';
import Waveform from './Waveform';
import { MOOD_COLORS, MOOD_LABELS } from '@/types';
import type { RecommendResponse } from '@/types';

interface ResultProps {
  result: RecommendResponse;
  onReset: () => void;
}

export default function Result({ result, onReset }: ResultProps) {
  const moodColor = MOOD_COLORS[result.mood] || '#D4A853';
  const moodLabel = MOOD_LABELS[result.mood] || result.mood;

  return (
    <section className="result" id="result-section" aria-label="Your recommendation">
      <div className="container">
        <motion.div
          className="result__inner"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <motion.p
            className="result__mood-label"
            style={{ color: moodColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            We sense you&apos;re feeling
          </motion.p>

          <motion.h2
            className="result__mood"
            style={{ color: moodColor }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            {moodLabel}
          </motion.h2>

          {result.track_id ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <SpotifyEmbed trackId={result.track_id} />
            </motion.div>
          ) : (
            <motion.div
              className="result__no-track"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="result__no-track-text">
                No tracks found for this vibe — try another mood or switch up the genre.
              </p>
            </motion.div>
          )}

          {/* Subtle waveform behind the result */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
              opacity: 0.06,
            }}
          >
            <Waveform mood={result.mood} color={moodColor} opacity={0.3} />
          </div>

          <motion.div
            className="result__actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <button
              className="result__try-again"
              onClick={onReset}
              id="try-again-btn"
            >
              Discover Again
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
