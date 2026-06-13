'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const steps = [
  {
    number: '01',
    name: 'Feel',
    description: 'What does this moment feel like?',
    barHeights: [0.3, 0.7, 1, 0.6, 0.4, 0.8, 0.5],
    barDelay: 0,
  },
  {
    number: '02',
    name: 'Express',
    description: 'Describe your mood in your own words.',
    barHeights: [0.5, 0.9, 0.4, 1, 0.3, 0.7, 0.6],
    barDelay: 0.15,
  },
  {
    number: '03',
    name: 'Discover',
    description: 'Find music that matches your moment.',
    barHeights: [0.6, 0.4, 0.8, 0.5, 1, 0.3, 0.9],
    barDelay: 0.3,
  },
];

function AnimatedBars({
  heights,
  inView,
  delay,
}: {
  heights: number[];
  inView: boolean;
  delay: number;
}) {
  return (
    <div className="step__icon">
      <div className="step__icon-bars">
        {heights.map((h, i) => (
          <motion.div
            key={i}
            className="step__icon-bar"
            initial={{ height: 4 }}
            animate={inView ? { height: h * 56 } : { height: 4 }}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.06,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      className="how-it-works"
      id="how-it-works-section"
      ref={sectionRef}
      aria-label="How it works"
    >
      <div className="container">
        <div className="how-it-works__header">
          <ScrollReveal>
            <p className="how-it-works__label">How it works</p>
            <h2 className="how-it-works__title">Most platforms know your history.<br />
              We know your now.</h2>
          </ScrollReveal>
        </div>

        <div className="how-it-works__steps">
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} delay={index * 0.15}>
              <div className="step">
                <div className="step__number" aria-hidden="true">
                  {step.number}
                </div>
                <AnimatedBars
                  heights={step.barHeights}
                  inView={isInView}
                  delay={step.barDelay}
                />
                <h3 className="step__name">{step.name}</h3>
                <p className="step__description">{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
