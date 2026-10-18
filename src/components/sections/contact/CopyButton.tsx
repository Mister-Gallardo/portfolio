'use client';

import { useEffect, useState } from 'react';
import { CheckIcon, CopyIcon } from '@/components/ui/icons';

type Props = {
  value: string;
  labels: { copy: string; copied: string };
};

const RESET_AFTER_MS = 2000;

export function CopyButton({ value, labels }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), RESET_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard access can be denied; the address stays visible and selectable.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="relative grid size-11 place-items-center rounded-full border border-line text-lg transition-colors duration-300 hover:border-fg"
    >
      {copied ? <CheckIcon className="text-accent" /> : <CopyIcon />}
      <span className="sr-only" aria-live="polite">
        {copied ? labels.copied : labels.copy}
      </span>
    </button>
  );
}
