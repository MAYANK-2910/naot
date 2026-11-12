import { Field, TEXTAREA_CLASS } from '@/components/ui/Field';
import { RadioDot } from '@/components/ui/RadioDot';
import { JOB_DESCRIPTIONS } from '@/data/jobDescriptions';

interface RoleSelectorProps {
  selectedId: string;
  text: string;
  onSelect: (id: string) => void;
  onTextChange: (text: string) => void;
}

export function RoleSelector({ selectedId, text, onSelect, onTextChange }: RoleSelectorProps) {
  return (
    <section aria-labelledby="role-heading" className="space-y-5">
      <div>
        <h2 id="role-heading" className="text-base font-semibold">
          Role
        </h2>
        <p className="mt-0.5 text-sm text-soft">Pick a sample role or paste your own job description.</p>
      </div>

      <div
        role="radiogroup"
        aria-labelledby="role-heading"
        className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface"
      >
        {JOB_DESCRIPTIONS.map((job) => {
          const selected = job.id === selectedId;
          return (
            <button
              key={job.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(job.id)}
              className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors -outline-offset-2 ${
                selected ? 'bg-sunken' : 'hover:bg-sunken/60'
              }`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium">{job.title}</span>
                <span className="block text-[13px] text-soft">{job.department}</span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-faint">{job.location}</span>
                <RadioDot selected={selected} />
              </span>
            </button>
          );
        })}
      </div>

      <Field id="job-description" label="Job description">
        <textarea
          id="job-description"
          rows={12}
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Paste the job description here"
          className={TEXTAREA_CLASS}
        />
      </Field>
    </section>
  );
}
