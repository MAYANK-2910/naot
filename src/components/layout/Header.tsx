import { FileCheck2, Moon, Sun } from 'lucide-react';
import type { Theme, View } from '@/types';

const VIEWS: { id: View; label: string }[] = [
  { id: 'screener', label: 'Screener' },
  { id: 'developer', label: 'Developer' },
];

interface HeaderProps {
  view: View;
  onViewChange: (view: View) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ view, onViewChange, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-md bg-ink text-surface">
            <FileCheck2 className="size-4" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Resume Screener</span>
        </div>

        <div className="flex items-center gap-2">
          <div role="group" aria-label="View" className="flex rounded-lg bg-sunken p-0.5">
            {VIEWS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={view === id}
                onClick={() => onViewChange(id)}
                className={`h-8 rounded-md px-3 text-[13px] font-medium transition-colors ${
                  view === id ? 'bg-surface text-ink shadow-sm' : 'text-soft hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="grid size-9 place-items-center rounded-lg text-soft transition-colors hover:bg-sunken hover:text-ink"
          >
            {theme === 'dark' ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
