import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/components/products/ProductTable';
import { apiRequest } from '@/services/api';

// State interface
interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: any;
  totalPages: number;
  currentPageNumber: number;
  pageSize: number;
  totalCount: number;
}

// Initial state
const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPageNumber: 1,
  pageSize: 10,
  totalCount: 0,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params: {
    page?: number;
    pageSize?: number;
    name?: string;
    unitLabel?: string;
    isActive?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.name) queryParams.append('name', params.name);
    if (params.unitLabel) queryParams.append('unitLabel', params.unitLabel);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    
    const response = await apiRequest(`/products?${queryParams.toString()}`);
    return response;
  }
);

export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (productId: string) => {
    const response = await apiRequest(`/products/${productId}`);
    return response;
  }
);

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData: {
    name: string;
    description: string;
    isActive: boolean;
    marketingFeatures: string[];
    statementDescriptor: string;
    unitLabel: string;
  }) => {
    const response = await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return response;
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ productId, productData }: {
    productId: string;
    productData: {
      name: string;
      description: string;
      isActive: boolean;
      marketingFeatures: string[];
      statementDescriptor: string;
      unitLabel: string;
    };
  }) => {
    const response = await apiRequest(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return response;
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (productId: string) => {
    await apiRequest(`/products/${productId}`, {
      method: 'DELETE',
    });
    return productId;
  }
);

export const changeProductStatus = createAsyncThunk(
  'product/changeProductStatus',
  async (productId: string) => {
    const response = await apiRequest(`/products/${productId}/change-status`, {
      method: 'PATCH',
    });
    return response;
  }
);

// Price-related async thunks
export const createPrice = createAsyncThunk(
  'product/createPrice',
  async ({ productId, priceData }: {
    productId: string;
    priceData: {
      currency: string;
      interval: string;
      unitAmount: number;
    };
  }) => {
    const response = await apiRequest(`/products/${productId}/prices`, {
      method: 'POST',
      body: JSON.stringify(priceData),
    });
    return response;
  }
);

export const updatePriceStatus = createAsyncThunk(
  'product/updatePriceStatus',
  async ({ productId, priceId, isActive }: {
    productId: string;
    priceId: string;
    isActive: boolean;
  }) => {
    const response = await apiRequest(`/products/${productId}/prices/${priceId}/change-status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
    return response;
  }
);

export const setDefaultPrice = createAsyncThunk(
  'product/setDefaultPrice',
  async ({ productId, priceId }: {
    productId: string;
    priceId: string;
  }) => {
    const response = await apiRequest(`/products/${productId}/prices/${priceId}/set-default-price`, {
      method: 'PATCH',
    });
    return response;
  }
);

export const getPriceDetail = createAsyncThunk(
  'product/getPriceDetail',
  async ({ productId, priceId }: {
    productId: string;
    priceId: string;
  }) => {
    const response = await apiRequest(`/products/${productId}/prices/${priceId}`);
    return response;
  }
);

// Slice
const productSlice = createSlice({
  name: 'product',
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
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
             .addCase(fetchProducts.fulfilled, (state, action) => {
         state.loading = false;
         state.products = action.payload.data?.items || [];
         state.totalPages = action.payload.data?.pageCount || 1;
         state.totalCount = action.payload.data?.totalCount || 0;
         state.error = null;
       })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });

    // fetchProduct
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
             .addCase(fetchProduct.fulfilled, (state, action) => {
         state.loading = false;
         state.product = action.payload.data;
         state.error = null;
       })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      });

    // createProduct
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create product';
      });

    // updateProduct
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
             .addCase(updateProduct.fulfilled, (state, action) => {
         state.loading = false;
         // Update the product in the list if it exists
         const index = state.products.findIndex(p => p.id === action.payload.data?.id);
         if (index !== -1) {
           state.products[index] = action.payload.data;
         }
         // Update the current product if it's the same one
         if (state.product && state.product.id === action.payload.data?.id) {
           state.product = action.payload.data;
         }
         state.error = null;
       })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update product';
      });

    // deleteProduct
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted product from the list
        state.products = state.products.filter(p => p.id !== action.payload);
        // Clear the current product if it was the deleted one
        if (state.product && state.product.id === action.payload) {
          state.product = null;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete product';
      });

    // changeProductStatus
    builder
      .addCase(changeProductStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
             .addCase(changeProductStatus.fulfilled, (state, action) => {
         state.loading = false;
         // Update the product status in the list
         const index = state.products.findIndex(p => p.id === action.payload.data?.id);
         if (index !== -1) {
           state.products[index].isActive = action.payload.data.isActive;
         }
         // Update the current product if it's the same one
         if (state.product && state.product.id === action.payload.data?.id) {
           state.product.isActive = action.payload.data.isActive;
         }
         state.error = null;
       })
      .addCase(changeProductStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to change product status';
      });

    // createPrice
    builder
      .addCase(createPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrice.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create price';
      });

    // updatePriceStatus
    builder
      .addCase(updatePriceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePriceStatus.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePriceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update price status';
      });

    // setDefaultPrice
    builder
      .addCase(setDefaultPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultPrice.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(setDefaultPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to set default price';
      });

    // getPriceDetail
    builder
      .addCase(getPriceDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPriceDetail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getPriceDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get price detail';
      });
  },
});

// Export actions
export const { clearError, setCurrentPageNumber, setPageSize, clearProduct } = productSlice.actions;

// Export reducer
export default productSlice.reducer; 