import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '@/services/api';

export interface Role {
  id: string;
  name: string;
  description: string;
  roleValue: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  permissionCount: number;
  rolePermissions?: RolePermission[];
}

export interface RolePermission {
  id: string;
  permissionID: string;
  rolePermissionID: string;
  isActive: boolean;
  permission?: Permission;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  roleValue: number;
  isActive: boolean;
  isDefault: boolean;
}

export interface UpdateRoleRequest {
  name: string;
  description: string;
  roleValue: number;
  isActive: boolean;
  isDefault: boolean;
}

export interface ChangeRoleStatusRequest {
  roleId: string;
  status: boolean;
}

export interface SetRolePermissionsRequest {
  roleId: string;
  permissions: Array<{
    permissionID: string;
    rolePermissionID: string;
  }>;
}

export interface ChangeRolePermissionStatusRequest {
  roleId: string;
  rolePermissionId: string;
  status: boolean;
}

interface RoleState {
  roles: Role[];
  currentRole: Role | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPageNumber: number;
  pageSize: number;
}

const initialState: RoleState = {
  roles: [],
  currentRole: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPageNumber: 1,
  pageSize: 10,
};

// Fetch all roles
export const fetchRoles = createAsyncThunk(
  'role/fetchRoles',
  async (params: {
    page?: number;
    pageSize?: number;
    name?: string;
    description?: string;
    roleValue?: number;
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.name) queryParams.append('name', params.name);
      if (params.description) queryParams.append('description', params.description);
      if (params.roleValue) queryParams.append('roleValue', params.roleValue.toString());

      console.log('🔍 Fetching roles with params:', params);
      const response = await apiRequest(`/roles?${queryParams.toString()}`);
      console.log('📡 API Response:', response);
      
      return response;
    } catch (error: any) {
      console.error('❌ Error fetching roles:', error);
      return rejectWithValue(error.message || 'Roles yüklenirken hata oluştu');
    }
  }
);

// Fetch role by ID
export const fetchRoleById = createAsyncThunk(
  'role/fetchRoleById',
  async (roleId: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/roles/${roleId}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Role yüklenirken hata oluştu');
    }
  }
);

// Create new role
export const createRole = createAsyncThunk(
  'role/createRole',
  async (roleData: CreateRoleRequest, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/roles', {
        method: 'POST',
        data: roleData,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Role oluşturulurken hata oluştu');
    }
  }
);

// Update role
export const updateRole = createAsyncThunk(
  'role/updateRole',
  async ({ roleId, roleData }: { roleId: string; roleData: UpdateRoleRequest }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/roles/${roleId}`, {
        method: 'PUT',
        data: roleData,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Role güncellenirken hata oluştu');
    }
  }
);

// Change role status
export const changeRoleStatus = createAsyncThunk(
  'role/changeRoleStatus',
  async ({ roleId, status }: ChangeRoleStatusRequest, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/roles/${roleId}/change-status`, {
        method: 'PATCH',
        data: { isActive: status },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Role durumu değiştirilirken hata oluştu');
    }
  }
);

// Set role permissions
export const setRolePermissions = createAsyncThunk(
  'role/setRolePermissions',
  async ({ roleId, permissions }: SetRolePermissionsRequest, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/roles/${roleId}/permissions`, {
        method: 'POST',
        data: { permissions },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Role izinleri ayarlanırken hata oluştu');
    }
  }
);

// Change role permission status
export const changeRolePermissionStatus = createAsyncThunk(
  'role/changeRolePermissionStatus',
  async ({ roleId, rolePermissionId, status }: ChangeRolePermissionStatusRequest, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/roles/${roleId}/permissions/${rolePermissionId}/change-status`, {
        method: 'PATCH',
        data: { isActive: status },
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Role izin durumu değiştirilirken hata oluştu');
    }
  }
);

// Delete role
export const deleteRole = createAsyncThunk(
  'role/deleteRole',
  async (roleId: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/roles/${roleId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Role silinirken hata oluştu');
    }
  }
);

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPageNumber: (state, action: PayloadAction<number>) => {
      state.currentPageNumber = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch roles
    builder
      .addCase(fetchRoles.pending, (state) => {
        console.log('⏳ Fetching roles...');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        console.log('✅ Roles fetched successfully');
        console.log('📊 Action payload:', action.payload);
        
        state.loading = false;
        
        // API response formatını kontrol et
        if (action.payload && action.payload.data && action.payload.data.items) {
          // Format: {data: {items: [...], page: 1, pageSize: 10, pageCount: 1, totalCount: 3}, error: null}
          state.roles = action.payload.data.items;
          state.totalPages = action.payload.data.pageCount || 1;
          console.log(`📋 Loaded ${state.roles.length} roles`);
        } else if (action.payload && action.payload.items) {
          // Format: {items: [...], page: 1, pageSize: 10, pageCount: 1, totalCount: 3}
          state.roles = action.payload.items;
          state.totalPages = action.payload.pageCount || 1;
          console.log(`📋 Loaded ${state.roles.length} roles`);
        } else {
          console.warn('⚠️ Unexpected API response format:', action.payload);
          state.roles = [];
          state.totalPages = 1;
        }
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        console.error('❌ Failed to fetch roles:', action.payload);
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch role by ID
    builder
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload.data || action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create role
    builder
      .addCase(createRole.fulfilled, (state, action) => {
        const newRole = action.payload.data || action.payload;
        state.roles.unshift(newRole);
      });

    // Update role
    builder
      .addCase(updateRole.fulfilled, (state, action) => {
        const updatedRole = action.payload.data || action.payload;
        const index = state.roles.findIndex(role => role.id === updatedRole.id);
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
        if (state.currentRole?.id === updatedRole.id) {
          state.currentRole = updatedRole;
        }
      });

    // Change role status
    builder
      .addCase(changeRoleStatus.fulfilled, (state, action) => {
        const updatedRole = action.payload.data || action.payload;
        const index = state.roles.findIndex(role => role.id === updatedRole.id);
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
        if (state.currentRole?.id === updatedRole.id) {
          state.currentRole = updatedRole;
        }
      });

    // Set role permissions
    builder
      .addCase(setRolePermissions.fulfilled, (state, action) => {
        const updatedRole = action.payload.data || action.payload;
        const index = state.roles.findIndex(role => role.id === updatedRole.id);
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
        if (state.currentRole?.id === updatedRole.id) {
          state.currentRole = updatedRole;
        }
      });

    // Change role permission status
    builder
      .addCase(changeRolePermissionStatus.fulfilled, (state, action) => {
        const updatedRole = action.payload.data || action.payload;
        const index = state.roles.findIndex(role => role.id === updatedRole.id);
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
        if (state.currentRole?.id === updatedRole.id) {
          state.currentRole = updatedRole;
        }
      });

    // Delete role
    builder
      .addCase(deleteRole.fulfilled, (state, action) => {
        const deletedRoleId = action.payload.data?.id || action.payload.id;
        state.roles = state.roles.filter(role => role.id !== deletedRoleId);
        if (state.currentRole?.id === deletedRoleId) {
          state.currentRole = null;
        }
      });
  },
});

export const {
  clearCurrentRole,
  clearError,
  setCurrentPageNumber,
  setPageSize
} = roleSlice.actions;

export default roleSlice.reducer; 