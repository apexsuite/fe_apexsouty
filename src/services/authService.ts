import { apiRequest } from './api';

export interface RegisterData {
  email: string;
  firstname: string;
  language: string;
  lastname: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  id: string;
  token: string;
}

export interface ForgotPasswordData {
  email: string;
  language: string;
}

export interface ResetPasswordData {
  id: string;
  password: string;
  token: string;
}

export interface ValidationError {
  key: string;
  message: string;
}

export interface ErrorResponse {
  error: {
    message: string;
    validations: ValidationError[];
  };
}

export interface AuthResponse {
  data?: {
    success?: boolean;
    message?: string;
    user?: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
      role: string;
      avatar?: string;
      status: string;
      permissions: string[];
    };
    token?: string;
    // Check endpoint response fields
    email?: string;
    firstname?: string;
    lastname?: string;
    onBehalfOf?: boolean;
    permissions?: string[];
    roles?: number[];
    userLang?: string;
    userType?: string;
  };
  error?: any;
  success?: boolean;
  message?: string;
  user?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    avatar?: string;
    status: string;
    permissions: string[];
  };
  token?: string;
}

export const authService = {
  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    const result = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result;
  },

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Logout user
  async logout(): Promise<AuthResponse> {
    return apiRequest('/auth/logout', {
      method: 'POST',
      withCredentials: true,
    });
  },

  // Get current user
  async getCurrentUser(): Promise<AuthResponse> {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },

  // Check authentication status
  async checkAuth(): Promise<AuthResponse> {
    return apiRequest('/auth/check', {
      method: 'GET',
      withCredentials: true,
    });
  },

  // Verify email
  async verifyEmail(data: VerifyEmailData): Promise<AuthResponse> {
    return apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Forgot password
  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    const result = await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return result;
  },
}; 