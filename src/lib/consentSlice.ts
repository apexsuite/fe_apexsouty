import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '@/services/api';

export interface Consent {
  id: string;
  regionName: string;
  regionURL: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}


export interface ChangeConsentStatusRequest {
  consentId: string;
  status: boolean;
}

interface ConsentState {
  consents: Consent[];
  loading: boolean;
  error: any;
  totalPages: number;
  totalCount: number;
  currentPageNumber: number;
  pageSize: number;
}

const initialState: ConsentState = {
  consents: [],
  loading: false,
  error: null,
  totalPages: 1,
  totalCount: 0,
  currentPageNumber: 1,
  pageSize: 10,
};

// Fetch all consents
export const fetchConsents = createAsyncThunk(
  'consent/fetchConsents',
  async (params: {
    page?: number;
    pageSize?: number;
    marketplace?: string;
    marketplaceURL?: string;
    isActive?: boolean;
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.marketplace) queryParams.append('marketplace', params.marketplace);
      if (params.marketplaceURL) queryParams.append('marketplaceURL', params.marketplaceURL);
      if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

      const response = await apiRequest(`/amazon/consents?${queryParams.toString()}`);
      return response;
    } catch (error: any) {
      console.error('❌ Error fetching consents:', error);
      return rejectWithValue(error);
    }
  }
);

// Request consent callback - For consent table authorize button
export const requestConsentCallback = createAsyncThunk(
  'consent/requestConsentCallback',
  async (marketplaceId: string, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/amazon/consents/get-consent-link', {
        method: 'POST',
        body: JSON.stringify({ marketplaceId }),
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Amazon consent callback - Senaryo 1: Ürün yetkilendirme başlatma
export const requestAmazonConsentCallback = createAsyncThunk(
  'consent/requestAmazonConsentCallback',
  async (
    params: { amazonCallbackUri: string; amazonState: string; sellingPartnerId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest('/amazon/consents/callback', {
        method: 'POST',
        body: JSON.stringify({
          amazonCallbackUri: params.amazonCallbackUri,
          amazonState: params.amazonState,
          sellingPartnerId: params.sellingPartnerId,
        }),
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Amazon consent validate - Senaryo 2: Amazon callback validate
export const validateAmazonConsent = createAsyncThunk(
  'consent/validateAmazonConsent',
  async (
    params: { state: string; selling_partner_id: string; spapi_oauth_code: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRequest('/amazon/consents/validate', {
        method: 'POST',
        body: JSON.stringify({
          state: params.state,
          sellingPartnetId: params.selling_partner_id,
          spapiOauthCode: params.spapi_oauth_code,
        }),
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const changeConsentStatus = createAsyncThunk(
  'consent/changeConsentStatus',
  async ({ consentId, status }: ChangeConsentStatusRequest, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/amazon/consents/${consentId}/change-status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: status }),
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const consentSlice = createSlice({
  name: 'consent',
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsents.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload && action.payload.data && Array.isArray(action.payload.data)) {
          state.consents = action.payload.data;
          state.totalPages = 1;
          state.totalCount = action.payload.data.length;
        } else if (action.payload && Array.isArray(action.payload)) {
          state.consents = action.payload;
          state.totalPages = 1;
          state.totalCount = action.payload.length;
        } else {
          console.warn('⚠️ Unexpected API response format:', action.payload);
          state.consents = [];
          state.totalPages = 1;
          state.totalCount = 0;
        }
      })
      .addCase(fetchConsents.rejected, (state, action) => {
        console.error('❌ Failed to fetch consents:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });


    builder
      .addCase(changeConsentStatus.fulfilled, (state, action) => {
        const updatedConsent = action.payload.data || action.payload;
        const index = state.consents.findIndex(consent => consent.id === updatedConsent.id);
        if (index !== -1) {
          state.consents[index] = updatedConsent;
        }
      });

  },
});

export const {
  clearError,
  setCurrentPageNumber,
  setPageSize
} = consentSlice.actions;

export default consentSlice.reducer;
