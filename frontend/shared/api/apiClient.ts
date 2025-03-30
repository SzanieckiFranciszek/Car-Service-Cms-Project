import axios from 'axios';

export const API_BASE_URL = "http://localhost:8080";

export const ENDPOINTS = {
  opinions: `/api/opinions`,
  posts: `/api/posts`,
  contactInfo: `/api/contact-information`,
  openingHours: `/api/opening-hours`,
  pages: `/api/pages`,
  photos: `/api/photos`,
  sections: `/api/section`,
  auth: `/api/auth`,
  users: `/api/users`,
};

export const useAxiosInterceptorsLogout = (logout: () => void) => {

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        (error.response.status === 403 || error.response.status === 401) &&
        !originalRequest._retry
      ) {
        logout();
      }

      return Promise.reject(error);
    }
  );
};

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  }
);
