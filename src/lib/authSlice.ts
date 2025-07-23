import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService, RegisterData, LoginData } from '../services/authService';
import { toast } from 'react-toastify';
import i18n from './i18n';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  avatar?: string;
  status: string;
  permissions: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// localStorage'dan kullanıcı bilgilerini al
const getUserFromStorage = (): User | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// localStorage'dan authentication durumunu al
const getAuthStatusFromStorage = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  return false;
};

const initialState: AuthState = {
  isAuthenticated: getAuthStatusFromStorage(),
  user: getUserFromStorage(),
  loading: false,
  error: null,
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error: any) {
      // API'den gelen hata yapısını kontrol et
      if (error.data && error.data.error) {
        // Validation hatalarını birleştir
        let errorMessage = error.data.error.message;
        if (error.data.error.validations && error.data.error.validations.length > 0) {
          const validationMessages = error.data.error.validations.map((v: any) => v.message).join(', ');
          errorMessage = `${errorMessage}: ${validationMessages}`;
        }
        return { success: false, message: errorMessage };
      }
      return { success: false, message: error.message || 'Registration failed' };
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      return response;
    } catch (error: any) {
      // API'den gelen hata yapısını kontrol et
      if (error.data && error.data.error) {
        // Validation hatalarını birleştir
        let errorMessage = error.data.error.message;
        if (error.data.error.validations && error.data.error.validations.length > 0) {
          const validationMessages = error.data.error.validations.map((v: any) => v.message).join(', ');
          errorMessage = `${errorMessage}: ${validationMessages}`;
        }
        return { success: false, message: errorMessage };
      }
      return { success: false, message: error.message || 'Login failed' };
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await authService.logout();
    } catch (error: any) {
      // API hatası olsa bile localden çıkış yapmaya devam et
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return { success: true, message: 'Logged out successfully' };
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: { email: string; language: string }) => {
    try {
      const response = await authService.forgotPassword(data);
      return response;
    } catch (error: any) {
      // API'den gelen hata yapısını kontrol et
      if (error.data && error.data.error) {
        // Validation hatalarını birleştir
        let errorMessage = error.data.error.message;
        if (error.data.error.validations && error.data.error.validations.length > 0) {
          const validationMessages = error.data.error.validations.map((v: any) => v.message).join(', ');
          errorMessage = `${errorMessage}: ${validationMessages}`;
        }
        return { success: false, message: errorMessage };
      }
      return { success: false, message: error.message || 'Forgot password failed' };
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { id: string; password: string; token: string }) => {
    try {
      const response = await authService.resetPassword(data);
      return response;
    } catch (error: any) {
      // API'den gelen hata yapısını kontrol et
      if (error.data && error.data.error) {
        // Validation hatalarını birleştir
        let errorMessage = error.data.error.message;
        if (error.data.error.validations && error.data.error.validations.length > 0) {
          const validationMessages = error.data.error.validations.map((v: any) => v.message).join(', ');
          errorMessage = `${errorMessage}: ${validationMessages}`;
        }
        return { success: false, message: errorMessage };
      }
      return { success: false, message: error.message || 'Reset password failed' };
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    try {
      const response = await authService.checkAuth();
      return response;
    } catch (error: any) {
      return { success: false, message: error.message || 'Auth check failed' };
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // localStorage'ı güncelle
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && 'user' in action.payload && action.payload.user) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          
          // localStorage'a kaydet
          if (typeof window !== 'undefined') {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            if ('token' in action.payload && action.payload.token) {
              localStorage.setItem('token', action.payload.token);
            }
          }
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        
        // Login başarılı oldu (200 response), isAuthenticated'ı true yap
        state.isAuthenticated = true;
        
        // localStorage'a kaydet
        if (typeof window !== 'undefined') {
          localStorage.setItem('isAuthenticated', 'true');
          // Token varsa kaydet
          if ('data' in action.payload && action.payload.data && action.payload.data.token) {
            localStorage.setItem('token', action.payload.data.token);
          }
        }
        
        // User bilgileri checkAuth'tan gelecek
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        
        // localStorage'dan temizle
        if (typeof window !== 'undefined') {
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
        // i18n ile notification
        toast.success(i18n.t('notification.logoutSuccess', 'Başarıyla çıkış yapıldı!'));
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        // Check endpoint'inden gelen response'u işle
        const responseData = ('data' in action.payload && action.payload.data) ? action.payload.data : action.payload;
        if (responseData && (responseData as any).email) {
          state.isAuthenticated = true;
          const userData = {
            id: (responseData as any).id || '',
            firstname: (responseData as any).firstname || '',
            lastname: (responseData as any).lastname || '',
            email: (responseData as any).email || '',
            role: (responseData as any).userType || '',
            avatar: '',
            status: 'active',
            permissions: (responseData as any).permissions || []
          };
          state.user = userData;
          
          // localStorage'a user bilgilerini kaydet
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError, setLoading, updateUser } = authSlice.actions;
export default authSlice.reducer;
export type { User }; 