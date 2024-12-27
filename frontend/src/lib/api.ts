import { useAuthStore } from '@/hooks/store/auth.store';
import { clearAuthCookie } from '@/utils/cookie.util';
import axios from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
  response?: {
    data: {
      message: string;
      statusCode?: number;
    };
  };
}

const api = axios.create({
  baseURL: '/api', // Use relative path instead of full URL
  withCredentials: true,
});

const handleUnauthorized = () => {
  const {clearAuth} = useAuthStore.getState()
  clearAuth()
  clearAuthCookie()
  window.location.href = '/login';
}

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized()
    }
    return Promise.reject(error);
  }
);

export default api;