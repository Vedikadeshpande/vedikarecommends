'use client';

interface GenreSelectorProps {
  genres: string[];
  selected: string;
  onSelect: (genre: string) => void;
}

const GENRE_DISPLAY: Record<string, string> = {
  pop: 'Pop',
  rock: 'Rock',
  indie: 'Indie',
  hiphop: 'Hip Hop',
  jazz: 'Jazz',
  bollywood: 'Bollywood',
  rnb: 'R&B',
};

export default function GenreSelector({
  genres,
  selected,
  onSelect,
}: GenreSelectorProps) {
  return (
    <div className="genre-selector" role="radiogroup" aria-label="Select a genre">
      <label className="genre-selector__label" id="genre-label">
        Choose your genre
      </label>
      <ul className="genre-selector__list" aria-labelledby="genre-label">
        {genres.map((genre) => (
          <li key={genre}>
            <button
              className={`genre-selector__item ${
                selected === genre ? 'active' : ''
              }`}
              onClick={() => onSelect(genre)}
              role="radio"
              aria-checked={selected === genre}
              id={`genre-${genre}`}
            >
              {GENRE_DISPLAY[genre] || genre}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
