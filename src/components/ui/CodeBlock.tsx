import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  filename: string;
  code: string;
}

export function CodeBlock({ filename, code }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line py-1.5 pl-4 pr-2">
        <span className="font-mono text-xs text-soft">{filename}</span>
        <CopyButton text={code} label="Copy code" />
      </div>
      <pre
        tabIndex={0}
        className="max-h-[28rem] overflow-auto p-4 font-mono text-[13px] leading-relaxed"
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
