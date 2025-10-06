import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/services/api';

interface RouteGuardState {
  privateRoutes: string[];
  loading: boolean;
  error: string | null;
}

const initialState: RouteGuardState = {
  privateRoutes: [],
  loading: false,
  error: null,
};

// Fetch private routes from API
export const fetchPrivateRoutes = createAsyncThunk(
  'routeGuard/fetchPrivateRoutes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/page-routes/private-routes', {
        method: 'GET',
        withCredentials: true,
      });
      
      // API'den gelen response'u kontrol et ve path'leri çıkar
      const routes = response?.data || response || [];
      const paths = Array.isArray(routes) 
        ? routes.map((route: any) => route.path || route.route || route).filter(Boolean)
        : [];
      
      console.log('📋 Private routes from API:', paths);
      return paths;
    } catch (error: any) {
      return rejectWithValue(error?.data?.message || 'Failed to fetch private routes');
    }
  }
);

const routeGuardSlice = createSlice({
  name: 'routeGuard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPrivateRoutes: (state) => {
      state.privateRoutes = [];
    },
    forceRefresh: (state) => {
      // This will trigger a re-fetch of private routes
      state.privateRoutes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrivateRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrivateRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.privateRoutes = action.payload;
        state.error = null;
      })
      .addCase(fetchPrivateRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearPrivateRoutes, forceRefresh } = routeGuardSlice.actions;
export default routeGuardSlice.reducer;
