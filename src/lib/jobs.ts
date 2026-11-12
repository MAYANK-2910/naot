import { JOB_DESCRIPTIONS } from '@/data/jobDescriptions';

/** Preset title, or the "Job Title:" line of a pasted description. */
export function getJobTitle(jobId: string, jobText: string): string {
  const preset = JOB_DESCRIPTIONS.find((job) => job.id === jobId);
  if (preset) return preset.title;
  const match = jobText.match(/^job title:\s*(.+)$/im);
  return match?.[1].trim() || 'Custom role';
}
