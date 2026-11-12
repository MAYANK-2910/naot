import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/Notice';
import { Section } from '@/components/ui/Section';
import type { AnalysisResult } from '@/types';
import { BreakdownList } from './BreakdownList';
import { KeywordGroups } from './KeywordGroups';
import { ScoreSummary } from './ScoreSummary';
import { StrengthsAndGaps } from './StrengthsAndGaps';

interface AnalysisPageProps {
  result: AnalysisResult;
  candidateName: string;
  jobTitle: string;
  isStale: boolean;
  isAnalyzing: boolean;
  onRerun: () => void;
  onContinue: () => void;
}

export function AnalysisPage({
  result,
  candidateName,
  jobTitle,
  isStale,
  isAnalyzing,
  onRerun,
  onContinue,
}: AnalysisPageProps) {
  return (
    <div className="space-y-8">
      {isStale && (
        <Notice
          tone="warn"
          action={
            <Button size="sm" loading={isAnalyzing} onClick={onRerun}>
              Re-run analysis
            </Button>
          }
        >
          The role or resume changed after this analysis ran.
        </Notice>
      )}

      <ScoreSummary
        score={result.overallScore}
        verdict={result.verdict}
        candidateName={candidateName}
        jobTitle={jobTitle}
      />

      <Section title="Score breakdown">
        <BreakdownList breakdown={result.breakdown} />
      </Section>

      <Section title="Keywords" description="Skills and terms the job description asks for, checked against the resume.">
        <KeywordGroups matched={result.matchedKeywords} missing={result.missingKeywords} />
      </Section>

      <Section title="Strengths and gaps">
        <StrengthsAndGaps strengths={result.strengths} gaps={result.gaps} />
      </Section>

      <div className="flex justify-end border-t border-line pt-6">
        <Button variant="primary" onClick={onContinue}>
          Continue to tailoring
        </Button>
      </div>
    </div>
  );
}
