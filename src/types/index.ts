export type Step = 'setup' | 'analysis' | 'tailoring' | 'report';
export type View = 'screener' | 'developer';
export type Theme = 'light' | 'dark';
export type Tone = 'good' | 'warn' | 'bad';
export type FileKind = 'pdf' | 'docx';

/** The candidate resume uploaded for screening. */
export interface ResumeDocument {
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
  jobTitle: string;
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
