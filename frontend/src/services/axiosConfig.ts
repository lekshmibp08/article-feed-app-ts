import axiosInstance from "axios";
import store from '../redux/store';
import { config } from "../config/config";
import { logout, updateToken } from "../redux/slices/authSlice";

const configAxios = axiosInstance.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});


configAxios.interceptors.request.use(
  (config) => {
    if (config.url?.startsWith('https://api.cloudinary.com')) {
      return config; 
    }
    const token = store.getState().auth.token;
    console.log("Redux Token",token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

configAxios.interceptors.response.use(
  (Response) => Response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest.retry &&
      error.response.data.message === "Token expired, please login again."
    ) {
      originalRequest._retry = true;

      try {
        const res = await configAxios.post(
          "/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.token;
        store.dispatch(updateToken(newToken));

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return configAxios(originalRequest);

      } catch (refreshError) { 
        store.dispatch(logout());
        return Promise.reject(refreshError);        
      }
    }
  }
)

export default configAxios;
