import type { ReactNode } from 'react';
import { Info, TriangleAlert } from 'lucide-react';

interface NoticeProps {
  tone?: 'neutral' | 'warn';
  action?: ReactNode;
  children: ReactNode;
}

export function Notice({ tone = 'neutral', action, children }: NoticeProps) {
  const isWarn = tone === 'warn';
  const Icon = isWarn ? TriangleAlert : Info;

  return (
    <div
      role={isWarn ? 'alert' : 'note'}
      className={`flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm ${isWarn ? 'bg-warn-bg text-warn' : 'bg-sunken text-soft'}`}
    >
      <p className="flex items-start gap-2.5">
        <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>{children}</span>
      </p>
      {action}
    </div>
  );
}
