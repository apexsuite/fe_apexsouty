import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  XCircle,
  Hourglass,
  Shield,
  ShieldBan,
} from 'lucide-react';

const STATUS_MAP = {
  active: { variant: 'success', icon: CheckCircle2, label: 'Active' },
  inactive: { variant: 'error', icon: XCircle, label: 'Inactive' },
  pending: { variant: 'warning', icon: Hourglass, label: 'Pending' },
  default: { variant: 'info', icon: Shield, label: 'Default' },
  not_default: { variant: 'warning', icon: ShieldBan, label: 'Not Default' },
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
            <CheckCircle2 className="size-3" />
            Active
          </>
        ) : (
          <>
            <XCircle className="size-3" />
            Inactive
          </>
        )}
      </Badge>
    );
  }

  if (status && Object.keys(STATUS_MAP).includes(status)) {
    const config = STATUS_MAP[status as StatusVariant];

    return (
      <Badge variant={config.variant} className="gap-1 p-0.5">
        {config.icon && <config.icon className="size-3" />}
        {config.label}
      </Badge>
    );
  }

  return null;
};

export default StatusBadge;
