import { Button } from '@/components/ui/Button';
import { PageHeading } from '@/components/ui/PageHeading';
import type { Screener } from '@/hooks/useScreener';
import { ResumeUpload } from './ResumeUpload';
import { RoleSelector } from './RoleSelector';

export function SetupPage({ screener }: { screener: Screener }) {
  const canRun = screener.jobText.trim().length > 0 && !screener.isReadingFile;

  return (
    <div>
      <PageHeading
        title="Screen a candidate"
        description="Choose the role, add the resume, then run the analysis to see how well they fit."
      />

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <RoleSelector
          selectedId={screener.jobId}
          text={screener.jobText}
          onSelect={screener.selectJob}
          onTextChange={screener.editJobText}
        />
        <ResumeUpload
          resume={screener.resume}
          isReading={screener.isReadingFile}
          error={screener.uploadError}
          onFile={screener.uploadResume}
          onSelectSample={screener.selectSample}
        />
      </div>

      <div className="no-print sticky bottom-0 -mx-4 mt-10 border-t border-line bg-canvas/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        {screener.analysisError && (
          <p role="alert" className="mb-3 text-sm text-bad">
            {screener.analysisError}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-soft">
            {canRun ? (
              <>
                <span className="font-medium text-ink">{screener.resume.name}</span> for{' '}
                <span className="font-medium text-ink">{screener.jobTitle}</span>
              </>
            ) : (
              'Add a job description to continue.'
            )}
          </p>
          <Button variant="primary" disabled={!canRun} loading={screener.isAnalyzing} onClick={screener.runAnalysis}>
            {screener.isAnalyzing ? 'Analyzing' : 'Analyze match'}
          </Button>
        </div>
      </div>
    </div>
  );
}
