import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { fetchMyPermissions } from './permissionSlice';

export const usePermissions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const permissions = useSelector((state: RootState) => state.userPermissions.permissions);
  const loading = useSelector((state: RootState) => state.userPermissions.loading);

  const hasPermission = (permissionName: string): boolean => {
    if (Array.isArray(permissions) && permissions.length > 0) {
      if (typeof permissions[0] === 'string') {
        return (permissions as string[]).includes(permissionName);
      } else {
        return (permissions as any[]).some(p => p.name === permissionName);
      }
    }
    return false;
  };

  const hasPermissionForPath = (path: string): boolean => {
    if (Array.isArray(permissions) && permissions.length > 0) {
      if (typeof permissions[0] === 'string') {
        const pathMap: Record<string, string> = {
          '/products': 'get-product-list',
          '/products/create': 'create-product',
          '/products/edit': 'update-product',
          '/products/delete': 'delete-product',
          '/roles': 'get-role-list',
          '/roles/create': 'create-role',
          '/roles/edit': 'update-role',
          '/roles/delete': 'delete-role',
          '/permissions': 'get-permission-list',
          '/permissions/create': 'create-permission',
          '/permissions/edit': 'update-permission',
          '/permissions/delete': 'delete-permission',
          '/marketplaces': 'get-marketplace-list',
          '/marketplaces/create': 'create-marketplace',
          '/marketplaces/edit': 'update-marketplace',
          '/marketplaces/delete': 'delete-marketplace',
        };
        const permissionName = pathMap[path] || path.replace(/\//g, '-').substring(1);
        return (permissions as string[]).includes(permissionName);
      } else {
        return (permissions as any[]).some(p => p.path === path || path.startsWith(p.path));
      }
    }
    return false;
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    if (Array.isArray(permissions) && permissions.length > 0) {
      if (typeof permissions[0] === 'string') {
        return permissionNames.some(name => (permissions as string[]).includes(name));
      } else {
        return permissionNames.some(name => (permissions as any[]).some(p => p.name === name));
      }
    }
    return false;
  };

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    if (Array.isArray(permissions) && permissions.length > 0) {
      if (typeof permissions[0] === 'string') {
        return permissionNames.every(name => (permissions as string[]).includes(name));
      } else {
        return permissionNames.every(name => (permissions as any[]).some(p => p.name === name));
      }
    }
    return false;
  };

  const getResourcePermissions = (resource: string) => {
    if (Array.isArray(permissions) && permissions.length > 0) {
      if (typeof permissions[0] === 'string') {
        return (permissions as string[]).filter(permission => 
          permission.includes(resource) || permission.includes(resource.replace('-', ''))
        );
      } else {
        return (permissions as any[])
          .filter(p => p.path?.includes(`/${resource}`) || p.resource === resource)
          .map(p => p.name);
      }
    }
    return [];
  };

  const refreshPermissions = () => {
    dispatch(fetchMyPermissions());
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasPermissionForPath,
    hasAnyPermission,
    hasAllPermissions,
    getResourcePermissions,
    refreshPermissions,
  };
};

export const useResourcePermissions = (resource: string) => {
  const { hasPermission, getResourcePermissions } = usePermissions();
  
  const resourcePermissions = getResourcePermissions(resource);
  
  const resourcePermissionMap: Record<string, { create: string; read: string; update: string; delete: string }> = {
    'products': {
      create: 'create-product',
      read: 'get-product-list',
      update: 'update-product',
      delete: 'delete-product'
    },
    'roles': {
      create: 'create-role',
      read: 'get-role-list',
      update: 'update-role',
      delete: 'delete-role'
    },
    'permissions': {
      create: 'create-permission',
      read: 'get-permission-list',
      update: 'update-permission',
      delete: 'delete-permission'
    },
    'marketplaces': {
      create: 'create-marketplace',
      read: 'get-marketplace-list',
      update: 'update-marketplace',
      delete: 'delete-marketplace'
    }
  };
  
  const permissionMap = resourcePermissionMap[resource] || {
    create: `create-${resource}`,
    read: `get-${resource}-list`,
    update: `update-${resource}`,
    delete: `delete-${resource}`
  };
  
  const canCreate = hasPermission(permissionMap.create);
  const canRead = hasPermission(permissionMap.read);
  const canUpdate = hasPermission(permissionMap.update);
  const canDelete = hasPermission(permissionMap.delete);

  return {
    permissions: resourcePermissions,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canManage: canCreate || canUpdate || canDelete,
  };
};

export const useButtonPermissions = () => {
  const { hasPermission, hasPermissionForPath } = usePermissions();

  const canShowButton = (permissionName: string, path?: string): boolean => {
    if (path) {
      return hasPermissionForPath(path);
    }
    return hasPermission(permissionName);
  };

  return {
    canShowButton,
    hasPermission,
    hasPermissionForPath,
  };
};
