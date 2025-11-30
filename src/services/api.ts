import { isClient } from '@/utils/helpers/common';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Get token from localStorage
const getToken = (): string | null => {
  if (isClient) {
    return localStorage.getItem('token');
  }
  return null;
};

// API request helper (axios version)
export const apiRequest = async (endpoint: string, options: any = {}) => {
  const url = `${apiConfig.baseURL}${endpoint}`;
  const token = getToken();

  // Merge headers
  const headers = {
    ...apiConfig.headers,
    ...(options.headers || {}),
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // axios config
  const config = {
    url,
    method: options.method || 'GET',
    headers,
    params: options.params || {},
    data: options.body ? JSON.parse(options.body) : undefined,
    withCredentials: true,
  };

  try {
    const response = await axios(config);

    // HTTP status code kontrolü
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw {
        status: response.status,
        data: response.data,
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error: any) {
    if (error.response) {
      // API'den gelen hata response'unu fırlat
      throw {
        status: error.response.status,
        data: error.response.data,
        message:
          error.response.data?.message ||
          `HTTP ${error.response.status}: ${error.response.statusText}`,
      };
    }
    console.error('API request failed:', error);
    throw error;
  }
};
