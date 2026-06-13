'use client';

import { memo } from 'react';

interface SpotifyEmbedProps {
  trackId: string;
}

function SpotifyEmbed({ trackId }: SpotifyEmbedProps) {
  return (
    <div className="result__embed-wrapper">
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="100%"
        height="352"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify player"
        id="spotify-embed"
      />
    </div>
  );
}

export default memo(SpotifyEmbed);
