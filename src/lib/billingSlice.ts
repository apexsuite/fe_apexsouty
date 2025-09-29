import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '@/services/api';

export interface Billing {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  footer?: string;
  isActive: boolean;
  extra?: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBillingRequest {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  footer?: string;
  extra?: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
}

export interface UpdateBillingRequest {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  footer?: string;
  extra?: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface BillingState {
  billing: Billing | null;
  loading: boolean;
  error: string | null;
}

const initialState: BillingState = {
  billing: null,
  loading: false,
  error: null,
};

// Fetch billing
export const fetchBilling = createAsyncThunk(
  'billing/fetchBilling',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/billings', {
        method: 'GET',
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Billing bilgileri alınırken hata oluştu');
    }
  }
);

// Create billing
export const createBilling = createAsyncThunk(
  'billing/createBilling',
  async (billingData: CreateBillingRequest, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/billings', {
        method: 'POST',
        body: JSON.stringify(billingData),
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Billing oluşturulurken hata oluştu');
    }
  }
);

// Update billing
export const updateBilling = createAsyncThunk(
  'billing/updateBilling',
  async (billingData: UpdateBillingRequest, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/billings', {
        method: 'PUT',
        body: JSON.stringify(billingData),
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Billing güncellenirken hata oluştu');
    }
  }
);

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    clearBilling: (state) => {
      state.billing = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch billing
      .addCase(fetchBilling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBilling.fulfilled, (state, action) => {
        state.loading = false;
        state.billing = action.payload.data;
      })
      .addCase(fetchBilling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create billing
      .addCase(createBilling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBilling.fulfilled, (state, action) => {
        state.loading = false;
        state.billing = action.payload.data;
      })
      .addCase(createBilling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update billing
      .addCase(updateBilling.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBilling.fulfilled, (state, action) => {
        state.loading = false;
        state.billing = action.payload.data;
      })
      .addCase(updateBilling.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearBilling,
  clearError,
} = billingSlice.actions;

export default billingSlice.reducer;
