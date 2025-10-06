import { apiRequest } from './api';

export interface Permission {
  id?: string;
  name: string;
  path?: string;
  description?: string;
  action?: string; // CREATE, READ, UPDATE, DELETE
  resource?: string; // products, users, roles, etc.
}

export interface MyPermissionsResponse {
  data?: string[] | Permission[];
  success?: boolean;
  message?: string;
  error?: any;
}

export interface PermissionQueryParams {
  name?: string;
  path?: string;
}

export const permissionService = {
  // Get current user's permissions
  async getMyPermissions(params?: PermissionQueryParams): Promise<MyPermissionsResponse> {
    const queryString = params ? 
      '?' + new URLSearchParams(params as any).toString() : '';
    
    const response = await apiRequest(`/permissions/my-permissions${queryString}`, {
      method: 'GET',
    });
    
    return response;
  },

  // Check if user has specific permission
  async hasPermission(permissionName: string): Promise<boolean> {
    try {
      const response = await this.getMyPermissions();
      if (Array.isArray(response.data)) {
        // Handle both string array and object array
        if (response.data.length > 0 && typeof response.data[0] === 'string') {
          return (response.data as string[]).includes(permissionName);
        } else {
          return (response.data as Permission[]).some(p => p.name === permissionName);
        }
      }
      return false;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  },

  // Check if user has permission for specific path
  async hasPermissionForPath(path: string): Promise<boolean> {
    try {
      const response = await this.getMyPermissions();
      if (Array.isArray(response.data)) {
        if (response.data.length > 0 && typeof response.data[0] === 'string') {
          // For string array, we'll need to map path to permission names
          const permissionName = this.mapPathToPermission(path);
          return (response.data as string[]).includes(permissionName);
        } else {
          return (response.data as Permission[]).some(p => p.path === path);
        }
      }
      return false;
    } catch (error) {
      console.error('Permission path check failed:', error);
      return false;
    }
  },

  // Map path to permission name (for string array format)
  mapPathToPermission(path: string): string {
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
    return pathMap[path] || path.replace(/\//g, '-').substring(1);
  },

  // Get permissions for specific resource
  async getResourcePermissions(resource: string): Promise<string[]> {
    try {
      const response = await this.getMyPermissions();
      if (Array.isArray(response.data)) {
        if (response.data.length > 0 && typeof response.data[0] === 'string') {
          // Filter permissions that start with the resource name
          return (response.data as string[]).filter(permission => 
            permission.includes(resource) || permission.includes(resource.replace('-', ''))
          );
        } else {
          return (response.data as Permission[])
            .filter(p => p.path?.includes(`/${resource}`) || p.resource === resource)
            .map(p => p.name);
        }
      }
      return [];
    } catch (error) {
      console.error('Resource permissions fetch failed:', error);
      return [];
    }
  }
};
