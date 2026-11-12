import { useCallback, useState } from 'react';
import { JOB_DESCRIPTIONS } from '@/data/jobDescriptions';
import { SAMPLE_RESUMES } from '@/data/sampleResumes';
import { getJobTitle } from '@/lib/jobs';
import { toResumeDocument } from '@/lib/resume';
import { extractResume } from '@/services/documentParser';
import { analyzeMatch } from '@/services/screeningApi';
import type { AnalysisRequest, AnalysisResult, ResumeDocument, Step } from '@/types';

const CUSTOM_JOB_ID = 'custom';

interface CompletedAnalysis {
  request: AnalysisRequest;
  result: AnalysisResult;
}

/** All screening state and actions in one place. Components stay presentational. */
export function useScreener() {
  const [step, setStep] = useState<Step>('setup');

  const [jobId, setJobId] = useState(JOB_DESCRIPTIONS[0].id);
  const [jobText, setJobText] = useState(JOB_DESCRIPTIONS[0].text);

  const [resume, setResume] = useState<ResumeDocument>(() => toResumeDocument(SAMPLE_RESUMES[0]));
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<CompletedAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const selectJob = useCallback((id: string) => {
    const job = JOB_DESCRIPTIONS.find((item) => item.id === id);
    if (!job) return;
    setJobId(job.id);
    setJobText(job.text);
  }, []);

  const editJobText = useCallback((text: string) => {
    setJobText(text);
    setJobId(CUSTOM_JOB_ID);
  }, []);

  const selectSample = useCallback((id: string) => {
    const sample = SAMPLE_RESUMES.find((item) => item.id === id);
    if (!sample) return;
    setResume(toResumeDocument(sample));
    setUploadError(null);
  }, []);

  const uploadResume = useCallback(async (file: File) => {
    setUploadError(null);
    setIsReadingFile(true);
    try {
      setResume(await extractResume(file));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Could not read that file. Try another one.');
    } finally {
      setIsReadingFile(false);
    }
  }, []);

  const runAnalysis = useCallback(async () => {
    const request: AnalysisRequest = { jobId, jobText, resume };
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await analyzeMatch(request);
      setAnalysis({ request, result });
      setStep('analysis');
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'The analysis failed. Check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobId, jobText, resume]);

  const jobTitle = getJobTitle(jobId, jobText);

  /** True when the role or resume changed after the last analysis ran. */
  const isStale =
    analysis !== null &&
    (analysis.request.jobText !== jobText ||
      analysis.request.resume.text !== resume.text ||
      analysis.request.resume.fileName !== resume.fileName);

  return {
    step,
    setStep,
    jobId,
    jobText,
    jobTitle,
    resume,
    isReadingFile,
    uploadError,
    analysis,
    isAnalyzing,
    analysisError,
    isStale,
    selectJob,
    editJobText,
    selectSample,
    uploadResume,
    runAnalysis,
  };
}

export type Screener = ReturnType<typeof useScreener>;
