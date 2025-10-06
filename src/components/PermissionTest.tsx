import React from 'react';
import { usePermissions } from '@/lib/usePermissions';

/**
 * Permission sistemi test component'i
 * API'ye istek atıp dönen veriyi gösterir
 */
const PermissionTest: React.FC = () => {
  const { permissions, loading, refreshPermissions } = usePermissions();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-2">Loading permissions...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Permission System Test</h1>
      

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">API Response:</h2>
        <pre className="text-sm overflow-auto bg-white p-3 rounded border">
          {JSON.stringify(permissions, null, 2)}
        </pre>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Permission Count: {permissions.length}</h2>
        
        {permissions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permissions.map((permission, index) => (
              <div key={index} className="bg-white p-4 rounded border">
                <h3 className="font-medium">{permission.name}</h3>
                <p className="text-sm text-gray-600">Path: {permission.path}</p>
                {permission.description && (
                  <p className="text-sm text-gray-500 mt-1">{permission.description}</p>
                )}
                {permission.action && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                    {permission.action}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={refreshPermissions}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh Permissions
        </button>
      </div>
    </div>
  );
};

export default PermissionTest;
