import { BREAKDOWN_ROWS } from '@/lib/breakdown';
import { scoreTone } from '@/lib/score';
import { TONE } from '@/lib/tone';
import type { ScoreBreakdown } from '@/types';

export function BreakdownList({ breakdown }: { breakdown: ScoreBreakdown }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {BREAKDOWN_ROWS.map(({ key, label, hint }) => {
        const value = breakdown[key];
        return (
          <li key={key} className="grid items-center gap-x-8 gap-y-2 py-4 sm:grid-cols-[17rem_1fr_3rem]">
            <div>
              <p className="font-medium">{label}</p>
              <p className="text-[13px] text-soft">{hint}</p>
            </div>
            <div role="img" aria-label={`${label}: ${value} percent`} className="h-1.5 rounded-full bg-sunken">
              <div className={`h-full rounded-full ${TONE[scoreTone(value)].solid}`} style={{ width: `${value}%` }} />
            </div>
            <p className="font-medium tabular-nums sm:text-right">{value}%</p>
          </li>
        );
      })}
    </ul>
  );
}
