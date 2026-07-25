import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// A helper function to inject Clerk auth token dynamically
export const setAuthTokenInterceptor = (getToken) => {
  apiClient.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error fetching auth token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default apiClient;
