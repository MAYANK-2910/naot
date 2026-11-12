import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeading } from '@/components/ui/PageHeading';
import type { BulletRewrite } from '@/types';

interface TailoringPageProps {
  rewrites: BulletRewrite[];
  missingKeywords: string[];
  onContinue: () => void;
}

export function TailoringPage({ rewrites, missingKeywords, onContinue }: TailoringPageProps) {
  return (
    <div className="space-y-8">
      <PageHeading
        title="Resume tailoring"
        description="Role-specific tips use keywords already found in resume bullets. Nothing is invented or rewritten automatically."
      />

      {rewrites.length === 0 ? (
        <EmptyState
          title="No role-matched bullets found"
          description="Try a different resume or review the role keywords below. Only add skills that reflect real experience."
        />
      ) : (
        <ul className="space-y-4">
          {rewrites.map((rewrite) => (
            <li key={rewrite.original} className="overflow-hidden rounded-xl border border-line bg-surface">
              <div className="grid md:grid-cols-2">
                <div className="bg-sunken p-5">
                  <h3 className="text-xs font-medium text-faint">Resume bullet</h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft">{rewrite.original}</p>
                </div>
                <div className="border-t border-line p-5 md:border-l md:border-t-0">
                  <h3 className="text-xs font-medium text-accent">Tailoring tip</h3>
                  <p className="mt-2 text-sm leading-relaxed">{rewrite.suggested}</p>
                </div>
              </div>
              <div className="border-t border-line px-5 py-3">
                <p className="text-[13px] text-soft">{rewrite.impact}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {missingKeywords.length > 0 && (
        <section aria-labelledby="missing-keywords-heading" className="rounded-xl border border-line bg-surface p-5">
          <h2 id="missing-keywords-heading" className="text-sm font-semibold">
            Keywords not found in this resume
          </h2>
          <p className="mt-1 text-sm text-soft">
            Add these only if you have relevant experience that you can support with a concrete example.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {missingKeywords.map((keyword) => (
              <li key={keyword} className="rounded-full bg-sunken px-3 py-1 text-sm text-soft">
                {keyword}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex justify-end border-t border-line pt-6">
        <Button variant="primary" onClick={onContinue}>
          Continue to report
        </Button>
      </div>
    </div>
  );
}
