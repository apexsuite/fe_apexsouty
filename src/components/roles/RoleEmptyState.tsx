import React from 'react';
import { Empty, Button } from 'antd';
import { Shield, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RoleEmptyStateProps {
  onCreateRole: () => void;
}

const RoleEmptyState: React.FC<RoleEmptyStateProps> = ({ onCreateRole }) => {
  const { t } = useTranslation();

  return (
    <Empty
      image={<Shield size={64} className="text-gray-400 dark:text-gray-500" />}
      description={
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('roles.noRoles') || 'No roles found'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {t('roles.getStartedByCreating') || 'Get started by creating a new role.'}
          </p>
          <Button
            type="primary"
            size="large"
            icon={<Plus size={16} />}
            onClick={onCreateRole}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
          >
            {t('roles.createRole') || 'Create Role'}
          </Button>
        </div>
      }
      className="py-12 dark:text-gray-300"
    />
  );
};

export default RoleEmptyState; 