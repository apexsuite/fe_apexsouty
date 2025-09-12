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
    const isAuth = localStorage.getItem('isAuth');
    return isAuth === 'true';
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
      
      // Sadece başarılı response'ları kabul et
      if (!response) {
        throw new Error('No response received');
      }
      
      // Farklı success formatlarını kontrol et
      const isSuccess = !response.error;
      console.log('AuthSlice Is Success:', isSuccess);
      if (!isSuccess) {
        throw new Error(response.message || response.error || 'Login failed');
      }
      
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
        throw new Error(errorMessage);
      }
      throw new Error(error.message || 'Login failed');
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
      localStorage.removeItem('isAuth');
      localStorage.removeItem('user');
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
  async (data: { id: string; password: string; token: string; email: string }) => {
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
            localStorage.setItem('isAuth', 'true');
            localStorage.setItem('user', JSON.stringify(action.payload.user));
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
        
        console.log('LoginUser fulfilled payload:', action.payload);
        
        // Sadece başarılı response'larda authentication yap
        const isSuccess = action.payload && !action.payload.error;
        
        console.log('LoginUser fulfilled Is Success:', isSuccess);
        
        if (isSuccess) {
          state.isAuthenticated = true;
          console.log('Setting isAuthenticated to true');
          
          // localStorage'a isAuth ve user kaydet
          if (typeof window !== 'undefined') {
            localStorage.setItem('isAuth', 'true');
            
            // User bilgilerini kaydet (eğer varsa)
            if ('data' in action.payload && action.payload.data && action.payload.data.user) {
              localStorage.setItem('user', JSON.stringify(action.payload.data.user));
              state.user = action.payload.data.user;
            } else if ('user' in action.payload && action.payload.user) {
              localStorage.setItem('user', JSON.stringify(action.payload.user));
              state.user = action.payload.user;
            }
          }
        } else {
          // Başarısız response'da authentication yapma
          state.isAuthenticated = false;
          state.error = action.payload?.message || action.payload?.error || 'Login failed';
          console.log('Setting isAuthenticated to false');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false; // Rejected durumunda authentication false
        state.error = action.error.message || 'Login failed';
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
          localStorage.removeItem('isAuth');
          localStorage.removeItem('user');
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
          
          // localStorage'a isAuth ve user bilgilerini kaydet
          if (typeof window !== 'undefined') {
            localStorage.setItem('isAuth', 'true');
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        // localStorage'dan temizle
        if (typeof window !== 'undefined') {
          localStorage.removeItem('isAuth');
          localStorage.removeItem('user');
        }
      });
  },
});

export const { clearError, setLoading, updateUser } = authSlice.actions;
export default authSlice.reducer;
export type { User }; 