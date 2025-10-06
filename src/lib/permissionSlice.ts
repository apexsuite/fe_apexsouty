import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { permissionService, Permission } from '@/services/permissionService';

interface PermissionState {
  permissions: string[] | Permission[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: PermissionState = {
  permissions: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunk to fetch user permissions
export const fetchMyPermissions = createAsyncThunk(
  'permissions/fetchMyPermissions',
  async (params?: { name?: string; path?: string }) => {
    const response = await permissionService.getMyPermissions(params);
    return response.data || [];
  }
);

// Async thunk to check specific permission
export const checkPermission = createAsyncThunk(
  'permissions/checkPermission',
  async (permissionName: string) => {
    const hasPermission = await permissionService.hasPermission(permissionName);
    return { permissionName, hasPermission };
  }
);

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearPermissions: (state) => {
      state.permissions = [];
      state.error = null;
      state.lastFetched = null;
    },
    setPermissions: (state, action: PayloadAction<string[] | Permission[]>) => {
      state.permissions = action.payload;
      state.lastFetched = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch permissions
      .addCase(fetchMyPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchMyPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch permissions';
      })
      
      // Check permission
      .addCase(checkPermission.fulfilled, () => {
        // This is mainly for caching specific permission checks
        // The actual permission checking logic will be in selectors
      });
  },
});

export const { clearPermissions, setPermissions } = permissionSlice.actions;

// Selectors
export const selectPermissions = (state: { permissions: PermissionState }) => 
  state.permissions.permissions;

export const selectPermissionLoading = (state: { permissions: PermissionState }) => 
  state.permissions.loading;

export const selectPermissionError = (state: { permissions: PermissionState }) => 
  state.permissions.error;

// Permission checking selectors - updated for string array format
export const selectHasPermission = (permissionName: string) => (state: { permissions: PermissionState }) => {
  const permissions = state.permissions.permissions;
  if (Array.isArray(permissions) && permissions.length > 0) {
    if (typeof permissions[0] === 'string') {
      return (permissions as string[]).includes(permissionName);
    } else {
      return (permissions as Permission[]).some(p => p.name === permissionName);
    }
  }
  return false;
};

export const selectHasPermissionForPath = (path: string) => (state: { permissions: PermissionState }) => {
  const permissions = state.permissions.permissions;
  if (Array.isArray(permissions) && permissions.length > 0) {
    if (typeof permissions[0] === 'string') {
      // Map path to permission name for string array
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
      return (permissions as Permission[]).some(p => p.path === path || (p.path && path.startsWith(p.path)));
    }
  }
  return false;
};

export const selectHasAnyPermission = (permissionNames: string[]) => (state: { permissions: PermissionState }) => {
  const permissions = state.permissions.permissions;
  if (Array.isArray(permissions) && permissions.length > 0) {
    if (typeof permissions[0] === 'string') {
      return permissionNames.some(name => (permissions as string[]).includes(name));
    } else {
      return permissionNames.some(name => (permissions as Permission[]).some(p => p.name === name));
    }
  }
  return false;
};

export const selectHasAllPermissions = (permissionNames: string[]) => (state: { permissions: PermissionState }) => {
  const permissions = state.permissions.permissions;
  if (Array.isArray(permissions) && permissions.length > 0) {
    if (typeof permissions[0] === 'string') {
      return permissionNames.every(name => (permissions as string[]).includes(name));
    } else {
      return permissionNames.every(name => (permissions as Permission[]).some(p => p.name === name));
    }
  }
  return false;
};

// Resource-based permission selectors
export const selectResourcePermissions = (resource: string) => (state: { permissions: PermissionState }) => {
  const permissions = state.permissions.permissions;
  if (Array.isArray(permissions) && permissions.length > 0) {
    if (typeof permissions[0] === 'string') {
      return (permissions as string[]).filter(permission => 
        permission.includes(resource) || permission.includes(resource.replace('-', ''))
      );
    } else {
      return (permissions as Permission[])
        .filter(p => p.path?.includes(`/${resource}`) || p.resource === resource)
        .map(p => p.name);
    }
  }
  return [];
};

export default permissionSlice.reducer;
