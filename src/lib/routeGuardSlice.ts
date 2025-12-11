import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/services/api';

export interface RouteInfo {
  path: string;
  component: string;
}

interface RouteGuardState {
  privateRoutes: string[];
  routeMap: Record<string, RouteInfo>;
  loading: boolean;
  error: string | null;
}

const initialState: RouteGuardState = {
  privateRoutes: [],
  routeMap: {},
  loading: false,
  error: null,
};

export const fetchPrivateRoutes = createAsyncThunk(
  'routeGuard/fetchPrivateRoutes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/page-routes/private-routes', {
        method: 'GET',
        withCredentials: true,
      });

      const routes = response?.data || response || [];
      const paths = Array.isArray(routes)
        ? routes
            .map((route: any) => route.path || route.route || route)
            .filter(Boolean)
        : [];

      const routeMap: Record<string, RouteInfo> = {};
      if (Array.isArray(routes)) {
        routes.forEach((route: any) => {
          const path = route.path || route.route || route;
          if (path) {
            routeMap[path] = {
              path,
              component: route.component || '',
            };
          }
        });
      }

      return { paths, routeMap };
    } catch (error: any) {
      return rejectWithValue(
        error?.data?.message || 'Failed to fetch private routes'
      );
    }
  }
);

const routeGuardSlice = createSlice({
  name: 'routeGuard',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearPrivateRoutes: state => {
      state.privateRoutes = [];
      state.routeMap = {};
    },
    forceRefresh: state => {
      state.privateRoutes = [];
      state.routeMap = {};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPrivateRoutes.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrivateRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.privateRoutes = action.payload.paths;
        state.routeMap = action.payload.routeMap;
        state.error = null;
      })
      .addCase(fetchPrivateRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearPrivateRoutes, forceRefresh } =
  routeGuardSlice.actions;
export default routeGuardSlice.reducer;
