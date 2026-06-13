import type { RecommendRequest, RecommendResponse, GenresResponse } from '@/types';

const API_BASE = '/api';

export async function getRecommendation(
  data: RecommendRequest
): Promise<RecommendResponse> {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Something went wrong' }));
    throw new Error(error.detail || 'Failed to get recommendation');
  }

  return res.json();
}

export async function getGenres(): Promise<GenresResponse> {
  const res = await fetch(`${API_BASE}/genres`);
  if (!res.ok) throw new Error('Failed to fetch genres');
  return res.json();
}
