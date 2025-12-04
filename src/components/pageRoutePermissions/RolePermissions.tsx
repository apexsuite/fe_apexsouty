import React from 'react';
import { Permission } from '@/lib/pageRoutePermissionSlice';
import { useTranslation } from 'react-i18next';

interface RolePermissionsProps {
  permission: Permission;
  theme: string;
}

const RolePermissions: React.FC<RolePermissionsProps> = ({
  permission,
  theme,
}) => {
  const { t } = useTranslation();

  if (!permission.rolePermission || permission.rolePermission.length === 0)
    return null;

  return (
    <div
      className={`mb-6 rounded-lg p-6 shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
    >
      <h2
        className={`mb-4 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
      >
        {t('pages.pageRoutePermissions.pageRouteAssignments.title')} (
        {permission.rolePermission.length})
      </h2>

      <div className="space-y-4">
        {permission.rolePermission.map(rolePerm => (
          <div
            key={rolePerm.id}
            className={`rounded-lg border p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t(
                    'pages.pageRoutePermissions.pageRouteAssignments.roleName'
                  )}
                </label>
                <p
                  className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}
                >
                  {rolePerm.role.name}
                </p>
              </div>

              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t(
                    'pages.pageRoutePermissions.pageRouteAssignments.roleValue'
                  )}
                </label>
                <p
                  className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} rounded-lg px-3 py-2 font-mono text-sm`}
                >
                  {rolePerm.role.roleValue}
                </p>
              </div>

              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {t('pages.pageRoutePermissions.pageRouteAssignments.status')}
                </label>
                <p
                  className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      rolePerm.role.isActive
                        ? theme === 'dark'
                          ? 'bg-green-900/20 text-green-400'
                          : 'bg-green-100 text-green-800'
                        : theme === 'dark'
                          ? 'bg-red-900/20 text-red-400'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {rolePerm.role.isActive
                      ? t(
                          'pages.pageRoutePermissions.pageRouteAssignments.status1.active'
                        )
                      : t(
                          'pages.pageRoutePermissions.pageRouteAssignments.status1.inactive'
                        )}
                  </span>
                </p>
              </div>

              {rolePerm.role.description && (
                <div className="md:col-span-2">
                  <label
                    className={`mb-1 block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t(
                      'pages.pageRoutePermissions.pageRouteAssignments.roleDescription'
                    )}
                  </label>
                  <p
                    className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'} rounded-lg px-3 py-2`}
                  >
                    {rolePerm.role.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolePermissions;
