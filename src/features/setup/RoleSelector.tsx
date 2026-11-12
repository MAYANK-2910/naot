import { Field, INPUT_CLASS, TEXTAREA_CLASS } from '@/components/ui/Field';

interface RoleSelectorProps {
  title: string;
  text: string;
  onTitleChange: (title: string) => void;
  onTextChange: (text: string) => void;
}

export function RoleSelector({ title, text, onTitleChange, onTextChange }: RoleSelectorProps) {
  return (
    <section aria-labelledby="role-heading" className="space-y-5">
      <div>
        <h2 id="role-heading" className="text-base font-semibold">
          Role
        </h2>
        <p className="mt-0.5 text-sm text-soft">Enter the role title and paste its job description.</p>
      </div>

      <Field id="role-title" label="Role title">
        <input
          id="role-title"
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="e.g. Senior Product Manager"
          className={INPUT_CLASS}
        />
      </Field>

      <Field id="job-description" label="Job description">
        <textarea
          id="job-description"
          rows={12}
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Paste the full job description here"
          className={TEXTAREA_CLASS}
        />
      </Field>
    </section>
  );
}
