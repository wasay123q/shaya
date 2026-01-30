import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (server down, no internet, etc.)
    if (!error.response) {
      console.error('Network error:', error.message);
      alert('Network error. Please check your internet connection and try again.');
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message = error.response?.data?.message || '';
    
    // Handle authentication errors (401)
    if (status === 401) {
      // Check for token-related errors
      const isTokenError = 
        message.toLowerCase().includes('token') || 
        message.toLowerCase().includes('expired') || 
        message.toLowerCase().includes('authentication') ||
        error.response?.data?.success === false;
      
      if (isTokenError) {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('admin');
        
        // Show appropriate message
        if (message.toLowerCase().includes('expired')) {
          alert('Your session has expired. Please login again.');
        } else {
          alert('Authentication failed. Please login again.');
        }
        
        // Redirect to login
        window.location.href = '/login';
      }
    }
    
    // Handle authorization errors (403)
    if (status === 403) {
      alert('Access denied. You do not have permission to perform this action.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
