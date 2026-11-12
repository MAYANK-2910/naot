import type { Tone } from '@/types';

export const STRONG_THRESHOLD = 80;
export const PARTIAL_THRESHOLD = 55;

export function scoreTone(score: number): Tone {
  if (score >= STRONG_THRESHOLD) return 'good';
  if (score >= PARTIAL_THRESHOLD) return 'warn';
  return 'bad';
}

export function scoreLabel(score: number): string {
  if (score >= STRONG_THRESHOLD) return 'Strong match';
  if (score >= PARTIAL_THRESHOLD) return 'Partial match';
  return 'Weak match';
}
