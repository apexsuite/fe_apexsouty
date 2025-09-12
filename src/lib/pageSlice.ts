import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '@/services/api';

// API Response interfaces based on documentation
export interface PageRoutePermission {
  id: string;
  createdAt: string;
  name: string;
  description: string;
  label: string;
  pageRouteId: string;
  isActive: boolean;
}

export interface PageRouteFavourite {
  createdAt: string;
  id: string;
  list_order: number;
  pageRoute: string;
  pageRouteID: string;
  userID: string;
}

// Page Route interface based on API documentation
export interface PageRoute {
  id: string;
  name: string;
  description: string;
  component: string;
  icon: string;
  path: string;
  is_active: boolean;
  is_visible: boolean;
  IsUnderConstruction: boolean;
  parentID?: string;
  createdAt: string;
  updatedAt?: string;
  favourite?: PageRouteFavourite;
  page_route_permissions?: PageRoutePermission[];
  permissionCount?: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  totalPages?: number;
  currentPage?: number;
}

// Page state interface
interface PageState {
  pageRoutes: PageRoute[];
  currentPageRoute: PageRoute | null;
  privatePageRoutes: PageRoute[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPageNumber: number;
  pageSize: number;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  statusChangeLoading: boolean;
  restoreLoading: boolean;
}

// Initial state
const initialState: PageState = {
  pageRoutes: [],
  currentPageRoute: null,
  privatePageRoutes: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPageNumber: 1,
  pageSize: 10,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  statusChangeLoading: false,
  restoreLoading: false,
};

// Async thunks

// GET /api/page-routes - Get page route list
export const fetchPageRoutes = createAsyncThunk(
  'page/fetchPageRoutes',
  async (params: { page?: number; limit?: number; name?: string; category?: string } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.name) queryParams.append('name', params.name);
      if (params.category) queryParams.append('category', params.category);

      // Geçici olarak tam URL ile test edelim
      const response = await apiRequest(`/page-routes?${queryParams.toString()}`);
      console.log('API Request URL:', `/page-routes?${queryParams.toString()}`);
      console.log('API Response:', response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Page routes yüklenirken hata oluştu');
    }
  }
);

// GET /api/page-routes/private-routes - Get private page route list
export const fetchPrivatePageRoutes = createAsyncThunk(
  'page/fetchPrivatePageRoutes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/page-routes/private-routes');
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Private page routes yüklenirken hata oluştu');
    }
  }
);

// GET /api/page-routes/{page_route_id} - Get page route
export const fetchPageRouteById = createAsyncThunk(
  'page/fetchPageRouteById',
  async (pageRouteId: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/page-routes/${pageRouteId}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Page route detayları yüklenirken hata oluştu');
    }
  }
);

// POST /api/page-routes - Create page route
export const createPageRoute = createAsyncThunk(
  'page/createPageRoute',
  async (pageRouteData: {
    name: string;
    description: string;
    component: string;
    icon: string;
    path: string;
    isActive: boolean;
    isVisible: boolean;
    isUnderConstruction: boolean;
    parentID?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/page-routes', {
        method: 'POST',
        body: JSON.stringify(pageRouteData),
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Page route oluşturulurken hata oluştu');
    }
  }
);

// PUT /page-routes/{page_route_id} - Update page route
export const updatePageRoute = createAsyncThunk(
  'page/updatePageRoute',
  async ({ pageRouteId, pageRouteData }: { 
    pageRouteId: string; 
    pageRouteData: Partial<{
      name: string;
      description: string;
      component: string;
      icon: string;
      path: string;
      isActive: boolean;
      isVisible: boolean;
      isUnderConstruction: boolean;
      parentID?: string;
    }> 
  }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/page-routes/${pageRouteId}`, {
        method: 'PUT',
        body: JSON.stringify(pageRouteData),
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Page route güncellenirken hata oluştu');
    }
  }
);

// DELETE /page-routes/{page_route_id} - Delete page route
export const deletePageRoute = createAsyncThunk(
  'page/deletePageRoute',
  async (pageRouteId: string, { rejectWithValue }) => {
    try {
      await apiRequest(`/page-routes/${pageRouteId}`, {
        method: 'DELETE',
      });
      return pageRouteId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Page route silinirken hata oluştu');
    }
  }
);

// PATCH /page-routes/{page_route_id}/change-status - Change page route status
export const changePageRouteStatus = createAsyncThunk(
  'page/changePageRouteStatus',
  async ({ pageRouteId, status }: { pageRouteId: string; status: boolean }, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/page-routes/${pageRouteId}/change-status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return { pageRouteId, response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Page route durumu değiştirilirken hata oluştu');
    }
  }
);

// PATCH /page-routes/{page_route_id}/restore - Restore page route
export const restorePageRoute = createAsyncThunk(
  'page/restorePageRoute',
  async (pageRouteId: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/page-routes/${pageRouteId}/restore`, {
        method: 'PATCH',
      });
      return { pageRouteId, response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Page route geri yüklenirken hata oluştu');
    }
  }
);

