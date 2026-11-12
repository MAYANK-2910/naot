import { PageHeading } from '@/components/ui/PageHeading';
import { Section } from '@/components/ui/Section';
export function DeveloperPage() {
  return (
    <div className="space-y-8">
      <PageHeading
        title="Developer"
        description="The app uses a local Python service for document text extraction and explainable resume matching."
      />

      <Section title="Local matching" description="No hosted model, API key, or external service is used.">
        <p className="text-sm leading-6 text-soft">
          The matcher checks job-description terms against the resume using a curated skills dictionary, then
          calculates skills, experience, education, and resume-structure scores. It returns evidence-based
          keyword matches and gaps; it does not generate or invent resume bullet rewrites.
        </p>
      </Section>

      <Section title="Document parsing" description="Files are sent only to this app's local Python service.">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium">PDF <span className="font-mono text-[13px] font-normal text-soft">PyMuPDF</span></dt>
            <dd className="mt-1 text-sm text-soft">Extracts selectable text. Scanned PDFs require OCR and are not supported yet.</dd>
          </div>
          <div>
            <dt className="text-sm font-medium">DOCX <span className="font-mono text-[13px] font-normal text-soft">python-docx</span></dt>
            <dd className="mt-1 text-sm text-soft">Reads paragraph and table text. Legacy .doc files are not supported.</dd>
          </div>
        </dl>
      </Section>

      <Section title="API endpoints">
        <ul className="space-y-2 font-mono text-sm text-soft">
          <li>GET /health</li>
          <li>POST /api/v1/extract-text</li>
          <li>POST /api/v1/analyze-match</li>
        </ul>
      </Section>
    </div>
  );
}
