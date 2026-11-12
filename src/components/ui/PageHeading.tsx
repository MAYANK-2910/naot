import type { ReactNode } from 'react';

interface PageHeadingProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeading({ title, description, actions }: PageHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1.5 text-soft">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
