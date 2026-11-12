import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-dashed border-strong px-6 py-14 text-center">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-1.5 text-sm text-soft">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
