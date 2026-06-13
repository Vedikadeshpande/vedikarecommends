'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Editorial from '@/components/Editorial';
import HowItWorks from '@/components/HowItWorks';
import Discover from '@/components/Discover';
import Result from '@/components/Result';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import IpodJourney from '@/components/IpodJourney';
import type { RecommendResponse } from '@/types';

export default function Home() {
  // Intro State
  const [preloadedImages, setPreloadedImages] = useState<HTMLImageElement[] | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  // Main App State
  const [result, setResult] = useState<RecommendResponse | null>(null);
  const [isDarkSection, setIsDarkSection] = useState(false);
  const discoverRef = useRef<HTMLElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Track whether user is in the dark section (discover/result) for Navbar styling
  useEffect(() => {
    if (showIntro) return; // Don't run observer if intro is active

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsDarkSection(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    const lightObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsDarkSection(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    const heroEl = document.getElementById('hero-section');
    const editorialEl = document.getElementById('editorial-section');
    const howItWorksEl = document.getElementById('how-it-works-section');

    if (heroEl) lightObserver.observe(heroEl);
    if (editorialEl) lightObserver.observe(editorialEl);
    if (howItWorksEl) lightObserver.observe(howItWorksEl);

    if (discoverRef.current) observer.observe(discoverRef.current);

    return () => {
      observer.disconnect();
      lightObserver.disconnect();
    };
  }, [showIntro]);

  const scrollToDiscover = useCallback(() => {
    discoverRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleResult = useCallback((res: RecommendResponse) => {
    setResult(res);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    scrollToDiscover();
  }, [scrollToDiscover]);

  // Transition from Intro to Main App
  const handleEnterApp = useCallback(() => {
    // Reset scroll position to top instantly before showing app content
    window.scrollTo({ top: 0 });
    setShowIntro(false);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <motion.div
          key="intro-viewport"
          exit={{
            opacity: 0,
            transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] }
          }}
          className="bg-black min-h-screen w-full"
        >
          {!preloadedImages ? (
            <LoadingScreen onComplete={setPreloadedImages} />
          ) : (
            <IpodJourney images={preloadedImages} onEnterApp={handleEnterApp} />
          )}
        </motion.div>
      ) : (
        <motion.div
          key="main-application"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#F5F0EB] text-[#1A1A1A] min-h-screen w-full relative"
        >
          <Navbar isDarkSection={isDarkSection} onDiscoverClick={scrollToDiscover} />

          <main>
            <Hero onScrollDown={scrollToDiscover} />
            <Editorial />
            <HowItWorks />
            <Discover ref={discoverRef} onResult={handleResult} />

            {result && (
              <div ref={resultRef}>
                <Result result={result} onReset={handleReset} />
              </div>
            )}
          </main>

          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
