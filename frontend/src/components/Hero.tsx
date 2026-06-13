'use client';

import { motion, type Variants } from 'framer-motion';
import Waveform from './Waveform';

interface HeroProps {
  onScrollDown?: () => void;
}

const headlineWords = [
  { text: 'Music', italic: true },
  { text: 'for', italic: false },
  { text: 'how', italic: false },
  { text: 'you', italic: true },
  { text: 'feel', italic: false },
  { text: 'right now.', italic: true },
];

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: EASE_OUT_EXPO,
    },
  },
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 1.2,
      ease: EASE_OUT_EXPO,
    },
  },
};

const scrollIndicatorVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 2, duration: 1 },
  },
};

export default function Hero({ onScrollDown }: HeroProps) {
  return (
    <section className="hero" id="hero-section" aria-label="Hero">
      <div className="hero__waveform-container">
        <Waveform mood="chill" />
      </div>

      <motion.div
        className="hero__content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="hero__headline">
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              style={{
                display: 'inline-block',
                marginRight: '0.25em',
              }}
            >
              {word.italic ? <em>{word.text}</em> : word.text}
              {/* Line break after 2nd and 4th word for layout */}
              {(i === 1 || i === 3) && <br />}
            </motion.span>
          ))}
        </h1>

        <motion.p className="hero__subtitle" variants={subtitleVariants}>
          Tell us how you feel. Pick a genre. Discover music that truly matches
          your moment.
        </motion.p>
      </motion.div>

      <motion.div
        className="hero__scroll-indicator"
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate="visible"
        onClick={onScrollDown}
        role="button"
        tabIndex={0}
        aria-label="Scroll down to explore"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onScrollDown?.();
        }}
        style={{ cursor: 'pointer' }}
      >
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </motion.div>
    </section>
  );
}
