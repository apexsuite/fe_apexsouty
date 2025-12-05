import { ArrowLeft, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '@/components/CustomButton';

import StatusBadge, {
  type StatusVariant,
} from '@/components/common/status-badge';

interface DetailPageProps {
  name: string;
  status?: StatusVariant;
  children: React.ReactNode;
  edit: {
    label: string;
    path: string;
  };
}

export const DetailPage = ({
  name,
  status,
  children,
  edit,
}: DetailPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <CustomButton
            icon={<ArrowLeft />}
            onClick={() => navigate(-1)}
            variant="outline"
            size="icon"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
              {status && <StatusBadge status={status} />}
            </div>
          </div>
        </div>
        <CustomButton
          label={edit.label}
          onClick={() => navigate(edit.path)}
          size="lg"
          icon={<Edit />}
        />
      </div>

      {children}
    </div>
  );
};
