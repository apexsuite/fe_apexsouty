import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '@/services/api';

// Marketplace interface - API'ye uygun format
export interface Marketplace {
  id: string;
  marketplace: string; // API'de "name" yerine "marketplace" kullanılıyor
  marketplaceURL: string; // API'de "website" yerine "marketplaceURL" kullanılıyor
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// State interface
interface MarketplaceState {
  marketplaces: Marketplace[];
  marketplace: Marketplace | null;
  loading: boolean;
  error: any;
  totalPages: number;
  currentPageNumber: number;
  pageSize: number;
  totalCount: number;
}

// Initial state
const initialState: MarketplaceState = {
  marketplaces: [],
  marketplace: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPageNumber: 1,
  pageSize: 10,
  totalCount: 0,
};

// Async thunks
export const fetchMarketplaces = createAsyncThunk(
  'marketplace/fetchMarketplaces',
  async (params: {
    page?: number;
    pageSize?: number;
    marketplace?: string;
    marketplaceURL?: string;
    isActive?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.marketplace) queryParams.append('marketplace', params.marketplace);
    if (params.marketplaceURL) queryParams.append('marketplaceURL', params.marketplaceURL);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    
    const response = await apiRequest(`/amazon/marketplaces?${queryParams.toString()}`);
    return response;
  }
);

export const fetchMarketplace = createAsyncThunk(
  'marketplace/fetchMarketplace',
  async (marketplaceId: string) => {
    const response = await apiRequest(`/amazon/marketplaces/${marketplaceId}`);
    return response;
  }
);

export const createMarketplace = createAsyncThunk(
  'marketplace/createMarketplace',
  async (marketplaceData: {
    marketplace: string;
    marketplaceURL: string;
  }) => {
    const response = await apiRequest('/amazon/marketplaces', {
      method: 'POST',
      body: JSON.stringify(marketplaceData),
    });
    return response;
  }
);

export const updateMarketplace = createAsyncThunk(
  'marketplace/updateMarketplace',
  async ({ marketplaceId, marketplaceData }: {
    marketplaceId: string;
    marketplaceData: {
      marketplace: string;
      marketplaceURL: string;
    };
  }) => {
    const response = await apiRequest(`/amazon/marketplaces/${marketplaceId}`, {
      method: 'PUT',
      body: JSON.stringify(marketplaceData),
    });
    return response;
  }
);

export const deleteMarketplace = createAsyncThunk(
  'marketplace/deleteMarketplace',
  async (marketplaceId: string) => {
    await apiRequest(`/amazon/marketplaces/${marketplaceId}`, {
      method: 'DELETE',
    });
    return marketplaceId;
  }
);

export const changeMarketplaceStatus = createAsyncThunk(
  'marketplace/changeMarketplaceStatus',
  async (marketplaceId: string) => {
    const response = await apiRequest(`/amazon/marketplaces/${marketplaceId}/change-status`, {
      method: 'PATCH',
    });
    return response;
  }
);

// Slice
const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPageNumber: (state, action: PayloadAction<number>) => {
      state.currentPageNumber = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    clearMarketplace: (state) => {
      state.marketplace = null;
    },
  },
  extraReducers: (builder) => {
    // fetchMarketplaces
    builder
      .addCase(fetchMarketplaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketplaces.fulfilled, (state, action) => {
        console.log('fetchMarketplaces.fulfilled - Action payload:', action.payload);
        state.loading = false;
        state.marketplaces = action.payload.data?.items || [];
        state.totalPages = action.payload.data?.pageCount || 1;
        state.totalCount = action.payload.data?.totalCount || 0;
        state.error = null;
        console.log('State updated:', { 
          marketplaces: state.marketplaces, 
          totalPages: state.totalPages, 
          totalCount: state.totalCount 
        });
      })
      .addCase(fetchMarketplaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch marketplaces';
      });

    // fetchMarketplace
    builder
      .addCase(fetchMarketplace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketplace.fulfilled, (state, action) => {
        state.loading = false;
        state.marketplace = action.payload.data;
        state.error = null;
      })
      .addCase(fetchMarketplace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch marketplace';
      });

    // createMarketplace
    builder
      .addCase(createMarketplace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMarketplace.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createMarketplace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create marketplace';
      });

    // updateMarketplace
    builder
      .addCase(updateMarketplace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMarketplace.fulfilled, (state, action) => {
        state.loading = false;
        // Update the marketplace in the list if it exists
        const index = state.marketplaces.findIndex(m => m.id === action.payload.data?.id);
        if (index !== -1) {
          state.marketplaces[index] = action.payload.data;
        }
        // Update the current marketplace if it's the same one
        if (state.marketplace && state.marketplace.id === action.payload.data?.id) {
          state.marketplace = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updateMarketplace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update marketplace';
      });

    // deleteMarketplace
    builder
      .addCase(deleteMarketplace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMarketplace.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted marketplace from the list
        state.marketplaces = state.marketplaces.filter(m => m.id !== action.payload);
        // Clear the current marketplace if it was the deleted one
        if (state.marketplace && state.marketplace.id === action.payload) {
          state.marketplace = null;
        }
        state.error = null;
      })
      .addCase(deleteMarketplace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete marketplace';
      });

    // changeMarketplaceStatus
    builder
      .addCase(changeMarketplaceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeMarketplaceStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Update the marketplace status in the list
        const index = state.marketplaces.findIndex(m => m.id === action.payload.data?.id);
        if (index !== -1) {
          state.marketplaces[index].isActive = action.payload.data.isActive;
        }
        // Update the current marketplace if it's the same one
        if (state.marketplace && state.marketplace.id === action.payload.data?.id) {
          state.marketplace.isActive = action.payload.data.isActive;
        }
        state.error = null;
      })
      .addCase(changeMarketplaceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to change marketplace status';
      });
  },
});

// Export actions
export const { clearError, setCurrentPageNumber, setPageSize, clearMarketplace } = marketplaceSlice.actions;

// Export reducer
export default marketplaceSlice.reducer;