// Page slice
const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    clearCurrentPageRoute: (state) => {
      state.currentPageRoute = null;
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
    // fetchPageRoutes
    builder
      .addCase(fetchPageRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageRoutes.fulfilled, (state, action) => {
        state.loading = false;
        console.log('API Response:', action.payload);
        console.log('Items:', action.payload.data?.items);
        state.pageRoutes = action.payload.data?.items || [];
        state.totalPages = action.payload.data?.pageCount || 0;
        state.currentPageNumber = action.payload.data?.page || 1;
      })
      .addCase(fetchPageRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchPrivatePageRoutes
    builder
      .addCase(fetchPrivatePageRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrivatePageRoutes.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload as ApiResponse<PageRoute[]>;
        state.privatePageRoutes = response.data || response;
      })
      .addCase(fetchPrivatePageRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchPageRouteById
    builder
      .addCase(fetchPageRouteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageRouteById.fulfilled, (state, action) => {
        state.loading = false;
        const response = action.payload as ApiResponse<PageRoute>;
        state.currentPageRoute = response.data || response;
      })
      .addCase(fetchPageRouteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // createPageRoute
    builder
      .addCase(createPageRoute.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createPageRoute.fulfilled, (state, action) => {
        state.createLoading = false;
        const response = action.payload as ApiResponse<PageRoute>;
        const newPageRoute = response.data || response;
        state.pageRoutes.unshift(newPageRoute);
      })
      .addCase(createPageRoute.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload as string;
      });

    // updatePageRoute
    builder
      .addCase(updatePageRoute.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updatePageRoute.fulfilled, (state, action) => {
        state.updateLoading = false;
        const response = action.payload as ApiResponse<PageRoute>;
        const updatedPageRoute = response.data || response;
        
        const index = state.pageRoutes.findIndex(page => page.id === updatedPageRoute.id);
        if (index !== -1) {
          state.pageRoutes[index] = updatedPageRoute;
        }
        
        if (state.currentPageRoute?.id === updatedPageRoute.id) {
          state.currentPageRoute = updatedPageRoute;
        }
      })
      .addCase(updatePageRoute.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      });

    // deletePageRoute
    builder
      .addCase(deletePageRoute.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deletePageRoute.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const deletedId = action.payload as string;
        state.pageRoutes = state.pageRoutes.filter(page => page.id !== deletedId);
        if (state.currentPageRoute?.id === deletedId) {
          state.currentPageRoute = null;
        }
      })
      .addCase(deletePageRoute.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
      });

    // changePageRouteStatus
    builder
      .addCase(changePageRouteStatus.pending, (state) => {
        state.statusChangeLoading = true;
        state.error = null;
      })
      .addCase(changePageRouteStatus.fulfilled, (state, action) => {
        state.statusChangeLoading = false;
        const { pageRouteId, response } = action.payload as { pageRouteId: string; response: any };
        const updatedPageRoute = response.data || response;
        
        const index = state.pageRoutes.findIndex(page => page.id === pageRouteId);
        if (index !== -1) {
          state.pageRoutes[index] = { ...state.pageRoutes[index], ...updatedPageRoute };
        }
        
        if (state.currentPageRoute?.id === pageRouteId) {
          state.currentPageRoute = { ...state.currentPageRoute, ...updatedPageRoute };
        }
      })
      .addCase(changePageRouteStatus.rejected, (state, action) => {
        state.statusChangeLoading = false;
        state.error = action.payload as string;
      });

    // restorePageRoute
    builder
      .addCase(restorePageRoute.pending, (state) => {
        state.restoreLoading = true;
        state.error = null;
      })
      .addCase(restorePageRoute.fulfilled, (state, action) => {
        state.restoreLoading = false;
        const { pageRouteId, response } = action.payload as { pageRouteId: string; response: any };
        const restoredPageRoute = response.data || response;
        
        const index = state.pageRoutes.findIndex(page => page.id === pageRouteId);
        if (index !== -1) {
          state.pageRoutes[index] = { ...state.pageRoutes[index], ...restoredPageRoute };
        }
        
        if (state.currentPageRoute?.id === pageRouteId) {
          state.currentPageRoute = { ...state.currentPageRoute, ...restoredPageRoute };
        }
      })
      .addCase(restorePageRoute.rejected, (state, action) => {
        state.restoreLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearCurrentPageRoute, 
  clearError, 
  setCurrentPageNumber, 
  setPageSize 
} = pageSlice.actions;

export default pageSlice.reducer; 