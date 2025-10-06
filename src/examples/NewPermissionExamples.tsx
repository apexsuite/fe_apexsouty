import React from 'react';
import PermissionButton from '@/components/PermissionButton';
import PermissionGuard from '@/components/PermissionGuard';
import { usePermissions, useResourcePermissions } from '@/lib/usePermissions';

/**
 * API'den gelen permission array formatına göre örnek kullanımlar
 * API Response: ["create-product", "get-product-list", "update-product", ...]
 */
const NewPermissionExamples: React.FC = () => {
  const { permissions } = usePermissions();
  const productPermissions = useResourcePermissions('products');

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">New Permission System Examples</h1>
      <p className="text-gray-600 mb-6">
        API'den gelen permission array formatına göre buton kontrolü
      </p>

      {/* 1. Direct Permission Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Direct Permission Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <PermissionButton
            permission="create-product"
            variant="primary"
            onClick={() => console.log('Create product')}
          >
            Create Product
          </PermissionButton>

          <PermissionButton
            permission="update-product"
            variant="secondary"
            onClick={() => console.log('Update product')}
          >
            Update Product
          </PermissionButton>

          <PermissionButton
            permission="delete-product"
            variant="danger"
            onClick={() => console.log('Delete product')}
          >
            Delete Product
          </PermissionButton>

          <PermissionButton
            permission="get-product-list"
            variant="success"
            onClick={() => console.log('View products')}
          >
            View Products
          </PermissionButton>
        </div>
      </section>

      {/* 2. Role Management */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Role Management</h2>
        <div className="flex gap-4 flex-wrap">
          <PermissionButton
            permission="create-role"
            variant="primary"
            onClick={() => console.log('Create role')}
          >
            Create Role
          </PermissionButton>

          <PermissionButton
            permission="update-role"
            variant="secondary"
            onClick={() => console.log('Update role')}
          >
            Update Role
          </PermissionButton>

          <PermissionButton
            permission="delete-role"
            variant="danger"
            onClick={() => console.log('Delete role')}
          >
            Delete Role
          </PermissionButton>

          <PermissionButton
            permission="get-role-list"
            variant="success"
            onClick={() => console.log('View roles')}
          >
            View Roles
          </PermissionButton>
        </div>
      </section>

      {/* 3. Permission Management */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Permission Management</h2>
        <div className="flex gap-4 flex-wrap">
          <PermissionButton
            permission="create-permission"
            variant="primary"
            onClick={() => console.log('Create permission')}
          >
            Create Permission
          </PermissionButton>

          <PermissionButton
            permission="update-permission"
            variant="secondary"
            onClick={() => console.log('Update permission')}
          >
            Update Permission
          </PermissionButton>

          <PermissionButton
            permission="delete-permission"
            variant="danger"
            onClick={() => console.log('Delete permission')}
          >
            Delete Permission
          </PermissionButton>

          <PermissionButton
            permission="get-permission-list"
            variant="success"
            onClick={() => console.log('View permissions')}
          >
            View Permissions
          </PermissionButton>
        </div>
      </section>

      {/* 4. Marketplace Management */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Marketplace Management</h2>
        <div className="flex gap-4 flex-wrap">
          <PermissionButton
            permission="create-marketplace"
            variant="primary"
            onClick={() => console.log('Create marketplace')}
          >
            Create Marketplace
          </PermissionButton>

          <PermissionButton
            permission="update-marketplace"
            variant="secondary"
            onClick={() => console.log('Update marketplace')}
          >
            Update Marketplace
          </PermissionButton>

          <PermissionButton
            permission="delete-marketplace"
            variant="danger"
            onClick={() => console.log('Delete marketplace')}
          >
            Delete Marketplace
          </PermissionButton>

          <PermissionButton
            permission="get-marketplace-list"
            variant="success"
            onClick={() => console.log('View marketplaces')}
          >
            View Marketplaces
          </PermissionButton>
        </div>
      </section>

      {/* 5. Resource-based Permissions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Resource-based Permissions (Products)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">Product Permissions</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${productPermissions.canCreate ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>Can Create: {productPermissions.canCreate ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${productPermissions.canRead ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                <span>Can Read: {productPermissions.canRead ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${productPermissions.canUpdate ? 'bg-yellow-500' : 'bg-gray-300'}`}></span>
                <span>Can Update: {productPermissions.canUpdate ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${productPermissions.canDelete ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                <span>Can Delete: {productPermissions.canDelete ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Action Buttons</h3>
            <div className="space-y-2">
              <PermissionButton
                permission="create-product"
                variant="primary"
                size="sm"
                disabled={!productPermissions.canCreate}
              >
                Create Product
              </PermissionButton>
              
              <PermissionButton
                permission="update-product"
                variant="secondary"
                size="sm"
                disabled={!productPermissions.canUpdate}
              >
                Edit Product
              </PermissionButton>
              
              <PermissionButton
                permission="delete-product"
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

      {/* 6. Permission Guard Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6. Permission Guard Examples</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Admin Only Section</h3>
            <PermissionGuard permission="delete-permission" mode="hide">
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800">This is an admin-only section that requires delete-permission</p>
              </div>
            </PermissionGuard>
          </div>

          <div>
            <h3 className="font-medium mb-2">Disabled Section</h3>
            <PermissionGuard permission="create-role" mode="disable">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-blue-800">This section is disabled if you don't have create-role permission</p>
              </div>
            </PermissionGuard>
          </div>
        </div>
      </section>

      {/* 7. Current Permissions Debug */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">7. Current Permissions (Debug)</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Total Permissions: {Array.isArray(permissions) ? permissions.length : 0}</p>
          <pre className="text-sm overflow-auto bg-white p-3 rounded border max-h-64">
            {JSON.stringify(permissions, null, 2)}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default NewPermissionExamples;
