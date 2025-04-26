import configAxios from "../services/axiosConfig";

import { 
    LoginFormData,
    IUser, 
} from "../types/types";

export const loginUser = (payload: LoginFormData) => {
    return configAxios.post("/api/login", payload);
};

export const sendOtp = (values: { email?: string; phone?: string }) => {
  return configAxios.post("/api/send-otp", values);
};

export const verifyAndRegister = (values: Partial<IUser>) => {
  return configAxios.post("/api/verify-and-register", values);
};