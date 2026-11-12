import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHeading } from '@/components/ui/PageHeading';
import { BREAKDOWN_ROWS } from '@/lib/breakdown';
import { scoreLabel } from '@/lib/score';
import type { AnalysisResult } from '@/types';

interface ReportPageProps {
  result: AnalysisResult;
  candidateName: string;
  fileName: string;
  jobTitle: string;
}

function ReportList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function ReportPage({ result, candidateName, fileName, jobTitle }: ReportPageProps) {
  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8">
      <div className="no-print">
        <PageHeading
          title="Report"
          description="A one-page summary for the hiring panel. Print it or save it as a PDF."
          actions={
            <Button variant="primary" icon={<Printer className="size-4" aria-hidden="true" />} onClick={() => window.print()}>
              Print or save as PDF
            </Button>
          }
        />
      </div>

      {/* `paper` keeps the light palette so the printout is readable in dark mode. */}
      <article className="paper print-sheet mx-auto max-w-3xl rounded-xl border border-line bg-surface p-8 text-ink shadow-sm sm:p-12">
        <header className="flex items-start justify-between gap-6 border-b border-line pb-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Candidate screening report</h2>
            <p className="mt-1 text-sm text-soft">{jobTitle}</p>
            <p className="text-sm text-soft">{today}</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-semibold leading-none tabular-nums">{result.overallScore}</p>
            <p className="mt-1.5 text-sm text-soft">{scoreLabel(result.overallScore)}</p>
          </div>
        </header>

        <div className="space-y-7 pt-6">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-soft">Candidate</dt>
              <dd className="mt-0.5 font-medium">{candidateName}</dd>
            </div>
            <div>
              <dt className="text-soft">Document</dt>
              <dd className="mt-0.5 font-medium">{fileName}</dd>
            </div>
          </dl>

          <section>
            <h3 className="text-sm font-semibold">Verdict</h3>
            <p className="mt-2 text-sm leading-relaxed">{result.verdict}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold">Score breakdown</h3>
            <table className="mt-2 w-full text-sm">
              <tbody>
                {BREAKDOWN_ROWS.map(({ key, label }) => (
                  <tr key={key} className="border-t border-line">
                    <th scope="row" className="py-2 text-left font-normal text-soft">
                      {label}
                    </th>
                    <td className="py-2 text-right font-medium tabular-nums">{result.breakdown[key]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <ReportList title="Strengths" items={result.strengths} />
          <ReportList title="Gaps to probe" items={result.gaps} />
        </div>
      </article>
    </div>
  );
}
