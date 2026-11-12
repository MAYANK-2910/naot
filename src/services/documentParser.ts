import type { ResumeDocument } from '@/types';

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS: readonly string[] = ['pdf', 'docx'];

export const ACCEPT_ATTRIBUTE = '.pdf,.docx';

/**
 * Validates an uploaded file and extracts its text using the local backend.
 */
export async function extractResume(file: File): Promise<ResumeDocument> {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    throw new Error('Upload a PDF or Word document (.pdf or .docx). Legacy .doc files are not supported.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('That file is larger than 10 MB. Export a smaller copy and try again.');
  }

  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/v1/extract-text', { method: 'POST', body: formData });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const body =
      typeof payload === 'object' && payload !== null ? (payload as Record<string, unknown>) : null;
    throw new Error(
      typeof body?.detail === 'string' ? body.detail : `Document extraction failed (${response.status}).`,
    );
  }
  const body =
    typeof payload === 'object' && payload !== null ? (payload as Record<string, unknown>) : null;
  if (typeof body?.text !== 'string' || !body.text.trim()) {
    throw new Error('The document service returned no readable text.');
  }
  return {
    name: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim(),
    fileName: file.name,
    fileKind: extension === 'pdf' ? 'pdf' : 'docx',
    text: body.text,
    isUpload: true,
  };
}
