'use client';

import { forwardRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import MoodInput from './MoodInput';
import GenreSelector from './GenreSelector';
import ScrollReveal from './ScrollReveal';
import { getRecommendation } from '@/lib/api';
import type { RecommendResponse } from '@/types';

const GENRES = ['pop', 'bollywood', 'indie', 'hiphop'];

interface DiscoverProps {
  onResult: (result: RecommendResponse) => void;
}

const Discover = forwardRef<HTMLElement, DiscoverProps>(function Discover(
  { onResult },
  ref
) {
  const [moodText, setMoodText] = useState('');
  const [genre, setGenre] = useState('pop');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!moodText.trim()) {
      setError('Describe how you\'re feeling first — even a few words will do.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await getRecommendation({ text: moodText, genre });
      onResult(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went sideways. Give it another try.'
      );
    } finally {
      setLoading(false);
    }
  }, [moodText, genre, onResult]);

  return (
    <section
      className="discover"
      id="discover-section"
      ref={ref}
      aria-label="Discover music"
    >
      <div className="container">
        <div className="discover__inner">
          <div className="discover__header">
            <ScrollReveal>
              <h2 className="discover__title">Find your groove</h2>
              <p className="discover__subtitle">
                Describe your mood, choose a genre, and let the music find you.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.1}>
            <MoodInput value={moodText} onChange={setMoodText} />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <GenreSelector
              genres={GENRES}
              selected={genre}
              onSelect={setGenre}
            />
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <motion.button
              className="discover__submit"
              onClick={handleSubmit}
              disabled={loading}
              id="submit-recommendation"
              whileTap={{ scale: 0.98 }}
              aria-label={loading ? 'Finding your groove...' : 'Find my groove'}
            >
              {loading ? (
                <span className="discover__submit-loading" aria-hidden="true">
                  <span className="discover__submit-dot" />
                  <span className="discover__submit-dot" />
                  <span className="discover__submit-dot" />
                </span>
              ) : (
                'Find My Groove'
              )}
            </motion.button>
          </ScrollReveal>

          {error && (
            <motion.div
              className="discover__error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
});

export default Discover;
