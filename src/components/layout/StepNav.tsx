import type { Step } from '@/types';

const STEPS: { id: Step; label: string }[] = [
  { id: 'setup', label: 'Setup' },
  { id: 'analysis', label: 'Match analysis' },
  { id: 'tailoring', label: 'Resume tailoring' },
  { id: 'report', label: 'Report' },
];

interface StepNavProps {
  current: Step;
  hasResult: boolean;
  onSelect: (step: Step) => void;
}

export function StepNav({ current, hasResult, onSelect }: StepNavProps) {
  return (
    <nav aria-label="Screening steps" className="no-print border-b border-line">
      <ol className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 sm:px-6">
        {STEPS.map(({ id, label }, index) => {
          const active = id === current;
          const locked = id !== 'setup' && !hasResult;

          return (
            <li key={id}>
              <button
                type="button"
                disabled={locked}
                aria-current={active ? 'step' : undefined}
                onClick={() => onSelect(id)}
                className={`flex h-12 items-center gap-2 whitespace-nowrap border-b-2 px-3 text-sm font-medium transition-colors -outline-offset-2 disabled:opacity-45 ${
                  active ? 'border-ink text-ink' : 'border-transparent text-soft hover:text-ink'
                }`}
              >
                <span
                  className={`grid size-5 place-items-center rounded-full text-[11px] ${
                    active ? 'bg-ink text-surface' : 'bg-sunken text-soft'
                  }`}
                >
                  {index + 1}
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
