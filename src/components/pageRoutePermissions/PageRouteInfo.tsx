import React from 'react';
import { Permission } from '@/lib/pageRoutePermissionSlice';

interface PageRouteInfoProps {
  permission: Permission;
  theme: string;
}

const PageRouteInfo: React.FC<PageRouteInfoProps> = ({ permission, theme }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!permission.pageRoute) return null;

  return (
    <div className={`rounded-lg shadow-sm p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Page Route Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Name
          </label>
          <p className={`${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-50'} px-3 py-2 rounded-lg`}>
            {permission.pageRoute.name}
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Path
          </label>
          <p className={`${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-50'} px-3 py-2 rounded-lg font-mono text-sm`}>
            {permission.pageRoute.path}
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Component
          </label>
          <p className={`${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-50'} px-3 py-2 rounded-lg font-mono text-sm`}>
            {permission.pageRoute.component}
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Icon
          </label>
          <p className={`${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-50'} px-3 py-2 rounded-lg font-mono text-sm`}>
            {permission.pageRoute.icon}
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Status
          </label>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              permission.pageRoute.is_active 
                ? theme === 'dark' ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'
                : theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'
            }`}>
              {permission.pageRoute.is_active ? 'Active' : 'Inactive'}
            </span>
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Visible
          </label>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              permission.pageRoute.is_visible 
                ? theme === 'dark' ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800'
                : theme === 'dark' ? 'bg-gray-900/20 text-gray-400' : 'bg-gray-100 text-gray-800'
            }`}>
              {permission.pageRoute.is_visible ? 'Visible' : 'Hidden'}
            </span>
          </p>
        </div>

        {permission.pageRoute.description && (
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <p className={`${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-50'} px-3 py-2 rounded-lg`}>
              {permission.pageRoute.description}
            </p>
          </div>
        )}

        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Page Route ID
          </label>
          <p className={`${theme === 'dark' ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-50'} px-3 py-2 rounded-lg font-mono text-sm`}>
            {permission.pageRoute.id}
          </p>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Created At
          </label>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formatDate(permission.pageRoute.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageRouteInfo; 