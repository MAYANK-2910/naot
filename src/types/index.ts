export type Step = 'setup' | 'analysis' | 'tailoring' | 'report';
export type View = 'screener' | 'developer';
export type Theme = 'light' | 'dark';
export type Tone = 'good' | 'warn' | 'bad';
export type FileKind = 'pdf' | 'docx';

export interface JobDescription {
  id: string;
  title: string;
  department: string;
  location: string;
  requiredSkills: string[];
  text: string;
}

export interface SampleResume {
  id: string;
  candidateName: string;
  targetRole: string;
  fileName: string;
  fileKind: FileKind;
  text: string;
}

/** The resume currently selected for screening, whether a sample or an upload. */
export interface ResumeDocument {
  sampleId?: string;
  name: string;
  fileName: string;
  fileKind: FileKind;
  text: string;
  isUpload: boolean;
}

export interface ScoreBreakdown {
  skills: number;
  experience: number;
  education: number;
  ats: number;
}

export interface BulletRewrite {
  original: string;
  suggested: string;
  impact: string;
}

export interface AnalysisRequest {
  jobId: string;
  jobText: string;
  resume: ResumeDocument;
}

export interface AnalysisResult {
  overallScore: number;
  verdict: string;
  breakdown: ScoreBreakdown;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  gaps: string[];
  rewrites: BulletRewrite[];
}
