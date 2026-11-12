import type { ResumeDocument, SampleResume } from '@/types';

export function toResumeDocument(sample: SampleResume): ResumeDocument {
  return {
    sampleId: sample.id,
    name: sample.candidateName,
    fileName: sample.fileName,
    fileKind: sample.fileKind,
    text: sample.text,
    isUpload: false,
  };
}
