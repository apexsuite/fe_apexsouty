import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Hourglass } from 'lucide-react';

const STATUS_MAP = {
  active: { variant: 'success', icon: CheckCircle2, label: 'Active' },
  inactive: { variant: 'error', icon: XCircle, label: 'Inactive' },
  pending: { variant: 'warning', icon: Hourglass, label: 'Pending' },
} as const;

export type StatusVariant = keyof typeof STATUS_MAP;

interface StatusBadgeProps {
  isActive?: boolean;
  status?: StatusVariant;
}

const StatusBadge = ({ isActive, status }: StatusBadgeProps) => {
  if (typeof isActive === 'boolean') {
    return (
      <Badge variant={isActive ? 'success' : 'error'} className="gap-1 p-0.5">
        {isActive ? (
          <>
            <CheckCircle2 className="size-3.5" />
            Active
          </>
        ) : (
          <>
            <XCircle className="size-3.5" />
            Inactive
          </>
        )}
      </Badge>
    );
  }

  if (status) {
    const normalizedStatus = status.toLowerCase();
    const config = STATUS_MAP[normalizedStatus as StatusVariant];

    if (config) {
      const Icon = config.icon;
      return (
        <Badge variant={config.variant} className="gap-1 p-0.5">
          <Icon className="size-3.5" />
          {config.label}
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="p-0.5 capitalize">
        {status}
      </Badge>
    );
  }

  return null;
};

export default StatusBadge;
