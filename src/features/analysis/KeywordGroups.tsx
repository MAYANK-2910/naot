import { CircleAlert, CircleCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Chip } from '@/components/ui/Chip';
import { TONE } from '@/lib/tone';
import type { Tone } from '@/types';

interface GroupProps {
  title: string;
  tone: Tone;
  icon: LucideIcon;
  items: string[];
  emptyText: string;
}

function KeywordGroup({ title, tone, icon: Icon, items, emptyText }: GroupProps) {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
        <Icon className={`size-4 ${TONE[tone].text}`} aria-hidden="true" />
        {title}
        <span className="font-normal text-faint">{items.length}</span>
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-soft">{emptyText}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item}>
              <Chip tone={tone}>{item}</Chip>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface KeywordGroupsProps {
  matched: string[];
  missing: string[];
}

export function KeywordGroups({ matched, missing }: KeywordGroupsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <KeywordGroup
        title="Found in resume"
        tone="good"
        icon={CircleCheck}
        items={matched}
        emptyText="None of the role's keywords appear in this resume."
      />
      <KeywordGroup
        title="Not found"
        tone="warn"
        icon={CircleAlert}
        items={missing}
        emptyText="Every keyword the role asks for appears in this resume."
      />
    </div>
  );
}
