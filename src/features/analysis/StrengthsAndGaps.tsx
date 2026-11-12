import { CircleAlert, CircleCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TONE } from '@/lib/tone';
import type { Tone } from '@/types';

interface FindingsProps {
  title: string;
  tone: Tone;
  icon: LucideIcon;
  items: string[];
}

function Findings({ title, tone, icon: Icon, items }: FindingsProps) {
  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed">
            <Icon className={`mt-0.5 size-4 shrink-0 ${TONE[tone].text}`} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface StrengthsAndGapsProps {
  strengths: string[];
  gaps: string[];
}

export function StrengthsAndGaps({ strengths, gaps }: StrengthsAndGapsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Findings title="Strengths" tone="good" icon={CircleCheck} items={strengths} />
      <Findings title="Gaps to address" tone="warn" icon={CircleAlert} items={gaps} />
    </div>
  );
}
