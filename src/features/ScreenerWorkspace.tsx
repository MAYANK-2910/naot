import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Screener } from '@/hooks/useScreener';
import { AnalysisPage } from './analysis/AnalysisPage';
import { ReportPage } from './report/ReportPage';
import { SetupPage } from './setup/SetupPage';
import { TailoringPage } from './tailoring/TailoringPage';

/** Chooses which step to show. Result pages read from the request that was analyzed, not the live form. */
export function ScreenerWorkspace({ screener }: { screener: Screener }) {
  const { step, setStep, analysis } = screener;

  if (step === 'setup') return <SetupPage screener={screener} />;

  if (!analysis) {
    return (
      <EmptyState
        title="No analysis yet"
        description="Choose a role and a resume, then run the analysis to see results here."
        action={
          <Button variant="primary" onClick={() => setStep('setup')}>
            Go to setup
          </Button>
        }
      />
    );
  }

  const { request, result } = analysis;
  const candidateName = request.resume.name;
  const jobTitle = request.jobTitle;

  switch (step) {
    case 'analysis':
      return (
        <AnalysisPage
          result={result}
          candidateName={candidateName}
          jobTitle={jobTitle}
          isStale={screener.isStale}
          isAnalyzing={screener.isAnalyzing}
          onRerun={screener.runAnalysis}
          onContinue={() => setStep('tailoring')}
        />
      );
    case 'tailoring':
      return (
        <TailoringPage
          rewrites={result.rewrites}
          missingKeywords={result.missingKeywords}
          onContinue={() => setStep('report')}
        />
      );
    case 'report':
      return (
        <ReportPage
          result={result}
          candidateName={candidateName}
          fileName={request.resume.fileName}
          jobTitle={jobTitle}
        />
      );
  }
}
