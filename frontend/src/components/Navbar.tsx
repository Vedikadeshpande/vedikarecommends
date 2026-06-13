'use client';

import { useEffect, useState } from 'react';

interface NavbarProps {
  isDarkSection?: boolean;
  onDiscoverClick?: () => void;
}

export default function Navbar({ isDarkSection = false, onDiscoverClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = [
    'navbar',
    scrolled ? 'scrolled' : '',
    isDarkSection ? 'dark' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={navClass} role="navigation" aria-label="Main navigation">
      <a href="#" className="navbar__logo" id="nav-logo">
        vedikarecommends
      </a>
      <button
        className="navbar__cta"
        id="nav-discover-btn"
        onClick={onDiscoverClick}
        aria-label="Navigate to discover section"
      >
        Discover
      </button>
    </nav>
  );
}
