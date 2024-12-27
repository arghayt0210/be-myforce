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

export default api;