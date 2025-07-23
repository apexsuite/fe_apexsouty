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
  if (typeof window !== 'undefined') {
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
    data: options.body ? JSON.parse(options.body) : undefined,
    withCredentials: true,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // API'den gelen hata response'unu fırlat
      throw {
        status: error.response.status,
        data: error.response.data,
      };
    }
    console.error('API request failed:', error);
    throw error;
  }
}; 