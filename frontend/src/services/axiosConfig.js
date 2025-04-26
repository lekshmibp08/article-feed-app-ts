import axiosInstance from "axios";
import store from '../redux/store';

// Create an Axios instance
const configAxios = axiosInstance.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to attach the token automatically
configAxios.interceptors.request.use(
  (config) => {
    // Check if the request is to Cloudinary
    if (config.url?.startsWith('https://api.cloudinary.com')) {
      return config; // Skip adding Authorization header
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

export default configAxios;
