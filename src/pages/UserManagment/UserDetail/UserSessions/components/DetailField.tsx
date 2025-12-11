import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface DetailFieldProps {
  label: string;
  value?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  valueClassName?: string;
}

export default function DetailField({
  label,
  value,
  isLoading = false,
  className,
  valueClassName,
}: DetailFieldProps) {
  if (isLoading) {
    return (
      <div className={className}>
        <Skeleton className="h-4 w-20" />
        <Skeleton className={cn('mt-1 h-4 w-24', valueClassName)} />
      </div>
    );
  }

  if (!value) {
    return null;
  }

  return (
    <div className={className}>
      <span className="text-muted-foreground font-medium">{label}</span>
      {valueClassName ? (
        <div className={cn(valueClassName)}>{value}</div>
      ) : (
        <div className={cn('mt-1', valueClassName)}>{value}</div>
      )}
    </div>
  );
}
