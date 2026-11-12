import type { ReactNode } from 'react';
import { TONE } from '@/lib/tone';
import type { Tone } from '@/types';

export function Chip({ tone, children }: { tone?: Tone; children: ReactNode }) {
  const style = tone ? TONE[tone].soft : 'bg-sunken text-soft';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>
      {children}
    </span>
  );
}
