import React from 'react';
import PermissionButton from '@/components/PermissionButton';
import PermissionGuard from '@/components/PermissionGuard';
import { usePermissions, useResourcePermissions } from '@/lib/usePermissions';

/**
 * Permission sistemi kullanım örnekleri
 * Bu dosya permission-based UI rendering'in nasıl kullanılacağını gösterir
 */
const PermissionExamples: React.FC = () => {
  const { permissions, loading } = usePermissions();
  const productPermissions = useResourcePermissions('products');

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Permission System Examples</h1>

      {/* 1. Basic Permission Button */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Basic Permission Button</h2>
        <div className="flex gap-4">
          <PermissionButton
            permission="product.create"
            variant="primary"
            onClick={() => console.log('Create product')}
          >
            Create Product
          </PermissionButton>

          <PermissionButton
            permission="product.delete"
            variant="danger"
            onClick={() => console.log('Delete product')}
          >
            Delete Product
          </PermissionButton>
        </div>
      </section>

      {/* 2. Permission with Path */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Permission with Path</h2>
        <div className="flex gap-4">
          <PermissionButton
            permission="user.manage"
            permissionPath="/users"
            variant="success"
            onClick={() => console.log('Manage users')}
          >
            Manage Users
          </PermissionButton>

          <PermissionButton
            permission="report.generate"
            permissionPath="/reports"
            variant="warning"
            onClick={() => console.log('Generate report')}
          >
            Generate Report
          </PermissionButton>
        </div>
      </section>

      {/* 3. Permission Guard */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Permission Guard (Hide/Disable)</h2>
        
        {/* Hide mode */}
        <div className="space-y-2">
          <h3 className="font-medium">Hide Mode (default)</h3>
          <PermissionGuard permission="admin.access" mode="hide">
            <button className="px-4 py-2 bg-red-600 text-white rounded">
              Admin Only Button
            </button>
          </PermissionGuard>
        </div>

        {/* Disable mode */}
        <div className="space-y-2">
          <h3 className="font-medium">Disable Mode</h3>
          <PermissionGuard permission="premium.feature" mode="disable">
            <button className="px-4 py-2 bg-purple-600 text-white rounded">
              Premium Feature
            </button>
          </PermissionGuard>
        </div>
      </section>

      {/* 4. Resource-based Permissions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Resource-based Permissions</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">Product Permissions</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-500"></span>
                <span>Can Create: {productPermissions.canCreate ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                <span>Can Read: {productPermissions.canRead ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
                <span>Can Update: {productPermissions.canUpdate ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-500"></span>
                <span>Can Delete: {productPermissions.canDelete ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Action Buttons</h3>
            <div className="space-y-2">
              <PermissionButton
                permission="product.create"
                variant="primary"
                size="sm"
                disabled={!productPermissions.canCreate}
              >
                Create Product
              </PermissionButton>
              
              <PermissionButton
                permission="product.update"
                variant="secondary"
                size="sm"
                disabled={!productPermissions.canUpdate}
              >
                Edit Product
              </PermissionButton>
              
              <PermissionButton
                permission="product.delete"
                variant="danger"
                size="sm"
                disabled={!productPermissions.canDelete}
              >
                Delete Product
              </PermissionButton>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Loading State</h2>
        <PermissionButton
          permission="async.action"
          loading={loading}
          variant="primary"
        >
          Async Action
        </PermissionButton>
      </section>

      {/* 6. Fallback Content */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6. Fallback Content</h2>
        <PermissionButton
          permission="restricted.action"
          fallback={
            <div className="px-4 py-2 bg-gray-300 text-gray-600 rounded">
              No Permission - Contact Admin
            </div>
          }
          variant="primary"
        >
          Restricted Action
        </PermissionButton>
      </section>

      {/* 7. Current Permissions Debug */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">7. Current Permissions (Debug)</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(permissions, null, 2)}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default PermissionExamples;
