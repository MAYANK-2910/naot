import { useCallback, useState } from 'react';
import { extractResume } from '@/services/documentParser';
import { analyzeMatch } from '@/services/screeningApi';
import type { AnalysisRequest, AnalysisResult, ResumeDocument, Step } from '@/types';

interface CompletedAnalysis {
  request: AnalysisRequest;
  result: AnalysisResult;
}

/** All screening state and actions in one place. Components stay presentational. */
export function useScreener() {
  const [step, setStep] = useState<Step>('setup');

  const [jobTitle, setJobTitle] = useState('');
  const [jobText, setJobText] = useState('');

  const [resume, setResume] = useState<ResumeDocument>({
    name: '',
    fileName: '',
    fileKind: 'pdf',
    text: '',
    isUpload: false,
  });
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<CompletedAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const editJobTitle = useCallback((title: string) => setJobTitle(title), []);

  const editJobText = useCallback((text: string) => setJobText(text), []);

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
    const request: AnalysisRequest = { jobTitle, jobText, resume };
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
  }, [jobTitle, jobText, resume]);

  /** True when the role or resume changed after the last analysis ran. */
  const isStale =
    analysis !== null &&
    (analysis.request.jobTitle !== jobTitle ||
      analysis.request.jobText !== jobText ||
      analysis.request.resume.text !== resume.text ||
      analysis.request.resume.fileName !== resume.fileName);

  return {
    step,
    setStep,
    jobTitle,
    jobText,
    resume,
    isReadingFile,
    uploadError,
    analysis,
    isAnalyzing,
    analysisError,
    isStale,
    editJobTitle,
    editJobText,
    uploadResume,
    runAnalysis,
  };
}

export type Screener = ReturnType<typeof useScreener>;
