import { Check, Copy } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';
import { Button } from './Button';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const { copied, copy } = useClipboard();

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-live="polite"
      icon={copied ? <Check className="size-3.5 text-good" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      onClick={() => copy(text)}
    >
      {copied ? 'Copied' : label}
    </Button>
  );
}
