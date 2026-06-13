export interface RecommendRequest {
  text: string;
  genre: string;
}

export interface RecommendResponse {
  mood: string;
  track_id: string | null;
  genre: string;
}

export interface GenresResponse {
  genres: string[];
}

export interface MoodsResponse {
  moods: string[];
}

export type MoodType =
  | 'joy'
  | 'sadness'
  | 'anger'
  | 'angry'
  | 'romantic'
  | 'love'
  | 'chill'
  | 'party';

export type GenreType =
  | 'pop'
  | 'bollywood'
  | 'indie'
  | 'hiphop';

export const MOOD_COLORS: Record<string, string> = {
  joy: '#D4A853',
  sadness: '#7A8B6F',
  anger: '#C4654A',
  angry: '#C4654A',
  romantic: '#B8627D',
  love: '#B8627D',
  chill: '#6B8F9E',
  party: '#D4A853',
};

export const MOOD_LABELS: Record<string, string> = {
  joy: 'Joyful',
  sadness: 'Melancholic',
  anger: 'Intense',
  angry: 'Fiery',
  romantic: 'Romantic',
  love: 'Loving',
  chill: 'Mellow',
  party: 'Energetic',
};
