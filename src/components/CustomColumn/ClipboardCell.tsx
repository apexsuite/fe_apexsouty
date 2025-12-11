import { useState, useEffect } from 'react';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { Copy, Check } from 'lucide-react';
import CustomButton from '@/components/CustomButton';
import { toastManager } from '@/components/ui/toast';

interface ClipboardCellProps {
  value: string | number | null | undefined;
  children: React.ReactNode;
}

export default function ClipboardCell({ value, children }: ClipboardCellProps) {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [hasCopied, setHasCopied] = useState(false);
  const stringValue = value != null ? String(value) : '';

  useEffect(() => {
    if (copiedText === stringValue && stringValue) {
      setHasCopied(true);
      toastManager.add({
        title: 'Copied to clipboard',
        type: 'success',
      });
      const timer = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedText, stringValue]);

  const handleCopy = () => {
    if (value != null) {
      copyToClipboard(stringValue);
    }
  };

  return (
    <div className="group flex cursor-pointer items-center gap-2">
      {children}
      {value != null && (
        <CustomButton
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          tooltip={hasCopied ? 'Copied!' : 'Copy to clipboard'}
          icon={
            hasCopied ? (
              <Check className="text-success size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )
          }
          className="opacity-0 transition-opacity group-hover:opacity-100"
        />
      )}
    </div>
  );
}
