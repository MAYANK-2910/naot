import type { ScoreBreakdown } from '@/types';

export const BREAKDOWN_ROWS: { key: keyof ScoreBreakdown; label: string; hint: string }[] = [
  { key: 'skills', label: 'Skills alignment', hint: 'Required skills found in the resume' },
  { key: 'experience', label: 'Experience fit', hint: 'Seniority and years against the role' },
  { key: 'education', label: 'Education and credentials', hint: 'Degrees and certifications the role asks for' },
  { key: 'ats', label: 'ATS readability', hint: 'How cleanly automated parsers can read the file' },
];
