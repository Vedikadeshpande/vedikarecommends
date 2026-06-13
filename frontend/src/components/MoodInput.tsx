'use client';

import { useState, useEffect, useCallback } from 'react';

interface MoodInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PLACEHOLDERS = [
  'I feel like the rain outside matches my mood...',
  'Today is bright and I can\'t stop smiling...',
  'Feeling nostalgic about old times...',
  'I\'m fired up and ready for anything...',
  'A quiet evening, feeling peaceful...',
  'My heart is full of love today...',
  'I need something to pump me up...',
  'Melancholy but in a beautiful way...',
];

export default function MoodInput({ value, onChange }: MoodInputProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const currentPlaceholder = PLACEHOLDERS[placeholderIndex];

  const cyclePlaceholder = useCallback(() => {
    setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    setIsTyping(true);
  }, []);

  // Typewriter effect for placeholder
  useEffect(() => {
    if (!isTyping || value) return;

    let charIndex = 0;
    setDisplayedPlaceholder('');

    const typeInterval = setInterval(() => {
      if (charIndex < currentPlaceholder.length) {
        setDisplayedPlaceholder(currentPlaceholder.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        // Wait, then cycle to next
        const timeout = setTimeout(cyclePlaceholder, 3000);
        return () => clearTimeout(timeout);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [isTyping, currentPlaceholder, value, cyclePlaceholder]);

  return (
    <div className="mood-input">
      <label htmlFor="mood-textarea" className="mood-input__label">
        How are you feeling?
      </label>
      <textarea
        id="mood-textarea"
        className="mood-input__textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={value ? '' : displayedPlaceholder}
        aria-label="Describe your current mood"
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
}
