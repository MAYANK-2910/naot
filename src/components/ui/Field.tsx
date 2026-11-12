import type { ReactNode } from 'react';

export const INPUT_CLASS =
  'h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm placeholder:text-faint';
export const TEXTAREA_CLASS =
  'w-full resize-y rounded-lg border border-line bg-surface p-3 text-sm leading-relaxed placeholder:text-faint';

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ id, label, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[13px] text-soft">{hint}</p>}
    </div>
  );
}
