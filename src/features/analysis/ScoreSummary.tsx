import { useEffect, useState } from 'react';
import { PARTIAL_THRESHOLD, STRONG_THRESHOLD, scoreLabel, scoreTone } from '@/lib/score';
import { TONE } from '@/lib/tone';

interface ScoreSummaryProps {
  score: number;
  verdict: string;
  candidateName: string;
  jobTitle: string;
}

export function ScoreSummary({ score, verdict, candidateName, jobTitle }: ScoreSummaryProps) {
  const tone = scoreTone(score);
  const [shown, setShown] = useState(0);

  // The bar fills once when results appear.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(score));
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <section aria-label="Overall match" className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <p className="text-sm text-soft">
        {candidateName} for {jobTitle}
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-3">
        <span className="text-7xl font-semibold leading-none tracking-tight tabular-nums sm:text-8xl">{score}</span>
        <span className="pb-1.5 text-lg text-faint">out of 100</span>
        <span className={`mb-1.5 rounded-full px-3 py-1 text-sm font-medium sm:ml-auto ${TONE[tone].soft}`}>
          {scoreLabel(score)}
        </span>
      </div>

      <div className="mt-7">
        <div
          role="img"
          aria-label={`Match score ${score} out of 100`}
          className="relative h-2 rounded-full bg-sunken"
        >
          <div
            className={`h-full rounded-full transition-[width] duration-700 ease-out ${TONE[tone].solid}`}
            style={{ width: `${shown}%` }}
          />
          {[PARTIAL_THRESHOLD, STRONG_THRESHOLD].map((mark) => (
            <span
              key={mark}
              className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-strong"
              style={{ left: `${mark}%` }}
            />
          ))}
        </div>
        <div aria-hidden="true" className="relative mt-2 h-4 text-xs text-faint">
          {[
            { mark: PARTIAL_THRESHOLD, label: 'Partial' },
            { mark: STRONG_THRESHOLD, label: 'Strong' },
          ].map(({ mark, label }) => (
            <span key={mark} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${mark}%` }}>
              {label} {mark}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-5 text-[15px]">{verdict}</p>
    </section>
  );
}
