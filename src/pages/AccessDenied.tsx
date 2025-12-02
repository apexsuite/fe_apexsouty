import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import CustomButton from '@/components/CustomButton';
import { t } from 'i18next';

const AccessDenied: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Empty>
        <EmptyHeader className="max-w-md">
          <EmptyMedia variant="icon">
            <AlertTriangle />
          </EmptyMedia>
          <EmptyTitle>{t('accessDenied.title')}</EmptyTitle>
          <EmptyDescription>{t('accessDenied.description')}</EmptyDescription>
          <EmptyDescription>
            <code className="bg-muted rounded px-2 py-px text-xs font-medium">
              {location.state?.attemptedPath ?? location.pathname}
            </code>
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CustomButton
            icon={<Home />}
            onClick={() => navigate('/dashboard')}
            label={t('accessDenied.goHome')}
          />
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default AccessDenied;
