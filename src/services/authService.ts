import api from './api';

export interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export const authService = {
  getProfile: async (): Promise<AuthResponse> => {
    try {
      const response = await api.get('/bridge/auth/profile');
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to fetch profile' 
      };
    }
  },
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/bridge/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Network error occurred' 
      };
    }
  },
  
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/bridge/auth/register', { email, password, name });
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Network error occurred' 
      };
    }
  },

  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/bridge/auth/google', { idToken });
      return response.data;
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Google login failed' 
      };
    }
  }
};
