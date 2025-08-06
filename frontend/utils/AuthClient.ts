import { Configs } from '@/constants/Configs';
import { useAuthStore } from '@/stores/authStore';
import { Platform } from 'react-native';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = Configs.SERVER_URL;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (Platform.OS === 'web') {
      // On web, tokens are in HttpOnly cookies - they'll be sent automatically
      // No need to manually add Authorization header
      
    } else {
      // On mobile, get token from Zustand store and add to Authorization header
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    return headers;
  }

  private async refreshTokenIfNeeded(): Promise<boolean> {
    const { refreshToken, updateTokens, logout } = useAuthStore.getState();
    
    if (Platform.OS === 'web') {
      // On web, refresh tokens via server endpoint with HttpOnly cookies
      try {
        const response = await fetch(`${this.baseURL}/auth/refresh-tokens`, {
          method: 'POST',
          credentials: 'include', // Include HttpOnly cookies
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        const data = await response.json();

        if (data.success || (data.accessToken && data.refreshToken)) {
          // Server set new HttpOnly cookies, no need to update local state with tokens
          // Just confirm authentication status
          updateTokens('', ''); // Empty strings since tokens are in cookies
          return true;
        } else {
          // Refresh failed, logout user
          await logout();
          return false;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        await logout();
        return false;
      }
    } else {
      // On mobile, use traditional refresh token flow
      if (!refreshToken) {
        return false;
      }

      try {
        const response = await fetch(`${this.baseURL}/auth/refresh-tokens`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (data.success && data.accessToken && data.refreshToken) {
          updateTokens(data.accessToken, data.refreshToken);
          return true;
        } else {
          // Refresh failed, logout user
          await logout();
          return false;
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        await logout();
        return false;
      }
    }
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    // Prepare request options with platform-specific settings
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    // Include credentials for web to send HttpOnly cookies
    if (Platform.OS === 'web') {
      requestOptions.credentials = 'include';
    }

    try {
      let response = await fetch(url, requestOptions);

      // If token is expired (401), try to refresh
      if (response.status === 401) {
        const refreshed = await this.refreshTokenIfNeeded();
        
        if (refreshed) {
          // Retry the request with new token
          const newHeaders = await this.getAuthHeaders();
          const retryOptions = {
            ...requestOptions,
            headers: {
              ...newHeaders,
              ...options.headers,
            },
          };
          response = await fetch(url, retryOptions);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Unauthenticated request methods (for login, register, OTP operations)
  private async requestUnauthenticated<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: Platform.OS === 'web' ? 'include' : undefined,
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
          message: data.message,
        };
      }

      return {
        success: data.success !== false, // Default to true if not explicitly false
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }

  async postUnauthenticated<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.requestUnauthenticated<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // External API request (for third-party services like IP detection)
  async getExternal<T = any>(url: string): Promise<T> {
    const response = await fetch(url);
    return response.json();
  }
}

export const apiClient = new ApiClient();