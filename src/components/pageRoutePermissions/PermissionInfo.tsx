import React from 'react';
import { useTranslation } from 'react-i18next';
import { Permission } from '@/lib/pageRoutePermissionSlice';

interface PermissionInfoProps {
  permission: Permission;
  theme: string;
}

const PermissionInfo: React.FC<PermissionInfoProps> = ({ permission, theme }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`rounded-lg shadow-sm p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {t('pages.pageRoutePermissions.permissionDetails')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('pages.pageRoutePermissions.name')}
          </label>
          <p className={`${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-50'} px-3 py-2 rounded-lg font-mono text-sm`}>
            {permission.name}
          </p>
        </div>

        {permission.description && (
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('pages.pageRoutePermissions.description')}
            </label>
            <p className={`${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-50'} px-3 py-2 rounded-lg`}>
              {permission.description}
            </p>
          </div>
        )}

        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('pages.pageRoutePermissions.label')}
          </label>
          <p className={`${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-50'} px-3 py-2 rounded-lg font-mono text-sm`}>
            {permission.label}
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {t('pages.createdAt')}
          </label>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formatDate(permission.createdAt)}
          </p>
        </div>


     
      </div>
    </div>
  );
};

export default PermissionInfo; 