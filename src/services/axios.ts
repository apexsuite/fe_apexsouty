import { isClient } from '@/utils/helpers/common';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// API Error Response Type
interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

// Custom API Error Type
export interface ApiError {
  status?: number;
  message: string;
  data?: unknown;
}

// Axios instance oluştur (tek seferlik config)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - her istekte token ekle
apiClient.interceptors.request.use(
  config => {
    if (isClient) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor - hataları standardize et ve token refresh
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Token refresh logic (401 hatası)
    if (error.response?.status === 401 && !originalRequest._retry && isClient) {
      originalRequest._retry = true;

      try {
        // Refresh token endpoint'ini çağır
        const { data } = await axios.post<{ accessToken: string }>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        localStorage.setItem('token', newToken);

        // Başarısız isteği yeni token ile tekrar dene
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh başarısız, kullanıcıyı logout et
        localStorage.removeItem('token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    // TanStack Query için uygun hata formatı
    const customError: ApiError = {
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message,
      data: error.response?.data,
    };

    return Promise.reject(customError);
  }
);

// Type-safe API request helper
export interface ApiRequestOptions
  extends Omit<AxiosRequestConfig, 'url' | 'baseURL'> {}

export const apiRequest = async <TResponse = unknown>(
  endpoint: string,
  options?: ApiRequestOptions
): Promise<TResponse> => {
  const response = await apiClient.request<TResponse>({
    url: endpoint,
    ...options,
  });
  return response.data;
};

// Convenience methods
export const api = {
  get: <TResponse = unknown>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<TResponse>(endpoint, { ...options, method: 'GET' }),

  post: <TResponse = unknown, TData = unknown>(
    endpoint: string,
    data?: TData,
    options?: ApiRequestOptions
  ) => apiRequest<TResponse>(endpoint, { ...options, method: 'POST', data }),

  put: <TResponse = unknown, TData = unknown>(
    endpoint: string,
    data?: TData,
    options?: ApiRequestOptions
  ) => apiRequest<TResponse>(endpoint, { ...options, method: 'PUT', data }),

  patch: <TResponse = unknown, TData = unknown>(
    endpoint: string,
    data?: TData,
    options?: ApiRequestOptions
  ) => apiRequest<TResponse>(endpoint, { ...options, method: 'PATCH', data }),

  delete: <TResponse = unknown>(
    endpoint: string,
    options?: ApiRequestOptions
  ) => apiRequest<TResponse>(endpoint, { ...options, method: 'DELETE' }),
};
