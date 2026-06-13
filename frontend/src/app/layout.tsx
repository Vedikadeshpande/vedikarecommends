import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'vedikarecommends — Your Mood, Your Music',
  description:
    'vedikarecommends is an intelligent music discovery platform that recommends songs based on your emotions. Describe how you feel, pick a genre, and discover your perfect track.',
  keywords: ['music', 'mood', 'recommendation', 'discovery', 'emotion', 'spotify'],
  openGraph: {
    title: 'vedikarecommends — Your Mood, Your Music',
    description:
      'Discover music that matches your mood. AI-powered emotion detection meets curated playlists.',
    type: 'website',
    siteName: 'vedikarecommends',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
