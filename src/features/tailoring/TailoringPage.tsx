import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeading } from '@/components/ui/PageHeading';
import type { BulletRewrite } from '@/types';

interface TailoringPageProps {
  rewrites: BulletRewrite[];
  onContinue: () => void;
}

export function TailoringPage({ rewrites, onContinue }: TailoringPageProps) {
  return (
    <div className="space-y-8">
      <PageHeading
        title="Resume tailoring"
        description="Review the match gaps and tailor your resume manually. Local mode does not generate resume text."
      />

      {rewrites.length === 0 ? (
        <EmptyState
          title="Automatic rewrites are not enabled"
          description="The local matcher reports evidence and gaps but does not invent or rewrite candidate experience."
        />
      ) : (
        <ul className="space-y-4">
          {rewrites.map((rewrite) => (
            <li key={rewrite.original} className="overflow-hidden rounded-xl border border-line bg-surface">
              <div className="grid md:grid-cols-2">
                <div className="bg-sunken p-5">
                  <h3 className="text-xs font-medium text-faint">Original</h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft">{rewrite.original}</p>
                </div>
                <div className="border-t border-line p-5 md:border-l md:border-t-0">
                  <h3 className="text-xs font-medium text-accent">Suggested</h3>
                  <p className="mt-2 text-sm leading-relaxed">{rewrite.suggested}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line py-1.5 pl-5 pr-2">
                <p className="text-[13px] text-soft">{rewrite.impact}</p>
                <CopyButton text={rewrite.suggested} label="Copy suggestion" />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-end border-t border-line pt-6">
        <Button variant="primary" onClick={onContinue}>
          Continue to report
        </Button>
      </div>
    </div>
  );
}
