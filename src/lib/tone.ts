import type { Tone } from '@/types';

/** Class names per tone. Full strings so Tailwind can detect them. */
export const TONE: Record<Tone, { text: string; soft: string; solid: string }> = {
  good: { text: 'text-good', soft: 'bg-good-bg text-good', solid: 'bg-good' },
  warn: { text: 'text-warn', soft: 'bg-warn-bg text-warn', solid: 'bg-warn' },
  bad: { text: 'text-bad', soft: 'bg-bad-bg text-bad', solid: 'bg-bad' },
};
