import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Plus, FileText } from 'lucide-react';
import { Button, Card } from 'antd';
import PermissionGuard from '@/components/PermissionGuard';

const ConsentEmptyState: React.FC = () => {
  const { t } = useTranslation();
  const theme = useSelector((state: RootState) => state.theme.theme);

  return (
    <Card 
      className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'} text-center`}
      style={{ 
        border: '2px dashed',
        borderColor: theme === 'dark' ? '#374151' : '#d1d5db',
        borderRadius: '12px',
        padding: '48px 24px'
      }}
    >
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div 
            className={`p-4 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
          >
            <FileText 
              size={48} 
              className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} 
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('consents.emptyState.title')}
          </h3>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
            {t('consents.emptyState.description')}
          </p>
        </div>

        {/* Action Button */}
        <PermissionGuard permission="create-consent" mode="hide">
          <Button
            type="primary"
            size="large"
            icon={<Plus size={20} />}
            className="px-8 py-2 h-auto"
          >
            {t('consents.create')}
          </Button>
        </PermissionGuard>
      </div>
    </Card>
  );
};

export default ConsentEmptyState;
