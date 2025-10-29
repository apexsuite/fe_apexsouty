import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/services/api';

// Permission interface based on API documentation
export interface PageRoute {
  id: string;
  createdAt: string;
  name: string;
  path: string;
  component: string;
  icon: string;
  parent_id: string | null;
  is_visible: boolean;
  is_active: boolean;
  description: string;
  IsUnderConstruction: boolean;
}

export interface Role {
  id: string;
  createdAt: string;
  name: string;
  roleValue: number;
  isDefault: boolean;
  isActive: boolean;
  description: string;
  permissionCount: number;
  rolePermissions: any[] | null;
}

export interface RolePermission {
  id: string;
  createdAt: string;
  roleID: string;
  permissionID: string;
  isActive: boolean;
  role: Role;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  label: string;
  isActive: boolean;
  pageRouteId: string;
  createdAt: string;
  updatedAt?: string;
  pageRoute: PageRoute;
  rolePermission: RolePermission[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  totalPages?: number;
  currentPage?: number;
}

interface PermissionState {
  permissions: Permission[];
  filteredPermissions: Permission[];
  currentPermission: Permission | null;
  myPermissions: string[];
  loading: boolean;
  error: any;
  totalPages: number;
  totalCount: number;
  currentPageNumber: number;
  pageSize: number;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  statusChangeLoading: boolean;
  isSearching: boolean;
}

const initialState: PermissionState = {
  permissions: [],
  filteredPermissions: [],
  currentPermission: null,
  myPermissions: [],
  loading: false,
  error: null,
  totalPages: 0,
  totalCount: 0,
  currentPageNumber: 1,
  pageSize: 10,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  statusChangeLoading: false,
  isSearching: false,
};

export const fetchPermissions = createAsyncThunk(
  'permission/fetchPermissions',
  async (params: { 
    page?: number; 
    pageSize?: number; 
    name?: string; 
    description?: string; 
    label?: string;
    isActive?: boolean;
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.name) queryParams.append('name', params.name);
      if (params.description) queryParams.append('description', params.description);
      if (params.label) queryParams.append('label', params.label);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

      const response = await apiRequest(`/permissions?${queryParams.toString()}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMyPermissions = createAsyncThunk(
  'permission/fetchMyPermissions',
  async (params: { name?: string; path?: string } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.name) queryParams.append('name', params.name);
      if (params.path) queryParams.append('path', params.path);

      const response = await apiRequest(`/permissions/my-permissions?${queryParams.toString()}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchPermissionById = createAsyncThunk(
  'permission/fetchPermissionById',
  async (permissionId: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/permissions/${permissionId}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const createPermission = createAsyncThunk(
  'permission/createPermission',
  async ({ pageRouteId, permissionData }: {
    pageRouteId: string;
    permissionData: {
      name: string;
      description: string;
      label: string;
      isActive: boolean;
    };
  }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/page-routes/${pageRouteId}/permissions`, {
        method: 'POST',
        body: JSON.stringify(permissionData),
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updatePermission = createAsyncThunk(
  'permission/updatePermission',
  async ({ pageRouteId, permissionId, permissionData }: {
    pageRouteId: string;
    permissionId: string;
    permissionData: {
      name: string;
      description: string;
      label: string;
      isActive: boolean;
    };
  }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/page-routes/${pageRouteId}/permissions/${permissionId}`, {
        method: 'PUT',
        body: JSON.stringify(permissionData),
      });
      return { permissionId, response };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const deletePermission = createAsyncThunk(
  'permission/deletePermission',
  async ({ pageRouteId, permissionId }: {
    pageRouteId: string;
    permissionId: string;
  }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/page-routes/${pageRouteId}/permissions/${permissionId}`, {
        method: 'DELETE',
      });
      return { permissionId, response };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const deletePermissionDirect = createAsyncThunk(
  'permission/deletePermissionDirect',
  async (permissionId: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/permissions/${permissionId}`, {
        method: 'DELETE',
      });
      return { permissionId, response };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const changePermissionStatus = createAsyncThunk(
  'permission/changePermissionStatus',
  async ({ pageRouteId, permissionId, status }: { 
    pageRouteId: string; 
    permissionId: string; 
    status: boolean 
  }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/page-routes/${pageRouteId}/permissions/${permissionId}/change-status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: status }),
      });
      return { permissionId, status, response };
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setCurrentPageNumber: (state, action) => {
      state.currentPageNumber = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    clearCurrentPermission: (state) => {
      state.currentPermission = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    setFilteredPermissions: (state, action) => {
      state.filteredPermissions = action.payload;
    },
    clearSearch: (state) => {
      state.isSearching = false;
      state.filteredPermissions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        const validPermissions = (action.payload.data?.items || []).filter((permission: any) => permission !== null);
        
        if (state.isSearching && validPermissions.length === 0) {
          state.filteredPermissions = [];
        } else {
          state.permissions = validPermissions;
          state.filteredPermissions = validPermissions;
        }
        
        state.totalPages = action.payload.data?.pageCount || 0;
        state.totalCount = action.payload.data?.totalCount || 0;
        state.currentPageNumber = action.payload.data?.page || 1;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchMyPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.myPermissions = action.payload.data || [];
      })
      .addCase(fetchMyPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchPermissionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPermission = action.payload.data;
      })
      .addCase(fetchPermissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createPermission.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.createLoading = false;
        state.permissions.unshift(action.payload.data);
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updatePermission.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.updateLoading = false;
        const { permissionId, response } = action.payload;
        const index = state.permissions.findIndex(p => p.id === permissionId);
        if (index !== -1) {
          state.permissions[index] = response.data;
        }
        if (state.currentPermission?.id === permissionId) {
          state.currentPermission = response.data;
        }
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    // deletePermission
    builder
      .addCase(deletePermission.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const { permissionId } = action.payload;
        state.permissions = state.permissions.filter(p => p.id !== permissionId);
        if (state.currentPermission?.id === permissionId) {
          state.currentPermission = null;
        }
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });

    // deletePermissionDirect
    builder
      .addCase(deletePermissionDirect.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deletePermissionDirect.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const { permissionId } = action.payload;
        state.permissions = state.permissions.filter(p => p.id !== permissionId);
        if (state.currentPermission?.id === permissionId) {
          state.currentPermission = null;
        }
      })
      .addCase(deletePermissionDirect.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });

    // changePermissionStatus
    builder
      .addCase(changePermissionStatus.pending, (state) => {
        state.statusChangeLoading = true;
        state.error = null;
      })
      .addCase(changePermissionStatus.fulfilled, (state, action) => {
        state.statusChangeLoading = false;
        const { permissionId, status } = action.payload;
        const index = state.permissions.findIndex(p => p.id === permissionId);
        if (index !== -1) {
          state.permissions[index].isActive = status;
        }
        if (state.currentPermission?.id === permissionId) {
          state.currentPermission.isActive = status;
        }
      })
      .addCase(changePermissionStatus.rejected, (state, action) => {
        state.statusChangeLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setCurrentPageNumber, 
  setPageSize, 
  clearCurrentPermission, 
  clearError, 
  setSearching, 
  setFilteredPermissions, 
  clearSearch 
} = permissionSlice.actions;
export default permissionSlice.reducer; 