import axiosInstance from "axios";
import store from '../redux/store';
import { config } from "../config/config";

const configAxios = axiosInstance.create({
  baseURL: config.API_BASE_URL,
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

export default configAxios;
