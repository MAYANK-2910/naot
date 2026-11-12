import type { AnalysisRequest, AnalysisResult } from '@/types';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isAnalysisPayload(value: unknown): value is AnalysisResult {
  if (typeof value !== 'object' || value === null) return false;
  const result = value as Record<string, unknown>;
  const breakdown = result.breakdown;

  return (
    typeof result.overallScore === 'number' &&
    typeof result.verdict === 'string' &&
    typeof breakdown === 'object' &&
    breakdown !== null &&
    ['skills', 'experience', 'education', 'ats'].every(
      (key) => typeof (breakdown as Record<string, unknown>)[key] === 'number',
    ) &&
    isStringArray(result.matchedKeywords) &&
    isStringArray(result.missingKeywords) &&
    isStringArray(result.strengths) &&
    isStringArray(result.gaps) &&
    Array.isArray(result.rewrites) &&
    result.rewrites.every(
      (rewrite) =>
        typeof rewrite === 'object' &&
        rewrite !== null &&
        typeof (rewrite as Record<string, unknown>).original === 'string' &&
        typeof (rewrite as Record<string, unknown>).suggested === 'string' &&
        typeof (rewrite as Record<string, unknown>).impact === 'string',
    )
  );
}

/**
 * Scores a resume against a job description using the local FastAPI matcher.
 */
export async function analyzeMatch(request: AnalysisRequest): Promise<AnalysisResult> {
  const response = await fetch('/api/v1/analyze-match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job_title: request.jobTitle,
      job_description: request.jobText,
      resume_text: request.resume.text,
    }),
  });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const detail =
      typeof body === 'object' && body !== null && typeof (body as Record<string, unknown>).detail === 'string'
        ? (body as Record<string, string>).detail
        : `Analysis request failed (${response.status}).`;
    throw new Error(detail);
  }

  const payload: unknown = await response.json();
  if (!isAnalysisPayload(payload)) {
    throw new Error('The analysis service returned an unexpected response.');
  }

  return payload;
}
