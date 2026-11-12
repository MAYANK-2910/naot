import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { FileText, Loader2, Upload } from 'lucide-react';
import { Chip } from '@/components/ui/Chip';
import { RadioDot } from '@/components/ui/RadioDot';
import { SAMPLE_RESUMES } from '@/data/sampleResumes';
import { ACCEPT_ATTRIBUTE } from '@/services/documentParser';
import type { ResumeDocument } from '@/types';

interface ResumeUploadProps {
  resume: ResumeDocument;
  isReading: boolean;
  error: string | null;
  onFile: (file: File) => void;
  onSelectSample: (id: string) => void;
}

export function ResumeUpload({ resume, isReading, error, onFile, onSelectSample }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFile(file);
    event.target.value = ''; // allow choosing the same file again
  };

  return (
    <section aria-labelledby="resume-heading" className="space-y-5">
      <div>
        <h2 id="resume-heading" className="text-base font-semibold">
          Candidate resume
        </h2>
        <p className="mt-0.5 text-sm text-soft">Upload a text-based PDF or DOCX file, or try a sample candidate.</p>
      </div>

      <div>
        <button
          type="button"
          disabled={isReading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex w-full flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors ${
            isDragging ? 'border-accent bg-sunken' : 'border-strong hover:bg-sunken/60'
          }`}
        >
          {isReading ? (
            <>
              <Loader2 className="size-5 animate-spin text-soft" aria-hidden="true" />
              <span className="text-sm font-medium">Reading document</span>
            </>
          ) : (
            <>
              <Upload className="size-5 text-soft" aria-hidden="true" />
              <span className="text-sm font-medium">Drop a resume here, or browse files</span>
              <span className="text-[13px] text-soft">PDF or DOCX, up to 10 MB</span>
            </>
          )}
        </button>
        <input ref={inputRef} type="file" accept={ACCEPT_ATTRIBUTE} onChange={handleInputChange} className="hidden" />
        {error && (
          <p role="alert" className="mt-2 text-sm text-bad">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sunken text-soft">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{resume.fileName}</p>
          <p className="truncate text-[13px] text-soft">{resume.name}</p>
        </div>
        <Chip>{resume.isUpload ? `Uploaded ${resume.fileKind.toUpperCase()}` : resume.fileKind.toUpperCase()}</Chip>
      </div>

      <div>
        <h3 id="samples-heading" className="mb-2 text-sm font-medium">
          Sample candidates
        </h3>
        <div
          role="radiogroup"
          aria-labelledby="samples-heading"
          className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface"
        >
          {SAMPLE_RESUMES.map((sample) => {
            const selected = resume.sampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelectSample(sample.id)}
                className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors -outline-offset-2 ${
                  selected ? 'bg-sunken' : 'hover:bg-sunken/60'
                }`}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{sample.candidateName}</span>
                  <span className="block text-[13px] text-soft">{sample.targetRole}</span>
                </span>
                <RadioDot selected={selected} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
